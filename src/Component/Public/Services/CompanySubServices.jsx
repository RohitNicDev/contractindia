/**
 * CompanySubServices
 * - Left sidebar only
 * - Infinite dynamic levels (L0, L1, L2, L3 ... Ln)
 * - Every node clickable → loads contractors
 * - Children expand/collapse with animation
 * - Color & indent auto-derive from depth (no hardcoded level limit)
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronRight, MapPin, PhoneCall, Star } from "lucide-react";
import { ContractorListGet, ServiceMenuGet } from "../../../services/api";
import { useParams } from "react-router-dom";
import { useServiceStore } from "../../../store/store";

/* ─── API ─────────────────────────────────────────────────────────────── */
const fetchContractors = async (serviceId) => {
  if (!serviceId) return [];
  const res = await ContractorListGet(serviceId);
  return res ?? [];
};

/* ─── Build tree from flat API data ───────────────────────────────────── */
const buildTree = (flat) => {
  if (!Array.isArray(flat) || !flat.length) return [];
  const map = {};
  flat.forEach((item) => { map[item.ServiceID] = { ...item, children: [] }; });
  const roots = [];
  flat.forEach((item) => {
    const pid = item.ParentServiceID ?? 0;
    if (!pid || !map[pid]) roots.push(map[item.ServiceID]);
    else map[pid].children.push(map[item.ServiceID]);
  });
  return roots;
};

/* ─── Tree utilities ───────────────────────────────────────────────────── */
const flattenTree = (nodes, out = []) => {
  nodes.forEach((n) => { out.push(n); if (n.children?.length) flattenTree(n.children, out); });
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

// Does this subtree contain the active id?
const subtreeHasActive = (node, activeId) => {
  if (node.ServiceID === activeId) return true;
  return (node.children ?? []).some((c) => subtreeHasActive(c, activeId));
};

// Get all ancestor ids for a target node
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

/* ─── Dynamic color from depth (cycles every 6 levels) ────────────────── */
const PALETTE = [
  { line: "#6366f1", dot: "#6366f1", activeBg: "#4f46e5", softBg: "#eef2ff", softText: "#4338ca" },
  { line: "#0891b2", dot: "#0891b2", activeBg: "#0e7490", softBg: "#ecfeff", softText: "#0e7490" },
  { line: "#059669", dot: "#059669", activeBg: "#047857", softBg: "#ecfdf5", softText: "#047857" },
  { line: "#d97706", dot: "#d97706", activeBg: "#b45309", softBg: "#fffbeb", softText: "#b45309" },
  { line: "#e11d48", dot: "#e11d48", activeBg: "#be123c", softBg: "#fff1f2", softText: "#be123c" },
  { line: "#7c3aed", dot: "#7c3aed", activeBg: "#6d28d9", softBg: "#f5f3ff", softText: "#6d28d9" },
];
const p = (depth) => PALETTE[depth % PALETTE.length];

/* ─── Fallback images ──────────────────────────────────────────────────── */
const IMGS = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
];

/* ════════════════════════════════════════════════════════════════════════
   RECURSIVE NODE — works for ANY depth dynamically
   ════════════════════════════════════════════════════════════════════════ */
