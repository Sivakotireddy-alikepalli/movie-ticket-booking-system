import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    language: "",
    city: "",
    sort_by: "latest",
  });

  const fetchMovies = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.language) params.language = filters.language;
      if (filters.city) params.city = filters.city;
      if (filters.sort_by) params.sort_by = filters.sort_by;

      const response = await API.get("/movies/", { params });
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative rounded-[32px] overflow-hidden mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-pink-600 to-violet-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_22%)]" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-52 h-52 rounded-full bg-black/20 blur-3xl" />

          <div className="relative p-8 md:p-12 lg:p-14">
            <div className="max-w-3xl fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-red-100 font-semibold mb-5 backdrop-blur-xl">
                🔥 Trending Movies • Premium Booking UI
              </div>

              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-4">
                Book Your Next
                <span className="block text-white/90">Big Screen Experience</span>
              </h1>

              <p className="text-white/85 text-base lg:text-lg leading-8 max-w-2xl">
                Discover trending movies, explore cities, languages, categories, and book
                your favorite show with a premium cinematic feel.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 font-semibold">
                  🎬 Latest Releases
                </div>
                <div className="px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 font-semibold">
                  ⭐ Top Rated
                </div>
                <div className="px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 font-semibold">
                  🎟 Instant Booking
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/6 backdrop-blur-2xl p-6 rounded-[30px] shadow-2xl mb-10 grid grid-cols-1 md:grid-cols-5 gap-4 border border-white/10 fade-in">
          <input
            type="text"
            placeholder="🔍 Search movie"
            className="bg-slate-900/70 border border-white/10 text-white rounded-2xl p-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <input
            type="text"
            placeholder="🎭 Category"
            className="bg-slate-900/70 border border-white/10 text-white rounded-2xl p-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />

          <input
            type="text"
            placeholder="🌐 Language"
            className="bg-slate-900/70 border border-white/10 text-white rounded-2xl p-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          />

          <input
            type="text"
            placeholder="📍 City"
            className="bg-slate-900/70 border border-white/10 text-white rounded-2xl p-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />

          <select
            className="bg-slate-900/70 border border-white/10 text-white rounded-2xl p-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            value={filters.sort_by}
            onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
          >
            <option value="latest">Latest</option>
            <option value="popularity">Popularity</option>
          </select>

          <button
            onClick={fetchMovies}
            className="md:col-span-5 bg-gradient-to-r from-red-600 via-pink-600 to-rose-500 hover:opacity-95 text-white py-3.5 rounded-2xl font-bold shadow-lg hover:scale-[1.01] transition"
          >
            🔎 Search / Filter Movies
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white/6 border border-white/10 rounded-[28px] shadow-md p-4 animate-pulse"
              >
                <div className="h-72 bg-slate-700/40 rounded-2xl mb-4"></div>
                <div className="h-5 bg-slate-700/40 rounded mb-3"></div>
                <div className="h-4 bg-slate-700/30 rounded mb-2"></div>
                <div className="h-4 bg-slate-700/30 rounded mb-5"></div>
                <div className="h-12 bg-slate-700/40 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 premium-page-card">
            <h2 className="text-2xl font-bold text-white mb-2">😔 No movies found</h2>
            <p className="text-slate-300">Try changing filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="group bg-white/6 backdrop-blur-xl rounded-[30px] overflow-hidden shadow-xl border border-white/10 hover:shadow-[0_22px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-2 fade-in-up"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={movie.poster_url || "https://via.placeholder.com/400x600?text=Movie"}
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold shadow-lg">
                    Now Showing
                  </div>

                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xl text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    ⭐ {movie.rating || "N/A"}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h2 className="text-xl font-black text-white line-clamp-1">
                      {movie.title}
                    </h2>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-slate-300 text-sm mb-4 h-10 overflow-hidden leading-6">
                    {movie.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="bg-red-500/10 text-red-200 text-xs font-semibold px-3 py-1 rounded-full border border-red-400/20">
                      {movie.language}
                    </span>
                    <span className="bg-white/8 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                      {movie.category}
                    </span>
                    <span className="bg-pink-500/10 text-pink-200 text-xs font-semibold px-3 py-1 rounded-full border border-pink-400/20">
                      {movie.city}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3.5 rounded-2xl font-bold hover:opacity-95 transition shadow-lg hover:shadow-xl"
                  >
                    🎟 View Details
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

export default Movies;