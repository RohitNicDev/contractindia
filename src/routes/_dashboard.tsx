import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, FileText, FolderOpen,
  Building2, MessageSquare, Settings, LogOut,
  Bell, Search, ChevronLeft, Menu, X, Sparkles,
} from "lucide-react";
import logo from "../assets/IMG/logo_con1.png";

const NAV_ITEMS = [
  { to: "/dashboard",           label: "Overview",   icon: LayoutDashboard },
  { to: "/dashboard/tenders",   label: "Tenders",    icon: FileText        },
  { to: "/dashboard/projects",  label: "Projects",   icon: FolderOpen      },
  { to: "/dashboard/companies", label: "Companies",  icon: Building2       },
  { to: "/dashboard/messages",  label: "Messages",   icon: MessageSquare, badge: 3 },
  { to: "/dashboard/profile",   label: "Profile",    icon: User            },
  { to: "/dashboard/settings",  label: "Settings",   icon: Settings        },
];

const NAV_GRADIENTS: Record<string, string> = {
  "/dashboard":           "from-indigo-500 to-violet-500",
  "/dashboard/tenders":   "from-cyan-500 to-blue-500",
  "/dashboard/projects":  "from-violet-500 to-purple-500",
  "/dashboard/companies": "from-emerald-500 to-teal-500",
  "/dashboard/messages":  "from-pink-500 to-rose-500",
  "/dashboard/profile":   "from-amber-500 to-orange-500",
  "/dashboard/settings":  "from-slate-400 to-slate-500",
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");
  const displayName = user.fullName || "User";
  const email = user.email || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("login_mock_v1");
    localStorage.removeItem("otp_mock_verified_v1");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-linear-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">

      {/* ── Ambient background blobs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-400/15 blur-[120px]" />
        <div className="absolute right-[-80px] top-[30%] h-[400px] w-[400px] rounded-full bg-violet-400/15 blur-[120px]" />
        <div className="absolute bottom-[-60px] left-[35%] h-[350px] w-[350px] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
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
          bg-white/80 backdrop-blur-2xl border-r border-indigo-100/60
          shadow-[4px_0_24px_rgba(99,102,241,0.06)]
          lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 lg:transition-none
        `}
      >
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/40 to-transparent" />

        {/* Logo */}
        <div className={`flex h-16 shrink-0 items-center border-b border-indigo-100/60 px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-indigo-400/20 blur-md" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-100">
              <img src={logo} alt="ContractIndia" className="h-7 w-7 rounded-lg object-contain" />
            </div>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="whitespace-nowrap text-sm font-bold text-slate-900">ContractIndia</p>
                <p className="whitespace-nowrap text-[10px] text-indigo-500/70">Pro Dashboard</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 [scrollbar-width:none]">
          {!collapsed && (
            <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </p>
          )}
          <ul className="space-y-0.5 px-2">
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
                      ${active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-100"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {!active && (
                      <span className="absolute inset-0 rounded-xl bg-transparent transition-colors duration-200 group-hover:bg-slate-50/80" />
                    )}
                    <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                      active ? `bg-linear-to-br ${grad} shadow-md` : "bg-slate-100/80 group-hover:bg-slate-100"
                    }`}>
                      <Icon className={`h-3.5 w-3.5 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} />
                    </span>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="relative z-10 flex-1 whitespace-nowrap font-semibold"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {badge && !collapsed && (
                      <span className="relative z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                        {badge}
                      </span>
                    )}
                    {active && (
                      <span className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-linear-to-b ${grad}`} />
                    )}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
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
        <div className="shrink-0 border-t border-indigo-100/60 p-3 space-y-1">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-1 flex items-center gap-2.5 rounded-xl border border-indigo-100/60 bg-white/70 backdrop-blur-xl shadow-[0_4px_24px_rgba(99,102,241,0.08)] px-3 py-2.5">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                    {initials}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800">{displayName}</p>
                    <p className="truncate text-[10px] text-slate-400">{email}</p>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleSignOut}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-500 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-indigo-100 bg-white shadow-md transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 lg:flex"
        >
          <ChevronLeft className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </motion.aside>

      {/* ── Main area ── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 bg-white/80 backdrop-blur-xl border-b border-indigo-100/60 shadow-[0_2px_12px_rgba(99,102,241,0.06)] px-4 sm:px-6">
          <button
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-3.5 py-2 max-w-sm transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects…"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:block">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 shadow-sm"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
            </motion.button>
            <div className="hidden items-center gap-2 rounded-xl border border-indigo-100/80 bg-indigo-50/60 backdrop-blur-xl px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
              <span className="text-xs font-semibold text-indigo-700">
                {NAV_ITEMS.find(n => pathname === n.to || (n.to !== "/dashboard" && pathname.startsWith(n.to)))?.label ?? "Dashboard"}
              </span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-[0_0_16px_rgba(99,102,241,0.35)] transition-shadow hover:shadow-[0_0_24px_rgba(99,102,241,0.55)]"
              >
                {initials}
              </Link>
            </motion.div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-linear-to-br from-slate-50 via-indigo-50/20 to-violet-50/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
