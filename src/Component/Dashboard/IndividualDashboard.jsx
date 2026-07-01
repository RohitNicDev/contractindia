/**
 * IndividualDashboard
 * Uses DashboardLayout as the shell.
 * Pages: Overview · My Profile · Change Password · Subscription Plan
 */

import { useCallback, useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  Key,
  CreditCard,
  CheckCircle2,
  Edit3,
  ArrowRight,
  Star,
  BookOpen,
  ShoppingBag,
  History,
  Plus,
  BriefcaseBusiness,
} from "lucide-react";
import DashboardLayout, {
  glassCard,
  glass,
  SectionHeader,
  TextInput,
  StatusBadge,
  Avatar,
} from "../Dashboard/Layout/DashboardLayout";
import SubscriptionPlansFlow from "./pages/SubscriptionPlansFlow";
import { UserRegistrationUserIdGet } from "../../services/api";
import { resetAllStores, useUserStore } from "../../store/store";
import { useQuery } from "@tanstack/react-query";

/* ── Nav definition ─────────────────────────────────────────────────────── */
const NAV = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, route: "" },
  {
    id: "MyServices",
    label: "My Services",
    icon: BriefcaseBusiness,
    route: "MyServices",
  },
  // {
  //   id: "subscription",
  //   label: "Subscription Plan",
  //   icon: CreditCard,
  //   route: "subscription",
  // },
  {
    id: "plans-and-subscriptions",
    label: "Plans & Subscriptions",
    icon: BookOpen,
    route: "plans-and-subscriptions",
  },
  // { id: "mycredits", label: "My Credits", icon: Edit3, route: "mycredits" },
  { id: "profile", label: "My Profile", icon: User, route: "profile" },
  { id: "password", label: "Change Password", icon: Key, route: "password" },
];
const UserRegistrationUserIdGetApi = async (userId) => {
  const response = await UserRegistrationUserIdGet(userId);
  console.log(response, "response");
  return response?.data ?? [];
};
function getNavItem(value) {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  return NAV.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.route.toLowerCase() === normalized ||
      normalized === `individual/dashboard/${item.route.toLowerCase()}` ||
      normalized === `/individual/dashboard/${item.route.toLowerCase()}` ||
      normalized === `/${item.route.toLowerCase()}`,
  );
}

function getPathForNav(value) {
  const item = getNavItem(value);
  if (!item) return null;
  return item.route === ""
    ? "/individual/dashboard"
    : `/individual/dashboard/${item.route}`;
}

