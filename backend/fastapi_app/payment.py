import os
import stripe
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_SUCCESS_URL = os.getenv("FRONTEND_SUCCESS_URL", "http://localhost:5173/payment-success")
FRONTEND_CANCEL_URL = os.getenv("FRONTEND_CANCEL_URL", "http://localhost:5173/payment-cancel")


def create_stripe_checkout_session(booking_id: int, movie_name: str, seats: str, amount: int):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": f"{movie_name} Ticket Booking",
                        "description": f"Seats: {seats}"
                    },
                    "unit_amount": amount * 100,
                },
                "quantity": 1,
            }
        ],
        mode="payment",
        success_url=f"{FRONTEND_SUCCESS_URL}?booking_id={booking_id}",
        cancel_url=f"{FRONTEND_CANCEL_URL}?booking_id={booking_id}",
    )
    return session