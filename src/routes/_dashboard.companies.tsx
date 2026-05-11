import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Building2, MapPin, Star, Phone, Mail, BadgeCheck, Users } from "lucide-react";

const COMPANIES = [
  { id: 1, name: "Buildtech Constructions", type: "Contractor", location: "Mumbai", rating: 4.8, reviews: 124, services: ["Civil Work", "MEP", "Road Construction"],    verified: true,  phone: "+91 98200 11111", email: "info@buildtech.in",    grad: "from-indigo-500 to-violet-500",  initGrad: "from-indigo-400 to-violet-400"  },
  { id: 2, name: "Apex Consultants",        type: "Consultant", location: "Delhi",  rating: 4.6, reviews: 89,  services: ["PMC", "Cost Estimation", "Project Planning"], verified: true,  phone: "+91 98110 22222", email: "hello@apexconsult.in", grad: "from-violet-500 to-purple-500",  initGrad: "from-violet-400 to-purple-400"  },
  { id: 3, name: "SteelMart Suppliers",     type: "Supplier",   location: "Nagpur", rating: 4.3, reviews: 56,  services: ["Steel", "Cement", "Plumbing"],                verified: false, phone: "+91 97300 33333", email: "sales@steelmart.in",  grad: "from-cyan-500 to-blue-500",      initGrad: "from-cyan-400 to-blue-400"      },
  { id: 4, name: "Indore PMC Group",        type: "Consultant", location: "Indore", rating: 4.7, reviews: 102, services: ["PMC", "Architectural Design"],                verified: true,  phone: "+91 96400 44444", email: "contact@indorepmc.in",grad: "from-emerald-500 to-teal-500",   initGrad: "from-emerald-400 to-teal-400"   },
  { id: 5, name: "Pune Interior Studio",    type: "Contractor", location: "Pune",   rating: 4.5, reviews: 73,  services: ["Interior Fitout", "Architectural Design"],    verified: true,  phone: "+91 95500 55555", email: "studio@puneint.in",   grad: "from-pink-500 to-rose-500",      initGrad: "from-pink-400 to-rose-400"      },
  { id: 6, name: "Bhopal Audit Services",   type: "Consultant", location: "Bhopal", rating: 4.2, reviews: 41,  services: ["Safety Audit", "Quality Audit"],              verified: false, phone: "+91 94600 66666", email: "audit@bhopalaudit.in",grad: "from-amber-500 to-orange-500",   initGrad: "from-amber-400 to-orange-400"   },
];

const TYPE_CLS: Record<string, string> = {
  Contractor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Consultant: "bg-violet-50 text-violet-700 border-violet-200",
  Supplier:   "bg-cyan-50 text-cyan-700 border-cyan-200",
};

const fu = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
});

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = COMPANIES.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.services.some(s => s.toLowerCase().includes(q));
    return matchSearch && (typeFilter === "all" || c.type === typeFilter);
  });

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <motion.div {...fu(0)}>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.35)]">
            <Building2 className="h-4.5 w-4.5 text-white" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Company Directory</h1>
            <div className="h-0.5 w-20 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 mt-0.5" />
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 ml-12">Find verified contractors, consultants, and suppliers.</p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fu(1)} className="grid grid-cols-4 gap-3">
        {[
          { label: "Total",       count: COMPANIES.length,                                          grad: "from-indigo-500 to-violet-500"  },
          { label: "Contractors", count: COMPANIES.filter(c => c.type === "Contractor").length,     grad: "from-indigo-500 to-blue-500"    },
          { label: "Consultants", count: COMPANIES.filter(c => c.type === "Consultant").length,     grad: "from-violet-500 to-purple-500"  },
          { label: "Verified",    count: COMPANIES.filter(c => c.verified).length,                  grad: "from-emerald-500 to-teal-500"   },
        ].map((s) => (
          <div key={s.label} className={`${glassCard} p-3 text-center hover:shadow-[0_6px_20px_rgba(99,102,241,0.12)] hover:-translate-y-0.5`}>
            <p className={`text-xl font-black bg-linear-to-br ${s.grad} bg-clip-text text-transparent`}>{s.count}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div {...fu(2)} className="flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-3.5 py-2.5 shadow-sm min-w-[220px] transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, location, service…"
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {["all", "Contractor", "Consultant", "Supplier"].map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                typeFilter === f
                  ? "border-indigo-300 bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
                  : "border-slate-200/80 bg-white/70 backdrop-blur-xl text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Company cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className={`${glassCard} overflow-hidden hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] hover:border-indigo-200/60`}
          >
            {/* Gradient top line */}
            <div className={`h-1 w-full bg-linear-to-r ${c.grad}`} />

            <div className="p-5">
              <div className="flex items-start gap-3">
                {/* Gradient avatar */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${c.initGrad} text-white font-black text-lg shadow-md`}>
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold text-slate-900">{c.name}</h3>
                    {c.verified && (
                      <BadgeCheck className="h-4 w-4 shrink-0 text-indigo-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${TYPE_CLS[c.type]}`}>
                      {c.type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3" />{c.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`h-3 w-3 ${star <= Math.floor(c.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{c.rating}</span>
                <span className="text-xs text-slate-400">({c.reviews} reviews)</span>
              </div>

              {/* Services */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.services.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-slate-100/80 border border-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {s}
                  </span>
                ))}
              </div>

              {/* Contact */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={`tel:${c.phone}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/60 transition-all"
                >
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
                <motion.a
                  href={`mailto:${c.email}`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 py-2 text-xs font-bold text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.45)] transition-shadow"
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div {...fu(2)} className="flex flex-col items-center justify-center py-24">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-100 to-teal-100 mb-5 shadow-sm">
            <Building2 className="h-10 w-10 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-slate-700">No companies found</p>
          <p className="text-sm mt-1 text-slate-400">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
