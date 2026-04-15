from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, time, datetime


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    role: Optional[str] = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    name: str
    email: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class MovieCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str
    language: str
    duration: int
    category: str
    city: str
    poster_url: Optional[str] = None
    release_date: Optional[str] = None
    rating: Optional[str] = None
    popularity: Optional[int] = 0


class MovieUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    duration: Optional[int] = None
    category: Optional[str] = None
    city: Optional[str] = None
    poster_url: Optional[str] = None
    release_date: Optional[str] = None
    rating: Optional[str] = None
    popularity: Optional[int] = None


class MovieResponse(BaseModel):
    id: int
    title: str
    description: str
    language: str
    duration: int
    category: str
    city: str
    poster_url: Optional[str] = None
    release_date: Optional[str] = None
    rating: Optional[str] = None
    popularity: int

    class Config:
        from_attributes = True


class TheaterCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    city: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=255)


class TheaterResponse(BaseModel):
    id: int
    name: str
    city: str
    location: str

    class Config:
        from_attributes = True


class ScreenCreate(BaseModel):
    theater_id: int
    name: str = Field(..., min_length=1, max_length=100)
    total_seats: int = Field(..., gt=0)


class ScreenResponse(BaseModel):
    id: int
    theater_id: int
    name: str
    total_seats: int

    class Config:
        from_attributes = True


class ShowCreate(BaseModel):
    movie_id: int
    theater_id: int
    screen_id: int
    show_date: date
    show_time: time
    price: int = Field(..., gt=0)


class ShowResponse(BaseModel):
    id: int
    movie_id: int
    theater_id: int
    screen_id: int
    show_date: date
    show_time: time
    price: int

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    show_id: int
    selected_seats: List[str] = Field(..., min_length=1)


class BookingStatusUpdate(BaseModel):
    status: str = Field(..., min_length=3, max_length=30)


class BookingResponse(BaseModel):
    id: int
    user_id: int
    show_id: int
    selected_seats: str
    total_price: int
    status: str
    payment_status: str
    stripe_session_id: Optional[str] = None
    booked_at: datetime

    class Config:
        from_attributes = True


class BookedSeatResponse(BaseModel):
    id: int
    booking_id: int
    show_id: int
    seat_number: str

    class Config:
        from_attributes = True


class AdminDashboardStats(BaseModel):
    total_users: int
    total_movies: int
    total_theaters: int
    total_screens: int
    total_shows: int
    total_bookings: int
    total_revenue: int


class RecentBookingResponse(BaseModel):
    id: int
    user_id: int
    show_id: int
    selected_seats: str
    total_price: int
    status: str
    payment_status: str
    stripe_session_id: Optional[str] = None
    booked_at: datetime

    class Config:
        from_attributes = True


class PaymentSessionResponse(BaseModel):
    booking_id: int
    checkout_url: str
    stripe_session_id: str


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationCountResponse(BaseModel):
    unread_count: int