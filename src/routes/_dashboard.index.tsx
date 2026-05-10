import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText, FolderOpen, Building2, IndianRupee,
  ArrowUpRight, TrendingUp, Users, Zap,
} from "lucide-react";

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardOverview,
});

const stats = [
  {
    label: "Active Tenders", value: "12", delta: "+3 this week",
    icon: FileText, grad: "from-indigo-500 to-violet-500", glow: "rgba(99,102,241,0.35)",
  },
  {
    label: "Live Projects", value: "5", delta: "+1 this month",
    icon: FolderOpen, grad: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.35)",
  },
  {
    label: "Companies", value: "48", delta: "+8 new",
    icon: Building2, grad: "from-cyan-500 to-blue-500", glow: "rgba(6,182,212,0.35)",
  },
  {
    label: "Total Bids", value: "₹2.4Cr", delta: "+12%",
    icon: IndianRupee, grad: "from-emerald-500 to-teal-500", glow: "rgba(16,185,129,0.35)",
  },
];

const recentTenders = [
  { id: "T-001", title: "Road Construction — NH-48 Stretch",   status: "open",    value: "₹45L",  deadline: "Jun 15", grad: "from-emerald-500 to-teal-400" },
  { id: "T-002", title: "MEP Works — Commercial Complex Pune", status: "review",  value: "₹18L",  deadline: "Jun 20", grad: "from-amber-500 to-orange-400"  },
  { id: "T-003", title: "Structural Audit — IT Park Bhopal",   status: "awarded", value: "₹8.5L", deadline: "Jun 10", grad: "from-indigo-500 to-violet-400"  },
  { id: "T-004", title: "Interior Fitout — Hotel Mumbai",      status: "open",    value: "₹32L",  deadline: "Jul 2",  grad: "from-emerald-500 to-teal-400"  },
];

const statusConfig: Record<string, { label: string; dot: string; cls: string }> = {
  open:    { label: "Open",    dot: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",  cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  review:  { label: "Review",  dot: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]",    cls: "text-amber-400 bg-amber-400/10 border-amber-400/20"       },
  awarded: { label: "Awarded", dot: "bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)]",  cls: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"    },
};

const quickActions = [
  { to: "/dashboard/tenders",   icon: FileText,   label: "Browse Tenders",   sub: "Find new opportunities", grad: "from-indigo-500 to-violet-500", glow: "rgba(99,102,241,0.3)"  },
  { to: "/dashboard/projects",  icon: FolderOpen, label: "My Projects",       sub: "Track active work",      grad: "from-violet-500 to-purple-500", glow: "rgba(139,92,246,0.3)"  },
  { to: "/dashboard/companies", icon: Building2,  label: "Company Directory", sub: "Find partners",          grad: "from-cyan-500 to-blue-500",     glow: "rgba(6,182,212,0.3)"   },
  { to: "/dashboard/profile",   icon: Users,      label: "Update Profile",    sub: "Complete your listing",  grad: "from-emerald-500 to-teal-500",  glow: "rgba(16,185,129,0.3)"  },
];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});

/* Reusable glass card style */
const glassCard = "rounded-2xl border border-white/[0.08] backdrop-blur-xl";
const glassCardBg = "bg-white/[0.04]";

export default function DashboardOverview() {
  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");
  const firstName = user.fullName?.split(" ")[0] || "there";

  return (
    <div className="min-h-full p-6 space-y-6">

      {/* ── Greeting banner ── */}
      <motion.div {...fadeUp(0)}
        className={`relative overflow-hidden ${glassCard} p-6`}
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.10) 50%, rgba(6,182,212,0.08) 100%)" }}
      >
        {/* Glow orbs inside banner */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Welcome back</p>
            <h1 className="mt-1 text-2xl font-black text-white">
              Good morning, {firstName} 👋
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">Pro Account</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i + 1)}
            className={`relative overflow-hidden ${glassCard} ${glassCardBg} p-5 transition-all duration-300 hover:border-white/[0.15] hover:-translate-y-0.5`}
            style={{ boxShadow: `0 0 0 0 ${s.glow}` }}
            whileHover={{ boxShadow: `0 8px 32px ${s.glow}` }}
          >
            {/* Corner glow */}
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${s.grad} opacity-20 blur-2xl`} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{s.value}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <p className="text-[11px] font-semibold text-emerald-400">{s.delta}</p>
                </div>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} shadow-lg`}>
                <s.icon className="h-5 w-5 text-white" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Recent Tenders + Quick Actions ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Tenders table */}
        <motion.div {...fadeUp(5)}
          className={`lg:col-span-2 overflow-hidden ${glassCard} ${glassCardBg}`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                <FileText className="h-3.5 w-3.5 text-white" />
              </span>
              <h2 className="text-sm font-bold text-white">Recent Tenders</h2>
            </div>
            <Link to="/dashboard/tenders"
              className="flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {recentTenders.map((t, i) => {
              const s = statusConfig[t.status];
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, ease: "easeOut" }}
                  className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
                >
                  {/* Color bar */}
                  <div className={`h-8 w-1 shrink-0 rounded-full bg-gradient-to-b ${t.grad}`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{t.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.id} · Due {t.deadline}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-slate-300">{t.value}</span>
                  <span className={`shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fadeUp(6)} className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Zap className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
          </div>
          {quickActions.map((a) => (
            <motion.div key={a.to} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link to={a.to}
                className={`group flex items-center gap-3 ${glassCard} ${glassCardBg} p-3.5 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.07]`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${a.grad} shadow-lg transition-transform duration-200 group-hover:scale-110`}
                  style={{ boxShadow: `0 4px 12px ${a.glow}` }}
                >
                  <a.icon className="h-4 w-4 text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{a.label}</p>
                  <p className="text-xs text-slate-500">{a.sub}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-all duration-200 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
