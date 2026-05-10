import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileText, MapPin, IndianRupee, Clock, ArrowUpRight, Bookmark } from "lucide-react";

export const Route = createFileRoute("/_dashboard/tenders")({
  component: TendersPage,
});

const TENDERS = [
  { id: "T-001", title: "Road Construction — NH-48 Stretch, Delhi",       category: "Civil Work",       value: "₹45L",  deadline: "Jun 15, 2026", location: "Delhi",       status: "open"    },
  { id: "T-002", title: "MEP Works — Commercial Complex, Pune",            category: "MEP",              value: "₹18L",  deadline: "Jun 20, 2026", location: "Pune",        status: "review"  },
  { id: "T-003", title: "Structural Audit — IT Park, Bhopal",              category: "Safety Audit",     value: "₹8.5L", deadline: "Jun 10, 2026", location: "Bhopal",      status: "awarded" },
  { id: "T-004", title: "Interior Fitout — 5-Star Hotel, Mumbai",          category: "Interior Fitout",  value: "₹32L",  deadline: "Jul 2, 2026",  location: "Mumbai",      status: "open"    },
  { id: "T-005", title: "Procurement — Cement & Steel, Nagpur",            category: "Procurement",      value: "₹12L",  deadline: "Jul 8, 2026",  location: "Nagpur",      status: "open"    },
  { id: "T-006", title: "Project Management — Residential Township, Indore",category: "PMC",             value: "₹22L",  deadline: "Jul 15, 2026", location: "Indore",      status: "open"    },
  { id: "T-007", title: "Electrical Works — Industrial Plant, Gwalior",    category: "MEP",              value: "₹9L",   deadline: "Jun 28, 2026", location: "Gwalior",     status: "review"  },
  { id: "T-008", title: "Architectural Design — Mixed-Use Complex, Nashik", category: "Architectural",   value: "₹15L",  deadline: "Jul 20, 2026", location: "Nashik",      status: "open"    },
];

const STATUS = {
  open:    { label: "Open",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  review:  { label: "Review",  cls: "bg-amber-50 text-amber-700 border-amber-200"      },
  awarded: { label: "Awarded", cls: "bg-indigo-50 text-indigo-700 border-indigo-200"   },
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
});

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
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-black text-slate-900">Tenders</h1>
        <p className="mt-1 text-sm text-slate-500">Browse and bid on active tenders across India.</p>
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp(1)} className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm min-w-[200px]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenders…"
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {["all", "open", "review", "awarded"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
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
            <motion.div key={t.id} {...fadeUp(i + 2)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>{s.label}</span>
                <button className="text-slate-300 hover:text-indigo-500 transition-colors">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-800 leading-snug line-clamp-2">{t.title}</h3>
              <p className="mt-1 text-xs font-medium text-indigo-600">{t.category}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-emerald-500" />{t.value}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-amber-500" />{t.deadline}</span>
                <span className="flex items-center gap-1.5 col-span-2"><MapPin className="h-3.5 w-3.5 text-slate-400" />{t.location}</span>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700">
                View Details <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FileText className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-semibold">No tenders found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
