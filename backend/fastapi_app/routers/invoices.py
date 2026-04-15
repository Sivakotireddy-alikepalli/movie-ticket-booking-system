import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models import Booking, Show, Movie, Theater, Screen, User
from routers.users import get_current_user
from invoice_generator import generate_invoice_pdf

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.get("/{booking_id}")
def download_invoice(
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
            detail="You are not allowed to access this invoice"
        )

    if booking.payment_status != "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invoice is available only after successful payment"
        )

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
            detail="Related invoice data not found"
        )

    file_path = generate_invoice_pdf(booking, user, movie, theater, screen, show)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invoice file was not generated"
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=f"invoice_booking_{booking.id}.pdf"
    )