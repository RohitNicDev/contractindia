import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, MapPin, IndianRupee, Clock, ArrowUpRight, Bookmark, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/_dashboard/tenders")({
  component: TendersPage,
});

const TENDERS = [
  { id: "T-001", title: "Road Construction — NH-48 Stretch, Delhi",         category: "Civil Work",      value: "₹45L",  deadline: "Jun 15, 2026", location: "Delhi",   status: "open",    topGrad: "from-emerald-400 to-teal-400"  },
  { id: "T-002", title: "MEP Works — Commercial Complex, Pune",              category: "MEP",             value: "₹18L",  deadline: "Jun 20, 2026", location: "Pune",    status: "review",  topGrad: "from-amber-400 to-orange-400"  },
  { id: "T-003", title: "Structural Audit — IT Park, Bhopal",                category: "Safety Audit",    value: "₹8.5L", deadline: "Jun 10, 2026", location: "Bhopal",  status: "awarded", topGrad: "from-indigo-400 to-violet-400" },
  { id: "T-004", title: "Interior Fitout — 5-Star Hotel, Mumbai",            category: "Interior Fitout", value: "₹32L",  deadline: "Jul 2, 2026",  location: "Mumbai",  status: "open",    topGrad: "from-emerald-400 to-teal-400"  },
  { id: "T-005", title: "Procurement — Cement & Steel, Nagpur",              category: "Procurement",     value: "₹12L",  deadline: "Jul 8, 2026",  location: "Nagpur",  status: "open",    topGrad: "from-cyan-400 to-blue-400"     },
  { id: "T-006", title: "Project Management — Residential Township, Indore", category: "PMC",             value: "₹22L",  deadline: "Jul 15, 2026", location: "Indore",  status: "open",    topGrad: "from-violet-400 to-purple-400" },
  { id: "T-007", title: "Electrical Works — Industrial Plant, Gwalior",      category: "MEP",             value: "₹9L",   deadline: "Jun 28, 2026", location: "Gwalior", status: "review",  topGrad: "from-amber-400 to-orange-400"  },
  { id: "T-008", title: "Architectural Design — Mixed-Use Complex, Nashik",  category: "Architectural",   value: "₹15L",  deadline: "Jul 20, 2026", location: "Nashik",  status: "open",    topGrad: "from-pink-400 to-rose-400"     },
];

const STATUS = {
  open:    { label: "Open",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"  },
  review:  { label: "Review",  cls: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"    },
  awarded: { label: "Awarded", cls: "bg-indigo-50 text-indigo-700 border-indigo-200",    dot: "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]"   },
};

const FILTERS = ["all", "open", "review", "awarded"];

const fu = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
});

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300";

export default function TendersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const filtered = TENDERS.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q);
    return matchSearch && (filter === "all" || t.status === filter);
  });

  const toggleBookmark = (id: string) =>
    setBookmarked((b) => b.includes(id) ? b.filter((x) => x !== id) : [...b, id]);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <motion.div {...fu(0)}>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_4px_12px_rgba(99,102,241,0.35)]">
            <FileText className="h-4.5 w-4.5 text-white" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Tenders</h1>
            <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mt-0.5" />
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 ml-12">Browse and bid on active tenders across India.</p>
      </motion.div>

      {/* Stats strip */}
      <motion.div {...fu(1)} className="grid grid-cols-4 gap-3">
        {[
          { label: "Total",    count: TENDERS.length,                                      grad: "from-indigo-500 to-violet-500"  },
          { label: "Open",     count: TENDERS.filter(t => t.status === "open").length,     grad: "from-emerald-500 to-teal-500"   },
          { label: "Review",   count: TENDERS.filter(t => t.status === "review").length,   grad: "from-amber-500 to-orange-400"   },
          { label: "Awarded",  count: TENDERS.filter(t => t.status === "awarded").length,  grad: "from-violet-500 to-purple-500"  },
        ].map((s) => (
          <div key={s.label} className={`${glassCard} p-3 text-center hover:shadow-[0_6px_20px_rgba(99,102,241,0.12)] hover:-translate-y-0.5`}>
            <p className={`text-xl font-black bg-gradient-to-br ${s.grad} bg-clip-text text-transparent`}>{s.count}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search + filters */}
      <motion.div {...fu(2)} className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-3.5 py-2.5 shadow-sm min-w-[220px] transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, location…"
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 transition-colors text-xs">✕</button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
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

      {/* Cards grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t, i) => {
            const s = STATUS[t.status as keyof typeof STATUS];
            const isBookmarked = bookmarked.includes(t.id);
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                className={`group overflow-hidden ${glassCard} hover:shadow-[0_12px_40px_rgba(99,102,241,0.18)] hover:border-indigo-200/60`}
              >
                {/* Gradient top border */}
                <div className={`h-1 w-full bg-gradient-to-r ${t.topGrad}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      onClick={() => toggleBookmark(t.id)}
                      className={`transition-colors ${isBookmarked ? "text-indigo-500" : "text-slate-300 hover:text-indigo-400"}`}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-indigo-500" : ""}`} />
                    </motion.button>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-slate-900 transition-colors">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-indigo-600">{t.category}</p>

                  <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50">
                        <IndianRupee className="h-3 w-3 text-emerald-600" />
                      </span>
                      <span className="font-semibold text-slate-700">{t.value}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-50">
                        <Clock className="h-3 w-3 text-amber-600" />
                      </span>
                      {t.deadline}
                    </span>
                    <span className="col-span-2 flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">
                        <MapPin className="h-3 w-3 text-slate-500" />
                      </span>
                      {t.location}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] transition-shadow"
                  >
                    View Details <ArrowUpRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div {...fu(2)} className="flex flex-col items-center justify-center py-24">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 mb-5 shadow-sm">
            <FileText className="h-10 w-10 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-slate-700">No tenders found</p>
          <p className="text-sm mt-1 text-slate-400">Try adjusting your search or filters</p>
          <button onClick={() => { setSearch(""); setFilter("all"); }}
            className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
