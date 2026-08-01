import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Briefcase,
  CreditCard,
  Eye,
  Plus,
  Loader2,
  X,
  Lock,
  IndianRupee,
  Crown,
  Calendar,
  Layers,
  Clock,
  Tag,
  Users,
  Star,
} from "lucide-react";
import CustomHeading from "../../common/CustomHeading";
import DataTableComponent from "../../common/dataTable";
import { useUserStore } from "../../../store/store";
import {
  planMasterGet,
  planMasterGetById,
  userBankDetailbyParams,
  UserPaymentHistorySave,
  UserSubscriptionDetailGet,
  userSubscriptionDetailSave,
} from "../../../services/api";
import dayjs from "dayjs";
// ─── API helpers ───────────────────────────────────────────────────────────────
const fetchPlans = async (userType) => {
  const res = await planMasterGetById(`userType=${userType}`);

  return res?.data ?? [];
};

const fetchSubscriptions = async (userId) => {
  const res = await UserSubscriptionDetailGet(`userId=${userId}`);
  return res?.data ?? [];
};
const userBankDetailbyParamsApi = async (userId) => {
  const res = await userBankDetailbyParams(`userId=${userId}`);
  return res?.data ?? [];
};

// ─── Formatters ────────────────────────────────────────────────────────────────
const formatPrice = (price) => {
  if (price == null || price === "") return "—";
  const num = Number(price);
  if (isNaN(num)) return price;
  return num === 0 ? "Free" : `₹${num?.toLocaleString("en-IN")}`;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

// ─── Plan Detail Modal ─────────────────────────────────────────────────────────
function PlanDetailModal({ plan, onClose, onSubscribe }) {
  const price = plan?.Price ?? 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
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
          className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        >
          {/* Header gradient */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-4 w-4 text-yellow-300" />
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                    {plan?.DurationType ?? "Plan"}
                  </span>
                </div>
                <h2 className="text-2xl font-black">
                  {plan?.PlanName ?? "Plan"}
                </h2>
                <p className="text-indigo-200 text-xs mt-1">
                  {plan?.Remark ?? ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex items-end gap-1">
              <IndianRupee className="h-6 w-6 mb-0.5 text-white/80" />
              <span className="text-4xl font-black">
                {price === 0 ? "Free" : price?.toLocaleString("en-IN")}
              </span>
              {price > 0 && (
                <span className="text-indigo-200 text-sm mb-1">
                  / {plan?.DurationType?.toLowerCase() ?? "period"}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                // { icon: Tag,    label: "Plan ID",      value: `#${plan?.PlanID}` },
                {
                  icon: Clock,
                  label: "Duration",
                  value: plan?.DurationType ?? "—",
                },
                // {
                //   icon: Star,
                //   label: "Credits",
                //   value: plan?.CreditsIncluded ?? 0,
                // },
                {
                  icon: Layers,
                  label: "Max Services",
                  value: plan?.maxNoofServices ?? "—",
                },
                {
                  icon: Users,
                  label: "User Type",
                  value: plan?.UserTypeName || "All",
                },
                {
                  icon: CheckCircle2,
                  label: "Status",
                  value: Number(plan?.IsActive) === 1 ? "Active" : "Inactive",
                  color:
                    Number(plan?.IsActive) === 1
                      ? "text-emerald-600"
                      : "text-slate-400",
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p
                      className={`text-xs font-bold truncate ${color ?? "text-slate-800"}`}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSubscribe(plan)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg hover:opacity-90 flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── Subscription Detail Modal ─────────────────────────────────────────────────
function SubscriptionDetailModal({ sub, planMap, onClose }) {
  const plan = planMap[sub?.PlanID] ?? {};
  const isActive = Number(sub?.IsActive) === 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
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
          className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        >
          <div
            className={`p-6 text-white ${isActive
              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
              : "bg-gradient-to-br from-slate-500 to-slate-700"
              }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-4 w-4 text-yellow-300" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                    Subscription #{sub?.SubscriptionID}
                  </span>
                </div>
                <h2 className="text-2xl font-black">{sub?.PlanName}</h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isActive
                  ? "bg-white/20 border-white/30 text-white"
                  : "bg-white/10 border-white/20 text-white/70"
                  }`}
              >
                {isActive ? "● Active" : "○ Inactive"}
              </span>
              <span className="text-white/70 text-xs">
                {formatDate(sub?.EnterDate)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                // { icon: Tag,     label: "Plan ID",      value: `#${sub?.PlanID}` },
                {
                  icon: Clock,
                  label: "Duration",
                  value: plan?.DurationType ?? "—",
                },
                {
                  icon: IndianRupee,
                  label: "Price",
                  value: formatPrice(plan?.Price),
                },
                // {
                //   icon: Star,
                //   label: "Credits",
                //   value: plan?.CreditsIncluded ?? "—",
                // },
                {
                  icon: Layers,
                  label: "Max Services",
                  value: plan?.maxNoofServices ?? "—",
                },
                {
                  icon: Calendar,
                  label: "Subscribed On",
                  value: formatDate(sub?.EnterDate),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {sub?.Remark && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block mb-1">
                  Remark
                </span>
                {sub.Remark}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ plan, userId, onClose, onSuccess }) {
  const [step, setStep] = useState("payment");
  const { loginResponce } = useUserStore();

  const {
    mutate: saveUserPaymentHistorySave,
    isPending: isUserPaymentHistorySaving,
  } = useMutation({
    mutationFn: UserPaymentHistorySave,
    onSuccess: (res) => {
      if (res?.status) {
        toast.success("Payment history saved!");
        saveSubscription({
          // userSubscriptionID: 0,
          userID: userId,
          planID: plan?.PlanID,
          planName: plan?.PlanName ?? "",
          remark: plan?.Remark ?? "",
          enterredIP: "",
          enterredBy: userId,
          enterDate: new Date().toISOString(),
          isActive: 1,
        });
      } else {
        toast.error(res?.message ?? "Failed to save payment history");
        setStep("payment");
      }
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to save payment history");
      setStep("payment");
    },
  });

  const { mutate: saveSubscription, isPending: isSaving } = useMutation({
    mutationFn: userSubscriptionDetailSave,
    onSuccess: (res) => {
      if (res?.status) {
        setStep("success");
        // toast.success(res?.message ?? "Subscription saved successfully!");
      } else {
        toast.error(res?.message ?? "Subscription failed");
        setStep("payment");
      }
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to save subscription");
      setStep("payment");
    },
  });

  // ── Initialize Razorpay Payment ────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    try {
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh the page.");
        return;
      }

      setStep("processing");

      const options = {
        key: "rzp_test_TBIngVA6fjYaLH", // Test Key ID
        amount: Number(plan?.Price || 0) * 100, // Amount in paise
        currency: "INR",
        name: "Contracts India",
        description: plan?.PlanName,
        image: "/logo.png",
        handler: async function (response) {
          console.log("Payment Success:", response);

          // Save payment history on successful payment
          saveUserPaymentHistorySave({
            userID: userId,
            TransactionID: response?.razorpay_payment_id ?? "",
            payment: plan?.Price ?? 0,
            paymentStatus: "Success",
            paymentMode: "Card",
            remark: plan?.PlanName ?? "",
            enterredBy: userId,
            enterDate: new Date().toISOString(),
            TransactionDate: new Date().toISOString(),
            isActive: 1,
          });
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
            setStep("payment");
            toast.error("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Failed to initialize payment gateway");
      setStep("payment");
    }
  };

  // ── Handle Free Plan ────────────────────────────────────────────────────────
  const handleFreePlan = () => {
    setStep("processing");
    saveUserPaymentHistorySave({
      userID: userId,
      payment: 0,
      paymentStatus: "Success",
      paymentMode: "Card",
      remark: plan?.PlanName ?? "",
      enterredBy: userId,
      enterDate: new Date().toISOString(),
      isActive: 1,
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={step === "payment" ? onClose : undefined}
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
      >
        {step === "payment" && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Complete Payment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Subscribing to{" "}
                  <span className="font-bold text-indigo-600">
                    {plan?.PlanName}
                  </span>
                  {" · "}
                  <span className="text-slate-400">{plan?.DurationType}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Amount card */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-200 font-semibold uppercase tracking-widest">
                    Total Amount
                  </p>
                  <p className="text-3xl font-black mt-1 flex items-center gap-1">
                    {plan?.Price == 0 ? (
                      "Free"
                    ) : (
                      <>
                        <IndianRupee className="h-6 w-6" />
                        {plan?.Price?.toLocaleString("en-IN")}
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-indigo-200">Credits</p>
                  <p className="text-xl font-black">
                    {plan?.CreditsIncluded ?? 0}
                  </p>
                  <p className="text-[10px] text-indigo-300">
                    Max {plan?.maxNoofServices ?? 0} services
                  </p>
                </div>
              </div>
            </div>

            {plan?.Price > 0 ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-blue-700 font-semibold">
                  💳 You will be redirected to Razorpay secure payment gateway
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <p className="text-sm font-bold text-emerald-700">
                  ✓ This plan is free — no payment required.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRazorpayPayment()}
                disabled={isUserPaymentHistorySaving || isSaving}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all ${isUserPaymentHistorySaving || isSaving
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90"
                  }`}
              >
                {isUserPaymentHistorySaving || isSaving ? (
                  <>
                    <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
                    Processing…
                  </>
                ) : plan?.Price === 0 ? (
                  "Activate Free Plan"
                ) : (
                  `Pay ${formatPrice(plan?.Price)}`
                )}
              </motion.button>
            </div>
            <p className="text-center text-[10px] text-slate-400">
              Secure payment · SSL encrypted · Powered by Razorpay
            </p>
          </div>
        )}

        {step === "processing" && (
          <div className="p-14 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-sm font-bold text-slate-700">
              Processing your payment…
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
            </motion.div>
            <h3 className="text-lg font-black text-slate-900">
              Subscription Activated!
            </h3>
            <p className="text-sm text-slate-500 text-center">
              You are now subscribed to{" "}
              <span className="font-bold text-indigo-600">
                {plan?.PlanName}
              </span>
              .
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSuccess}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg"
            >
              Done
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function PlansAndSubscriptions() {
  const { loginResponce } = useUserStore();
  const userId = loginResponce?.userId;
  const userType = loginResponce?.userType;
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("plans");
  const [detailPlan, setDetailPlan] = useState(null); // plan detail modal
  const [paymentPlan, setPaymentPlan] = useState(null); // payment modal
  const [detailSub, setDetailSub] = useState(null); // subscription detail modal

  // ── Fetch plans ─────────────────────────────────────────────────────────────
  const {
    data: plans = [],
    isLoading: plansLoading,
    refetch: refetchPlans,
    isFetching: plansFetching,
  } = useQuery({
    queryKey: ["planMasterGetById", userType],
    queryFn: () => fetchPlans(userType),
    enabled: !!userType,
    retry: 1,
  });

  // ── Fetch subscriptions ──────────────────────────────────────────────────────
  const {
    data: subscriptions = [],
    isLoading: subsLoading,
    refetch: refetchSubs,
    isFetching: subsFetching,
  } = useQuery({
    queryKey: ["subscriptionHistory", userId],
    queryFn: () => fetchSubscriptions(userId),
    enabled: !!userId,
    retry: 1,
  });

  // ── PlanID → plan detail lookup ──────────────────────────────────────────────
  const planMap = useMemo(() => {
    const map = {};
    plans?.forEach((p) => {
      map[p?.PlanID] = p;
    });
    return map;
  }, [plans]);

  // ── Active plan = subscriptions[0] with IsActive:1 ──────────────────────────
  const activeSub = subscriptions[0]?.IsActive === 1 ? subscriptions[0] : null;

  const handlePaymentSuccess = () => {
    setPaymentPlan(null);
    refetchSubs();
    refetchPlans();
    queryClient.invalidateQueries({ queryKey: ["userSubscriptions", userId] });
  };

  // ── Plan table columns ───────────────────────────────────────────────────────
  const planColumns = [
    {
      title: "Plan",
      key: "PlanName",
      render: (_, r) => (
        <div>
          <p className="font-bold text-slate-800">{r?.PlanName ?? "—"}</p>
          <p className="text-[10px] text-slate-400">
            {r?.UserTypeName || "All users"}
          </p>
        </div>
      ),
    },
    {
      title: "Price",
      key: "Price",
      render: (_, r) => (
        <span className="font-black text-indigo-600">
          {formatPrice(r?.Price)}
        </span>
      ),
    },
    // {
    //   title: "Credits",
    //   key: "CreditsIncluded",
    //   render: (_, r) => (
    //     <span className="font-semibold text-slate-700">
    //       {r?.CreditsIncluded ?? 0}
    //     </span>
    //   ),
    // },
    {
      title: "Duration",
      key: "DurationType",
      render: (_, r) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-100">
          {r?.DurationType ?? "—"}
        </span>
      ),
    },
    {
      title: "Max Services",
      key: "maxNoofServices",
      render: (_, r) => (
        <span className="font-semibold text-slate-700">
          {r?.maxNoofServices ?? "—"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDetailPlan(r)}
            className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPaymentPlan(r)}
            className="h-8 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold flex items-center gap-1 hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Subscribe
          </motion.button>
        </div>
      ),
    },
  ];

  // ── Subscription table columns ───────────────────────────────────────────────
  const subscriptionColumns = [
    {
      title: "Plan",
      key: "PlanName",
      render: (_, r) => (
        <div>
          <p className="font-bold text-slate-800">{r?.PlanName ?? "—"}</p>
          {/* <p className="text-[10px] text-slate-400">ID #{r?.SubscriptionID}</p> */}
        </div>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, r) => (
        <span className="font-semibold text-md bold text-slate-500">
          ₹{r?.amount?.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      title: "Subscribed On",
      key: "subscriptionDate",
      render: (_, r) => (
        <span className="text-xs text-slate-600">{r?.subscriptionDate}</span>
      ),
    },
    // {
    //   title: "Plan Expiry Date",
    //   key: "planExpiryDate",
    //   render: (_, r) => (
    //     <span className="text-xs text-slate-600">
    //       {(r?.planExpiryDate)}
    //     </span>
    //   ),
    // },
    // {
    //   title: "",
    //   key: "planExpiryDate",
    //   render: (_, r) => (
    //     <span className="text-xs text-slate-600">
    //       {(r?.planExpiryDate)}
    //     </span>
    //   ),
    // },
    {
      title: "Status",
      key: "IsActive",

      render: (_, r) => {
        const isActive = Number(r?.IsActive) === 1;

        const expiryDate = dayjs(r?.planExpiryDate, "DD/MM/YYYY");
        const isExpired = expiryDate.isBefore(dayjs(), "day");

        let status = "Inactive";
        let classes = "bg-slate-100 text-slate-500 border-slate-200";
        let dotClass = "bg-slate-400";

        if (isExpired) {
          status = "Expired";
          classes = "bg-red-50 text-red-700 border-red-200";
          dotClass = "bg-red-500";
        } else if (isActive) {
          status = "Active";
          classes = "bg-emerald-50 text-emerald-700 border-emerald-200";
          dotClass = "bg-emerald-500";
        }

        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${classes}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${dotClass} ${status !== "Inactive" ? "animate-pulse" : ""
                }`}
            />
            {status}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <button
          onClick={() => setDetailSub(r)}
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
          title="View details"
        >
          <Eye className="h-4 w-4 text-slate-500" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <CustomHeading
        title="Plans & Subscriptions"
        subtitle="Browse available plans and manage your subscription history."
        icon={Briefcase}
        badge={
          tab === "plans"
            ? `${plans?.length} plans`
            : `${subscriptions.length} records`
        }
        badgeColor="violet"
      />

      {/* Active plan banner */}
      {activeSub && (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <Crown className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-700">
              Active: {activeSub.PlanName}
            </p>
            <p className="text-[10px] text-emerald-600">
              Subscription #{activeSub.SubscriptionID} · since{" "}
              {formatDate(activeSub.EnterDate)}
            </p>
          </div>
          <button
            onClick={() => setDetailSub(activeSub)}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold hover:bg-emerald-200 transition-colors"
          >
            View
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 w-fit">
        {[
          { key: "plans", label: "Available Plans" },
          { key: "subscriptions", label: "My Subscriptions" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${tab === t.key
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tables */}
      <div className="space-y-6">
        {tab === "plans" ? (
          plansLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              <p className="text-xs text-slate-400">Loading plans…</p>
            </div>
          ) : (
            <DataTableComponent
              title="Available Plans"
              icon={Briefcase}
              accent="indigo"
              cols={planColumns}
              rows={plans}
              onRefresh={refetchPlans}
              loading={plansFetching && !plansLoading}
            />
          )
        ) : subsLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <p className="text-xs text-slate-400">Loading subscriptions…</p>
          </div>
        ) : (
          <DataTableComponent
            title="My Subscriptions"
            icon={CreditCard}
            accent="violet"
            cols={subscriptionColumns}
            rows={subscriptions}
            onRefresh={refetchSubs}
            loading={subsFetching && !subsLoading}
          />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Plan detail modal — Eye button */}
        {detailPlan && !paymentPlan && (
          <PlanDetailModal
            key="plan-detail"
            plan={detailPlan}
            onClose={() => setDetailPlan(null)}
            onSubscribe={(p) => {
              setDetailPlan(null);
              setPaymentPlan(p);
            }}
          />
        )}

        {/* Payment modal — Subscribe button */}
        {paymentPlan && (
          <PaymentModal
            key="payment-modal"
            plan={paymentPlan}
            userId={userId}
            onClose={() => setPaymentPlan(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {/* Subscription detail modal — Eye on subscriptions tab */}
        {detailSub && (
          <SubscriptionDetailModal
            key="sub-detail"
            sub={detailSub}
            planMap={planMap}
            onClose={() => setDetailSub(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
