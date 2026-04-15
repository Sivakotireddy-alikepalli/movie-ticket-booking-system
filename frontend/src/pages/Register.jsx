import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await register(form);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.18),transparent_20%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_20%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 blur-3xl rounded-full" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]">

          <div className="hidden lg:block relative min-h-[780px]">
            <img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80"
              alt="Movie theater"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-between p-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white font-semibold backdrop-blur-xl mb-6">
                  ✨ Create Your Movie Account
                </div>

                <h1 className="text-5xl font-black text-white leading-tight mb-5">
                  Join the
                  <span className="block bg-gradient-to-r from-red-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Cinematic Experience
                  </span>
                </h1>

                <p className="text-slate-200 text-lg leading-8 max-w-xl">
                  Register now to browse movies, pick show timings, select seats,
                  get notifications, and enjoy a wow-level booking interface.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl p-5">
                  <h3 className="text-white font-black text-xl mb-2">All-in-One Platform</h3>
                  <p className="text-slate-300 text-sm leading-6">
                    Movies, theaters, screens, shows, seats, payments, and bookings in one place.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-black/25 border border-white/10 p-4 text-center">
                    <div className="text-2xl mb-2">🎬</div>
                    <p className="text-white text-sm font-semibold">Movies</p>
                  </div>
                  <div className="rounded-2xl bg-black/25 border border-white/10 p-4 text-center">
                    <div className="text-2xl mb-2">💺</div>
                    <p className="text-white text-sm font-semibold">Seats</p>
                  </div>
                  <div className="rounded-2xl bg-black/25 border border-white/10 p-4 text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <p className="text-white text-sm font-semibold">Payments</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-red-200 mb-2">
                    Created By
                  </p>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-white via-red-200 to-pink-300 bg-clip-text text-transparent">
                    Alikepalli Sivakotireddy
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-[0.2em] text-red-300 mb-4">
                  ALIKEPALLI SIVAKOTIREDDY
                </div>
                <div className="text-6xl mb-4">🍿</div>
                <h2 className="text-4xl font-black text-white mb-2">Register</h2>
                <p className="text-slate-300">
                  Create your account and start booking your favorite movies
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Role
                  </label>
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-rose-500 py-3.5 text-white font-bold hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {loading ? "Registering..." : "Create Account"}
                </button>
              </div>

              <p className="text-center text-sm text-slate-300 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-red-400 hover:underline">
                  Login
                </Link>
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 font-semibold text-slate-200">
                  Latest Movies
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 font-semibold text-slate-200">
                  Seat Booking
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 font-semibold text-slate-200">
                  Stripe Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;