import { useState, useRef, useEffect, } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard, User, CreditCard, History, Briefcase, Eye,
  List, FileText, Settings, LogOut, Menu, X, Plus, CheckCircle2,
  Upload, ChevronDown, Zap, ToggleLeft, ToggleRight, Key,
  TrendingUp, ArrowUpRight, Shield, FolderOpen, Building2,
  Trash2, Bell, Search, CircleDot,
  Layers3,
  ChevronRight,
  Check,
} from "lucide-react";
import SettingsPanel from "./SettingsPanel";
import ProfileWizard from "./pages/ProfileWizard";
import { useProfileWizardStore, calculateProgress } from "../../store/profileWizardStore";
import { SERVICES_HIERARCHY } from "../../data/services_hierarchy";
import { Input } from "antd";
import ServiceListing from "./pages/ServiceListing";
import SubscriptionHistory from "./pages/SubscriptionHistory";
import ClientsHistory from "./pages/ClientsHistory";
import LeadManagement from "./pages/LeadManagement";
import MyCredits from "./pages/MyCredits";
import PlansAndSubscriptions from "./pages/PlansAndSubscriptions";
import { btnPrimary } from "../uiUtiles";

// ─── Design tokens ────────────────────────────────────────────────────────────
export const glass = "rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)]";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  // { id: "payments", label: "Payment History", icon: History },
  { id: "subscription", label: "Subscription History", icon: Briefcase },
  // { id: "plans", label: "Plans & Subscriptions", icon: Briefcase },
  // { id: "credits", label: "My Credits", icon: CreditCard },
  { id: "clients", label: "Client History", icon: User },
  { id: "leads", label: "Lead Management", icon: List },
  { id: "services", label: "Service Listing", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Portal Multi-Select Dropdown (escapes overflow:hidden) ───────────────────
function PortalDropdown({ options, selected, onToggle, color, bg, border }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const openDropdown = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX, width: rect.width });
    setOpen(true);
  };

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const visibleChips = selected.slice(0, 2);
  const extra = selected.length - 2;

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => open ? setOpen(false) : openDropdown()}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm transition-all"
        style={{ border: `1.5px solid ${open ? color : border}`, background: open ? bg : "#fff" }}
      >
        <span className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selected.length === 0
            ? <span className="text-slate-400 text-xs">Select documents to upload…</span>
            : <>
              {visibleChips.map(s => (
                <span key={s} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                  style={{ background: bg, color, borderColor: border }}>
                  {s === "Other" ? "+ Other" : s}
                </span>
              ))}
              {extra > 0 && <span className="text-[11px] font-bold" style={{ color }}>+{extra} more</span>}
            </>
          }
        </span>
        <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-200"
          style={{ color, transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {/* Portal panel — renders in <body>, escapes any overflow:hidden parent */}
      {open && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: pos.top, left: pos.left, width: pos.width,
              zIndex: 99999, background: "#fff", border: `1.5px solid ${border}`,
              borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.13)",
              overflow: "hidden",
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {options.map(opt => {
                const checked = selected.includes(opt);
                const isOther = opt === "Other";
                return (
                  <button key={opt} type="button" onClick={() => onToggle(opt)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left border-b border-slate-50 last:border-0 transition-colors"
                    style={{ background: checked ? bg : "transparent" }}>
                    <span className="w-[17px] h-[17px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all"
                      style={{ borderColor: checked ? color : "#d1d5db", background: checked ? color : "#fff" }}>
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5l2 2L8 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-xs" style={{ fontWeight: isOther ? 700 : 500, color: isOther ? color : "#374151" }}>
                      {isOther ? "+ Other (specify name)" : opt}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="p-2.5 border-t" style={{ borderColor: border }}>
              <button type="button" onClick={() => setOpen(false)}
                className="w-full py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{ background: bg, color }}>Done ✓</button>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}



// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const name = user.companyName || user.contactPerson || "there";


  const stats = [
    { label: "Credits", value: "₹500", sub: "+₹200 this month", grad: "from-blue-500 to-indigo-500", icon: CreditCard, up: true },
    { label: "Active Leads", value: "12", sub: "3 new this week", grad: "from-emerald-500 to-teal-500", icon: List, up: true },
    { label: "Clients", value: "8", sub: "2 inactive", grad: "from-amber-500 to-orange-400", icon: User, up: false },
    { label: "Services", value: "5", sub: "All active", grad: "from-violet-500 to-purple-500", icon: Briefcase, up: true },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${glass} p-6`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-indigo-500/6 to-violet-400/4 rounded-2xl" />
        <div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-blue-300/10 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-blue-500">Welcome back</p>
            <h1 className="mt-1 text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
              Hello,
              {/* {name}  */}
              👋
            </h1>
            {/* <p className="mt-1.5 text-sm text-slate-500">
              {user.email && <span className="mr-3">📧 {user.email}</span>}
              {user.mobile && <span>📱 {user.mobile}</span>}
            </p> */}
            {user.services?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(Array.isArray(user.services) ? user.services : [user.services]).map(s => (
                  <span key={s} className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white text-xl font-black shrink-0">
            {(user.companyName || user.contactPerson || "C").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`${glass} p-5 group cursor-pointer`}>
            <div className="flex items-start justify-between mb-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} shadow-md`}>
                <s.icon className="h-5 w-5 text-white" />
              </span>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                <ArrowUpRight className={`w-3.5 h-3.5 ${!s.up && "rotate-90"}`} />{s.up ? "+" : ""}
              </span>
            </div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{s.value}</p>
            <p className="mt-0.5 text-[10.5px] text-slate-400">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <div className={`${glass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Recent Activity
          </h3>
          <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
        </div>
        <div className="space-y-2.5">
          {[
            { dot: "bg-emerald-400", text: "New lead from Rajesh Kumar", time: "2 hrs ago" },
            { dot: "bg-blue-400", text: "Payment of ₹1,000 received", time: "Yesterday" },
            { dot: "bg-violet-400", text: "Profile updated successfully", time: "2 days ago" },
            { dot: "bg-amber-400", text: "Subscription renewed – Pro", time: "3 days ago" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <span className={`w-2 h-2 rounded-full shrink-0 ${a.dot}`} />
              <span className="text-sm text-slate-700 flex-1">{a.text}</span>
              <span className="text-[10.5px] text-slate-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Add Credits ──────────────────────────────────────────────────────────────
function AddCredits() {
  const [credits, setCredits] = useState(500);
  const [amt, setAmt] = useState("");

  const add = () => {
    const n = parseInt(amt);
    if (!n || n <= 0) { toast.error("Enter a valid amount"); return; }
    setCredits(c => c + n); setAmt("");
    toast.success(`₹${n} credits added!`);
  };

  return (
    <div className={`${glass} p-6 space-y-6`}>
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
          <CreditCard className="w-4 h-4 text-white" />
        </span>
        <div>
          <h3 className="font-black text-slate-800">Add Credits</h3>
          <p className="text-xs text-slate-400">Top up your account balance</p>
        </div>
      </div>

      {/* Balance display */}
      <div className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest">Current Balance</p>
        <p className="text-4xl font-black text-white mt-1">₹{credits.toLocaleString()}</p>
        <p className="text-blue-200 text-xs mt-1">Available to spend</p>
      </div>

      {/* Quick amounts */}
      <div>
        <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick add</p>
        <div className="grid grid-cols-4 gap-2">
          {[500, 1000, 2000, 5000].map(v => (
            <button key={v} onClick={() => setAmt(String(v))}
              className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${amt === String(v) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                }`}>
              ₹{v.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="Custom amount (₹)"
          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 outline-none text-sm bg-white" />
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={add}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md flex items-center gap-2"
          style={btnPrimary}>
          <Plus className="w-4 h-4" /> Pay
        </motion.button>
      </div>
      <p className="text-[10.5px] text-slate-400">Demo integration — no real payment processed.</p>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Dashboard ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function CommercialDashboard() {
  const navigate = useNavigate();
  const store = useProfileWizardStore();
  const progress = calculateProgress(store);
  const isLocked = progress < 80 && !store.isSkipped;

  const raw = localStorage.getItem("commercial_user_v1");
  const [user, setUser] = useState(raw ? JSON.parse(raw) : {
    companyName: "Demo Company", contactPerson: "Demo User",
    email: "demo@company.com", mobile: "9876543210",
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gstNumber, setGstNumber] = useState(() => localStorage.getItem("commercial_gst_v1") || "");
  const [showGstModal, setShowGstModal] = useState(() => !localStorage.getItem("commercial_gst_v1") && !isLocked);

  const initials = (user.companyName || user.contactPerson || "C")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  // Force profile tab if locked
  // useEffect(() => {
  //   if (isLocked) {
  //     setActiveTab("profile");
  //   }
  // }, [isLocked]);

  const handleSignOut = () => {
    localStorage.removeItem("commercial_user_v1");
    localStorage.removeItem("login_mock_v1");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("otp_verified_v1");
    localStorage.removeItem("registration_form_v1");
    localStorage.removeItem("individual_user_v1");
    localStorage.removeItem("admin_auth_v1");
    localStorage.removeItem("commercial_gst_v1");
    store.resetStore();
    window.dispatchEvent(new Event("auth_changed"));
    navigate("/login");
  };

  const saveGstNumber = () => {
    const gst = gstNumber.trim().toUpperCase();
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!gst) {
      toast.error("GST number is required to continue.");
      return;
    }
    if (!gstRegex.test(gst)) {
      toast.error("Please enter a valid GST number.");
      return;
    }
    localStorage.setItem("commercial_gst_v1", gst);
    setShowGstModal(false);
    setUser(prev => ({ ...prev, gst }));
    toast.success("GST number saved.");
  };

  const payRows = [
    ["#PAY001", "₹500", "Credits", "10 May 2026", "Success"],
    ["#PAY002", "₹1,000", "Subscription", "22 Apr 2026", "Success"],
    ["#PAY003", "₹250", "Credits", "15 Mar 2026", "Failed"],
  ];
  const subRows = [
    ["Basic Plan", "₹999/mo", "01 May 2026", "01 Jun 2026", "Active"],
    ["Pro Plan", "₹2,499/mo", "01 Feb 2026", "01 May 2026", "Expired"],
  ];
  const clientRows = [
    ["Rajesh Kumar", "rajesh@email.com", "Consulting", "10 May 2026", "Active"],
    ["Priya Sharma", "priya@email.com", "Legal", "22 Apr 2026", "Inactive"],
    ["Amit Singh", "amit@email.com", "Tender", "18 Mar 2026", "Active"],
  ];

  const renderContent = () => {
    if (isLocked) {
      return <ProfileWizard />;
    }
    switch (activeTab) {
      case "dashboard": return <Dashboard user={user} />;
      case "profile": return <ProfileWizard />;
      case "credits": return <AddCredits />;
      // case "payments": return <DataTable title="Payment History" icon={History} accent="blue" cols={["Txn ID", "Amount", "Type", "Date", "Status"]} rows={payRows} />;
      case "subscription": return <SubscriptionHistory />;
      case "PlansAndSubscriptions": return <PlansAndSubscriptions />;
      case "MyCredits": return <MyCredits />;
      case "clients": return <ClientsHistory />;
      case "leads": return <LeadManagement />;
      case "services": return <ServiceListing dashboardMode={true} />;
      case "settings": return <SettingsPanel />;
      default: return <Dashboard user={user} />;
    }
  };

  // If locked, render fullscreen ProfileWizard onboarding layout directly
  if (isLocked) {
    return <ProfileWizard />;
  }

  const visibleNav = isLocked ? NAV.filter(n => n.id === "profile") : NAV;
  return (
    // <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-blue-400/8 blur-[120px]" />
        <div className="absolute right-[-80px] top-[30%] h-[400px] w-[400px] rounded-full bg-indigo-400/8 blur-[120px]" />
        <div className="absolute bottom-[-60px] left-[30%] h-[300px] w-[300px] rounded-full bg-violet-300/6 blur-[100px]" />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white/90 backdrop-blur-2xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(59,130,246,0.05)] lg:relative transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: "15rem" }}>

        {/* Logo / user */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-md shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate">{user.companyName || user.contactPerson}</p>
            <p className="text-[10px] text-blue-500 font-semibold">Commercial Account</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${activeTab === id
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100/80 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
              {activeTab === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="border-t border-slate-100 p-3">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      {/* ── Main area ── */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex h-16 items-center gap-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 shrink-0">
          <button className="lg:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
            onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <h2 className="text-sm font-bold text-slate-700">
              {NAV.find(n => n.id === activeTab)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
            </button>
            <span className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Zap className="h-3.5 w-3.5" /> Commercial
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* {showGstModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/85 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
          
            <label className="block text-xs font-bold uppercase tracking-[0.24em] text-slate-400 mb-2">
              GST Number
            </label>
            <input
              value={gstNumber}
              onChange={e => setGstNumber(e.target.value.toUpperCase())}
              placeholder="Enter GST number"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={saveGstNumber}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Save GST Number
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

