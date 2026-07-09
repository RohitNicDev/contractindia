/**
 * SubscriptionPlansFlow
 *
 * Full flow triggered by "Subscribe" or "View Plans" in the app.
 * Screens:
 *   1. PlansPage      — pick a plan (Duration filter)
 *   2. SuccessPage    — confirmation after payment
 *
 * Payment flow:
 *   - User selects plan
 *   - Saves subscription to API (inactive state)
 *   - Triggers Razorpay payment gateway
 *   - On success: saves payment history + activates subscription
 *   - Shows success screen
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Zap,
  Shield,
  Crown,
  ArrowRight,
  CreditCard,
  Lock,
  Sparkles,
  Check,
  Star,
  Users,
  BarChart3,
  Headphones,
  Rocket,
  ChevronRight,
  BadgeCheck,
  IndianRupee,
  Clock,
  Layers,
} from "lucide-react";
import CommonModal from "../../common/CommonModal";
import { useUserStore } from "../../../store/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  planMasterGetById,
  userSubscriptionDetailSave,
  UserPaymentHistorySave,
} from "../../../services/api";
import { toast } from "sonner";

const getPlanStyle = (index, planName) => {
  const styles = [
    {
      icon: Zap,
      color: "sky",
      gradient: "from-sky-500 to-blue-600",
      lightBg: "bg-sky-50",
      border: "border-sky-200",
      text: "text-sky-700",
      badge: null,
    },
    {
      icon: Shield,
      color: "violet",
      gradient: "from-violet-600 to-fuchsia-600",
      lightBg: "bg-violet-50",
      border: "border-violet-300",
      text: "text-violet-700",
      badge: "Most popular",
    },
    {
      icon: Crown,
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      badge: "Best value",
    },
  ];

  const nameLower = (planName || "").toLowerCase();
  if (
    nameLower.includes("standard") ||
    nameLower.includes("basic") ||
    nameLower.includes("starter")
  ) {
    return styles[0];
  } else if (nameLower.includes("gold") || nameLower.includes("pro")) {
    return styles[1];
  } else if (
    nameLower.includes("premium") ||
    nameLower.includes("enterprise") ||
    nameLower.includes("platinum")
  ) {
    return styles[2];
  }
  return styles[index % styles.length];
};

const TRUST = [
  { icon: Users, label: "12,000+ customers" },
  { icon: Shield, label: "SOC 2 certified" },
  { icon: BarChart3, label: "99.9% uptime SLA" },
  { icon: Headphones, label: "24/7 support" },
];

/* ── sub-components ─────────────────────────────────────────────────────── */