function Node({ node, depth, activeId, onSelect, expandedIds, toggleExpand }) {
  const hasKids   = node.children?.length > 0;
  const isActive  = node.ServiceID === activeId;
  const isOpen    = expandedIds.has(node.ServiceID);
  const isAncestor = !isActive && subtreeHasActive(node, activeId);
  const pal       = p(depth);

  // indent per level: 16px per level, starting from 0
  const indentPx  = depth * 16;

  // font shrinks with depth, min 11px
  const fs        = Math.max(11, 13 - depth * 0.5);

  // dot shrinks with depth
  const dotSize   = Math.max(6, 10 - depth * 1.5);

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node.ServiceID);
          if (hasKids) toggleExpand(node.ServiceID);
        }}
        style={{
          paddingLeft: 12 + indentPx,
          fontSize: fs,
          background: isActive
            ? pal.activeBg
            : isAncestor
              ? pal.softBg
              : "transparent",
          color: isActive
            ? "#ffffff"
            : isAncestor
              ? pal.softText
              : "#475569",
        }}
        className="w-full text-left flex items-center gap-2 rounded-xl pr-3 py-2 mb-0.5 font-semibold transition-all duration-150 hover:opacity-90 group"
      >
        {/* Depth line — visual connector */}
        {depth > 0 && (
          <span
            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full opacity-20 pointer-events-none"
            style={{ background: p(depth - 1).line, marginLeft: 12 + (depth - 1) * 16 + 4 }}
          />
        )}

        {/* Dot */}
        <span
          className="shrink-0 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: isActive ? "#ffffff" : pal.dot,
            opacity: isActive ? 1 : 0.85,
            minWidth: dotSize,
          }}
        />

        {/* Name */}
        <span className="flex-1 line-clamp-2 leading-snug">{node.ServiceName}</span>

        {/* Right: child count + chevron */}
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
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                color: isActive ? "rgba(255,255,255,0.8)" : "#94a3b8",
              }}
            />
          </span>
        )}
      </button>

      {/* Children — animated */}
      <AnimatePresence initial={false}>
        {hasKids && isOpen && (
          <motion.div
            key="kids"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Left border line — color matches parent depth */}
            <div
              className="ml-0 pl-0"
              // style={{ borderLeft: `2px solid ${pal.line}22`, marginLeft: 12 + indentPx + dotSize / 2 }}
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
            </div>
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
        const pal    = p(i);
        return (
          <span key={node.ServiceID} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={11} className="text-slate-300 shrink-0" />}
            <button
              onClick={() => !isLast && onSelect(node.ServiceID)}
              className="text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all"
              style={isLast
                ? { background: pal.softBg, color: pal.softText, cursor: "default" }
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
   CONTRACTOR CARD
   ════════════════════════════════════════════════════════════════════════ */
function ContractorCard({ item, idx }) {
  const img      = item.ProfileImage || item.CompanyImage || IMGS[idx % IMGS.length];
  const location = item.CityName || item.StateName || "India";
  const company  = item.CompanyName || item.Name || "Contractor";
  const phone    = item.MobileNo || item.PhoneNo || "";
  const status   = item.Status || "";
  const rating   = typeof item.Rating === "number" ? item.Rating : 4.5 + (idx % 5) * 0.1;

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
        <img src={img} alt={company}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = IMGS[idx % IMGS.length]; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg flex items-center gap-1">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-black text-slate-800">{rating.toFixed(1)}</span>
        </div>
        {status && (
          <span className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-lg ${
            status === "Approved" ? "bg-emerald-500/90 text-white" : "bg-amber-400/90 text-white"
          }`}>{status}</span>
        )}
      </div>
      <div className="px-4 pb-4">
        <h3 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-0.5">{company}</h3>
        <div className="flex items-center gap-1 text-slate-400 mb-3">
          <MapPin size={10} /><span className="text-[10px] truncate">{location}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-50 mb-3">
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Experience</p>
            <p className="text-[11px] font-bold text-slate-700">{item.Experience ? `${item.Experience} Yrs` : "—"}</p>
          </div>
          <div className="border-l border-slate-100 pl-2">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Projects</p>
            <p className="text-[11px] font-bold text-slate-700">{item.ProjectsCompleted ? `${item.ProjectsCompleted}+` : "—"}</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-1 mb-4">{item.EmailId || "Verified on Contracts India"}</p>
        <div className="flex gap-2">
          <button className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95">View Details</button>
          {phone && (
            <a href={`tel:${phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 border border-emerald-200 text-emerald-700 py-2 rounded-xl text-[11px] font-bold hover:bg-emerald-50 transition-all">
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-36 m-2 rounded-2xl bg-slate-100" />
      <div className="px-4 pb-4 space-y-3 mt-2">
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-50">
          <div className="h-4 bg-slate-100 rounded" /><div className="h-4 bg-slate-100 rounded" />
        </div>
        <div className="h-2 bg-slate-100 rounded" />
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-slate-100 rounded-xl" /><div className="flex-1 h-8 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════════ */
const CompanySubServices = () => {
  const { serviceId }  = useParams();
  console.log(serviceId,"serviceId");
  
  const menuServicesInStore = useServiceStore((state) => state?.allMenuServices ?? state?.allServices ?? []);

  const [activeId,    setActiveId]    = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const { data: menuServicesApi = [], isLoading: menuServicesLoading } = useQuery({
    queryKey: ["ServiceMenuGetList"],
    queryFn: ServiceMenuGet,
    enabled: !menuServicesInStore?.length,
    staleTime: 5 * 60 * 1000,
  });

  const allMenuServices = menuServicesInStore?.length ? menuServicesInStore : menuServicesApi;
  const tree = useMemo(() => {
    if (!allMenuServices?.length) return [];
    const fullTree = buildTree(allMenuServices);
    if (!serviceId) return fullTree;
    const target = findNode(fullTree, Number(serviceId));
    return target ? [target] : [];
  }, [allMenuServices, serviceId]);

  const treeLoading = menuServicesLoading && !menuServicesInStore?.length;
  const totalNodes = useMemo(() => flattenTree(tree)?.length, [tree]);

  /* Auto-select first leaf on load or when the route subtree changes */
  useEffect(() => {
    if (!tree.length) {
      setActiveId(null);
      setExpandedIds(new Set());
      return;
    }

    const isActiveInTree = activeId !== null && !!findNode(tree, activeId);
    if (isActiveInTree) return;

    const leaf = findFirstLeaf(tree[0]) ?? tree[0];
    setActiveId(leaf.ServiceID);
    setExpandedIds(getAncestorIds(tree, leaf.ServiceID));
  }, [tree, activeId]);

  /* Select node + auto-expand its ancestors */
  const handleSelect = (id) => {
    setActiveId(id);
    const ancestors = getAncestorIds(tree, id);
    setExpandedIds((prev) => new Set([...prev, ...ancestors]));
  };

  const toggleExpand = (id) =>
    setExpandedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const activeNode = useMemo(() => (activeId ? findNode(tree, activeId) : null), [tree, activeId]);

  /* Parent service name from store */
  const parentName = useMemo(() => {
    const s = allMenuServices?.find((el) => Number(el.ServiceID ?? el.value) === Number(serviceId));
    return s?.ServiceName || s?.name || "Services";
  }, [allMenuServices, serviceId]);

  /* Contractors for selected node */
  const { data: contractors = [], isLoading: contractorsLoading } = useQuery({
    queryKey: ["contractors", activeId],
    queryFn:  () => fetchContractors(activeId),
    enabled:  !!activeId,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* ── SIDEBAR ── */}
          <aside className="sticky top-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <p className="text-sm font-black text-slate-800 truncate">{parentName}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{totalNodes} categories</p>
              </div>

              {/* Tree scroll area */}
              <div
                className="py-2 px-2 overflow-y-auto relative"
                style={{ maxHeight: "calc(100vh - 160px)", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
              >
                {treeLoading ? (
                  <div className="space-y-2 p-2 animate-pulse">
                    {/* {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-8 rounded-xl bg-slate-100" style={{ width: `${90 - i * 5}%`, marginLeft: (i % 3) * 12 }} />
                    ))} */}
                  </div>
                ) : tree.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">No categories found</p>
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
            {/* Breadcrumb */}
            <Breadcrumb tree={tree} activeId={activeId} onSelect={handleSelect} />

            {/* Heading */}
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
                {activeNode && (
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    L{activeNode.level ?? "?"} · ID #{activeNode.ServiceID}
                    {activeNode.children?.length > 0
                      ? ` · ${activeNode.children.length} sub-categories`
                      : " · leaf"
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Cards grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {contractorsLoading
                ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
                : (
                  <AnimatePresence mode="popLayout">
                    {contractors.map((item, idx) => (
                      <ContractorCard key={item.userId ?? idx} item={item} idx={idx} />
                    ))}
                  </AnimatePresence>
                )
              }
            </motion.div>

            {/* Empty */}
            {!contractorsLoading && contractors.length === 0 && activeId && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-[40px] border border-dashed border-slate-200 py-20 text-center mt-4"
              >
                <Building2 size={40} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Specialists Found</h3>
                <p className="text-slate-400 text-sm mt-1">Try a sub-category or check back later.</p>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CompanySubServices;