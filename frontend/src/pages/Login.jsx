import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await login(form);

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert(error?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.18),transparent_20%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.16),transparent_20%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]">

          <div className="hidden lg:block relative min-h-[760px]">
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80"
              alt="Cinema"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-between p-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-400/20 text-red-100 font-semibold backdrop-blur-xl mb-6">
                  🎬 Premium Cinema Experience
                </div>

                <h1 className="text-5xl font-black text-white leading-tight mb-5">
                  Welcome Back to
                  <span className="block bg-gradient-to-r from-red-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    MovieBooking
                  </span>
                </h1>

                <p className="text-slate-200 text-lg leading-8 max-w-xl">
                  Login and continue your movie journey with trending films, stylish booking flow,
                  secure payment, and premium user experience.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl p-5">
                    <div className="text-3xl mb-2">🍿</div>
                    <h3 className="text-white font-black text-xl mb-2">Trending Movies</h3>
                    <p className="text-slate-300 text-sm leading-6">
                      Explore top movies with poster-first premium UI.
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl p-5">
                    <div className="text-3xl mb-2">💺</div>
                    <h3 className="text-white font-black text-xl mb-2">Smart Booking</h3>
                    <p className="text-slate-300 text-sm leading-6">
                      Smooth seat selection and modern booking flow.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-red-200 mb-2">
                    Designed By
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
                <div className="text-6xl mb-4">🎟️</div>
                <h2 className="text-4xl font-black text-white mb-2">Login</h2>
                <p className="text-slate-300">
                  Enter your details to continue booking movies
                </p>
              </div>

              <div className="space-y-5">
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

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-rose-500 py-3.5 text-white font-bold hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {loading ? "Logging in..." : "Login Now"}
                </button>
              </div>

              <p className="text-center text-sm text-slate-300 mt-6">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-bold text-red-400 hover:underline">
                  Register
                </Link>
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 font-semibold text-slate-200">
                  Fast Booking
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 font-semibold text-slate-200">
                  Secure Payment
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 font-semibold text-slate-200">
                  Premium UI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;