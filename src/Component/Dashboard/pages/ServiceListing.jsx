import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  FolderTree,
  Activity,
  LayoutGrid,
  ChevronLeft,
  RefreshCw,
  Loader2,
  Pencil,
  Tag,
  AlertCircle,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ServiceMasterDelete,
  ServiceMasterGet,
  ServiceMasterSave,
  ServiceMasterUpdate,
} from "../../../services/api";
import CustomHeading from "../../common/CustomHeading";
import { SERVICES_HIERARCHY } from "../../../data/services_hierarchy";

/* ==========================================================================
   1. API ADAPTERS
   ========================================================================== */
const serviceMasterGetApi = async () => {
  const response = await ServiceMasterGet();
  return response?.data ?? [];
};

const serviceMasterSaveApi = async (payload) =>
  (await ServiceMasterSave({
    serviceID: 0,
    parentServiceID: payload?.parentServiceID ?? 0,
    serviceCode: payload?.serviceCode ?? "",
    serviceName: payload?.serviceName ?? "",
    serviceDescription: payload?.serviceDescription ?? "",
    serviceIcon: payload?.serviceIcon ?? "",
    serviceImage: payload?.serviceImage ?? "",
    metaTitle: payload?.metaTitle ?? "",
    metaKeywords: payload?.metaKeywords ?? "",
    metaDescription: payload?.metaDescription ?? "",
    isFeatured: payload?.isFeatured ?? 0,
    displayOnHomePage: payload?.displayOnHomePage ?? 0,
    displayOrder: payload?.displayOrder ?? 0,
    isActive: payload?.isActive ?? 1,
    createdBy: 0,
    bannerImage: payload?.bannerImage ?? "",
    thumbnailImage: payload?.thumbnailImage ?? "",
    serviceURL: payload?.serviceURL ?? "",
    isPopular: payload?.isPopular ?? 0,
    isVerifiedRequired: payload?.isVerifiedRequired ?? 0,
    minSubscriptionLevel: payload?.minSubscriptionLevel ?? 0,
    searchKeywords: payload?.searchKeywords ?? "",
  })) ?? {};

const serviceMasterUpdateApi = async (payload) =>
  (await ServiceMasterUpdate({
    ServiceID: payload?.ServiceID ?? payload?.serviceID,
    ParentServiceID: payload?.ParentServiceID ?? payload?.parentServiceID ?? 0,
    ServiceCode: payload?.ServiceCode ?? payload?.serviceCode ?? "",
    ServiceName: payload?.ServiceName ?? payload?.serviceName ?? "",
    ServiceDescription:
      payload?.ServiceDescription ?? payload?.serviceDescription ?? "",
    ServiceIcon: payload?.ServiceIcon ?? payload?.serviceIcon ?? "",
    ServiceImage: payload?.ServiceImage ?? payload?.serviceImage ?? "",
    BannerImage: payload?.BannerImage ?? payload?.bannerImage ?? "",
    ThumbnailImage: payload?.ThumbnailImage ?? payload?.thumbnailImage ?? "",
    ServiceURL: payload?.ServiceURL ?? payload?.serviceURL ?? "",
    MetaTitle: payload?.MetaTitle ?? payload?.metaTitle ?? "",
    MetaKeywords: payload?.MetaKeywords ?? payload?.metaKeywords ?? "",
    MetaDescription:
      payload?.MetaDescription ?? payload?.metaDescription ?? "",
    SearchKeywords: payload?.SearchKeywords ?? payload?.searchKeywords ?? "",
    IsFeatured: payload?.IsFeatured ?? payload?.isFeatured ?? 0,
    DisplayOnHomePage:
      payload?.DisplayOnHomePage ?? payload?.displayOnHomePage ?? 0,
    IsPopular: payload?.IsPopular ?? payload?.isPopular ?? 0,
    IsVerifiedRequired:
      payload?.IsVerifiedRequired ?? payload?.isVerifiedRequired ?? 0,
    MinSubscriptionLevel:
      payload?.MinSubscriptionLevel ?? payload?.minSubscriptionLevel ?? 0,
    IsActive: payload?.IsActive ?? payload?.isActive ?? 1,
    DisplayOrder: payload?.DisplayOrder ?? payload?.displayOrder ?? 0,
    UpdatedBy: 0,
    UpdatedDate: new Date().toISOString(),
  })) ?? {};

