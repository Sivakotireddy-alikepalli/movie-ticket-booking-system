import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    location: "",
  });

  const fetchTheaters = async () => {
    try {
      const res = await API.get("/theaters/");
      setTheaters(res.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load theaters");
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleAdd = async () => {
    try {
      setSubmitting(true);
      await API.post("/theaters/", form);
      setForm({ name: "", city: "", location: "" });
      fetchTheaters();
      alert("Theater added successfully");
    } catch (error) {
      alert(error?.response?.data?.detail || "Error adding theater");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-[32px] overflow-hidden border border-white/10 mb-10">
          <div className="relative p-8 md:p-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.20),transparent_20%),linear-gradient(135deg,#020617_0%,#111827_45%,#0f766e_100%)]">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm font-semibold mb-4 border border-white/10">
              Theater Control
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-2">Manage Theaters</h1>
            <p className="text-white/80 text-lg max-w-2xl leading-8">
              Add and manage theater locations across cities with a premium admin experience.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-10 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
          <h2 className="text-2xl font-black mb-6">Add New Theater</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input
              placeholder="Theater Name"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="City"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <input
              placeholder="Location"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 text-white px-4 py-3.5 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={submitting}
            className="mt-6 bg-gradient-to-r from-cyan-600 to-teal-600 hover:opacity-95 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg transition"
          >
            {submitting ? "Adding Theater..." : "Add Theater"}
          </button>
        </div>

        {theaters.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-black text-white mb-2">No theaters found</h2>
            <p className="text-slate-300">Added theaters will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {theaters.map((theater) => (
              <div
                key={theater.id}
                className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(0,0,0,0.30)]"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Theater ID</p>
                    <h2 className="text-2xl font-black text-white">#{theater.id}</h2>
                  </div>
                  <div className="text-4xl">🏢</div>
                </div>

                <div className="space-y-3">
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Name:</span> {theater.name}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">City:</span> {theater.city}
                  </p>
                  <p className="text-slate-200">
                    <span className="font-semibold text-white">Location:</span> {theater.location}
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

export default AdminTheaters;