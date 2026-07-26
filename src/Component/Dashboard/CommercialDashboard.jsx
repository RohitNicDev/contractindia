// pages/CommercialDashboard/CommercialDashboard.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
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
  Eye,
  EyeOff,
  Loader,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  MoreVertical,
  Calendar,
  IndianRupee,
  PieChart,
} from "lucide-react";
import ProfileWizard from "./pages/ProfileSteper/ProfileWizard";
import {
  useProfileWizardStore,
  calculateProgress,
} from "../../store/profileWizardStore";
import DashboardLayout from "../Dashboard/Layout/DashboardLayout";
import { resetAllStores, useUserStore } from "../../store/store";
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
    id: "services",
    label: "Service Listing",
    icon: Briefcase,
    route: "servicesListing",
  },
  {
    id: "PlansAndSubscriptions",
    label: "Plans & Subscriptions",
    icon: PackageCheck,
    route: "plans-and-subscriptions",
  },
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

// ═══════════════════════════════════════════════════════════════════════════════
// ─── DASHBOARD CONTENT COMPONENT ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export const Dashboard = (props) => {
  const context = useOutletContext();
  const user = props.user || context?.user || {};
  const onTabChange =
    props.onTabChange || context?.handleTabChange || (() => { });

  const name = user?.companyName || user?.contactPerson || "there";
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  // Mock data - Replace with API calls
  const stats = [
    {
      label: "Total Services",
      value: user.serviceIds?.length || "0",
      sub: "Active listings",
      grad: "from-violet-500 to-purple-500",
      icon: Briefcase,
      trend: true,
      trendValue: "+2 this month",
      tab: "services",
    },
    {
      label: "Profile Completion",
      value: "85%",
      sub: "Almost done!",
      grad: "from-emerald-500 to-teal-500",
      icon: CheckCircle2,
      trend: true,
      trendValue: "Complete all sections",
      tab: "profile",
    },
    {
      label: "Active Subscription",
      value: "Pro",
      sub: "Renews in 30 days",
      grad: "from-blue-500 to-indigo-500",
      icon: PackageCheck,
      trend: false,
      trendValue: "Plan active",
      tab: "PlansAndSubscriptions",
    },
    {
      label: "Account Status",
      value: "Verified",
      sub: "All documents approved",
      grad: "from-amber-500 to-orange-400",
      icon: User,
      trend: true,
      trendValue: "✓ Verified",
      tab: "profile",
    },
  ];

  const recentActivities = [
    {
      dot: "bg-emerald-400",
      text: "Service 'Electrical Repair' was viewed by 12 customers",
      time: "2 hrs ago",
      icon: Eye,
    },
    {
      dot: "bg-blue-400",
      text: "New subscription plan activated - Pro Plan",
      time: "1 day ago",
      icon: PackageCheck,
    },
    {
      dot: "bg-violet-400",
      text: "Profile updated successfully",
      time: "2 days ago",
      icon: CheckCircle2,
    },
    {
      dot: "bg-amber-400",
      text: "Document verification completed",
      time: "5 days ago",
      icon: AlertCircle,
    },
  ];

  const topServices = [
    {
      name: "Electrical Repair",
      views: 245,
      inquiries: 18,
      rating: 4.8,
      trend: true,
    },
    {
      name: "Plumbing Services",
      views: 189,
      inquiries: 14,
      rating: 4.6,
      trend: true,
    },
    {
      name: "AC Maintenance",
      views: 156,
      inquiries: 11,
      rating: 4.7,
      trend: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${glass} p-6 md:p-8`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-indigo-500/6 to-violet-400/4 rounded-2xl" />
        <div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.2)_0%,transparent_70%)]" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.2)_0%,transparent_70%)]" />

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-blue-500">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
              Hello, {name} 👋
            </h1>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              {user.email && <span className="mr-4">📧 {user.email}</span>}
              {user.mobile && <span>📱 {user.mobile}</span>}
            </p>

            {/* Service Tags */}
            {user.serviceIds && user.serviceIds.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(user.serviceIds)
                  ? user.serviceIds
                  : [user.serviceIds]
                ).slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {s}
                  </span>
                ))}
                {user.serviceIds?.length > 3 && (
                  <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                    +{user.serviceIds.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="hidden sm:flex w-16 h-16 md:w-20 md:h-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white text-2xl font-black shrink-0">
            {(user.companyName || user.contactPerson || "C")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            onClick={() => stat.tab && onTabChange(stat.tab)}
            className={`${glass} p-5 group cursor-pointer transition-all hover:shadow-lg hover:border-indigo-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.grad} shadow-md`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </span>
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-50 text-slate-500"
                  }`}
              >
                <ArrowUpRight
                  className={`w-3.5 h-3.5 ${!stat.trend && "rotate-180"}`}
                />
                {stat.trend ? "Up" : "Stable"}
              </span>
            </div>

            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
              {stat.value}
            </p>
            <p className="mt-1 text-[10.5px] text-slate-500">{stat.sub}</p>
            <p className="mt-2 text-[10px] font-semibold text-indigo-600">
              {stat.trendValue}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 ${glass} p-6`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Recent Activity
            </h3>
            <button className="text-xs font-semibold text-blue-600 hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50/80 transition-colors group"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 mt-2 ${activity.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {activity.text}
                  </p>
                  <p className="text-[10.5px] text-slate-400 mt-1">
                    {activity.time}
                  </p>
                </div>
                <activity.icon className="w-4 h-4 text-slate-300 shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${glass} p-6`}
        >
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            Quick Actions
          </h3>

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-slate-700 font-semibold text-sm transition-all group">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add New Service</span>
              <ChevronDown className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-slate-700 font-semibold text-sm transition-all group">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>View Invoices</span>
              <ChevronDown className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
            </button>

            <button
              onClick={() => setShowCreditsModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-slate-700 font-semibold text-sm transition-all group"
            >
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>Add Credits</span>
              <ChevronDown className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 text-slate-700 font-semibold text-sm transition-all group">
              <Users className="w-4 h-4 text-orange-600" />
              <span>Client History</span>
              <ChevronDown className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Top Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${glass} p-6`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-500" />
            Top Performing Services
          </h3>
          <button className="text-xs font-semibold text-blue-600 hover:underline">
            View all services
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 font-bold text-slate-700">
                  Service Name
                </th>
                <th className="text-center px-4 py-3 font-bold text-slate-700">
                  Views
                </th>
                <th className="text-center px-4 py-3 font-bold text-slate-700">
                  Inquiries
                </th>
                <th className="text-center px-4 py-3 font-bold text-slate-700">
                  Rating
                </th>
                <th className="text-center px-4 py-3 font-bold text-slate-700">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((service, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {service.name}
                  </td>
                  <td className="text-center px-4 py-4 text-slate-600">
                    {service.views}
                  </td>
                  <td className="text-center px-4 py-4 text-slate-600">
                    {service.inquiries}
                  </td>
                  <td className="text-center px-4 py-4">
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
                      ⭐ {service.rating}
                    </span>
                  </td>
                  <td className="text-center px-4 py-4">
                    <span
                      className={`text-xs font-bold flex items-center justify-center gap-1 ${service.trend
                          ? "text-emerald-600"
                          : "text-slate-500"
                        }`}
                    >
                      <ArrowUpRight
                        className={`w-3 h-3 ${!service.trend && "rotate-180"
                          }`}
                      />
                      {service.trend ? "Up" : "Stable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Credits Modal */}
      <CreditsModal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── CREDITS MODAL ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function CreditsModal({ isOpen, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const creditPlans = [
    {
      id: 1,
      credits: 100,
      price: 999,
      popular: false,
    },
    {
      id: 2,
      credits: 500,
      price: 4499,
      popular: true,
      savings: "10% OFF",
    },
    {
      id: 3,
      credits: 1000,
      price: 8499,
      popular: false,
      savings: "15% OFF",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white">
                <h2 className="text-3xl font-black mb-2">Buy Credits</h2>
                <p className="text-blue-100">
                  Add credits to your account and unlock premium features
                </p>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {creditPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-slate-50 hover:border-indigo-300"
                        } ${plan.popular ? "ring-2 ring-indigo-300" : ""}`}
                    >
                      {plan.popular && (
                        <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                          Most Popular
                        </span>
                      )}

                      {plan.savings && (
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                          {plan.savings}
                        </span>
                      )}

                      <p className="text-4xl font-black text-slate-900 mb-1">
                        {plan.credits}
                      </p>
                      <p className="text-sm text-slate-600 mb-4">Credits</p>
                      <p className="text-3xl font-bold text-slate-900 mb-1">
                        ₹{plan.price}
                      </p>
                      <p className="text-xs text-slate-500">
                        ₹{(plan.price / plan.credits).toFixed(2)} per credit
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedPlan}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <IndianRupee className="w-4 h-4" />
                    Pay Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN COMMERCIAL DASHBOARD ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const UserRegistrationUserIdGetApi = async (userId) => {
  const response = await UserRegistrationUserIdGet(userId);
  return response?.data ?? [];
};

