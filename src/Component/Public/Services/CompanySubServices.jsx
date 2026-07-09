/**
 * CompanySubServices
 *
 * Updated Flow:
 * 1. User clicks "View Details"
 * 2. Check if user has active plan
 * 3. If yes → Show contractor details
 * 4. If no → Show SubscriptionPlansFlow modal for payment
 * 5. After successful payment → Show contractor details
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
  LogIn,
  Crown,
  X,
} from "lucide-react";
import {
  ContractorListGet,
  ServiceMenuGet,
  userServicesdetailsGetByparam,
  UserSubscriptionDetailGet,
  planMasterGetById,
  userSubscriptionDetailSave,
  UserPaymentHistorySave,
} from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceStore, useUserStore } from "../../../store/store";
import { CommonModal } from "../../common/CommonModal";
import { ConfirmModal } from "../../common/ConfirmModal";
import { toast } from "sonner";

/* ─── API ─────────────────────────────────────────────────────────────── */
const fetchContractors = async (serviceId) => {
  if (!serviceId) return [];
  return (await userServicesdetailsGetByparam(serviceId)) ?? [];
};

const fetchUserSubscriptions = async (userId) => {
  const response = await UserSubscriptionDetailGet(`userId=${userId}`);
  return response?.data ?? [];
};

const fetchPlans = async (userType) => {
  const res = await planMasterGetById(`userType=${userType}`);
  return res?.data ?? [];
};

/* ─── Tree helpers ─────────────────────────────────────────────────────── */
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

