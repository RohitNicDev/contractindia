import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  MapPin,
  CrossIcon,
  CalendarDays,
  CalendarClock,
} from "lucide-react";
import {
  getUserRegistrationbyParam,
  ServiceMasterGet,
  UserServiceDetailsGetbyParam,
} from "../../../services/api";
import { SectionHeader, glassCard } from "../Layout/DashboardLayout";
import { useUserStore } from "../../../store/store";

// Custom Modal component
import { CommonModal } from "../../common/CommonModal";

/* ── API ─────────────────────────────────────────────────────────────────── */
const fetchServices = async () => {
  const res = await ServiceMasterGet();
  return res?.data ?? [];
};

const UserServiceDetails = async (userId) => {
  const res = await UserServiceDetailsGetbyParam(`userId=${userId}`);
  return res?.data ?? [];
};

const userRegistrationbyDetails = async (userId) => {
  const res = await getUserRegistrationbyParam(`?userId=${userId}`);
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

/* ═════════════════════════════════════════════════════════════════════════  
   ENQUIRY MODAL (Re-designed with premium, read-only registration details)  
   ========================================================================= */
function EnquiryModal({ service, onClose }) {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = service?.userData || {};
  const userName = userData.Name || "—";
  const userEmail = userData.EmailId || "—";
  const userMobile = userData.MobileNo || "—";
  const userState = userData.StateName || "—";
  const userPincode = userData.PinCode || "—";

  const handleSubmit = async () => {
    // Validation matches direct registration data now
    if (userName === "—" || userMobile === "—") {
      toast.error("User registration details (Name and Mobile) are missing.");
      return;
    }

    if (!messageText.trim()) {
      toast.error("Please enter a message for your enquiry.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success(
        `Enquiry sent for "${service.name}"! We'll contact you soon.`,
      );
      setMessageText("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      isOpen={!!service}
      onClose={onClose}
      title="SERVICE DETAILS"
      subtitle={service?.name}
      icon={<Mail className="h-4 w-4" />}
      variant="default"
      size="md"
      // confirmLabel="Send Enquiry"
      cancelLabel="Cancel"
      // onConfirm={handleSubmit}
      isLoading={loading}
    >
      <div className="space-y-5">
        {/* Verification Checklist Banner */}
        {/* <div className="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">
            Verification Checklist
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Please review your read-only profile records below before submitting
            your request details.
          </p>
        </div> */}

        {/* User Registration Details (Read-only Fields) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Full Name
            </label>
            <p className="text-xs font-bold text-slate-700 mt-1">{userName}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Email Address
            </label>
            <p className="text-xs font-bold text-slate-700 mt-1 truncate">
              {userEmail}
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Mobile Number
            </label>
            <p className="text-xs font-bold text-slate-700 mt-1">
              {userMobile}
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
              State Region
            </label>
            <p className="text-xs font-bold text-slate-700 mt-1">{userState}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 col-span-2">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Location Pin Code
            </label>
            <p className="text-xs font-bold text-slate-700 mt-1">
              {userPincode}
            </p>
          </div>
        </div>

        {/* Message Input Box */}
        {/* <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-2">
            Your Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Tell us more about your enquiry and requirements..."
            rows={4}
            className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            {messageText.length} / 500 characters
          </p>
        </div> */}
      </div>
    </CommonModal>
  );
}

/* ==========================================================================  
   SERVICE CARD  
   ========================================================================== */
function ServiceCard({ service, index, onEnquire, activeEnquiryId }) {
  const Icon = getIcon(service.name);
  const grad = getGrad(index);
  const hasChildren = service.children?.length > 0;
  const isPendingOnCard = activeEnquiryId === service.id;

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
        {service.isActive !== false ? (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            <CalendarDays className="w-3 h-3" />
            Expiry
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
        whileHover={service.isActive == 1 ? { scale: 1.02 } : {}}
        whileTap={service.isActive == 1 ? { scale: 0.97 } : {}}
        onClick={() => service.isActive == 1 && onEnquire(service)}
        disabled={isPendingOnCard || service.isActive != 1}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all shadow-sm
    ${
      service.isActive == 1
        ? `text-white bg-gradient-to-r ${grad} hover:shadow-md`
        : "bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200"
    }
    disabled:opacity-75`}
      >
        {isPendingOnCard ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : service.isActive == 1 ? (
          <Phone className="h-3.5 w-3.5" />
        ) : (
          <CalendarClock className="h-3.5 w-3.5" />
        )}

        {isPendingOnCard
          ? "Retrieving Details..."
          : service.isActive == 1
            ? "Enquire Now"
            : "Expired"}

        {!isPendingOnCard && service.isActive == 1 && (
          <ArrowRight className="h-3 w-3" />
        )}
      </motion.button>
    </motion.div>
  );
}

/* ── Flat list builder from API ──────────────────────────────────────────── */
function buildDisplayList(flatList) {
  if (!Array.isArray(flatList) || !flatList.length) return [];

  return flatList.map((item, index) => ({
    id: String(item?.ServiceID ?? item?.serviceID ?? index + 1),
    name: item?.ServiceName ?? item?.serviceName ?? "Service",
    isActive:
      (item?.IsActive ?? item?.isActive) === 1 ||
      (item?.IsActive ?? item?.isActive) === true,
    children: [],
    _raw: item,
  }));
}

/* ── LOCAL FALLBACK DATA ─────────────────────────────────────────────────── */
const LOCAL_SERVICES = [
  // {
  //   id: "1",
  //   name: "Consulting Services",
  //   isActive: true,
  //   children: [
  //     { id: "1-1", name: "EPC Consultancy", isActive: true, children: [] },
  //     { id: "1-2", name: "Project Management", isActive: true, children: [] },
  //   ],
  //   _raw: {
  //     serviceDescription:
  //       "Expert consulting for construction & infrastructure projects.",
  //   },
  // },
  // {
  //   id: "2",
  //   name: "Contractor Services",
  //   isActive: true,
  //   children: [
  //     { id: "2-1", name: "Civil Contractor", isActive: true, children: [] },
  //     {
  //       id: "2-2",
  //       name: "Electrical Contractor",
  //       isActive: true,
  //       children: [],
  //     },
  //   ],
  //   _raw: {
  //     serviceDescription:
  //       "Connect with verified contractors for your projects.",
  //   },
  // },
  // {
  //   id: "3",
  //   name: "Legal & Contracts",
  //   isActive: true,
  //   children: [
  //     { id: "3-1", name: "Contract Drafting", isActive: true, children: [] },
  //     { id: "3-2", name: "Legal Advisory", isActive: true, children: [] },
  //   ],
  //   _raw: {
  //     serviceDescription:
  //       "Comprehensive legal support for construction contracts and agreements.",
  //   },
  // },
  // {
  //   id: "4",
  //   name: "Marketing & Branding",
  //   isActive: true,
  //   children: [
  //     { id: "4-1", name: "Digital Marketing", isActive: true, children: [] },
  //     { id: "4-2", name: "Brand Strategy", isActive: true, children: [] },
  //   ],
  //   _raw: {
  //     serviceDescription:
  //       "Boost your brand presence in the construction industry.",
  //   },
  // },
  // {
  //   id: "5",
  //   name: "Assets Management",
  //   isActive: true,
  //   children: [],
  //   _raw: {
  //     serviceDescription:
  //       "Professional management of your construction assets and equipment.",
  //   },
  // },
  // {
  //   id: "6",
  //   name: "Tender Services",
  //   isActive: true,
  //   children: [
  //     { id: "6-1", name: "Tender Documentation", isActive: true, children: [] },
  //     { id: "6-2", name: "Bid Management", isActive: true, children: [] },
  //   ],
  //   _raw: {
  //     serviceDescription:
  //       "End-to-end tender management for government and private projects.",
  //   },
  // },
  // {
  //   id: "7",
  //   name: "Material Supply",
  //   isActive: true,
  //   children: [
  //     { id: "7-1", name: "Cement & Aggregates", isActive: true, children: [] },
  //     { id: "7-2", name: "Steel & Metals", isActive: true, children: [] },
  //     { id: "7-3", name: "Electrical Materials", isActive: true, children: [] },
  //   ],
  //   _raw: {
  //     serviceDescription:
  //       "Source quality construction materials from verified suppliers.",
  //   },
  // },
  // {
  //   id: "8",
  //   name: "Contraction Audit",
  //   isActive: true,
  //   children: [],
  //   _raw: {
  //     serviceDescription:
  //       "Independent audit services to ensure quality and compliance on-site.",
  //   },
  // },
];

/* ==========================================================================  
   MAIN COMPONENT  
   ========================================================================== */
export default function IndividualMyServices() {
  const [search, setSearch] = useState("");
  const [enquiryService, setEnquiryService] = useState(null);
  const [activeEnquiryId, setActiveEnquiryId] = useState(null); // Tracks which card clicked "Enquire" to show spinner
  const { loginResponce } = useUserStore();

  const userId = loginResponce?.userId || 0;

  const {
    mutate: userRegistrationMutate,
    data: userRegistrationData,
    isPending: userRegistrationpending,
  } = useMutation({
    mutationFn: userRegistrationbyDetails,
  });

  const {
    data: userservicesdetails = [],
    isLoading: userservicesdetailsLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["userservicesdetails", userId],
    queryFn: () => UserServiceDetails(userId),
    enabled: !!userId,
    retry: false,
  });

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
  // Triggers mutation, fetches user profile sequentially, and binds to EnquiryModal automatically!
  const handleEnquireClick = (service) => {
    if (!userId) {
      toast.error("Please login to enquire about this service");
      return;
    }

    setActiveEnquiryId(service.id);
    userRegistrationMutate(userId, {
      onSuccess: (response) => {
        const userData = response?.[0] || response?.data?.[0] || {};
        setEnquiryService({
          ...service,
          userData: userData,
        });
        setActiveEnquiryId(null);
      },
      onError: (err) => {
        console.error(err);
        toast.error(
          "Failed to retrieve your registration details. Proceeding with default enquiry.",
        );
        setEnquiryService({
          ...service,
          userData: {},
        });
        setActiveEnquiryId(null);
      },
    });
  };

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
              onEnquire={handleEnquireClick}
              activeEnquiryId={activeEnquiryId}
            />
          ))}
        </div>
      )}

      {/* Enquiry modal (Renders dynamic, verified read-only user profile from the mutation!) */}
      {enquiryService && (
        <EnquiryModal
          service={enquiryService}
          onClose={() => setEnquiryService(null)}
        />
      )}
    </div>
  );
}
