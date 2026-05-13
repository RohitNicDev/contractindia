import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Test = () => {
  const navigate = useNavigate();
  return (
    <section className="px-4 sm:px-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] py-20 px-8 text-center"
        style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #162646 50%, #1a2f5a 100%)" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 65%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3" /> India's #1 Construction Network
          </motion.div>

          <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
            Ready to Grow Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Construction Business?
            </span>
          </h2>

          <p className="text-slate-400 text-sm font-medium mb-10 max-w-lg mx-auto">
            Join 50,000+ verified companies. Get matching tenders, connect with clients, and scale faster.
          </p>
<div className="flex flex-col sm:flex-row justify-center gap-4">
  <motion.button
    whileHover={{
      scale: 1.05,
      boxShadow: "0 0 40px rgba(245,158,11,0.5)",
    }}
    whileTap={{ scale: 0.97 }}
    onClick={() => navigate("/register")}
    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-[#162646] shadow-xl transition-all"
    style={{
      background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    }}
  >
    Register Now
    <ArrowRight className="w-4 h-4" />
  </motion.button>
</div>
        </div>
      </motion.div>
    </section>
  );
};

export default Test;
