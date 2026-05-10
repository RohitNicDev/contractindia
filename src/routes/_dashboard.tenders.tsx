import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, MapPin, IndianRupee, Clock, ArrowUpRight, Bookmark } from "lucide-react";

export const Route = createFileRoute("/_dashboard/tenders")({
  component: TendersPage,
});

const TENDERS = [
  { id: "T-001", title: "Road Construction — NH-48 Stretch, Delhi",        category: "Civil Work",       value: "₹45L",  deadline: "Jun 15, 2026", location: "Delhi",   status: "open",    topGrad: "from-emerald-400 to-teal-400"   },
  { id: "T-002", title: "MEP Works — Commercial Complex, Pune",             category: "MEP",              value: "₹18L",  deadline: "Jun 20, 2026", location: "Pune",    status: "review",  topGrad: "from-amber-400 to-orange-400"   },
  { id: "T-003", title: "Structural Audit — IT Park, Bhopal",               category: "Safety Audit",     value: "₹8.5L", deadline: "Jun 10, 2026", location: "Bhopal",  status: "awarded", topGrad: "from-indigo-400 to-violet-400"  },
  { id: "T-004", title: "Interior Fitout — 5-Star Hotel, Mumbai",           category: "Interior Fitout",  value: "₹32L",  deadline: "Jul 2, 2026",  location: "Mumbai",  status: "open",    topGrad: "from-emerald-400 to-teal-400"   },
  { id: "T-005", title: "Procurement — Cement & Steel, Nagpur",             category: "Procurement",      value: "₹12L",  deadline: "Jul 8, 2026",  location: "Nagpur",  status: "open",    topGrad: "from-cyan-400 to-blue-400"      },
  { id: "T-006", title: "Project Management — Residential Township, Indore",category: "PMC",              value: "₹22L",  deadline: "Jul 15, 2026", location: "Indore",  status: "open",    topGrad: "from-violet-400 to-purple-400"  },
  { id: "T-007", title: "Electrical Works — Industrial Plant, Gwalior",     category: "MEP",              value: "₹9L",   deadline: "Jun 28, 2026", location: "Gwalior", status: "review",  topGrad: "from-amber-400 to-orange-400"   },
  { id: "T-008", title: "Architectural Design — Mixed-Use Complex, Nashik",  category: "Architectural",   value: "₹15L",  deadline: "Jul 20, 2026", location: "Nashik",  status: "open",    topGrad: "from-pink-400 to-rose-400"      },
];

const STATUS = {
  open:    { label: "Open",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  review:  { label: "Review",  cls: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500"   },
  awarded: { label: "Awarded", cls: "bg-indigo-50 text-indigo-700 border-indigo-200",    dot: "bg-indigo-500"  },
};

const fu = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300";

export default function TendersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = TENDERS.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div {...fu(0)}>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md">
            <FileText className="h-4 w-4 text-white" />
          </span>
          <h1 className="text-2xl font-black text-slate-900">Tenders</h1>
        </div>
        {/* Gradient accent line */}
        <div className="ml-11 h-0.5 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mb-1" />
        <p className="mt-1 text-sm text-slate-600">Browse and bid on active tenders across India.</p>
      </motion.div>

      {/* Filters */}
      <motion.div {...fu(1)} className="flex flex-wrap items-center gap-3">
        {/* Glass search input */}
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-3 py-2.5 shadow-sm min-w-[200px] transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenders…"
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        {/* Filter pills */}
        <div className="flex gap-2">
          {["all", "open", "review", "awarded"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "border-indigo-300 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
                  : "border-slate-200/80 bg-white/70 backdrop-blur-xl text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tender cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t, i) => {
          const s = STATUS[t.status as keyof typeof STATUS];
          return (
            <motion.div key={t.id} {...fu(i + 2)}
              whileHover={{ y: -2 }}
              className={`group overflow-hidden ${glassCard} hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] hover:border-indigo-200/60`}
            >
              {/* Gradient top border line */}
              <div className={`h-1 w-full bg-gradient-to-r ${t.topGrad}`} />

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                  <button className="text-slate-300 hover:text-indigo-500 transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-800 leading-snug line-clamp-2">{t.title}</h3>
                <p className="mt-1 text-xs font-semibold text-indigo-600">{t.category}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-emerald-500" />{t.value}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-amber-500" />{t.deadline}</span>
                  <span className="flex items-center gap-1.5 col-span-2"><MapPin className="h-3.5 w-3.5 text-slate-400" />{t.location}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2 text-xs font-bold text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] transition-shadow"
                >
                  View Details <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <motion.div {...fu(2)} className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 mb-4 shadow-sm">
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No tenders found</p>
          <p className="text-xs mt-1 text-slate-400">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
