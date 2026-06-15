import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import { glass } from "../CommercialDashboard";
import { btnPrimary } from "../../common/uiUtiles";
const AddCredits = () => {
  const [credits, setCredits] = useState(500);
  const [amt, setAmt] = useState("");

  const add = () => {
    const n = parseInt(amt);
    if (!n || n <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setCredits((c) => c + n);
    setAmt("");
    toast.success(`₹${n} credits added!`);
  };

  return (
    <div className={`${glass} p-6 space-y-6`}>
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
          <CreditCard className="w-4 h-4 text-white" />
        </span>
        <div>
          <h3 className="font-black text-slate-800">Add Credits</h3>
          <p className="text-xs text-slate-400">Top up your account balance</p>
        </div>
      </div>

      {/* Balance display */}
      <div
        className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest">
          Current Balance
        </p>
        <p className="text-4xl font-black text-white mt-1">
          ₹{credits.toLocaleString()}
        </p>
        <p className="text-blue-200 text-xs mt-1">Available to spend</p>
      </div>

      {/* Quick amounts */}
      <div>
        <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Quick add
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[500, 1000, 2000, 5000].map((v) => (
            <button
              key={v}
              onClick={() => setAmt(String(v))}
              className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                amt === String(v)
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
              }`}
            >
              ₹{v.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="number"
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
          placeholder="Custom amount (₹)"
          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 outline-none text-sm bg-white"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={add}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md flex items-center gap-2"
          style={btnPrimary}
        >
          <Plus className="w-4 h-4" /> Pay
        </motion.button>
      </div>
      <p className="text-[10.5px] text-slate-400">
        Demo integration — no real payment processed.
      </p>
    </div>
  );
};
export default AddCredits;
