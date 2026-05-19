import { useState, useRef, useEffect, } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {  AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
 import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Dropdown,
  Space,
  Tooltip,
  Modal,
  Form,
  Typography,
  message,
  Avatar,
} from "antd";

import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
 
import { useMemo } from "react";
import {
  ChevronRight,
  Check,
  Layers3,
} from "lucide-react";
import { toast } from "sonner";

import {
  LayoutDashboard, User, CreditCard, History, Briefcase, Eye,
  List, FileText, Settings, LogOut, Menu, X, Plus, CheckCircle2,
  Upload, ChevronDown, Zap, ToggleLeft, ToggleRight, Key,
  TrendingUp, ArrowUpRight, Shield, FolderOpen, Building2,
  Trash2, Bell, Search, CircleDot,
} from "lucide-react";
import { SERVICES_HIERARCHY } from "../../data/services_hierarchy";
import { clientRows, payRows, subRows } from "../../data/json";
import { CustomInput } from "../../components/CustomInput";
import { StatusTag } from "../../components/StatusTag";
import { CustomTable } from "../../components/CustomTable";
 
// const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)]";
// const btnGrad = { background: "linear-gradient(135deg, #3b82f6, #6366f1)" };

// ─── Design tokens ────────────────────────────────────────────────────────────
const { Text } = Typography;

const glass = "rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)]";
const btnPrimary = { background: "linear-gradient(135deg,#3b82f6,#6366f1)" };

const NAV = [
  { id: "dashboard",    label: "Dashboard",             icon: LayoutDashboard },
  { id: "profile",      label: "My Profile",            icon: User            },
  { id: "credits",      label: "Add Credits",           icon: CreditCard      },
  { id: "payments",     label: "Payment History",       icon: History         },
  { id: "subscription", label: "Subscription History",  icon: Briefcase       },
  { id: "clients",      label: "Client History",        icon: User            },
  { id: "leads",        label: "Lead Management",       icon: List            },
  { id: "services",     label: "Service Listing",       icon: Briefcase       },
  { id: "settings",     label: "Settings",              icon: Settings        },
  // { id: "Dashboard",      label: "Dashboard",              icon: LayoutDashboard },
  // { id: "profile",       label: "My Profile",            icon: User            },
  //  { id: "services",      label: "Service Listing",       icon: Briefcase       },
  //  { id: "subscription",  label: "Subscription ",  icon: Briefcase       },
  // { id: "credits",       label: "Add Credits",           icon: CreditCard      },
  // { id: "payments",      label: "Payment Received",       icon: History         },
 
  // { id: "clients",       label: "Client History",        icon: User            },
  // // { id: "leads",         label: "Lead Management",       icon: List            },
  // // { id: "visibility",    label: "Marketplace Visibility",icon: Eye },
 
  // // { id: "documents",     label: "Documents",             icon: FileText        } ,
  // { id: "settings",      label: "Settings",              icon: Settings        },
];

const ALL_SERVICES = [
  "Consulting Service","Legal Contracts","Tender Services","Assets Management",
  "Brand Development","Marketing Management","Material Supplier","Material Manufacture",
  "Contractor Service","Construction Audit",
];

// ─── Document section config ──────────────────────────────────────────────────
const DOC_SECTIONS = [
  {
    id:"biz", label:"Business Registration", icon: Building2,
    color:"#185FA5", bg:"#E6F1FB", border:"#B5D4F4",
    options:["GST Certificate","MOA / AOA","Trade Licence","Certificate of Incorporation","Udyog Aadhar","Registered/Notarized Trust Deed","Shop Act Registration","Other"],
  },
  {
    id:"identity", label:"Identity & Address", icon: CreditCard,
    color:"#3B6D11", bg:"#EAF3DE", border:"#C0DD97",
    options:["Proof of Identity","Proof of Address","PAN Card","Passport","Driving License","Other"],
  },
  {
    id:"compliance", label:"Compliance Certificates", icon: Shield,
    color:"#854F0B", bg:"#FAEEDA", border:"#FAC775",
    options:["Bank Certificate","CST / VAT / TIN Certificate","Sales Tax / Service Tax Certificate","AICTE Approval","Import Export Certificate","Other"],
  },
  {
    id:"other", label:"Other Documents", icon: FolderOpen,
    color:"#534AB7", bg:"#EEEDFE", border:"#CECBF6",
    options:["Trade Licence","Registered Trust Deed","Shop Act Registration","Company Profile","Brochure","Other"],
  },
];

function initDocState() {
  return Object.fromEntries(
    DOC_SECTIONS.map(s => [s.id, { selected:[], files:{}, otherFields:[{ id:Date.now()+Math.random(), name:"", files:[] }] }])
  );
}

function docsReducer(state, action) {
  const sec = { ...state[action.id] };
  switch (action.type) {
    case "TOGGLE": {
      const has = sec.selected.includes(action.opt);
      sec.selected = has ? sec.selected.filter(x => x !== action.opt) : [...sec.selected, action.opt];
      if (has && action.opt !== "Other") { const f={...sec.files}; delete f[action.opt]; sec.files=f; }
      return { ...state, [action.id]: sec };
    }
    case "ADD_FILES": {
      const existing = sec.files[action.opt] || [];
      return { ...state, [action.id]: { ...sec, files:{ ...sec.files, [action.opt]:[...existing,...action.files] } } };
    }
    case "RM_FILE": {
      const upd = (sec.files[action.opt]||[]).filter((_,i)=>i!==action.idx);
      return { ...state, [action.id]: { ...sec, files:{ ...sec.files, [action.opt]:upd } } };
    }
    case "ADD_OTHER":
      return { ...state, [action.id]:{ ...sec, otherFields:[...sec.otherFields,{ id:Date.now(), name:"", files:[] }] } };
    case "RM_OTHER":
      return { ...state, [action.id]:{ ...sec, otherFields:sec.otherFields.filter((_,i)=>i!==action.idx) } };
    case "NAME_OTHER": {
      const fields=sec.otherFields.map((f,i)=>i===action.idx?{...f,name:action.name}:f);
      return { ...state, [action.id]:{ ...sec, otherFields:fields } };
    }
    case "ADD_OTHER_FILES": {
      const fields=sec.otherFields.map((f,i)=>i===action.idx?{...f,files:[...f.files,...action.files]}:f);
      return { ...state, [action.id]:{ ...sec, otherFields:fields } };
    }
    case "RM_OTHER_FILE": {
      const fields=sec.otherFields.map((f,i)=>i===action.idx?{...f,files:f.files.filter((_,fi)=>fi!==action.fi)}:f);
      return { ...state, [action.id]:{ ...sec, otherFields:fields } };
    }
    default: return state;
  }
}

// ─── Portal Multi-Select Dropdown (escapes overflow:hidden) ───────────────────
function PortalDropdown({ options, selected, onToggle, color, bg, border }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [pos, setPos] = useState({ top:0, left:0, width:0 });

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
        style={{ border:`1.5px solid ${open ? color : border}`, background: open ? bg : "#fff" }}
      >
        <span className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selected.length === 0
            ? <span className="text-slate-400 text-xs">Select documents to upload…</span>
            : <>
                {visibleChips.map(s => (
                  <span key={s} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                    style={{ background:bg, color, borderColor:border }}>
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
            initial={{ opacity:0, y:-8, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8, scale:0.97 }}
            transition={{ duration:0.15 }}
            style={{
              position:"absolute", top:pos.top, left:pos.left, width:pos.width,
              zIndex:99999, background:"#fff", border:`1.5px solid ${border}`,
              borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,0.13)",
              overflow:"hidden",
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <div style={{ maxHeight:260, overflowY:"auto" }}>
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
                          <path d="M1 3.5l2 2L8 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
            <div className="p-2.5 border-t" style={{ borderColor:border }}>
              <button type="button" onClick={() => setOpen(false)}
                className="w-full py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{ background:bg, color }}>Done ✓</button>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// ─── File Drop Zone ───────────────────────────────────────────────────────────
function FileZone({ label, files, onAdd, onRemove, color, bg, border }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const fmt = b => b < 1048576 ? `${(b/1024).toFixed(0)} KB` : `${(b/1048576).toFixed(1)} MB`;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <FileText className="w-3 h-3 shrink-0" style={{ color }} />
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-600">{label}</span>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); onAdd(Array.from(e.dataTransfer.files)); }}
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 rounded-xl border-2 border-dashed px-3.5 py-2.5 cursor-pointer transition-all"
        style={{ borderColor: drag ? color : border, background: drag ? bg : "#f9fafb" }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:bg }}>
          <Upload className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-slate-700">
            Drop or <span style={{ color, textDecoration:"underline" }}>browse</span>
          </p>
          <p className="text-[10px] text-slate-400">PDF, JPG, PNG, DOCX · multiple files</p>
        </div>
        {files.length > 0 && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0"
            style={{ background:bg, color, borderColor:border }}>
            {files.length} file{files.length !== 1 ? "s" : ""}
          </span>
        )}
        <input ref={ref} type="file" multiple className="hidden"
          onChange={e => { onAdd(Array.from(e.target.files)); e.target.value=""; }} />
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
            exit={{ opacity:0, height:0 }} className="overflow-hidden">
            <div className="pt-1.5 flex flex-col gap-1">
              {files.map((f,i) => (
                <motion.div key={`${f.name}-${i}`} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border"
                  style={{ background:bg, borderColor:border }}>
                  <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color }} />
                  <span className="text-[11.5px] flex-1 truncate text-slate-700">{f.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{fmt(f.size)}</span>
                  <button type="button" onClick={() => onRemove(i)}
                    className="p-0.5 bg-transparent border-none cursor-pointer flex">
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Document Section Card ────────────────────────────────────────────────────
function DocSectionCard({ section, data, dispatch }) {
  const { id, label, icon:Icon, color, bg, border, options } = section;
  const { selected, files, otherFields } = data;
  const isActive = selected.length > 0;
  const totalFiles = Object.values(files).flat().length + otherFields.reduce((a,f) => a+f.files.length, 0);

  return (
    <div className="rounded-2xl transition-all duration-300"
      style={{
        border:`1.5px solid ${isActive ? border : "#e8edf5"}`,
        boxShadow: isActive ? `0 4px 24px ${color}15` : "none",
        background:"#fff",
      }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 rounded-t-2xl transition-all duration-200"
        style={{ background: isActive ? bg+"88" : "#fff" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-[1.5px]"
          style={{ background:bg, borderColor:border }}>
          <Icon className="w-[18px] h-[18px]" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-bold text-slate-800">{label}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isActive ? `${selected.length} type${selected.length!==1?"s":""} selected` : "Choose documents from the dropdown"}
          </p>
        </div>
        {isActive && totalFiles > 0 && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white shrink-0"
            style={{ background:color }}>
            {totalFiles} file{totalFiles!==1?"s":""}
          </span>
        )}
      </div>

      {/* Dropdown row — NOT inside overflow:hidden */}
      <div className="px-5 py-3 border-t" style={{ borderColor: isActive ? border : "#f1f5f9" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Select documents</p>
        <PortalDropdown
          options={options}
          selected={selected}
          onToggle={opt => dispatch({ type:"TOGGLE", id, opt })}
          color={color} bg={bg} border={border}
        />
      </div>

      {/* Upload fields — animated expand */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:"auto" }}
            exit={{ opacity:0, height:0 }}
            style={{ overflow:"hidden" }}
          >
            <div className="px-5 pb-5 space-y-4" style={{ borderTop:`1px solid ${border}` }}>
              <div className="pt-4 space-y-4">
                {selected.filter(s => s !== "Other").map(opt => (
                  <FileZone key={opt} label={opt}
                    files={files[opt]||[]}
                    onAdd={f => dispatch({ type:"ADD_FILES", id, opt, files:f })}
                    onRemove={i => dispatch({ type:"RM_FILE", id, opt, idx:i })}
                    color={color} bg={bg} border={border} />
                ))}
              </div>

              {selected.includes("Other") && (
                <div className="pt-3 border-t border-dashed" style={{ borderColor:border }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
                      Custom documents
                    </span>
                    <button type="button" onClick={() => dispatch({ type:"ADD_OTHER", id })}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border"
                      style={{ background:bg, color, borderColor:border }}>
                      <Plus className="w-3 h-3" /> Add field
                    </button>
                  </div>
                  <div className="space-y-3">
                    {otherFields.map((field, fi) => (
                      <motion.div key={field.id} initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
                        className="rounded-xl border p-3.5 space-y-3"
                        style={{ background:bg+"44", borderColor:border }}>
                        <div className="flex gap-2 items-center">
                          <input type="text" value={field.name}
                            onChange={e => dispatch({ type:"NAME_OTHER", id, idx:fi, name:e.target.value })}
                            placeholder="Document name (e.g. NOC Certificate)…"
                            className="flex-1 text-xs px-3 py-2 rounded-lg border outline-none bg-white text-slate-800 focus:ring-1"
                            style={{ borderColor:border }} />
                          {otherFields.length > 1 && (
                            <button type="button" onClick={() => dispatch({ type:"RM_OTHER", id, idx:fi })}
                              className="p-2 rounded-lg bg-red-50 border border-red-100 flex items-center shrink-0">
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          )}
                        </div>
                        <FileZone
                          label={field.name || "Custom document"}
                          files={field.files}
                          onAdd={f => dispatch({ type:"ADD_OTHER_FILES", id, idx:fi, files:f })}
                          onRemove={fi2 => dispatch({ type:"RM_OTHER_FILE", id, idx:fi, fi:fi2 })}
                          color={color} bg={bg} border={border} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Page Components ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const name = user.companyName || user.contactPerson || "there";
  const stats = [
    { label:"Credits",      value:"₹500",  sub:"+₹200 this month",  grad:"from-blue-500 to-indigo-500",    icon:CreditCard,  up:true  },
    { label:"Active Leads", value:"12",    sub:"3 new this week",    grad:"from-emerald-500 to-teal-500",   icon:List,        up:true  },
    { label:"Clients",      value:"8",     sub:"2 inactive",         grad:"from-amber-500 to-orange-400",   icon:User,        up:false },
    { label:"Services",     value:"5",     sub:"All active",         grad:"from-violet-500 to-purple-500",  icon:Briefcase,   up:true  },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        className={`relative overflow-hidden ${glass} p-6`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-indigo-500/6 to-violet-400/4 rounded-2xl"/>
        <div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl"/>
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-blue-300/10 blur-2xl"/>
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-blue-500">Welcome back</p>
            <h1 className="mt-1 text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
              Hello, {name} 👋
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {user.email && <span className="mr-3">📧 {user.email}</span>}
              {user.mobile && <span>📱 {user.mobile}</span>}
            </p>
            {user.services?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(Array.isArray(user.services)?user.services:[user.services]).map(s => (
                  <span key={s} className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white text-xl font-black shrink-0">
            {(user.companyName||user.contactPerson||"C").slice(0,2).toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.07 }} whileHover={{ y:-2, transition:{ duration:0.15 } }}
            className={`${glass} p-5 group cursor-pointer`}>
            <div className="flex items-start justify-between mb-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} shadow-md`}>
                <s.icon className="h-5 w-5 text-white"/>
              </span>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                <ArrowUpRight className={`w-3 h-3 ${!s.up && "rotate-90"}`}/>{s.up?"+":""}
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
            <TrendingUp className="w-4 h-4 text-indigo-500"/> Recent Activity
          </h3>
          <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
        </div>
        <div className="space-y-2.5">
          {[
            { dot:"bg-emerald-400", text:"New lead from Rajesh Kumar", time:"2 hrs ago" },
            { dot:"bg-blue-400",    text:"Payment of ₹1,000 received",  time:"Yesterday" },
            { dot:"bg-violet-400",  text:"Profile updated successfully", time:"2 days ago" },
            { dot:"bg-amber-400",   text:"Subscription renewed – Pro",   time:"3 days ago" },
          ].map((a,i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <span className={`w-2 h-2 rounded-full shrink-0 ${a.dot}`}/>
              <span className="text-sm text-slate-700 flex-1">{a.text}</span>
              <span className="text-[10.5px] text-slate-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Documents (Profile Step 2) ───────────────────────────────────────────────
function Documents() {
  const raw = localStorage.getItem("commercial_user_v1");
  const stored = raw ? JSON.parse(raw) : {};
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    companyName:   stored.companyName   || "",
    contactPerson: stored.contactPerson || "",
    email:         stored.email         || "",
    mobile:        stored.mobile        || "",
    address:       stored.address       || "",
  });
  const [docsState, setDocsState] = useState(initDocState);
  const dispatch = action => setDocsState(s => docsReducer(s, action));

  const canContinue = profile.companyName && profile.contactPerson && profile.email && profile.mobile;
  const totalFiles = Object.values(docsState).reduce((t,sec) =>
    t + Object.values(sec.files).flat().length + sec.otherFields.reduce((a,f) => a+f.files.length, 0), 0);
  const activeSections = DOC_SECTIONS.filter(s => {
    const sec=docsState[s.id];
    return Object.values(sec.files).flat().length + sec.otherFields.reduce((a,f)=>a+f.files.length,0) > 0;
  }).length;

  const saveProfile = () => {
    localStorage.setItem("commercial_user_v1", JSON.stringify({ ...stored, ...profile }));
    toast.success("Profile saved!");
    setStep(2);
  };

  const handleSubmit = () => {
    toast.success(totalFiles > 0
      ? `${totalFiles} file${totalFiles!==1?"s":""} submitted across ${activeSections} section${activeSections!==1?"s":""}!`
      : "Submission saved (no files selected yet).");
  };

  const inp = "w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 outline-none text-sm bg-white text-slate-800";

  return (
    <div className={`${glass} p-6 space-y-6`}>
      {/* Step tabs */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
        {[{ n:1, title:"Profile", sub:"Company details" },{ n:2, title:"Documents", sub:"Upload files" }].map(item => (
          <button key={item.n} type="button" onClick={() => setStep(item.n)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
              step===item.n ? "border-blue-200 bg-white shadow-sm" : "border-transparent hover:bg-white/60"
            }`}>
            <span className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-black shrink-0 ${
              step===item.n ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white" : "bg-slate-200 text-slate-600"
            }`}>{item.n}</span>
            <div>
              <p className="text-sm font-bold text-slate-800">{item.title}</p>
              <p className="text-[11px] text-slate-400">{item.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
       <div className="space-y-4">
  <div className="grid sm:grid-cols-2 gap-4">

    {/* Company Name */}
    <div>
      <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
        Company Name *
      </label>

      <input
        className={inp}
        value={profile.companyName}
        onChange={(e) =>
          setProfile((p) => ({
            ...p,
            companyName: e.target.value,
          }))
        }
      />
    </div>

    {/* Company Type */}
    <div>
      <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
        Company Type *
      </label>

      <select
        className={inp}
        value={profile.companyType || ""}
        onChange={(e) =>
          setProfile((p) => ({
            ...p,
            companyType: e.target.value,
          }))
        }
      >
        <option value="">Select Company Type</option>
        <option value="LLP">LLP</option>
        <option value="Private Limited">Private Limited</option>
        <option value="Proprietorship">Proprietor</option>
      </select>
    </div>

    {/* Remaining Fields */}
    {[
      ["Contact Person *", "contactPerson"],
      ["Email *", "email"],
      ["Mobile *", "mobile"],
    ].map(([lbl, key]) => (
      <div key={key}>
        <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          {lbl}
        </label>

        <input
          className={inp}
          value={profile[key]}
          onChange={(e) =>
            setProfile((p) => ({
              ...p,
              [key]: e.target.value,
            }))
          }
        />
      </div>
    ))}

    {/* Address */}
    <div className="sm:col-span-2">
      <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
        Address
      </label>

      <textarea
        className={`${inp} resize-none`}
        rows={2}
        value={profile.address}
        onChange={(e) =>
          setProfile((p) => ({
            ...p,
            address: e.target.value,
          }))
        }
      />
    </div>
  </div>

  <div className="flex flex-wrap gap-3">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={saveProfile}
      disabled={!canContinue}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
      style={btnPrimary}
    >
      <CheckCircle2 className="w-4 h-4" />
      Save & Continue
    </motion.button>

    <button
      type="button"
      onClick={() => setStep(2)}
      className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-blue-200 transition-all"
    >
      Skip to Documents
    </button>
  </div>
</div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Banner */}
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 px-4 py-3"
            style={{ background:"linear-gradient(135deg,#E6F1FB,#EEEDFE)" }}>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-blue-700">
                {totalFiles === 0
                  ? "Expand each section — select which documents to upload"
                  : `${totalFiles} file${totalFiles!==1?"s":""} ready across ${activeSections} section${activeSections!==1?"s":""}`}
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">Each section is independent — upload as many or as few as needed.</p>
            </div>
            {totalFiles > 0 && (
              <div className="shrink-0 text-right">
                <p className="text-2xl font-black text-blue-700">{totalFiles}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Files</p>
              </div>
            )}
          </div>

          {/* Section cards — NO overflow:hidden on outer wrapper */}
          <div className="space-y-3">
            {DOC_SECTIONS.map((section, i) => (
              <motion.div key={section.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.06 }}>
                <DocSectionCard section={section} data={docsState[section.id]} dispatch={dispatch}/>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="button" onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-blue-200 transition-all">
              ← Back to Profile
            </button>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg"
              style={btnPrimary}>
              <CheckCircle2 className="w-4 h-4"/>
              Submit Documents{totalFiles > 0 ? ` (${totalFiles})` : ""}
            </motion.button>
          </div>
        </div>
      )}
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
          <CreditCard className="w-4 h-4 text-white"/>
        </span>
        <div>
          <h3 className="font-black text-slate-800">Add Credits</h3>
          <p className="text-xs text-slate-400">Top up your account balance</p>
        </div>
      </div>

      {/* Balance display */}
      <div className="relative overflow-hidden rounded-2xl p-5"
        style={{ background:"linear-gradient(135deg,#3b82f6,#6366f1)" }}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"/>
        <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest">Current Balance</p>
        <p className="text-4xl font-black text-white mt-1">₹{credits.toLocaleString()}</p>
        <p className="text-blue-200 text-xs mt-1">Available to spend</p>
      </div>

      {/* Quick amounts */}
      <div>
        <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick add</p>
        <div className="grid grid-cols-4 gap-2">
          {[500,1000,2000,5000].map(v => (
            <button key={v} onClick={() => setAmt(String(v))}
              className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                amt===String(v) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
              }`}>
              ₹{v.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="Custom amount (₹)"
          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 outline-none text-sm bg-white"/>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={add}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md flex items-center gap-2"
          style={btnPrimary}>
          <Plus className="w-4 h-4"/> Pay
        </motion.button>
      </div>
      <p className="text-[10.5px] text-slate-400">Demo integration — no real payment processed.</p>
    </div>
  );
}

// ─── Generic Data Table ───────────────────────────────────────────────────────
 
/* -------------------------------------------------------------------------- */
/* MAIN TABLE */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/* PAYMENT TABLE */
/* -------------------------------------------------------------------------- */


export function PaymentHistory() {
  return (
    <CustomTable
      title="Payment History"
      icon={History}
      accent="#3b82f6"
      data={payRows}
      columns={[
        {
          title: "Transaction",

          dataIndex: "txnId",

          render: (v) => (
            <Text strong>{v}</Text>
          ),
        },

        {
          title: "Amount",

          dataIndex: "amount",

          render: (v) => (
            <Text strong>
              {v}
            </Text>
          ),
        },

        {
          title: "Type",

          dataIndex: "type",
        },

        {
          title: "Date",

          dataIndex: "date",
        },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* SUBSCRIPTION */
/* -------------------------------------------------------------------------- */


export function SubscriptionHistory() {
  return (
    <CustomTable
      title="Subscription History"
      icon={Briefcase}
      accent="#8b5cf6"
      data={subRows}
      columns={[
        {
          title: "Plan",

          dataIndex: "plan",

          render: (v) => (
            <Text strong>{v}</Text>
          ),
        },

        {
          title: "Price",

          dataIndex: "price",
        },

        {
          title: "Start",

          dataIndex: "start",
        },

        {
          title: "End",

          dataIndex: "end",
        },
      ]}
    />
  );
}


/* -------------------------------------------------------------------------- */
/* CLIENTS */
/* -------------------------------------------------------------------------- */


export function ClientHistory() {
  return (
    <CustomTable
      title="Client History"
      icon={User}
      accent="#10b981"
      data={clientRows}
      columns={[
        {
          title: "Client",

          dataIndex: "name",

          render: (name) => (
            <div className="flex items-center gap-3">
              <Avatar
                icon={
                  <UserOutlined />
                }
              />

              <Text strong>
                {name}
              </Text>
            </div>
          ),
        },

        {
          title: "Email",

          dataIndex: "email",
        },

        {
          title: "Service",

          dataIndex: "service",
        },

        {
          title: "Date",

          dataIndex: "date",
        },
      ]}
    />
  );
}

// ─── Lead Management ──────────────────────────────────────────────────────────
function LeadManagement() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      service: "Consulting",
      phone: "9876543210",
      email: "rajesh@gmail.com",
      date: "2026-05-10",
      status: "New",
      notes: "Interested in EPC consultancy",
    },
    {
      id: 2,
      name: "Priya Sharma",
      service: "Legal Contracts",
      phone: "9898989898",
      email: "priya@gmail.com",
      date: "2026-05-08",
      status: "In Progress",
      notes: "Need contract drafting",
    },
    {
      id: 3,
      name: "Amit Singh",
      service: "Tender Services",
      phone: "9090909090",
      email: "amit@gmail.com",
      date: "2026-05-05",
      status: "Closed",
      notes: "Tender submitted successfully",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [editingLead, setEditingLead] = useState(null);

  const [form, setForm] = useState({
    name: "",
    service: "",
    phone: "",
    email: "",
    status: "New",
    notes: "",
  });

  const statusStyle = {
    New:
      "bg-blue-50 text-blue-700 border-blue-200",

    "In Progress":
      "bg-amber-50 text-amber-700 border-amber-200",

    Closed:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  /* -------------------------------------------------------------------------- */
  /* OPEN ADD MODAL */
  /* -------------------------------------------------------------------------- */

  const openAddModal = () => {
    setEditingLead(null);

    setForm({
      name: "",
      service: "",
      phone: "",
      email: "",
      status: "New",
      notes: "",
    });

    setShowModal(true);
  };

  /* -------------------------------------------------------------------------- */
  /* EDIT LEAD */
  /* -------------------------------------------------------------------------- */

  const editLead = (lead) => {
    setEditingLead(lead);

    setForm({
      name: lead.name,
      service: lead.service,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      notes: lead.notes,
    });

    setShowModal(true);
  };

  /* -------------------------------------------------------------------------- */
  /* SAVE LEAD */
  /* -------------------------------------------------------------------------- */

  const saveLead = () => {
    if (!form.name || !form.phone) {
      toast.error(
        "Name and phone are required",
      );

      return;
    }

    if (editingLead) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === editingLead.id
            ? {
                ...lead,
                ...form,
              }
            : lead,
        ),
      );

      toast.success("Lead updated");
    } else {
      const newLead = {
        id: Date.now(),
        ...form,
        date: new Date()
          .toISOString()
          .split("T")[0],
      };

      setLeads((prev) => [
        newLead,
        ...prev,
      ]);

      toast.success("Lead created");
    }

    setShowModal(false);
  };

  /* -------------------------------------------------------------------------- */
  /* DELETE LEAD */
  /* -------------------------------------------------------------------------- */

  const deleteLead = (id) => {
    setLeads((prev) =>
      prev.filter((x) => x.id !== id),
    );

    toast.success("Lead deleted");
  };

  /* -------------------------------------------------------------------------- */
  /* FILTER */
  /* -------------------------------------------------------------------------- */

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      lead.service
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* MAIN CARD */}
      <div className={`${glass} p-6`}>
        {/* HEADER */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="
                flex h-10 w-10 items-center justify-center
                rounded-2xl bg-indigo-50
              "
            >
              <List className="h-5 w-5 text-indigo-500" />
            </span>

            <div>
              <h3 className="text-lg font-black text-slate-800">
                Lead Management
              </h3>

              <p className="text-xs text-slate-400">
                Manage customer leads efficiently
              </p>
            </div>
          </div>

          {/* ADD BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={openAddModal}
            className="
              flex items-center gap-2
              rounded-xl px-4 py-2
              text-xs font-bold text-white
              shadow-md
            "
            style={btnPrimary}
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </motion.button>
        </div>

        {/* FILTERS */}
        <div className="mb-5 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              h-11 flex-1 rounded-xl border
              border-slate-200 px-4
              text-sm outline-none
              transition-all
              focus:border-violet-400
              focus:ring-4
              focus:ring-violet-100
            "
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="
              h-11 rounded-xl border
              border-slate-200 px-4
              text-sm outline-none
            "
          >
            <option value="All">
              All Status
            </option>

            <option value="New">
              New
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Closed">
              Closed
            </option>
          </select>
        </div>

        {/* STATS */}
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <StatCard
            title="Total Leads"
            value={leads.length}
          />

          <StatCard
            title="New"
            value={
              leads.filter(
                (x) => x.status === "New",
              ).length
            }
          />

          <StatCard
            title="Closed"
            value={
              leads.filter(
                (x) => x.status === "Closed",
              ).length
            }
          />
        </div>

        {/* LEADS */}
        <div className="space-y-3">
          {filteredLeads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.05,
              }}
              className="
                rounded-2xl border border-slate-100
                bg-slate-50/70 p-4
                transition-all
                hover:bg-white
                hover:shadow-md
              "
            >
              <div className="flex flex-wrap items-start gap-4">
                {/* AVATAR */}
                <div
                  className="
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-400 to-indigo-500
                    text-sm font-black text-white
                  "
                >
                  {lead.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                {/* INFO */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-black text-slate-800">
                      {lead.name}
                    </h4>

                    <span
                      className={`
                        rounded-full border px-2.5 py-1
                        text-[10px] font-bold
                        ${statusStyle[lead.status]}
                      `}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {lead.service}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                    <span>
                      📞 {lead.phone}
                    </span>

                    <span>
                      ✉️ {lead.email}
                    </span>

                    <span>
                      📅 {lead.date}
                    </span>
                  </div>

                  {lead.notes && (
                    <p className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-500">
                      {lead.notes}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editLead(lead)
                    }
                    className="
                      rounded-xl border
                      border-blue-200
                      bg-blue-50 px-3 py-2
                      text-xs font-bold text-blue-700
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteLead(lead.id)
                    }
                    className="
                      rounded-xl border
                      border-red-200
                      bg-red-50 px-3 py-2
                      text-xs font-bold text-red-700
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredLeads.length === 0 && (
            <div
              className="
                rounded-2xl border border-dashed
                border-slate-200 p-10
                text-center
              "
            >
              <p className="text-sm text-slate-400">
                No leads found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="
            fixed inset-0 z-[999]
            flex items-center justify-center
            bg-black/50 p-4
            backdrop-blur-sm
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              w-full max-w-2xl
              rounded-[30px]
              bg-white p-6
              shadow-2xl
            "
          >
            {/* HEADER */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  {editingLead
                    ? "Edit Lead"
                    : "Add New Lead"}
                </h3>

                <p className="text-sm text-slate-400">
                  Manage lead details
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl bg-slate-100
                "
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    name: v,
                  }))
                }
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    phone: v,
                  }))
                }
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    email: v,
                  }))
                }
              />

              <Input
                label="Service"
                value={form.service}
                onChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    service: v,
                  }))
                }
              />

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      status: e.target.value,
                    }))
                  }
                  className="
                    h-12 w-full rounded-xl border
                    border-slate-200 px-4 text-sm
                  "
                >
                  <option>
                    New
                  </option>

                  <option>
                    In Progress
                  </option>

                  <option>
                    Closed
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Notes
                </label>

                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      notes:
                        e.target.value,
                    }))
                  }
                  className="
                    w-full rounded-xl border
                    border-slate-200 p-4
                    text-sm outline-none
                  "
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  rounded-xl border border-slate-200
                  px-5 py-2.5
                  text-sm font-semibold
                "
              >
                Cancel
              </button>

              <button
                onClick={saveLead}
                className="
                  rounded-xl bg-violet-600
                  px-5 py-2.5
                  text-sm font-semibold text-white
                "
              >
                Save Lead
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS */
/* -------------------------------------------------------------------------- */

function StatCard({
  title,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl border border-slate-100
        bg-slate-50/70 p-4
      "
    >
      <p className="text-xs text-slate-400">
        {title}
      </p>

      <h4 className="mt-1 text-2xl font-black text-slate-800">
        {value}
      </h4>
    </div>
  );
}

function Inputs({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          h-12 w-full rounded-xl border
          border-slate-200 px-4
          text-sm outline-none
          transition-all
          focus:border-violet-400
          focus:ring-4
          focus:ring-violet-100
        "
      />
    </div>
  );
}
// ─── Service Listing ──────────────────────────────────────────────────────────
function  ServiceListing() {
  const [selectedService, setSelectedService] = useState(null);

  const [activeServices, setActiveServices] = useState([
    "consultingservice",
    "legalcontracts",
  ]);

  const [activeSubServices, setActiveSubServices] = useState([
    "epcconsultancy",
    "projectmanagement",
    "legaldrafting",
  ]);

  const toggleMainService = (serviceId) => {
    setActiveServices((prev) => {
      const exists = prev.includes(serviceId);

      if (exists) {
        toast.success("Service deactivated");

        return prev.filter((x) => x !== serviceId);
      }

      toast.success("Service activated");

      return [...prev, serviceId];
    });
  };

  const toggleSubService = (subId) => {
    setActiveSubServices((prev) => {
      const exists = prev.includes(subId);

      if (exists) {
        toast.success("Sub-service removed");

        return prev.filter((x) => x !== subId);
      }

      toast.success("Sub-service activated");

      return [...prev, subId];
    });
  };

  return (
    <>
      {/* MAIN CARD */}
      <div className={`${glass} p-6`}>
        {/* HEADER */}
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              bg-violet-50
            "
          >
            <Briefcase className="h-5 w-5 text-violet-600" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-800">
              Service Listing
            </h3>

            <p className="text-xs text-slate-400">
              Activate your business services & sub-services
            </p>
          </div>
        </div>

        {/* SERVICES */}
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES_HIERARCHY.map((service) => {
            const isActive = activeServices.includes(service.id);

            return (
              <div
                key={service.id}
                className="
                  group rounded-2xl border
                  bg-white p-4
                  transition-all duration-300
                  hover:-translate-y-[2px]
                  hover:shadow-lg
                "
                style={{
                  borderColor: isActive
                    ? "#c4b5fd"
                    : "#e5e7eb",
                }}
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div
                      className={`
                        mt-0.5 h-3 w-3 rounded-full
                        ${
                          isActive
                            ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                            : "bg-slate-300"
                        }
                      `}
                    />

                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {service.name}
                      </h4>

                      <p className="mt-1 text-xs text-slate-400">
                        {service.subServices?.length || 0} sub-services
                      </p>
                    </div>
                  </div>

                  {/* ACTIVE BUTTON */}
                  <button
                    onClick={() =>
                      toggleMainService(service.id)
                    }
                    className={`
                      rounded-full border px-3 py-1
                      text-[11px] font-bold
                      transition-all
                      ${
                        isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-violet-200"
                      }
                    `}
                  >
                    {isActive
                      ? "Active"
                      : "Inactive"}
                  </button>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Layers3 className="h-3.5 w-3.5" />
                    Configure Sub-services
                  </div>

                  <button
                    onClick={() =>
                      setSelectedService(service)
                    }
                    className="
                      flex items-center gap-1
                      rounded-xl
                      bg-violet-50
                      px-3 py-2
                      text-xs font-bold text-violet-700
                      transition-all
                      hover:bg-violet-100
                    "
                  >
                    Manage
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() =>
            setSelectedService(null)
          }
          activeSubServices={activeSubServices}
          toggleSubService={toggleSubService}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* MODAL */
/* -------------------------------------------------------------------------- */

function ServiceModal({
  service,
  onClose,
  activeSubServices,
  toggleSubService,
}) {
  return (
    <div
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/60
        p-4
        backdrop-blur-md
      "
    >
      {/* CARD */}
      <div
        className="
          relative w-full max-w-3xl
          overflow-hidden rounded-[30px]
          border border-white/10
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            flex items-center justify-between
            border-b border-slate-100
            px-6 py-5
          "
        >
          <div>
            <h2 className="text-xl font-black text-slate-800">
              {service.name}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Activate or deactivate sub-services
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-slate-100
              text-slate-500
              transition-all
              hover:bg-red-50
              hover:text-red-500
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {service.subServices?.map((sub) => {
              const active =
                activeSubServices.includes(sub.id);

              return (
                <div
                  key={sub.id}
                  className="
                    rounded-2xl border
                    border-slate-200
                    bg-slate-50
                    p-4
                  "
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {sub.name}
                      </h4>

                      {sub.children && (
                        <p className="mt-1 text-xs text-slate-400">
                          {
                            sub.children.length
                          }{" "}
                          nested services
                        </p>
                      )}
                    </div>

                    {/* ACTIVE BUTTON */}
                    <button
                      onClick={() =>
                        toggleSubService(sub.id)
                      }
                      className={`
                        rounded-full border px-3 py-1
                        text-[11px] font-bold
                        transition-all
                        ${
                          active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-500"
                        }
                      `}
                    >
                      {active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </div>

                  {/* CHILDREN */}
                  {sub.children && (
                    <div className="mt-4 space-y-2">
                      {sub.children.map(
                        (child) => {
                          const childActive =
                            activeSubServices.includes(
                              child.id,
                            );

                          return (
                            <div
                              key={child.id}
                              className="
                                flex items-center justify-between
                                rounded-xl
                                border border-slate-200
                                bg-white
                                px-3 py-2
                              "
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`
                                    h-2.5 w-2.5 rounded-full
                                    ${
                                      childActive
                                        ? "bg-emerald-400"
                                        : "bg-slate-300"
                                    }
                                  `}
                                />

                                <span className="text-xs font-medium text-slate-700">
                                  {child.name}
                                </span>
                              </div>

                              <button
                                onClick={() =>
                                  toggleSubService(
                                    child.id,
                                  )
                                }
                                className={`
                                  flex items-center gap-1
                                  rounded-lg px-2.5 py-1
                                  text-[10px] font-bold
                                  ${
                                    childActive
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-500"
                                  }
                                `}
                              >
                                {childActive && (
                                  <Check className="h-3 w-3" />
                                )}

                                {childActive
                                  ? "Active"
                                  : "Inactive"}
                              </button>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            flex items-center justify-end gap-3
            border-t border-slate-100
            px-6 py-4
          "
        >
          <button
            onClick={onClose}
            className="
              rounded-xl border border-slate-200
              px-5 py-2.5
              text-sm font-semibold text-slate-600
              transition-all hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-violet-600
              px-5 py-2.5
              text-sm font-semibold text-white
              shadow-lg shadow-violet-500/20
              transition-all hover:bg-violet-700
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────
const DOCUMENT_CATEGORIES = {
  "Business Registration": [
    "GST Certificate",  "Trade Licence", "Certificate of Incorporation", "Udyog Aadhar", "Trade Licence","Registered/Notarized Trust Deed", "Shop Act Registration",
  ],
  "Identity & Address": [
    "Proof of Identity", "Proof of Address", "PAN Card", "Passport", "Driving License",
  ],
  "Compliance Certificates": [
    "Bank Certificate",  "Import Export Certificate",
  ],
  "Company Profile": [
      "Company Profile", "Brochure",  
  ],
};

function DocumentUploader({ label, files = [], onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</label>
      <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-blue-200 rounded-2xl p-4 cursor-pointer hover:border-blue-400 bg-blue-50/30 transition-all min-h-[108px]">
        <Upload className="w-5 h-5 text-blue-400" />
        <span className="text-xs text-slate-500 text-center">{files.length ? `${files.length} file(s) selected` : "Drag & drop or click to upload"}</span>
        {files.length ? <span className="text-[10px] text-emerald-600 font-semibold">✓ Ready to submit</span> : null}
        <input type="file" className="hidden" multiple onChange={e => onChange(Array.from(e.target.files))} />
      </label>
      {files.length > 0 && (
        <ul className="mt-3 max-h-28 overflow-y-auto text-[11px] text-slate-500 space-y-1">
          {files.map((file, idx) => (
            <li key={`${file.name}-${idx}`} className="truncate">• {file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// function Documents() {
//   const raw = localStorage.getItem("commercial_user_v1");
//   const storedUser = raw ? JSON.parse(raw) : {};
//   const [step, setStep] = useState(1);
//   const [profile, setProfile] = useState({
//     companyName: storedUser.companyName || "",
//     contactPerson: storedUser.contactPerson || "",
//     email: storedUser.email || "",
//     mobile: storedUser.mobile || "",
//     address: storedUser.address || "",
//   });
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [uploadedDocs, setUploadedDocs] = useState({});

//   const categoryFields = DOCUMENT_CATEGORIES[selectedCategory] || [];
//   const canContinue = profile.companyName && profile.contactPerson && profile.email && profile.mobile;

//   const handleProfileChange = (key, value) => setProfile(p => ({ ...p, [key]: value }));
//   const handleFiles = (field, files) => setUploadedDocs(prev => ({ ...prev, [field]: files }));

//   const saveProfile = () => {
//     localStorage.setItem("commercial_user_v1", JSON.stringify({ ...storedUser, ...profile }));
//     toast.success("Profile saved. Continue to upload documents.");
//     setStep(2);
//   };

//   const handleSubmit = () => {
//     const uploadedSummary = Object.entries(uploadedDocs)
//       .filter(([, files]) => files?.length)
//       .map(([field, files]) => `${field}: ${files.length}`)
//       .join(" · ");

//     toast.success(uploadedSummary ? `Saved documents: ${uploadedSummary}` : "No documents selected yet, but changes saved.");
//   };

//   return (
//     <div className={`${glassCard} p-6 space-y-6`}>
//       <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-sm">
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { step: 1, title: "Profile", subtitle: "Company details" },
//             { step: 2, title: "Documents", subtitle: "Upload required files" },
//           ].map(item => {
//             const active = step === item.step;
//             return (
//               <button key={item.title} type="button" onClick={() => setStep(item.step)}
//                 className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-left transition ${active ? "border-blue-300 bg-blue-50 shadow-sm" : "border-slate-200 bg-slate-50/80 hover:border-blue-200"}`}>
//                 <span className={`grid h-9 w-9 place-items-center rounded-2xl font-bold ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{item.step}</span>
//                 <div>
//                   <p className="text-sm font-bold text-slate-900">{item.title}</p>
//                   <p className="text-xs text-slate-500">{item.subtitle}</p>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {step === 1 ? (
//         <div className="space-y-5">
//           <div className="grid sm:grid-cols-2 gap-4">
//             {[
//               ["Company Name *", "companyName"],
//               ["Company Type , private LTD,Proprighter,LLP*", "companyName"],
//               ["Contact Person *", "contactPerson"],
//               ["Email *", "email"],
//               ["Mobile *", "mobile"],
//               ["State *", "state"],
//               ["City *", "city"],
//               ["Pin Code *", "pinCode"],
//             ].map(([label, field]) => (
//               <div key={field}>
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</label>
//                 <input className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white/70"
//                   value={profile[field]} onChange={e => handleProfileChange(field, e.target.value)} />
//               </div>
//             ))}
//           </div>

//           <div>
//             <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Address</label>
//             <textarea rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white/70 resize-none"
//               value={profile.address} onChange={e => handleProfileChange("address", e.target.value)} />
//           </div>

//           <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
//             <p className="text-sm font-semibold text-slate-900">Fast tip</p>
//             <p className="text-xs text-slate-500 mt-1">Complete your profile first so document submission is linked to your latest company details.</p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveProfile}
//               disabled={!canContinue}
//               className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold text-sm text-white shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300"
//               style={btnGrad}>
//               <CheckCircle2 className="w-4 h-4" /> Save & Continue
//             </motion.button>
//             <button type="button" onClick={() => setStep(2)}
//               className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-200 transition-all">
//               Skip to Documents
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="space-y-4">
//             <div>
//               <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">Select document section</label>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                 {Object.keys(DOCUMENT_CATEGORIES).map(category => (
//                   <button key={category} type="button" onClick={() => { setSelectedCategory(category); setUploadedDocs({}); }}
//                     className={`rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${selectedCategory === category ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"}`}>
//                     {category}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
//               <p className="text-sm font-semibold text-slate-900">How it works</p>
//               <p className="text-xs text-slate-500 mt-1">Choose one of the four document sections, then upload files for each required field. All fields support multiple file uploads.</p>
//             </div>
//           </div>

//           {selectedCategory ? (
//             <div className="grid sm:grid-cols-2 gap-4">
//               {categoryFields.map(field => (
//                 <DocumentUploader key={field} label={field}
//                   files={uploadedDocs[field] || []}
//                   onChange={files => handleFiles(field, files)} />
//               ))}
//             </div>
//           ) : (
//             <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/90 p-6 text-sm text-slate-500">
//               Select a document section above to load the matching upload fields.
//             </div>
//           )}

//           <div className="flex flex-wrap gap-3">
//             <button type="button" onClick={() => setStep(1)}
//               className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-200 transition-all">
//               Back to Profile
//             </button>
//             <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit}
//               className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold text-sm text-white shadow-lg"
//               style={btnGrad}>
//               <CheckCircle2 className="w-4 h-4" /> Submit Documents
//             </motion.button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsPanel() {
  const [old, setOld] = useState("");
  const [nw, setNw] = useState("");
  const [conf, setConf] = useState("");

  const change = () => {
    if (!old||!nw||!conf) { toast.error("Fill all fields"); return; }
    if (nw !== conf) { toast.error("Passwords do not match"); return; }
    setOld(""); setNw(""); setConf("");
    toast.success("Password updated (demo)");
  };

  const inp2 = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 outline-none text-sm bg-white text-slate-800";

  return (
    <div className={`${glass} p-6 space-y-5`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50">
          <Key className="w-4 h-4 text-blue-500"/>
        </span>
        <div>
          <h3 className="font-black text-slate-800">Change Password</h3>
          <p className="text-xs text-slate-400">Keep your account secure</p>
        </div>
      </div>
      <div className="space-y-3">
        {[["Current Password", old, setOld],["New Password", nw, setNw],["Confirm Password", conf, setConf]].map(([lbl,val,setter]) => (
          <div key={lbl}>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">{lbl}</label>
            <input type="password" value={val} onChange={e=>setter(e.target.value)} className={inp2}/>
          </div>
        ))}
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={change}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg"
          style={btnPrimary}>
          <Key className="w-4 h-4"/> Update Password
        </motion.button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Dashboard ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function CommercialDashboard() {
  const navigate = useNavigate();
  const raw = localStorage.getItem("commercial_user_v1");
  const [user, setUser] = useState(raw ? JSON.parse(raw) : {
    companyName:"Demo Company", contactPerson:"Demo User",
    email:"demo@company.com", mobile:"9876543210",
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user.companyName || user.contactPerson || "C")
    .split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("commercial_user_v1");
    localStorage.removeItem("login_mock_v1");
    localStorage.setItem("isLoggedIn", false);
    navigate("/login");
  };

 


function StatusTag({ status }) {
  const config = {
    Success: "success",
    Active: "success",
    Failed: "error",
    Expired: "default",
    Inactive: "default",
  };

  return (
    <Tag
      color={config[status]}
      className="
        rounded-full px-3 py-[3px]
        text-[11px] font-bold
      "
    >
      {status}
    </Tag>
  );
}
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":    return <Dashboard user={user}/>;
      case "profile":      return <Documents/>;
      case "credits":      return <AddCredits/>;
      case "payments":     return <PaymentHistory/>;
      case "subscription": return <SubscriptionHistory/>;
      case "clients":      return <ClientHistory />;
      case "leads":        return <LeadManagement/>;
      case "services":     return <ServiceListing/>;
      case "settings":     return <SettingsPanel/>;
      default:             return <Dashboard user={user}/>;
      // case "Dashboard":     return <Dashboard user={user} />;
      // // case "profile":      return <MyProfile user={user} onUpdate={setUser} />;
      // case "profile":      return <Documents />;
      // case "credits":      return <AddCredits />;
      // case "payments":     return <CustomTable title="Payment Received" icon={History} color="blue"
      //                        cols={["Txn ID","Amount","Type","Date","Status"]} rows={payRows} />;
      // case "subscription": return <CustomTable title="Subscription History" icon={Briefcase} color="violet"
      //                        cols={["Plan","Price","Start","End","Status"]} rows={subRows} />;
      // case "clients":      return <CustomTable title="Client History" icon={User} color="emerald"
      //                        cols={["Name","Email","Service","Date","Status"]} rows={clientRows} />;
      // case "leads":        return <LeadManagement />;
      // case "visibility":   return <MarketplaceVisibility />;
      // case "services":     return <ServiceListing />;
      // // case "documents":    return <Documents />;
      // case "settings":     return <SettingsPanel user={user} />;
      // default:             return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-blue-400/8 blur-[120px]"/>
        <div className="absolute right-[-80px] top-[30%] h-[400px] w-[400px] rounded-full bg-indigo-400/8 blur-[120px]"/>
        <div className="absolute bottom-[-60px] left-[30%] h-[300px] w-[300px] rounded-full bg-violet-300/6 blur-[100px]"/>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}/>
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white/90 backdrop-blur-2xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(59,130,246,0.05)] lg:relative transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width:"15rem" }}>

        {/* Logo / user */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-md shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate">{user.companyName||user.contactPerson}</p>
            <p className="text-[10px] text-blue-500 font-semibold">Commercial Account</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
          {NAV.map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                activeTab===id
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100/80 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}>
              <Icon className="h-4 w-4 shrink-0"/>
              <span className="truncate">{label}</span>
              {activeTab===id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"/>}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="border-t border-slate-100 p-3">
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut className="h-4 w-4"/> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex h-16 items-center gap-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 shrink-0">
          <button className="lg:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
            onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"/>
            <h2 className="text-sm font-bold text-slate-700">
              {NAV.find(n => n.id===activeTab)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4"/>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400"/>
            </button>
            <span className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Zap className="h-3.5 w-3.5"/> Commercial
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}