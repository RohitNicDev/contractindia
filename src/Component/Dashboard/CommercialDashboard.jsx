import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  CreditCard,
  Briefcase,
  List,
  Settings,
  Plus,
  ChevronDown,
  TrendingUp,
  ArrowUpRight,
  User2Icon,
  PlaneIcon,
  ClipboardList,
  Users,
  UserRound,
  PackageCheck,
  Receipt,
} from "lucide-react";
import ProfileWizard from "./pages/ProfileSteper/ProfileWizard";
import {
  useProfileWizardStore,
  calculateProgress,
} from "../../store/profileWizardStore";
import DashboardLayout from "../Dashboard/Layout/DashboardLayout";
import { useUserStore } from "../../store/store";
import { useQuery } from "@tanstack/react-query";
import { UserRegistrationUserIdGet } from "../../services/api";
// ─── Design tokens ────────────────────────────────────────────────────────────
export const glass =
  "rounded-2xl bg-white border border-slate-100 shadow-[0_2px_20px_rgba(99,102,241,0.07)]";

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    route: "",
  },
  {
    id: "profile",
    label: "My Profile",
    icon: UserRound,
    route: "profile",
  },
  {
    id: "clients",
    label: "Client History",
    icon: Users,
    route: "clients",
  },
  {
    id: "leads",
    label: "Lead Management",
    icon: ClipboardList,
    route: "leads",
  },
  {
    id: "services",
    label: "Service Listing",
    icon: Briefcase,
    route: "services",
  },
  // {
  //   id: "subscription",
  //   label: "Subscription History",
  //   icon: Receipt,
  //   route: "subscription",
  // },
  {
    id: "PlansAndSubscriptions",
    label: "Plans & Subscriptions",
    icon: PackageCheck,
    route: "plans-and-subscriptions",
  },
  // {
  //   id: "credits",
  //   label: "My Credits",
  //   icon: CreditCard,
  //   route: "credits",
  // },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    route: "settings",
  },
];
function getNavItem(value) {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  return NAV.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.label.toLowerCase() === normalized ||
      item.route.toLowerCase() === normalized ||
      item.route.toLowerCase() === normalized.replace(/^\//, "") ||
      normalized === `commercial/dashboard/${item.route.toLowerCase()}` ||
      normalized === `/commercial/dashboard/${item.route.toLowerCase()}` ||
      normalized === `/${item.route.toLowerCase()}`,
  );
}

function getPathForNav(value) {
  const item = getNavItem(value);
  if (!item) return null;
  return item.route === ""
    ? "/commercial/dashboard"
    : `/commercial/dashboard/${item.route}`;
}

function resolveTabByRoute(pathname) {
  const relativePath = pathname
    .replace(/^\/commercial\/dashboard\/?/, "")
    .replace(/\/$/, "");
  const item = NAV.find((nav) => nav.route === relativePath);
  return item ? item.id : "dashboard";
}

