import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard, User, CreditCard, History, Briefcase, Eye,
  List, FileText, Settings, LogOut, Menu, X, Plus, CheckCircle2,
  Upload, ChevronDown, Zap, ToggleLeft, ToggleRight,
} from "lucide-react";

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)]";
const btnGrad = { background: "linear-gradient(135deg, #3b82f6, #6366f1)" };

const NAV = [
  { id: "overview",      label: "Overview",              icon: LayoutDashboard },
  { id: "profile",       label: "My Profile",            icon: User            },
  { id: "credits",       label: "Add Credits",           icon: CreditCard      },
  { id: "payments",      label: "Payment History",       icon: History         },
  { id: "subscription",  label: "Subscription History",  icon: Briefcase       },
  { id: "clients",       label: "Client History",        icon: User            },
  { id: "leads",         label: "Lead Management",       icon: List            },
  { id: "visibility",    label: "Marketplace Visibility",icon: Eye             },
  { id: "services",      label: "Service Listing",       icon: Briefcase       },
  { id: "documents",     label: "Documents",             icon: FileText        },
  { id: "settings",      label: "Settings",              icon: Settings        },
];

const ALL_SERVICES = [
  "Consulting Service","Legal Contracts","Tender Services","Assets Management",
  "Brand Development","Marketing Management","Material Supplier","Material Manufacture",
  "Contractor Service","Construction Audit",
];

