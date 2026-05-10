import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FolderOpen, Plus, Calendar, Users, TrendingUp, MoreHorizontal, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_dashboard/projects")({
  component: ProjectsPage,
});

const PROJECTS = [
  {
    id: "P-001", title: "NH-48 Road Construction",
    client: "NHAI", progress: 65, status: "active",
    team: 8, deadline: "Aug 30, 2026", value: "₹45L",
    tags: ["Civil Work", "Road"],
  },
  {
    id: "P-002", title: "Sunrise IT Park — MEP",
    client: "Sunrise Developers", progress: 30, status: "active",
    team: 5, deadline: "Oct 15, 2026", value: "₹18L",
    tags: ["MEP", "Electrical"],
  },
  {
    id: "P-003", title: "Hotel Grand Interior Fitout",
    client: "Grand Hotels Pvt Ltd", progress: 100, status: "completed",
    team: 12, deadline: "May 1, 2026", value: "₹32L",
    tags: ["Interior", "Fitout"],
  },
  {
    id: "P-004", title: "Residential Township PMC",
    client: "Indore Housing Board", progress: 15, status: "active",
    team: 4, deadline: "Dec 20, 2026", value: "₹22L",
    tags: ["PMC", "Residential"],
  },
  {
    id: "P-005", title: "Industrial Plant Electrical",
    client: "Gwalior Steel Ltd", progress: 50, status: "on-hold",
    team: 6, deadline: "Sep 10, 2026", value: "₹9L",
    tags: ["Electrical", "Industrial"],
  },
];

const STATUS_CONFIG = {
  active:    { label: "Active",    icon: TrendingUp,   cls: "bg-emerald-50 text-emerald-700", bar: "bg-indigo-500"  },
  completed: { label: "Completed", icon: CheckCircle2, cls: "bg-indigo-50 text-indigo-700",   bar: "bg-emerald-500" },
  "on-hold": { label: "On Hold",   icon: AlertCircle,  cls: "bg-amber-50 text-amber-700",     bar: "bg-amber-400"   },
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
});

export default function ProjectsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div {...fadeUp(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Track and manage all your active projects.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active",    count: PROJECTS.filter(p => p.status === "active").length,    color: "text-indigo-600"  },
          { label: "Completed", count: PROJECTS.filter(p => p.status === "completed").length, color: "text-emerald-600" },
          { label: "On Hold",   count: PROJECTS.filter(p => p.status === "on-hold").length,   color: "text-amber-600"   },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i + 1)}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center"
          >
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {PROJECTS.map((p, i) => {
          const s = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG];
          return (
            <motion.div key={p.id} {...fadeUp(i + 4)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{p.client} · {p.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>{s.label}</span>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-500">Progress</span>
                  <span className="text-xs font-bold text-slate-700">{p.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <motion.div
                    className={`h-2 rounded-full ${s.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{p.team} members</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{p.deadline}</span>
                <span className="font-bold text-slate-700">{p.value}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">{tag}</span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
