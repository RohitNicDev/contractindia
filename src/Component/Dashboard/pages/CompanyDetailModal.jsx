/**
 * CompanyDetailModal
 *
 * Opens when admin clicks "View" on a Commercial user row in UserVerification.
 * Fetches all profile data for that userId and renders it in a tabbed modal:
 *   1. Basic Info      — company name, contact, email, mobile, address + photos
 *   2. Registration    — GST, PAN, CIN, Aadhaar, PF, ESI, MSME, license
 *   3. Banking         — bank name, account, IFSC, MICR
 *   4. Documents       — uploaded documents grouped by category/subcategory
 *   5. Services        — active services tree
 *
 * Props:
 *   userId     number | string  — UserId of the commercial user
 *   row        object           — Raw row from the verification table (for header display)
 *   onClose    () => void
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  X, User, FileText, CreditCard, Upload, Briefcase,
  Building2, Eye, Download, Image, CheckCircle2,
  Hash, Layers3,
} from "lucide-react";
import {
  UserRegistrationUserIdGet,
  userBasicInformationbyParam,
  userBankDetailbyParams,
  UserDocumentStoreGetById,
  getUserServicesByParam,
} from "../../../services/api";

const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || "";

// ── API helpers ────────────────────────────────────────────────────────────
const fetchUserReg     = (id) => UserRegistrationUserIdGet(id).then(r => r?.data?.[0] ?? r?.data ?? {});
const fetchBasicInfo   = (id) => userBasicInformationbyParam(`userId=${id}`).then(r => r?.data?.[0] ?? {});
const fetchBankDetail  = (id) => userBankDetailbyParams(`userId=${id}`).then(r => r?.data?.[0] ?? {});
const fetchDocs        = (id) => UserDocumentStoreGetById(`userId=${id}`).then(r => r?.data ?? []);
const fetchServices    = (id) => getUserServicesByParam(`userId=${id}`).then(r => r?.data ?? []);

// ── TABS config ────────────────────────────────────────────────────────────
const TABS = [
  { key: "basic",        label: "Basic Info",   icon: User      },
  { key: "registration", label: "Registration", icon: FileText  },
  { key: "banking",      label: "Banking",      icon: CreditCard },
  { key: "documents",    label: "Documents",    icon: Upload    },
  { key: "services",     label: "Services",     icon: Briefcase },
];

// ── Shared field row ───────────────────────────────────────────────────────
function FieldRow({ label, value, mono = false, badge, badgeColor }) {
  const BADGE_COLORS = {
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    red:    "bg-red-50 text-red-700 border-red-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        {badge ? (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${BADGE_COLORS[badgeColor] ?? BADGE_COLORS.slate}`}>
            {badge}
          </span>
        ) : (
          <p className={`text-sm font-semibold text-slate-800 break-all ${mono ? "font-mono" : ""}`}>
            {value ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────────────────
function SectionHead({ icon: Icon, title, color = "blue" }) {
  const cols = {
    blue:   "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald:"bg-emerald-50 text-emerald-600",
    amber:  "bg-amber-50 text-amber-600",
  };
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${cols[color] ?? cols.blue}`}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <h4 className="text-sm font-black text-slate-800">{title}</h4>
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-14 rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Basic Info
// ═══════════════════════════════════════════════════════════════════════════
function TabBasic({ userId }) {
  const { data: reg = {}, isLoading: regLoading } = useQuery({
    queryKey: ["companyDetailReg", userId],
    queryFn: () => fetchUserReg(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const { data: basic = {}, isLoading: basicLoading } = useQuery({
    queryKey: ["companyDetailBasic", userId],
    queryFn: () => fetchBasicInfo(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  if (regLoading || basicLoading) return <Skeleton />;

  const photos = basic?.CompanyPhotos ?? [];

  return (
    <div className="space-y-5">
      <div>
        <SectionHead icon={Building2} title="Company Information" color="blue" />
        <div className="grid sm:grid-cols-2 gap-3">
          <FieldRow label="Company Name"     value={reg?.CompanyName   ?? reg?.CompanyName} />
          <FieldRow label="Company Type"     value={basic?.CompanyTypeName ?? reg?.CompanyTypeName} />
          <FieldRow label="Contact Person"   value={basic?.ContactNo     ?? reg?.Name} />
          <FieldRow label="Email Address"    value={reg?.EmailId   ?? reg?.EmailId} />
          <FieldRow label="Mobile Number"    value={basic?.ContactNo     ?? reg?.MobileNo} mono />
          <FieldRow label="Address"          value={basic?.Address       ?? reg?.Address} />
        </div>
      </div>

      {photos.length > 0 && (
        <div>
          <SectionHead icon={Image} title="Company Photos" color="violet" />
          <div className="grid grid-cols-3 gap-3">
            {photos.map((p, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group">
                <img
                  src={p?.src ?? (p?.documentPath ? `${BASE_URL}/${p.documentPath}` : null)}
                  alt={p?.name ?? `Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Registration
// ═══════════════════════════════════════════════════════════════════════════
function TabRegistration({ userId }) {
  const { data = {}, isLoading } = useQuery({
    queryKey: ["companyDetailBasic", userId],
    queryFn: () => fetchBasicInfo(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  if (isLoading) return <Skeleton />;

  const fields = [
    { label: "GST Number",             value: data?.GSTNo,                 mono: true },
    { label: "PAN Number",             value: data?.PANNo,                 mono: true },
    { label: "CIN Number",             value: data?.CINNo,                 mono: true },
    { label: "Aadhaar Number",         value: data?.AadharNo,              mono: true },
    { label: "PF Account Number",      value: data?.PFNo,                  mono: true },
    { label: "ESI Number",             value: data?.ESINo,                 mono: true },
    { label: "Trade/Shop License No.", value: data?.LicenseNo,             mono: true },
    { label: "License Expiry",         value: data?.LicenseExpiryDate      },
    { label: "MSME / Udyam No.",       value: data?.UdyogRegistrationNo,   mono: true },
    { label: "Is MSME?",               badge: data?.IsMSME ? "Yes" : "No", badgeColor: data?.IsMSME ? "green" : "slate" },
  ];

  return (
    <div>
      <SectionHead icon={Hash} title="Statutory & Compliance Details" color="violet" />
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map(f => (
          <FieldRow key={f.label} {...f} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Banking
// ═══════════════════════════════════════════════════════════════════════════
function TabBanking({ userId }) {
  const { data = {}, isLoading } = useQuery({
    queryKey: ["companyDetailBank", userId],
    queryFn: () => fetchBankDetail(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  if (isLoading) return <Skeleton />;

  const maskedAccount = data?.AccountNo
    ? "•".repeat(Math.max(0, data.AccountNo.length - 4)) + data.AccountNo.slice(-4)
    : "—";

  return (
    <div className="space-y-5">
      {/* Visual bank card */}
      {(data?.BankName || data?.AccountNo) && (
        <div className="rounded-2xl overflow-hidden shadow-lg" style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #162646 60%, #0d1b2e 100%)"
        }}>
          <div className="p-5 text-white">
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Settlement Bank Account</p>
            <h3 className="font-black text-lg">{data?.BankName ?? "—"}</h3>
            <p className="font-mono text-white/60 text-sm mt-3 tracking-widest">
              {maskedAccount}
            </p>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">IFSC</p>
                <p className="font-mono text-xs text-white font-bold">{data?.IFSC ?? "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/40 uppercase tracking-widest">MICR</p>
                <p className="font-mono text-xs text-white font-bold">{data?.MICR ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <FieldRow label="Bank Name"       value={data?.BankName}    />
        <FieldRow label="Account Number"  value={maskedAccount} mono />
        <FieldRow label="IFSC Code"       value={data?.IFSC}    mono />
        <FieldRow label="MICR Code"       value={data?.MICR}    mono />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Documents
// ═══════════════════════════════════════════════════════════════════════════
function TabDocuments({ userId }) {
  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["companyDetailDocs", userId],
    queryFn: () => fetchDocs(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  // ⚠️ useMemo MUST be called unconditionally — before any early return
  const grouped = useMemo(() => {
    const map = {};
    docs.forEach(d => {
      const cat = d.DocumentCategoryName ?? "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(d);
    });
    return map;
  }, [docs]);

  if (isLoading) return <Skeleton />;

  if (!docs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <Upload className="w-7 h-7 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-slate-600">No documents uploaded yet</p>
        <p className="text-xs text-slate-400 mt-1">The user has not uploaded any documents.</p>
      </div>
    );
  }

  const handleDownload = (doc) => {
    const url = `${BASE_URL}/UserDocumentStore/download?userId=${userId}&documentCategoryId=${doc.DocumentCategoryID}&documentSubCategoryId=${doc.DocumentSubCategoryID}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([catName, catDocs]) => (
        <div key={catName}>
          <SectionHead icon={FileText} title={catName} color="amber" />
          <div className="grid sm:grid-cols-2 gap-3">
            {catDocs.map(doc => {
              const isPdf = doc?.FileExtension?.toLowerCase() === "pdf";
              const docSrc = doc?.DocumentPath
                ? `${BASE_URL}/${doc.DocumentPath}`
                : doc?.documentFileBase64
                  ? `data:${isPdf ? "application/pdf" : "image/jpeg"};base64,${doc.documentFileBase64}`
                  : null;

              return (
                <div key={doc.UserDocumentID ?? doc.DocumentSubCategoryID}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors">

                  {/* Thumbnail or icon */}
                  <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {docSrc && !isPdf ? (
                      <img src={docSrc} alt={doc.DocumentName} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className={`w-5 h-5 ${isPdf ? "text-red-400" : "text-slate-400"}`} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{doc.DocumentSubCategoryName ?? doc.DocumentName ?? "Document"}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {doc.FileExtension?.toUpperCase()} · {doc.FileSizeKB ?? "—"} KB
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Uploaded
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="shrink-0 w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Services
// ═══════════════════════════════════════════════════════════════════════════
function TabServices({ userId }) {
  const { data: rawServices = [], isLoading } = useQuery({
    queryKey: ["companyDetailServices", userId],
    queryFn: () => fetchServices(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  // Build parent→children tree — must be computed unconditionally (hooks must not precede this)
  const allServices = rawServices ?? [];
  const { roots, activeServices } = useMemo(() => {
    const active = allServices.filter(s => Number(s.IsActive) === 1);
    const nodeMap = {};
    allServices.forEach(s => { nodeMap[s.ServiceID] = { ...s, children: [] }; });
    const rootList = [];
    allServices.forEach(s => {
      const pid = s.ParentServiceID;
      if (pid && nodeMap[pid]) nodeMap[pid].children.push(nodeMap[s.ServiceID]);
      else rootList.push(nodeMap[s.ServiceID]);
    });
    return { roots: rootList, activeServices: active };
  }, [rawServices]);

  if (isLoading) return <Skeleton />;

  if (!rawServices.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <Briefcase className="w-7 h-7 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-slate-600">No services found</p>
        <p className="text-xs text-slate-400 mt-1">This user has not configured any services.</p>
      </div>
    );
  }

  const renderTree = (nodes, depth = 0) => nodes.map(node => {
    const isActive = Number(node.IsActive) === 1;
    return (
      <div key={node.ServiceID}>
        <div className={`flex items-center gap-2 py-2 px-3 rounded-xl border mb-1.5 ${
          isActive ? "border-emerald-200 bg-emerald-50/60" : "border-slate-100 bg-slate-50/60"
        }`} style={{ marginLeft: depth * 20 }}>
          {depth > 0 && <div className="w-3 h-px bg-slate-300 shrink-0" />}
          <Layers3 className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-emerald-500" : "text-slate-400"}`} />
          <span className={`text-xs font-semibold flex-1 ${isActive ? "text-emerald-800" : "text-slate-600"}`}>
            {node.ServiceName}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
          }`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        {node.children?.length > 0 && renderTree(node.children, depth + 1)}
      </div>
    );
  });

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
          <p className="text-2xl font-black text-emerald-700">{activeServices.length}</p>
          <p className="text-xs text-emerald-600 font-semibold">Active Services</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-2xl font-black text-slate-700">{allServices.length}</p>
          <p className="text-xs text-slate-500 font-semibold">Total Services</p>
        </div>
      </div>

      {/* Tree */}
      <div>
        <SectionHead icon={Briefcase} title="Service Structure" color="emerald" />
        <div className="space-y-0.5">
          {renderTree(roots)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT: CompanyDetailModal
// ═══════════════════════════════════════════════════════════════════════════
export default function CompanyDetailModal({ userId, row, onClose }) {
  console.log(row,"row");
  
  const [activeTab, setActiveTab] = useState("basic");

  const companyName = row?.CompanyName ?? row?.Name ?? `User #${userId}`;
  const status      = row?.Status;

  const statusColor = status === "Verified"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : status === "Rejected"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const TAB_CONTENT = {
    basic:        <TabBasic        userId={userId} />,
    registration: <TabRegistration userId={userId} />,
    banking:      <TabBanking      userId={userId} />,
    documents:    <TabDocuments    userId={userId} />,
    services:     <TabServices     userId={userId} />,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center px-4 py-6">
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                {companyName[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-black text-slate-900 text-base truncate">{companyName}</h2>
                  {status && (
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  User ID: <code className="font-mono bg-slate-100 px-1 rounded text-slate-600">{userId}</code>
                  {row?.EmailId && <span className="ml-2">· {row.EmailId}</span>}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Tab bar ── */}
          <div className="flex gap-1 px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 overflow-x-auto [scrollbar-width:none] shrink-0">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === key
                    ? "bg-white text-blue-700 border border-blue-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {TAB_CONTENT[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
