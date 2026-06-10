import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Eye, Clock, Zap,
  User, Mail, Phone, MapPin, Building2, FileText,
  CheckCircle2, XCircle, MessageSquare,
  ShieldCheck,
} from "lucide-react";
import DynamicActionToBeTaken from "./DynamicActionToBeTaken";

// ── Tab config ────────────────────────────────────────────────────────────
const TABS = [
  { key: "preview",  label: "Preview",            icon: Eye         },
  { key: "previous", label: "Previous Actions",   icon: Clock       },
  { key: "action",   label: "Action To Be Taken", icon: Zap         },
];

// ── Preview panel ─────────────────────────────────────────────────────────
function Preview({ applicationId, userRow, userTab }) {
  const isCommercial = userTab === 2;

  const fields = [
    ...(isCommercial ? [{ label: "Company Name", value: userRow?.CompanyName, icon: Building2 }] : []),
    { label: "Full Name",  value: userRow?.Name,      icon: User     },
    { label: "Email",      value: userRow?.EmailId,   icon: Mail     },
    { label: "Mobile",     value: userRow?.MobileNo,  icon: Phone    },
    { label: "State",      value: userRow?.StateName, icon: MapPin   },
    { label: "Pin Code",   value: userRow?.PinCode,   icon: MapPin   },
    ...(isCommercial ? [{ label: "Service", value: userRow?.ServiceName, icon: FileText }] : []),
    { label: "App ID",     value: applicationId,      icon: ShieldCheck },
  ];

  return (
    <div className="space-y-5">
      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white">
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)",
          }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
              {(userRow?.Name ?? userRow?.CompanyName ?? "?")[0]}
            </div>
            <div className="pb-1">
              <h3 className="font-black text-slate-900 text-lg">{userRow?.Name ?? userRow?.CompanyName ?? "Unknown"}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{isCommercial ? "Commercial Account" : "Individual Account"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-indigo-100 hover:bg-indigo-50/20 transition-all">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-indigo-500" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value ?? "—"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status chip */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Current Status</span>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
          userRow?.Status === "Verified"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : userRow?.Status === "Rejected"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {userRow?.Status ?? "Pending"}
        </span>
      </div>
    </div>
  );
}

// ── Previous actions timeline ─────────────────────────────────────────────
const MOCK_HISTORY = [
  {
    action: "Registration Submitted",
    actor: "System",
    time: "2 days ago",
    note: "User self-registered and submitted details.",
    type: "info",
  },
  {
    action: "Email OTP Verified",
    actor: "System",
    time: "2 days ago",
    note: "Email verified via 6-digit OTP.",
    type: "success",
  },
  {
    action: "Sent for Review",
    actor: "Admin — Ops Manager",
    time: "1 day ago",
    note: "Flagged: Needs more documents",
    type: "warning",
  },
];

const historyIconMap = {
  info:    { icon: ShieldCheck,  bg: "bg-indigo-100",  text: "text-indigo-600"  },
  success: { icon: CheckCircle2, bg: "bg-emerald-100", text: "text-emerald-600" },
  warning: { icon: MessageSquare,bg: "bg-amber-100",   text: "text-amber-600"   },
  reject:  { icon: XCircle,      bg: "bg-red-100",     text: "text-red-600"     },
};

function PreviousActions({ applicationId }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400 font-semibold">Application ID: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-600">{applicationId}</code></p>

      {MOCK_HISTORY.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500">No previous actions recorded.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200" />
          <div className="space-y-3 pl-10">
            {MOCK_HISTORY.map((item, i) => {
              const cfg = historyIconMap[item.type] ?? historyIconMap.info;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-10 top-3 w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center border-2 border-white shadow-sm`}>
                    <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 hover:border-indigo-100 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-800 text-sm">{item.action}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap font-semibold">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">by {item.actor}</p>
                    {item.note && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{item.note}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main wrapper ──────────────────────────────────────────────────────────
export default function ActionWrapperMain() {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("preview");

  // The full location.state is the "prompt" object
  const promptData = location.state ?? {};
  const { userRow, userTab } = promptData;

  const tabContent = {
    preview:  <Preview  applicationId={applicationId} userRow={userRow} userTab={userTab} />,
    previous: <PreviousActions applicationId={applicationId} />,
    action:   <DynamicActionToBeTaken data={promptData} applicationId={applicationId} />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Page header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm px-5 pt-4 pb-5">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to User Verification
          </button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-slate-900 text-xl">User Review Panel</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Application ID:{" "}
                  <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-600 text-xs">
                    {applicationId}
                  </code>
                </p>
              </div>
            </div>

            {/* Action type pill */}
            {promptData.actionType && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${
                promptData.actionType === "verify"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : promptData.actionType === "reject"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}>
                <Zap className="w-3 h-3" />
                {promptData.actionType.charAt(0).toUpperCase() + promptData.actionType.slice(1)} Mode
              </span>
            )}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mt-5 p-1 bg-slate-100 rounded-2xl">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === key
                    ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
