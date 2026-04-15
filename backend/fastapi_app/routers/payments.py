from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import stripe

from database import get_db
from models import Booking, BookedSeat, Show, Movie, User, Notification, Theater, Screen
from schemas import PaymentSessionResponse, BookingResponse
from routers.users import get_current_user

from payment import create_stripe_checkout_session
from invoice_generator import generate_invoice_pdf

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create-checkout-session/{booking_id}", response_model=PaymentSessionResponse)
def create_checkout_session(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to pay for this booking"
        )

    if booking.payment_status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment is already completed for this booking"
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This booking is cancelled"
        )

    show = db.query(Show).filter(Show.id == booking.show_id).first()
    if not show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Show not found"
        )

    movie = db.query(Movie).filter(Movie.id == show.movie_id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )

    try:
        session = create_stripe_checkout_session(
            booking_id=booking.id,
            movie_name=movie.title,
            seats=booking.selected_seats,
            amount=booking.total_price
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected payment error: {str(e)}"
        )

    booking.stripe_session_id = session.id
    db.commit()
    db.refresh(booking)

    return {
        "booking_id": booking.id,
        "checkout_url": session.url,
        "stripe_session_id": session.id
    }


@router.post("/success/{booking_id}", response_model=BookingResponse)
def payment_success(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this booking"
        )

    if booking.payment_status == "paid":
        return booking

    show = db.query(Show).filter(Show.id == booking.show_id).first()
    if not show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Show not found"
        )

    movie = db.query(Movie).filter(Movie.id == show.movie_id).first()
    theater = db.query(Theater).filter(Theater.id == show.theater_id).first()
    screen = db.query(Screen).filter(Screen.id == show.screen_id).first()
    user = db.query(User).filter(User.id == booking.user_id).first()

    if not movie or not theater or not screen or not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Related booking data not found"
        )

    selected_seats_clean = [seat.strip().upper() for seat in booking.selected_seats.split(",") if seat.strip()]

    already_booked = db.query(BookedSeat).filter(
        BookedSeat.show_id == booking.show_id,
        BookedSeat.seat_number.in_(selected_seats_clean)
    ).all()

    if already_booked:
        booked_numbers = [seat.seat_number for seat in already_booked]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"These seats became unavailable: {', '.join(booked_numbers)}"
        )

    booking.status = "booked"
    booking.payment_status = "paid"
    db.commit()
    db.refresh(booking)

    for seat in selected_seats_clean:
        booked_seat = BookedSeat(
            booking_id=booking.id,
            show_id=booking.show_id,
            seat_number=seat
        )
        db.add(booked_seat)

    db.commit()

    generate_invoice_pdf(booking, user, movie, theater, screen, show)

    user_notification = Notification(
        user_id=booking.user_id,
        title="Payment Successful",
        message=f"Your booking #{booking.id} has been confirmed successfully. Invoice is ready for download.",
        type="payment",
        is_read=False
    )
    db.add(user_notification)

    admin_users = db.query(User).filter(User.role == "admin").all()
    for admin in admin_users:
        admin_notification = Notification(
            user_id=admin.id,
            title="New Booking Received",
            message=f"Booking #{booking.id} has been paid successfully by user #{booking.user_id}.",
            type="booking",
            is_read=False
        )
        db.add(admin_notification)

    db.commit()
    db.refresh(booking)

    return booking


@router.post("/cancel/{booking_id}", response_model=BookingResponse)
def payment_cancel(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to cancel this payment"
        )

    booking.status = "cancelled"
    booking.payment_status = "failed"
    db.commit()
    db.refresh(booking)

    return booking