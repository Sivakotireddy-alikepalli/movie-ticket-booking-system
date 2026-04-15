import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Dashboard error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = stats
    ? [
        { name: "Users", value: stats.total_users },
        { name: "Movies", value: stats.total_movies },
        { name: "Bookings", value: stats.total_bookings },
      ]
    : [];

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-20 w-80 bg-slate-800/60 rounded-3xl mb-8" />
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-36"
                >
                  <div className="h-4 w-24 bg-slate-700/60 rounded mb-4" />
                  <div className="h-9 w-28 bg-slate-700/60 rounded" />
                </div>
              ))}
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl h-[380px]" />
          </div>
        </div>
      </div>
    );
  }

  const revenue = Number(stats.total_revenue || 0);

  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: "👥",
      glow: "from-blue-500/20 to-cyan-500/10",
    },
    {
      title: "Total Movies",
      value: stats.total_movies,
      icon: "🎬",
      glow: "from-red-500/20 to-pink-500/10",
    },
    {
      title: "Total Bookings",
      value: stats.total_bookings,
      icon: "🎟️",
      glow: "from-violet-500/20 to-fuchsia-500/10",
    },
    {
      title: "Revenue",
      value: `₹${revenue}`,
      icon: "💰",
      glow: "from-emerald-500/20 to-green-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-[32px] overflow-hidden border border-white/10 mb-10">
          <div className="relative p-8 md:p-10 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.22),transparent_20%),linear-gradient(135deg,#020617_0%,#111827_45%,#7f1d1d_100%)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-3xl rounded-full" />
            <div className="relative">
              <p className="inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold mb-4">
                Admin Control Center
              </p>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                Dashboard Overview
              </h1>
              <p className="text-white/80 text-lg max-w-2xl leading-8">
                Track platform growth, bookings, movies, revenue, and user activity
                in one premium cinematic dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${card.glow} backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(0,0,0,0.30)]`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-300 font-semibold">{card.title}</div>
                <div className="text-3xl">{card.icon}</div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white">
                {card.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2">Analytics</p>
              <h2 className="text-2xl font-black text-white">Platform Summary Chart</h2>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2">Quick Insights</p>
              <h2 className="text-2xl font-black text-white">Admin Snapshot</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-slate-400 text-sm mb-1">Users Registered</p>
                <p className="text-white font-black text-2xl">{stats.total_users}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-slate-400 text-sm mb-1">Movies Available</p>
                <p className="text-white font-black text-2xl">{stats.total_movies}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-slate-400 text-sm mb-1">Bookings Completed</p>
                <p className="text-white font-black text-2xl">{stats.total_bookings}</p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <p className="text-emerald-200 text-sm mb-1">Revenue Earned</p>
                <p className="text-emerald-300 font-black text-2xl">₹{revenue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;