import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Tag,
  Clock,
  ArrowRight,
  Search,
  Filter,
  CircleDot,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

const tenders = [
  {
    type: "Government",
    value: "₹48 Cr",
    title: "Construction of Flyover Bridge on NH-44 at Nagpur Junction",
    org: "NHAI - Maharashtra",
    loc: "Nagpur, MH",
    tag: "Infrastructure",
    deadline: "Mar 15, 2026",
  },
  {
    type: "Private",
    value: "₹32 Cr",
    title: "Luxury Residential Township — Phase 2 Civil & MEP Works",
    org: "DLF Properties Ltd",
    loc: "Pune, MH",
    tag: "Residential",
    deadline: "Mar 5, 2026",
  },
  {
    type: "Government",
    value: "₹76 Cr",
    title: "Construction of Government Hospital Building — 500 Bed",
    org: "PWD Madhya Pradesh",
    loc: "Bhopal, MP",
    tag: "Institutional",
    deadline: "Apr 2, 2026",
  },
  {
    type: "PPP",
    value: "₹14 Cr",
    title: "Smart City Road & Drainage Improvement Works — Zone 3",
    org: "BHOPAL Smart City Ltd",
    loc: "Bhopal, MP",
    tag: "Infrastructure",
    deadline: "Mar 20, 2026",
  },
];

const typeStyles = {
  Government:
    "bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-[0_2px_10px_rgba(16,185,129,0.1)]",
  Private:
    "bg-blue-50 text-blue-700 border-blue-200/60 shadow-[0_2px_10px_rgba(59,130,246,0.1)]",
  PPP: "bg-purple-50 text-purple-700 border-purple-200/60 shadow-[0_2px_10px_rgba(168,85,247,0.1)]",
};

export function Tenders() {
  return (
<section className="bg-[#fdfaf6] py-24 relative overflow-hidden shadow-inner">
      {/* Background radial gradient for depth */}
      <div className="absolute top-0 inset-x-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {/* 🔴 Live Blinking Dot */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
              </span>

              {/* Text */}
              <span>
                Live Tenders{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
                  Bid Now
                </span>
              </span>
            </h2>

            {/* <p className="text-slate-500 mt-2 font-medium">
      Connect with verified professionals and specialized agencies.
    </p> */}
          </div>

          <a
            href="#"
            className="group flex items-center gap-2 bg-white text-primary px-7 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-xl border border-slate-200 hover:border-primary hover:-translate-y-1"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        {/* Smart Filters Bar (Glassy Floating) */}
<div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-slate-200 p-6 mb-12 
shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] 
ring-1 ring-slate-200/60 
flex flex-wrap gap-4 items-center relative z-20">
          <div className="flex items-center gap-2 text-slate-400 px-4 border-r border-slate-200">
            <Filter className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Filters
            </span>
          </div>

          {[
            {
              label: "Tender Type",
              opts: ["All Types", "Government", "Private", "PPP"],
            },
            {
              label: "Category",
              opts: ["All Categories", "Building", "Road", "Electrical"],
            },
            {
              label: "State",
              opts: ["All India", "MP", "Maharashtra", "Delhi"],
            },
          ].map((f) => (
            <div key={f.label} className="flex-1 min-w-[140px]">
              <div className="relative group">
                <select className="w-full bg-slate-50/50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold text-primary focus:ring-2 focus:ring-accent/20 focus:bg-white appearance-none cursor-pointer transition-all">
                  <option>{f.label}</option>
                  {f.opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
              </div>
            </div>
          ))}

          <div className="relative flex-[2] min-w-[250px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
            <input
              placeholder="Search by ID, Organization..."
              className="w-full bg-primary text-white placeholder:text-white/40 rounded-2xl pl-12 pr-5 py-3.5 text-sm border border-transparent focus:border-white/20 focus:bg-[#1e3a5f] shadow-[0_10px_20px_rgba(22,38,70,0.15)] transition-all outline-none"
            />
          </div>
        </div>

        {/* Tenders Grid - Premium Cards */}
        <div className="grid lg:grid-cols-2 gap-5">
          {tenders.map((t, idx) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 
      border border-slate-200 hover:border-accent/50 
      shadow-sm hover:shadow-lg 
      hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

              {/* Top Section */}
              <div className="relative z-10 flex justify-between items-center mb-4">
                <div
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border ${typeStyles[t.type]}`}
                >
                  {t.type}
                </div>

                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">
                    Value
                  </p>
                  <p className="text-lg font-bold text-primary">{t.value}</p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-800 group-hover:text-accent transition mb-4 line-clamp-2">
                {t.title}
              </h3>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium truncate">{t.org}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{t.loc}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{t.tag}</span>
                </div>

                <div className="flex items-center gap-2 text-red-500 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.deadline}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      className="w-7 h-7 rounded-full border border-white"
                      alt="bidder"
                    />
                  ))}
                  <div className="h-7 px-2 rounded-full bg-white text-[9px] flex items-center font-bold text-slate-400">
                    12+
                  </div>
                </div>

                <button className="bg-primary text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-accent transition flex items-center gap-1">
                  Bid <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
