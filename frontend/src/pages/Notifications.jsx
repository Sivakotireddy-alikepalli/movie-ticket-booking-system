import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API.get("/notifications/my");
      setNotifications(response.data);
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await API.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to update notification");
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/my/read-all");
      fetchNotifications();
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to mark all as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-red-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-[28px] bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white p-8 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="inline-block px-4 py-2 rounded-full bg-white/15 text-sm font-semibold mb-4">
                Notification Center
              </p>
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                Notifications
              </h1>
              <p className="text-white/85">
                See your latest booking updates, payment alerts, and activity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="px-4 py-2 rounded-2xl bg-white/15 font-semibold">
                Unread: {unreadCount}
              </div>
              <button
                onClick={markAllRead}
                className="bg-black hover:bg-gray-900 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg transition"
              >
                Mark All as Read
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] shadow-md p-5 animate-pulse"
              >
                <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-[28px] shadow-xl p-10 text-center border border-red-50">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              No notifications found
            </h2>
            <p className="text-gray-600">
              You don’t have any updates right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-[24px] shadow-md p-5 border transition hover:shadow-xl ${
                  item.is_read
                    ? "bg-white border-gray-200"
                    : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-xl font-black text-gray-900">
                        {item.title}
                      </h2>

                      {!item.is_read && (
                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {item.message}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  {!item.is_read && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition w-full md:w-auto"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;