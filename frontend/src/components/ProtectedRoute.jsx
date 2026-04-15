import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.16),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_20%),linear-gradient(135deg,#020617_0%,#0f172a_50%,#111827_100%)]" />
        <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.45)] p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full border-4 border-white/10 border-t-red-500 animate-spin"></div>

          <h2 className="text-3xl font-black text-white mb-3">
            Checking Access
          </h2>

          <p className="text-slate-300 leading-7">
            Please wait while we verify your login and permissions.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;