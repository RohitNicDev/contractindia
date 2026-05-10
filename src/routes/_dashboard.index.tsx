import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText, FolderOpen, Building2,
  ArrowUpRight, Clock, IndianRupee, Users,
} from "lucide-react";

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardOverview,
});

const stats = [
  { label: "Active Tenders",   value: "12",     delta: "+3 this week",  icon: FileText,    color: "indigo"  },
  { label: "Live Projects",    value: "5",      delta: "+1 this month", icon: FolderOpen,  color: "violet"  },
  { label: "Companies Listed", value: "48",     delta: "+8 new",        icon: Building2,   color: "cyan"    },
  { label: "Total Bids",       value: "₹2.4Cr", delta: "+12%",          icon: IndianRupee, color: "emerald" },
];

const recentTenders = [
  { id: "T-001", title: "Road Construction — NH-48 Stretch",   status: "open",    value: "₹45L",  deadline: "Jun 15" },
  { id: "T-002", title: "MEP Works — Commercial Complex Pune", status: "review",  value: "₹18L",  deadline: "Jun 20" },
  { id: "T-003", title: "Structural Audit — IT Park Bhopal",   status: "awarded", value: "₹8.5L", deadline: "Jun 10" },
  { id: "T-004", title: "Interior Fitout — Hotel Mumbai",      status: "open",    value: "₹32L",  deadline: "Jul 2"  },
];

const statusConfig: Record<string, { label: string; cls: string }> = {
  open:    { label: "Open",    cls: "bg-emerald-50 text-emerald-700" },
  review:  { label: "Review",  cls: "bg-amber-50 text-amber-700"    },
  awarded: { label: "Awarded", cls: "bg-indigo-50 text-indigo-700"  },
  closed:  { label: "Closed",  cls: "bg-slate-100 text-slate-500"   },
};

const colorMap: Record<string, string> = {
  indigo:  "bg-indigo-50 text-indigo-600",
  violet:  "bg-violet-50 text-violet-600",
  cyan:    "bg-cyan-50 text-cyan-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.07, ease: "easeOut" as const },
});

export default function DashboardOverview() {
  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      {/* <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-black text-slate-900">
          Good morning, {user.fullName?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here's what's happening with your account today.</p>
      </motion.div> */}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i + 1)}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
                <p className="mt-1.5 text-2xl font-black text-slate-900">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-emerald-600">{s.delta}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[s.color]}`}>
                <s.icon className="h-5 w-5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Tenders + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tenders table */}
        <motion.div {...fadeUp(5)} className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-bold text-slate-800">Recent Tenders</h2>
            <Link to="/dashboard/tenders" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentTenders.map((t) => {
              const s = statusConfig[t.status];
              return (
                <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.id} · Due {t.deadline}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-slate-700">{t.value}</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fadeUp(6)} className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>
          {[
            { to: "/dashboard/tenders",   icon: FileText,   label: "Browse Tenders",   sub: "Find new opportunities", color: "indigo"  },
            { to: "/dashboard/projects",  icon: FolderOpen, label: "My Projects",       sub: "Track active work",      color: "violet"  },
            { to: "/dashboard/companies", icon: Building2,  label: "Company Directory", sub: "Find partners",          color: "cyan"    },
            { to: "/dashboard/profile",   icon: Users,      label: "Update Profile",    sub: "Complete your listing",  color: "emerald" },
          ].map((a) => (
            <Link key={a.to} to={a.to}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorMap[a.color]}`}>
                <a.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{a.label}</p>
                <p className="text-xs text-slate-400">{a.sub}</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
