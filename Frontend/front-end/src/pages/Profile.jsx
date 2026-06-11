import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { User, Mail, DollarSign, CreditCard, Save, Edit3 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const res = await axiosInstance.put("/users/profile", {
        name: editName,
        email: editEmail,
      });
      if (res.data.success) {
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.data.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const cardNumber = user?.card?.cardNumber || "0000000000000000";

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f0eef6] flex justify-center w-full px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-4xl">
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Profile</h2>
        <p className="text-slate-400 text-sm mb-8">Manage your personal information</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-7 space-y-5">

            <div className="flex items-center gap-4 bg-[#f0eef6] rounded-xl p-4">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <User size={18} className="text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</p>
                <p className="text-sm text-slate-700 font-semibold">{user?.name || "User"}</p>
              </div>
            </div>
            
 
            <div className="flex items-center gap-4 bg-[#f0eef6] rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-sm text-slate-700 font-semibold">{user?.email || "user@bank.com"}</p>
              </div>
            </div>


            <div className="flex items-center gap-4 bg-[#e0f5ee] rounded-xl p-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Balance</p>
                <p className="text-sm text-emerald-700 font-extrabold">${(user?.balance || 0).toFixed(2)}</p>
              </div>
            </div>


            <div className="flex items-center gap-4 bg-[#f0eef6] rounded-xl p-4">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                <CreditCard size={18} className="text-rose-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Card Number</p>
                <p className="text-sm text-slate-700 font-semibold">{cardNumber.slice(0, 4)} **** **** {cardNumber.slice(-4)}</p>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Edit Profile</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-violet-500 font-semibold hover:text-violet-700 transition-all">
                  <Edit3 size={16} /> Edit
                </button>
              )}
            </div>

            {saved && (
              <div className="mb-4 p-3 bg-[#e0f5ee] border border-emerald-100 rounded-xl text-emerald-700 text-sm font-semibold text-center">
                Profile updated successfully
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-500 rounded-lg text-sm text-center font-medium border border-rose-100">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} disabled={!isEditing}
                  className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all ${
                    isEditing 
                      ? "bg-[#f0eef6] text-slate-700 focus:ring-2 focus:ring-violet-300 focus:bg-white" 
                      : "bg-slate-50 text-slate-400 cursor-not-allowed"
                  }`} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} disabled={!isEditing}
                  className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all ${
                    isEditing 
                      ? "bg-[#f0eef6] text-slate-700 focus:ring-2 focus:ring-violet-300 focus:bg-white" 
                      : "bg-slate-50 text-slate-400 cursor-not-allowed"
                  }`} />
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60">
                    <Save size={16} /> {saving ? "Saving..." : "Save"}
                  </motion.button>
                  <button onClick={() => { setIsEditing(false); setEditName(user?.name || ""); setEditEmail(user?.email || ""); setError(""); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold text-sm transition-all">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;