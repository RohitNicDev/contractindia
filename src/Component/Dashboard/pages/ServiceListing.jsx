import { useMemo, useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Briefcase,
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
  Link,
  Hash,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ServiceMasterDelete,
  ServiceMasterGet,
  ServiceMasterSave,
  ServiceMasterUpdate,
} from "../../../services/api";

/* ==========================================================================
   1. API ADAPTER FUNCTIONS
   ========================================================================== */

const serviceMasterGetApi = async () => {
  const response = await ServiceMasterGet();
  return response ?? [];
};

const serviceMasterSaveApi = async (payload) => {
  const response = await ServiceMasterSave({
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
    createdDate: new Date().toISOString(),
    updatedBy: 0,
    updatedDate: new Date().toISOString(),
    bannerImage: payload?.bannerImage ?? "",
    thumbnailImage: payload?.thumbnailImage ?? "",
    serviceURL: payload?.serviceURL ?? "",
    isPopular: payload?.isPopular ?? 0,
    isVerifiedRequired: payload?.isVerifiedRequired ?? 0,
    minSubscriptionLevel: payload?.minSubscriptionLevel ?? 0,
    searchKeywords: payload?.searchKeywords ?? "",
  });
  return response ?? {};
};

const serviceMasterUpdateApi = async (payload) => {
  const response = await ServiceMasterUpdate({
    serviceID: payload?.serviceID,
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
    updatedBy: 0,
    updatedDate: new Date().toISOString(),
    bannerImage: payload?.bannerImage ?? "",
    thumbnailImage: payload?.thumbnailImage ?? "",
    serviceURL: payload?.serviceURL ?? "",
    isPopular: payload?.isPopular ?? 0,
    isVerifiedRequired: payload?.isVerifiedRequired ?? 0,
    minSubscriptionLevel: payload?.minSubscriptionLevel ?? 0,
    searchKeywords: payload?.searchKeywords ?? "",
  });
  return response ?? {};
};

const serviceMasterDeleteApi = async (serviceId) => {
  const response = await ServiceMasterDelete(serviceId);
  return response ?? {};
};

/* ==========================================================================
   2. TREE BUILDER — flat API list → nested tree
   ========================================================================== */

const buildTreeFromFlat = (flatList) => {
  if (!Array.isArray(flatList) || flatList.length === 0) return [];
  const map = {};
  const roots = [];

  flatList.forEach((item) => {
    map[item.serviceID] = {
      id: String(item.serviceID),
      apiId: item.serviceID,
      parentApiId: item.parentServiceID ?? 0,
      name: item.serviceName,
      isActive: item.isActive === 1 || item.isActive === true,
      displayOrder: item.displayOrder ?? 0,
      serviceCode: item.serviceCode ?? "",
      children: [],
      _raw: item,
    };
  });

  flatList.forEach((item) => {
    const node = map[item.serviceID];
    const parentId = item.parentServiceID;
    if (!parentId || parentId === 0 || !map[parentId]) {
      roots.push(node);
    } else {
      map[parentId].children.push(node);
    }
  });

  const sortByOrder = (nodes) => {
    nodes.sort((a, b) => a.displayOrder - b.displayOrder);
    nodes.forEach((n) => sortByOrder(n.children));
    return nodes;
  };
  return sortByOrder(roots);
};

/* ==========================================================================
   3. UTILITIES
   ========================================================================== */

const countTotalNodes = (nodes) => {
  let tally = 0;
  nodes.forEach((n) => {
    tally++;
    if (n.children?.length) tally += countTotalNodes(n.children);
  });
  return tally;
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
      const isSelfMatch = node.name.toLowerCase().includes(term.toLowerCase());
      const filteredSubTree = filterTreeHierarchy(node.children || [], term);
      if (isSelfMatch || filteredSubTree.length > 0)
        return { ...node, children: filteredSubTree, isSearchHighlight: isSelfMatch };
      return null;
    })
    .filter(Boolean);

/* ==========================================================================
   4. MODAL FORM DEFAULT STATE
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
   5. SERVICE FORM MODAL
   ========================================================================== */

