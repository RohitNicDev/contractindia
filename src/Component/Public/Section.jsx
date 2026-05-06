import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Send,
  Trophy,
  Star,
  Quote,
  ArrowRight,
  Zap,
  CheckCircle,
  Award
} from "lucide-react";

const steps = [
  { n: "01", icon: <UserPlus className="w-6 h-6" />, title: "Register Your Company", desc: "Create your free elite company profile with certifications and past project portfolios.", color: "from-blue-500 to-accent" },
  { n: "02", icon: <Send className="w-6 h-6" />, title: "Submit Proposals", desc: "Submit competitive bids through our encrypted platform and track status in real-time.", color: "from-orange-500 to-cta" },
  { n: "03", icon: <Search className="w-6 h-6" />, title: "Get Indetified by Customers", desc: "Lorem ipsum was conceived as filler text, formatted in a certain way to enable", color: "from-purple-500 to-pink-500" },
  { n: "04", icon: <Trophy className="w-6 h-6" />, title: "Win & Scale", desc: "Get awarded projects, collect verified reviews, and build your digital authority.", color: "from-emerald-500 to-teal-500" },
];

const testimonials = [
  {
    quote: "ContractsIndia helped us find the right EPC contractor for our ₹80 Cr hospital project. The bidding transparency is world-class.",
    name: "Rajesh Sharma",
    role: "Asst. Engineer, PWD",
    tags: ["Infrastructure", "Verified"],
    img: "https://i.pravatar.cc/150?u=rajesh",
    color: "bg-accent/5 text-accent"
  },
  {
    quote: "As an interior designer, I got 12 high-intent inquiries in my first month. The lead quality is significantly better than competitors.",
    name: "Priya Mehta",
    role: "Lead Designer, UrbanSpace",
    tags: ["Interior", "Premium"],
    img: "https://i.pravatar.cc/150?u=priya",
    color: "bg-purple-500/5 text-purple-600"
  },
  {
    quote: "We supply TMT steel and found 3 bulk buyers instantly. The digital KYC makes the deal trustable and faster.",
    name: "Vikram Joshi",
    role: "Sales Head, IndiaSteel Ltd",
    tags: ["Material", "Bulk"],
    img: "https://i.pravatar.cc/150?u=vikram",
    color: "bg-blue-500/5 text-blue-600"
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 relative overflow-hidden">
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 
        bg-[radial-gradient(#334155_1px,transparent_1px)] 
        [background-size:20px_20px] 
        opacity-30">
      </div>

      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur border border-white/10 text-slate-300 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
            <Zap className="w-3 h-3 text-cta" /> Streamlined Process
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-indigo-400">
              ContractsIndia™
            </span>{" "}
            Works
          </h2>

          <p className="text-slate-400 mt-3 text-sm font-medium">
            From signup to winning projects in 4 simple steps.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 
              shadow-[0_10px_30px_rgba(0,0,0,0.4)]
              group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] 
              group-hover:-translate-y-2 transition-all duration-300 
              flex flex-col h-full hover:border-indigo-400/40">

                {/* Top */}
                <div className="flex justify-between items-center mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-md text-lg group-hover:scale-105 transition`}>
                    {s.icon}
                  </div>

                  <span className="text-3xl font-black text-white/10 group-hover:text-indigo-300/30 transition">
                    {s.n}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-white mb-2 group-hover:text-indigo-300 transition">
                  {s.title}
                </h3>

                {/* Desc */}
                <p className="text-slate-400 text-xs leading-relaxed mt-auto">
                  {s.desc}
                </p>
              </div>

              {/* Arrow */}
              {idx !== steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-5 -translate-y-1/2 z-20">
                  <div className="bg-white/5 rounded-full p-1.5 shadow border border-white/10 group-hover:scale-110 transition">
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
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
    <section className="py-20 bg-white relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cta/5 via-transparent to-transparent opacity-80" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 max-w-2xl mx-auto">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-5">
            <Award className="w-3 h-3 text-accent" /> Industry Voices
          </div> */}

          <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight">
            Trusted by the Industry's <br />
            <span className="text-accent underline decoration-cta/30 decoration-2 underline-offset-4">
              Professionals
            </span>
          </h2>

          <p className="mt-4 text-slate-500 text-sm font-medium">
            Join 50,000+ businesses growing across India.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white border border-slate-300 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              
              {/* Quote Icon */}
              <div className={`absolute top-5 right-5 p-2 rounded-xl ${t.color} opacity-0 group-hover:opacity-100 transition-all`}>
                <Quote className="w-4 h-4" />
              </div>

              <div className="flex flex-col h-full">
                
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map((s)=>(
                    <Star key={s} className="w-3.5 h-3.5 fill-cta text-cta" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm font-semibold text-slate-600 mb-6 line-clamp-3">
                  "{t.quote}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {t.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold bg-slate-50 border border-slate-100 text-slate-500 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* User */}
                <div className="mt-auto flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="relative">
                    <img
                      src={t.img}
                      className="w-12 h-12 rounded-xl object-cover"
                      alt={t.name}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-white" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-primary text-sm">{t.name}</h4>
                    <p className="text-[9px] font-bold text-accent uppercase">{t.role}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-4 py-6 border-t border-slate-100 bg-slate-50/50 rounded-2xl max-w-3xl mx-auto">
          
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-10 h-10 rounded-full border-2 border-white" />
            ))}
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
              +50k
            </div>
          </div>

          <p className="text-slate-500 text-xs font-semibold">
            India's fastest growing civil network
          </p>

          <button className="flex items-center gap-1 text-primary text-xs font-bold hover:text-accent">
            Read Stories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}