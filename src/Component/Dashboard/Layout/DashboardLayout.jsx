/**
 * DashboardLayout — shared shell for Individual & Commercial dashboards
 *
 * Props:
 *   navItems       NavItem[]        sidebar links
 *   activeTab      string           current active nav key
 *   onTabChange    (key) => void    called when a nav item is clicked
 *   user           { name, email, role, avatar? }
 *   onSignOut      () => void       triggers logout popup
 *   badge          string           top-right badge label (e.g. "Individual Account")
 *   badgeColor     "indigo"|"blue"  badge accent
 *   children       ReactNode        page content area
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogOut, Bell, Zap, ChevronDown } from "lucide-react";
import LogoutPopup from "../../common/Logoutpopup";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
export const glass =
  "rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)]";

export const glassCard =
  "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)]";

/* ── Avatar with initials ─────────────────────────────────────────────────── */
export function Avatar({ name = "U", size = 36, className = "" }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const palettes = [
    ["#eef2ff", "#4338ca"],
    ["#f0fdf4", "#15803d"],
    ["#fdf4ff", "#9333ea"],
    ["#fff7ed", "#c2410c"],
    ["#eff6ff", "#1d4ed8"],
    ["#fef3c7", "#b45309"],
  ];
  const [bg, fg] = palettes[(name.charCodeAt(0) || 0) % palettes.length];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl font-bold flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </span>
  );
}

/* ── Status badge ─────────────────────────────────────────────────────────── */
export function StatusBadge({ label, color = "indigo" }) {
  const map = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    blue: "bg-blue-50   text-blue-700   border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50  text-amber-700  border-amber-100",
    red: "bg-red-50    text-red-600    border-red-200",
    slate: "bg-slate-100 text-slate-500  border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${map[color] ?? map.slate}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

/* ── Section header ───────────────────────────────────────────────────────── */
export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  accent = "indigo",
}) {
  const accents = {
    indigo: "from-indigo-500 to-violet-500",
    blue: "from-blue-500   to-indigo-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500  to-orange-400",
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent] ?? accents.indigo} shadow-md flex-shrink-0`}
      >
        <Icon className="h-4 w-4 text-white" />
      </span>
      <div>
        <h2 className="text-base font-black text-slate-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ── Form field helpers ───────────────────────────────────────────────────── */
export function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[10px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

export function TextInput({ label, error, textarea, rows = 3, ...props }) {
  const base =
    "w-full rounded-xl border px-3.5 text-sm outline-none transition-all bg-white placeholder-slate-300 " +
    (error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100");

  return (
    <FormField label={label} error={error}>
      {textarea ? (
        <textarea
          rows={rows}
          className={`${base} py-2.5 resize-none`}
          {...props}
        />
      ) : (
        <input className={`${base} h-10`} {...props} />
      )}
    </FormField>
  );
}

/* ── Main DashboardLayout ─────────────────────────────────────────────────── */
export default function DashboardLayout({
  navItems = [],
  activeTab,
  onTabChange,
  user = { name: "User", email: "", role: "Account" },
  onSignOut,
  badge = "Account",
  badgeColor = "indigo",
  notifications = 0,
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const badgeStyles = {
    indigo: "border-indigo-100 bg-indigo-50/60 text-indigo-700",
    blue: "border-blue-100   bg-blue-50/60   text-blue-700",
  };

  const sidebarActiveStyle = {
    indigo:
      "from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-100",
    blue: "from-blue-50   to-indigo-50  text-blue-700   border border-blue-100/80",
  };

  const gradientBg = {
    indigo: "from-slate-50 via-indigo-50/30 to-violet-50/20",
    blue: "from-slate-50 via-blue-50/20   to-indigo-50/10",
  };

  const activeDot = {
    indigo: "bg-indigo-500",
    blue: "bg-blue-500",
  };

  return (
    <div
      className={`flex h-screen overflow-hidden bg-gradient-to-br ${gradientBg[badgeColor] ?? gradientBg.indigo}`}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-[120px]" />
        <div className="absolute right-[-80px] top-[30%] h-[400px] w-[400px] rounded-full bg-violet-400/10 blur-[120px]" />
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col bg-white/90 backdrop-blur-2xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(99,102,241,0.06)] lg:relative transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* User identity */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-4 flex-shrink-0">
          <Avatar name={user.name} size={36} className="shadow-sm" />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate">
              {user.name}
            </p>
            <p
              className={`text-[10px] font-semibold ${badgeColor === "blue" ? "text-blue-500" : "text-indigo-500"}`}
            >
              {user.role}
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, subMenu }) => {
            const isActive =
              activeTab === id ||
              (subMenu && subMenu.some((s) => s.id === activeTab));
            const hasSubMenu = subMenu && subMenu.length > 0;
            const [subOpen, setSubOpen] = useState(isActive && hasSubMenu);

            return (
              <div key={id}>
                <button
                  onClick={() => {
                    if (hasSubMenu) {
                      setSubOpen((o) => !o);
                    } else {
                      onTabChange(id);
                      setMobileOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${sidebarActiveStyle[badgeColor] ?? sidebarActiveStyle.indigo} shadow-sm`
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left truncate">{label}</span>
                  {hasSubMenu && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${subOpen ? "rotate-180" : ""}`}
                    />
                  )}
                  {!hasSubMenu && isActive && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeDot[badgeColor]}`}
                    />
                  )}
                </button>

                {/* Sub-menu */}
                {hasSubMenu && subOpen && (
                  <div className="mt-0.5 ml-4 pl-2 border-l border-slate-100 space-y-0.5">
                    {subMenu.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          onTabChange(sub.id);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all ${
                          activeTab === sub.id
                            ? `${badgeColor === "blue" ? "bg-blue-50 text-blue-700" : "bg-indigo-50 text-indigo-700"}`
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        {sub.icon && (
                          <sub.icon className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="border-t border-slate-100 p-3 flex-shrink-0">
          <button
            onClick={() => setLogoutOpen(true)}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center gap-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 flex-shrink-0">
          {/* Mobile toggle */}
          <button
            className="lg:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${activeDot[badgeColor]}`}
            />
            <h2 className="text-sm font-bold text-slate-700">
              {navItems
                .flatMap((n) => (n.subMenu ? [n, ...n.subMenu] : [n]))
                .find((n) => n.id === activeTab)?.label ?? "Dashboard"}
            </h2>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
              )}
            </button>
            {/* <NotificationBell /> */}
            {/* Account badge */}
            <span
              className={`hidden sm:flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold ${badgeStyles[badgeColor] ?? badgeStyles.indigo}`}
            >
              <Zap className="h-3.5 w-3.5" />
              {badge}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout popup */}
      <LogoutPopup
        open={logoutOpen}
        user={user}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={async () => {
          setLogoutOpen(false);
          await onSignOut?.();
        }}
      />
    </div>
  );
}
