import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchUsers();
      alert("User deleted successfully");
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleBadgeClass = (role) => {
    const text = String(role || "").toLowerCase();

    if (text === "admin") {
      return "bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 text-violet-300 border border-violet-400/20";
    }

    if (text === "user") {
      return "bg-gradient-to-r from-red-500/15 to-pink-500/15 text-red-300 border border-red-400/20";
    }

    return "bg-white/10 text-slate-200 border border-white/10";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-[32px] overflow-hidden border border-white/10 mb-8">
          <div className="relative p-8 md:p-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.20),transparent_20%),linear-gradient(135deg,#020617_0%,#111827_50%,#1e293b_100%)]">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm font-semibold mb-4 border border-white/10">
              User Management
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-2">Manage Users</h1>
            <p className="text-white/80 text-lg max-w-2xl leading-8">
              View platform users, protect admins, and manage accounts from one
              premium admin panel.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 overflow-x-auto animate-pulse">
            <div className="h-6 w-40 bg-slate-700/50 rounded mb-5"></div>
            <div className="h-14 w-full bg-slate-700/40 rounded mb-4"></div>
            <div className="h-14 w-full bg-slate-700/30 rounded mb-4"></div>
            <div className="h-14 w-full bg-slate-700/30 rounded"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-black text-white mb-2">No users found</h2>
            <p className="text-slate-300">Registered users will appear here.</p>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 overflow-x-auto shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="text-slate-300 text-sm border-b border-white/10">
                  <th className="py-4 px-3">ID</th>
                  <th className="py-4 px-3">Name</th>
                  <th className="py-4 px-3">Email</th>
                  <th className="py-4 px-3">Role</th>
                  <th className="py-4 px-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/6 hover:bg-white/5 transition"
                  >
                    <td className="py-4 px-3 font-semibold text-white">#{user.id}</td>
                    <td className="py-4 px-3 font-semibold text-white">{user.name}</td>
                    <td className="py-4 px-3 text-slate-300">{user.email}</td>
                    <td className="py-4 px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${roleBadgeClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      {user.role !== "admin" ? (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-95 text-white px-4 py-2 rounded-xl font-semibold shadow transition"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400 font-medium">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;