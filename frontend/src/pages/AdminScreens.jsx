import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminScreens() {
  const [screens, setScreens] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    theater_id: "",
    name: "",
    total_seats: "",
  });

  const fetchData = async () => {
    try {
      const t = await API.get("/theaters/");
      setTheaters(t.data);

      const s = await API.get("/screens/");
      setScreens(s.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load screens");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      setSubmitting(true);

      await API.post("/screens/", {
        ...form,
        total_seats: Number(form.total_seats),
      });

      setForm({
        theater_id: "",
        name: "",
        total_seats: "",
      });

      fetchData();
      alert("Screen added successfully");
    } catch (error) {
      alert(error?.response?.data?.detail || "Error adding screen");
    } finally {
      setSubmitting(false);
    }
  };

  const getTheaterName = (theaterId) =>
    theaters.find((t) => String(t.id) === String(theaterId))?.name || `Theater ${theaterId}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-[32px] overflow-hidden border border-white/10 mb-10">
          <div className="relative p-8 md:p-10 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.20),transparent_20%),linear-gradient(135deg,#020617_0%,#111827_45%,#581c87_100%)]">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm font-semibold mb-4 border border-white/10">
              Screen Control
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-2">Manage Screens</h1>
            <p className="text-white/80 text-lg max-w-2xl leading-8">
              Create and manage theater screens with seat capacity in a premium UI.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-10 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
          <h2 className="text-2xl font-black mb-6">Add New Screen</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
              value={form.theater_id}
              onChange={(e) => setForm({ ...form, theater_id: e.target.value })}
            >
              <option value="">Select Theater</option>
              {theaters.map((theater) => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Screen Name"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Total Seats"
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
              value={form.total_seats}
              onChange={(e) => setForm({ ...form, total_seats: e.target.value })}
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={submitting}
            className="mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg transition"
          >
            {submitting ? "Adding Screen..." : "Add Screen"}
          </button>
        </div>

        {screens.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <div className="text-6xl mb-4">🖥️</div>
            <h2 className="text-2xl font-black text-white mb-2">No screens found</h2>
            <p className="text-slate-300">Added screens will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(0,0,0,0.30)]"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Screen ID</p>
                    <h2 className="text-2xl font-black text-white">#{screen.id}</h2>
                  </div>
                  <div className="text-4xl">🖥️</div>
                </div>

                <div className="space-y-3">
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Name:</span> {screen.name}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Theater:</span>{" "}
                    {getTheaterName(screen.theater_id)}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Total Seats:</span>{" "}
                    {screen.total_seats}
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

export default AdminScreens;