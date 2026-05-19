import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Briefcase, Settings, LogOut,
  CreditCard, ShoppingBag, Bell, BookOpen, History, ArrowRight,
  Edit3, CheckCircle2, Plus, Star, Zap, Menu, X, LayoutDashboard, Key,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { id: "overview",     label: "Dashboard",             icon: LayoutDashboard },
  { id: "profile",      label: "My Profile",           icon: User            },
  { id: "password",     label: "Change Password",      icon: Key             },
  { id: "subscription", label: "Subscription Plan", icon: CreditCard      },
];

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)]";

function Overview({ user }) {
  const firstName = user.name?.split(" ")[0] || "there";
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className={`relative overflow-hidden ${glassCard} p-6`}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/8 to-cyan-400/6 rounded-2xl" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="relative">
          {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Welcome back</p> */}
          <h1 className="mt-1 text-2xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
           Welcome back {firstName} 👋
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">Manage your services, credits, and profile from here.</p>
        </div>
      </motion.div>

      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Credits",       value: "250",  icon: CreditCard,  grad: "from-indigo-500 to-violet-500" },
          { label: "Services",      value: "3",    icon: ShoppingBag, grad: "from-emerald-500 to-teal-500"  },
          { label: "Bookings",      value: "7",    icon: History,     grad: "from-amber-500 to-orange-400"  },
          { label: "Notifications", value: "2",    icon: Bell,        grad: "from-pink-500 to-rose-500"     },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2 }} className={`${glassCard} p-5`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{s.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} shadow-lg`}>
                <s.icon className="h-5 w-5 text-white" />
              </span>
            </div>
          </motion.div>
        ))}
      </div> */}
    </div>
  );
}

function MyProfile({ user, onUpdate }) {
  const [form, setForm] = useState({
    name: user.name || "", email: user.email || "", mobile: user.mobile || "",
    address: user.address || "", profession: user.profession || "", services: user.services || "",
  });

  const handleUpdate = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("individual_user_v1", JSON.stringify(updated));
    onUpdate(updated);
    toast.success("Profile updated successfully!");
  };

  const field = (label, key, type = "text", multiline = false) => (
    <div key={key}>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white/70 resize-none" />
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white/70" />
      )}
    </div>
  );

  return (
    <div className={`${glassCard} p-6 space-y-5`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md">
          <User className="h-4 w-4 text-white" />
        </span>
        <h2 className="text-lg font-black text-slate-900">My Profile</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {field("Name *", "name")}
        {field("Email *", "email", "email")}
        {field("Mobile *", "mobile", "tel")}
        {field("Address", "address")}
        {field("Profession / Occupation", "profession")}
        {field("Services", "services", "text", true)}
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpdate}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
        <CheckCircle2 className="w-4 h-4" /> UPDATE
      </motion.button>
    </div>
  );
}

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation must match.");
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated successfully (demo only).");
  };

  return (
    <div className={`${glassCard} p-6 space-y-6`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md">
          <Key className="h-4 w-4 text-white" />
        </span>
        <div>
          <h2 className="text-lg font-black text-slate-900">Change Password</h2>
          <p className="text-sm text-slate-500">Update your account security with a new password.</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <label className="block mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Current Password</span>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="block mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">New Password</span>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="block mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Confirm Password</span>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePasswordChange}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg">
          <Key className="w-4 h-4" /> Update Password
        </motion.button>
      </div>
    </div>
  );
}

function SubscriptionSummary() {
  const subscriptions = [
    {
      plan: "Free Plan",
      price: "₹0/mo",
      status: "Active",
      expires: "Unlimited",
    },
    {
      plan: "Basic Plan",
      price: "₹299/mo",
      status: "Active",
      expires: "2026-06-20",
    },
    {
      plan: "Premium Plan",
      price: "₹599/mo",
      status: "Expired",
      expires: "2026-04-22",
    },
  ];

  return (
    <div className={`${glassCard} p-6`}> 
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md">
          <CreditCard className="h-4 w-4 text-white" />
        </span>
        <div>
          <h2 className="text-lg font-black text-slate-900">Subscription Plan</h2>
          <p className="text-sm text-slate-500">Review your active and past subscription plans.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {subscriptions.map(sub => (
          <div key={sub.plan} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-slate-900">{sub.plan}</p>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-[11px] font-bold border transition-all duration-300 ${
                  sub.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                }`}>
                {sub.status}
              </button>
            </div>
            <p className="text-sm text-slate-700 font-black mb-2">{sub.price}</p>
            <p className="text-xs text-slate-500">Expires on {sub.expires}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyAccount() {
  const [credits, setCredits] = useState(250);
  const [addAmt, setAddAmt] = useState("");
  const [bookedServices, setBookedServices] = useState([
    { id: 1, name: "Consulting Service", date: "2026-05-10", status: "Active" },
    { id: 2, name: "Legal Contracts",    date: "2026-04-22", status: "Completed" },
  ]);

  const handleAddCredits = () => {
    const amt = parseInt(addAmt);
    if (!amt || amt <= 0) { toast.error("Enter valid amount"); return; }
    setCredits(c => c + amt);
    setAddAmt("");
    toast.success(`₹${amt} credits added via Payment Gateway (demo)`);
  };

  return (
    <div className="space-y-5">
      {/* Credits */}
      <div className={`${glassCard} p-6`}>
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-500" /> Add Credits
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
            <p className="text-xs text-slate-500 font-semibold">Current Balance</p>
            <p className="text-2xl font-black text-indigo-700">₹{credits}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input type="number" value={addAmt} onChange={e => setAddAmt(e.target.value)} placeholder="Enter amount (₹)"
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none text-sm bg-white/70" />
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleAddCredits}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <Plus className="w-4 h-4 inline mr-1" /> Add via Payment Gateway
          </motion.button>
        </div>
      </div>

      {/* Booked Service History */}
      <div className={`${glassCard} p-6`}>
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-amber-500" /> Booked Service History
        </h3>
        <div className="space-y-3">
          {bookedServices.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.date}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                s.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
              }`}>{s.status}</span>
            </div>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          onClick={() => toast.info("Submitting service request (demo)")}>
          SUBMIT
        </motion.button>
      </div>
    </div>
  );
}

function GetServices() {
  const services = [
    { name: "Consulting Service",    price: "₹2,500", icon: "🏗️", desc: "Expert PMC & planning consultation" },
    { name: "Legal Contracts",       price: "₹1,800", icon: "⚖️", desc: "Contract drafting & legal review"   },
    { name: "Tender Services",       price: "₹3,200", icon: "📋", desc: "Tender filing & bid management"     },
    { name: "Assets Management",     price: "₹4,000", icon: "🏢", desc: "Infrastructure asset tracking"      },
    { name: "Brand Development",     price: "₹5,500", icon: "🎨", desc: "Brand identity & marketing"         },
    { name: "Marketing Management",  price: "₹3,800", icon: "📣", desc: "Digital & offline marketing"        },
  ];
  return (
    <div className={`${glassCard} p-6`}>
      <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-emerald-500" /> Get Services
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className="p-4 rounded-2xl border border-slate-200/80 bg-white/80 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer group">
            <div className="text-3xl mb-3">{s.icon}</div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{s.name}</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3">{s.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-indigo-600">{s.price}</span>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => toast.success(`${s.name} selected!`)}
                className="text-xs font-bold text-white px-3 py-1.5 rounded-lg shadow-sm"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                Select
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <div className={`${glassCard} p-6`}>
      <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-violet-500" /> Newsletter
      </h3>
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-amber-600 uppercase tracking-wide">Premium Subscribers Only</span>
        </div>
        <h4 className="font-black text-slate-900 text-base mb-1">May 2026 — Construction Market Insights</h4>
        <p className="text-sm text-slate-600">Latest trends in infrastructure, government tenders, and material pricing across India.</p>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="mt-4 flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm text-white shadow-md"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
          onClick={() => toast.info("Opening newsletter (demo)")}>
          Read Latest Newsletter <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
      <p className="text-xs text-slate-400">Upgrade to paid subscription to access all newsletters.</p>
    </div>
  );
}

function SettingsPanel({ user, onUpdate }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || "",
    address: user.address || "",
    profession: user.profession || "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

const subscriptions = [
  {
    plan: "Free Plan",
    price: "₹0/mo",
    status: "Active",
    expires: "Unlimited",
  },
  {
    plan: "Basic Plan",
    price: "₹299/mo",
    status: "Active",
    expires: "2026-06-20",
  },
  {
    plan: "Premium Plan",
    price: "₹599/mo",
    status: "Expired",
    expires: "2026-04-22",
  },
];

  const handleUpdate = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("individual_user_v1", JSON.stringify(updated));
    onUpdate(updated);
    toast.success("Profile settings updated successfully!");
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation must match.");
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated successfully (demo only).");
  };

  return (
    <div className={`${glassCard} p-6 space-y-6`}>
      <div className="flex items-center gap-3">
        <Settings className="w-5 h-5 text-slate-500" />
        <div>
          <h3 className="font-black text-slate-900"> My Profile</h3>
          <p className="text-xs text-slate-500">Update account details, security, and subscriptions.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
          <h4 className="text-sm font-black text-slate-900 mb-4">Profile Details</h4>
          {[
            ["Name", "name"],
            ["Email", "email"],
            ["Mobile", "mobile"],
            ["Profession", "profession"],
          ].map(([label, key]) => (
            <label key={key} className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
              <input value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </label>
          ))}
          <label className="block mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Address</span>
            <textarea value={form.address} onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
              rows={3} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none" />
          </label>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpdate}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg">
            <Edit3 className="w-4 h-4" /> Save Profile
          </motion.button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
          <h4 className="text-sm font-black text-slate-900 mb-4">Change Password</h4>
          {/* <label className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 mb-4">
            <div>
              <p className="font-semibold text-slate-900">Email Notifications</p>
              <p className="text-xs text-slate-500">Get updates and reminders by email.</p>
            </div>
            <button onClick={() => setEmailNotif(v => !v)}>
              {emailNotif ? <ToggleRight className="w-10 h-10 text-indigo-500" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 mb-4">
            <div>
              <p className="font-semibold text-slate-900">Push Notifications</p>
              <p className="text-xs text-slate-500">Receive instant app alerts.</p>
            </div>
            <button onClick={() => setPushNotif(v => !v)}>
              {pushNotif ? <ToggleRight className="w-10 h-10 text-indigo-500" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
            </button>
          </label> */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Current Password</span>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">New Password</span>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Confirm Password</span>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePasswordChange}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg">
              <Key className="w-4 h-4" /> Update Password
            </motion.button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <h4 className="text-sm font-black text-slate-900 mb-4">Subscription Summary</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {subscriptions.map(sub => (
            <div key={sub.plan} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-slate-900">{sub.plan}</p>
                <button
  type="button"
  className={`rounded-full px-3 py-1 text-[11px] font-bold border transition-all duration-300 ${
    sub.status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
      : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
  }`}
>
  {sub.status}
</button>
              </div>
              <p className="text-sm text-slate-700 font-black mb-2">{sub.price}</p>
              <p className="text-xs text-slate-500">Expires on {sub.expires}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IndividualDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const rawUser = localStorage.getItem("individual_user_v1");
  const [user, setUser] = useState(rawUser ? JSON.parse(rawUser) : { name: "Demo User", email: "demo@example.com", mobile: "9876543210" });

  const initials = (user.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("individual_user_v1");
    localStorage.removeItem("login_mock_v1");
            localStorage.setItem("isLoggedIn", false);

    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":     return <Overview user={user} />;
      case "profile":      return <MyProfile user={user} onUpdate={setUser} />;
      case "password":     return <ChangePassword />;
      case "subscription": return <SubscriptionSummary />;
      case "account":      return <MyAccount />;
      case "services":     return <GetServices />;
      case "newsletter":   return <Newsletter />;
      case "history":      return <MyAccount />;
      case "settings":     return <SettingsPanel user={user} onUpdate={setUser} />;
      default:             return <Overview user={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-[120px]" />
        <div className="absolute right-[-80px] top-[30%] h-[400px] w-[400px] rounded-full bg-violet-400/10 blur-[120px]" />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col bg-white/80 backdrop-blur-2xl border-r border-indigo-100/60 shadow-[4px_0_24px_rgba(99,102,241,0.06)] lg:relative lg:translate-x-0 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-16 items-center gap-3 border-b border-indigo-100/60 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white shadow-md">{initials}</div>
          <div>
            <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{user.name}</p>
            <p className="text-[10px] text-indigo-500">Individual Account</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeTab === id ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-indigo-100/60 p-3">
          <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 bg-white/80 backdrop-blur-xl border-b border-indigo-100/60 px-4 sm:px-6">
          <button className="lg:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-500" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <h2 className="text-sm font-bold text-slate-700">{NAV.find(n => n.id === activeTab)?.label}</h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <Zap className="h-3.5 w-3.5" /> Individual Account
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
