import { useMemo, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  Undo2,
  Redo2,
  FolderTree,
  Activity,
  LayoutGrid,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ==========================================================================
   1. DATASET SCHEMA & UTILITIES
   ========================================================================== */
const INITIAL_SERVICES_DATA = [
  {
    id: "consultingservice",
    name: "Consulting Service",
    children: [
      { id: "epcconsultancy", name: "EPC Consultancy", children: [] },
      {
        id: "projectmanagement",
        name: "Project Management Consultancy",
        children: [],
      },
      { id: "architectural", name: "Architectural Services", children: [] },
      {
        id: "mepdesign",
        name: "MEP Design Consultancy",
        children: [
          { id: "hvacdesign", name: "HVAC Design Consultancy", children: [] },
          {
            id: "electricaldesign",
            name: "Electrical Design Consultancy",
            children: [],
          },
          {
            id: "firefightingdesign",
            name: "Fire Fighting Design Consultancy",
            children: [],
          },
          {
            id: "plumbingdesign",
            name: "Plumbing Design Consultancy",
            children: [],
          },
          {
            id: "waterwastewater",
            name: "Water & Waste Water Design Consultancy",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "contractorservice",
    name: "Contractor Service",
    children: [
      { id: "epc", name: "EPC Contractor", children: [] },
      { id: "building", name: "Building Contractor", children: [] },
      { id: "road", name: "Road Contractor", children: [] },
      {
        id: "heavyfabrication_parent",
        name: "Heavy Fabrication Contractor",
        children: [
          {
            id: "heavyfabrication",
            name: "Heavy Fabrication Works",
            children: [],
          },
          { id: "doorwindow", name: "Door & Window Contractor", children: [] },
        ],
      },
      {
        id: "mepcontractor",
        name: "MEP Contractor",
        children: [
          { id: "electrical", name: "Electrical Contractor", children: [] },
          { id: "hvac", name: "HVAC Contractor", children: [] },
          {
            id: "firefighting",
            name: "Fire Fighting Contractor",
            children: [],
          },
          { id: "plumbing", name: "Plumbing Contractor", children: [] },
          { id: "STP", name: "STP / WTP / ETP Contractor", children: [] },
          { id: "ELV", name: "ELV Contractor", children: [] },
          { id: "Medical", name: "Medical Supply Contractor", children: [] },
          { id: "MedicalGas", name: "Medical Gas Contractor", children: [] },
          { id: "FireAlarm", name: "Fire Alarm Contractor", children: [] },
          { id: "water", name: "Water & Waste Water Contractor", children: [] },
        ],
      },
      {
        id: "facadecontractor",
        name: "Facade Contractor",
        children: [
          { id: "glassfacade", name: "Glass Facade Contractor", children: [] },
          { id: "acpfacade", name: "ACP Facade Contractor", children: [] },
          { id: "stonefacade", name: "Stone Facade Contractor", children: [] },
          { id: "GrcFacade", name: "GRC Facade Contractor", children: [] },
        ],
      },
      { id: "bridge", name: "Bridge Contractor", children: [] },
      { id: "civil", name: "Civil Contractor", children: [] },
      {
        id: "landscapecontractor",
        name: "Landscape Contractor",
        children: [
          { id: "hardscape", name: "Hard Scape Contractor", children: [] },
          {
            id: "softscape",
            name: "Soft Scape / Horticulture Contractor",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "tenderservices",
    name: "Tender Services",
    children: [
      {
        id: "governmenttenders",
        name: "Government Tenders",
        children: [
          { id: "centralgov", name: "Central Govt. Tenders", children: [] },
          { id: "stategov", name: "State Govt. Tenders", children: [] },
        ],
      },
      {
        id: "privatetenders",
        name: "Private Tenders",
        children: [
          { id: "individualtenders", name: "Individual Tenders", children: [] },
          { id: "builderstenders", name: "Builders Tenders", children: [] },
          { id: "contractortenders", name: "Contractor Tenders", children: [] },
        ],
      },
    ],
  },
  {
    id: "assetsmanagement",
    name: "Assets Management",
    children: [
      {
        id: "buildingmanagement",
        name: "Building Management Services",
        children: [],
      },
      { id: "securityservices", name: "Security Services", children: [] },
      { id: "hniassets", name: "HNI Assets Management", children: [] },
      { id: "societymanagement", name: "Society Management", children: [] },
      { id: "renovationassets", name: "Renovation of Assets", children: [] },
    ],
  },
  {
    id: "legalcontracts",
    name: "Legal Contracts",
    children: [
      {
        id: "disputeredressal",
        name: "Dispute Redressal Services",
        children: [],
      },
      {
        id: "legaldrafting",
        name: "Legal Contract Drafting Services",
        children: [],
      },
    ],
  },
  {
    id: "marketingmanagement_root",
    name: "Marketing Management",
    children: [
      {
        id: "marketingmanagement",
        name: "Marketing Management Division",
        children: [],
      },
    ],
  },
  {
    id: "materialsupplier",
    name: "Material Supplier",
    children: [
      { id: "cementtrades", name: "Cement Supplier", children: [] },
      { id: "aluminiumtrades", name: "Aluminium Supplier", children: [] },
      { id: "woodentilestrade", name: "Wooden Tiles Supplier", children: [] },
      { id: "paintstrade", name: "Paint Supplier", children: [] },
    ],
  },
  {
    id: "materialmanufacture",
    name: "Material Manufacture",
    children: [
      { id: "cementmanufacture", name: "Cement Manufacture", children: [] },
      { id: "tilesmanufacture", name: "Tiles Manufacture", children: [] },
      { id: "paintmanufacture", name: "Paint Manufacture", children: [] },
    ],
  },
  {
    id: "constructionaudit_root",
    name: "Construction Audit",
    children: [
      {
        id: "constructionaudit",
        name: "Construction Audit Operations",
        children: [],
      },
      {
        id: "qualityverification",
        name: "Verification of Quality",
        children: [],
      },
      { id: "boqpreparation", name: "BOQ Preparation", children: [] },
      { id: "siteaudit", name: "Site Construction Audit", children: [] },
    ],
  },
];

const generateUniqueId = () =>
  `node_${Math.random().toString(36).substring(2, 11)}`;

const updateNodeInTree = (tree, targetId, callback) => {
  return tree.map((node) => {
    if (node.id === targetId) return callback(node);
    if (node.children?.length) {
      return {
        ...node,
        children: updateNodeInTree(node.children, targetId, callback),
      };
    }
    return node;
  });
};

const deleteNodeFromTree = (tree, targetId) => {
  return tree
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: node.children
        ? deleteNodeFromTree(node.children, targetId)
        : [],
    }));
};

const countTotalNodes = (nodes) => {
  let tally = 0;
  nodes.forEach((node) => {
    tally++;
    if (node.children?.length) tally += countTotalNodes(node.children);
  });
  return tally;
};

const gatherAllNodeIds = (nodes, outputArray = []) => {
  nodes.forEach((node) => {
    outputArray.push(node.id);
    if (node.children?.length) gatherAllNodeIds(node.children, outputArray);
  });
  return outputArray;
};

const filterTreeHierarchy = (nodes, term) => {
  return nodes
    .map((node) => {
      const isSelfMatch = node.name.toLowerCase().includes(term.toLowerCase());
      const filteredSubTree = filterTreeHierarchy(node.children || [], term);

      if (isSelfMatch || filteredSubTree.length > 0) {
        return {
          ...node,
          children: filteredSubTree,
          isSearchHighlight: isSelfMatch,
        };
      }
      return null;
    })
    .filter(Boolean);
};

/* ==========================================================================
   2. CORE STUDIO COMPONENT
   ========================================================================== */

export default function ServiceListing({
  initialServices = null,
  onSave,
  onBack,
  showSaveButton = false,
  dashboardMode = false,
}) {
  const [services, setServices] = useState(
    () => initialServices || INITIAL_SERVICES_DATA,
  );
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const [activeNodeIds, setActiveNodeIds] = useState([]);
  const [expandedNodeIds, setExpandedNodeIds] = useState([
    "consultingservice",
    "contractorservice",
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingNodeId, setEditingNodeId] = useState(null);
  const [inlineEditName, setInlineEditName] = useState("");

  const flattenServiceTree = (nodes, parentLabel = "") => {
    return nodes.flatMap((node) => {
      const category = parentLabel || node.name || "General";
      const currentItem = {
        id: node.id,
        name: node.name,
        category,
        price: "",
        description: "",
        tags: [],
        status: activeNodeIds.includes(node.id) ? "Active" : "Draft",
      };

      const childItems = node.children?.length
        ? flattenServiceTree(node.children, node.name)
        : [];
      return [currentItem, ...childItems];
    });
  };

  const levelStyles = [
    { border: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
    { border: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
    { border: "#22c55e", bg: "rgba(34,197,94,0.08)" },
    { border: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  ];

  const getNodeStyle = (depth, highlight) => {
    const style = levelStyles[depth % levelStyles.length] || levelStyles[0];
    return {
      marginLeft: `${depth * 28}px`,
      borderColor: highlight ? "#c084fc" : style.border,
      background: highlight ? "rgba(199,88,253,0.09)" : style.bg,
      boxShadow: highlight
        ? "0 16px 40px rgba(124,58,237,0.14)"
        : "0 12px 32px rgba(15,23,42,0.05)",
    };
  };

  const buildServicePayload = () => flattenServiceTree(services);

  const handleSave = () => {
    if (!onSave) return;
    const payload = buildServicePayload();
    onSave(payload);
  };

  /* --- History Engine --- */
  const pushStateChange = (nextTree) => {
    setHistory((prev) => [...prev, services]);
    setFuture([]);
    setServices(nextTree);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const targetState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [services, ...prev]);
    setServices(targetState);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const targetState = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, services]);
    setServices(targetState);
  };

  /* --- FIX: Event-Driven State Interception (No useEffect) --- */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      // Calculate matches dynamically during the user action event pass
      const matchedTree = filterTreeHierarchy(services, value);
      const matchedIds = [];
      gatherAllNodeIds(matchedTree, matchedIds);

      if (matchedIds.length > 0) {
        setExpandedNodeIds((prev) =>
          Array.from(new Set([...prev, ...matchedIds])),
        );
      }
    }
  };

  const toggleActivationState = (id) => {
    setActiveNodeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const appendRootService = () => {
    const newRoot = {
      id: generateUniqueId(),
      name: "New Global Business Division",
      children: [],
    };
    pushStateChange([...services, newRoot]);
  };

  const appendChildService = (parentId) => {
    const newChild = {
      id: generateUniqueId(),
      name: "New Operational Capability",
      children: [],
    };
    const targetTree = updateNodeInTree(services, parentId, (node) => ({
      ...node,
      children: [...(node.children || []), newChild],
    }));
    pushStateChange(targetTree);
    if (!expandedNodeIds.includes(parentId)) {
      setExpandedNodeIds((prev) => [...prev, parentId]);
    }
  };

  const removeServiceNode = (id) => {
    pushStateChange(deleteNodeFromTree(services, id));
    setActiveNodeIds((prev) => prev.filter((x) => x !== id));
  };

  const saveInlineRename = (id) => {
    if (!inlineEditName.trim()) return;
    const targetTree = updateNodeInTree(services, id, (node) => ({
      ...node,
      name: inlineEditName.trim(),
    }));
    pushStateChange(targetTree);
    setEditingNodeId(null);
  };

  /* --- Pure Computational Maps --- */
  const totalAvailableMetrics = useMemo(
    () => countTotalNodes(services),
    [services],
  );

  const processedDataTree = useMemo(() => {
    if (!searchQuery.trim()) return services;
    return filterTreeHierarchy(services, searchQuery);
  }, [searchQuery, services]);

  /* ==========================================================================
     3. RECURSIVE LAYOUT SYSTEM
     ========================================================================== */
  const renderRecursiveTree = (nodes, depth = 0) => {
    return (
      <AnimatePresence mode="popLayout">
        {nodes.map((node) => {
          const isExpanded = expandedNodeIds.includes(node.id);
          const isActivated = activeNodeIds.includes(node.id);
          const hasChildren = node.children && node.children.length > 0;
          const isRenaming = !dashboardMode && editingNodeId === node.id;
          const nodeStyle = getNodeStyle(depth, node.isSearchHighlight);

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
                  style={{
                    left: `${depth * 28 - 14}px`,
                    borderColor: nodeStyle.borderColor,
                  }}
                />
              )}

              <div
                className="group relative mb-3 overflow-hidden rounded-3xl border p-3 transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                style={nodeStyle}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-start gap-2.5">
                    <button
                      onClick={() =>
                        setExpandedNodeIds((prev) =>
                          prev.includes(node.id)
                            ? prev.filter((x) => x !== node.id)
                            : [...prev, node.id],
                        )
                      }
                      className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border text-slate-600 ${
                        hasChildren
                          ? "bg-slate-50 border-slate-200"
                          : "bg-transparent border-transparent text-slate-300"
                      }`}
                    >
                      {hasChildren ? (
                        isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isRenaming ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={inlineEditName}
                              onChange={(e) =>
                                setInlineEditName(e.target.value)
                              }
                              autoFocus
                              onKeyDown={(e) =>
                                e.key === "Enter" && saveInlineRename(node.id)
                              }
                              className="h-7 w-64 rounded-md border border-violet-400 px-2 text-xs text-slate-800 focus:outline-none"
                            />
                            <button
                              onClick={() => saveInlineRename(node.id)}
                              className="h-7 w-7 rounded bg-emerald-500 text-white flex items-center justify-center"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingNodeId(null)}
                              className="h-7 w-7 rounded bg-slate-100 text-slate-500 flex items-center justify-center"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4
                              className={`text-sm font-semibold text-slate-900 sm:text-base ${dashboardMode ? "cursor-default" : "cursor-pointer"}`}
                              onClick={dashboardMode ? undefined : () => {
                                setEditingNodeId(node.id);
                                setInlineEditName(node.name);
                              }}
                            >
                              {node.name}
                            </h4>
                            <span className="rounded-full bg-slate-100/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              Level {depth + 1}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => toggleActivationState(node.id)}
                      className={`h-6 rounded-full border px-2.5 text-[10px] font-bold ${
                        isActivated
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      {isActivated ? "Active" : "Inactive"}
                    </button>
                    {!dashboardMode && (
                      <>
                        <button
                          onClick={() => appendChildService(node.id)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeServiceNode(node.id)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-slate-100 bg-slate-50 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              </div>

              {isExpanded && hasChildren && (
                <div className="relative">
                  {renderRecursiveTree(node.children, depth + 1)}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_25%),#f8fafc] text-slate-900 p-1 sm:p-2">
      <div className="mx-auto max-w-6xl">
        {!(dashboardMode || onSave || showSaveButton || onBack) && (
          <header className="mb-1 rounded-[28px] border bg-white/70 backdrop-blur-xl p-1 shadow-sm shadow-slate-200/20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="p-2 pl-2 flex items-center gap-3 ">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Service Listing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Design your marketplace offerings with structured service
                    levels.
                  </p>
                </div>
              </div>
            </div>
          </header>
        )}

        {!dashboardMode && (
          <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            {/* LEFT SECTION */}
            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
              {/* SEARCH */}
              <div className="relative w-full lg:max-w-[260px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search services..."
                  className="
              h-9 w-full rounded-full
              border border-slate-200
              bg-slate-50/90
              px-10 pr-4
              text-xs font-medium
              outline-none shadow-sm
              transition-all
              focus:border-violet-400
              focus:bg-white
            "
                />
              </div>

              {/* STATS */}
              <div className="grid flex-1 grid-cols-2 gap-3">
                {/* TOTAL */}
                <div
                  className="
              flex items-center gap-3
              rounded-2xl border border-slate-200
              bg-white p-3 shadow-sm
            "
                >
                  <div
                    className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-xl
                bg-violet-50 text-violet-600
              "
                  >
                    <FolderTree className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[10px] font-bold uppercase text-slate-400">
                      Total Services
                    </div>

                    <div className="text-sm font-black text-slate-800">
                      {totalAvailableMetrics}
                    </div>
                  </div>
                </div>

                {/* ACTIVE */}
                <div
                  className="
              flex items-center gap-3
              rounded-2xl border border-slate-200
              bg-white p-3 shadow-sm
            "
                >
                  <div
                    className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-xl
                bg-emerald-50 text-emerald-600
              "
                  >
                    <Activity className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[10px] font-bold uppercase text-slate-400">
                      Active Allocations
                    </div>

                    <div className="text-sm font-black text-slate-800">
                      {activeNodeIds.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div
              className="
        flex flex-wrap items-center
        justify-start xl:justify-end
        gap-2
      "
            >
              {/* UNDO REDO */}
              <div className="  flex items-center   rounded-2xl border border-slate-200/70 bg-white/80 p-1 shadow-sm">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="
            flex h-8 w-8 items-center justify-center
            rounded-xl
            text-slate-600
            transition-all
            hover:bg-slate-100
            disabled:opacity-30
          "
                >
                  <Undo2 className="h-4 w-4" />
                </button>

                <button
                  onClick={handleRedo}
                  disabled={future.length === 0}
                  className="
            flex h-8 w-8 items-center justify-center
            rounded-xl
            text-slate-600
            transition-all
            hover:bg-slate-100
            disabled:opacity-30
          "
                >
                  <Redo2 className="h-4 w-4" />
                </button>
              </div>

              {/* COLLAPSE */}
              <button
                onClick={() => setExpandedNodeIds([])}
                className="
          h-9 rounded-2xl border
          border-slate-200
          bg-white/90
          px-4
          text-[11px] font-bold
          text-slate-600
          transition-all
          hover:bg-slate-50
        "
              >
                Collapse
              </button>

              {/* ADD ROOT */}
              <button
                onClick={appendRootService}
                className="
          flex h-9 items-center gap-1.5
          rounded-2xl
          bg-gradient-to-r
          from-violet-600 to-fuchsia-600
          px-4
          text-[11px] font-bold
          text-white
          shadow-lg shadow-violet-500/10
          transition-all
          hover:scale-[1.02]
        "
              >
                <Plus className="h-3.5 w-3.5" />
                Add Root
              </button>
            </div>
          </div>
        )}

        <main className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-xl p-3 shadow-sm shadow-slate-200/20">
          {processedDataTree.length > 0 ? (
            <div className="relative overflow-hidden">
              {renderRecursiveTree(processedDataTree)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-2">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">
                No organizational structures matched
              </h3>
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
                // disabled={activeNodeIds.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
              >
                Save & Continue <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