function ServiceFormModal({ isOpen, onClose, onSubmit, mode, parentName, initialData, isLoading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && initialData?._raw) {
      const r = initialData._raw;
      setForm({
        serviceName: r.serviceName ?? "",
        serviceCode: r.serviceCode ?? "",
        serviceDescription: r.serviceDescription ?? "",
        serviceURL: r.serviceURL ?? "",
        metaTitle: r.metaTitle ?? "",
        metaKeywords: r.metaKeywords ?? "",
        metaDescription: r.metaDescription ?? "",
        searchKeywords: r.searchKeywords ?? "",
        displayOrder: r.displayOrder ?? 0,
        isFeatured: r.isFeatured ?? 0,
        displayOnHomePage: r.displayOnHomePage ?? 0,
        isActive: r.isActive ?? 1,
        isPopular: r.isPopular ?? 0,
        isVerifiedRequired: r.isVerifiedRequired ?? 0,
        minSubscriptionLevel: r.minSubscriptionLevel ?? 0,
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setTimeout(() => firstInputRef.current?.focus(), 80);
  }, [isOpen, mode, initialData]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

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
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200/70">
              {/* Header */}
              <div className={`bg-gradient-to-r ${accent} rounded-t-3xl p-5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white">
                      {mode === "edit" ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-white">{modalTitle}</h2>
                      {mode === "addChild" && (
                        <p className="text-[11px] text-white/70 mt-0.5">Will be nested under selected parent</p>
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
                {/* Basic Info */}
                <ModalSection label="Basic Information" icon={<Tag className="h-3.5 w-3.5" />}>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ModalField label="Service Name *" span="full">
                      <input
                        ref={firstInputRef}
                        value={form.serviceName}
                        onChange={(e) => set("serviceName", e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
                        onChange={(e) => set("displayOrder", Number(e.target.value))}
                        className="modal-input"
                      />
                    </ModalField>
                  </div>
                  <ModalField label="Description">
                    <textarea
                      value={form.serviceDescription}
                      onChange={(e) => set("serviceDescription", e.target.value)}
                      rows={2}
                      placeholder="Short description..."
                      className="modal-input resize-none"
                    />
                  </ModalField>
                </ModalSection>

                {/* Flags */}
                <ModalSection label="Display Flags" icon={<Eye className="h-3.5 w-3.5" />}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                      { key: "isActive", label: "Active" },
                      { key: "isFeatured", label: "Featured" },
                      { key: "displayOnHomePage", label: "On Homepage" },
                      { key: "isPopular", label: "Popular" },
                      { key: "isVerifiedRequired", label: "Verified Required" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                          form[key]
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!form[key]}
                          onChange={(e) => set(key, e.target.checked ? 1 : 0)}
                          className="sr-only"
                        />
                        <div
                          className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center transition-all ${
                            form[key] ? "border-emerald-400 bg-emerald-400" : "border-slate-300 bg-white"
                          }`}
                        >
                          {!!form[key] && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        {label}
                      </label>
                    ))}
                  </div>
                </ModalSection>

                {/* URLs */}
                <ModalSection label="Links & URLs" icon={<Link className="h-3.5 w-3.5" />}>
                  <ModalField label="Service URL">
                    <input
                      value={form.serviceURL}
                      onChange={(e) => set("serviceURL", e.target.value)}
                      placeholder="https://..."
                      className="modal-input"
                    />
                  </ModalField>
                </ModalSection>

                {/* SEO */}
                <ModalSection label="SEO Metadata" icon={<Hash className="h-3.5 w-3.5" />}>
                  <div className="space-y-3">
                    <ModalField label="Meta Title">
                      <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Page title for SEO" className="modal-input" />
                    </ModalField>
                    <ModalField label="Meta Keywords">
                      <input value={form.metaKeywords} onChange={(e) => set("metaKeywords", e.target.value)} placeholder="keyword1, keyword2..." className="modal-input" />
                    </ModalField>
                    <ModalField label="Meta Description">
                      <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} placeholder="Brief SEO description" className="modal-input resize-none" />
                    </ModalField>
                    <ModalField label="Search Keywords">
                      <input value={form.searchKeywords} onChange={(e) => set("searchKeywords", e.target.value)} placeholder="Internal search tags..." className="modal-input" />
                    </ModalField>
                  </div>
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

          <style>{`
            .modal-input {
              width: 100%;
              border-radius: 10px;
              border: 1px solid #e2e8f0;
              background: #f8fafc;
              padding: 7px 12px;
              font-size: 12px;
              color: #0f172a;
              outline: none;
              transition: border-color 0.15s, background 0.15s;
            }
            .modal-input:focus {
              border-color: #a78bfa;
              background: #fff;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalSection({ label, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ModalField({ label, children, span }) {
  return (
    <div className={span === "full" ? "sm:col-span-2" : ""}>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

/* ==========================================================================
   6. DELETE CONFIRM MODAL
   ========================================================================== */

function DeleteConfirmModal({ isOpen, onClose, onConfirm, nodeName, isLoading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="del-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="del-modal"
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
                  <h2 className="text-sm font-extrabold text-white">Delete Service</h2>
                  <p className="text-[11px] text-white/70 mt-0.5">This action cannot be undone</p>
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
                  <span className="font-bold text-slate-900">"{nodeName}"</span>?
                  All child services will also be removed.
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
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
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
   7. LEVEL STYLES
   ========================================================================== */

const LEVEL_STYLES = [
  { border: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  { border: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
  { border: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  { border: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
];

const getNodeStyle = (depth, highlight) => {
  const style = LEVEL_STYLES[depth % LEVEL_STYLES.length];
  return {
    marginLeft: `${depth * 28}px`,
    borderColor: highlight ? "#c084fc" : style.border,
    background: highlight ? "rgba(199,88,253,0.09)" : style.bg,
    boxShadow: highlight
      ? "0 16px 40px rgba(124,58,237,0.14)"
      : "0 12px 32px rgba(15,23,42,0.05)",
  };
};

/* ==========================================================================
   8. CORE COMPONENT
   ========================================================================== */

export default function ServiceListing({
  onSave,
  onBack,
  showSaveButton = false,
  dashboardMode = false,
}) {
  const [expandedNodeIds, setExpandedNodeIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingApiNodeId, setPendingApiNodeId] = useState(null);

  /* ---- Modal state ---- */
  const [modal, setModal] = useState({ open: false, mode: "addRoot", targetNode: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, targetNode: null });

  const closeModal = () => setModal({ open: false, mode: "addRoot", targetNode: null });
  const openAddRoot = () => setModal({ open: true, mode: "addRoot", targetNode: null });
  const openAddChild = (node) => setModal({ open: true, mode: "addChild", targetNode: node });
  const openEdit = (node) => setModal({ open: true, mode: "edit", targetNode: node });
  const openDelete = (node) => setDeleteModal({ open: true, targetNode: node });
  const closeDelete = () => setDeleteModal({ open: false, targetNode: null });

  /* ---- React Query: fetch ---- */
  const {
    data: apiServicesList,
    isLoading: isLoadingServices,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ["serviceMasterList"],
    queryFn: serviceMasterGetApi,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  /* ---- Build tree from flat API list ---- */
  const services = useMemo(() => {
    if (!apiServicesList) return [];
    let list = apiServicesList;
    if (typeof list === "string") {
      try { list = JSON.parse(list); } catch { return []; }
    }
    if (!Array.isArray(list)) return [];
    return buildTreeFromFlat(list);
  }, [apiServicesList]);

  /* ---- Derive active IDs directly from API isActive flag ---- */
  const activeNodeIds = useMemo(() => {
    const collect = (node) => {
      const ids = node.isActive ? [node.id] : [];
      return [...ids, ...(node.children || []).flatMap(collect)];
    };
    return services.flatMap(collect);
  }, [services]);

  /* ---- Mutations ---- */
  const { mutate: saveServiceMutate, isPending: isSaving } = useMutation({
    mutationFn: serviceMasterSaveApi,
    onSuccess: (response) => {
      if (!response?.status) { toast.error(response?.message || "Failed to save service."); return; }
      toast.success(response?.message || "Service created successfully.");
      setPendingApiNodeId(null);
      closeModal();
      refetch();
    },
    onError: (err) => { toast.error(err?.message || "Unable to save service."); setPendingApiNodeId(null); },
  });

  const { mutate: updateServiceMutate, isPending: isUpdating } = useMutation({
    mutationFn: serviceMasterUpdateApi,
    onSuccess: (response) => {
      if (!response?.status) { toast.error(response?.message || "Failed to update service."); return; }
      toast.success(response?.message || "Service updated successfully.");
      setPendingApiNodeId(null);
      closeModal();
      refetch();
    },
    onError: (err) => { toast.error(err?.message || "Unable to update service."); setPendingApiNodeId(null); },
  });

  const { mutate: deleteServiceMutate, isPending: isDeleting } = useMutation({
    mutationFn: serviceMasterDeleteApi,
    onSuccess: (response) => {
      if (!response?.status) { toast.error(response?.message || "Failed to delete service."); return; }
      toast.success(response?.message || "Service deleted successfully.");
      setPendingApiNodeId(null);
      closeDelete();
      refetch();
    },
    onError: (err) => { toast.error(err?.message || "Unable to delete service."); setPendingApiNodeId(null); },
  });

  /* ---- Search ---- */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      const matched = filterTreeHierarchy(services, value);
      const ids = gatherAllNodeIds(matched);
      if (ids.length) setExpandedNodeIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  /* ---- Toggle Active ---- */
  const toggleActivationState = (node) => {
    setPendingApiNodeId(node.id);
    updateServiceMutate({
      ...node._raw,
      serviceID: node.apiId,
      isActive: node.isActive ? 0 : 1,
      updatedDate: new Date().toISOString(),
    });
  };

  /* ---- Modal submit ---- */
  const handleModalSubmit = (formData) => {
    const { mode, targetNode } = modal;

    if (mode === "addRoot") {
      saveServiceMutate({
        ...formData,
        parentServiceID: 0,
        displayOrder: services.length + 1,
      });
    }

    if (mode === "addChild") {
      setPendingApiNodeId(targetNode.id);
      saveServiceMutate({
        ...formData,
        parentServiceID: targetNode.apiId,
        displayOrder: (targetNode.children?.length ?? 0) + 1,
      });
      setExpandedNodeIds((prev) =>
        Array.from(new Set([...prev, targetNode.id]))
      );
    }

    if (mode === "edit") {
      setPendingApiNodeId(targetNode.id);
      updateServiceMutate({
        ...targetNode._raw,
        ...formData,
        serviceID: targetNode.apiId,
        updatedDate: new Date().toISOString(),
      });
    }
  };

  /* ---- Confirm delete ---- */
  const handleConfirmDelete = () => {
    if (!deleteModal.targetNode) return;
    setPendingApiNodeId(deleteModal.targetNode.id);
    deleteServiceMutate(deleteModal.targetNode.apiId);
  };

  /* ---- Metrics ---- */
  const totalAvailableMetrics = useMemo(() => countTotalNodes(services), [services]);

  const processedDataTree = useMemo(() => {
    if (!searchQuery.trim()) return services;
    return filterTreeHierarchy(services, searchQuery);
  }, [searchQuery, services]);

  /* ---- onSave payload ---- */
  const flattenServiceTree = (nodes, parentLabel = "") =>
    nodes.flatMap((node) => {
      const category = parentLabel || node.name || "General";
      return [
        { id: node.id, apiId: node.apiId, name: node.name, category, status: node.isActive ? "Active" : "Draft" },
        ...(node.children?.length ? flattenServiceTree(node.children, node.name) : []),
      ];
    });

  const handleSave = () => onSave?.(flattenServiceTree(services));

  /* ==========================================================================
     9. RECURSIVE TREE RENDERER
     ========================================================================== */
  const renderRecursiveTree = (nodes, depth = 0) => (
    <AnimatePresence mode="popLayout">
      {nodes.map((node) => {
        const isExpanded = expandedNodeIds.includes(node.id);
        const hasChildren = node.children && node.children.length > 0;
        const nodeStyle = getNodeStyle(depth, node.isSearchHighlight);
        const isNodePending = pendingApiNodeId === node.id;

        return (
          <motion.div
            key={node.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative"
          >
            {depth > 0 && (
              <div
                className="absolute bottom-0 top-0 border-l-2 border-dashed"
                style={{ left: `${depth * 28 - 14}px`, borderColor: nodeStyle.borderColor }}
              />
            )}

            <div
              className="group relative mb-3 overflow-hidden rounded-3xl border p-3 transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md"
              style={nodeStyle}
            >
              {/* Pending overlay */}
              {isNodePending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                </div>
              )}

              <div className="flex flex-1 items-center gap-2.5">
                {/* Expand toggle */}
                <button
                  onClick={() =>
                    setExpandedNodeIds((prev) =>
                      prev.includes(node.id) ? prev.filter((x) => x !== node.id) : [...prev, node.id],
                    )
                  }
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-slate-600 ${
                    hasChildren
                      ? "bg-slate-50 border-slate-200"
                      : "bg-transparent border-transparent text-slate-300"
                  }`}
                >
                  {hasChildren ? (
                    isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  )}
                </button>

                {/* Name + badges */}
                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 sm:text-base truncate">
                    {node.name}
                  </h4>
                  <span className="shrink-0 rounded-full bg-slate-100/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Level {depth + 1}
                  </span>
                  <span className="shrink-0 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
                    #{node.apiId}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActivationState(node)}
                    disabled={isNodePending}
                    className={`h-6 rounded-full border px-2.5 text-[10px] font-bold transition-all disabled:opacity-50 ${
                      node.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {node.isActive ? "Active" : "Inactive"}
                  </button>

                  {!dashboardMode && (
                    <>
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(node)}
                        disabled={isNodePending}
                        title="Edit"
                        className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-colors disabled:opacity-50"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>

                      {/* Add child */}
                      <button
                        onClick={() => openAddChild(node)}
                        disabled={isSaving || isNodePending}
                        title="Add child"
                        className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-sky-500 hover:border-sky-200 transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => openDelete(node)}
                        disabled={isDeleting || isNodePending}
                        title="Delete"
                        className="flex h-6 w-6 items-center justify-center rounded border border-slate-100 bg-slate-50 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isExpanded && hasChildren && (
              <div className="relative">{renderRecursiveTree(node.children, depth + 1)}</div>
            )}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );

  /* ==========================================================================
     10. MAIN RENDER
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

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_25%),#f8fafc] text-slate-900 p-1 sm:p-2">
        <div className="mx-auto max-w-6xl">

          {!(dashboardMode || onSave || showSaveButton || onBack) && (
            <header className="mb-3 rounded-[28px] border bg-white/70 backdrop-blur-xl p-1 shadow-sm">
              <div className="p-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Service Listing</h3>
                  <p className="text-xs text-slate-500">Manage marketplace service structure.</p>
                </div>
              </div>
            </header>
          )}

          {!dashboardMode && (
            <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              {/* Left */}
              <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative w-full lg:max-w-[260px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search services..."
                    className="h-9 w-full rounded-full border border-slate-200 bg-slate-50/90 px-10 pr-4 text-xs font-medium outline-none shadow-sm transition-all focus:border-violet-400 focus:bg-white"
                  />
                </div>

                <div className="grid flex-1 grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <FolderTree className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[10px] font-bold uppercase text-slate-400">Total Services</div>
                      <div className="text-sm font-black text-slate-800">
                        {isLoadingServices
                          ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          : totalAvailableMetrics}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[10px] font-bold uppercase text-slate-400">Active Services</div>
                      <div className="text-sm font-black text-slate-800">{activeNodeIds.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-wrap items-center justify-start xl:justify-end gap-2">
                {/* API synced indicator */}
                {!isLoadingServices && !fetchError && (
                  <div className="flex items-center gap-1.5 rounded-2xl border border-blue-100 bg-blue-50 px-3 h-9 text-[11px] font-semibold text-blue-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    API Synced
                  </div>
                )}

                {/* Refresh */}
                <button
                  onClick={() => refetch()}
                  disabled={isLoadingServices}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingServices ? "animate-spin" : ""}`} />
                </button>

                {/* Collapse all */}
                <button
                  onClick={() => setExpandedNodeIds([])}
                  className="h-9 rounded-2xl border border-slate-200 bg-white/90 px-4 text-[11px] font-bold text-slate-600 transition-all hover:bg-slate-50"
                >
                  Collapse
                </button>

                {/* Add root */}
                <button
                  onClick={openAddRoot}
                  disabled={isSaving}
                  className="flex h-9 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-[11px] font-bold text-white shadow-lg shadow-violet-500/10 transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  {isSaving
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Plus className="h-3.5 w-3.5" />}
                  Add Root
                </button>
              </div>
            </div>
          )}

          {/* API error banner */}
          {fetchError && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="font-semibold">Failed to load services.</span>
              <span className="text-red-500">{fetchError?.message}</span>
              <button onClick={() => refetch()} className="ml-auto text-xs font-bold underline">
                Retry
              </button>
            </div>
          )}

          <main className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-xl p-3 shadow-sm">
            {isLoadingServices ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                <p className="text-xs text-slate-500 font-medium">Loading services from API...</p>
              </div>
            ) : processedDataTree.length > 0 ? (
              <div className="relative overflow-hidden">
                {renderRecursiveTree(processedDataTree)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-2">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800">
                  {fetchError ? "Could not load services" : "No services found"}
                </h3>
                {!fetchError && (
                  <p className="text-[11px] text-slate-400 mt-1">Click "Add Root" to create your first service.</p>
                )}
              </div>
            )}
          </main>

          {(onSave || showSaveButton || onBack) && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {onSave && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-bold text-xs hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
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
}