function PlanCard({ plan, selected, onSelect }) {
  const Icon = plan.icon || Zap;
  const isSelected = selected?.PlanID === plan.PlanID;

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      onClick={() => onSelect(plan)}
      className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? `${plan.border} shadow-lg bg-white`
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* popular / value badge */}
      {plan.badge && (
        <div
          className={`absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r z-999 ${plan.gradient} shadow`}
        >
          {plan.badge}
        </div>
      )}

      {/* selected ring */}
      {isSelected && (
        <div
          className={`absolute inset-0 rounded-2xl ring-2 ring-offset-2 bg-gradient-to-r ${plan.gradient} opacity-0`}
        />
      )}

      <div className="flex items-start justify-between mb-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        {isSelected && (
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}
          >
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </div>

      <p className="font-black text-slate-900 text-sm mb-0.5">
        {plan.PlanName}
      </p>
      <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
        {plan.description || plan.Remark || "Plan for your needs"}
      </p>

      <div className="mb-4">
        <span className={`text-3xl font-black ${plan.text}`}>
          ₹{plan.Price || 0}
        </span>
        <span className="text-xs text-slate-400 ml-1">
          /{plan.DurationType?.toLowerCase().replace("ly", "") || "mo"}
        </span>
      </div>

      {/* Features */}
      <ul className="space-y-1.5">
        <li className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${plan.text}`} />
          Up to {plan.maxNoofServices} active services
        </li>
        <li className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${plan.text}`} />
          {plan.CreditsIncluded || 0} credits included
        </li>
        <li className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${plan.text}`} />
          {plan.DurationType || "Monthly"} billing
        </li>
      </ul>

      <button
        type="button"
        className={`mt-5 w-full h-9 rounded-xl text-xs font-black transition-all ${
          isSelected
            ? `bg-gradient-to-r ${plan.gradient} text-white shadow-md`
            : "border border-slate-200 text-slate-700 hover:bg-slate-50"
        }`}
      >
        {isSelected ? "Selected" : "Select plan"}
      </button>
    </motion.div>
  );
}

/* ── SCREEN 1: Plans ────────────────────────────────────────────────────── */
function PlansPage({ onNext, currentPlanId, plans = [], isLoading = false }) {
  const durations = [
    "All",
    ...new Set(plans.map((p) => p.DurationType).filter(Boolean)),
  ];
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (plans && plans.length > 0 && !selected) {
      setSelected(plans.find((p) => p.PlanID !== currentPlanId) ?? plans[0]);
    }
  }, [plans, selected, currentPlanId]);

  const filteredPlans =
    selectedDuration === "All"
      ? plans
      : plans.filter((p) => p.DurationType === selectedDuration);

  useEffect(() => {
    if (filteredPlans.length > 0) {
      const isStillVisible = filteredPlans.some(
        (p) => p.PlanID === selected?.PlanID,
      );
      if (!isStillVisible) {
        setSelected(filteredPlans[0]);
      }
    }
  }, [selectedDuration, filteredPlans, selected]);

  return (
    <div className="flex flex-col h-full">
      {/* heading */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-violet-50 border border-violet-200">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-[11px] font-bold text-violet-700">
            Choose your plan
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-1">
          Select the right plan for you
        </h2>
        <p className="text-sm text-slate-500">
          No hidden fees. Cancel anytime.
        </p>
      </div>

      {/* billing toggle */}
      {durations.length > 1 && (
        <div className="flex justify-center mb-5">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {durations.map((duration) => {
              const active = selectedDuration === duration;
              return (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setSelectedDuration(duration)}
                  className={`flex items-center gap-1.5 h-7 px-4 rounded-lg text-xs font-bold transition-all duration-200 ${
                    active
                      ? "bg-white text-violet-700 shadow-sm border border-violet-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {duration}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* plan cards */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-500 font-bold">Loading plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-slate-500">
              No plans available for this duration.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.PlanID}
                plan={plan}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}

        {/* trust bar */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TRUST.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-500 font-medium"
            >
              <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
        <div>
          <p className="text-xs text-slate-500">
            Selected:{" "}
            <span className="font-bold text-slate-800">
              {selected?.PlanName || "—"}
            </span>
          </p>
          <p className="text-[11px] text-slate-400">
            ₹{selected?.Price || 0}/
            {selected?.DurationType
              ? selected.DurationType.toLowerCase().replace("ly", "")
              : "mo"}
          </p>
        </div>
        <button
          type="button"
          disabled={!selected}
          onClick={() => onNext(selected)}
          className="flex items-center gap-2 h-9 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-black shadow-md shadow-violet-200 hover:scale-[1.02] transition-transform disabled:opacity-55 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── SCREEN 2: Success ──────────────────────────────────────────────────── */
function SuccessPage({ plan, onClose, onDashboard }) {
  const today = new Date();
  const expires = new Date(today);

  const isYearly = plan?.DurationType === "Yearly";
  const isWeekly = plan?.DurationType === "Weekly";
  if (isYearly) {
    expires.setFullYear(today.getFullYear() + 1);
  } else if (isWeekly) {
    expires.setDate(today.getDate() + 7);
  } else {
    expires.setMonth(today.getMonth() + 1);
  }

  const fmt = (d) =>
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const PlanIcon = plan?.icon || Zap;

  const PERKS = [
    { icon: Rocket, label: "Your new features are live now" },
    { icon: BadgeCheck, label: "Confirmation sent to your email" },
    { icon: Star, label: `Next billing on ${fmt(expires)}` },
  ];

  const displayPrice = plan?.Price || 0;
  const displayDuration = plan?.DurationType
    ? `/${plan.DurationType.toLowerCase().replace("ly", "")}`
    : "/mo";

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-10 text-center">
      {/* animated checkmark */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
        className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${plan?.gradient} shadow-xl mb-6`}
      >
        <Check className="h-10 w-10 text-white" strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
          Payment successful
        </p>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Welcome to {plan?.PlanName}! 🎉
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
          Your subscription is active. All {plan?.PlanName} features are
          available immediately.
        </p>
      </motion.div>

      {/* perks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full max-w-sm space-y-2 mb-8"
      >
        {PERKS.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700"
          >
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${plan?.gradient}`}
            >
              <Icon className="h-3.5 w-3.5 text-white" />
            </div>
            {label}
          </motion.div>
        ))}
      </motion.div>

      {/* summary pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${plan?.border} ${plan?.lightBg} mb-8`}
      >
        <PlanIcon className={`h-4 w-4 ${plan?.text}`} />
        <span className={`text-xs font-black ${plan?.text}`}>
          {plan?.PlanName} · ₹{displayPrice}
          {displayDuration}
        </span>
        <span className="text-[10px] text-slate-400">
          · renews {fmt(expires)}
        </span>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onDashboard ?? onClose}
        className={`flex items-center gap-2 h-10 px-6 rounded-xl bg-gradient-to-r ${plan?.gradient} text-white text-sm font-black shadow-md hover:scale-[1.02] transition-transform`}
      >
        Go to dashboard <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

/* ── Step indicator ─────────────────────────────────────────────────────── */
function StepBar({ step }) {
  const steps = ["Choose plan", "Done"];
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50/60">
      {steps.map((label, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-all ${
                done
                  ? "bg-violet-600 text-white"
                  : current
                    ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={`text-[11px] font-bold ${current ? "text-slate-800" : done ? "text-violet-600" : "text-slate-400"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-px mx-1 ${i < step ? "bg-violet-300" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── ROOT COMPONENT ─────────────────────────────────────────────────────── */
export default function SubscriptionPlansFlow({
  open,
  onClose,
  currentPlanId = "starter",
  dashboardPath = "",
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve logged-in user details
  const loginResponse = useUserStore((state) => state?.loginResponce);
  const userId = loginResponse?.userId || 0;
  const userType = loginResponse?.userType || 0;

  // Fetch plans dynamically
  const { data: rawPlans = [], isLoading: isPlansLoading } = useQuery({
    queryKey: ["planMasterGetById", userType],
    queryFn: async () => {
      const response = await planMasterGetById(`userType=${userType}`);
      return response?.data ?? [];
    },
    enabled: open && !!userType,
  });

  // Map API plans to UI structure with dynamic styling
  const plans = rawPlans.map((plan, idx) => {
    const style = getPlanStyle(idx, plan.PlanName || "");
    return {
      ...plan,
      icon: style.icon,
      color: style.color,
      gradient: style.gradient,
      lightBg: style.lightBg,
      border: style.border,
      text: style.text,
      badge: style.badge,
      description:
        plan.Remark || `Plan for ${plan.UserTypeName || "Commercial"} users`,
    };
  });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0);
        setSelectedPlan(null);
        setIsLoading(false);
      }, 400);
    }
  }, [open]);

  // ── Save subscription + trigger Razorpay ────────────────────────────────
  const { mutateAsync: saveSubscription } = useMutation({
    mutationFn: userSubscriptionDetailSave,
  });

  const { mutateAsync: savePaymentHistory } = useMutation({
    mutationFn: UserPaymentHistorySave,
  });

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    setIsLoading(true);

    try {
      // Step 1: Save subscription (inactive state)
      const subPayload = {
        userSubscriptionID: 0,
        userID: userId,
        planID: plan.PlanID,
        planName: plan.PlanName || "",
        remark: plan.Remark || "",
        enterredBy: userId,
        enterDate: new Date().toISOString(),
        isActive: 0, // Will be activated after payment
      };

      const subRes = await saveSubscription(subPayload);
      if (!subRes?.status) {
        toast.error(subRes?.message || "Failed to prepare subscription");
        setIsLoading(false);
        return;
      }

      // Step 2: Trigger Razorpay Payment
      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_TBIngVA6fjYaLH", // Test Key ID
        amount: Number(plan.Price || 0) * 100, // Amount in paise
        currency: "INR",
        name: "ContractsIndia",
        description: plan.PlanName,
        image: "/logo.png",
        handler: async function (response) {
          console.log("Payment Success:", response);

          try {
            // Step 3a: Save payment history
            await savePaymentHistory({
              userID: userId,
              TransactionID: response?.razorpay_payment_id ?? "",
              payment: plan.Price ?? 0,
              paymentStatus: "Success",
              paymentMode: "Card",
              remark: plan.PlanName ?? "",
              enterredBy: userId,
              enterDate: new Date().toISOString(),
              TransactionDate: new Date().toISOString(),
              isActive: 1,
            });

            // Step 3b: Activate subscription
            const activatePayload = {
              // userSubscriptionID: 0,
              userID: userId,
              planID: plan.PlanID,
              planName: plan.PlanName || "",
              remark: plan.Remark || "",
              enterredBy: userId,
              enterDate: new Date().toISOString(),
              isActive: 1, // Activate after payment
            };

            await saveSubscription(activatePayload);

            // Step 4: Show success screen
            setStep(1);
            toast.success(
              "Payment successful! Your subscription is now active.",
            );
          } catch (err) {
            console.error("Error after payment:", err);
            toast.error(
              "Payment received but activation failed. Please contact support.",
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: loginResponse?.userName || "",
          email: loginResponse?.emailId || "",
          contact: loginResponse?.mobileNo || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.error("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Plan selection error:", err);
      toast.error(err?.message || "Error processing plan selection");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleDashboard = () => {
    onClose?.();
    if (dashboardPath) {
      navigate(dashboardPath);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <CommonModal
            isOpen={open}
            onClose={handleClose}
            title="Subscription Plans"
            variant="info"
            size="xxl"
            hideFooter
          >
            {/* step bar */}
            <StepBar step={step} />

            {/* screen */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="s0"
                    className="flex-1 flex flex-col overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PlansPage
                      onNext={handleSelectPlan}
                      currentPlanId={currentPlanId}
                      plans={plans}
                      isLoading={isPlansLoading || isLoading}
                    />
                  </motion.div>
                )}
                {step === 1 && selectedPlan && (
                  <motion.div
                    key="s2"
                    className="flex-1 flex flex-col overflow-hidden"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SuccessPage
                      plan={selectedPlan}
                      onClose={handleClose}
                      onDashboard={handleDashboard}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CommonModal>
        </div>
      )}
    </>
  );
}
