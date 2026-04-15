from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Booking, BookedSeat, Show, Screen, User, Notification
from schemas import BookingCreate, BookingResponse, BookedSeatResponse, BookingStatusUpdate
from routers.users import get_current_user, admin_only

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    show = db.query(Show).filter(Show.id == booking.show_id).first()
    if not show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Show not found"
        )

    screen = db.query(Screen).filter(Screen.id == show.screen_id).first()
    if not screen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screen not found"
        )

    selected_seats_clean = [seat.strip().upper() for seat in booking.selected_seats if seat.strip()]

    if not selected_seats_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please select at least one seat"
        )

    if len(selected_seats_clean) != len(set(selected_seats_clean)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate seats selected in the same request"
        )

    if len(selected_seats_clean) > screen.total_seats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected seats exceed screen capacity"
        )

    already_booked = db.query(BookedSeat).filter(
        BookedSeat.show_id == booking.show_id,
        BookedSeat.seat_number.in_(selected_seats_clean)
    ).all()

    if already_booked:
        booked_numbers = [seat.seat_number for seat in already_booked]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"These seats are already booked: {', '.join(booked_numbers)}"
        )

    total_price = show.price * len(selected_seats_clean)

    new_booking = Booking(
        user_id=current_user.id,
        show_id=booking.show_id,
        selected_seats=", ".join(selected_seats_clean),
        total_price=total_price,
        status="pending",
        payment_status="unpaid"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    user_notification = Notification(
        user_id=current_user.id,
        title="Booking Created",
        message=f"Your booking #{new_booking.id} has been created and is waiting for payment.",
        type="booking",
        is_read="false"
    )
    db.add(user_notification)
    db.commit()

    return new_booking


@router.get("/my", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.id.desc())
        .all()
    )
    return bookings


@router.get("/", response_model=list[BookingResponse])
def get_all_bookings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    bookings = db.query(Booking).order_by(Booking.id.desc()).all()
    return bookings


@router.get("/show/{show_id}/booked-seats", response_model=list[BookedSeatResponse])
def get_booked_seats_by_show(show_id: int, db: Session = Depends(get_db)):
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Show not found"
        )

    booked_seats = (
        db.query(BookedSeat)
        .filter(BookedSeat.show_id == show_id)
        .order_by(BookedSeat.id.asc())
        .all()
    )
    return booked_seats


@router.put("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_my_booking(
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
            detail="You are not allowed to cancel this booking"
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled"
        )

    booking.status = "cancelled"
    booking.payment_status = "cancelled"

    db.query(BookedSeat).filter(BookedSeat.booking_id == booking.id).delete()

    cancel_notification = Notification(
        user_id=booking.user_id,
        title="Booking Cancelled",
        message=f"Your booking #{booking.id} has been cancelled successfully.",
        type="booking",
        is_read="false"
    )
    db.add(cancel_notification)

    admin_users = db.query(User).filter(User.role == "admin").all()
    for admin in admin_users:
        admin_notification = Notification(
            user_id=admin.id,
            title="Booking Cancelled",
            message=f"Booking #{booking.id} was cancelled by user #{booking.user_id}.",
            type="booking",
            is_read="false"
        )
        db.add(admin_notification)

    db.commit()
    db.refresh(booking)

    return booking


@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    status_data: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    allowed_statuses = ["pending", "booked", "cancelled", "completed"]

    new_status = status_data.status.strip().lower()
    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be one of: pending, booked, cancelled, completed"
        )

    if booking.status != "cancelled" and new_status == "cancelled":
        db.query(BookedSeat).filter(BookedSeat.booking_id == booking.id).delete()
        booking.payment_status = "cancelled"

    booking.status = new_status

    user_notification = Notification(
        user_id=booking.user_id,
        title="Booking Status Updated",
        message=f"Your booking #{booking.id} status was updated to '{new_status}'.",
        type="booking",
        is_read="false"
    )
    db.add(user_notification)

    db.commit()
    db.refresh(booking)

    return booking