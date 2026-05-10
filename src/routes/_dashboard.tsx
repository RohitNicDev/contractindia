import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  FileText,
  FolderOpen,
  Building2,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  Menu,
  X,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import logo from "../assets/IMG/logo_con1.png";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});

const NAV_ITEMS = [
  { to: "/dashboard",           label: "Overview",   icon: LayoutDashboard },
  { to: "/dashboard/tenders",   label: "Tenders",    icon: FileText },
  { to: "/dashboard/projects",  label: "Projects",   icon: FolderOpen },
  { to: "/dashboard/companies", label: "Companies",  icon: Building2 },
  { to: "/dashboard/messages",  label: "Messages",   icon: MessageSquare, badge: 3 },
  { to: "/dashboard/profile",   label: "Profile",    icon: User },
  { to: "/dashboard/settings",  label: "Settings",   icon: Settings },
];

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");
  const displayName = user.fullName || "User";
  const email = user.email || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-slate-200 bg-white shadow-sm
          lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 lg:transition-none
        `}
      >
        {/* Logo */}
        <div className={`flex h-16 shrink-0 items-center border-b border-slate-100 px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
          <img src={logo} alt="ContractIndia" className="h-8 w-8 rounded-xl object-contain shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="whitespace-nowrap text-sm font-bold text-slate-900">ContractIndia</p>
                <p className="whitespace-nowrap text-[10px] text-slate-400">Dashboard</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => {
              const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                      text-sm font-medium transition-all duration-150
                      ${active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-indigo-50"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <Icon className={`relative z-10 h-4.5 w-4.5 shrink-0 ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative z-10 flex-1 whitespace-nowrap"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {badge && !collapsed && (
                      <span className="relative z-10 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="shrink-0 border-t border-slate-100 p-3">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800">{displayName}</p>
                <p className="truncate text-[10px] text-slate-400">{email}</p>
              </div>
            </div>
          )}
          <Link
            to="/login"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </Link>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-600 lg:flex"
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </motion.aside>

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          {/* Mobile menu toggle */}
          <button
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 max-w-sm">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search tenders, projects…"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <button className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600" />
            </button>

            {/* Avatar */}
            <Link to="/dashboard/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white hover:ring-2 hover:ring-indigo-300 transition-all">
              {initials}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
