import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminShows() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);

  const [form, setForm] = useState({
    movie_id: "",
    theater_id: "",
    screen_id: "",
    show_date: "",
    show_time: "",
    price: "",
  });

  const fetchData = async () => {
    try {
      setMovies((await API.get("/movies/")).data);
      setTheaters((await API.get("/theaters/")).data);
      setScreens((await API.get("/screens/")).data);
      setShows((await API.get("/shows/")).data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load shows");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      await API.post("/shows/", {
        ...form,
        price: Number(form.price),
      });

      setForm({
        movie_id: "",
        theater_id: "",
        screen_id: "",
        show_date: "",
        show_time: "",
        price: "",
      });

      fetchData();
      alert("Show created successfully");
    } catch (error) {
      alert(error?.response?.data?.detail || "Error creating show");
    }
  };

  const getMovieTitle = (movieId) =>
    movies.find((m) => String(m.id) === String(movieId))?.title || `Movie ${movieId}`;

  const getTheaterName = (theaterId) =>
    theaters.find((t) => String(t.id) === String(theaterId))?.name || `Theater ${theaterId}`;

  const getScreenName = (screenId) =>
    screens.find((s) => String(s.id) === String(screenId))?.name || `Screen ${screenId}`;

  const filteredScreens = form.theater_id
    ? screens.filter((screen) => String(screen.theater_id) === String(form.theater_id))
    : screens;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-[32px] overflow-hidden border border-white/10 mb-10">
          <div className="relative p-8 md:p-10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.20),transparent_20%),linear-gradient(135deg,#020617_0%,#111827_45%,#9f1239_100%)]">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm font-semibold mb-4 border border-white/10">
              Show Scheduler
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-2">Manage Shows</h1>
            <p className="text-white/80 text-lg max-w-2xl leading-8">
              Create movie shows, map them to theaters and screens, and manage schedules in one premium page.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-10 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
          <h2 className="text-2xl font-black mb-6">Create New Show</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              value={form.movie_id}
              onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
            >
              <option value="">Select Movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              value={form.theater_id}
              onChange={(e) => setForm({ ...form, theater_id: e.target.value, screen_id: "" })}
            >
              <option value="">Select Theater</option>
              {theaters.map((theater) => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              value={form.screen_id}
              onChange={(e) => setForm({ ...form, screen_id: e.target.value })}
            >
              <option value="">Select Screen</option>
              {filteredScreens.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              value={form.show_date}
              onChange={(e) => setForm({ ...form, show_date: e.target.value })}
            />

            <input
              type="time"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              value={form.show_time}
              onChange={(e) => setForm({ ...form, show_time: e.target.value })}
            />

            <input
              placeholder="Price"
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <button
            onClick={handleAdd}
            className="mt-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg transition"
          >
            Create Show
          </button>
        </div>

        {shows.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <div className="text-6xl mb-4">🎟️</div>
            <h2 className="text-2xl font-black text-white mb-2">No shows found</h2>
            <p className="text-slate-300">Created shows will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {shows.map((show) => (
              <div
                key={show.id}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(0,0,0,0.30)]"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Show ID</p>
                    <h2 className="text-2xl font-black text-white">#{show.id}</h2>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-pink-500/15 text-pink-300 text-sm font-bold border border-pink-400/20">
                    ₹{show.price}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Movie:</span>{" "}
                    {getMovieTitle(show.movie_id)}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Theater:</span>{" "}
                    {getTheaterName(show.theater_id)}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Screen:</span>{" "}
                    {getScreenName(show.screen_id)}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Date:</span> {show.show_date}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Time:</span> {show.show_time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminShows;