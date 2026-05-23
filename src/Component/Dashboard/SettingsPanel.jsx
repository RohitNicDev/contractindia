import { Key } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const SettingsPanel = () => {
  const [old, setOld] = useState("");
  const [nw, setNw] = useState("");
  const [conf, setConf] = useState("");

  const change = () => {
    if (!old || !nw || !conf) {
      toast.error("Fill all fields");
      return;
    }
    if (nw !== conf) {
      toast.error("Passwords do not match");
      return;
    }
    setOld("");
    setNw("");
    setConf("");
    toast.success("Password updated (demo)");
  };

  const inp2 =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 outline-none text-sm bg-white text-slate-800";
  const glass =
    "rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)]";
  const btnPrimary = { background: "linear-gradient(135deg,#3b82f6,#6366f1)" };
  return (
    <div className={`${glass} p-6 space-y-5`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50">
          <Key className="w-4 h-4 text-blue-500" />
        </span>
        <div>
          <h3 className="font-black text-slate-800">Change Password</h3>
          <p className="text-xs text-slate-400">Keep your account secure</p>
        </div>
      </div>
      <div className="space-y-3">
        {[
          ["Current Password", old, setOld],
          ["New Password", nw, setNw],
          ["Confirm Password", conf, setConf],
        ].map(([lbl, val, setter]) => (
          <div key={lbl}>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {lbl}
            </label>
            <input
              type="password"
              value={val}
              onChange={(e) => setter(e.target.value)}
              className={inp2}
            />
          </div>
        ))}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={change}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg"
          style={btnPrimary}
        >
          <Key className="w-4 h-4" /> Update Password
        </motion.button>
      </div>
    </div>
  );
};
export default SettingsPanel;
