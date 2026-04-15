import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def generate_invoice_pdf(booking, user, movie, theater, screen, show):
    invoices_dir = "invoices"
    os.makedirs(invoices_dir, exist_ok=True)

    file_path = os.path.join(invoices_dir, f"invoice_booking_{booking.id}.pdf")

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    y = height - 50

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, y, "Movie Ticket Booking Invoice")

    y -= 40
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Invoice File: invoice_booking_{booking.id}.pdf")

    y -= 30
    c.drawString(50, y, f"Booking ID: {booking.id}")

    y -= 25
    c.drawString(50, y, f"Customer Name: {user.name}")

    y -= 25
    c.drawString(50, y, f"Customer Email: {user.email}")

    y -= 25
    c.drawString(50, y, f"Movie: {movie.title}")

    y -= 25
    c.drawString(50, y, f"Theater: {theater.name}")

    y -= 25
    c.drawString(50, y, f"Screen: {screen.name}")

    y -= 25
    c.drawString(50, y, f"Show Date: {show.show_date}")

    y -= 25
    c.drawString(50, y, f"Show Time: {show.show_time}")

    y -= 25
    c.drawString(50, y, f"Selected Seats: {booking.selected_seats}")

    y -= 25
    c.drawString(50, y, f"Total Price: Rs. {booking.total_price}")

    y -= 25
    c.drawString(50, y, f"Booking Status: {booking.status}")

    y -= 25
    c.drawString(50, y, f"Payment Status: {booking.payment_status}")

    y -= 40
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Thank you for booking with us!")

    c.save()

    return file_path