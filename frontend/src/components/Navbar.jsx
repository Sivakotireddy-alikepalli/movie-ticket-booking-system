import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchUnreadCount = async () => {
    try {
      if (user?.role !== "user") return;
      const response = await API.get("/notifications/my/unread-count");
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.log("Unread notification count failed");
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [user]);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative px-4 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
      isActive(path)
        ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg"
        : "text-slate-200 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to={user?.role === "admin" ? "/admin" : "/home"}
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-pink-600 to-rose-500 text-white flex items-center justify-center text-xl shadow-xl group-hover:scale-105 transition">
                🎬
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Movie<span className="text-red-400">Booking</span>
                </h1>
                <p className="text-xs text-slate-400 -mt-1">
                  By Alikepalli Sivakotireddy
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "user" && (
              <>
                <Link to="/home" className={navLinkClass("/home")}>
                  Movies
                </Link>

                <Link to="/my-bookings" className={navLinkClass("/my-bookings")}>
                  My Bookings
                </Link>

                <Link
                  to="/notifications"
                  className={`${navLinkClass("/notifications")} pr-8`}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-1 min-w-[22px] h-[22px] px-1 bg-red-600 text-white text-[11px] rounded-full flex items-center justify-center font-bold shadow-md border-2 border-slate-950">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Dashboard
                </Link>
                <Link to="/admin/movies" className={navLinkClass("/admin/movies")}>
                  Movies
                </Link>
                <Link to="/admin/theaters" className={navLinkClass("/admin/theaters")}>
                  Theaters
                </Link>
                <Link to="/admin/screens" className={navLinkClass("/admin/screens")}>
                  Screens
                </Link>
                <Link to="/admin/shows" className={navLinkClass("/admin/shows")}>
                  Shows
                </Link>
                <Link to="/admin/bookings" className={navLinkClass("/admin/bookings")}>
                  Bookings
                </Link>
                <Link to="/admin/users" className={navLinkClass("/admin/users")}>
                  Users
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2.5 rounded-2xl bg-white/8 border border-white/10 text-slate-100 font-semibold shadow-sm backdrop-blur-xl">
              {user?.name || "User"}
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:opacity-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-[1px]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;