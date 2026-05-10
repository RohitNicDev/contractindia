import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, FileText, FolderOpen,
  Building2, MessageSquare, Settings, LogOut,
  Bell, Search, ChevronLeft, Menu, X, Sparkles,
} from "lucide-react";
import logo from "../assets/IMG/logo_con1.png";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});

const NAV_ITEMS = [
  { to: "/dashboard",           label: "Overview",   icon: LayoutDashboard },
  { to: "/dashboard/tenders",   label: "Tenders",    icon: FileText        },
  { to: "/dashboard/projects",  label: "Projects",   icon: FolderOpen      },
  { to: "/dashboard/companies", label: "Companies",  icon: Building2       },
  { to: "/dashboard/messages",  label: "Messages",   icon: MessageSquare, badge: 3 },
  { to: "/dashboard/profile",   label: "Profile",    icon: User            },
  { to: "/dashboard/settings",  label: "Settings",   icon: Settings        },
];

/* ── gradient map per nav item ── */
const NAV_GRADIENTS: Record<string, string> = {
  "/dashboard":           "from-indigo-500 to-violet-500",
  "/dashboard/tenders":   "from-cyan-500 to-blue-500",
  "/dashboard/projects":  "from-violet-500 to-purple-500",
  "/dashboard/companies": "from-emerald-500 to-teal-500",
  "/dashboard/messages":  "from-pink-500 to-rose-500",
  "/dashboard/profile":   "from-amber-500 to-orange-500",
  "/dashboard/settings":  "from-slate-500 to-slate-600",
};

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");
  const displayName = user.fullName || "User";
  const email = user.email || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: "#0f1117" }}>

      {/* ── Ambient background blobs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute right-[-80px] top-[30%] h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-60px] left-[35%] h-[350px] w-[350px] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 248 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-white/[0.08]
          lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 lg:transition-none
        `}
        style={{
          background: "linear-gradient(180deg, rgba(15,17,23,0.98) 0%, rgba(20,22,35,0.98) 100%)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* Logo */}
        <div className={`flex h-16 shrink-0 items-center border-b border-white/[0.06] px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-indigo-500/30 blur-md" />
            <img src={logo} alt="ContractIndia" className="relative h-8 w-8 rounded-xl object-contain" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="whitespace-nowrap text-sm font-bold text-white">ContractIndia</p>
                <p className="whitespace-nowrap text-[10px] text-indigo-300/70">Pro Dashboard</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 [scrollbar-width:none]">
          {!collapsed && (
            <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Navigation
            </p>
          )}
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => {
              const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
              const grad = NAV_GRADIENTS[to];
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                      text-sm font-medium transition-all duration-200
                      ${active ? "text-white" : "text-slate-400 hover:text-white"}
                    `}
                  >
                    {/* Active background */}
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${grad} opacity-20`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {/* Hover background */}
                    {!active && (
                      <span className="absolute inset-0 rounded-xl bg-white/0 transition-colors duration-200 group-hover:bg-white/[0.05]" />
                    )}

                    {/* Icon with gradient bg when active */}
                    <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                      active
                        ? `bg-gradient-to-br ${grad} shadow-lg`
                        : "bg-white/[0.06] group-hover:bg-white/[0.1]"
                    }`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="relative z-10 flex-1 whitespace-nowrap"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {badge && !collapsed && (
                      <span className="relative z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                        {badge}
                      </span>
                    )}

                    {/* Active left bar */}
                    {active && (
                      <span className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b ${grad}`} />
                    )}

                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User card + Logout */}
        <div className="shrink-0 border-t border-white/[0.06] p-3 space-y-1">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-1 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-md">
                    {initials}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f1117] bg-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">{displayName}</p>
                    <p className="truncate text-[10px] text-slate-500">{email}</p>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            to="/login"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </Link>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-800 shadow-lg transition-all hover:border-indigo-500/50 hover:bg-indigo-500/20 hover:text-indigo-300 lg:flex"
        >
          <ChevronLeft className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </motion.aside>

      {/* ── Main area ── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header
          className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] px-4 sm:px-6"
          style={{
            background: "rgba(15,17,23,0.85)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Mobile toggle */}
          <button
            className="rounded-xl border border-white/10 bg-white/[0.05] p-2 text-slate-400 transition-colors hover:bg-white/[0.1] hover:text-white lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* Search */}
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 max-w-sm transition-all focus-within:border-indigo-500/40 focus-within:bg-white/[0.07]">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="text"
              placeholder="Search tenders, projects…"
              className="flex-1 bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-600"
            />
            <kbd className="hidden rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-slate-500 sm:block">⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
            </motion.button>

            {/* Page title pill */}
            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-semibold text-slate-300">
                {NAV_ITEMS.find(n => pathname === n.to || (n.to !== "/dashboard" && pathname.startsWith(n.to)))?.label ?? "Dashboard"}
              </span>
            </div>

            {/* Avatar */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-[0_0_16px_rgba(99,102,241,0.4)] transition-shadow hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]"
              >
                {initials}
              </Link>
            </motion.div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "linear-gradient(135deg, #0f1117 0%, #131520 50%, #0f1117 100%)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
