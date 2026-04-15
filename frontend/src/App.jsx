import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyBookings from "./pages/MyBookings";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import AdminMovies from "./pages/AdminMovies";
import AdminTheaters from "./pages/AdminTheaters";
import AdminScreens from "./pages/AdminScreens";
import AdminShows from "./pages/AdminShows";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function PublicHome() {
  return (
    <div className="public-home min-h-screen overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute top-[15%] right-[-60px] w-[280px] h-[280px] rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[20%] w-[260px] h-[260px] rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-pink-600 to-rose-500 flex items-center justify-center text-white text-2xl shadow-xl">
              🎬
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Movie<span className="text-red-400">Booking</span>
              </h1>
              <p className="text-slate-300 text-sm">
                Designed by Alikepalli Sivakotireddy
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="home-outline-btn">
              Login
            </Link>
            <Link to="/register" className="home-main-btn">
              Register
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[78vh]">
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-red-200 font-semibold shadow-lg mb-6 backdrop-blur-xl">
              ✨ Alikepalli Sivakotireddy Project
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white mb-6">
              Book Movies with a
              <span className="block gradient-text mt-2">Top Premium UI</span>
            </h2>

            <p className="text-slate-300 text-lg leading-8 max-w-2xl mb-8">
              Browse trending movies, check show timings, choose seats, make payments,
              and manage everything in a stylish admin dashboard with a modern wow look.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/login" className="home-main-btn">
                🚀 Start Booking
              </Link>
              <Link to="/register" className="home-outline-btn">
                ✨ Create Account
              </Link>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl p-5 mb-8 max-w-xl">
              <p className="text-xs uppercase tracking-[0.25em] text-red-300 mb-2">
                Created By
              </p>
              <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-red-200 to-pink-300 bg-clip-text text-transparent">
                Alikepalli Sivakotireddy
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "🎬", title: "Movies" },
                { icon: "🏢", title: "Theaters" },
                { icon: "💺", title: "Seats" },
                { icon: "💳", title: "Payments" },
              ].map((item, index) => (
                <div key={index} className="home-stat-card">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-white font-bold">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 scale-in">
            <div className="home-feature-card tall-card">
              <div className="text-sm text-red-300 font-semibold mb-3">NOW SHOWING</div>
              <h3 className="text-2xl font-black text-white mb-3">Top Trending Movies</h3>
              <p className="text-slate-300 leading-7">
                Stylish movie cards, ratings, filters, cities, language tags, and rich details.
              </p>
            </div>

            <div className="home-feature-card">
              <div className="text-sm text-pink-300 font-semibold mb-3">BOOK FAST</div>
              <h3 className="text-xl font-black text-white mb-3">Smooth Seat Booking</h3>
              <p className="text-slate-300 leading-7">
                Select shows and continue with a premium booking flow.
              </p>
            </div>

            <div className="home-feature-card">
              <div className="text-sm text-violet-300 font-semibold mb-3">ADMIN POWER</div>
              <h3 className="text-xl font-black text-white mb-3">Manage Everything</h3>
              <p className="text-slate-300 leading-7">
                Movies, shows, theaters, screens, bookings, users — all in one place.
              </p>
            </div>

            <div className="home-feature-card tall-card dark-strong">
              <div className="text-sm text-emerald-300 font-semibold mb-3">PREMIUM FLOW</div>
              <h3 className="text-2xl font-black text-white mb-3">Modern Cinematic Feel</h3>
              <p className="text-slate-300 leading-7">
                Gradients, shadows, glass effects, hover animations, and a wow-level design.
              </p>
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-8 flex flex-col gap-3">
          <Link to="/login" className="home-main-btn w-full justify-center">
            Login
          </Link>
          <Link to="/register" className="home-outline-btn w-full justify-center">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

function PaymentCancel() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="premium-page-card text-center fade-in-up">
          <div className="text-7xl mb-5">❌</div>
          <h1 className="text-4xl font-black text-white mb-4">Payment Cancelled</h1>
          <p className="text-slate-300 text-lg">
            Your payment was cancelled. Please try booking again.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute role="user">
              <Movies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies/:id"
          element={
            <ProtectedRoute role="user">
              <MovieDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shows/:id/seats"
          element={
            <ProtectedRoute role="user">
              <SeatSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute role="user">
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-cancel"
          element={
            <ProtectedRoute role="user">
              <PaymentCancel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="user">
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute role="user">
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute role="admin">
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute role="admin">
              <AdminMovies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/theaters"
          element={
            <ProtectedRoute role="admin">
              <AdminTheaters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/screens"
          element={
            <ProtectedRoute role="admin">
              <AdminScreens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shows"
          element={
            <ProtectedRoute role="admin">
              <AdminShows />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;