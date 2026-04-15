import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  const fetchData = async () => {
    try {
      const m = await API.get(`/movies/${id}`);
      const s = await API.get(`/shows/movie/${id}`);
      setMovie(m.data);
      setShows(s.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load movie details");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-[380px] rounded-3xl bg-slate-800/70 mb-8" />
            <div className="h-10 w-72 bg-slate-800/70 rounded mb-4" />
            <div className="h-5 w-full max-w-2xl bg-slate-800/60 rounded mb-2" />
            <div className="h-5 w-full max-w-xl bg-slate-800/60 rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-44 rounded-3xl bg-slate-800/70" />
              <div className="h-44 rounded-3xl bg-slate-800/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div
        className="relative min-h-[520px] flex items-end overflow-hidden"
        style={{
          backgroundImage: `url(${movie.poster_url || "https://via.placeholder.com/1200x700"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.22),transparent_20%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-end">
            <div className="w-full max-w-[300px] fade-in-up">
              <img
                src={movie.poster_url || "https://via.placeholder.com/400x600?text=Movie"}
                alt={movie.title}
                className="w-full h-[420px] object-cover rounded-[30px] shadow-[0_30px_80px_rgba(0,0,0,0.45)] border border-white/10"
              />
            </div>

            <div className="text-white pb-2 fade-in-up">
              <p className="inline-flex items-center px-4 py-2 rounded-full bg-red-600/90 text-sm font-semibold mb-4 shadow-lg">
                🔥 Now Showing
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                {movie.title}
              </h1>

              <p className="max-w-3xl text-slate-200 text-base md:text-lg mb-5 leading-8">
                {movie.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/10">
                  ⭐ {movie.rating || "N/A"}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/10">
                  🌐 {movie.language || "Unknown"}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/10">
                  🎭 {movie.category || "General"}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/10">
                  📍 {movie.city || "City"}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-sm font-semibold border border-white/10">
                  ⏱ {movie.duration ? `${movie.duration} min` : "Duration N/A"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    document.getElementById("shows-section")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-95 text-white px-7 py-3 rounded-2xl font-bold shadow-xl transition"
                >
                  Book Now
                </button>

                <button
                  onClick={() => navigate("/home")}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-xl text-white px-7 py-3 rounded-2xl font-bold border border-white/10 transition"
                >
                  Back to Movies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="premium-page-card">
            <p className="text-sm text-slate-400 mb-2">Movie Language</p>
            <h3 className="text-2xl font-black text-white">{movie.language}</h3>
          </div>

          <div className="premium-page-card">
            <p className="text-sm text-slate-400 mb-2">Genre</p>
            <h3 className="text-2xl font-black text-white">{movie.category}</h3>
          </div>

          <div className="premium-page-card">
            <p className="text-sm text-slate-400 mb-2">Audience Rating</p>
            <h3 className="text-2xl font-black text-white">⭐ {movie.rating || "N/A"}</h3>
          </div>
        </div>

        <div id="shows-section">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white">Available Shows</h2>
              <p className="text-slate-300 mt-2">
                Choose your preferred show time and continue to seat booking.
              </p>
            </div>
          </div>

          {shows.length === 0 ? (
            <div className="premium-page-card text-center">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-black text-white mb-2">No shows available</h3>
              <p className="text-slate-300">
                Shows for this movie have not been added yet. Please check again later.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shows.map((show, index) => (
                <div
                  key={show.id}
                  className="group premium-page-card hover:-translate-y-1 transition duration-300 fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Theater</p>
                      <h3 className="text-xl font-black text-white">
                        Theater #{show.theater_id}
                      </h3>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-200 text-sm font-bold border border-red-500/20">
                      ₹{show.price}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-200">
                      <span className="text-lg">📅</span>
                      <span className="font-medium">{show.show_date}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-200">
                      <span className="text-lg">⏰</span>
                      <span className="font-medium">{show.show_time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/shows/${show.id}/seats`)}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3.5 rounded-2xl font-bold hover:opacity-95 transition shadow-lg"
                  >
                    🎟 Book Tickets
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;