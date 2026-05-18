import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { LayoutDashboard, ShieldCheck, Briefcase, Users, CreditCard, Lock, BarChart3, LogOut, CheckCircle, XCircle, Plus, Edit2, Trash2, ChevronRight, Activity, TrendingUp } from "lucide-react";

const glass = { background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: "16px" };
const gradBtn = { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "10px", padding: "8px 18px", fontWeight: 600, fontSize: "13px", cursor: "pointer" };
const Badge = ({ color, children }) => (
  <span style={{ background: color === "green" ? "#dcfce7" : color === "red" ? "#fee2e2" : color === "yellow" ? "#fef9c3" : "#e0e7ff", color: color === "green" ? "#16a34a" : color === "red" ? "#dc2626" : color === "yellow" ? "#ca8a04" : "#4f46e5", borderRadius: "999px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>{children}</span>
);

const stats = [
  { label: "Total Users", value: "4,821", grad: "linear-gradient(135deg,#6366f1,#8b5cf6)", icon: Users },
  { label: "Commercial Users", value: "1,204", grad: "linear-gradient(135deg,#0ea5e9,#6366f1)", icon: Briefcase },
  { label: "Individual Users", value: "3,617", grad: "linear-gradient(135deg,#10b981,#0ea5e9)", icon: Users },
  { label: "Active Services", value: "10", grad: "linear-gradient(135deg,#f59e0b,#ef4444)", icon: Activity },
  { label: "Revenue", value: "₹12.4L", grad: "linear-gradient(135deg,#ec4899,#8b5cf6)", icon: TrendingUp },
  { label: "Subscriptions", value: "284", grad: "linear-gradient(135deg,#14b8a6,#6366f1)", icon: CreditCard },
];
const recentActivity = [
  { text: "New commercial user registered: Sharma Builders", time: "2 min ago" },
  { text: "Service Tender updated by admin", time: "15 min ago" },
  { text: "User blocked: john.doe@example.com", time: "1 hr ago" },
  { text: "New subscription: Pro Plan — Gupta Contractors", time: "3 hr ago" },
  { text: "Password changed by super-admin", time: "Yesterday" },
];

function Overview() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-5">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <motion.div key={s.label} whileHover={{ y: -3 }} style={{ ...glass, padding: "20px" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.grad }}>
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
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Activity className="w-4 h-4" /> Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
              <p className="text-sm text-slate-600">{a.text}</p>
              <span className="text-xs text-slate-400 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const initIndividual = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", mobile: "9876543210", date: "2025-06-01", status: "Pending" },
  { id: 2, name: "Priya Mehta", email: "priya@gmail.com", mobile: "9123456789", date: "2025-06-03", status: "Pending" },
  { id: 3, name: "Amit Verma", email: "amit@gmail.com", mobile: "9988776655", date: "2025-06-05", status: "Verified" },
  { id: 4, name: "Sunita Rao", email: "sunita@gmail.com", mobile: "9001122334", date: "2025-06-07", status: "Rejected" },
];
const initCommercial = [
  { id: 1, name: "Shapoorji Pallonji & Co.", email: "shapoorjipallonji@gmail.com", mobile: "9811223344", date: "2025-05-28", status: "Verified" },
  { id: 2, name: "Design Arc Architects", email: "designarcarchitects@gmail.com", mobile: "9922334455", date: "2025-06-02", status: "Verified" },
  { id: 3, name: "UrbanSpace Interiors", email: "urbanSpaceinteriors@gmail.com", mobile: "9033445566", date: "2025-06-06", status: "Verified" },
  { id: 4, name: "Volt & Wire Electrical", email: "vote@voltwireelectrical.com", mobile: "9033446532", date: "2025-02-06", status: "Verified" },
  { id: 5, name: "Shivam Brothers", email: "shivam@patelinteriors.com", mobile: "9033446589", date: "2025-01-06", status: "Pending" },
];

function UserVerification() {
  const [tab, setTab] = useState("individual");
  const [indUsers, setIndUsers] = useState(initIndividual);
  const [comUsers, setComUsers] = useState(initCommercial);
  const users = tab === "individual" ? indUsers : comUsers;
  const setUsers = tab === "individual" ? setIndUsers : setComUsers;
  const updateStatus = (id, status) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u)); toast.success(`User ${status.toLowerCase()} successfully`); };
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-5">User Verification</h2>
      <div className="flex gap-2 mb-5">
        {["individual", "commercial"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...gradBtn, background: tab === t ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.7)", color: tab === t ? "#fff" : "#64748b", border: tab === t ? "none" : "1px solid #e2e8f0" }}>
            {t === "individual" ? "Individual Users" : "Commercial Users"}
          </button>
        ))}
      </div>
      <div style={{ ...glass, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead><tr style={{ background: "rgba(99,102,241,0.07)" }}>
              {["Name", "Email", "Mobile", "Registered", "Status", "Actions"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1e293b" }}>{u.name}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.mobile}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.date}</td>
                  <td style={{ padding: "12px 16px" }}><Badge color={u.status === "Verified" ? "green" : u.status === "Rejected" ? "red" : "yellow"}>{u.status}</Badge></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(u.id, "Verified")} style={{ ...gradBtn, padding: "5px 12px", fontSize: "12px", background: "linear-gradient(135deg,#10b981,#059669)" }}><CheckCircle className="w-3 h-3 inline mr-1" />Verify</button>
                      <button onClick={() => updateStatus(u.id, "Rejected")} style={{ ...gradBtn, padding: "5px 12px", fontSize: "12px", background: "linear-gradient(135deg,#ef4444,#dc2626)" }}><XCircle className="w-3 h-3 inline mr-1" />Reject</button>
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

const initServices = [
  { id: 1, name: "Consulting", category: "Consultant", desc: "Expert business consulting", subs: ["Strategy", "Finance", "Operations"] },
  { id: 2, name: "Contractor", category: "Contractor", desc: "Construction contracting", subs: ["Civil", "Electrical", "Plumbing"] },
  // { id: 3, name: "Tender", category: "Contractor", desc: "Tender management services", subs: ["Govt Tenders", "Private Tenders"] },
  { id: 4, name: "Assets Management", category: "Builder", desc: "Asset lifecycle management", subs: ["Valuation", "Maintenance"] },
  { id: 5, name: "Legal Contracts", category: "Consultant", desc: "Legal documentation", subs: ["Drafting", "Review", "Compliance"] },
  { id: 6, name: "Brand Development", category: "Manufacturer", desc: "Brand strategy and identity", subs: ["Logo", "Marketing Kit"] },
  { id: 7, name: "Marketing", category: "Manufacturer", desc: "Digital and offline marketing", subs: ["SEO", "Social Media", "Ads"] },
  { id: 8, name: "Material Supply", category: "Builder", desc: "Construction material supply", subs: ["Cement", "Steel", "Bricks"] },
  { id: 9, name: "Material Manufacture", category: "Manufacturer", desc: "Manufacturing services", subs: ["Custom Parts", "Bulk Orders"] },
  { id: 10, name: "Construction Audit", category: "Builder", desc: "Quality and compliance audit", subs: ["Site Audit", "Safety Check"] },
];

function ServiceManagement() {
  const [services, setServices] = useState(initServices);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Contractor", desc: "", subs: "" });
  const addService = () => {
    if (!form.name) { toast.error("Service name required"); return; }
    setServices(prev => [...prev, { id: Date.now(), name: form.name, category: form.category, desc: form.desc, subs: form.subs.split(",").map(s => s.trim()).filter(Boolean) }]);
    setForm({ name: "", category: "Contractor", desc: "", subs: "" }); setShowForm(false); toast.success("Service added!");
  };
  const deleteService = (id) => { setServices(prev => prev.filter(s => s.id !== id)); toast.success("Service deleted"); };
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">Service Management</h2>
        <button onClick={() => setShowForm(!showForm)} style={gradBtn}><Plus className="w-4 h-4 inline mr-1" />Add Service</button>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ ...glass, padding: "20px", marginBottom: "20px" }}>
            <h3 className="font-semibold text-slate-700 mb-4">New Service</h3>
            <div className="grid grid-cols-2 gap-4">
              {[["Service Name", "name"], ["Description", "desc"]].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
                  <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400">
                  {["Contractor", "Builder", "Interior", "Manufacturer", "Consultant"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Sub-services (comma-separated)</label>
                <input value={form.subs} onChange={e => setForm({ ...form, subs: e.target.value })} placeholder="e.g. Design, Build, Audit" className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addService} style={gradBtn}>Save Service</button>
              <button onClick={() => setShowForm(false)} style={{ ...gradBtn, background: "#e2e8f0", color: "#64748b" }}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ ...glass, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead><tr style={{ background: "rgba(99,102,241,0.07)" }}>
              {["Service", "Category", "Sub-services", "Actions"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={{ padding: "12px 16px" }}><p className="font-medium text-slate-800">{s.name}</p><p className="text-xs text-slate-400">{s.desc}</p></td>
                  <td style={{ padding: "12px 16px" }}><Badge color="indigo">{s.category}</Badge></td>
                  <td style={{ padding: "12px 16px" }}><div className="flex flex-wrap gap-1">{s.subs.map(sub => <span key={sub} style={{ background: "#f1f5f9", color: "#475569", borderRadius: "6px", padding: "2px 8px", fontSize: "11px" }}>{sub}</span>)}</div></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex gap-2">
                      <button style={{ ...gradBtn, padding: "5px 10px", fontSize: "12px" }}><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => deleteService(s.id)} style={{ ...gradBtn, padding: "5px 10px", fontSize: "12px", background: "linear-gradient(135deg,#ef4444,#dc2626)" }}><Trash2 className="w-3 h-3" /></button>
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

const initAllUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", type: "Individual", status: "Active" },
  { id: 2, name: "Sharma Builders", email: "info@sharmabuilders.com", type: "Commercial", status: "Active" },
  { id: 3, name: "Priya Mehta", email: "priya@gmail.com", type: "Individual", status: "Blocked" },
  { id: 4, name: "Gupta Contractors", email: "contact@guptacontractors.com", type: "Commercial", status: "Active" },
  { id: 5, name: "Amit Verma", email: "amit@gmail.com", type: "Individual", status: "Active" },
];
function UserControl() {
  const [users, setUsers] = useState(initAllUsers);
  const toggle = (id) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u)); toast.success("User status updated"); };
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-5">User Control</h2>
      <div style={{ ...glass, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead><tr style={{ background: "rgba(99,102,241,0.07)" }}>
              {["Name", "Email", "Type", "Status", "Action"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1e293b" }}>{u.name}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}><Badge color={u.type === "Commercial" ? "indigo" : ""}>{u.type}</Badge></td>
                  <td style={{ padding: "12px 16px" }}><Badge color={u.status === "Active" ? "green" : "red"}>{u.status}</Badge></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => toggle(u.id)} style={{ ...gradBtn, padding: "5px 14px", fontSize: "12px", background: u.status === "Active" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#10b981,#059669)" }}>
                      {u.status === "Active" ? "Block" : "Unblock"}
                    </button>
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

const existingPlans = [
  { name: "Basic", price: "0/mo", features: "5 Services, 100 Credits, Email Support", credits: 100 },
  { name: "Pro", price: "2,499/mo", features: "All Services, 500 Credits, Priority Support", credits: 500 },
  { name: "Enterprise", price: "9,999/mo", features: "Unlimited, 2000 Credits, Dedicated Manager", credits: 2000 },
];
const userOptions = ["Rahul Sharma", "Sharma Builders", "Priya Mehta", "Gupta Contractors", "Amit Verma"];
function BusinessPlans() {
  const [plan, setPlan] = useState({ name: "", price: "", duration: "Monthly", features: "", credits: "" });
  const [alloc, setAlloc] = useState({ user: userOptions[0], credits: "" });
  const savePlan = () => { if (!plan.name) { toast.error("Plan name required"); return; } toast.success(`Plan created!`); setPlan({ name: "", price: "", duration: "Monthly", features: "", credits: "" }); };
  const allocate = () => { if (!alloc.credits) { toast.error("Enter credits"); return; } toast.success(`${alloc.credits} credits allocated to ${alloc.user}`); setAlloc({ ...alloc, credits: "" }); };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Business Plans</h2>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Current Plans</h3>
        <div className="grid grid-cols-3 gap-4">
          {existingPlans.map(p => (
            <div key={p.name} style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "12px", padding: "16px" }}>
              <p className="font-bold text-slate-800 text-lg">{p.name}</p>
              <p style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, fontSize: "18px" }}>Rs.{p.price}</p>
              <p className="text-xs text-slate-500 mt-1">{p.features}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Create New Plan</h3>
        <div className="grid grid-cols-2 gap-4">
          {[["Plan Name", "name"], ["Price", "price"], ["Credits Included", "credits"]].map(([label, key]) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
              <input value={plan[key]} onChange={e => setPlan({ ...plan, [key]: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Duration</label>
            <select value={plan.duration} onChange={e => setPlan({ ...plan, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400">
              <option>Monthly</option><option>Yearly</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-slate-500 block mb-1">Features</label>
            <textarea value={plan.features} onChange={e => setPlan({ ...plan, features: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400 resize-none" />
          </div>
        </div>
        <button onClick={savePlan} style={{ ...gradBtn, marginTop: "12px" }}>Create Plan</button>
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Credit Allocation</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 block mb-1">Select User</label>
            <select value={alloc.user} onChange={e => setAlloc({ ...alloc, user: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400">
              {userOptions.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 block mb-1">Credits</label>
            <input type="number" value={alloc.credits} onChange={e => setAlloc({ ...alloc, credits: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400" />
          </div>
          <button onClick={allocate} style={gradBtn}>Allocate</button>
        </div>
      </div>
    </div>
  );
}

const adminRoles = [
  { name: "Super Admin", email: "admin@contractsindia.com", role: "Super Admin" },
  { name: "Ops Manager", email: "ops@contractsindia.com", role: "Manager" },
  { name: "Support Lead", email: "support@contractsindia.com", role: "Support" },
];
const activityLogs = [
  { action: "Logged in", admin: "Super Admin", time: "Today 10:32 AM" },
  { action: "Deleted service: Old Consulting", admin: "Super Admin", time: "Today 09:15 AM" },
  { action: "Blocked user: priya@gmail.com", admin: "Ops Manager", time: "Yesterday 4:20 PM" },
  { action: "Created plan: Enterprise Plus", admin: "Super Admin", time: "Jun 8, 2025" },
  { action: "Password changed", admin: "Super Admin", time: "Jun 7, 2025" },
];
function Security() {
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const updatePw = () => {
    if (!pw.current || !pw.next) { toast.error("Fill all fields"); return; }
    if (pw.next !== pw.confirm) { toast.error("Passwords do not match"); return; }
    toast.success("Password updated successfully"); setPw({ current: "", next: "", confirm: "" });
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Security</h2>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Change Password</h3>
        <div className="grid grid-cols-3 gap-4">
          {[["Current Password", "current"], ["New Password", "next"], ["Confirm Password", "confirm"]].map(([label, key]) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
              <input type="password" value={pw[key]} onChange={e => setPw({ ...pw, [key]: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 outline-none focus:border-indigo-400" />
            </div>
          ))}
        </div>
        <button onClick={updatePw} style={{ ...gradBtn, marginTop: "12px" }}>Update Password</button>
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Admin Roles</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead><tr style={{ background: "rgba(99,102,241,0.07)" }}>
            {["Name", "Email", "Role"].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#475569" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {adminRoles.map(a => (
              <tr key={a.email} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "10px 14px", fontWeight: 500, color: "#1e293b" }}>{a.name}</td>
                <td style={{ padding: "10px 14px", color: "#64748b" }}>{a.email}</td>
                <td style={{ padding: "10px 14px" }}><Badge color={a.role === "Super Admin" ? "indigo" : ""}>{a.role}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Activity Logs</h3>
        <div className="space-y-2">
          {activityLogs.map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-indigo-400" />
                <span className="text-sm text-slate-700">{l.action}</span>
                <span className="text-xs text-slate-400">by {l.admin}</span>
              </div>
              <span className="text-xs text-slate-400">{l.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const barData = [
  { month: "Jan", value: 65 }, { month: "Feb", value: 78 }, { month: "Mar", value: 90 },
  { month: "Apr", value: 72 }, { month: "May", value: 110 }, { month: "Jun", value: 124 },
];
const metricCards = [
  { label: "Total Revenue", value: "Rs.12.4L", grad: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
  { label: "Active Subscriptions", value: "284", grad: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { label: "Marketplace Listings", value: "1,240", grad: "linear-gradient(135deg,#10b981,#0ea5e9)" },
  { label: "Service Requests", value: "3,892", grad: "linear-gradient(135deg,#f59e0b,#ef4444)" },
];
const pieData = [
  { label: "Basic", pct: 40, color: "#6366f1" },
  { label: "Pro", pct: 35, color: "#8b5cf6" },
  { label: "Enterprise", pct: 25, color: "#0ea5e9" },
];
function Analytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(m => (
          <div key={m.label} style={{ ...glass, padding: "18px" }}>
            <p className="text-xs text-slate-500 mb-1">{m.label}</p>
            <p className="text-2xl font-bold" style={{ background: m.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Revenue (in thousands)</h3>
        <div className="flex items-end gap-3 h-32">
          {barData.map(b => (
            <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-slate-500">{b.value}K</span>
              <motion.div initial={{ height: 0 }} animate={{ height: `${(b.value / 130) * 100}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ width: "100%", background: "linear-gradient(180deg,#6366f1,#8b5cf6)", borderRadius: "6px 6px 0 0", minHeight: "8px" }} />
              <span className="text-xs text-slate-400">{b.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...glass, padding: "20px" }}>
        <h3 className="font-semibold text-slate-700 mb-4">Subscription Breakdown</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              {pieData.reduce((acc, seg, i) => {
                const offset = acc.offset; const dash = seg.pct;
                acc.elements.push(<circle key={i} cx="18" cy="18" r="15.9" fill="none" stroke={seg.color} strokeWidth="3.5" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={-offset} />);
                acc.offset += dash; return acc;
              }, { offset: 0, elements: [] }).elements}
            </svg>
          </div>
          <div className="space-y-2">
            {pieData.map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                <span className="text-sm text-slate-600">{p.label}</span>
                <span className="text-sm font-semibold text-slate-800">{p.pct}%</span>
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
const sectionMap = { overview: Overview, verification: UserVerification, services: ServiceManagement, users: UserControl, plans: BusinessPlans, security: Security, analytics: Analytics };

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const Section = sectionMap[active];
  const signOut = () => { 
        localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("admin_auth_v1"); 
    localStorage.removeItem("login_mock_v1"); 
    toast.success("Signed out"); navigate("/login");
    
   };
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f1f5f9" }}>
      <motion.aside animate={{ width: sidebarOpen ? 240 : 64 }} transition={{ duration: 0.25 }} className="flex flex-col h-full overflow-hidden flex-shrink-0" style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white font-bold text-sm whitespace-nowrap">CI Admin</motion.span>}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActive(item.key)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{ background: active === item.key ? "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))" : "transparent", color: active === item.key ? "#a5b4fc" : "rgba(255,255,255,0.45)", border: active === item.key ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent" }}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all" style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f87171")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <BarChart3 className="w-4 h-4 text-slate-500" />
            </button>
            <h1 className="font-semibold text-slate-800 text-sm">{navItems.find(n => n.key === active)?.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>A</div>
            <span className="text-sm text-slate-600 hidden sm:block">Super Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Section />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