// ─── Overview ────────────────────────────────────────────────────────────────
function Overview({ user }) {
  const name = user.companyName || user.contactPerson || "there";
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${glassCard} p-6`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-violet-400/6 rounded-2xl" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">Welcome back</p>
          <h1 className="mt-1 text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
            Hello, {name} 👋
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {user.email && <span className="mr-3">📧 {user.email}</span>}
            {user.mobile && <span>📱 {user.mobile}</span>}
          </p>
          {user.services?.length > 0 && (
            <p className="mt-2 text-xs text-indigo-600 font-semibold">
              Services: {Array.isArray(user.services) ? user.services.join(", ") : user.services}
            </p>
          )}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Credits",      value: "500",  grad: "from-blue-500 to-indigo-500",   icon: CreditCard  },
          { label: "Active Leads", value: "12",   grad: "from-emerald-500 to-teal-500",  icon: List        },
          { label: "Clients",      value: "8",    grad: "from-amber-500 to-orange-400",  icon: User        },
          { label: "Services",     value: "5",    grad: "from-pink-500 to-rose-500",     icon: Briefcase   },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} whileHover={{ y: -2 }} className={`${glassCard} p-5`}>
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
      </div>
    </div>
  );
}

// ─── My Profile ──────────────────────────────────────────────────────────────
function MyProfile({ user, onUpdate }) {
  const [form, setForm] = useState({
    companyName: user.companyName || "",
    contactPerson: user.contactPerson || "",
    email: user.email || "",
    mobile: user.mobile || "",
    address: user.address || "",
    services: Array.isArray(user.services) ? user.services : [],
  });
  const [images, setImages] = useState([]);
  const [pan, setPan] = useState(null);
  const [gst, setGst] = useState(null);
  const [profile, setProfile] = useState(null);

  const toggle = (svc) => setForm(p => ({
    ...p,
    services: p.services.includes(svc) ? p.services.filter(s => s !== svc) : [...p.services, svc],
  }));

  const handleSubmit = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("commercial_user_v1", JSON.stringify(updated));
    onUpdate(updated);
    toast.success("Profile updated successfully!");
  };

  const inp = "w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white/70";

  return (
    <div className={`${glassCard} p-6 space-y-5`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
          <User className="h-4 w-4 text-white" />
        </span>
        <h2 className="text-lg font-black text-slate-900">My Profile</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[["Company Name *","companyName"],["Contact Person Name *","contactPerson"],
          ["Email *","email"],["Mobile *","mobile"]].map(([lbl,key]) => (
          <div key={key}>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">{lbl}</label>
            <input className={inp} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Address</label>
          <textarea className={`${inp} resize-none`} rows={2} value={form.address}
            onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
        </div>
      </div>

      {/* Services multi-select */}
      <div>
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">Services (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {ALL_SERVICES.map(svc => (
            <button key={svc} type="button" onClick={() => toggle(svc)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                form.services.includes(svc)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}>{svc}</button>
          ))}
        </div>
      </div>

      {/* File uploads */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["Upload Company/Product Images", images, setImages, true],
          ["Upload PAN Card", pan, setPan, false],
          ["Upload GST Certificate", gst, setGst, false],
          ["Upload Company Profile", profile, setProfile, false],
        ].map(([lbl, val, setter, multi]) => (
          <div key={lbl}>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">{lbl}</label>
            <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-blue-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 bg-blue-50/40 transition-all">
              <Upload className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-slate-500">{multi && val?.length ? `${val.length} file(s)` : val?.name || "Click or drag to upload"}</span>
              <input type="file" className="hidden" multiple={multi}
                onChange={e => setter(multi ? Array.from(e.target.files) : e.target.files[0])} />
            </label>
          </div>
        ))}
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg" style={btnGrad}>
        <CheckCircle2 className="w-4 h-4" /> SUBMIT
      </motion.button>
    </div>
  );
}

// ─── Add Credits ─────────────────────────────────────────────────────────────
function AddCredits() {
  const [credits, setCredits] = useState(500);
  const [amt, setAmt] = useState("");
  const add = () => {
    const n = parseInt(amt);
    if (!n || n <= 0) { toast.error("Enter a valid amount"); return; }
    setCredits(c => c + n); setAmt("");
    toast.success(`₹${n} credits added (demo payment gateway)`);
  };
  return (
    <div className={`${glassCard} p-6 space-y-5`}>
      <h3 className="font-black text-slate-900 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-500" /> Add Credits
      </h3>
      <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 inline-block">
        <p className="text-xs text-slate-500 font-semibold">Current Balance</p>
        <p className="text-3xl font-black text-blue-700">₹{credits}</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        {[500,1000,2000,5000].map(v => (
          <button key={v} onClick={() => setAmt(String(v))}
            className="px-4 py-2 rounded-xl border border-blue-200 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all">
            ₹{v}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="Custom amount (₹)"
          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-sm bg-white/70" />
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={add}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md" style={btnGrad}>
          <Plus className="w-4 h-4 inline mr-1" /> Pay via Gateway
        </motion.button>
      </div>
      <p className="text-xs text-slate-400">Demo integration — no real payment processed.</p>
    </div>
  );
}

// ─── Generic Table ────────────────────────────────────────────────────────────
function DataTable({ title, icon: Icon, cols, rows, color = "blue" }) {
  return (
    <div className={`${glassCard} p-6`}>
      <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
        <Icon className={`w-5 h-5 text-${color}-500`} /> {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {cols.map(c => <th key={c} className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                {r.map((cell, j) => <td key={j} className="py-2.5 px-3 text-slate-700">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Lead Management ─────────────────────────────────────────────────────────
function LeadManagement() {
  const [leads, setLeads] = useState([
    { id: 1, name: "Rajesh Kumar", service: "Consulting", date: "2026-05-10", status: "New" },
    { id: 2, name: "Priya Sharma", service: "Legal Contracts", date: "2026-05-08", status: "In Progress" },
    { id: 3, name: "Amit Singh",   service: "Tender Services", date: "2026-05-05", status: "Closed" },
  ]);
  const statusColor = { New: "bg-blue-50 text-blue-700 border-blue-200", "In Progress": "bg-amber-50 text-amber-700 border-amber-200", Closed: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  return (
    <div className={`${glassCard} p-6`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-slate-900 flex items-center gap-2"><List className="w-5 h-5 text-indigo-500" /> Lead Management</h3>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => toast.info("Add lead form (demo)")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md" style={btnGrad}>
          <Plus className="w-3.5 h-3.5" /> Add Lead
        </motion.button>
      </div>
      <div className="space-y-3">
        {leads.map(l => (
          <div key={l.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">{l.name}</p>
              <p className="text-xs text-slate-400">{l.service} · {l.date}</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColor[l.status]}`}>{l.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Marketplace Visibility ───────────────────────────────────────────────────
function MarketplaceVisibility() {
  const [visible, setVisible] = useState(true);
  return (
    <div className={`${glassCard} p-6 space-y-5`}>
      <h3 className="font-black text-slate-900 flex items-center gap-2"><Eye className="w-5 h-5 text-emerald-500" /> Marketplace Visibility</h3>
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100">
        <div>
          <p className="font-bold text-slate-800">Show in Marketplace</p>
          <p className="text-xs text-slate-500 mt-0.5">When enabled, your company appears in public search results.</p>
        </div>
        <button onClick={() => { setVisible(v => !v); toast.success(`Visibility ${!visible ? "enabled" : "disabled"}`); }}>
          {visible
            ? <ToggleRight className="w-10 h-10 text-emerald-500" />
            : <ToggleLeft className="w-10 h-10 text-slate-400" />}
        </button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {["Featured Listing","Priority Search","Badge Display"].map(f => (
          <div key={f} className="p-3 rounded-xl border border-blue-100 bg-blue-50/40 text-center">
            <p className="text-xs font-bold text-blue-700">{f}</p>
            <p className="text-[10px] text-slate-500 mt-1">Premium feature</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Service Listing ──────────────────────────────────────────────────────────
function ServiceListing() {
  const [active, setActive] = useState(["Consulting Service","Legal Contracts"]);
  const toggle = (s) => setActive(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  return (
    <div className={`${glassCard} p-6`}>
      <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-violet-500" /> Service Listing Management</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {ALL_SERVICES.map(s => (
          <div key={s} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60">
            <span className="text-sm font-semibold text-slate-700">{s}</span>
            <button onClick={() => { toggle(s); toast.success(`${s} ${active.includes(s) ? "removed" : "added"}`); }}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                active.includes(s) ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>{active.includes(s) ? "Active" : "Inactive"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────
const DOC_UPLOADS = [
  "Proof of Identity","MOA/AOA","Proprietorship/Partnership Deed","Bank Certificate",
  "Registration under Shop Establishment Act","CST/VAT/TIN/PIN Certificate",
  "Certificate/Registration issued by Sales Tax/Service Tax/Professional Tax Authorities",
  "Certificate of Incorporation",
  "Registration with Govt Authorities/Local Bodies/Tax Authorities/State Authorities",
  "Trade Licence","Registered/Notarized Trust Deed","AICTE Approval for Educational Institutions",
  "Import Export Certificate","Mandi Board Registration Certificate","Udyog Aadhar",
];

const POI_OPTIONS = [
  "Income Tax PAN Card","Passport","Driving License",
  "Photo Identity Card with Address issued by recognized Professional Body",
  "ECHS/CGHS Card","Defence Personnel Service Certificate",
  "Certificate issued by MP/MLA/Gazetted Officer","Domicile Certificate",
  "Caste Certificate with Photograph","Govt Recognized Education Institute Certificate",
  "Address Card with Photo issued by Dept. of Posts",
  "Smart Card/Dependent Card issued by CSD","Current Passbook with Photograph",
  "Freedom Fighter Card","Embassy/Consulate Certificate","POI Card","Embassy ID Card",
];

const POA_OPTIONS = [
  "Certificate/Registration issued by Sales Tax","MOA/AOA",
  "Registration of Firm issued by Government Authorities",
  "Registration under Shop Establishment Act","CST/VAT/TIN/PIN Certificate",
  "Sales Tax/Service Tax/Professional Tax Certificates","Certificate of Incorporation",
  "Govt Registration Certificates","Registered/Notarized Rent Agreement",
  "Import Export Certificate","Leased Line Bill","Trade Licence","AICTE Approval",
];

function DropZone({ label }) {
  const [file, setFile] = useState(null);
  return (
    <div>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</label>
      <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-blue-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 bg-blue-50/30 transition-all min-h-[80px]">
        <Upload className="w-5 h-5 text-blue-400" />
        <span className="text-xs text-slate-500 text-center">{file ? file.name : "Drag & drop or click to upload"}</span>
        {file && <span className="text-[10px] text-emerald-600 font-semibold">✓ Ready to submit</span>}
        <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
      </label>
    </div>
  );
}

function SelectField({ label, options }) {
  const [val, setVal] = useState("");
  return (
    <div className="sm:col-span-2">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</label>
      <div className="relative">
        <select value={val} onChange={e => setVal(e.target.value)}
          className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white/70">
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function Documents() {
  return (
    <div className={`${glassCard} p-6 space-y-6`}>
      <h3 className="font-black text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Documents</h3>

      {/* Upload fields */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOC_UPLOADS.map(d => <DropZone key={d} label={d} />)}
      </div>

      {/* Dropdowns */}
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField label="Proof of Identity (Authorized Signatory)" options={POI_OPTIONS} />
        <SelectField label="Proof of Address" options={POA_OPTIONS} />
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => toast.success("Documents submitted (demo)")}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg" style={btnGrad}>
        <CheckCircle2 className="w-4 h-4" /> SUBMIT DOCUMENTS
      </motion.button>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsPanel({ user }) {
  const [notif, setNotif] = useState(true);
  const [email, setEmail] = useState(true);
  return (
    <div className={`${glassCard} p-6 space-y-5`}>
      <h3 className="font-black text-slate-900 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-500" /> Settings</h3>
      {[["Email Notifications", email, setEmail],["Push Notifications", notif, setNotif]].map(([lbl, val, setter]) => (
        <div key={lbl} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100">
          <p className="font-semibold text-slate-700 text-sm">{lbl}</p>
          <button onClick={() => setter(v => !v)}>
            {val ? <ToggleRight className="w-9 h-9 text-blue-500" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
          </button>
        </div>
      ))}
      <div className="p-4 rounded-xl bg-red-50/60 border border-red-100">
        <p className="text-sm font-bold text-red-700 mb-1">Danger Zone</p>
        <p className="text-xs text-slate-500 mb-3">Permanently delete your account and all data.</p>
        <button onClick={() => toast.error("Account deletion requires support contact.")}
          className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 border border-red-200 hover:bg-red-100 transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CommercialDashboard() {
  const navigate = useNavigate();
  const raw = localStorage.getItem("commercial_user_v1");
  const [user, setUser] = useState(raw ? JSON.parse(raw) : {
    companyName: "Demo Company", contactPerson: "Demo User",
    email: "demo@company.com", mobile: "9876543210",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user.companyName || user.contactPerson || "C")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("commercial_user_v1");
    navigate("/login");
  };

  const payRows = [
    ["#PAY001","₹500","Credits","2026-05-10","Success"],
    ["#PAY002","₹1,000","Subscription","2026-04-22","Success"],
    ["#PAY003","₹250","Credits","2026-03-15","Failed"],
  ];
  const subRows = [
    ["Basic Plan","₹999/mo","2026-05-01","2026-06-01","Active"],
    ["Pro Plan","₹2,499/mo","2026-02-01","2026-05-01","Expired"],
  ];
  const clientRows = [
    ["Rajesh Kumar","rajesh@email.com","Consulting","2026-05-10","Active"],
    ["Priya Sharma","priya@email.com","Legal","2026-04-22","Completed"],
    ["Amit Singh","amit@email.com","Tender","2026-03-18","Active"],
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":     return <Overview user={user} />;
      case "profile":      return <MyProfile user={user} onUpdate={setUser} />;
      case "credits":      return <AddCredits />;
      case "payments":     return <DataTable title="Payment History" icon={History} color="blue"
                             cols={["Txn ID","Amount","Type","Date","Status"]} rows={payRows} />;
      case "subscription": return <DataTable title="Subscription History" icon={Briefcase} color="violet"
                             cols={["Plan","Price","Start","End","Status"]} rows={subRows} />;
      case "clients":      return <DataTable title="Client History" icon={User} color="emerald"
                             cols={["Name","Email","Service","Date","Status"]} rows={clientRows} />;
      case "leads":        return <LeadManagement />;
      case "visibility":   return <MarketplaceVisibility />;
      case "services":     return <ServiceListing />;
      case "documents":    return <Documents />;
      case "settings":     return <SettingsPanel user={user} />;
      default:             return <Overview user={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute right-[-80px] top-[30%] h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-[120px]" />
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-62 flex flex-col bg-white/80 backdrop-blur-2xl border-r border-blue-100/60 shadow-[4px_0_24px_rgba(59,130,246,0.06)] lg:relative lg:translate-x-0 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: "15rem" }}>
        <div className="flex h-16 items-center gap-3 border-b border-blue-100/60 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-black text-white shadow-md shrink-0">{initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user.companyName || user.contactPerson}</p>
            <p className="text-[10px] text-blue-500">Commercial Account</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="font-semibold truncate">{label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-blue-100/60 p-3">
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 bg-white/80 backdrop-blur-xl border-b border-blue-100/60 px-4 sm:px-6">
          <button className="lg:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-500"
            onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <h2 className="text-sm font-bold text-slate-700">{NAV.find(n => n.id === activeTab)?.label}</h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <Zap className="h-3.5 w-3.5" /> Commercial Account
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