const serviceMasterDeleteApi = async (serviceId) =>
  (await ServiceMasterDelete(serviceId)) ?? {};

/* ==========================================================================
   2. TREE BUILDER
   ========================================================================== */
const buildTreeFromFlat = (flatList) => {
  if (!Array.isArray(flatList) || !flatList.length) return [];
  const map = {};
  const roots = [];

  flatList.forEach((item) => {
    const id = item.ServiceID ?? item.serviceID;
    const pid = item.ParentServiceID ?? item.parentServiceID ?? 0;
    const name = item.ServiceName ?? item.serviceName ?? "";
    const active = item.IsActive ?? item.isActive;
    const order = item.DisplayOrder ?? item.displayOrder ?? 0;
    const code = item.ServiceCode ?? item.serviceCode ?? "";

    map[id] = {
      id: String(id),       // always string for React keys
      apiId: Number(id),    // ✅ FIX: always number for API calls
      parentApiId: Number(pid),
      name,
      isActive: active === 1 || active === true,
      displayOrder: order,
      serviceCode: code,
      children: [],
      _raw: item,           // preserves original PascalCase keys
    };
  });

  flatList.forEach((item) => {
    const id = item.ServiceID ?? item.serviceID;
    const pid = item.ParentServiceID ?? item.parentServiceID ?? 0;
    const node = map[id];
    if (!pid || pid === 0 || !map[pid]) {
      roots.push(node);
    } else {
      map[pid].children.push(node);
    }
  });

  const sort = (nodes) => {
    nodes.sort((a, b) => a.displayOrder - b.displayOrder);
    nodes.forEach((n) => sort(n.children));
    return nodes;
  };
  return sort(roots);
};

/* ==========================================================================
   3. UTILITIES
   ========================================================================== */
const countTotalNodes = (nodes) => {
  let t = 0;
  nodes.forEach((n) => {
    t++;
    if (n.children?.length) t += countTotalNodes(n.children);
  });
  return t;
};

const gatherAllNodeIds = (nodes, out = []) => {
  nodes.forEach((n) => {
    out.push(n.id);
    if (n.children?.length) gatherAllNodeIds(n.children, out);
  });
  return out;
};

const filterTreeHierarchy = (nodes, term) =>
  nodes
    .map((node) => {
      const self = node.name.toLowerCase().includes(term.toLowerCase());
      const sub = filterTreeHierarchy(node.children || [], term);
      if (self || sub.length)
        return { ...node, children: sub, isSearchHighlight: self };
      return null;
    })
    .filter(Boolean);

const flattenServiceTree = (nodes, parentLabel = "") =>
  nodes.flatMap((node) => {
    const cat = parentLabel || node.name || "General";
    return [
      {
        id: node.id,
        apiId: node.apiId,
        name: node.name,
        category: cat,
        status: node.isActive ? "Active" : "Draft",
      },
      ...(node.children?.length
        ? flattenServiceTree(node.children, node.name)
        : []),
    ];
  });

/* ==========================================================================
   4. MODAL DEFAULTS
   ========================================================================== */
const EMPTY_FORM = {
  serviceName: "",
  serviceCode: "",
  serviceDescription: "",
  serviceURL: "",
  metaTitle: "",
  metaKeywords: "",
  metaDescription: "",
  searchKeywords: "",
  displayOrder: 0,
  isFeatured: 0,
  displayOnHomePage: 0,
  isActive: 1,
  isPopular: 0,
  isVerifiedRequired: 0,
  minSubscriptionLevel: 0,
};

/* ==========================================================================
   5. MODAL HELPERS
   ========================================================================== */
