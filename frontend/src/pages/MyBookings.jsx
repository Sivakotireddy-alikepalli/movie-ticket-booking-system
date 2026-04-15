import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bookings/my");
      setBookings(response.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const response = await API.get(`/invoices/${bookingId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_booking_${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error?.response?.data?.detail || "Invoice download failed");
    }
  };

  const badgeClass = (value) => {
    const text = String(value || "").toLowerCase();

    if (text.includes("paid") || text.includes("success") || text.includes("confirmed")) {
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20";
    }

    if (text.includes("pending")) {
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-400/20";
    }

    if (text.includes("cancel") || text.includes("failed")) {
      return "bg-red-500/15 text-red-300 border border-red-400/20";
    }

    return "bg-white/10 text-slate-200 border border-white/10";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-[32px] overflow-hidden border border-white/10 mb-8">
          <div className="relative p-8 md:p-10 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.2),transparent_20%),linear-gradient(135deg,#020617_0%,#111827_45%,#7f1d1d_100%)]">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm font-semibold mb-4 border border-white/10">
              Booking History
            </p>
            <h1 className="text-3xl md:text-5xl font-black mb-2">My Bookings</h1>
            <p className="text-white/80 text-lg max-w-2xl leading-8">
              Check your tickets, payment status, booked seats, and download invoices
              in one premium dashboard.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 animate-pulse"
              >
                <div className="h-6 w-48 bg-slate-700/50 rounded mb-5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="space-y-3">
                    <div className="h-4 w-40 bg-slate-700/40 rounded" />
                    <div className="h-4 w-52 bg-slate-700/40 rounded" />
                    <div className="h-4 w-44 bg-slate-700/40 rounded" />
                    <div className="h-4 w-36 bg-slate-700/40 rounded" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-40 bg-slate-700/40 rounded" />
                    <div className="h-4 w-52 bg-slate-700/40 rounded" />
                    <div className="h-4 w-44 bg-slate-700/40 rounded" />
                    <div className="h-4 w-36 bg-slate-700/40 rounded" />
                  </div>
                </div>
                <div className="h-10 w-40 bg-slate-700/50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <div className="text-6xl mb-4">🎟️</div>
            <h2 className="text-2xl font-black text-white mb-2">No bookings found</h2>
            <p className="text-slate-300">
              Your movie tickets will appear here after booking.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Booking ID</p>
                    <h2 className="text-3xl font-black text-white">#{booking.id}</h2>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${badgeClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${badgeClass(
                        booking.payment_status
                      )}`}
                    >
                      {booking.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="rounded-[22px] p-5 bg-slate-900/60 border border-white/10 space-y-3">
                    <p className="text-slate-200">
                      <span className="font-semibold text-white">Show ID:</span> {booking.show_id}
                    </p>
                    <p className="text-slate-200">
                      <span className="font-semibold text-white">Seats:</span>{" "}
                      {Array.isArray(booking.selected_seats)
                        ? booking.selected_seats.join(", ")
                        : booking.selected_seats}
                    </p>
                    <p className="text-slate-200">
                      <span className="font-semibold text-white">Total Price:</span> ₹
                      {booking.total_price}
                    </p>
                  </div>

                  <div className="rounded-[22px] p-5 bg-slate-900/60 border border-white/10 space-y-3">
                    <p className="text-slate-200 break-all">
                      <span className="font-semibold text-white">Stripe Session:</span>{" "}
                      {booking.stripe_session_id || "N/A"}
                    </p>
                    <p className="text-slate-200">
                      <span className="font-semibold text-white">Booked At:</span>{" "}
                      {new Date(booking.booked_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleDownloadInvoice(booking.id)}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-95 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;