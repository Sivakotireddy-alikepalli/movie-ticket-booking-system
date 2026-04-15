import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("booking_id");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Confirming your payment...");

  const confirmPayment = async () => {
    try {
      if (!bookingId) {
        setMessage("Booking ID not found in URL");
        setLoading(false);
        return;
      }

      await API.post(`/payments/success/${bookingId}`);
      setMessage("Payment successful. Your booking is confirmed.");
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Payment confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    confirmPayment();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <div className="relative bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_20%),linear-gradient(135deg,#064e3b_0%,#065f46_45%,#111827_100%)] text-white p-10 text-center">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full" />
            <div className="relative">
              <div className="text-7xl mb-4">{loading ? "⏳" : "✅"}</div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                {loading ? "Confirming Payment" : "Payment Success"}
              </h1>
              <p className="text-white/90 text-lg max-w-2xl mx-auto leading-8">
                {loading
                  ? "We are verifying your booking and payment details."
                  : "Your movie ticket has been booked successfully."}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white/5 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto text-center">
              <div className="rounded-[24px] bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/20 p-6 mb-8">
                <p className="text-slate-100 text-lg leading-relaxed">{message}</p>

                {bookingId && (
                  <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 font-semibold shadow-sm">
                    Booking ID: {bookingId}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="w-12 h-12 border-4 border-emerald-200/20 border-t-emerald-400 rounded-full animate-spin"></div>
                  <p className="text-lg font-semibold text-slate-200">Please wait...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="text-2xl mb-2">🎟️</div>
                      <p className="font-bold text-white">Booking Confirmed</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="text-2xl mb-2">💳</div>
                      <p className="font-bold text-white">Payment Completed</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="text-2xl mb-2">🧾</div>
                      <p className="font-bold text-white">Invoice Ready</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate("/my-bookings")}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-95 text-white px-7 py-3.5 rounded-2xl font-semibold shadow-lg transition"
                    >
                      Go to My Bookings
                    </button>

                    <button
                      onClick={() => navigate("/home")}
                      className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-7 py-3.5 rounded-2xl font-semibold shadow-lg transition"
                    >
                      Back to Movies
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;