function ModalSection({ label, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ModalField({ label, children, span }) {
  return (
    <div className={span === "full" ? "sm:col-span-2" : ""}>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ==========================================================================
   6. LOCAL DATA CONVERTER
   ========================================================================== */
function convertLocalDataToTree(nodes) {
  return nodes.map((node) => {
    const converted = {
      id: String(node.id),
      apiId: 0,
      parentApiId: 0,
      name: node.name,
      isActive: true,
      displayOrder: 0,
      serviceCode: "",
      _raw: {},
      children: [],
    };
    const kids = node.subServices || node.children || [];
    if (Array.isArray(kids)) {
      converted.children = convertLocalDataToTree(kids);
    }
    return converted;
  });
}

/* ==========================================================================
   7. SERVICE FORM MODAL
   ========================================================================== */
function ServiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  parentName,
  initialData,
  isLoading,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const firstInputRef = useRef(null);

  // ✅ FIX: use initialData.id as dep so effect re-runs when node changes
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData?._raw) {
      const r = initialData._raw;
      // ✅ FIX: Handle both PascalCase (API) and camelCase fallbacks
      setForm({
        serviceName: r.ServiceName ?? r.serviceName ?? "",
        serviceCode: r.ServiceCode ?? r.serviceCode ?? "",
        serviceDescription:
          r.ServiceDescription ?? r.serviceDescription ?? "",
        serviceURL: r.ServiceURL ?? r.serviceURL ?? "",
        metaTitle: r.MetaTitle ?? r.metaTitle ?? "",
        metaKeywords: r.MetaKeywords ?? r.metaKeywords ?? "",
        metaDescription: r.MetaDescription ?? r.metaDescription ?? "",
        searchKeywords: r.SearchKeywords ?? r.searchKeywords ?? "",
        displayOrder: r.DisplayOrder ?? r.displayOrder ?? 0,
        isFeatured: r.IsFeatured ?? r.isFeatured ?? 0,
        displayOnHomePage: r.DisplayOnHomePage ?? r.displayOnHomePage ?? 0,
        isActive: r.IsActive ?? r.isActive ?? 1,
        isPopular: r.IsPopular ?? r.isPopular ?? 0,
        isVerifiedRequired: r.IsVerifiedRequired ?? r.isVerifiedRequired ?? 0,
        minSubscriptionLevel:
          r.MinSubscriptionLevel ?? r.minSubscriptionLevel ?? 0,
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }

    setTimeout(() => firstInputRef.current?.focus(), 80);
    // ✅ FIX: depend on initialData.id not the whole object to avoid infinite loops
  }, [isOpen, mode, initialData?.id]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = () => {
    if (!form.serviceName.trim()) {
      toast.error("Service name is required.");
      return;
    }
    onSubmit(form);
  };

  const modalTitle =
    mode === "addRoot"
      ? "Add Root Service"
      : mode === "addChild"
        ? `Add Child — "${parentName}"`
        : `Edit — "${parentName}"`;

  const accent =
    mode === "addRoot"
      ? "from-violet-600 to-fuchsia-600"
      : mode === "addChild"
        ? "from-sky-500 to-blue-600"
        : "from-amber-500 to-orange-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="md"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200/70">
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${accent} rounded-t-3xl p-5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white">
                      {mode === "edit" ? (
                        <Pencil className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-white">
                        {modalTitle}
                      </h2>
                      {mode === "addChild" && (
                        <p className="text-[11px] text-white/70 mt-0.5">
                          Nested under selected parent
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                <ModalSection
                  label="Basic Information"
                  icon={<Tag className="h-3.5 w-3.5" />}
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ModalField label="Service Name *" span="full">
                      <input
                        ref={firstInputRef}
                        value={form.serviceName}
                        onChange={(e) => set("serviceName", e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSubmit()
                        }
                        placeholder="e.g. EPC Consultancy"
                        className="modal-input"
                      />
                    </ModalField>
                    <ModalField label="Service Code">
                      <input
                        value={form.serviceCode}
                        onChange={(e) => set("serviceCode", e.target.value)}
                        placeholder="e.g. EPC-001"
                        className="modal-input"
                      />
                    </ModalField>
                    <ModalField label="Display Order">
                      <input
                        type="number"
                        value={form.displayOrder}
                        onChange={(e) =>
                          set("displayOrder", Number(e.target.value))
                        }
                        className="modal-input"
                      />
                    </ModalField>
                  </div>
                  <ModalField label="Description">
                    <textarea
                      value={form.serviceDescription}
                      onChange={(e) =>
                        set("serviceDescription", e.target.value)
                      }
                      rows={2}
                      placeholder="Short description..."
                      className="modal-input resize-none"
                    />
                  </ModalField>
                </ModalSection>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r ${accent} px-5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-60`}
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : mode === "edit" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {mode === "edit" ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </div>
          </motion.div>
          <style>{`.modal-input{width:100%;border-radius:10px;border:1px solid #e2e8f0;background:#f8fafc;padding:7px 12px;font-size:12px;color:#0f172a;outline:none;transition:border-color .15s,background .15s}.modal-input:focus{border-color:#a78bfa;background:#fff}`}</style>
        </>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================================
   8. DELETE CONFIRM MODAL
   ========================================================================== */
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  nodeName,
  isLoading,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="dbd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="dmd"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-slate-200/70 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">
                    Delete Service
                  </h2>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-600">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-900">
                    "{nodeName}"
                  </span>
                  ? All child services will also be removed.
                </p>
              </div>
              <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================================
   9. DEPTH COLOR PALETTE
   ========================================================================== */
const DEPTH_COLORS = [
  {
    dot: "bg-violet-500",
    line: "#8b5cf6",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    dot: "bg-sky-500",
    line: "#0ea5e9",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    dot: "bg-emerald-500",
    line: "#22c55e",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    dot: "bg-amber-500",
    line: "#f59e0b",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    dot: "bg-rose-500",
    line: "#f43f5e",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
];
const dc = (depth) => DEPTH_COLORS[depth % DEPTH_COLORS.length];

/* ==========================================================================
   10. TREE NODE  — defined OUTSIDE main component to prevent recreation
   ========================================================================== */
const TreeNode = ({
  node,
  depth,
  expandedNodeIds,
  setExpandedNodeIds,
  pendingApiNodeId,
  dashboardMode,
  useLocalData,
  onEdit,
  onAddChild,
  onDelete,
  onToggleActive,
}) => {
  const isExpanded = expandedNodeIds.includes(node.id);
  const hasChildren = node.children?.length > 0;
  const isNodePending = pendingApiNodeId === node.id;
  const color = dc(depth);

  const toggleExpand = useCallback(() => {
    setExpandedNodeIds((p) =>
      p.includes(node.id)
        ? p.filter((x) => x !== node.id)
        : [...p, node.id]
    );
  }, [node.id, setExpandedNodeIds]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -6 }}
      transition={{ duration: 0.18 }}
      className="relative"
    >
      {/* vertical guide line */}
      {depth > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${depth * 24 - 12}px`,
            background: `${color.line}30`,
          }}
        />
      )}
      {/* horizontal connector */}
      {depth > 0 && (
        <div
          className="absolute top-[22px] h-px w-3"
          style={{
            left: `${depth * 24 - 12}px`,
            background: `${color.line}50`,
          }}
        />
      )}

      {/* NODE ROW */}
      <div
        className={`
          group relative flex items-center gap-3 rounded-2xl border
          border-slate-200 bg-white px-4 py-3 mb-2 shadow-sm transition-all
          hover:shadow-md hover:border-violet-200 hover:bg-violet-50/30
          cursor-pointer
          ${node.isSearchHighlight ? "ring-2 ring-violet-300" : ""}
          ${isNodePending ? "pointer-events-none opacity-60" : ""}
        `}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        {/* pending overlay */}
        {isNodePending && (
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-white/70 z-10">
            <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
          </div>
        )}

        {/* expand / leaf toggle */}
        <button
          onClick={toggleExpand}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors
            ${hasChildren
              ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              : "cursor-default"
            }`}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )
          ) : (
            <div
              className={`h-1.5 w-1.5 rounded-full ${color.dot} opacity-60`}
            />
          )}
        </button>

        {/* depth dot */}
        <div className={`h-2 w-2 rounded-full shrink-0 ${color.dot}`} />

        {/* name */}
        <span
          className={`flex-1 min-w-0 text-sm font-semibold text-slate-800 truncate
            ${node.isSearchHighlight ? "text-violet-800" : ""}`}
        >
          {node.name}
        </span>

        {/* badges */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color.badge}`}
          >
            L{depth + 1}
          </span>
          {node.serviceCode && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
              {node.serviceCode}
            </span>
          )}
          {/* ✅ FIX: only show ID when it's a real API id (not 0) */}
          {node.apiId > 0 && (
            <span className="text-[10px] text-slate-300 font-mono">
              #{node.apiId}
            </span>
          )}
        </div>

        {/* child count */}
        {hasChildren && !isExpanded && (
          <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
            {node.children.length} sub
          </span>
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {!dashboardMode && !useLocalData ? (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(node); }}
                title="Edit"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onAddChild(node); }}
                title="Add child"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
              {/* <button
                onClick={(e) => { e.stopPropagation(); onDelete(node); }}
                title="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button> */}
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleActive(node); }}
              className={`px-3 h-8 rounded-xl text-xs font-bold transition-all ${node.isActive
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
            >
              {node.isActive ? "Active" : "Inactive"}
            </button>
          )}
        </div>
      </div>

      {/* children */}
      {isExpanded && hasChildren && (
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                expandedNodeIds={expandedNodeIds}
                setExpandedNodeIds={setExpandedNodeIds}
                pendingApiNodeId={pendingApiNodeId}
                dashboardMode={dashboardMode}
                useLocalData={useLocalData}
                onEdit={onEdit}
                onAddChild={onAddChild}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

/* ==========================================================================
   11. CORE COMPONENT
   ========================================================================== */
const ServiceListing = ({
  onSave,
  onBack,
  showSaveButton = false,
  dashboardMode = false,
}) => {
  const [expandedNodeIds, setExpandedNodeIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingApiNodeId, setPendingApiNodeId] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    mode: "addRoot",
    targetNode: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    targetNode: null,
  });
  // ✅ local data toggle (kept but UI hidden per original comments)
  const [useLocalData] = useState(false);

  const closeModal = useCallback(
    () => setModal({ open: false, mode: "addRoot", targetNode: null }),
    []
  );
  const openAddRoot = useCallback(
    () => setModal({ open: true, mode: "addRoot", targetNode: null }),
    []
  );
  const openAddChild = useCallback(
    (n) => setModal({ open: true, mode: "addChild", targetNode: n }),
    []
  );
  const openEdit = useCallback(
    (n) => setModal({ open: true, mode: "edit", targetNode: n }),
    []
  );
  const openDelete = useCallback(
    (n) => setDeleteModal({ open: true, targetNode: n }),
    []
  );
  const closeDelete = useCallback(
    () => setDeleteModal({ open: false, targetNode: null }),
    []
  );

  /* ── Fetch ── */
  const {
    data: apiServicesList,
    isLoading: isLoadingServices,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ["serviceMasterList"],
    queryFn: serviceMasterGetApi,
    retry: 2,
    enabled: !useLocalData,
  });

  /* ── Build tree ── */
  const services = useMemo(() => {
    if (useLocalData) {
      if (!Array.isArray(SERVICES_HIERARCHY) || !SERVICES_HIERARCHY.length)
        return [];
      const isFlat = SERVICES_HIERARCHY[0]?.serviceID !== undefined;
      if (isFlat) return buildTreeFromFlat(SERVICES_HIERARCHY);
      return convertLocalDataToTree(SERVICES_HIERARCHY);
    }
    if (!apiServicesList) return [];
    let list = apiServicesList;
    if (typeof list === "string") {
      try {
        list = JSON.parse(list);
      } catch {
        return [];
      }
    }
    if (!Array.isArray(list)) return [];
    return buildTreeFromFlat(list);
  }, [apiServicesList, useLocalData]);

  const activeNodeIds = useMemo(() => {
    const collect = (n) => [
      ...(n.isActive ? [n.id] : []),
      ...(n.children || []).flatMap(collect),
    ];
    return services.flatMap(collect);
  }, [services]);

  /* ── Mutations ── */
  const { mutate: saveServiceMutate, isPending: isSaving } = useMutation({
    mutationFn: serviceMasterSaveApi,
    onSuccess: (r) => {
      if (!r?.status) { toast.error(r?.message || "Failed."); return; }
      toast.success(r?.message || "Created.");
      setPendingApiNodeId(null);
      closeModal();
      refetch();
    },
    onError: (e) => {
      toast.error(e?.message || "Unable to save.");
      setPendingApiNodeId(null);
    },
  });

  const { mutate: updateServiceMutate, isPending: isUpdating } = useMutation({
    mutationFn: serviceMasterUpdateApi,
    onSuccess: (r) => {
      if (!r?.status) { toast.error(r?.message || "Failed."); return; }
      toast.success(r?.message || "Updated.");
      setPendingApiNodeId(null);
      closeModal();
      refetch();
    },
    onError: (e) => {
      toast.error(e?.message || "Unable to update.");
      setPendingApiNodeId(null);
    },
  });

  const { mutate: deleteServiceMutate, isPending: isDeleting } = useMutation({
    mutationFn: serviceMasterDeleteApi,
    onSuccess: (r) => {
      if (!r?.status) { toast.error(r?.message || "Failed."); return; }
      toast.success(r?.message || "Deleted.");
      setPendingApiNodeId(null);
      closeDelete();
      refetch();
    },
    onError: (e) => {
      toast.error(e?.message || "Unable to delete.");
      setPendingApiNodeId(null);
    },
  });

  /* ── Search ── */
  const handleSearchChange = useCallback(
    (e) => {
      const v = e.target.value;
      setSearchQuery(v);
      if (v.trim()) {
        const ids = gatherAllNodeIds(filterTreeHierarchy(services, v));
        if (ids.length)
          setExpandedNodeIds((p) => Array.from(new Set([...p, ...ids])));
      }
    },
    [services]
  );

  /* ── Toggle Active ── */
  const toggleActivationState = useCallback(
    (node) => {
      if (useLocalData) {
        toast.info("Switch to Live API to edit services.");
        return;
      }
      setPendingApiNodeId(node.id);
      updateServiceMutate({
        ...node._raw,
        ServiceID: node.apiId,
        IsActive: node.isActive ? 0 : 1,
        UpdatedDate: new Date().toISOString(),
      });
    },
    [useLocalData, updateServiceMutate]
  );

  /* ── Modal submit ── */
  const handleModalSubmit = useCallback(
    (formData) => {
      const { mode, targetNode } = modal;
      if (mode === "addRoot") {
        // ✅ FIX: don't set pendingApiNodeId for root — no node row exists yet
        saveServiceMutate({
          ...formData,
          parentServiceID: 0,
          displayOrder: services.length + 1,
        });
        return;
      }
      if (mode === "addChild") {
        setPendingApiNodeId(targetNode.id);
        saveServiceMutate({
          ...formData,
          parentServiceID: targetNode.apiId,
          displayOrder: (targetNode.children?.length ?? 0) + 1,
        });
        setExpandedNodeIds((p) =>
          Array.from(new Set([...p, targetNode.id]))
        );
        return;
      }
      if (mode === "edit") {

        setPendingApiNodeId(targetNode.id);
        const payload =
        {
          ...targetNode._raw,
          // ✅ spread camelCase form fields, then ensure PascalCase IDs win
          ServiceName: formData.serviceName,
          ServiceCode: formData.serviceCode,
          ServiceDescription: formData.serviceDescription,
          ServiceURL: formData.serviceURL,
          MetaTitle: formData.metaTitle,
          MetaKeywords: formData.metaKeywords,
          MetaDescription: formData.metaDescription,
          SearchKeywords: formData.searchKeywords,
          displayOrder: formData.displayOrder,
          IsFeatured: formData.isFeatured,
          DisplayOnHomePage: formData.displayOnHomePage,
          IsActive: formData.isActive,
          IsPopular: formData.isPopular,
          IsVerifiedRequired: formData.isVerifiedRequired,
          MinSubscriptionLevel: formData.minSubscriptionLevel,
          ServiceID: targetNode.apiId,
          UpdatedDate: new Date().toISOString(),
        }
        console.log(payload, "formData");

        updateServiceMutate(payload);
      }
    },
    [modal, services.length, saveServiceMutate, updateServiceMutate]
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteModal.targetNode) return;
    setPendingApiNodeId(deleteModal.targetNode.id);
    deleteServiceMutate(deleteModal.targetNode.apiId);
  }, [deleteModal.targetNode, deleteServiceMutate]);

  /* ── Derived ── */
  const totalAvailableMetrics = useMemo(
    () => countTotalNodes(services),
    [services]
  );

  const processedDataTree = useMemo(
    () =>
      searchQuery.trim()
        ? filterTreeHierarchy(services, searchQuery)
        : services,
    [searchQuery, services]
  );

  const handleSave = useCallback(
    () => onSave?.(flattenServiceTree(services)),
    [onSave, services]
  );

  const showLoading = !useLocalData && isLoadingServices;

  /* ── Tree renderer ── */
  const renderRecursiveTree = (nodes, depth = 0) => (
    <AnimatePresence mode="popLayout">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={depth}
          expandedNodeIds={expandedNodeIds}
          setExpandedNodeIds={setExpandedNodeIds}
          pendingApiNodeId={pendingApiNodeId}
          dashboardMode={dashboardMode}
          useLocalData={useLocalData}
          onEdit={openEdit}
          onAddChild={openAddChild}
          onDelete={openDelete}
          onToggleActive={toggleActivationState}
        />
      ))}
    </AnimatePresence>
  );

  /* ==========================================================================
     12. RENDER
     ========================================================================== */
  return (
    <>
      <ServiceFormModal
        isOpen={modal.open}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        mode={modal.mode}
        parentName={modal.targetNode?.name ?? ""}
        initialData={modal.targetNode}
        isLoading={isSaving || isUpdating}
      />
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        nodeName={deleteModal.targetNode?.name ?? ""}
        isLoading={isDeleting}
      />

      <div className="min-h-screen bg-slate-50/80 p-3 sm:p-5">
        <div className="mx-auto max-w-1xl space-y-4">

          {/* PAGE HEADING */}
          <CustomHeading
            title="Service Listing"
            subtitle="Manage the full hierarchy of marketplace service categories."
            icon={Layers}
            badge={showLoading ? undefined : `${totalAvailableMetrics} services`}
            badgeColor="violet"
            variant="default"
            size="md"
            actions={
              !dashboardMode && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => refetch()}
                    disabled={showLoading}
                    title="Refresh from API"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${showLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => setExpandedNodeIds([])}
                    className="h-8 px-3 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Collapse All
                  </button>
                  <button
                    onClick={openAddRoot}
                    // ✅ FIX: only disable when a root-level save is in progress
                    disabled={isSaving && modal.mode === "addRoot"}
                    className="flex h-8 items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-3 text-[11px] font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSaving && modal.mode === "addRoot" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Add Root
                  </button>
                </div>
              )
            }
          />

          {/* search + stats */}
          {!dashboardMode && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search services..."
                  className="h-8 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-xs font-medium outline-none transition-all focus:border-violet-400 shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-600">
                  <FolderTree className="h-3.5 w-3.5 text-violet-500" />
                  {showLoading ? "…" : totalAvailableMetrics} total
                </div>
                <div className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-700">
                  <Activity className="h-3.5 w-3.5" />
                  {activeNodeIds.length} active
                </div>
              </div>
            </div>
          )}

          {/* error banner */}
          {!useLocalData && fetchError && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                <strong>Failed to load services.</strong> {fetchError?.message}
              </span>
              <button
                onClick={() => refetch()}
                className="ml-auto text-xs font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* TREE PANEL */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-violet-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Service Hierarchy
                </span>
              </div>
              {/* <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-violet-400" /> L1
                <span className="w-2 h-2 rounded-full bg-sky-400 ml-2" /> L2
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-2" /> L3
                <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> L4+
              </div> */}
            </div>

            <div className="p-3">
              {showLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
                  <p className="text-xs text-slate-400 font-medium">
                    Loading services…
                  </p>
                </div>
              ) : processedDataTree.length > 0 ? (
                <div>{renderRecursiveTree(processedDataTree)}</div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    {fetchError ? "Could not load services" : "No services found"}
                  </p>
                  {!fetchError && (
                    <p className="text-[11px] text-slate-400">
                      Click "Add Root" to create your first service.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* back / save */}
          {(onSave || showSaveButton || onBack) && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1 h-9 px-5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {onSave && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1 h-9 px-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow text-white font-bold text-xs hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  Save & Continue <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceListing;