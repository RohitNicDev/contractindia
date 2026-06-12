import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  Users,
  CreditCard,
  Lock,
  BarChart3,
  LogOut,
  CheckCircle,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Activity,
  TrendingUp,
  ShieldAlert,
  KeyRound,
  UserCheck,
  EyeOff,
  Eye,
  HistoryIcon,
} from "lucide-react";
import ServiceListing from "./pages/ServiceListing";
import BusinessPlans from "./pages/BusinessPlans";
import UserControl from "./pages/UserControl";
import UserVerification from "./pages/UserVerification";
import { Badge, gradBtn, glass } from "../common/uiUtiles";
import CustomHeading from "../common/CustomHeading";
import LogoutPopup from "../common/Logoutpopup";

const stats = [
  {
    label: "Total Users",
    value: "4,821",
    grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    icon: Users,
  },
  {
    label: "Commercial Users",
    value: "1,204",
    grad: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    icon: Briefcase,
  },
  {
    label: "Individual Users",
    value: "3,617",
    grad: "linear-gradient(135deg,#10b981,#0ea5e9)",
    icon: Users,
  },
  {
    label: "Active Services",
    value: "10",
    grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
    icon: Activity,
  },
  {
    label: "Revenue",
    value: "₹12.4L",
    grad: "linear-gradient(135deg,#ec4899,#8b5cf6)",
    icon: TrendingUp,
  },
  {
    label: "Subscriptions",
    value: "284",
    grad: "linear-gradient(135deg,#14b8a6,#6366f1)",
    icon: CreditCard,
  },
];
const recentActivity = [
  {
    text: "New commercial user registered: Sharma Builders",
    time: "2 min ago",
  },
  { text: "Service Tender updated by admin", time: "15 min ago" },
  { text: "User blocked: john.doe@example.com", time: "1 hr ago" },
  { text: "New subscription: Pro Plan — Gupta Contractors", time: "3 hr ago" },
  { text: "Password changed by super-admin", time: "Yesterday" },
];

function Overview() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -3 }}
            style={{ ...glass, padding: "20px" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.grad }}
              >
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0"
            >
              <p className="text-sm text-slate-600">{a.text}</p>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const initServices = [
  {
    id: 1,
    name: "Consulting",
    category: "Consultant",
    desc: "Expert business consulting",
    subs: ["Strategy", "Finance", "Operations"],
  },
  {
    id: 2,
    name: "Contractor",
    category: "Contractor",
    desc: "Construction contracting",
    subs: ["Civil", "Electrical", "Plumbing"],
  },
  // { id: 3, name: "Tender", category: "Contractor", desc: "Tender management services", subs: ["Govt Tenders", "Private Tenders"] },
  {
    id: 4,
    name: "Assets Management",
    category: "Builder",
    desc: "Asset lifecycle management",
    subs: ["Valuation", "Maintenance"],
  },
  {
    id: 5,
    name: "Legal Contracts",
    category: "Consultant",
    desc: "Legal documentation",
    subs: ["Drafting", "Review", "Compliance"],
  },
  {
    id: 6,
    name: "Brand Development",
    category: "Manufacturer",
    desc: "Brand strategy and identity",
    subs: ["Logo", "Marketing Kit"],
  },
  {
    id: 7,
    name: "Marketing",
    category: "Manufacturer",
    desc: "Digital and offline marketing",
    subs: ["SEO", "Social Media", "Ads"],
  },
  {
    id: 8,
    name: "Material Supply",
    category: "Builder",
    desc: "Construction material supply",
    subs: ["Cement", "Steel", "Bricks"],
  },
  {
    id: 9,
    name: "Material Manufacture",
    category: "Manufacturer",
    desc: "Manufacturing services",
    subs: ["Custom Parts", "Bulk Orders"],
  },
  {
    id: 10,
    name: "Construction Audit",
    category: "Builder",
    desc: "Quality and compliance audit",
    subs: ["Site Audit", "Safety Check"],
  },
];

function ServiceManagement() {
  const [services, setServices] = useState(initServices);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Contractor",
    desc: "",
    subs: "",
  });
  const addService = () => {
    if (!form.name) {
      toast.error("Service name required");
      return;
    }
    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        category: form.category,
        desc: form.desc,
        subs: form.subs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    ]);
    setForm({ name: "", category: "Contractor", desc: "", subs: "" });
    setShowForm(false);
    toast.success("Service added!");
  };
  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service deleted");
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">Service Management</h2>
        <button onClick={() => setShowForm(!showForm)} style={gradBtn}>
          <Plus className="w-4 h-4 inline mr-1" />
          Add Service
        </button>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ ...glass, padding: "20px", marginBottom: "20px" }}
          >
            <h3 className="font-semibold text-slate-700 mb-4">New Service</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Service Name", "name"],
                ["Description", "desc"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400"
                >
                  {[
                    "Contractor",
                    "Builder",
                    "Interior",
                    "Manufacturer",
                    "Consultant",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Sub-services (comma-separated)
                </label>
                <input
                  value={form.subs}
                  onChange={(e) => setForm({ ...form, subs: e.target.value })}
                  placeholder="e.g. Design, Build, Audit"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addService} style={gradBtn}>
                Save Service
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{ ...gradBtn, background: "#e2e8f0", color: "#64748b" }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ ...glass, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: "rgba(99,102,241,0.07)" }}>
                {["Service", "Category", "Sub-services", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr
                  key={s.id}
                  style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge color="indigo">{s.category}</Badge>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex flex-wrap gap-1">
                      {s.subs.map((sub) => (
                        <span
                          key={sub}
                          style={{
                            background: "#f1f5f9",
                            color: "#475569",
                            borderRadius: "6px",
                            padding: "2px 8px",
                            fontSize: "11px",
                          }}
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex gap-2">
                      <button
                        style={{
                          ...gradBtn,
                          padding: "5px 10px",
                          fontSize: "12px",
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        style={{
                          ...gradBtn,
                          padding: "5px 10px",
                          fontSize: "12px",
                          background: "linear-gradient(135deg,#ef4444,#dc2626)",
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const adminRoles = [
  {
    name: "Super Admin",
    email: "admin@contractsindia.com",
    role: "Super Admin",
  },
  { name: "Ops Manager", email: "ops@contractsindia.com", role: "Manager" },
  {
    name: "Support Lead",
    email: "support@contractsindia.com",
    role: "Support",
  },
];
const activityLogs = [
  { action: "Logged in", admin: "Super Admin", time: "Today 10:32 AM" },
  {
    action: "Deleted service: Old Consulting",
    admin: "Super Admin",
    time: "Today 09:15 AM",
  },
  {
    action: "Blocked user: priya@gmail.com",
    admin: "Ops Manager",
    time: "Yesterday 4:20 PM",
  },
  {
    action: "Created plan: Enterprise Plus",
    admin: "Super Admin",
    time: "Jun 8, 2025",
  },
  { action: "Password changed", admin: "Super Admin", time: "Jun 7, 2025" },
];
function Security() {
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Form Submission Logic
  const updatePw = (e) => {
    e.preventDefault();
    if (!pw.current || !pw.next || !pw.confirm) {
      toast.error("Please fill all fields");
      return;
    }
    if (pw.next !== pw.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setIsUpdating(true);

    // Simulating API Latency Network Request
    setTimeout(() => {
      toast.success("Password updated successfully");
      setPw({ current: "", next: "", confirm: "" });
      setIsUpdating(false);
    }, 800);
  };

  const toggleVisibility = (key) => {
    setShowPw((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8   mx-auto p-4">
      <CustomHeading
        title="Security Settings"
        subtitle="Manage administrative credentials, monitor security logs, and audit active authorization roles."
        icon={ShieldAlert}
        // badge={isLoading ? undefined : `${totalPlans} record${totalPlans !== 1 ? "s" : ""}`}
        badgeColor="violet"
        variant="default"
        size="md"
      />
      {/* Header Description Section */}
      {/* <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Security Settings
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage administrative credentials, monitor security logs, and audit
            active authorization roles.
          </p>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Password Modification Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2.5 mb-6">
              <KeyRound className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-base">
                Change Password
              </h3>
            </div>

            <form onSubmit={updatePw} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  ["Current Password", "current"],
                  ["New Password", "next"],
                  ["Confirm Password", "confirm"],
                ].map(([label, key]) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 block">
                      {label}
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <input
                        type={showPw[key] ? "text" : "password"}
                        value={pw[key]}
                        onChange={(e) =>
                          setPw({ ...pw, [key]: e.target.value })
                        }
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility(key)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPw[key] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 transition-all hover:opacity-95 focus:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {isUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

          {/* Admin Roles Security Assignment Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-6 pb-4 flex items-center gap-2.5 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-base">
                Admin Roles
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Name", "Email", "Access Role"].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminRoles.map((a) => (
                    <tr
                      key={a.email}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-medium text-slate-800">
                        {a.name}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">{a.email}</td>
                      <td className="py-3.5 px-6">
                        <Badge
                          color={a.role === "Super Admin" ? "indigo" : "slate"}
                        >
                          {a.role}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Security Activity Timeline Auditing */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full">
            <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-slate-100">
              <HistoryIcon className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-base">
                Activity Logs
              </h3>
            </div>
            <div className="space-y-4 relative before:absolute before:inset-0 before:right-auto before:left-[11px] before:w-px before:bg-slate-100">
              {activityLogs.map((l, i) => (
                <div
                  key={i}
                  className="group relative flex items-start gap-3 transition-transform duration-150"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 border-2 border-white ring-4 ring-white shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex-1 space-y-0.5 pl-0.5">
                    <p className="text-sm font-medium text-slate-700 leading-snug group-hover:text-indigo-600 transition-colors">
                      {l.action}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>by {l.admin}</span>
                      <span className="inline-block w-1 h-1 rounded-full bg-slate-200" />
                      <span>{l.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const barData = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 90 },
  { month: "Apr", value: 72 },
  { month: "May", value: 110 },
  { month: "Jun", value: 124 },
];
const metricCards = [
  {
    label: "Total Revenue",
    value: "Rs.12.4L",
    grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  {
    label: "Active Subscriptions",
    value: "284",
    grad: "linear-gradient(135deg,#0ea5e9,#6366f1)",
  },
  {
    label: "Marketplace Listings",
    value: "1,240",
    grad: "linear-gradient(135deg,#10b981,#0ea5e9)",
  },
  {
    label: "Service Requests",
    value: "3,892",
    grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
];
const pieData = [
  { label: "Basic", pct: 40, color: "#6366f1" },
  { label: "Pro", pct: 35, color: "#8b5cf6" },
  { label: "Enterprise", pct: 25, color: "#0ea5e9" },
];
function Analytics() {
  return (
    <div className="space-y-6">
      <CustomHeading
        title="Analytics Dashboard"
        subtitle="Visualize key performance indicators, track revenue trends, and analyze subscription breakdowns to drive informed business decisions."
        icon={BarChart3}
        // badge={isLoading ? undefined : `${totalPlans} record${totalPlans !== 1 ? "s" : ""}`}
        badgeColor="violet"
        variant="default"
        size="md"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => (
          <div key={m.label} style={{ ...glass, padding: "18px" }}>
            <p className="text-xs text-slate-500 mb-1">{m.label}</p>
            <p
              className="text-2xl font-bold"
              style={{
                background: m.grad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">
          Revenue (in thousands)
        </h3>
        <div className="flex items-end gap-3 h-32">
          {barData.map((b) => (
            <div
              key={b.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-xs text-slate-500">{b.value}K</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(b.value / 130) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  width: "100%",
                  background: "linear-gradient(180deg,#6366f1,#8b5cf6)",
                  borderRadius: "6px 6px 0 0",
                  minHeight: "8px",
                }}
              />
              <span className="text-xs text-slate-400">{b.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">
          Subscription Breakdown
        </h3>
        <div className="flex items-center gap-8">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              {
                pieData.reduce(
                  (acc, seg, i) => {
                    const offset = acc.offset;
                    const dash = seg.pct;
                    acc.elements.push(
                      <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="3.5"
                        strokeDasharray={`${dash} ${100 - dash}`}
                        strokeDashoffset={-offset}
                      />,
                    );
                    acc.offset += dash;
                    return acc;
                  },
                  { offset: 0, elements: [] },
                ).elements
              }
            </svg>
          </div>
          <div className="space-y-2">
            {pieData.map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="text-sm text-slate-600">{p.label}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {p.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "verification", label: "User Verification", icon: ShieldCheck },
  { key: "services", label: "Service Management", icon: Briefcase },
  { key: "users", label: "User Control", icon: Users },
  { key: "plans", label: "Business Plans", icon: CreditCard },
  { key: "security", label: "Security", icon: Lock },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];
const sectionMap = {
  overview: Overview,
  verification: UserVerification,
  services: ServiceListing,
  users: UserControl,
  plans: BusinessPlans,
  security: Security,
  analytics: Analytics,
};

export default function AdminDashboard() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const Section = sectionMap[active];
  const [user, setUser] = useState({
    companyName: "Contracts India Pvt Ltd",
    contactPerson: "Admin User",
    email: "Admin@gmail.com",
    mobile: "9876543210",
  });
  const signOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("admin_auth_v1");
    localStorage.removeItem("login_mock_v1");
    localStorage.removeItem("otp_verified_v1");
    localStorage.removeItem("registration_form_v1");
    localStorage.removeItem("individual_user_v1");
    localStorage.removeItem("commercial_user_v1");
    window.dispatchEvent(new Event("auth_changed"));
    toast.success("Signed out");
    navigate("/login");
  };
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f1f5f9" }}
    >
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col h-full overflow-hidden flex-shrink-0"
        style={{
          background: "#0f172a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-bold text-sm whitespace-nowrap"
            >
              CI Admin
            </motion.span>
          )}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{
                background:
                  active === item.key
                    ? "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))"
                    : "transparent",
                color:
                  active === item.key ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                border:
                  active === item.key
                    ? "1px solid rgba(99,102,241,0.3)"
                    : "1px solid transparent",
              }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            // onClick={signOut}
            onClick={() => setLogoutOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
            }
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </motion.aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
            </button>
            <h1 className="font-semibold text-slate-800 text-sm">
              {navItems?.find((n) => n.key === active)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              A
            </div>
            <span className="text-sm text-slate-600 hidden sm:block">
              Super Admin
            </span>
          </div>
        </header>
        <LogoutPopup
          open={logoutOpen}
          user={{
            name: user.companyName || user.contactPerson || "Company",
            email: user.email || "",
            role: "Commercial Account",
          }}
          onCancel={() => setLogoutOpen(false)}
          onConfirm={async () => {
            setLogoutOpen(false);
            await signOut();
          }}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Section />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
