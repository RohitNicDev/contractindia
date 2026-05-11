import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus, Search, Send, Trophy, Star,
  ArrowRight, Zap, CheckCircle, Quote,
} from "lucide-react";

const steps = [
  {
    n: "01",
    icon: <UserPlus className="w-5 h-5" />,
    title: "Register Your Company",
    desc: "Create your free elite company profile with certifications and past project portfolios.",
    grad: "from-blue-500 to-indigo-600",
    glow: "rgba(99,102,241,0.35)",
  },
  {
    n: "02",
    icon: <Send className="w-5 h-5" />,
    title: "Submit Proposals",
    desc: "Submit competitive bids through our encrypted platform and track status in real-time.",
    grad: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.35)",
  },
  {
    n: "03",
    icon: <Search className="w-5 h-5" />,
    title: "Get Identified by Customers",
    desc: "Your verified profile surfaces to project owners actively searching for your expertise.",
    grad: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.35)",
  },
  {
    n: "04",
    icon: <Trophy className="w-5 h-5" />,
    title: "Win & Scale",
    desc: "Get awarded projects, collect verified reviews, and build your digital authority.",
    grad: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.35)",
  },
];

const testimonials = [
  {
    quote: "ContractsIndia helped us find the right EPC contractor for our ₹80 Cr hospital project. The bidding transparency is world-class.",
    name: "Rajesh Sharma",
    role: "Asst. Engineer, PWD",
    tags: ["Infrastructure", "Verified"],
    img: "https://i.pravatar.cc/150?u=rajesh",
    accent: "#6366f1",
  },
  {
    quote: "As an interior designer, I got 12 high-intent inquiries in my first month. The lead quality is significantly better than competitors.",
    name: "Priya Mehta",
    role: "Lead Designer, UrbanSpace",
    tags: ["Interior", "Premium"],
    img: "https://i.pravatar.cc/150?u=priya",
    accent: "#8b5cf6",
  },
  {
    quote: "We supply TMT steel and found 3 bulk buyers instantly. The digital KYC makes the deal trustable and faster.",
    name: "Vikram Joshi",
    role: "Sales Head, IndiaSteel Ltd",
    tags: ["Material", "Bulk"],
    img: "https://i.pravatar.cc/150?u=vikram",
    accent: "#3b82f6",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #162646 50%, #0d1b2e 100%)" }}>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Glow orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)" }} />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%)" }} />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 backdrop-blur border border-white/12 text-slate-300 text-[10px] font-black uppercase tracking-widest mb-5">
            <Zap className="w-3 h-3 text-amber-400" /> Streamlined Process
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">
              ContractsIndia™
            </span>{" "}
            Works
          </h2>
          <p className="text-slate-400 mt-3 text-sm font-medium">
            From signup to winning projects in 4 simple steps.
          </p>
        </motion.div>

        {/* Step cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative"
            >
              <div
                className="relative h-full rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-400 group-hover:border-white/20"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${s.glow} 0%, transparent 60%)` }}
                />

                {/* Step number watermark */}
                <div className="absolute top-4 right-4 text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-400 select-none">
                  {s.n}
                </div>

                {/* Icon */}
                <div
                  className={`relative z-10 h-12 w-12 rounded-xl bg-gradient-to-br ${s.grad} text-white flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 8px 20px ${s.glow}` }}
                >
                  {s.icon}
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-base font-black text-white mb-2 group-hover:text-indigo-200 transition-colors duration-300">
                  {s.title}
                </h3>

                {/* Desc */}
                <p className="relative z-10 text-slate-400 text-xs leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Connector arrow */}
              {idx !== steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                  <div className="bg-white/8 backdrop-blur rounded-full p-1.5 border border-white/10">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">

      {/* Background radial accents */}
      <div className="absolute top-0 right-0 w-[45%] h-[45%] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right, rgba(99,102,241,0.06) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 left-0 w-[45%] h-[45%] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom left, rgba(245,158,11,0.05) 0%, transparent 65%)" }} />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest mb-5">
            ✦ Industry Voices
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#162646] leading-tight">
            Trusted by the Industry's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Professionals
            </span>
          </h2>
          <p className="mt-4 text-slate-500 text-sm font-medium">
            Join 50,000+ businesses growing across India.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-2xl transition-all duration-400 flex flex-col overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(circle at 80% 20%, ${t.accent}12 0%, transparent 60%)` }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400"
                style={{ background: `linear-gradient(90deg, ${t.accent}, transparent)` }}
              />

              {/* Quote icon */}
              <div
                className="absolute top-5 right-5 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: `${t.accent}15`, color: t.accent }}
              >
                <Quote className="w-4 h-4" />
              </div>

              <div className="flex flex-col h-full relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed flex-1">
                  "{t.quote}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* User */}
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="relative">
                    <img src={t.img} className="w-11 h-11 rounded-xl object-cover" alt={t.name} />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#162646] text-sm">{t.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: t.accent }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-5 py-6 px-8 border border-slate-100 bg-slate-50/70 rounded-2xl max-w-3xl mx-auto"
        >
          <div className="flex -space-x-2.5">
            {[1, 2, 3].map((i) => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
            ))}
            <div className="w-10 h-10 rounded-full bg-[#162646] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
              +50k
            </div>
          </div>
          <p className="text-slate-500 text-xs font-semibold">India's fastest growing civil network</p>
          <button className="flex items-center gap-1.5 text-[#162646] text-xs font-bold hover:text-indigo-600 transition-colors">
            Read Stories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
