import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get("/transactions/");
        setTransactions(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f0eef6] flex justify-center w-full px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} 
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Recent Transactions</h2>
        <p className="text-slate-400 text-sm mb-8">All your banking activity in one place</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
          ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t, i) => (
                  <motion.tr 
                    key={t._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} 
                    className="border-b border-slate-50 hover:bg-[#f8f7fc] transition duration-200"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        t.type === "deposit" ? "bg-[#e0f5ee]" : "bg-red-50"
                      }`}>
                        {t.type === "deposit" ? (
                          <ArrowDownCircle className="text-emerald-500" size={18} />
                        ) : (
                          <ArrowUpCircle className="text-rose-400" size={18} />
                        )}
                      </div>
                      <span className="capitalize font-medium text-slate-700 text-sm">{t.type}</span>
                    </td>

                    <td className={`py-4 px-6 font-bold text-sm ${
                      t.type === "deposit" ? "text-emerald-600" : "text-rose-500"
                    }`}>
                      {t.type === "deposit" ? "+" : "-"}${t.amount.toFixed(2)}
                    </td>

                    <td className="py-4 px-6 text-slate-400 text-sm">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-slate-400">
                    No transactions found yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}