export default function CommercialDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useProfileWizardStore();
  const { resetUserStore } = useUserStore();
  const getloginResponce = useUserStore((state) => state?.loginResponce);

  // ─── Store Subscription ────────────────────────────────────────────────
  const [storeVersion, setStoreVersion] = useState(0);
  useEffect(() => {
    const unsubscribe = useProfileWizardStore.subscribe(
      (state) => {
        setStoreVersion((v) => v + 1);
      },
      (state) => [
        state.isSkipped,
        state.companyType,
        state.basicInfo,
        state.registrationDetails,
        state.bankingDetails,
        state.documents,
        state.services,
      ]
    );
    return unsubscribe;
  }, []);

  // ─── Calculate lock status ─────────────────────────────────────────────
  const progress = useMemo(() => {
    const state = useProfileWizardStore.getState?.() || store;
    let count = 0;

    if (state.companyType?.trim?.().length > 0) count++;
    if (state.basicInfo?.companyName?.trim?.().length > 0) count++;
    if (state.registrationDetails?.registrationNumber?.trim?.().length > 0) count++;
    if (state.bankingDetails?.accountHolderName?.trim?.().length > 0) count++;
    if (Object.keys(state.documents || {}).length > 0) count++;
    if (Array.isArray(state.services) && state.services.length > 0) count++;

    return Math.round((count / 6) * 100);
  }, [storeVersion]);

  const isLocked = progress < 80 && !store.isSkipped;

  // ─── User data fetching ───────────────────────────────────────────────
  const raw = localStorage.getItem("commercial_user_v1");
  const [user, setUser] = useState(
    raw
      ? JSON.parse(raw)
      : {
        companyName: "Demo Company",
        contactPerson: "Demo User",
        email: "demo@company.com",
        mobile: "9876543210",
      }
  );

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
      services: userObj?.ServiceName ? [userObj.ServiceName] : [],
      serviceIds: userObj?.ServiceId ? [userObj.ServiceId] : [],
      pinCode: userObj?.PinCode || "",
    });
  }, [UserData]);

  const handleSignOut = useCallback(() => {
    resetUserStore();
    resetAllStores();
    navigate("/login");
  }, [navigate]);

  const activeTab = resolveTabByRoute(location.pathname);

  const handleTabChange = (tab) => {
    const path = getPathForNav(tab) || (typeof tab === "string" ? tab : null);
    if (!path) return;
    navigate(path);
  };

  // ─── Render locked state ──────────────────────────────────────────────
  if (isLocked) {
    return <ProfileWizard />;
  }

  // ─── Render dashboard ─────────────────────────────────────────────────
  return (
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
      notifications={3}
    >
      <Outlet context={{ user, handleTabChange }} />
    </DashboardLayout>
  );
}