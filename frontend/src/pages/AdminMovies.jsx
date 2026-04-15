import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "",
    duration: "",
    category: "",
    city: "",
    poster_url: "",
    release_date: "",
    rating: "",
    popularity: "",
  });

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await API.get("/movies/admin/all");
      setMovies(response.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddMovie = async () => {
    try {
      setSubmitting(true);

      await API.post("/movies/", {
        ...form,
        duration: Number(form.duration),
        popularity: Number(form.popularity || 0),
      });

      setForm({
        title: "",
        description: "",
        language: "",
        duration: "",
        category: "",
        city: "",
        poster_url: "",
        release_date: "",
        rating: "",
        popularity: "",
      });

      fetchMovies();
      alert("Movie added successfully");
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to add movie");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await API.delete(`/movies/${movieId}`);
      fetchMovies();
      alert("Movie deleted successfully");
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to delete movie");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-[32px] overflow-hidden border border-white/10 mb-10">
          <div className="relative p-8 md:p-10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.22),transparent_20%),linear-gradient(135deg,#020617_0%,#111827_45%,#7f1d1d_100%)]">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm font-semibold mb-4 border border-white/10">
              Movie Control
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-2">Manage Movies</h1>
            <p className="text-white/80 text-lg max-w-2xl leading-8">
              Add new movies with posters and manage your full catalog from a
              premium cinematic admin page.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-10 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
          <h2 className="text-2xl font-black mb-6 text-white">Add New Movie</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <input
              placeholder="Title"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              placeholder="Language"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            />

            <input
              placeholder="Duration"
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />

            <input
              placeholder="Category"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <input
              placeholder="City"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <input
              placeholder="Poster URL"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.poster_url}
              onChange={(e) => setForm({ ...form, poster_url: e.target.value })}
            />

            <input
              placeholder="Release Date"
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.release_date}
              onChange={(e) => setForm({ ...form, release_date: e.target.value })}
            />

            <input
              placeholder="Rating"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />

            <input
              placeholder="Popularity"
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.popularity}
              onChange={(e) => setForm({ ...form, popularity: e.target.value })}
            />

            <textarea
              placeholder="Description"
              rows={4}
              className="md:col-span-2 xl:col-span-3 w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button
            onClick={handleAddMovie}
            disabled={submitting}
            className="mt-6 bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-95 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg transition"
          >
            {submitting ? "Adding Movie..." : "Add Movie"}
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-4 animate-pulse"
              >
                <div className="h-72 rounded-2xl bg-slate-700/40 mb-4" />
                <div className="h-5 bg-slate-700/40 rounded mb-3" />
                <div className="h-4 bg-slate-700/30 rounded mb-2" />
                <div className="h-4 bg-slate-700/30 rounded mb-4" />
                <div className="h-11 bg-slate-700/40 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-black text-white mb-2">No movies found</h2>
            <p className="text-slate-300">Add movies to see them here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.30)] hover:-translate-y-1 transition"
              >
                <div className="relative">
                  <img
                    src={movie.poster_url || "https://via.placeholder.com/400x600?text=Movie"}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold">
                    ⭐ {movie.rating || "N/A"}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h2 className="text-xl font-black text-white line-clamp-1">
                      {movie.title}
                    </h2>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-slate-300 text-sm mb-4 h-10 overflow-hidden">
                    {movie.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-500/10 text-red-300 text-xs font-semibold px-3 py-1 rounded-full border border-red-400/20">
                      {movie.language}
                    </span>
                    <span className="bg-white/10 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                      {movie.category}
                    </span>
                    <span className="bg-pink-500/10 text-pink-300 text-xs font-semibold px-3 py-1 rounded-full border border-pink-400/20">
                      {movie.city}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-95 text-white py-3 rounded-2xl font-bold shadow-lg transition"
                  >
                    Delete Movie
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

export default AdminMovies;