const findNode = (nodes, id) => {
  for (const n of nodes) {
    if (n.ServiceID === id) return n;
    const f = findNode(n.children ?? [], id);
    if (f) return f;
  }
  return null;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.BASE_URL;

const subtreeHasActive = (node, activeId) => {
  if (node.ServiceID === activeId) return true;
  return (node.children ?? []).some((c) => subtreeHasActive(c, activeId));
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

const findFirstLeaf = (node) => {
  if (!node?.children?.length) return node;
  return findFirstLeaf(node.children[0]);
};

/* ─── Depth colour palette ─────────────────────────────────────────────── */
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

/* ─── Fallback images ──────────────────────────────────────────────────── */
const IMGS = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
];

/* ════════════════════════════════════════════════════════════════════════
   RECURSIVE SIDEBAR NODE
   ════════════════════════════════════════════════════════════════════════ */
function Node({ node, depth, activeId, onSelect, expandedIds, toggleExpand }) {
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
              <Node
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

/* ════════════════════════════════════════════════════════════════════════
   BREADCRUMB
   ════════════════════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════════════════
   CONTRACTOR DETAIL MODAL BODY
   ════════════════════════════════════════════════════════════════════════ */
function ContractorDetail({ item }) {
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
    { label: "User Type", value: item?.UserTypeName || "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="bg-slate-50 rounded-xl p-3 border border-slate-100"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
              {label}
            </p>
            <p className="text-sm font-semibold text-slate-800 break-all">
              {value}
            </p>
          </div>
        ))}
      </div>
      {mobile !== "—" && (
        <a
          href={`tel:${mobile}`}
          className="flex w-full items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white"
          style={{ background: "linear-gradient(135deg,#059669,#047857)" }}
        >
          <PhoneCall className="w-4 h-4" /> Call {company}
        </a>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PLAN REQUIRED MODAL
   ════════════════════════════════════════════════════════════════════════ */
function PlanRequiredModal({ onUpgrade, onClose }) {
  return (
    <div className="py-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto">
        <Crown className="w-8 h-8 text-amber-500" />
      </div>
      <div>
        <h3 className="font-black text-slate-900 text-lg">
          Active Plan Required
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          You need an active subscription to view contractor details. Choose a
          plan to continue.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onUpgrade}
          className="flex-1 py-2.5 rounded-2xl font-bold text-sm text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CONTRACTOR CARD
   ════════════════════════════════════════════════════════════════════════ */
function ContractorCard({ item, idx, onViewDetails }) {
  const imgUrl = `${API_URL}/UserDocumentStore/image?userId=${item?.UserID}&documentCategoryId=7&documentSubCategoryId=10`;
  const img = imgUrl || IMGS[idx % IMGS.length];
  const location = item?.CityName || item?.StateName || "India";
  const company = item?.CompanyName || item?.Name || "Contractor";
  const phone = item?.MobileNo || item?.PhoneNo || "";
  const status = item?.Status || "";
  const rating =
    typeof item?.Rating === "number" ? item?.Rating : 4.5 + (idx % 5) * 0.1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.24) }}
      className="group bg-white rounded-3xl border border-slate-200/60 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-36 m-2 rounded-2xl overflow-hidden">
        <img
          src={img}
          alt={company}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = IMGS[idx % IMGS.length];
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
            className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-lg ${status === "Approved" ? "bg-emerald-500/90 text-white" : "bg-amber-400/90 text-white"}`}
          >
            {status}
          </span>
        )}
      </div>
      <div className="px-4 pb-4">
        <h3 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-0.5">
          {company}
        </h3>
        <div className="flex items-center gap-1 text-slate-400 mb-3">
          <MapPin size={10} />
          <span className="text-[10px] truncate">{location}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95"
          >
            View Details
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

/* ─── Card skeleton ────────────────────────────────────────────────────── */
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

/* ════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════ */
const CompanySubServices = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { loginResponce } = useUserStore();
  const isLoggedIn = !!(
    loginResponce?.isLoginSuccessful || loginResponce?.userId
  );

  const userId = loginResponce?.userId || 0;
  const userType = loginResponce?.userType || 0;

  const menuServicesInStore = useServiceStore(
    (state) => state?.allMenuServices ?? state?.allServices ?? [],
  );

  const [activeId, setActiveId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [detailItem, setDetailItem] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPlansFlow, setShowPlansFlow] = useState(false);

  /* ── Fetch service menu ── */
  const { data: menuServicesApi = [], isLoading: menuServicesLoading } =
    useQuery({
      queryKey: ["ServiceMenuGetList"],
      queryFn: ServiceMenuGet,
      enabled: !menuServicesInStore?.length,
      staleTime: 5 * 60 * 1000,
    });

  const allMenuServices = menuServicesInStore?.length
    ? menuServicesInStore
    : menuServicesApi;

  const tree = useMemo(() => {
    if (!allMenuServices?.length) return [];
    const fullTree = buildTree(allMenuServices);
    if (!serviceId) return fullTree;
    const target = findNode(fullTree, Number(serviceId));
    return target ? [target] : [];
  }, [allMenuServices, serviceId]);

  const treeLoading = menuServicesLoading && !menuServicesInStore?.length;
  const totalNodes = useMemo(() => flattenTree(tree)?.length, [tree]);

  /* ── Fetch user subscriptions ── */
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useQuery(
    {
      queryKey: ["userSubscriptions", userId],
      queryFn: () => fetchUserSubscriptions(userId),
      enabled: !!userId && isLoggedIn,
      retry: false,
    },
  );

  const hasActivePlan = subscriptions.some((s) => s.IsActive === 1);

  /* ── Fetch plans ── */
  const { data: plans = [] } = useQuery({
    queryKey: ["planMasterGetById", userType],
    queryFn: () => fetchPlans(userType),
    enabled: !!userType && showPlansFlow,
  });

  /* Auto-select first leaf */
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
    const s = allMenuServices?.find(
      (el) => Number(el.ServiceID ?? el.value) === Number(serviceId),
    );
    return s?.ServiceName || s?.name || "Services";
  }, [allMenuServices, serviceId]);

  /* ── Fetch contractors for selected node ── */
  const { data: contractors = [], isLoading: contractorsLoading } = useQuery({
    queryKey: ["contractors", activeId],
    queryFn: () => fetchContractors(activeId),
    enabled: !!activeId,
    staleTime: 2 * 60 * 1000,
  });

  /* ── Handle View Details ── */
  const handleViewDetails = (item) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!hasActivePlan) {
      setShowPlanModal(true);
      return;
    }

    setDetailItem(item);
  };

  /* ── Handle plan upgrade ── */
  const handleUpgradePlan = () => {
    setShowPlanModal(false);
    setShowPlansFlow(true);
  };

  /* ── Mutations ── */
  const { mutateAsync: saveSubscription } = useMutation({
    mutationFn: userSubscriptionDetailSave,
  });

  const { mutateAsync: savePaymentHistory } = useMutation({
    mutationFn: UserPaymentHistorySave,
  });

  /* ── Handle Select Plan from Flow ── */
  const handleSelectPlan = async (plan) => {
    try {
      // Step 1: Save subscription (inactive)
      const subPayload = {
        userSubscriptionID: 0,
        userID: userId,
        planID: plan.PlanID,
        planName: plan.PlanName || "",
        remark: plan.Remark || "",
        enterredBy: userId,
        enterDate: new Date().toISOString(),
        isActive: 0,
      };

      const subRes = await saveSubscription(subPayload);
      if (!subRes?.status) {
        toast.error(subRes?.message || "Failed to prepare subscription");
        return;
      }

      // Step 2: Trigger Razorpay
      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh the page.");
        return;
      }

      const options = {
        key: "rzp_test_TBIngVA6fjYaLH",
        amount: Number(plan.Price || 0) * 100,
        currency: "INR",
        name: "ContractsIndia",
        description: plan.PlanName,
        image: "/logo.png",
        handler: async function (response) {
          try {
            // Step 3a: Save payment history
            await savePaymentHistory({
              userID: userId,
              payment: plan.Price ?? 0,
              paymentStatus: "Success",
              paymentMode: "Razorpay",
              remark: plan.PlanName ?? "",
              enterredBy: userId,
              enterDate: new Date().toISOString(),
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
              enterDate: new Date().toISOString(),
              isActive: 1,
            };

            await saveSubscription(activatePayload);

            // Step 4: Close modal and refetch
            setShowPlansFlow(false);
            setShowPlanModal(false);
            refetchSubscriptions();
            toast.success("Payment successful! Your plan is now active.");
          } catch (err) {
            console.error("Error after payment:", err);
            toast.error("Payment received but activation failed. Please contact support.");
          }
        },
        prefill: {
          name: loginResponce?.userName || "",
          email: loginResponce?.emailId || "",
          contact: loginResponce?.mobileNo || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Plan selection error:", err);
      toast.error(err?.message || "Error processing plan selection");
    }
  };

  const company = detailItem?.CompanyName || detailItem?.Name || "Contractor";

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* ── SIDEBAR ── */}
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
                {treeLoading ? (
                  <div className="space-y-2 p-2 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-8 bg-slate-100 rounded-xl" />
                    ))}
                  </div>
                ) : tree.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">
                    No categories found
                  </p>
                ) : (
                  tree.map((node) => (
                    <Node
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
          </aside>

          {/* ── CONTENT ── */}
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
                    <span className="text-sm font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg">
                      {contractors.length}
                    </span>
                  )}
                </h2>
              </div>
            </div>

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
                  Try a sub-category or check back later.
                </p>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      {/* ── Plan Required Modal ── */}
      <CommonModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title="Active Plan Required"
        variant="warning"
        size="sm"
        hideFooter
      >
        <PlanRequiredModal
          onUpgrade={handleUpgradePlan}
          onClose={() => setShowPlanModal(false)}
        />
      </CommonModal>

      {/* ── Contractor Detail Modal ── */}
      <CommonModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={company}
        subtitle={detailItem?.ServiceName || "Verified Contractor"}
        variant="info"
        size="md"
        hideFooter
      >
        {detailItem && <ContractorDetail item={detailItem} />}
      </CommonModal>

      {/* ── Plans Flow (Simplified) ── */}
      {showPlansFlow && (
        <PlansFlowModal
          open={showPlansFlow}
          onClose={() => setShowPlansFlow(false)}
          plans={plans}
          userId={userId}
          loginResponce={loginResponce}
          onSelectPlan={handleSelectPlan}
        />
      )}
    </div>
  );
};

/* ── Simple Plans Flow Modal Component ── */
function PlansFlowModal({
  open,
  onClose,
  plans,
  userId,
  loginResponce,
  onSelectPlan,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Choose a Plan
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  No hidden fees. Cancel anytime.
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Plans Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.PlanID}
                    className="rounded-2xl border-2 border-slate-200 p-5 hover:border-blue-300 transition-all"
                  >
                    <h3 className="font-black text-slate-900 mb-2">
                      {plan.PlanName}
                    </h3>
                    <p className="text-3xl font-black text-blue-600 mb-4">
                      ₹{plan.Price}
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      {plan.DurationType}
                    </p>
                    <ul className="space-y-1.5 mb-4 text-xs text-slate-600">
                      <li>✓ Up to {plan.maxNoofServices} services</li>
                      <li>✓ {plan.CreditsIncluded} credits</li>
                      <li>✓ {plan.Remark}</li>
                    </ul>
                    <button
                      onClick={() => {
                        setIsProcessing(true);
                        onSelectPlan(plan);
                      }}
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                      {isProcessing ? "Processing..." : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CompanySubServices;