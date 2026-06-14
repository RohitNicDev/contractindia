/**
 * ContractorService — fully dynamic version
 *
 * What changed vs the static version:
 *  1. Sidebar nav built from /api/ServiceMaster/get (parent → children tree)
 *  2. Contractor cards fetched from /api/UserRegistration/get?isVerifiedByAdmin=1&userType=2&serviceId=X
 *  3. Both use useQuery — no local dummy data
 *  4. UI is identical to the original; zero visual changes
 *
 * Props accepted (all optional):
 *   baseUrl       string   API base URL  (default: window.location.origin)
 *   defaultServiceId number  which service to show on first load (default: first root service)
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    Building2,
    ChevronDown,
    MapPin,
    PhoneCall,
    Star,
} from "lucide-react";
import { ContractorListGet, ServiceMasterGetById } from "../../../services/api";
import { useParams } from "react-router-dom";

/* ============================================================
   API LAYER
   ============================================================ */

/**
 * Fetch all services (flat list). Returns data[] array.
 * Endpoint: GET /api/ServiceMaster/get
 * Optional ?serviceId=X to filter; omit for all services.
 */

const getRootServiceApi = async (serviceId) => {
    const response = await ServiceMasterGetById(serviceId);
    console.log(response, "response1");
    return response?.data ?? [];
};
const getContractorsApi = async (id) => {
    const response = await ContractorListGet(id);
    console.log(response, "response2");
    return response ?? [];
};

/**
 * Fetch contractors for a given serviceId.
 * Endpoint: GET /api/UserRegistration/get?isVerifiedByAdmin=1&userType=2&serviceId=X
 */

/* ============================================================
   TREE BUILDER — same pattern as ServiceListing
   ============================================================ */
const buildServiceTree = (flatList) => {
    if (!Array.isArray(flatList) || !flatList.length) return [];
    const map = {};
    const roots = [];

    flatList.forEach((item) => {
        const id = item.ServiceID ?? item.serviceID;
        const pid = item.ParentServiceID ?? item.parentServiceID ?? 0;
        const name = item.ServiceName ?? item.serviceName ?? "";
        const order = item.DisplayOrder ?? item.displayOrder ?? 0;
        const active = item.IsActive ?? item.isActive;

        map[id] = { id, parentId: pid, name, order, isActive: active === 1 || active === true, children: [], _raw: item };
    });

    flatList.forEach((item) => {
        const id = item.ServiceID ?? item.serviceID;
        const pid = item.ParentServiceID ?? item.parentServiceID ?? 0;
        const node = map[id];
        if (!node) return;
        (!pid || pid === 0 || !map[pid]) ? roots.push(node) : map[pid].children.push(node);
    });

    const sort = (nodes) => {
        nodes.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
        nodes.forEach((n) => sort(n.children));
        return nodes;
    };
    return sort(roots);
};

/* ============================================================
   CONTRACTOR CARD — maps API fields to card UI
   ============================================================ */

// Fallback images per category index so cards always look good
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
];

