import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

const Deposit = () => {
  const location = useLocation();
  const [amount, setAmount] = useState(location.state?.amount || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.post("/deposit/create", { amount: Number(amount) });
      if (res.data.success && res.data.session_url) {
        window.location.href = res.data.session_url;
      } else {
        setError("Failed to create deposit session");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f0eef6] flex justify-center w-full px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-md">
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Deposit Funds</h2>
        <p className="text-slate-400 text-sm mb-8">Add money to your account via Stripe</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-7">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-500 rounded-lg text-sm text-center font-medium border border-rose-100">
              {error}
            </div>
          )}
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amount (USD)</label>
          <input 
            type="number" 
            placeholder="e.g. 500" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#f0eef6] border border-transparent rounded-xl px-5 py-3.5 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-violet-300 focus:bg-white outline-none font-medium transition-all mb-5"
          />
          
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={handleDeposit} 
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Continue with Stripe"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Deposit;