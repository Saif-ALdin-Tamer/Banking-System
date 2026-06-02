import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, DollarSign } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function Transfer() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!email || !amount) {
      setMsg("Fields Required");
      setMsgType("error");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await axiosInstance.post("/transfer/transfer", {
        receiveEmail: email,
        amount: Number(amount),
      });
      if (res.data.success) {
        setMsg("Money Transferred Successfully!");
        setMsgType("success");
        setEmail("");
        setAmount("");
      } else {
        setMsg(res.data.message || "Transfer failed");
        setMsgType("error");
      }
    } catch (error) {
      setMsg(error.response?.data?.message || "Transfer failed. Please try again.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f0eef6] flex justify-center w-full px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} 
        className="w-full max-w-lg"
      >
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Transfer Money</h2>
        <p className="text-slate-400 text-sm mb-8">Send money quickly and securely</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-7 space-y-5">

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recipient Email</label>
            <div className="flex items-center gap-3 bg-[#f0eef6] px-4 py-3.5 rounded-xl focus-within:ring-2 focus-within:ring-violet-300 focus-within:bg-white transition-all">
              <Mail className="text-violet-400" size={18} />
              <input type="email" placeholder="name@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" />
            </div>
          </div>


          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amount</label>
            <div className="flex items-center gap-3 bg-[#f0eef6] px-4 py-3.5 rounded-xl focus-within:ring-2 focus-within:ring-violet-300 focus-within:bg-white transition-all">
              <DollarSign className="text-violet-400" size={18} />
              <input type="number" placeholder="0.00" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm font-medium" />
            </div>
          </div>


          <motion.button 
            whileTap={{ scale: 0.97 }} 
            disabled={loading}
            onClick={handleTransfer} 
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
              loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            }`}
          >
            {loading ? "Processing..." : "Transfer Now"}
          </motion.button>
        </div>


        {msg && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className={`mt-4 p-4 rounded-xl text-center text-sm font-semibold ${
              msgType === "error" ? "bg-rose-50 text-rose-500 border border-rose-100" : "bg-[#e0f5ee] text-emerald-700 border border-emerald-100"
            }`}
          >
            {msg}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}