// ─── Portal Multi-Select Dropdown (escapes overflow:hidden) ───────────────────
function PortalDropdown({ options, selected, onToggle, color, bg, border }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const openDropdown = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect)
      setPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    setOpen(true);
  };

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target))
        setOpen(false);
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
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm transition-all"
        style={{
          border: `1.5px solid ${open ? color : border}`,
          background: open ? bg : "#fff",
        }}
      >
        <span className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-slate-400 text-xs">
              Select documents to upload…
            </span>
          ) : (
            <>
              {visibleChips.map((s) => (
                <span
                  key={s}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                  style={{ background: bg, color, borderColor: border }}
                >
                  {s === "Other" ? "+ Other" : s}
                </span>
              ))}
              {extra > 0 && (
                <span className="text-[11px] font-bold" style={{ color }}>
                  +{extra} more
                </span>
              )}
            </>
          )}
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-200"
          style={{ color, transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {/* Portal panel — renders in <body>, escapes any overflow:hidden parent */}
      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 99999,
                background: "#fff",
                border: `1.5px solid ${border}`,
                borderRadius: 16,
                boxShadow: "0 12px 40px rgba(0,0,0,0.13)",
                overflow: "hidden",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div style={{ maxHeight: 260, overflowY: "auto" }}>
                {options.map((opt) => {
                  const checked = selected.includes(opt);
                  const isOther = opt === "Other";
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onToggle(opt)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left border-b border-slate-50 last:border-0 transition-colors"
                      style={{ background: checked ? bg : "transparent" }}
                    >
                      <span
                        className="w-[17px] h-[17px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all"
                        style={{
                          borderColor: checked ? color : "#d1d5db",
                          background: checked ? color : "#fff",
                        }}
                      >
                        {checked && (
                          <svg
                            width="9"
                            height="7"
                            viewBox="0 0 9 7"
                            fill="none"
                          >
                            <path
                              d="M1 3.5l2 2L8 1"
                              stroke="#fff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className="text-xs"
                        style={{
                          fontWeight: isOther ? 700 : 500,
                          color: isOther ? color : "#374151",
                        }}
                      >
                        {isOther ? "+ Other (specify name)" : opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="p-2.5 border-t" style={{ borderColor: border }}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full py-1.5 rounded-lg text-xs font-bold transition-colors"
                  style={{ background: bg, color }}
                >
                  Done ✓
                </button>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const Dashboard = (props) => {
  const context = useOutletContext();
  const user = props.user || context?.user || {};
  const onTabChange =
    props.onTabChange || context?.handleTabChange || (() => {});
  const resetUserStore = useUserStore((state) => state?.resetUserStore);
  const name = user.companyName || user.contactPerson || "there";

  const stats = [
    {
      label: "Credits",
      value: user.credits ? `₹${user.credits.toLocaleString()}` : "₹0",
      sub: "+₹200 this month",
      grad: "from-blue-500 to-indigo-500",
      icon: CreditCard,
      up: true,
      tab: "credits",
    },
    {
      label: "Active Leads",
      value: user.activeLeads ? String(user.activeLeads) : "0",
      sub: "3 new this week",
      grad: "from-emerald-500 to-teal-500",
      icon: List,
      up: true,
      tab: "leads",
    },
    {
      label: "Clients",
      value: user.clients ? String(user.clients) : "0",
      sub: "2 inactive",
      grad: "from-amber-500 to-orange-400",
      icon: User,
      up: false,
      tab: "clients",
    },
    {
      label: "Services",
      value: user.services ? String(user.services.length || 0) : "0",
      sub: "All active",
      grad: "from-violet-500 to-purple-500",
      icon: Briefcase,
      up: true,
      tab: "services",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${glass} p-6`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-indigo-500/6 to-violet-400/4 rounded-2xl" />
        <div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.2)_0%,transparent_70%)]" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.2)_0%,transparent_70%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-blue-500">
              Welcome back
            </p>
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
                {(Array.isArray(user.services)
                  ? user.services
                  : [user.services]
                ).map((s) => (
                  <span
                    key={s}
                    className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white text-xl font-black shrink-0">
            {(user.companyName || user.contactPerson || "C")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            onClick={() => s.tab && onTabChange(s.tab)}
            className={`${glass} p-5 group cursor-pointer transition-all hover:shadow-lg`}
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} shadow-md`}
              >
                <s.icon className="h-5 w-5 text-white" />
              </span>
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}
              >
                <ArrowUpRight
                  className={`w-3.5 h-3.5 ${!s.up && "rotate-90"}`}
                />
                {s.up ? "+" : ""}
              </span>
            </div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
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
          <button className="text-xs font-semibold text-blue-600 hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-2.5">
          {[
            {
              dot: "bg-emerald-400",
              text: "New lead from Rajesh Kumar",
              time: "2 hrs ago",
            },
            {
              dot: "bg-blue-400",
              text: "Payment of ₹1,000 received",
              time: "Yesterday",
            },
            {
              dot: "bg-violet-400",
              text: "Profile updated successfully",
              time: "2 days ago",
            },
            {
              dot: "bg-amber-400",
              text: "Subscription renewed – Pro",
              time: "3 days ago",
            },
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50/80 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${a.dot}`} />
              <span className="text-sm text-slate-700 flex-1">{a.text}</span>
              <span className="text-[10.5px] text-slate-400 shrink-0">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Add Credits ──────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Dashboard ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const UserRegistrationUserIdGetApi = async (userId) => {
  const response = await UserRegistrationUserIdGet(userId);
  console.log(response, "response");
  return response?.data ?? [];
};
export default function CommercialDashboard() {
  const navigate = useNavigate();
  const store = useProfileWizardStore();
  // const useuserStore = useUserStore();
  const progress = calculateProgress(store);
  const isLocked = progress < 80 && !store.isSkipped;
  const [open, setOpen] = useState(false);
  // const { setUserDetails } = useUserStore();
  const { resetUserStore } = useUserStore();

  const raw = localStorage.getItem("commercial_user_v1");
  const [user, setUser] = useState(
    raw
      ? JSON.parse(raw)
      : {
          companyName: "Demo Company",
          contactPerson: "Demo User",
          email: "demo@company.com",
          mobile: "9876543210",
        },
  );
  // const [mobileOpen, setMobileOpen] = useState(false);
  // const [gstNumber, setGstNumber] = useState(
  //   () => localStorage.getItem("commercial_gst_v1") || "",
  // );
  // const [showGstModal, setShowGstModal] = useState(
  //   () => !localStorage.getItem("commercial_gst_v1") && !isLocked,
  // );
  const getloginResponce = useUserStore((state) => state?.loginResponce);
  const { data: UserData = [], isLoading: UserDataLoading } = useQuery({
    queryKey: ["UserData", getloginResponce?.userId],
    queryFn: () => UserRegistrationUserIdGetApi(getloginResponce?.userId),
    enabled: !!getloginResponce?.userId,
    retry: false,
  });

  useEffect(() => {
    if (
      !UserData ||
      (Array.isArray(UserData) && UserData.length === 0) ||
      Object.keys(UserData).length === 0
    )
      return;
    const userObj = Array.isArray(UserData) ? UserData[0] : UserData;
    setUser({
      companyName: userObj?.CompanyName || "Demo Company",
      contactPerson: userObj?.Name || "Demo User",
      email: userObj?.EmailId || "demo@company.com",
      mobile: userObj?.MobileNo || "9876543210",
      services: userObj?.ServiceName || [],
      serviceIds: userObj?.ServiceId || [],
      pinCode: userObj?.PinCode || "",
    });
  }, [UserData]);

  const handleSignOut = useCallback(() => {
    [
      "commercial_user_v1",
      "login_mock_v1",
      "isLoggedIn",
      "otp_verified_v1",
      "registration_form_v1",
      "individual_user_v1",
      "admin_auth_v1",
      "commercial_gst_v1",
    ].forEach((k) => localStorage.removeItem(k));
    resetUserStore();

    window.dispatchEvent(new Event("auth_changed"));
    navigate("/login");
  }, [navigate]);
  const initials = (user.companyName || user.contactPerson || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const saveGstNumber = () => {
    const gst = gstNumber.trim().toUpperCase();
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
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
    setUser((prev) => ({ ...prev, gst }));
    toast.success("GST number saved.");
  };

  const location = useLocation();
  const activeTab = resolveTabByRoute(location.pathname);

  const handleTabChange = (tab) => {
    const path = getPathForNav(tab) || (typeof tab === "string" ? tab : null);
    if (!path) return;
    navigate(path);
  };

  // If locked, render fullscreen ProfileWizard onboarding layout directly
  if (isLocked) {
    return <ProfileWizard />;
  }

  const visibleNav = isLocked ? NAV.filter((n) => n.id === "profile") : NAV;
  return (
    <>
      <DashboardLayout
        navItems={NAV}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={{
          name: user.companyName || user.contactPerson || "Company",
          email: user.email || "",
          role: "Commercial Account",
        }}
        onSignOut={handleSignOut}
        badge="Commercial"
        badgeColor="blue"
        notifications={1}
      >
        <Outlet context={{ user, handleTabChange }} />
      </DashboardLayout>
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
      )}  */}
    </>
  );
}
