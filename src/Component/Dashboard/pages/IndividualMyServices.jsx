/**
 * IndividualMyServices
 * A browse & enquire page for individual users.
 * Shows available services from the platform in a clean card grid with a search/filter bar.
 */
import { useState, useMemo, useEffect, useEffectEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Briefcase,
  Search,
  X,
  ChevronRight,
  Star,
  Loader2,
  RefreshCw,
  Layers,
  Zap,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Building2,
  HardHat,
  Gavel,
  TrendingUp,
  Package,
  ShieldCheck,
  Megaphone,
  Wrench,
} from "lucide-react";
import { ServiceMasterGet, UserServiceDetailsGetbyParam } from "../../../services/api";
import { SectionHeader, glassCard } from "../Layout/DashboardLayout";
import { useUserStore } from "../../../store/store";

/* ── API ─────────────────────────────────────────────────────────────────── */
const fetchServices = async () => {
  const res = await ServiceMasterGet();
  return res?.data ?? [];
};
const UserServiceDetails = async (userId) => {
  const res = await UserServiceDetailsGetbyParam(`userId=${userId}`);
  return res?.data ?? [];
};

/* ── Service icon map (top-level categories) ─────────────────────────────── */
const CATEGORY_ICONS = {
  Consulting: Briefcase,
  Contractor: HardHat,
  Legal: Gavel,
  Marketing: Megaphone,
  Assets: Package,
  Brand: Star,
  Tender: Layers,
  Audit: ShieldCheck,
  Material: Wrench,
  Supply: Building2,
  default: Briefcase,
};

const CATEGORY_GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-400",
  "from-pink-500 to-rose-500",
  "from-sky-500 to-blue-500",
  "from-fuchsia-500 to-purple-500",
  "from-lime-500 to-green-500",
  "from-cyan-500 to-teal-500",
];

function getIcon(name = "") {
  const lower = name.toLowerCase();
  for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key.toLowerCase())) return Icon;
  }
  return CATEGORY_ICONS.default;
}

function getGrad(index) {
  return CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length];
}

