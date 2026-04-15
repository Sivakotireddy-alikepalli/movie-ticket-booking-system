from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import User, Movie, Theater, Screen, Show, Booking
from schemas import AdminDashboardStats, UserResponse, RecentBookingResponse
from routers.users import admin_only

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/dashboard", response_model=AdminDashboardStats)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    total_users = db.query(User).count()
    total_movies = db.query(Movie).count()
    total_theaters = db.query(Theater).count()
    total_screens = db.query(Screen).count()
    total_shows = db.query(Show).count()
    total_bookings = db.query(Booking).count()

    total_revenue = db.query(func.sum(Booking.total_price)).filter(Booking.status != "cancelled").scalar()
    if total_revenue is None:
        total_revenue = 0

    return {
        "total_users": total_users,
        "total_movies": total_movies,
        "total_theaters": total_theaters,
        "total_screens": total_screens,
        "total_shows": total_shows,
        "total_bookings": total_bookings,
        "total_revenue": total_revenue
    }


@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    users = db.query(User).order_by(User.id.desc()).all()
    return users


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user cannot be deleted"
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}


@router.get("/bookings", response_model=list[RecentBookingResponse])
def get_recent_bookings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    bookings = db.query(Booking).order_by(Booking.id.desc()).limit(10).all()
    return bookings


@router.get("/all-bookings", response_model=list[RecentBookingResponse])
def get_all_bookings_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    bookings = db.query(Booking).order_by(Booking.id.desc()).all()
    return bookings