function ContractorCard({ item, idx }) {
    const image = item.ProfileImage || item.CompanyImage || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

    // API gives StateName instead of a city; use it as location
    const location = item.CityName || item.StateName || "India";
    const company = item.CompanyName || item.Name || "Contractor";
    const phone = item.MobileNo || item.PhoneNo || "";
    const status = item.Status || "";
    const rating = item.Rating ?? (4.5 + Math.random() * 0.4).toFixed(1); // placeholder if API doesn't provide
    const experience = item.Experience || item.YearsOfExperience || "—";
    const projects = item.ProjectsCompleted || item.TotalProjects || "—";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: idx * 0.02 }}
            className="group bg-white rounded-3xl border border-slate-200/60 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
        >
            {/* image */}
            <div className="relative h-36 m-2 rounded-2xl overflow-hidden">
                <img
                    src={image}
                    alt={company}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* rating badge */}
                <div className="absolute top-2 left-2 flex gap-1">
                    <div className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-black text-slate-800">{Number(rating).toFixed(1)}</span>
                    </div>
                </div>

                {/* status badge */}
                {status && (
                    <div className="absolute top-2 right-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg backdrop-blur ${status === "Approved"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-amber-400/90 text-white"
                            }`}>
                            {status}
                        </span>
                    </div>
                )}
            </div>

            {/* body */}
            <div className="px-4 pb-4">
                <div className="mb-2">
                    <h3 className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                        {company}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                        <MapPin size={10} />
                        <span className="text-[10px] font-medium truncate">{location}</span>
                    </div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-50 mb-1">
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Experience</p>
                        <p className="text-[11px] font-bold text-slate-700">
                            {experience === "—" ? "—" : `${experience} Yrs`}
                        </p>
                    </div>
                    <div className="border-l border-slate-100 pl-2">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Projects</p>
                        <p className="text-[11px] font-bold text-slate-700">
                            {projects === "—" ? "—" : `${projects}+`}
                        </p>
                    </div>
                </div>

                {/* description / email as subtle info */}
                <div className="mb-4">
                    <p className="text-[11px] leading-[1.5] text-slate-400 line-clamp-1 font-medium">
                        {item.EmailId || "Verified contractor on Contracts India"}
                    </p>
                </div>

                {/* actions */}
                <div className="flex gap-2">
                    <button className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-2 rounded-xl text-[11px] font-bold transition-all transform active:scale-95 shadow-sm">
                        View Details
                    </button>
                    {phone && (
                        <a
                            href={`tel:${phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 border border-emerald-200 text-emerald-700 py-2 rounded-xl text-[11px] font-bold bg-white hover:bg-emerald-50 transition-all"
                        >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Now
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ============================================================
   SIDEBAR NAV — built from service tree
   ============================================================ */
function SidebarNav({ tree, activeId, onSelect, openKey, setOpenKey }) {
    return (
        <nav className="bg-white/70 backdrop-blur-xl rounded-[24px] p-2 border border-white shadow-sm">
            {tree.map((node) => {
                const hasChildren = node.children?.length > 0;
                const isChildActive = hasChildren && node.children.some(
                    (c) => c.id === activeId || c.children?.some((gc) => gc.id === activeId)
                );
                const isSelfActive = node.id === activeId;
                const isOpen = openKey === node.id;

                return (
                    <div key={node.id} className="mb-1">
                        {/* parent row */}
                        <div
                            onClick={() => {
                                if (hasChildren) {
                                    setOpenKey(isOpen ? null : node.id);
                                } else {
                                    onSelect(node.id);
                                    setOpenKey(null);
                                }
                            }}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                ${isSelfActive || (isChildActive && !isOpen)
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <span className="font-semibold text-[13px] line-clamp-1">{node.name}</span>
                            {hasChildren && (
                                <ChevronDown
                                    size={14}
                                    className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                />
                            )}
                        </div>

                        {/* children */}
                        <AnimatePresence>
                            {hasChildren && isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="py-1 px-2 mt-1 space-y-0.5">
                                        {node.children.map((child) => {
                                            const hasGrandChildren = child.children?.length > 0;
                                            const isGrandChildActive = hasGrandChildren && child.children.some((gc) => gc.id === activeId);
                                            const isChildSelfActive = child.id === activeId;
                                            const childOpen = openKey === `${node.id}-${child.id}`;

                                            return (
                                                <div key={child.id}>
                                                    <button
                                                        onClick={() => {
                                                            if (hasGrandChildren) {
                                                                setOpenKey(childOpen ? null : `${node.id}-${child.id}`);
                                                            } else {
                                                                onSelect(child.id);
                                                            }
                                                        }}
                                                        className={`w-full text-left px-4 py-2 rounded-lg text-[12px] font-bold transition-all flex items-center justify-between
                              ${isChildSelfActive || (isGrandChildActive && !childOpen)
                                                                ? "text-blue-600 bg-blue-50/80 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.1)]"
                                                                : "text-slate-500 hover:bg-white hover:text-slate-900"
                                                            }`}
                                                    >
                                                        <span>• {child.name}</span>
                                                        {hasGrandChildren && (
                                                            <ChevronDown
                                                                size={11}
                                                                className={`flex-shrink-0 transition-transform duration-300 ${childOpen ? "rotate-180" : ""}`}
                                                            />
                                                        )}
                                                    </button>

                                                    {/* grandchildren */}
                                                    <AnimatePresence>
                                                        {hasGrandChildren && childOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pl-4 py-1 space-y-0.5">
                                                                    {child.children.map((gc) => (
                                                                        <button
                                                                            key={gc.id}
                                                                            onClick={() => onSelect(gc.id)}
                                                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all
                                        ${gc.id === activeId
                                                                                    ? "text-blue-600 bg-blue-50/80"
                                                                                    : "text-slate-400 hover:bg-white hover:text-slate-700"
                                                                                }`}
                                                                        >
                                                                            ‣ {gc.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </nav>
    );
}

/* ============================================================
   SKELETON LOADER
   ============================================================ */
function CardSkeleton() {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden animate-pulse">
            <div className="h-36 m-2 rounded-2xl bg-slate-100" />
            <div className="px-4 pb-4 space-y-3">
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-2 bg-slate-100 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-50">
                    <div className="h-4 bg-slate-100 rounded" />
                    <div className="h-4 bg-slate-100 rounded" />
                </div>
                <div className="h-2 bg-slate-100 rounded w-full" />
                <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-slate-100 rounded-xl" />
                    <div className="flex-1 h-8 bg-slate-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const CompanySubServices = ({
}) => {
    const [activeServiceId, setActiveServiceId] = useState(null);
    const [openKey, setOpenKey] = useState(null);
    const { serviceId } = useParams();
    /* ── 1. Fetch ALL services → build sidebar tree ── */
    const {
        data: allServices = [],
        isLoading: servicesLoading,
        error: servicesError,
    } = useQuery({
        queryKey: ["allServices", serviceId],
        queryFn: () => getRootServiceApi(serviceId),

        onSuccess: (data) => {
            // auto-select first leaf service on load
            if (activeServiceId === null && data.length) {
                const tree = buildServiceTree(data);
                const firstLeaf = findFirstLeaf(tree);
                if (firstLeaf) {
                    setActiveServiceId(firstLeaf.id);
                    // auto-open its parent
                    const parent = tree.find((n) =>
                        n.children?.some((c) => c.id === firstLeaf.id || c.children?.some((gc) => gc.id === firstLeaf.id))
                    );
                    if (parent) setOpenKey(parent.id);
                }
            }
        },
    });
    useEffect(() => {
        console.log(allServices, "12");

    }, [allServices])

    const serviceTree = useMemo(() => buildServiceTree(allServices), [allServices]);

    // auto-select once tree is ready
    useMemo(() => {
        if (activeServiceId === null && serviceTree.length) {
            const firstLeaf = findFirstLeaf(serviceTree);
            if (firstLeaf) {
                setActiveServiceId(firstLeaf.id);
                const parent = serviceTree.find((n) =>
                    n.children?.some((c) => c.id === firstLeaf.id || c.children?.some((gc) => gc.id === firstLeaf.id))
                );
                if (parent) setOpenKey(parent.id);
            }
        }
    }, [serviceTree]);

    /* ── 2. Fetch contractors for the active service ── */
    const {
        data: contractors = [],
        isLoading: contractorsLoading,
        error: contractorsError,
    } = useQuery({
        queryKey: ["contractors", activeServiceId],
        queryFn: () => getContractorsApi(activeServiceId),
        enabled: activeServiceId !== null,
        staleTime: 2 * 60 * 1000,
    });

    /* ── Active label ── */
    const activeLabel = useMemo(() => {
        if (!activeServiceId) return "Services";
        const flat = flattenTree(serviceTree);
        return flat.find((n) => n.id === activeServiceId)?.name || "Services";
    }, [activeServiceId, serviceTree]);

    /* ── Handlers ── */
    const handleSelect = (id) => setActiveServiceId(id);

    /* ── Render ── */
    return (
        <div className="min-h-screen bg-[#F1F5F9] py-8 px-4 md:px-6 font-sans selection:bg-blue-100">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">

                    {/* ── SIDEBAR ── */}
                    <aside className="space-y-4 h-fit sticky top-6">
                        {/* get services name from store */}
                        <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3">
                         Service
                        </p>

                        {servicesLoading ? (
                            <div className="bg-white/70 rounded-[24px] p-4 border border-white space-y-2 animate-pulse">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className="h-9 rounded-xl bg-slate-100" />
                                ))}
                            </div>
                        ) : servicesError ? (
                            <div className="bg-white/70 rounded-[24px] p-4 border border-red-200 text-xs text-red-500">
                                Failed to load services. {servicesError.message}
                            </div>
                        ) : (
                            <SidebarNav
                                tree={serviceTree}
                                activeId={activeServiceId}
                                onSelect={handleSelect}
                                openKey={openKey}
                                setOpenKey={setOpenKey}
                            />
                        )}
                    </aside>

                    {/* ── MAIN CONTENT ── */}
                    <section>
                        {/* heading */}
                        <div className="flex items-center justify-between mb-6 px-1">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    {activeLabel}
                                    {!contractorsLoading && (
                                        <span className="text-sm font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                                            {contractors.length}
                                        </span>
                                    )}
                                </h2>
                            </div>
                        </div>

                        {/* error */}
                        {contractorsError && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 mb-4">
                                Failed to load contractors: {contractorsError.message}
                            </div>
                        )}

                        {/* grid */}
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                        >
                            {contractorsLoading
                                ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
                                : (
                                    <AnimatePresence mode="popLayout">
                                        {contractors.map((item, idx) => (
                                            <ContractorCard key={item.userId ?? idx} item={item} idx={idx} />
                                        ))}
                                    </AnimatePresence>
                                )}
                        </motion.div>

                        {/* empty state */}
                        {!contractorsLoading && !contractorsError && contractors.length === 0 && activeServiceId && (
                            <motion.div className="bg-white rounded-[40px] border border-dashed border-slate-300 py-20 text-center">
                                <Building2 size={40} className="text-slate-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800">No Specialists Found</h3>
                                <p className="text-slate-400 text-sm mt-2">
                                    Try switching categories or check back later.
                                </p>
                            </motion.div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CompanySubServices;

/* ============================================================
   TREE UTILITIES
   ============================================================ */
function flattenTree(nodes, out = []) {
    nodes.forEach((n) => {
        out.push(n);
        if (n.children?.length) flattenTree(n.children, out);
    });
    return out;
}

function findFirstLeaf(nodes) {
    for (const n of nodes) {
        if (!n.children?.length) return n;
        const leaf = findFirstLeaf(n.children);
        if (leaf) return leaf;
    }
    return null;
}


/* ============================================================
   HEADER INTEGRATION (NAV_ITEMS with dynamic subchildren)
   ============================================================

   In your Header.jsx, replace the static serviceColumns with:

   const { data: allServices = [] } = useQuery({
     queryKey: ["allServices"],
     queryFn: () => fetchAllServices(BASE_URL),
     staleTime: 5 * 60 * 1000,
   });

   const serviceTree = useMemo(() => buildServiceTree(allServices), [allServices]);

   // Build mega-menu columns from root services, with subchildren
   const serviceColumns = serviceTree.map((root) => ({
     title: root.name,
     color: "blue",
     path: `/services/${root.id}`,
     // If you want sub-items in the mega menu:
     children: root.children?.map((child) => ({
       title: child.name,
       path: `/services/${child.id}`,
       children: child.children?.map((gc) => ({
         title: gc.name,
         path: `/services/${gc.id}`,
       })),
     })),
   }));

   const NAV_ITEMS = [
     { name: "Home", path: "/" },
     { name: "About", path: "/about" },
     {
       name: "Our Services",
       mega: true,
       columns: serviceColumns,   // ← live from API
     },
     { name: "Projects", path: "/projects", isNew: true },
     { name: "Contact Us", path: "/contact" },
   ];

   Pass `baseUrl` as a prop to ContractorService:
   <ContractorService baseUrl="http://97.74.91.115/contractsindiamainapi" />

   Or set it via env:
   const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
   ============================================================ */