/* ── Enquiry Modal ───────────────────────────────────────────────────────── */
function EnquiryModal({ service, onClose }) {
  const [form, setForm] = useState({ name: "", mobile: "", message: "" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.mobile.trim()) {
      toast.error("Name and mobile are required.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success(
      `Enquiry sent for "${service.name}"! We'll contact you soon.`,
    );
    onClose();
  };
 
useEffect(() => {
  console.log(service,"service");
  
}, [service])

  return (
    <AnimatePresence>
      <motion.div
        key="bd"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40"
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
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white">
                  Send Enquiry
                </h2>
                <p className="text-[11px] text-white/70 mt-0.5 truncate max-w-[200px]">
                  {service.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
         <div className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="h-10 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700">
              {service?.Name}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="h-10 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700">
              {service?.EmailId}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <div className="h-10 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700">
              {service?.MobileNo}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Message (Optional)
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={set("message")}
              placeholder="Tell us what you need..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition-all"
            />
          </div>
        </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-xs font-bold text-white shadow-md disabled:opacity-60 transition-all"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Mail className="h-3.5 w-3.5" />
              )}
              {loading ? "Sending…" : "Send Enquiry"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Service Card ────────────────────────────────────────────────────────── */
function ServiceCard({ service, index, onEnquire }) {
  const Icon = getIcon(service.name);
  const grad = getGrad(index);
  const hasChildren = service.children?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={`${glassCard} p-5 flex flex-col gap-4 group cursor-default`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} shadow-md`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        {service.isActive !== false && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        )}
      </div>

      {/* Name & description */}
      <div className="flex-1">
        <h3 className="text-sm font-black text-slate-900 leading-tight">
          {service.name}
        </h3>
        {service._raw?.serviceDescription && (
          <p className="mt-1 text-[11.5px] text-slate-500 line-clamp-2">
            {service._raw.serviceDescription}
          </p>
        )}
      </div>

      {/* Sub-services chips */}
      {hasChildren && (
        <div className="flex flex-wrap gap-1">
          {service.children.slice(0, 3).map((child) => (
            <span
              key={child.id}
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
            >
              {child.name}
            </span>
          ))}
          {service.children.length > 3 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              +{service.children.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Enquire button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onEnquire(service)}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${grad} shadow-sm hover:shadow-md transition-all`}
      >
        <Phone className="h-3.5 w-3.5" /> Enquire Now
        <ArrowRight className="h-3 w-3" />
      </motion.button>
    </motion.div>
  );
}

/* ── Flat list builder from API ──────────────────────────────────────────── */
function buildDisplayList(flatList) {
  if (!Array.isArray(flatList) || !flatList.length) return [];
  const map = {};
  const roots = [];
  flatList.forEach((item) => {
    const id = item.ServiceID ?? item.serviceID;
    const pid = item.ParentServiceID ?? item.parentServiceID ?? 0;
    map[id] = {
      id: String(id),
      name: item.ServiceName ?? item.serviceName ?? "",
      isActive:
        (item.IsActive ?? item.isActive) === 1 ||
        (item.IsActive ?? item.isActive) === true,
      children: [],
      _raw: item,
    };
  });
  flatList.forEach((item) => {
    const id = item.ServiceID ?? item.serviceID;
    const pid = item.ParentServiceID ?? item.parentServiceID ?? 0;
    if (!pid || !map[pid]) roots.push(map[id]);
    else map[pid].children.push(map[id]);
  });
  return roots.filter((s) => s.isActive);
}

/* ── LOCAL FALLBACK DATA ─────────────────────────────────────────────────── */
const LOCAL_SERVICES = [
  {
    id: "1",
    name: "Consulting Services",
    isActive: true,
    children: [
      { id: "1-1", name: "EPC Consultancy", isActive: true, children: [] },
      { id: "1-2", name: "Project Management", isActive: true, children: [] },
    ],
    _raw: {
      serviceDescription:
        "Expert consulting for construction & infrastructure projects.",
    },
  },
  {
    id: "2",
    name: "Contractor Services",
    isActive: true,
    children: [
      { id: "2-1", name: "Civil Contractor", isActive: true, children: [] },
      {
        id: "2-2",
        name: "Electrical Contractor",
        isActive: true,
        children: [],
      },
    ],
    _raw: {
      serviceDescription:
        "Connect with verified contractors for your projects.",
    },
  },
  {
    id: "3",
    name: "Legal & Contracts",
    isActive: true,
    children: [
      { id: "3-1", name: "Contract Drafting", isActive: true, children: [] },
      { id: "3-2", name: "Legal Advisory", isActive: true, children: [] },
    ],
    _raw: {
      serviceDescription:
        "Comprehensive legal support for construction contracts and agreements.",
    },
  },
  {
    id: "4",
    name: "Marketing & Branding",
    isActive: true,
    children: [
      { id: "4-1", name: "Digital Marketing", isActive: true, children: [] },
      { id: "4-2", name: "Brand Strategy", isActive: true, children: [] },
    ],
    _raw: {
      serviceDescription:
        "Boost your brand presence in the construction industry.",
    },
  },
  {
    id: "5",
    name: "Assets Management",
    isActive: true,
    children: [],
    _raw: {
      serviceDescription:
        "Professional management of your construction assets and equipment.",
    },
  },
  {
    id: "6",
    name: "Tender Services",
    isActive: true,
    children: [
      { id: "6-1", name: "Tender Documentation", isActive: true, children: [] },
      { id: "6-2", name: "Bid Management", isActive: true, children: [] },
    ],
    _raw: {
      serviceDescription:
        "End-to-end tender management for government and private projects.",
    },
  },
  {
    id: "7",
    name: "Material Supply",
    isActive: true,
    children: [
      { id: "7-1", name: "Cement & Aggregates", isActive: true, children: [] },
      { id: "7-2", name: "Steel & Metals", isActive: true, children: [] },
      { id: "7-3", name: "Electrical Materials", isActive: true, children: [] },
    ],
    _raw: {
      serviceDescription:
        "Source quality construction materials from verified suppliers.",
    },
  },
  {
    id: "8",
    name: "Contraction Audit",
    isActive: true,
    children: [],
    _raw: {
      serviceDescription:
        "Independent audit services to ensure quality and compliance on-site.",
    },
  },
];

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function IndividualMyServices() {
  const [search, setSearch] = useState("");
  const [enquiryService, setEnquiryService] = useState(null);
  const { loginResponce } = useUserStore();

  const userId = loginResponce?.userId || 0;

   
  const { data: userservicesdetails = [], isLoading: userservicesdetailsLoading,isError,isFetching  } =
    useQuery({
      queryKey: ["userservicesdetails", userId],
      queryFn: () => UserServiceDetails(userId),
      enabled: !!userId,
      retry: false,
    });
    useEffect(() => {
      console.log(userservicesdetails,"UserServiceDetails");
      
    }, [userservicesdetails])
    
  const services = useMemo(() => {
    const list =
      isError || !userservicesdetails?.length
        ? LOCAL_SERVICES
        : buildDisplayList(userservicesdetails);
    if (!search.trim()) return list;
    const term = search.toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s._raw?.serviceDescription?.toLowerCase().includes(term) ||
        s.children?.some((c) => c.name.toLowerCase().includes(term)),
    );
  }, [userservicesdetails, isError, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        icon={Briefcase}
        title="My Services"
        subtitle="Browse available services and send an enquiry directly to our team."
        accent="indigo"
      />

      {/* Search + refresh bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>

        <span className="text-[11px] font-semibold text-slate-400">
          {services.length} service{services.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Loading */}
      {userservicesdetailsLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-xs font-medium text-slate-400">
            Loading services…
          </p>
        </div>
      )}

      {/* Fallback notice */}
      {isError && !userservicesdetailsLoading && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
          <Zap className="h-3.5 w-3.5 flex-shrink-0" />
          Showing demo data — live services unavailable right now.
        </div>
      )}

      {/* Empty state */}
      {!userservicesdetailsLoading && services.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Briefcase className="h-7 w-7 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-500">No services found</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!userservicesdetailsLoading && services?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services?.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              index={i}
              onEnquire={setEnquiryService}
            />
          ))}
        </div>
      )}

      {/* Enquiry modal */}
      {enquiryService && (
        <EnquiryModal
          service={enquiryService}
          onClose={() => setEnquiryService(null)}
        />
      )}
    </div>
  );
}
