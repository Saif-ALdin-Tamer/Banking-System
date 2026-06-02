import { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications/");
        setNotifications(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };
  
  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f0eef6] flex justify-center w-full px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-3xl">
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Notifications</h2>
        <p className="text-slate-400 text-sm mb-8">All recent operations and alerts</p>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-12 text-center">
                <p className="text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <motion.div 
                  key={n._id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.08 }}
                  className={`bg-white rounded-2xl shadow-sm border p-5 flex items-center justify-between transition-all ${
                    n.read ? "border-slate-100/50 opacity-70" : "border-violet-200/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      n.read ? "bg-slate-100" : "bg-violet-100"
                    }`}>
                      <Bell size={18} className={n.read ? "text-slate-400" : "text-violet-500"} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${n.read ? "text-slate-500" : "text-slate-800"}`}>{n.title}</h3>
                      <p className="text-slate-400 text-sm mt-0.5">{n.message}</p>
                      <div className="text-xs text-slate-300 mt-2 flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  {!n.read && (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => markAsRead(n._id)} 
                      className="bg-[#e0f5ee] hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 ml-4">
                      <CheckCircle size={14} /> Mark read
                    </motion.button>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        )}
      </motion.div>
    </div>
  );
}