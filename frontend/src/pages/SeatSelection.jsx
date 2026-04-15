import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const rows = ["A", "B", "C", "D", "E"];
  const seatPrice = 199;

  const fetchBooked = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/bookings/show/${id}/booked-seats`);
      setBookedSeats(res.data.map((s) => s.seat_number));
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load booked seats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooked();
  }, []);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    try {
      if (selectedSeats.length === 0) return;

      setSubmitting(true);

      const booking = await API.post("/bookings/", {
        show_id: Number(id),
        selected_seats: selectedSeats,
      });

      const res = await API.post(
        `/payments/create-checkout-session/${booking.data.id}`
      );

      window.location.href = res.data.checkout_url;
    } catch (error) {
      alert(error?.response?.data?.detail || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = selectedSeats.length * seatPrice;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-[32px] mb-8 border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.22),transparent_22%),linear-gradient(135deg,#111827_0%,#7f1d1d_45%,#be185d_100%)]" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full" />
          <div className="relative p-8 md:p-10">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold mb-4 backdrop-blur-xl">
              🎟 Premium Seat Booking
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              Choose Your Perfect Seats
            </h1>
            <p className="text-white/80 max-w-2xl text-lg leading-8">
              Experience a real cinema-style layout with selected, booked, and available
              seats in a premium booking interface.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] p-6 md:p-8">
            <div className="mb-10">
              <div className="max-w-4xl mx-auto">
                <div className="h-5 rounded-t-full bg-gradient-to-r from-slate-500 via-white to-slate-500 shadow-[0_0_60px_rgba(255,255,255,0.18)]" />
                <div className="text-center text-xs md:text-sm font-black tracking-[0.5em] text-slate-300 mt-4">
                  CINEMA SCREEN
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
              <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/5 border border-white/10">
                <div className="w-4 h-4 rounded-md bg-slate-200" />
                <span className="text-sm text-slate-200 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/5 border border-white/10">
                <div className="w-4 h-4 rounded-md bg-gradient-to-r from-red-600 to-pink-600" />
                <span className="text-sm text-slate-200 font-medium">Selected</span>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/5 border border-white/10">
                <div className="w-4 h-4 rounded-md bg-black border border-white/10" />
                <span className="text-sm text-slate-200 font-medium">Booked</span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center justify-center gap-3"
                  >
                    <div className="w-8 h-8 rounded bg-slate-700/50" />
                    <div className="flex gap-3 flex-wrap justify-center">
                      {[...Array(8)].map((_, seatIndex) => (
                        <div
                          key={seatIndex}
                          className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-slate-700/40"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {rows.map((row) => (
                  <div
                    key={row}
                    className="flex items-center justify-center gap-2 md:gap-3"
                  >
                    <div className="w-8 text-sm font-black text-slate-400">
                      {row}
                    </div>

                    <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const seat = `${row}${i + 1}`;
                        const isBooked = bookedSeats.includes(seat);
                        const isSelected = selectedSeats.includes(seat);

                        return (
                          <button
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            disabled={isBooked}
                            className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl font-black text-sm transition-all duration-300 ${
                              isBooked
                                ? "bg-black text-slate-500 cursor-not-allowed border border-white/10"
                                : isSelected
                                ? "bg-gradient-to-r from-red-600 to-pink-600 text-white scale-105 shadow-[0_12px_30px_rgba(239,68,68,0.35)]"
                                : "bg-white text-slate-900 hover:border-red-500 hover:text-red-600 hover:-translate-y-1 border border-slate-200 shadow-sm"
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm leading-7">
                Tip: Black seats are already booked. Gradient seats are your selected seats.
                White seats are available to choose.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] p-6 h-fit sticky top-24">
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2">Booking Summary</p>
              <h2 className="text-3xl font-black text-white">Your Seats</h2>
            </div>

            <div className="rounded-[24px] p-5 mb-5 border border-red-400/20 bg-gradient-to-r from-red-500/10 to-pink-500/10">
              <p className="text-sm text-slate-300 mb-2">Selected Seats</p>
              <p className="font-bold text-white break-words text-lg">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
              </p>
            </div>

            <div className="rounded-[24px] p-5 mb-6 border border-white/10 bg-slate-900/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300">Price / Seat</span>
                <span className="font-bold text-white">₹{seatPrice}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300">Total Seats</span>
                <span className="font-bold text-white">{selectedSeats.length}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300">Total Amount</span>
                <span className="font-black text-2xl text-red-400">₹{totalAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Status</span>
                <span className="font-bold text-pink-400">
                  {selectedSeats.length > 0 ? "Ready to Pay" : "Select seats"}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || submitting}
              className={`w-full py-3.5 rounded-2xl font-bold text-white transition shadow-lg ${
                selectedSeats.length === 0 || submitting
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 via-pink-600 to-rose-500 hover:opacity-95"
              }`}
            >
              {submitting
                ? "Redirecting to Payment..."
                : selectedSeats.length === 0
                ? "Select Seats First"
                : "Proceed to Payment"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 py-3.5 rounded-2xl font-bold bg-white/10 border border-white/10 text-white hover:bg-white/15 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;