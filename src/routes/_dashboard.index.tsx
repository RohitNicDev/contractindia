import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, FolderOpen, Building2, IndianRupee, ArrowUpRight, TrendingUp, Users, Zap } from "lucide-react";

const stats = [
  { label: "Active Tenders",   value: "12",     delta: "+3 this week",  icon: FileText,    grad: "from-indigo-500 to-violet-500",  corner: "bg-indigo-400/10"  },
  { label: "Live Projects",    value: "5",      delta: "+1 this month", icon: FolderOpen,  grad: "from-violet-500 to-purple-600",  corner: "bg-violet-400/10"  },
  { label: "Companies",        value: "48",     delta: "+8 new",        icon: Building2,   grad: "from-cyan-500 to-blue-500",      corner: "bg-cyan-400/10"    },
  { label: "Total Bids",       value: "₹2.4Cr", delta: "+12%",          icon: IndianRupee, grad: "from-emerald-500 to-teal-500",   corner: "bg-emerald-400/10" },
];

const recentTenders = [
  { id: "T-001", title: "Road Construction — NH-48 Stretch",   status: "open",    value: "₹45L",  deadline: "Jun 15", grad: "from-emerald-500 to-teal-400"  },
  { id: "T-002", title: "MEP Works — Commercial Complex Pune", status: "review",  value: "₹18L",  deadline: "Jun 20", grad: "from-amber-500 to-orange-400"  },
  { id: "T-003", title: "Structural Audit — IT Park Bhopal",   status: "awarded", value: "₹8.5L", deadline: "Jun 10", grad: "from-indigo-500 to-violet-400"  },
  { id: "T-004", title: "Interior Fitout — Hotel Mumbai",      status: "open",    value: "₹32L",  deadline: "Jul 2",  grad: "from-emerald-500 to-teal-400"  },
];

const statusConfig: Record<string, { label: string; dot: string; cls: string }> = {
  open:    { label: "Open",    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]",  cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  review:  { label: "Review",  dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]",    cls: "text-amber-700 bg-amber-50 border-amber-200"       },
  awarded: { label: "Awarded", dot: "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.7)]",   cls: "text-indigo-700 bg-indigo-50 border-indigo-200"    },
};

const quickActions = [
  { to: "/dashboard/tenders",   icon: FileText,   label: "Browse Tenders",   sub: "Find new opportunities", grad: "from-indigo-500 to-violet-500", glow: "rgba(99,102,241,0.2)"  },
  { to: "/dashboard/projects",  icon: FolderOpen, label: "My Projects",       sub: "Track active work",      grad: "from-violet-500 to-purple-500", glow: "rgba(139,92,246,0.2)"  },
  { to: "/dashboard/companies", icon: Building2,  label: "Company Directory", sub: "Find partners",          grad: "from-cyan-500 to-blue-500",     glow: "rgba(6,182,212,0.2)"   },
  { to: "/dashboard/profile",   icon: Users,      label: "Update Profile",    sub: "Complete your listing",  grad: "from-emerald-500 to-teal-500",  glow: "rgba(16,185,129,0.2)"  },
];

const fu = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300";

export default function DashboardOverview() {
  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");
  const firstName = user.fullName?.split(" ")[0] || "there";

  return (
    <div className="min-h-full p-6 space-y-6">

      {/* Greeting banner */}
      <motion.div {...fu(0)} className={`relative overflow-hidden ${glassCard} p-6`}>
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-violet-500/8 to-cyan-400/6 rounded-2xl" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-violet-400/15 blur-2xl" />
        <div className="absolute left-1/2 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-indigo-400/40 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Welcome back</p>
            <h1 className="mt-1 text-2xl font-black bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
              Good morning, {firstName} 👋
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">Here's what's happening with your account today.</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-2 rounded-xl border border-indigo-200/60 bg-indigo-50/80 px-4 py-2">
              <Zap className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-600">Pro Account</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fu(i + 1)}
            whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(99,102,241,0.15)" }}
            className={`relative overflow-hidden ${glassCard} p-5 hover:border-indigo-200/60`}
          >
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${s.corner} blur-2xl`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{s.value}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <p className="text-[11px] font-semibold text-emerald-600">{s.delta}</p>
                </div>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${s.grad} shadow-lg`}>
                <s.icon className="h-5 w-5 text-white" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Tenders + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fu(5)} className={`lg:col-span-2 overflow-hidden ${glassCard}`}>
          <div className="flex items-center justify-between border-b border-indigo-100/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 shadow-md">
                <FileText className="h-3.5 w-3.5 text-white" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">Recent Tenders</h2>
            </div>
            <Link to="/dashboard/tenders"
              className="flex items-center gap-1 rounded-lg border border-indigo-200/60 bg-indigo-50/80 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100/80"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100/60">
            {recentTenders.map((t, i) => {
              const s = statusConfig[t.status];
              return (
                <motion.div key={t.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, ease: "easeOut" }}
                  className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-indigo-50/30"
                >
                  <div className={`h-8 w-1 shrink-0 rounded-full bg-linear-to-b ${t.grad}`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.id} · Due {t.deadline}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-slate-700">{t.value}</span>
                  <span className={`shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div {...fu(6)} className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-white" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
          </div>
          {quickActions.map((a) => (
            <motion.div key={a.to} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link to={a.to}
                className={`group flex items-center gap-3 ${glassCard} p-3.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 hover:border-indigo-200/60`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${a.grad} shadow-md transition-transform duration-200 group-hover:scale-110`}
                  style={{ boxShadow: `0 4px 12px ${a.glow}` }}
                >
                  <a.icon className="h-4 w-4 text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{a.label}</p>
                  <p className="text-xs text-slate-500">{a.sub}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-200 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
