import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

export default function VerifyDeposit() {
  const [status, setStatus] = useState("loading");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      setStatus("loading");
      const successParam = params.get("success");
      const amountParam = params.get("amount");
      
      try {
        if (successParam === "true") {
          const res = await axiosInstance.post("/deposit/verify", {
            success: "true",
            amount: amountParam,
          });
          if (res.data.success) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };
    verifyPayment();
  }, [params]);

  return (
    <div className="min-h-screen bg-[#f0eef6] flex items-center justify-center p-6 w-full">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }} className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-8 text-center">
          {status === "loading" && (
            <div className="py-6">
              <div className="w-16 h-16 bg-[#f0eef6] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying Payment...</h2>
              <p className="text-slate-400 text-sm">Please wait. Do not close this page.</p>
            </div>
          )}

          {status === "success" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4">
              <div className="w-16 h-16 bg-[#e0f5ee] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Deposit Successful!</h2>
              <p className="text-slate-400 text-sm mb-6">Funds have been added to your account.</p>
              <button onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all">
                Go to Dashboard <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Payment Failed</h2>
              <p className="text-slate-400 text-sm mb-6">The deposit was canceled or could not be verified.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/deposit")}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all">
                  Try Again
                </button>
                <button onClick={() => navigate("/")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-xl font-semibold text-sm transition-all">
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}