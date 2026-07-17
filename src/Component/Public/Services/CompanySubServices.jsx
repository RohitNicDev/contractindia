/**
 * INDIVIDUAL USER SERVICE FLOW
 *
 * Complete user journey with payment integration:
 * 1. View available services (free browsing)
 * 2. Click "View Details" → Check subscription status
 * 3. If NO active plan → Payment Modal (Razorpay)
 * 4. If HAS active plan → Service Detail Modal
 * 5. Post-payment → Auto-refresh subscriptions → Show Details Modal
 *
 * State Management: Each modal has isolated state with proper cleanup
 * Error Handling: Comprehensive error cases with user feedback
 * Testing: All flows documented with example scenarios
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronRight,
  MapPin,
  PhoneCall,
  Star,
  Crown,
  X,
  Loader,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  ContractorListGet,
  ServiceMenuGet,
  userServicesdetailsGetByparam,
  UserSubscriptionDetailGet,
  planMasterGetById,
  userSubscriptionDetailSave,
  UserPaymentHistorySave,
  UserServiceDetailsSave,
  CheckValidityGet,
  getUserRegistrationbyParam,
} from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceStore, useUserStore } from "../../../store/store";
import { ConfirmModal } from "../../common/ConfirmModal";
import { toast } from "sonner";

// ─── API HELPERS ───────────────────────────────────────────────────────
const fetchContractors = async (serviceId) => {
  if (!serviceId) return [];
  return (await userServicesdetailsGetByparam(serviceId)) ?? [];
};

const fetchUserSubscriptions = async (userId) => {
  const response = await UserSubscriptionDetailGet(`userId=${userId}`);
  return response?.data ?? [];
};
const CheckValidityGetQuery = async (userId) => {
  const response = await CheckValidityGet(`userId=${userId}`);
  return response;
};

const fetchPlans = async (userType) => {
  const res = await planMasterGetById(`userType=${userType}`);
  return res?.data ?? [];
};
const userRegistrationbyDetails = async (userId) => {
  const res = await getUserRegistrationbyParam(`?userId=${userId}`);
  return res?.data ?? [];
};

// ─── TREE HELPERS ───────────────────────────────────────────────────────
const buildTree = (flat) => {
  if (!Array.isArray(flat) || !flat.length) return [];
  const map = {};
  flat.forEach((item) => {
    map[item?.ServiceID] = { ...item, children: [] };
  });
  const roots = [];
  flat.forEach((item) => {
    const pid = item?.ParentServiceID ?? 0;
    if (!pid || !map[pid]) roots.push(map[item?.ServiceID]);
    else map[pid].children.push(map[item?.ServiceID]);
  });
  return roots;
};

const flattenTree = (nodes, out = []) => {
  nodes.forEach((n) => {
    out.push(n);
    if (n.children?.length) flattenTree(n.children, out);
  });
  return out;
};

const normalizeServiceMenu = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;

  if (payload && typeof payload === "object") {
    const nestedArray = Object.values(payload).find((value) =>
      Array.isArray(value),
    );
    if (nestedArray) return nestedArray;
  }

  return [];
};

const findNode = (nodes, id) => {
  for (const n of nodes) {
    if (n.ServiceID === id) return n;
    const f = findNode(n.children ?? [], id);
    if (f) return f;
  }
  return null;
};

const findFirstLeaf = (node) => {
  if (!node?.children?.length) return node;
  return findFirstLeaf(node.children[0]);
};

const getAncestorIds = (tree, targetId) => {
  const ancestors = new Set();
  const walk = (nodes) => {
    for (const n of nodes) {
      ancestors.add(n.ServiceID);
      if (n.ServiceID === targetId) return true;
      if (walk(n.children ?? [])) return true;
      ancestors.delete(n.ServiceID);
    }
    return false;
  };
  walk(tree);
  ancestors.delete(targetId);
  return ancestors;
};

const subtreeHasActive = (node, activeId) => {
  if (node.ServiceID === activeId) return true;
  return (node.children ?? []).some((c) => subtreeHasActive(c, activeId));
};

// ─── COLOR PALETTE ────────────────────────────────────────────────────
const PALETTE = [
  {
    activeBg: "#4f46e5",
    softBg: "#eef2ff",
    softText: "#4338ca",
    dot: "#6366f1",
  },
  {
    activeBg: "#0e7490",
    softBg: "#ecfeff",
    softText: "#0e7490",
    dot: "#0891b2",
  },
  {
    activeBg: "#047857",
    softBg: "#ecfdf5",
    softText: "#047857",
    dot: "#059669",
  },
  {
    activeBg: "#b45309",
    softBg: "#fffbeb",
    softText: "#b45309",
    dot: "#d97706",
  },
  {
    activeBg: "#be123c",
    softBg: "#fff1f2",
    softText: "#be123c",
    dot: "#e11d48",
  },
  {
    activeBg: "#6d28d9",
    softBg: "#f5f3ff",
    softText: "#6d28d9",
    dot: "#7c3aed",
  },
];

const col = (d) => PALETTE[d % PALETTE.length];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
];

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.BASE_URL;

// ═══════════════════════════════════════════════════════════════════════
// PAYMENT MODAL - Payment confirmation and Razorpay integration
// ═══════════════════════════════════════════════════════════════════════
function PaymentModal({ plan, onConfirm, onCancel, isLoading }) {
  const price = plan?.Price ?? 0;
  const [isRazorpayReady, setIsRazorpayReady] = useState(!!window.Razorpay);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black">Confirm Payment</h2>
                <p className="text-indigo-200 text-xs mt-1">
                  Subscribe to access contractor details
                </p>
              </div>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Plan Details */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                Plan Summary
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">
                    Plan
                  </span>
                  <span className="font-bold text-indigo-700">
                    {plan?.PlanName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">
                    Duration
                  </span>
                  <span className="font-bold text-indigo-700">
                    {plan?.DurationType}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-indigo-200">
                  <span className="text-sm font-semibold text-slate-600">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-indigo-700">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              {price === 0 && (
                <p className="text-xs text-indigo-600 mt-3 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Free plan - No payment
                  required
                </p>
              )}
            </div>

            {/* Info */}
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              ✓ Secured payment powered by Razorpay
              <br />✓ Your data is encrypted and secure
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={isLoading || !isRazorpayReady}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4" /> Proceed to Payment
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PLAN SELECTION MODAL - Choose plan before payment
// ═══════════════════════════════════════════════════════════════════════
function PlanSelectionModal({ plans, onSelectPlan, onCancel, isLoading }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-gradient-to-r from-slate-50 to-white">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Choose a Plan
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                No hidden fees. Cancel anytime.
              </p>
            </div>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Plans Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {plans.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-400 text-sm">No plans available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.PlanID}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border-2 border-slate-200 p-5 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-black text-slate-900 text-lg">
                        {plan.PlanName}
                      </h3>
                      {Number(plan?.IsActive) === 1 && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-4xl font-black text-indigo-600 mb-1">
                      ₹{Number(plan.Price || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      per {plan.DurationType?.toLowerCase() ?? "month"}
                    </p>

                    <ul className="space-y-2 mb-5 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Up to {plan.maxNoofServices ?? "unlimited"} services
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {plan.Remark || "Full access"}
                      </li>
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectPlan(plan)}
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-3 h-3 animate-spin" />{" "}
                          Processing…
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" /> Select Plan
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SERVICE DETAIL MODAL - Show contractor details after subscription check
// ═══════════════════════════════════════════════════════════════════════
function ContractorDetailModal({ item, onClose, canAccess }) {
  if (!item) return null;
  console.log(item, "item");

  const company = item?.CompanyName || item?.Name || "Contractor";
  const email = item?.EmailId || "—";
  const mobile = item?.MobileNo || item?.PhoneNo || "—";
  const location =
    [item?.CityName, item?.StateName].filter(Boolean).join(", ") || "India";
  const pincode = item?.PinCode || "—";
  const status = item?.Status || "—";
  const service = item?.ServiceName || "—";

  const rows = [
    { label: "Company", value: company },
    { label: "Email", value: email },
    { label: "Mobile", value: mobile },
    { label: "Location", value: location },
    { label: "Pin Code", value: pincode },
    { label: "Status", value: status },
    { label: "Service", value: service },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-100 sticky top-0 bg-gradient-to-r from-slate-50 to-white">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{company}</h2>
              <p className="text-sm text-slate-500 mt-1">{service}</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Access Banner */}
            {canAccess && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-sm font-semibold text-emerald-700">
                  You have access to this contractor's details
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {rows.map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 break-all">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Action */}
            {mobile !== "—" && (
              <a
                href={`tel:${mobile}`}
                className="flex w-full items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                <PhoneCall className="w-4 h-4" /> Call {company}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CONTRACTOR CARD - Displays contractor info with "View Details" button
// ═══════════════════════════════════════════════════════════════════════
function ContractorCard({ item, idx, onViewDetails, hasActivePlan }) {
  const company = item?.CompanyName || item?.Name || "Contractor";
  const location = item?.CityName || item?.StateName || "India";
  const phone = item?.MobileNo || item?.PhoneNo || "";
  const status = item?.Status || "";
  const rating =
    typeof item?.Rating === "number" ? item?.Rating : 4.5 + (idx % 5) * 0.1;
  const imgUrl = `${API_URL}/UserDocumentStore/image?userId=${item?.UserID}&documentCategoryId=7&documentSubCategoryId=10`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.24) }}
      className="group bg-white rounded-3xl border border-slate-200/60 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-36 m-2 rounded-2xl overflow-hidden">
        <img
          src={imgUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
          alt={company}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg flex items-center gap-1">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-black text-slate-800">
            {rating.toFixed(1)}
          </span>
        </div>
        {status && (
          <span
            className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-lg ${
              status === "Approved"
                ? "bg-emerald-500/90 text-white"
                : "bg-amber-400/90 text-white"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-0.5">
          {company}
        </h3>
        <div className="flex items-center gap-1 text-slate-400 mb-3">
          <MapPin size={10} />
          <span className="text-[10px] truncate">{location}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95 ${
              hasActivePlan
                ? "bg-slate-900 hover:bg-indigo-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {/* {hasActivePlan ? "View Details" : "Subscribe"} */}
            {"View Details"}
          </button>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 border border-emerald-200 text-emerald-700 py-2 rounded-xl text-[11px] font-bold hover:bg-emerald-50 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Card Skeleton ─────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-36 m-2 rounded-2xl bg-slate-100" />
      <div className="px-4 pb-4 space-y-3 mt-2">
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-slate-100 rounded-xl" />
          <div className="flex-1 h-8 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Node ─────────────────────────────────────────────────────
function SidebarNode({
  node,
  depth,
  activeId,
  onSelect,
  expandedIds,
  toggleExpand,
}) {
  const hasKids = node.children?.length > 0;
  const isActive = node.ServiceID === activeId;
  const isOpen = expandedIds.has(node.ServiceID);
  const isAnc = !isActive && subtreeHasActive(node, activeId);
  const c = col(depth);
  const indent = depth * 16;
  const fs = Math.max(11, 13 - depth * 0.5);
  const dotSize = Math.max(6, 10 - depth * 1.5);

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node.ServiceID);
          if (hasKids) toggleExpand(node.ServiceID);
        }}
        style={{
          paddingLeft: 12 + indent,
          fontSize: fs,
          background: isActive ? c.activeBg : isAnc ? c.softBg : "transparent",
          color: isActive ? "#fff" : isAnc ? c.softText : "#475569",
        }}
        className="w-full text-left flex items-center gap-2 rounded-xl pr-3 py-2 mb-0.5 font-semibold transition-all duration-150 hover:opacity-90"
      >
        <span
          className="shrink-0 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            minWidth: dotSize,
            background: isActive ? "#fff" : c.dot,
            opacity: isActive ? 1 : 0.85,
          }}
        />
        <span className="flex-1 line-clamp-2 leading-snug">
          {node.ServiceName}
        </span>
        {hasKids && (
          <span className="flex items-center gap-1 shrink-0 ml-1">
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none"
              style={{
                background: isActive ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                color: isActive ? "#fff" : "#64748b",
              }}
            >
              {node.children.length}
            </span>
            <ChevronRight
              size={11}
              style={{
                transform: isOpen ? "rotate(90deg)" : "none",
                transition: "transform 0.2s",
                color: isActive ? "rgba(255,255,255,0.8)" : "#94a3b8",
              }}
            />
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {hasKids && isOpen && (
          <motion.div
            key="kids"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <SidebarNode
                key={child.ServiceID}
                node={child}
                depth={depth + 1}
                activeId={activeId}
                onSelect={onSelect}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────
function Breadcrumb({ tree, activeId, onSelect }) {
  const path = useMemo(() => {
    const trail = [];
    const walk = (nodes) => {
      for (const n of nodes) {
        trail.push(n);
        if (n.ServiceID === activeId) return true;
        if (walk(n.children ?? [])) return true;
        trail.pop();
      }
      return false;
    };
    walk(tree);
    return trail;
  }, [tree, activeId]);

  if (path.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 flex-wrap mb-4">
      {path.map((node, i) => {
        const isLast = i === path.length - 1;
        const c = col(i);
        return (
          <span key={node.ServiceID} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight size={11} className="text-slate-300 shrink-0" />
            )}
            <button
              onClick={() => !isLast && onSelect(node.ServiceID)}
              className="text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all"
              style={
                isLast
                  ? {
                      background: c.softBg,
                      color: c.softText,
                      cursor: "default",
                    }
                  : { color: "#94a3b8" }
              }
            >
              {node.ServiceName}
            </button>
          </span>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT - Individual User Service Flow
// ═══════════════════════════════════════════════════════════════════════
const CompanySubServices = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { loginResponce } = useUserStore();

  const isLoggedIn = !!(
    loginResponce?.isLoginSuccessful || loginResponce?.userId
  );
  const userId = loginResponce?.userId || 0;
  const userType = loginResponce?.userType || 0;

  // ── STATE ──────────────────────────────────────────────────────────
  const [activeId, setActiveId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Modal states - Isolated for proper cleanup
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [pendingDetailItem, setPendingDetailItem] = useState(null);

  // Processing states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // ── QUERIES ────────────────────────────────────────────────────────
  const { data: menuServicesRaw = [], isLoading: menuServicesLoading } =
    useQuery({
      queryKey: ["ServiceMenuGetList"],
      queryFn: ServiceMenuGet,
      staleTime: 5 * 60 * 1000,
    });

  const menuServices = useMemo(
    () => normalizeServiceMenu(menuServicesRaw),
    [menuServicesRaw],
  );
  const {
    mutate: userRegistrationMutate,
    data: userRegistrationData,
    isPending: userRegistrationpending,
  } = useMutation({
    mutationFn: userRegistrationbyDetails,
    onSuccess: (response) => {
      const userData = response?.[0] || response?.data?.[0] || {};

      // setEnquiryService({

      // });
      setDetailItem(userData);
    },
    onError: (err) => {
      console.error(err);
      toast.error(
        "Failed to retrieve your registration details. Proceeding with default enquiry.",
      );
      // setEnquiryService({

      // });
      // s
    },
  });

  const tree = useMemo(() => {
    if (!menuServices?.length) return [];
    const fullTree = buildTree(menuServices);
    if (!serviceId) return fullTree;
    const target = findNode(fullTree, Number(serviceId));
    return target ? [target] : [];
  }, [menuServices, serviceId]);

  const totalNodes = useMemo(() => flattenTree(tree)?.length, [tree]);

  const { data: subscriptions = [], refetch: refetchSubscriptions } = useQuery({
    queryKey: ["userSubscriptions", userId],
    queryFn: () => fetchUserSubscriptions(userId),
    enabled: !!userId && isLoggedIn,
    retry: false,
  });

  const { data: CheckValidityData, refetch: refetchCheckValidity } = useQuery({
    queryKey: ["CheckValidity", userId],
    queryFn: () => CheckValidityGetQuery(userId),
    enabled: !!userId && isLoggedIn,
    retry: false,
  });

  const hasActivePlan = CheckValidityData?.status;
  const activeSub = subscriptions.find((s) => s.IsActive === 1);
  useEffect(() => {
    console.log(CheckValidityData?.status, "CheckValidityData");
  }, [CheckValidityData]);

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["planMasterGetById", userType],
    queryFn: () => fetchPlans(userType),
    enabled: !!userType && (showPlanSelection || showPaymentModal),
  });
  const { mutateAsync: saveService } = useMutation({
    mutationFn: UserServiceDetailsSave,
    onSuccess: (response) => {
      if (response?.status) {
        toast.success(response?.message || "Service activated successfully");
        refetchSubscriptions();
      } else {
        toast.error(
          response?.message || "Failed to activate service. Please try again.",
        );
      }
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to activate service. Please try again.",
      );
    },
  });
  const { data: contractors = [], isLoading: contractorsLoading } = useQuery({
    queryKey: ["contractors", activeId],
    queryFn: () => fetchContractors(activeId),
    enabled: !!activeId,
    staleTime: 2 * 60 * 1000,
  });

  // ── MUTATIONS ──────────────────────────────────────────────────────
  const { mutateAsync: saveSubscription, isPending: isSavingSubscription } =
    useMutation({
      mutationFn: userSubscriptionDetailSave,
    });

  const { mutateAsync: savePaymentHistory } = useMutation({
    mutationFn: UserPaymentHistorySave,
  });

  // ── AUTO-SELECT FIRST LEAF ────────────────────────────────────────
  useEffect(() => {
    if (!tree.length) {
      setActiveId(null);
      setExpandedIds(new Set());
      return;
    }
    const isInTree = activeId !== null && !!findNode(tree, activeId);
    if (isInTree) return;
    const leaf = findFirstLeaf(tree[0]) ?? tree[0];
    setActiveId(leaf.ServiceID);
    setExpandedIds(getAncestorIds(tree, leaf.ServiceID));
  }, [tree, activeId]);

  // ── HANDLERS ───────────────────────────────────────────────────────
  const handleSelect = (id) => {
    setActiveId(id);
    setExpandedIds((prev) => new Set([...prev, ...getAncestorIds(tree, id)]));
  };

  const toggleExpand = (id) =>
    setExpandedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const activeNode = useMemo(
    () => (activeId ? findNode(tree, activeId) : null),
    [tree, activeId],
  );

  const parentName = useMemo(() => {
    const s = menuServices?.find(
      (el) => Number(el.ServiceID ?? el.value) === Number(serviceId),
    );
    return s?.ServiceName || s?.name || "Services";
  }, [menuServices, serviceId]);

  // ── MAIN FLOW: View Details ────────────────────────────────────────
  const handleViewDetails = (item) => {
    console.log("🔍 handleViewDetails called", {
      item,
      isLoggedIn,
      hasActivePlan,
    });

    // Step 1: Check login
    if (!isLoggedIn) {
      toast.error("Please login to view contractor details");
      navigate("/login");
      return;
    }

    // Step 2: Check active plan
    if (!hasActivePlan) {
      console.log("❌ No active plan - showing plan selection");
      setShowPlanSelection(true);
      return;
    }

    // Step 3: Confirm before showing details
    console.log("✅ Active plan found - asking for confirmation", item);
    setPendingDetailItem(item);
  };

  const handleConfirmViewDetails = async () => {
    if (!pendingDetailItem) return false;
    // console.log(pendingDetailItem,"pendingDetailItem");
    try {
      const payload = {
        userServiceID: 0,
        userID: userId,
        serviceID: activeNode?.ServiceID ?? serviceId ?? 0,
        serviceName: activeNode?.ServiceName || parentName || "Service",
        planID: activeSub?.PlanID ?? 0,
        planName: activeSub?.PlanName ?? "",
        amount: 0,
        enterredBy: userId,
        isActive: 1,
      };

      const response = await saveService(payload);

      if (response?.status) {
        console.log(activeNode, "activeNode");
        console.log(pendingDetailItem, "pendingDetailItem");

        // setDetailItem(pendingDetailItem);
        setPendingDetailItem(null);
        userRegistrationMutate(pendingDetailItem?.UserID);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Confirm view details error:", err);
      return false;
    }
  };

  const handleCancelViewDetails = () => {
    setPendingDetailItem(null);
  };

  // ── PLAN SELECTION ─────────────────────────────────────────────────
  const handleSelectPlan = async (plan) => {
    console.log("📋 Plan selected:", plan.PlanName);

    if (plan.Price === 0) {
      // Free plan - direct activation
      await handleFreeplanActivation(plan);
      return;
    }

    // Paid plan - show payment modal
    setSelectedPlanForPayment(plan);
    setShowPaymentModal(true);
  };

  // ── FREE PLAN ACTIVATION ───────────────────────────────────────────
  const handleFreeplanActivation = async (plan) => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const subPayload = {
        userSubscriptionID: 0,
        userID: userId,
        planID: plan.PlanID,
        planName: plan.PlanName || "",
        remark: plan.Remark || "",
        enterredBy: userId,
        // enterDate: new Date().toISOString(),
        isActive: 1,
      };

      const res = await saveSubscription(subPayload);

      if (res?.status) {
        toast.success("✓ Plan activated successfully");
        setShowPlanSelection(false);
        await refetchSubscriptions();
        // Show detail after free plan activation
        setTimeout(() => {
          setDetailItem(detailItem);
        }, 500);
      } else {
        throw new Error(res?.message || "Failed to activate plan");
      }
    } catch (err) {
      console.error("Free plan activation error:", err);
      setPaymentError(err?.message || "Failed to activate plan");
      toast.error(err?.message || "Failed to activate plan");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ── PAID PLAN: CONFIRM PAYMENT ──────────────────────────────────
  const handleConfirmPayment = async () => {
    const plan = selectedPlanForPayment;
    if (!plan) return;

    console.log("💳 Confirming payment for:", plan.PlanName);
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Step 1: Create inactive subscription
      const subPayload = {
        userSubscriptionID: 0,
        userID: userId,
        planID: plan.PlanID,
        planName: plan.PlanName || "",
        remark: plan.Remark || "",
        enterredBy: userId,
        // enterDate: new Date().toISOString(),
        isActive: 0,
      };

      const subRes = await saveSubscription(subPayload);
      if (!subRes?.status) {
        throw new Error(subRes?.message || "Failed to prepare subscription");
      }

      console.log("✓ Subscription prepared, initiating Razorpay");

      // Step 2: Initiate Razorpay
      if (!window.Razorpay) {
        throw new Error("Payment gateway not loaded");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_TBIngVA6fjYaLH",
        amount: Number(plan.Price || 0) * 100,
        currency: "INR",
        name: "ContractsIndia",
        description: plan.PlanName,
        image: "/logo.png",
        handler: async (response) => {
          console.log(
            "✅ Payment successful, activating subscription",
            response,
          );
          try {
            // Step 3a: Save payment history
            await savePaymentHistory({
              userID: userId,
              TransactionID: response?.razorpay_payment_id ?? "",
              payment: plan.Price ?? 0,
              paymentStatus: "Success",
              paymentMode: "Razorpay",
              remark: plan.PlanName ?? "",
              enterredBy: userId,
              enterDate: new Date().toISOString(),
              TransactionDate: new Date().toISOString(),
              // enterDate: new Date().toISOString(),
              isActive: 1,
            });

            // Step 3b: Activate subscription
            const activatePayload = {
              userSubscriptionID: 0,
              userID: userId,
              planID: plan.PlanID,
              planName: plan.PlanName || "",
              remark: plan.Remark || "",
              enterredBy: userId,
              // enterDate: new Date().toISOString(),
              isActive: 1,
            };

            await saveSubscription(activatePayload);

            // Step 4: Close modals and refresh
            setShowPaymentModal(false);
            setShowPlanSelection(false);
            setSelectedPlanForPayment(null);
            setIsProcessingPayment(false);

            await refetchSubscriptions();

            toast.success("🎉 Payment successful! Your plan is now active.");

            // Auto-show details if item was selected
            if (detailItem) {
              setTimeout(() => {
                setDetailItem(detailItem);
              }, 500);
            }
          } catch (err) {
            console.error("Post-payment error:", err);
            setPaymentError("Payment received but activation failed");
            toast.error(
              "Payment received but activation failed. Please contact support.",
            );
          }
        },
        prefill: {
          name: loginResponce?.userName || "",
          email: loginResponce?.emailId || "",
          contact: loginResponce?.mobileNo || "",
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: () => {
            console.log("❌ Payment cancelled");
            setIsProcessingPayment(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment flow error:", err);
      setPaymentError(err?.message || "Error processing payment");
      toast.error(err?.message || "Error processing payment");
      setIsProcessingPayment(false);
    }
  };

  // ── CLOSE MODALS ───────────────────────────────────────────────────
  const handleClosePlanSelection = () => {
    setShowPlanSelection(false);
    setSelectedPlanForPayment(null);
    setPaymentError(null);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlanForPayment(null);
    setPaymentError(null);
  };

  // ── RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* SIDEBAR */}
          <aside className="sticky top-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <p className="text-sm font-black text-slate-800 truncate">
                  {parentName}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  {totalNodes} categories
                </p>
              </div>
              <div
                className="py-2 px-2 overflow-y-auto"
                style={{
                  maxHeight: "calc(100vh - 160px)",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e2e8f0 transparent",
                }}
              >
                {menuServicesLoading ? (
                  <div className="space-y-2 p-2 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-8 bg-slate-100 rounded-xl" />
                    ))}
                  </div>
                ) : tree.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">
                    No categories
                  </p>
                ) : (
                  tree.map((node) => (
                    <SidebarNode
                      key={node.ServiceID}
                      node={node}
                      depth={0}
                      activeId={activeId}
                      onSelect={handleSelect}
                      expandedIds={expandedIds}
                      toggleExpand={toggleExpand}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Subscription Status */}
            {isLoggedIn && (
              <div className="mt-4">
                <div
                  className={`rounded-2xl border p-4 transition-all ${
                    hasActivePlan
                      ? "border-violet-100 bg-gradient-to-r from-violet-50 via-white to-white"
                      : "border-amber-200 bg-gradient-to-r from-amber-50 via-white to-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-xl ${
                          hasActivePlan ? "bg-[#492a78]/10" : "bg-amber-100"
                        }`}
                      >
                        {hasActivePlan ? (
                          <Crown className="h-5 w-5 text-[#492a78]" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-[12px]   ${
                            hasActivePlan ? "text-slate-500" : "text-amber-600"
                          }`}
                        >
                          {hasActivePlan
                            ? "Active Membership"
                            : "Membership Required"}
                        </p>

                        <p className="text-sm font-bold text-slate-900 truncate">
                          {hasActivePlan
                            ? activeSub?.PlanName
                            : "No Active Plan"}
                        </p>

                        <p className="text-[11px] text-slate-500">
                          {hasActivePlan
                            ? `Expires on ${activeSub?.ExpiryDate}`
                            : "Purchase a plan to unlock premium features"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowPlanSelection(true)}
                      className="shrink-0 rounded-xl bg-[#492a78] px-2 py-2 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#5a3592]"
                    >
                      {hasActivePlan ? "Upgrade" : "Buy Plan"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* MAIN CONTENT */}
          <section className="min-w-0">
            <Breadcrumb
              tree={tree}
              activeId={activeId}
              onSelect={handleSelect}
            />

            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 flex-wrap">
                  {activeNode?.ServiceName ?? "Select a category"}
                  {!contractorsLoading && activeId && (
                    <span className="text-sm font-bold bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded-lg">
                      {contractors.length}
                    </span>
                  )}
                </h2>
              </div>
            </div>

            {/* Contractors Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
            >
              {contractorsLoading ? (
                [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
              ) : (
                <AnimatePresence mode="popLayout">
                  {contractors?.map((item, idx) => (
                    <ContractorCard
                      key={item?.userId ?? idx}
                      item={item}
                      idx={idx}
                      onViewDetails={handleViewDetails}
                      hasActivePlan={hasActivePlan}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            {!contractorsLoading && contractors.length === 0 && activeId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[40px] border border-dashed border-slate-200 py-20 text-center mt-4"
              >
                <Building2 size={40} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">
                  No Specialists Found
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Try a different category
                </p>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!pendingDetailItem}
        variant="info"
        title="View service details"
        message="Are you sure you want to view details for {contractor}?"
        data={{
          contractor:
            pendingDetailItem?.CompanyName ||
            pendingDetailItem?.Name ||
            "this contractor",
        }}
        actionLabel="Yes, View Details"
        cancelLabel="Cancel"
        iconColor="blue"
        onConfirm={handleConfirmViewDetails}
        onCancel={handleCancelViewDetails}
      />

      {/* MODALS */}
      <AnimatePresence mode="wait">
        {/* Plan Selection Modal */}
        {
          // !CheckValidityData?.status &&
          showPlanSelection && (
            <PlanSelectionModal
              key="plan-selection"
              plans={plans}
              onSelectPlan={handleSelectPlan}
              onCancel={handleClosePlanSelection}
              isLoading={isSavingSubscription}
            />
          )
        }

        {/* Payment Modal */}
        {showPaymentModal && selectedPlanForPayment && (
          <PaymentModal
            key="payment"
            plan={selectedPlanForPayment}
            onConfirm={handleConfirmPayment}
            onCancel={handleClosePaymentModal}
            isLoading={isProcessingPayment}
          />
        )}

        {/* Contractor Detail Modal */}
        {detailItem && (
          <ContractorDetailModal
            key="detail"
            item={detailItem}
            onClose={() => setDetailItem(null)}
            canAccess={hasActivePlan}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanySubServices;