function resolveTabByRoute(pathname) {
  const relativePath = pathname
    .replace(/^\/individual\/dashboard\/?/, "")
    .replace(/\/$/, "");
  const item = NAV.find((nav) => nav.route === relativePath);
  return item ? item.id : "overview";
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function loadUser() {
  try {
    const raw = localStorage.getItem("individual_user_v1");
    return raw
      ? JSON.parse(raw)
      : { name: "Demo User", email: "demo@example.com", mobile: "9876543210" };
  } catch {
    return {
      name: "Demo User",
      email: "demo@example.com",
      mobile: "9876543210",
    };
  }
}

function saveUser(u) {
  localStorage.setItem("individual_user_v1", JSON.stringify(u));
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE COMPONENTS
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Overview ──────────────────────────────────────────────────────────── */
export function Overview(props) {
  const context = useOutletContext();
  const user = props.user || context?.user || {};
  const firstName = user.name?.split(" ")[0] || "there";

  const stats = [
    {
      label: "Credits",
      value: "250",
      icon: CreditCard,
      grad: "from-indigo-500 to-violet-500",
      tab: "mycredits",
    },
    {
      label: "Active Plans",
      value: "2",
      icon: CheckCircle2,
      grad: "from-emerald-500 to-teal-500",
      tab: "plans-and-subscriptions",
    },
    // {
    //   label: "Bookings",
    //   value: "7",
    //   icon: History,
    //   grad: "from-amber-500 to-orange-400",
    //   tab: "clients",
    // },
    {
      label: "Services",
      value: "3",
      icon: ShoppingBag,
      grad: "from-pink-500 to-rose-500",
      tab: "MyServices",
    },
  ];

  const activity = [
    {
      dot: "bg-emerald-400",
      text: "Subscription renewed – Basic Plan",
      time: "2 hrs ago",
    },
    {
      dot: "bg-indigo-400",
      text: "Profile updated successfully",
      time: "Yesterday",
    },
    {
      dot: "bg-amber-400",
      text: "New newsletter available",
      time: "2 days ago",
    },
    {
      dot: "bg-violet-400",
      text: "Consulting service booked",
      time: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${glassCard} p-6`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/8 to-cyan-400/6 rounded-2xl" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.2)_0%,transparent_70%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
              Welcome back, {firstName} 👋
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Manage your services, credits, and profile from here.
            </p>
          </div>
          <Avatar
            name={user.name}
            size={44}
            className="hidden sm:flex shadow-md"
          />
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2 }}
            onClick={() => s.tab && context.handleTabChange?.(s.tab)}
            className={`${glassCard} p-5 cursor-pointer hover:shadow-lg transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} shadow-md`}
              >
                <s.icon className="h-5 w-5 text-white" />
              </span>
            </div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <div className={`${glassCard} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" /> Recent Activity
          </h3>
        </div>
        <div className="space-y-2">
          {activity.map((a, i) => (
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

      {/* Newsletter teaser */}
      {/* <div className={`${glassCard} p-5`}>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-amber-600 uppercase tracking-wide">
            May 2026 Newsletter
          </span>
        </div>
        <h4 className="font-black text-slate-900 text-sm mb-1">
          Construction Market Insights
        </h4>
        <p className="text-xs text-slate-500">
          Latest trends in infrastructure, government tenders, and material
          pricing.
        </p>
        <button
          onClick={() => toast.info("Opening newsletter (demo)")}
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white shadow-md"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)" }}
        >
          Read Now <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div> */}
    </div>
  );
}

/* ── My Profile ──────────────────────────────────────────────────────────── */
export function MyProfile(props) {
  const context = useOutletContext();
  const user = props.user || context?.user || {};
  const onUpdate = props.onUpdate || context?.setUser || (() => {});

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || "",
    address: user.address || "",
    profession: user.profession || "",
    services: user.services || "",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required";
    if (!form.mobile.trim()) e.mobile = "Required";
    return e;
  };

  const handleUpdate = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const updated = { ...user, ...form };
    saveUser(updated);
    onUpdate(updated);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className={`${glassCard} p-6`}>
      <SectionHeader
        icon={User}
        title="My Profile"
        subtitle="Keep your contact and professional details up to date."
      />
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <TextInput
          label="Full Name *"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          placeholder="Rahul Sharma"
        />
        <TextInput
          label="Email Address *"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          placeholder="rahul@company.com"
          type="email"
        />
        <TextInput
          label="Mobile Number *"
          value={form.mobile}
          onChange={set("mobile")}
          error={errors.mobile}
          placeholder="+91 98765 43210"
        />
        <TextInput
          label="Profession / Occupation"
          value={form.profession}
          onChange={set("profession")}
          placeholder="Civil Engineer"
        />
        <TextInput
          label="Address"
          value={form.address}
          onChange={set("address")}
          placeholder="Street, City, State"
          textarea
        />
        <TextInput
          label="Services Interested In"
          value={form.services}
          onChange={set("services")}
          placeholder="Consulting, Legal…"
          textarea
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUpdate}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg"
        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
      >
        <CheckCircle2 className="w-4 h-4" /> Save Profile
      </motion.button>
    </div>
  );
}

/* ── Change Password ─────────────────────────────────────────────────────── */
export function ChangePassword() {
  const [form, setForm] = useState({ old: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.old.trim()) e.old = "Required";
    if (form.next.length < 6) e.next = "Minimum 6 characters";
    if (form.next !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setForm({ old: "", next: "", confirm: "" });
    toast.success("Password updated successfully!");
  };

  return (
    <div className={`${glassCard} p-6 max-w-md`}>
      <SectionHeader
        icon={Key}
        title="Change Password"
        subtitle="Update your account security with a new password."
      />
      <div className="space-y-4 mb-5">
        <TextInput
          label="Current Password"
          value={form.old}
          onChange={set("old")}
          error={errors.old}
          type="password"
          placeholder="Enter current password"
        />
        <TextInput
          label="New Password"
          value={form.next}
          onChange={set("next")}
          error={errors.next}
          type="password"
          placeholder="Min. 6 characters"
        />
        <TextInput
          label="Confirm Password"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          type="password"
          placeholder="Repeat new password"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
            Updating…
          </>
        ) : (
          <>
            <Key className="w-4 h-4" /> Update Password
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ── Subscription Plan ───────────────────────────────────────────────────── */
const SUBSCRIPTIONS = [
  {
    plan: "Pro Plan",
    price: "₹100/mo",
    status: "Active",
    expires: "Unlimited",
    features: ["5 enquiries/mo", "Basic listings", "Email support"],
  },
  {
    plan: "Basic Plan",
    price: "₹299/mo",
    status: "Active",
    expires: "2026-06-20",
    features: ["50 enquiries/mo", "Priority listings", "Phone support"],
  },
  {
    plan: "Premium Plan",
    price: "₹599/mo",
    status: "Expired",
    expires: "2026-04-22",
    features: ["Unlimited enquiries", "Featured listings", "Dedicated manager"],
  },
];

export function SubscriptionPlan() {
  const [showPlans, setShowPlans] = useState(false);
  return (
    <div className={`${glassCard} p-6`}>
      <SectionHeader
        icon={CreditCard}
        title="Subscription Plan"
        subtitle="Review your active and past subscription plans."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {SUBSCRIPTIONS.map((sub) => (
          <div
            key={sub.plan}
            className={`rounded-2xl border p-5 transition-all ${
              sub.status === "Active"
                ? "border-indigo-200 bg-indigo-50/40 shadow-sm"
                : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-black text-slate-900 text-sm">{sub.plan}</p>
              <StatusBadge
                label={sub.status}
                color={sub.status === "Active" ? "emerald" : "slate"}
              />
            </div>
            <p className="text-xl font-black text-indigo-700 mb-1">
              {sub.price}
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              Expires: {sub.expires}
            </p>
            <ul className="space-y-1.5 mb-4">
              {sub.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-slate-600"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {sub.status === "Expired" && (
              <button
                onClick={() => setShowPlans(true)}
                className="w-full h-8 rounded-xl text-xs font-bold text-indigo-700 border border-indigo-200 bg-white hover:bg-indigo-50 transition-colors"
              >
                Renew Plan
              </button>
            )}
          </div>
        ))}
        {/* // 3. mount the flow */}
      </div>
      <SubscriptionPlansFlow
        open={showPlans}
        onClose={() => {
          setShowPlans(false);
          refetchSubscription();
        }}
        currentPlanId={12213}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export default function IndividualDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(loadUser);
  const { loginResponce ,resetUserStore} = useUserStore();
  const activeTab = resolveTabByRoute(location.pathname);
 
  const handleTabChange = (tab) => {
    const path = getPathForNav(tab) || (typeof tab === "string" ? tab : null);
    if (!path) return;
    navigate(path);
  };
  const { data: UserData = [], isLoading: UserDataLoading } = useQuery({
    queryKey: ["UserData", loginResponce?.userId],
    queryFn: () => UserRegistrationUserIdGetApi(loginResponce?.userId),
    enabled: !!loginResponce?.userId,
    retry: false,
  });
  useEffect(() => {
    console.log(UserData, "UserData");
  }, [UserData]);

  useEffect(() => {
    if (
      !UserData ||
      (Array.isArray(UserData) && UserData.length === 0) ||
      Object.keys(UserData).length === 0
    )
      return;
    console.log(UserData, "looo");

    const userObj = Array.isArray(UserData) ? UserData[0] : UserData;
    setUser({
      companyName: userObj?.CompanyName || "Demo Company",
      name: userObj?.Name || "Demo User",
      email: userObj?.EmailId || "demo@company.com",
      mobile: userObj?.MobileNo || "9876543210",
      services: userObj?.ServiceName || [],
      serviceIds: userObj?.ServiceId || [],
      pinCode: userObj?.PinCode || "",
    });
  }, [UserData]);

  const handleSignOut = useCallback(() => {
    resetUserStore();
    resetAllStores();
    navigate("/login");
  }, [navigate]);

  return (
    <DashboardLayout
      navItems={NAV}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      user={{ name: user.name, email: user.email, role: "Individual Account" }}
      onSignOut={handleSignOut}
      badge="Individual Account"
      badgeColor="indigo"
      notifications={2}
    >
      <Outlet context={{ user, setUser, handleTabChange }} />
    </DashboardLayout>
  );
}
