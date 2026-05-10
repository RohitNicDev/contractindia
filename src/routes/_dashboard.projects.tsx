import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FolderOpen, Plus, Calendar, Users, TrendingUp,
  MoreHorizontal, CheckCircle2, AlertCircle, Clock,
} from "lucide-react";

export const Route = createFileRoute("/_dashboard/projects")({
  component: ProjectsPage,
});

const PROJECTS = [
  {
    id: "P-001", title: "NH-48 Road Construction",
    client: "NHAI", progress: 65, status: "active",
    team: 8, deadline: "Aug 30, 2026", value: "₹45L",
    tags: ["Civil Work", "Road"],
    grad: "from-indigo-500 to-violet-500",
  },
  {
    id: "P-002", title: "Sunrise IT Park — MEP",
    client: "Sunrise Developers", progress: 30, status: "active",
    team: 5, deadline: "Oct 15, 2026", value: "₹18L",
    tags: ["MEP", "Electrical"],
    grad: "from-cyan-500 to-blue-500",
  },
  {
    id: "P-003", title: "Hotel Grand Interior Fitout",
    client: "Grand Hotels Pvt Ltd", progress: 100, status: "completed",
    team: 12, deadline: "May 1, 2026", value: "₹32L",
    tags: ["Interior", "Fitout"],
    grad: "from-emerald-500 to-teal-500",
  },
  {
    id: "P-004", title: "Residential Township PMC",
    client: "Indore Housing Board", progress: 15, status: "active",
    team: 4, deadline: "Dec 20, 2026", value: "₹22L",
    tags: ["PMC", "Residential"],
    grad: "from-violet-500 to-purple-500",
  },
  {
    id: "P-005", title: "Industrial Plant Electrical",
    client: "Gwalior Steel Ltd", progress: 50, status: "on-hold",
    team: 6, deadline: "Sep 10, 2026", value: "₹9L",
    tags: ["Electrical", "Industrial"],
    grad: "from-amber-500 to-orange-400",
  },
];

const STATUS_CONFIG = {
  active:    { label: "Active",    icon: TrendingUp,   cls: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "from-indigo-500 to-violet-500",  tagCls: "bg-indigo-50 text-indigo-700 border-indigo-100"   },
  completed: { label: "Completed", icon: CheckCircle2, cls: "bg-indigo-50 text-indigo-700 border-indigo-200",    bar: "from-emerald-500 to-teal-400",   tagCls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  "on-hold": { label: "On Hold",   icon: AlertCircle,  cls: "bg-amber-50 text-amber-700 border-amber-200",       bar: "from-amber-400 to-orange-400",   tagCls: "bg-amber-50 text-amber-700 border-amber-100"      },
};

const fu = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300";

export default function ProjectsPage() {
  const active    = PROJECTS.filter(p => p.status === "active").length;
  const completed = PROJECTS.filter(p => p.status === "completed").length;
  const onHold    = PROJECTS.filter(p => p.status === "on-hold").length;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <motion.div {...fu(0)} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-[0_4px_12px_rgba(139,92,246,0.35)]">
              <FolderOpen className="h-4.5 w-4.5 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Projects</h1>
              <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 mt-0.5" />
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-500 ml-12">Track and manage all your active projects.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] transition-shadow"
        >
          <Plus className="h-4 w-4" /> New Project
        </motion.button>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active",    count: active,    grad: "from-indigo-500 to-violet-500",  bg: "bg-indigo-50/60",  border: "border-indigo-100" },
          { label: "Completed", count: completed, grad: "from-emerald-500 to-teal-500",   bg: "bg-emerald-50/60", border: "border-emerald-100" },
          { label: "On Hold",   count: onHold,    grad: "from-amber-500 to-orange-400",   bg: "bg-amber-50/60",   border: "border-amber-100"  },
        ].map((s, i) => (
          <motion.div key={s.label} {...fu(i + 1)}
            whileHover={{ y: -2 }}
            className={`rounded-2xl backdrop-blur-xl border ${s.border} ${s.bg} shadow-[0_4px_24px_rgba(99,102,241,0.06)] p-5 text-center transition-all duration-300 hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)]`}
          >
            <p className={`text-3xl font-black bg-gradient-to-br ${s.grad} bg-clip-text text-transparent`}>{s.count}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {PROJECTS.map((p, i) => {
          const s = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG];
          return (
            <motion.div key={p.id} {...fu(i + 4)}
              whileHover={{ y: -2 }}
              className={`${glassCard} overflow-hidden hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] hover:border-indigo-200/60`}
            >
              {/* Gradient top accent */}
              <div className={`h-1 w-full bg-gradient-to-r ${p.grad}`} />

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{p.client} · {p.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>
                      <s.icon className="h-3 w-3" />
                      {s.label}
                    </span>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-slate-700">{p.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${s.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" as const }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50">
                      <Users className="h-3 w-3 text-indigo-500" />
                    </span>
                    {p.team} members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-50">
                      <Calendar className="h-3 w-3 text-violet-500" />
                    </span>
                    {p.deadline}
                  </span>
                  <span className="font-bold text-slate-700">{p.value}</span>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span key={tag} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.tagCls}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
