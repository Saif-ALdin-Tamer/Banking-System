import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const formatCardNumber = (num) =>
  num?.replace(/(.{4})/g, "$1 ").trim() || "**** **** **** ****";

const MyCard = () => {
  const [flipped, setFlipped] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Use real card if available, otherwise show placeholders
  const [cardData, setCardData] = useState(null);
  const card = cardData || user?.card || {
    cardNumber: "0000000000000000",
    expiryDate: "00/00",
    cvv: "000",
  };
  
  // Real balance from the user model
  const balance = user?.balance || 0;

  const getCard = async () => {
    try {
      setRefreshing(true);
      const res = await axiosInstance.get("/cards/");
      setCardData(res.data);
    } catch (error) {
      console.error("Failed to refresh card:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f0eef6] flex flex-col items-center w-full px-6">

      {/* Header */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-slate-800">Virtual Card</h2>
          <button onClick={getCard} disabled={refreshing}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm border border-slate-100/50 disabled:opacity-60">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
        <p className="text-slate-400 text-sm mt-2">Click the card to flip it</p>
      </div>

      {/* 3D Flip Card */}
      <div className="w-full max-w-xl mb-8" style={{ perspective: "1200px" }}>
        <motion.div
          onClick={() => setFlipped(!flipped)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full aspect-[1.6/1] cursor-pointer"
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 rounded-2xl p-7 text-white bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 shadow-xl flex flex-col justify-between overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/60 tracking-widest font-semibold">Bank</p>
                <p className="text-[10px] text-white/40 mt-0.5">VIRTUAL CARD</p>
              </div>
              <div className="flex gap-1">
                <div className="w-6 h-6 bg-white/20 rounded-full" />
                <div className="w-6 h-6 bg-white/10 rounded-full -ml-3" />
              </div>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-bold tracking-[0.15em] mb-4">{formatCardNumber(card.cardNumber)}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Card Holder</p>
                  <p className="text-sm font-semibold">{user?.name || "User"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Expires</p>
                  <p className="text-sm font-semibold">{card.expiryDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Balance</p>
                  <p className="text-sm font-bold text-emerald-300">${balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 shadow-xl flex flex-col overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-12 bg-slate-900 mt-6" />
            
            {/* Card Body */}
            <div className="flex-1 px-7 pt-5 pb-4 flex flex-col justify-between">
              {/* CVV + Expires Row */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mb-1.5">CVV</p>
                  <div className="bg-slate-200 px-4 py-2.5 rounded-lg">
                    <span className="text-slate-800 font-bold tracking-[0.3em] text-lg">{card.cvv}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mb-1.5">Expires</p>
                  <p className="text-white font-bold text-lg">{card.expiryDate}</p>
                </div>
              </div>

              {/* Security Notes */}
              <div className="mt-4">
                <p className="text-sm font-bold text-white mb-2">Security Notes</p>
                <ul className="space-y-1">
                  <li className="text-[11px] text-white/50 flex items-start gap-1.5">
                    <span className="mt-0.5">•</span> Never share your card number or CVV with anyone.
                  </li>
                  <li className="text-[11px] text-white/50 flex items-start gap-1.5">
                    <span className="mt-0.5">•</span> Use this card for secure online transactions only.
                  </li>
                  <li className="text-[11px] text-white/50 flex items-start gap-1.5">
                    <span className="mt-0.5">•</span> Contact support immediately if your card is compromised.
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-violet-400 rounded-full" />
                  <span className="text-[11px] text-white/60 font-medium">Bank</span>
                </div>
                <span className="text-[11px] text-white/40">© 2025</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card Details Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-xl bg-white shadow-sm border border-slate-100/50 rounded-2xl p-7">
        <h3 className="text-lg font-bold text-slate-800 mb-5">Card Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f0eef6] p-4 rounded-xl">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Card Holder</p>
            <p className="text-sm text-slate-700 font-semibold">{user?.name || "User"}</p>
          </div>
          <div className="bg-[#f0eef6] p-4 rounded-xl">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Card Number</p>
            <p className="text-sm text-slate-700 font-semibold">{card.cardNumber.slice(0, 4)} **** **** {card.cardNumber.slice(-4)}</p>
          </div>
          <div className="bg-[#f0eef6] p-4 rounded-xl">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Expiry Date</p>
            <p className="text-sm text-slate-700 font-semibold">{card.expiryDate}</p>
          </div>
          <div className="bg-[#e0f5ee] p-4 rounded-xl">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Balance</p>
            <p className="text-sm text-emerald-700 font-extrabold">${balance.toFixed(2)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyCard;