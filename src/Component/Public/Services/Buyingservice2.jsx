import { useState, useMemo, useCallback } from "react";
import {
  Users, X, Plus, Minus, Trash2, ArrowLeft, ArrowRight,
  CheckCircle, Shield, Star, Search, ChevronDown, Receipt,
  MapPin, Sparkles, Building2, Briefcase, TrendingUp, Award,
  Send, PhoneCall, Clock,
} from "lucide-react";

/* ============================================================
   CONTRACTOR DATA  — exact keys from document 4
   ============================================================ */
const contractorData = {
  epc: [
    { id: 1, company: "EPC Infra Projects", location: "Delhi", experience: "15 Years", projects: 52, rating: "4.9", description: "Full-cycle EPC contractor handling engineering, procurement and construction for large-scale industrial and infrastructure projects.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop" },
  ],
  building: [
    { id: 1, company: "Skyline Builders", location: "Bilaspur", experience: "12 Years", projects: 32, rating: "4.8", description: "Residential and commercial building contractor with expertise in RCC structures, interiors and project handover.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" },
  ],
  road: [
    { id: 1, company: "Highway Infra Ltd", location: "Korba", experience: "20 Years", projects: 50, rating: "4.9", description: "National highway and urban road contractor with expertise in flexible and rigid pavement, bridges and drainage.", image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop" },
  ],
  heavyfabrication: [
    { id: 1, company: "SteelFab Industries", location: "Bhilai", experience: "14 Years", projects: 29, rating: "4.8", description: "Heavy structural steel fabrication for industrial plants, storage tanks, pressure vessels and process equipment.", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop" },
  ],
  doorwindow: [
    { id: 1, company: "Modern Door Systems", location: "Indore", experience: "8 Years", projects: 19, rating: "4.5", description: "Aluminium, UPVC and wooden door and window fabrication and installation for residential and commercial projects.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  ],
  electrical: [
    { id: 1, company: "Power Grid Electricals", location: "Raipur", experience: "10 Years", projects: 25, rating: "4.9", description: "Complete HT/LT electrical contractor for industrial plants, commercial buildings and infrastructure projects.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop" },
  ],
  hvac: [
    { id: 1, company: "Cool Air Systems", location: "Durg", experience: "12 Years", projects: 30, rating: "4.8", description: "HVAC installation contractor for malls, hospitals, data centres and commercial complexes.", image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop" },
  ],
  firefighting: [
    { id: 1, company: "Safe Fire Tech", location: "Raipur", experience: "8 Years", projects: 20, rating: "4.6", description: "Fire suppression systems contractor for hydrants, sprinklers and foam systems in industrial and commercial buildings.", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop" },
  ],
  plumbing: [
    { id: 1, company: "Aqua Plumbing Works", location: "Bilaspur", experience: "9 Years", projects: 18, rating: "4.7", description: "Plumbing contractor for water supply, drainage and sanitation systems in residential and commercial projects.", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop" },
  ],
  STP: [
    { id: 1, company: "Pure Water Solutions", location: "Ahmedabad", experience: "13 Years", projects: 31, rating: "4.9", description: "STP, WTP and ETP contractor for industrial effluent treatment, sewage treatment and water purification.", image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop" },
  ],
  ELV: [
    { id: 1, company: "ELV Smart Systems", location: "Bangalore", experience: "8 Years", projects: 17, rating: "4.6", description: "ELV contractor for CCTV, access control, building management systems, PA and SMATV networks.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  ],
  Medical: [
    { id: 1, company: "OxyFlow Gas Systems", location: "Mumbai", experience: "12 Years", projects: 28, rating: "4.9", description: "Medical gas pipeline contractor for hospitals — oxygen, nitrous oxide, vacuum and compressed air systems.", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop" },
  ],
  FireAlarm: [
    { id: 1, company: "Alert Fire Systems", location: "Raipur", experience: "9 Years", projects: 17, rating: "4.7", description: "Addressable and conventional fire alarm systems contractor for commercial, industrial and residential buildings.", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop" },
  ],
  water: [
    { id: 1, company: "Water Care Infra", location: "Nagpur", experience: "14 Years", projects: 36, rating: "4.9", description: "Water supply and waste water infrastructure contractor for municipal pipelines, pumping stations and OHT.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop" },
  ],
  glassfacade: [
    { id: 1, company: "Crystal Facade Systems", location: "Delhi", experience: "13 Years", projects: 34, rating: "4.8", description: "Structural glazing and unitised glass facade contractor for commercial towers and institutional buildings.", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop" },
  ],
  acpfacade: [
    { id: 1, company: "ACP Cladding Experts", location: "Indore", experience: "11 Years", projects: 27, rating: "4.7", description: "ACP and aluminium composite cladding contractor for exterior facades, signage and canopy works.", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop" },
  ],
  stonefacade: [
    { id: 1, company: "StoneCraft Facades", location: "Jaipur", experience: "16 Years", projects: 41, rating: "4.9", description: "Natural and engineered stone cladding contractor for premium residential, hospitality and commercial facades.", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop" },
  ],
  GrcFacade: [
    { id: 1, company: "GRC Design Studio", location: "Mumbai", experience: "10 Years", projects: 20, rating: "4.6", description: "Glass Reinforced Concrete facade contractor for decorative cladding, cornices and architectural elements.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  ],
  bridge: [
    { id: 1, company: "Bridge Tech Infra", location: "Raipur", experience: "18 Years", projects: 36, rating: "4.8", description: "Bridge and flyover contractor for PSC girder, cable-stayed and box girder bridges on national and state highways.", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop" },
  ],
  civil: [
    { id: 1, company: "CivilCore Projects", location: "Raigarh", experience: "14 Years", projects: 28, rating: "4.7", description: "Civil contractor for earthwork, piling, RCC structural works and finishing in industrial and infrastructure projects.", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop" },
  ],
  hardscape: [
    { id: 1, company: "Hardscape Designers", location: "Pune", experience: "8 Years", projects: 15, rating: "4.6", description: "Hardscape contractor for paving, retaining walls, pergolas, water features and site furniture in landscaped areas.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  ],
  softscape: [
    { id: 1, company: "Green Leaf Landscapes", location: "Bangalore", experience: "10 Years", projects: 26, rating: "4.8", description: "Soft landscape contractor for lawn development, tree plantation, irrigation systems and horticultural maintenance.", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop" },
  ],
};

/* ============================================================
   MENU ITEMS — exact structure from document 4
   ============================================================ */
const menuItems = [
  { key: "epc",      label: "EPC Contractor" },
  { key: "building", label: "Building Contractor" },
  { key: "road",     label: "Road Contractor" },
  {
    key: "fabrication", label: "Fabrication Contractor",
    subMenu: [
      { key: "heavyfabrication", label: "Heavy Fabrication" },
      { key: "doorwindow",       label: "Door & Window" },
    ],
  },
  {
    key: "mep", label: "MEP Contractor",
    subMenu: [
      { key: "electrical",  label: "Electrical" },
      { key: "hvac",        label: "HVAC" },
      { key: "firefighting", label: "Fire Fighting" },
      { key: "plumbing",    label: "Plumbing Contractor" },
      { key: "STP",         label: "STP, WTP, ETP Contractor" },
      { key: "ELV",         label: "ELV Contractor" },
      { key: "Medical",     label: "Medical Gas Contractor" },
      { key: "FireAlarm",   label: "Fire Alarm Contractor" },
      { key: "water",       label: "Water & Waste Contractor" },
    ],
  },
  {
    key: "facade", label: "Facade Contractor",
    subMenu: [
      { key: "glassfacade",  label: "Glass Facade" },
      { key: "acpfacade",    label: "ACP Facade" },
      { key: "stonefacade",  label: "Stone Facade" },
      { key: "GrcFacade",    label: "GRC Facade" },
    ],
  },
  { key: "bridge",  label: "Bridge Contractor" },
  { key: "civil",   label: "Civil Contractor" },
  {
    key: "landscape", label: "Landscape Contractor",
    subMenu: [
      { key: "hardscape", label: "Hard Scape" },
      { key: "softscape", label: "Soft Scape / Horticultural" },
    ],
  },
];

/* ============================================================
   UTILITIES
   ============================================================ */
const generateRefId = () => `ENQ-${Date.now().toString(36).toUpperCase().slice(-8)}`;

const allContractors = Object.values(contractorData).flat();
const totalProjects  = allContractors.reduce((s, c) => s + c.projects, 0);

function getActiveLabel(key) {
  for (const m of menuItems) {
    if (m.key === key) return m.label;
    if (m.subMenu) {
      const sub = m.subMenu.find((s) => s.key.trim() === key.trim());
      if (sub) return sub.label;
    }
  }
  return "Contractors";
}

/* ============================================================
   RATING BADGE
   ============================================================ */
function RatingBadge({ rating }) {
  const r  = parseFloat(rating);
  const bg = r >= 4.8 ? "bg-emerald-500" : r >= 4.6 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className={`flex items-center gap-1 ${bg} text-white px-2 py-0.5 rounded-lg shadow-sm`}>
      <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <span className="text-[10px] font-black">{rating}</span>
    </div>
  );
}

/* ============================================================
   CONTRACTOR CARD
   ============================================================ */
function ContractorCard({ contractor, inShortlist, onAdd, onRemove }) {
  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
      inShortlist
        ? "border-indigo-300 shadow-lg shadow-indigo-100/50"
        : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/60"
    }`}>

      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={contractor.image}
          alt={contractor.company}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/10 to-transparent" />

        {/* Rating — top left */}
        <div className="absolute top-3 left-3">
          <RatingBadge rating={contractor.rating} />
        </div>

        {/* Shortlisted indicator */}
        {inShortlist && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shadow">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
        )}

        {/* Location chip — bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
          <MapPin className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" />
          <span className="text-[10px] font-bold text-slate-700">{contractor.location}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Name */}
        <h3 className="text-sm font-black text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
          {contractor.company}
        </h3>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2">
            <Clock className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Experience</p>
              <p className="text-[11px] font-black text-slate-700 leading-none">{contractor.experience}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Projects</p>
              <p className="text-[11px] font-black text-slate-700 leading-none">{contractor.projects}+</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] leading-relaxed text-slate-500 line-clamp-2 flex-1">
          {contractor.description}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((s) => (
            <svg key={s} className={`w-3 h-3 ${s <= Math.floor(parseFloat(contractor.rating)) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
          <span className="text-[10px] text-slate-400 font-medium ml-0.5">{contractor.rating} / 5.0</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          {inShortlist ? (
            <button
              onClick={() => onRemove(contractor.id, contractor.company)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-600 py-2.5 rounded-xl text-[11px] font-bold bg-white hover:bg-red-50 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          ) : (
            <button
              onClick={() => onAdd(contractor)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white py-2.5 rounded-xl text-[11px] font-bold transition-all active:scale-95 shadow-sm hover:shadow-md hover:shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Shortlist
            </button>
          )}
          <a
            href={`tel:+911234567890`}
            onClick={(e) => e.preventDefault()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 border border-emerald-200 text-emerald-700 py-2.5 rounded-xl text-[11px] font-bold bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call Now
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHORTLIST SIDEBAR
   ============================================================ */
function ShortlistSidebar({ shortlist, onRemove, onClear, onEnquire }) {
  if (shortlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Users className="w-7 h-7 text-slate-300" />
        </div>
        <div>
          <p className="font-bold text-slate-600 text-sm">No contractors shortlisted</p>
          <p className="text-xs text-slate-400 mt-1">Add contractors to send a group enquiry</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {shortlist.map((item) => (
          <div key={`${item.id}-${item.company}`} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
            <img
              src={item.image}
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"; }}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              alt={item.company}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{item.company}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />{item.location}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Star className="w-2.5 h-2.5 text-amber-400" />{item.rating} · {item.experience}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id, item.company)}
              className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0 mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 px-4 py-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Contractors selected</span>
          <span className="font-bold text-slate-700">{shortlist.length}</span>
        </div>
        <button
          onClick={onEnquire}
          className="w-full mt-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200"
        >
          <Send className="w-4 h-4" /> Send Enquiry
        </button>
        <button
          onClick={onClear}
          className="w-full text-center text-[11px] text-slate-400 hover:text-red-500 transition-colors font-medium"
        >
          Clear shortlist
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ENQUIRY PAGE (Billing equivalent)
   ============================================================ */
function EnquiryPage({ shortlist, onBack, onConfirm }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", projectType: "", location: "", budget: "", message: "",
  });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.trim())       e.phone       = "Required";
    if (!form.projectType.trim()) e.projectType = "Required";
    if (!form.location.trim())    e.location    = "Required";
    if (!form.message.trim())     e.message     = "Required";
    return e;
  };

  const handleSubmit = async () => {
    // const e = validate();
    // if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    onConfirm({ form, refId: generateRefId(), shortlist, date: new Date() });
  };

  const Field = ({ label, field, placeholder, half, type = "text", textarea }) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          value={form[field]}
          onChange={set(field)}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all bg-white placeholder-slate-300 resize-none ${
            errors[field]
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={form[field]}
          onChange={set(field)}
          className={`w-full h-10 rounded-xl border px-3.5 text-sm outline-none transition-all bg-white placeholder-slate-300 ${
            errors[field]
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
      )}
      {errors[field] && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to contractors
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Shortlist", "Enquiry Details", "Confirmation"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                i === 1 ? "bg-indigo-600 text-white" : i < 1 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
              }`}>
                {i < 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-semibold ${
                i === 1 ? "text-indigo-600" : i < 1 ? "text-emerald-600" : "text-slate-400"
              }`}>{step}</span>
              {i < 2 && <ChevronDown className="w-3.5 h-3.5 text-slate-300 -rotate-90" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forms */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">1</span>
                Your Contact Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name"            field="firstName"  placeholder="Rahul"                   half />
                <Field label="Last Name"             field="lastName"   placeholder="Sharma"                  half />
                <Field label="Email Address"         field="email"      placeholder="rahul@company.com"       type="email" />
                <Field label="Phone Number"          field="phone"      placeholder="+91 98765 43210"         half />
                <Field label="Company / Organization" field="company"   placeholder="ABC Infra Pvt Ltd (optional)" half />
              </div>
            </section>

            {/* Project */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">2</span>
                Project Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Project Type"                   field="projectType" placeholder="e.g. Commercial Building, Highway" />
                <Field label="Project Location"               field="location"    placeholder="City, State"                        half />
                <Field label="Estimated Budget"               field="budget"      placeholder="e.g. ₹50 Lakhs – ₹2 Crore (optional)" half />
                <Field label="Project Description / Requirements" field="message" placeholder="Describe your project scope, timeline and specific requirements…" textarea />
              </div>
            </section>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-6">
              <h2 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Shortlisted Contractors
                <span className="ml-auto w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                  {shortlist.length}
                </span>
              </h2>

              <div className="space-y-2.5 mb-5">
                {shortlist.map((c) => (
                  <div key={`${c.id}-${c.company}`} className="flex items-center gap-2.5">
                    <img
                      src={c.image}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"; }}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      alt={c.company}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{c.company}</p>
                      <p className="text-[10px] text-slate-400">{c.location} · ★{c.rating}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 mb-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Your details are shared only with shortlisted contractors.
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Enquiry</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONFIRMATION PAGE (Receipt)
   ============================================================ */
function ConfirmationPage({ enquiry, onDone }) {
  const { refId, form, shortlist, date } = enquiry;
  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        {/* Success header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-3">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Enquiry Sent!</h1>
          <p className="text-sm text-slate-500 mt-1">
            Confirmation sent to <span className="font-semibold text-slate-700">{form.email}</span>
          </p>
        </div>

        {/* Receipt card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-white/70" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Enquiry Receipt</span>
                </div>
                <p className="font-black text-lg">{shortlist.length} Contractor{shortlist.length > 1 ? "s" : ""} Contacted</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Ref</p>
                <p className="font-mono font-bold text-sm mt-0.5">{refId}</p>
              </div>
            </div>
          </div>

          {/* Dashed tear */}
          <div className="relative flex items-center px-4 py-0">
            <div className="absolute left-0 w-5 h-5 bg-slate-50 rounded-full -translate-x-1/2 border border-slate-200" />
            <div className="flex-1 border-t-2 border-dashed border-slate-100 mx-4" />
            <div className="absolute right-0 w-5 h-5 bg-slate-50 rounded-full translate-x-1/2 border border-slate-200" />
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Date",     value: date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Time",     value: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
                { label: "From",     value: `${form.firstName} ${form.lastName}` },
                { label: "Project",  value: form.projectType || "—" },
                { label: "Location", value: form.location    || "—" },
                { label: "Phone",    value: form.phone },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5 leading-snug">{value}</p>
                </div>
              ))}
            </div>

            {/* Requirements */}
            {form.message && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Your Requirements</p>
                <p className="text-xs text-slate-600 leading-relaxed">{form.message}</p>
              </div>
            )}

            {/* Contractors contacted */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Enquiry Sent To</p>
              <div className="space-y-2.5">
                {shortlist.map((c) => (
                  <div key={`${c.id}-${c.company}`} className="flex items-center gap-3">
                    <img
                      src={c.image}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"; }}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                      alt={c.company}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">{c.company}</p>
                      <p className="text-[10px] text-slate-400">{c.location} · {c.experience} · {c.projects}+ projects</p>
                    </div>
                    <RatingBadge rating={c.rating} />
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 pt-1">
              {[
                { icon: <Shield className="w-3.5 h-3.5 text-emerald-500" />,  label: "Data Protected" },
                { icon: <CheckCircle className="w-3.5 h-3.5 text-blue-500" />, label: "Verified Firms" },
                { icon: <Receipt className="w-3.5 h-3.5 text-violet-500" />,  label: "Receipt Sent" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">{icon}</div>
                  <span className="text-[9px] font-bold text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 text-center">
            <p className="text-[10px] text-slate-400">
              Contractors will respond within 24–48 hours ·{" "}
              <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">support@contracthub.in</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => window.print()}
            className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Receipt className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={onDone}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md shadow-indigo-200"
          >
            Browse More <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function BuyingService2() {
  const [page,      setPage]      = useState("shop");
  const [shortlist, setShortlist] = useState([]);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [search,    setSearch]    = useState("");
  const [activeMenu, setActiveMenu] = useState("epc");
  const [openMenu,   setOpenMenu]   = useState(null);
  const [enquiry,    setEnquiry]    = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ── Shortlist helpers ───────────────────────────────── */
  const addToShortlist = useCallback((contractor) => {
    setShortlist((prev) =>
      prev.find((i) => i.id === contractor.id && i.company === contractor.company)
        ? prev
        : [...prev, contractor]
    );
  }, []);

  const removeFromShortlist = useCallback((id, company) => {
    setShortlist((prev) => prev.filter((i) => !(i.id === id && i.company === company)));
  }, []);

  const shortlistCount = shortlist.length;

  /* ── Active data + filter ────────────────────────────── */
  const rawData = contractorData[activeMenu] || [];

  const filtered = useMemo(() => {
    if (!search.trim()) return rawData;
    const t = search.toLowerCase();
    return rawData.filter(
      (c) => c.company.toLowerCase().includes(t) || c.location.toLowerCase().includes(t)
    );
  }, [rawData, search]);

  const activeLabel = getActiveLabel(activeMenu);

  /* ── Sidebar nav ─────────────────────────────────────── */
  const SidebarNav = ({ onSelect }) => (
    <nav className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm">
      {menuItems.map((menu) => {
        const hasSubMenu  = menu.subMenu && menu.subMenu.length > 0;
        const isSubActive = hasSubMenu && menu.subMenu.some((s) => s.key.trim() === activeMenu.trim());
        const isActive    = activeMenu === menu.key;
        const isOpen      = openMenu === menu.key;

        return (
          <div key={menu.key} className="mb-0.5">
            <button
              onClick={() => {
                if (hasSubMenu) {
                  setOpenMenu(isOpen ? null : menu.key);
                } else {
                  setActiveMenu(menu.key);
                  setSearch("");
                  setOpenMenu(null);
                  onSelect?.();
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 ${
                isActive || (isSubActive && !isOpen)
                  ? "bg-slate-900 text-white shadow-md shadow-slate-300/40"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="font-semibold text-[12.5px] leading-snug">{menu.label}</span>
              {hasSubMenu && (
                <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              )}
            </button>

            {/* Sub-items */}
            {hasSubMenu && isOpen && (
              <div className="py-1 px-1.5 mt-0.5 space-y-0.5">
                {menu.subMenu.map((sub) => (
                  <button
                    key={sub.key}
                    onClick={() => {
                      setActiveMenu(sub.key.trim());
                      setSearch("");
                      onSelect?.();
                    }}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                      activeMenu.trim() === sub.key.trim()
                        ? "bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-50 flex-shrink-0" />
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  /* ── Page routing ────────────────────────────────────── */
  if (page === "confirmation" && enquiry) {
    return (
      <ConfirmationPage
        enquiry={enquiry}
        onDone={() => { setEnquiry(null); setShortlist([]); setPage("shop"); }}
      />
    );
  }
  if (page === "enquiry") {
    return (
      <EnquiryPage
        shortlist={shortlist}
        onBack={() => setPage("shop")}
        onConfirm={(e) => { setEnquiry(e); setPage("confirmation"); }}
      />
    );
  }

  /* ── SHOP PAGE ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              onClick={() => setMobileSidebarOpen((p) => !p)}
            >
              <Briefcase className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-slate-900 text-sm hidden sm:block">ContractHub</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contractors, locations…"
              className="w-full h-9 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-medium outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Shortlist button */}
          <button
            onClick={() => setCartOpen((p) => !p)}
            className="relative flex items-center gap-2 h-9 px-4 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Shortlist</span>
            {shortlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                {shortlistCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile sidebar overlay ── */}
      {mobileSidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contractor Types</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarNav onSelect={() => setMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* ── Main layout ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block h-fit sticky top-20">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-1 mb-2.5">
              Contractor Types
            </p>
            <SidebarNav />

            {/* Stats card */}
            <div className="mt-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Platform Stats</p>
              <div className="space-y-2.5">
                {[
                  { label: "Verified Firms",  value: `${allContractors.length}+`, icon: <Award className="w-3 h-3 text-blue-400" /> },
                  { label: "Projects Done",   value: `${totalProjects}+`,          icon: <TrendingUp className="w-3 h-3 text-emerald-400" /> },
                  { label: "Cities Covered",  value: "20+",                        icon: <MapPin className="w-3 h-3 text-amber-400" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                    </div>
                    <span className="text-[11px] font-black text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Content ── */}
          <main className="min-w-0">
            {/* Section header */}
            <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{activeLabel}</h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {filtered.length} contractor{filtered.length !== 1 ? "s" : ""} available
                  {search && <span className="ml-1">for "<span className="text-slate-700">{search}</span>"</span>}
                </p>
              </div>
              {shortlistCount > 0 && (
                <button
                  onClick={() => setPage("enquiry")}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Enquiry ({shortlistCount})
                </button>
              )}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-slate-300" />
                </div>
                <p className="font-bold text-slate-500 text-sm">No contractors found</p>
                <button onClick={() => setSearch("")} className="text-xs text-indigo-600 font-semibold hover:underline">
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filtered.map((contractor) => (
                  <ContractorCard
                    key={`${activeMenu}-${contractor.id}`}
                    contractor={contractor}
                    inShortlist={shortlist.some((i) => i.id === contractor.id && i.company === contractor.company)}
                    onAdd={addToShortlist}
                    onRemove={removeFromShortlist}
                  />
                ))}
              </div>
            )}
          </main>

          {/* ── Desktop shortlist panel (fixed right) ── */}
          {(cartOpen || shortlistCount > 0) && (
            <div
              className="hidden lg:block"
              style={{ position: "fixed", top: "72px", right: "24px", width: "280px", zIndex: 30 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-100px)]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-600" />
                    <h2 className="font-black text-slate-800 text-sm">Shortlist</h2>
                    {shortlistCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                        {shortlistCount}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setCartOpen(false)} className="text-slate-300 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ShortlistSidebar
                    shortlist={shortlist}
                    onRemove={removeFromShortlist}
                    onClear={() => setShortlist([])}
                    onEnquire={() => setPage("enquiry")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile shortlist drawer ── */}
      {cartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-80 max-w-full h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <h2 className="font-black text-slate-800 text-sm">Shortlist</h2>
                {shortlistCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                    {shortlistCount}
                  </span>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ShortlistSidebar
                shortlist={shortlist}
                onRemove={removeFromShortlist}
                onClear={() => setShortlist([])}
                onEnquire={() => { setCartOpen(false); setPage("enquiry"); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile sticky bar ── */}
      {shortlistCount > 0 && !cartOpen && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm flex items-center justify-between px-5 shadow-xl shadow-indigo-500/30"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Shortlist ({shortlistCount})
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-white/80">
              Send Enquiry <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}