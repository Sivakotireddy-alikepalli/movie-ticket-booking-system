from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import users, movies, theaters, shows, bookings, admin, payments, notifications, invoices

app = FastAPI(title="Movie Ticket Booking System API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(movies.router)
app.include_router(theaters.router)
app.include_router(shows.router)
app.include_router(bookings.router)
app.include_router(admin.router)
app.include_router(payments.router)
app.include_router(notifications.router)
app.include_router(invoices.router)


@app.get("/")
def root():
    return {"message": "Movie Ticket Booking System Backend Running"}