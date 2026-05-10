import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Building2, MapPin, Star, Phone, Mail, ExternalLink, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/_dashboard/companies")({
  component: CompaniesPage,
});

const COMPANIES = [
  { id: 1, name: "Buildtech Constructions",  type: "Contractor",  location: "Mumbai",  rating: 4.8, reviews: 124, services: ["Civil Work", "MEP", "Road Construction"],    verified: true,  phone: "+91 98200 11111", email: "info@buildtech.in"   },
  { id: 2, name: "Apex Consultants",         type: "Consultant",  location: "Delhi",   rating: 4.6, reviews: 89,  services: ["PMC", "Cost Estimation", "Project Planning"], verified: true,  phone: "+91 98110 22222", email: "hello@apexconsult.in" },
  { id: 3, name: "SteelMart Suppliers",      type: "Supplier",    location: "Nagpur",  rating: 4.3, reviews: 56,  services: ["Steel", "Cement", "Plumbing"],                verified: false, phone: "+91 97300 33333", email: "sales@steelmart.in"  },
  { id: 4, name: "Indore PMC Group",         type: "Consultant",  location: "Indore",  rating: 4.7, reviews: 102, services: ["PMC", "Architectural Design"],                verified: true,  phone: "+91 96400 44444", email: "contact@indorepmc.in"},
  { id: 5, name: "Pune Interior Studio",     type: "Contractor",  location: "Pune",    rating: 4.5, reviews: 73,  services: ["Interior Fitout", "Architectural Design"],    verified: true,  phone: "+91 95500 55555", email: "studio@puneint.in"   },
  { id: 6, name: "Bhopal Audit Services",    type: "Consultant",  location: "Bhopal",  rating: 4.2, reviews: 41,  services: ["Safety Audit", "Quality Audit"],              verified: false, phone: "+91 94600 66666", email: "audit@bhopalaudit.in"},
];

const TYPE_COLOR: Record<string, string> = {
  Contractor: "bg-indigo-50 text-indigo-700",
  Consultant: "bg-violet-50 text-violet-700",
  Supplier:   "bg-cyan-50 text-cyan-700",
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
});

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = COMPANIES.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-black text-slate-900">Company Directory</h1>
        <p className="mt-1 text-sm text-slate-500">Find verified contractors, consultants, and suppliers.</p>
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp(1)} className="flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm min-w-[200px]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies…"
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {["all", "Contractor", "Consultant", "Supplier"].map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                typeFilter === f
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
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
          <motion.div key={c.id} {...fadeUp(i + 2)}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-black text-lg">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-bold text-slate-900">{c.name}</h3>
                  {c.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-indigo-500" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLOR[c.type]}`}>{c.type}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="h-3 w-3" />{c.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-800">{c.rating}</span>
              <span className="text-xs text-slate-400">({c.reviews} reviews)</span>
            </div>

            {/* Services */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.services.slice(0, 3).map((s) => (
                <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{s}</span>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:${c.phone}`} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
              <a href={`mailto:${c.email}`} className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors">
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Building2 className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-semibold">No companies found</p>
        </div>
      )}
    </div>
  );
}
