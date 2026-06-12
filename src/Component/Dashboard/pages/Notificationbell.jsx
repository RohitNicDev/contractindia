/**
 * NotificationBell
 * Click the bell to open/close the notification panel (top-right).
 *
 * Props:
 *   notifications   Notification[]   list of notification objects
 *   onMarkRead      (id) => void
 *   onMarkAllRead   () => void
 *   onDelete        (id) => void
 *   onClearAll      () => void
 *
 * Notification shape:
 *   { id, type, title, message, time, read }
 *   type: "info" | "success" | "warning" | "error"
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, X, CheckCheck, Trash2, Info,
  CheckCircle2, AlertTriangle, XCircle,
  Settings, ArrowRight,
} from "lucide-react";

/* ── Default demo notifications ─────────────────────────────────────────── */
const DEFAULT_NOTIFICATIONS = [
  { id: 1,  type: "success", title: "Payment received",         message: "₹2,500 credited for Consulting Service booking.",        time: "2 min ago",   read: false },
  { id: 2,  type: "info",    title: "New lead assigned",         message: "Hospital Project lead has been assigned to you.",        time: "18 min ago",  read: false },
  { id: 3,  type: "warning", title: "Subscription expiring",    message: "Your Basic Plan expires in 3 days. Renew to continue.",  time: "1 hr ago",    read: false },
  { id: 4,  type: "error",   title: "Profile incomplete",       message: "Add your GST number to unlock all features.",           time: "3 hrs ago",   read: false },
  { id: 5,  type: "info",    title: "New contractor enquiry",   message: "BlueWater Consultants replied to your enquiry.",        time: "Yesterday",   read: true  },
  { id: 6,  type: "success", title: "Profile updated",          message: "Your company profile changes were saved successfully.", time: "2 days ago",  read: true  },
  { id: 7,  type: "info",    title: "Newsletter available",     message: "May 2026 Construction Market Insights is ready.",       time: "3 days ago",  read: true  },
];

/* ── Type config ─────────────────────────────────────────────────────────── */
const TYPE_CFG = {
  success: {
    icon:   CheckCircle2,
    dot:    "bg-emerald-500",
    iconCl: "text-emerald-600",
    bg:     "bg-emerald-50",
    border: "border-emerald-200",
  },
  info: {
    icon:   Info,
    dot:    "bg-blue-500",
    iconCl: "text-blue-600",
    bg:     "bg-blue-50",
    border: "border-blue-200",
  },
  warning: {
    icon:   AlertTriangle,
    dot:    "bg-amber-500",
    iconCl: "text-amber-600",
    bg:     "bg-amber-50",
    border: "border-amber-200",
  },
  error: {
    icon:   XCircle,
    dot:    "bg-red-500",
    iconCl: "text-red-600",
    bg:     "bg-red-50",
    border: "border-red-200",
  },
};

/* ── Single notification row ─────────────────────────────────────────────── */
function NotificationItem({ notif, onMarkRead, onDelete }) {
  const cfg   = TYPE_CFG[notif.type] ?? TYPE_CFG.info;
  const Icon  = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex gap-3 px-4 py-3.5 transition-colors cursor-pointer ${
        notif.read ? "hover:bg-slate-50/70" : "bg-white hover:bg-slate-50/80"
      }`}
      onClick={() => !notif.read && onMarkRead(notif.id)}
    >
      {/* Unread dot */}
      {!notif.read && (
        <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border} mt-0.5`}>
        <Icon className={`w-4 h-4 ${cfg.iconCl}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] leading-snug truncate ${notif.read ? "font-medium text-slate-600" : "font-bold text-slate-900"}`}>
          {notif.title}
        </p>
        <p className="text-[11.5px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
          {notif.message}
        </p>
        <p className="text-[10.5px] text-slate-400 mt-1 font-medium">{notif.time}</p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 mt-0.5"
        aria-label="Delete notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/* ── Notification panel ──────────────────────────────────────────────────── */
function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onDelete, onClearAll, onClose }) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  const displayed = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{   opacity: 0, y: -8,  scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed right-4 top-16 w-[360px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 z-[1001] overflow-hidden flex flex-col"
      style={{ maxHeight: "520px" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-black text-slate-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors ml-1"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 flex-shrink-0">
        {["all", "unread"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`h-7 px-3 rounded-lg text-[11.5px] font-bold transition-all capitalize ${
              filter === tab
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {tab === "unread" ? `Unread (${unreadCount})` : "All"}
          </button>
        ))}
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="ml-auto flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* ── List ── */}
      <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
        <AnimatePresence initial={false}>
          {displayed.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 px-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-500">
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {filter === "unread" ? "You're all caught up!" : "We'll notify you when something happens."}
              </p>
            </motion.div>
          ) : (
            displayed.map(notif => (
              <NotificationItem
                key={notif.id}
                notif={notif}
                onMarkRead={onMarkRead}
                onDelete={onDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
          <p className="text-[11px] text-slate-400 font-medium">
            {notifications.length} total · {unreadCount} unread
          </p>
          <button className="flex items-center gap-1 text-[11.5px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ── Main NotificationBell component ─────────────────────────────────────── */
const NotificationBell = ({
  initialNotifications = DEFAULT_NOTIFICATIONS,
  onNotificationClick,
}) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen]                   = useState(false);
  const wrapperRef                        = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Handlers */
  const markRead = useCallback((id) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    onNotificationClick?.(id);
  }, [onNotificationClick]);

  const markAllRead = useCallback(() => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotif = useCallback((id) => {
    setNotifications(p => p.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setOpen(false);
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-50">
      {/* Bell trigger button */}
      <button
        onClick={() => setOpen(p => !p)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-150 ${
          open
            ? "border-indigo-300 bg-indigo-50 text-indigo-600"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
        }`}
      >
        <Bell className="w-4 h-4" />

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[9px] font-black border-2 border-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <NotificationPanel
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onDelete={deleteNotif}
            onClearAll={clearAll}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
export default NotificationBell;