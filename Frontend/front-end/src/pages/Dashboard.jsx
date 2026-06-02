import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const cardBalance = user?.balance || 0;
  
  const handleStripeDeposit = () => {
    if (amount) {
      navigate("/deposit", { state: { amount } });
    } else {
      navigate("/deposit");
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f0eef6] flex justify-center w-full px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl"
      >

        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800">Welcome back, {user?.name}!</h2>
          <p className="text-slate-400 mt-1">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100/50"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Total Balance</h3>
            <p className="text-4xl font-extrabold text-slate-800 mb-4">${cardBalance.toFixed(2)}</p>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm text-slate-400">Available Funds: </span>
              <span className="text-sm font-semibold text-slate-600">${(cardBalance * 0.9).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#e0f5ee] rounded-lg flex items-center justify-center">
                <ArrowRightLeft size={16} className="text-emerald-600" />
              </div>
              <div className="w-9 h-9 bg-[#e0f5ee] rounded-lg flex items-center justify-center">
                <CreditCard size={16} className="text-emerald-600" />
              </div>
            </div>
          </motion.div>
          

          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100/50"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Card Balance</h3>
            <p className="text-4xl font-extrabold text-slate-800 mb-4">${cardBalance.toFixed(2)}</p>

            {/* Mini bar chart visual */}
            <div className="flex items-end gap-1.5 h-12 mt-2">
              {[35, 55, 40, 70, 50, 80, 65].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, backgroundColor: i === 5 ? '#a78bfa' : '#e8e4f0' }}></div>
              ))}
            </div>
          </motion.div>


          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100/50"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate("/deposit")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0eef6] hover:bg-[#e8e4f0] text-slate-700 font-medium text-sm transition-all">
                <ArrowDownToLine size={16} className="text-violet-500" /> Add Funds
              </button>
              <button onClick={() => navigate("/deposit")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0eef6] hover:bg-[#e8e4f0] text-slate-700 font-medium text-sm transition-all">
                <ArrowUpFromLine size={16} className="text-violet-500" /> Withdraw
              </button>
              <button onClick={() => navigate("/transfer")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0eef6] hover:bg-[#e8e4f0] text-slate-700 font-medium text-sm transition-all">
                <ArrowRightLeft size={16} className="text-violet-500" /> Transfer
              </button>
            </div>
          </motion.div>
        </div>


        <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100/50">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Deposit Funds</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amount</label>
              <input 
                type="number" 
                placeholder="e.g. 500" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)} 
                className="w-full rounded-xl bg-[#f0eef6] border border-transparent text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-300 focus:bg-white outline-none px-5 py-3.5 font-medium transition-all" 
              />
            </div>
            <button 
              onClick={handleStripeDeposit} 
              disabled={loading} 
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap"
            >
              Deposit via Stripe
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;