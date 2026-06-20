/**
 * SubscriptionPlansFlow
 *
 * Full flow triggered by "Renew Plan" in the SubscriptionPlan widget.
 * Screens:
 *   1. PlansPage      — pick a plan (Monthly / Yearly toggle)
 *   2. CheckoutPage   — billing details + order summary
 *   3. SuccessPage    — confirmation
 *
 * Drop-in usage:
 *   import SubscriptionPlansFlow from "@/components/SubscriptionPlansFlow";
 *
 *   // In SubscriptionPlan, replace toast.info("Redirecting to plans…") with:
 *   const [showPlans, setShowPlans] = useState(false);
 *   ...
 *   onClick={() => setShowPlans(true)}
 *   ...
 *   <SubscriptionPlansFlow open={showPlans} onClose={() => setShowPlans(false)} />
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle2, Zap, Shield, Crown, ArrowRight,
  ArrowLeft, CreditCard, Lock, Sparkles, Check,
  Star, Users, BarChart3, Headphones, Rocket,
  ChevronRight, BadgeCheck,
} from "lucide-react";
import CommonModal from "../../common/CommonModal";
import { useUserStore } from "../../../store/store";
import { useQuery } from "@tanstack/react-query";
import { planMasterGet, userSubscriptionDetailSave, planMasterSave } from "../../../services/api";

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
  if (nameLower.includes("standard") || nameLower.includes("basic") || nameLower.includes("starter")) {
    return styles[0];
  } else if (nameLower.includes("gold") || nameLower.includes("pro")) {
    return styles[1];
  } else if (nameLower.includes("premium") || nameLower.includes("enterprise") || nameLower.includes("platinum")) {
    return styles[2];
  }
  return styles[index % styles.length];
};

/* ── Plan definitions ───────────────────────────────────────────────────── */
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    monthlyPrice: 9,
    yearlyPrice: 89,
    color: "sky",
    gradient: "from-sky-500 to-blue-600",
    lightBg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    badge: null,
    description: "Perfect for individuals getting started.",
    features: [
      "Up to 5 active services",
      "Basic analytics dashboard",
      "Email support (48h response)",
      "1 team member",
      "Standard templates",
    ],
    limits: { services: 5, members: 1 },
  },
  {
    id: "pro",
    name: "Pro",
    icon: Shield,
    monthlyPrice: 29,
    yearlyPrice: 279,
    color: "violet",
    gradient: "from-violet-600 to-fuchsia-600",
    lightBg: "bg-violet-50",
    border: "border-violet-300",
    text: "text-violet-700",
    badge: "Most popular",
    description: "For growing teams who need more power.",
    features: [
      "Unlimited active services",
      "Advanced analytics & reports",
      "Priority support (4h response)",
      "Up to 10 team members",
      "Custom templates",
      "API access",
      "Webhook integrations",
    ],
    limits: { services: "∞", members: 10 },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Crown,
    monthlyPrice: 79,
    yearlyPrice: 749,
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "Best value",
    description: "Full-featured for large organisations.",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "SLA guarantee (99.9% uptime)",
      "Unlimited team members",
      "Custom integrations",
      "SSO / SAML",
      "Audit logs",
      "On-boarding support",
    ],
    limits: { services: "∞", members: "∞" },
  },
];

const CARD_BRANDS = ["Visa", "Mastercard", "Amex", "RuPay"];

/* ── helpers ────────────────────────────────────────────────────────────── */
function price(plan, yearly) {
  return yearly ? plan.yearlyPrice : plan.monthlyPrice;
}
function savings(plan) {
  return plan.monthlyPrice * 12 - plan.yearlyPrice;
}

/* ── sub-components ─────────────────────────────────────────────────────── */

function PlanCard({ plan, selected, yearly, onSelect }) {
  const Icon = plan.icon || Zap;
  const isSelected = selected?.id === plan.id;

  const displayPrice = plan.price !== undefined ? plan.price : price(plan, yearly);
  const displayDuration = plan.durationType
    ? `/${plan.durationType.toLowerCase().replace("ly", "")}`
    : yearly ? "/yr" : "/mo";

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      onClick={() => onSelect(plan)}
      className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${isSelected
          ? `${plan.border} shadow-lg bg-white`
          : "border-slate-200 bg-white hover:border-slate-300"
        }`}
    >
      {/* popular / value badge */}
      {plan.badge && (
        <div className={`absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r z-999 ${plan.gradient} shadow`}>
          {plan.badge}
        </div>
      )}

      {/* selected ring */}
      {isSelected && (
        <div className={`absolute inset-0 rounded-2xl ring-2 ring-offset-2 bg-gradient-to-r ${plan.gradient} opacity-0`} />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {isSelected && (
          <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}>
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </div>

      <p className="font-black text-slate-900 text-sm mb-0.5">{plan.name}</p>
      <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">{plan.description}</p>

      <div className="mb-4">
        <span className={`text-3xl font-black ${plan.text}`}>
          ₹{displayPrice}
        </span>
        <span className="text-xs text-slate-400 ml-1">{displayDuration}</span>
        {!plan.durationType && yearly && (
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
            Save ₹{savings(plan)} vs monthly
          </p>
        )}
      </div>

      <ul className="space-y-1.5">
        {plan.features?.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${plan.text}`} />
            {f}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`mt-5 w-full h-9 rounded-xl text-xs font-black transition-all ${isSelected
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
  const durations = ["All", ...new Set(plans.map((p) => p.durationType).filter(Boolean))];
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (plans && plans.length > 0 && !selected) {
      setSelected(plans.find((p) => p.id !== currentPlanId) ?? plans[0]);
    }
  }, [plans, selected, currentPlanId]);

  const filteredPlans = selectedDuration === "All"
    ? plans
    : plans.filter((p) => p.durationType === selectedDuration);

  useEffect(() => {
    if (filteredPlans.length > 0) {
      const isStillVisible = filteredPlans.some((p) => p.id === selected?.id);
      if (!isStillVisible) {
        setSelected(filteredPlans[0]);
      }
    }
  }, [selectedDuration, filteredPlans, selected]);

  const TRUST = [
    { icon: Users, label: "12,000+ customers" },
    { icon: Shield, label: "SOC 2 certified" },
    { icon: BarChart3, label: "99.9% uptime SLA" },
    { icon: Headphones, label: "24/7 support" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* heading */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-violet-50 border border-violet-200">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-[11px] font-bold text-violet-700">Upgrade your plan</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Choose the right plan</h2>
        <p className="text-sm text-slate-500">No hidden fees. Cancel anytime.</p>
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
                  className={`flex items-center gap-1.5 h-7 px-4 rounded-lg text-xs font-bold transition-all duration-200 ${active
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
            <p className="text-sm text-slate-500">No plans configured for this type.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selected}
                yearly={selectedDuration === "Yearly"}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}

        {/* trust bar */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-500 font-medium">
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
            Selected: <span className="font-bold text-slate-800">{selected?.name || "—"}</span>
          </p>
          <p className="text-[11px] text-slate-400">
            ₹{selected?.price || 0}/{selected?.durationType ? selected.durationType.toLowerCase().replace("ly", "") : "mo"} · billed {selected?.durationType || "monthly"}
          </p>
        </div>
        <button
          type="button"
          disabled={!selected}
          onClick={() => onNext({ plan: selected, yearly: selected?.durationType === "Yearly" })}
          className="flex items-center gap-2 h-9 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-black shadow-md shadow-violet-200 hover:scale-[1.02] transition-transform disabled:opacity-55 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── SCREEN 2: Checkout ─────────────────────────────────────────────────── */
function CheckoutPage({ selection, onBack, onConfirm, isLoading }) {
  const { plan, yearly } = selection;
  const total = plan.price !== undefined ? plan.price : price(plan, yearly);
  const tax = Math.round(total * 0.18);
  const subtotal = total - tax;
  const PlanIcon = plan.icon || Zap;

  const [form, setForm] = useState({
    name: "", card: "", expiry: "", cvv: "", email: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const formatCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Cardholder name is required";
    if (form.card.replace(/\s/g, "").length < 16) e.card = "Enter a valid 16-digit card number";
    if (form.expiry.length < 5) e.expiry = "Enter expiry as MM/YY";
    if (form.cvv.length < 3) e.cvv = "CVV must be 3–4 digits";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (validate()) onConfirm();
  };

  const Field = ({ label, id, children, error }) => (
    <div>
      <label htmlFor={id} className="block text-[11px] font-semibold text-slate-500 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-0.5 font-medium">{error}</p>}
    </div>
  );

  const inp = (extra = "") =>
    `w-full rounded-xl border bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-violet-400 focus:bg-white ${extra}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* order summary */}
        <div className={`rounded-2xl border-2 ${plan.border} ${plan.lightBg} p-4`}>
          <div className="flex items-start gap-3 mb-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient}`}>
              <PlanIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">{plan.name} plan</p>
              <p className="text-[11px] text-slate-500">Billed {plan.durationType || (yearly ? "annually" : "monthly")}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`font-black text-base ${plan.text}`}>₹{total}</p>
              <p className="text-[10px] text-slate-400">/{plan.durationType ? plan.durationType.toLowerCase().replace("ly", "") : (yearly ? "yr" : "mo")}</p>
            </div>
          </div>
          <div className="border-t border-white/60 pt-3 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Subtotal</span><span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>GST (18%)</span><span>₹{tax}</span>
            </div>
            <div className={`flex justify-between text-xs font-black ${plan.text} pt-1 border-t border-white/60`}>
              <span>Total due today</span><span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* billing form */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <CreditCard className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Payment details</span>
          </div>

          <div className="space-y-3">
            <Field label="Email for receipt" id="email" error={errors.email}>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@company.com"
                className={inp(errors.email ? "border-red-300" : "border-slate-200")}
              />
            </Field>

            <Field label="Cardholder name" id="name" error={errors.name}>
              <input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Name as on card"
                className={inp(errors.name ? "border-red-300" : "border-slate-200")}
              />
            </Field>

            <Field label="Card number" id="card" error={errors.card}>
              <div className="relative">
                <input
                  id="card"
                  value={form.card}
                  onChange={(e) => set("card", formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={inp(`pr-20 ${errors.card ? "border-red-300" : "border-slate-200"}`)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  {CARD_BRANDS.slice(0, 2).map((b) => (
                    <span key={b} className="text-[9px] font-black text-slate-400 border border-slate-200 rounded px-1 bg-white">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry" id="expiry" error={errors.expiry}>
                <input
                  id="expiry"
                  value={form.expiry}
                  onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={inp(errors.expiry ? "border-red-300" : "border-slate-200")}
                />
              </Field>
              <Field label="CVV" id="cvv" error={errors.cvv}>
                <input
                  id="cvv"
                  value={form.cvv}
                  onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  className={inp(errors.cvv ? "border-red-300" : "border-slate-200")}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* security note */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-400">
          <Lock className="h-3.5 w-3.5 flex-shrink-0" />
          256-bit SSL encryption · PCI DSS compliant · Your card is never stored
        </div>
      </div>

      {/* footer */}
      <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <button
          onClick={handlePay}
          disabled={isLoading}
          className={`flex items-center gap-2 h-9 px-5 rounded-xl bg-gradient-to-r ${plan.gradient} text-white text-xs font-black shadow-md hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Processing…
            </span>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              Pay ₹{total}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── SCREEN 3: Success ──────────────────────────────────────────────────── */
function SuccessPage({ selection, onClose, onDashboard }) {
  const { plan, yearly } = selection;
  const today = new Date();
  const expires = new Date(today);

  const isYearly = plan.durationType === "Yearly" || yearly;
  const isWeekly = plan.durationType === "Weekly";
  if (isYearly) {
    expires.setFullYear(today.getFullYear() + 1);
  } else if (isWeekly) {
    expires.setDate(today.getDate() + 7);
  } else {
    expires.setMonth(today.getMonth() + 1);
  }

  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const PlanIcon = plan.icon || Zap;

  const PERKS = [
    { icon: Rocket, label: "Your new features are live now" },
    { icon: BadgeCheck, label: "Confirmation sent to your email" },
    { icon: Star, label: `Next billing on ${fmt(expires)}` },
  ];

  const displayPrice = plan.price !== undefined ? plan.price : price(plan, yearly);
  const displayDuration = plan.durationType
    ? `/${plan.durationType.toLowerCase().replace("ly", "")}`
    : yearly ? "/yr" : "/mo";

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-10 text-center">
      {/* animated checkmark */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
        className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient} shadow-xl mb-6`}
      >
        <Check className="h-10 w-10 text-white" strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Payment successful</p>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Welcome to {plan.name}! 🎉
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
          Your subscription is active. All {plan.name} features are available immediately.
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
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${plan.gradient}`}>
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
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${plan.border} ${plan.lightBg} mb-8`}
      >
        <PlanIcon className={`h-4 w-4 ${plan.text}`} />
        <span className={`text-xs font-black ${plan.text}`}>
          {plan.name} · ₹{displayPrice}{displayDuration}
        </span>
        <span className="text-[10px] text-slate-400">· renews {fmt(expires)}</span>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onDashboard ?? onClose}
        className={`flex items-center gap-2 h-10 px-6 rounded-xl bg-gradient-to-r ${plan.gradient} text-white text-sm font-black shadow-md hover:scale-[1.02] transition-transform`}
      >
        Go to dashboard <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

/* ── Step indicator ─────────────────────────────────────────────────────── */
function StepBar({ step }) {
  // const steps = ["Choose plan", "Payment", "Done"];
  const steps = ["Choose plan",  "Done"];
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50/60">
      {steps.map((label, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-all ${done ? "bg-violet-600 text-white" :
                current ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300" :
                  "bg-slate-100 text-slate-400"
              }`}>
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span className={`text-[11px] font-bold ${current ? "text-slate-800" : done ? "text-violet-600" : "text-slate-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-1 ${i < step ? "bg-violet-300" : "bg-slate-200"}`} />
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
  dashboardPath = "",   // override to match your route
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve logged-in user details
  const loginResponse = useUserStore((state) => state?.loginResponce);
  const userId = loginResponse?.userId || 0;

  // Fetch plans dynamically
  const { data: rawPlans = [], isLoading: isPlansLoading } = useQuery({
    queryKey: ["planMasterList"],
    queryFn: async () => {
      const response = await planMasterGet();
      return response?.data ?? [];
    },
    enabled: open,
  });

  // Map API plans to UI structure with dynamic styling
  const plans = rawPlans.map((plan, idx) => {
    const style = getPlanStyle(idx, plan.PlanName || "");
    return {
      ...plan,
      id: plan.PlanID,
      name: plan.PlanName,
      price: plan.Price,
      durationType: plan.DurationType,
      remark: plan.Remark,
      maxNoofServices: plan.maxNoofServices,
      icon: style.icon,
      color: style.color,
      gradient: style.gradient,
      lightBg: style.lightBg,
      border: style.border,
      text: style.text,
      badge: style.badge,
      description: plan.Remark || `Plan for ${plan.UserTypeName || 'Commercial'} users`,
      features: [
        `Up to ${plan.maxNoofServices} active services`,
        `${plan.CreditsIncluded} credits included`,
        `${plan.DurationType} billing cycle`,
        plan.Remark || "Standard features included",
      ],
    };
  });

  useEffect(() => {
    if (!open) { setTimeout(() => { setStep(0); setSelection(null); setIsLoading(false); }, 400); }
  }, [open]);

  const handleNext = async (sel) => {
    setSelection(sel);
    setIsLoading(true);
    try {
      const payload = {
        subscriptionID: 0,
        userID: userId,
        planID: sel.plan.id,
        planName: sel.plan.name,
        remark: sel.plan.remark || "Selected plan",
        // enterredIP: window.location.hostname || "127.0.0.1",
        enterredBy: userId,
        // enterDate: new Date().toISOString(),
        // isActive: 0
      };

      const res = await userSubscriptionDetailSave(payload);
      if (res?.status) {
        const subscriptionID = res.data?.subscriptionID || res.data?.SubscriptionID || 0;
        setSelection((prev) => ({ ...prev, subscriptionID }));
        setStep(1);
      } else {
        toast.error(res?.message || "Failed to save subscription details.");
      }
    } catch (err) {
      toast.error(err?.message || "Error saving subscription details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const payload = {
        subscriptionID: selection?.subscriptionID || 0,
        userID: userId,
        planID: selection?.plan?.id || 0,
        planName: selection?.plan?.name || "",
        remark: selection?.plan?.remark || "Payment success",
        // enterredIP: window.location.hostname || "127.0.0.1",
        enterredBy: userId,
        // enterDate: new Date().toISOString(),
        isActive: 1
      };

      const res = await planMasterSave(payload);
      if (res?.status) {
        toast.success(res?.message || "Payment processed successfully!");
        setStep(2);
      } else {
        toast.error(res?.message || "Payment failed.");
      }
    } catch (err) {
      toast.error(err?.message || "Payment request error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleDashboard = () => {
    onClose?.();
    navigate(dashboardPath);
  };

  return (<> 
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-10">
          {/* backdrop */}
          {/* <motion.div
            key="spf-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="  bg-black/40 backdrop-blur-sm"
            onClick={step !== 2 ? handleClose : undefined}
          /> */}


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
                  <motion.div key="s0" className="flex-1 flex flex-col overflow-hidden"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <PlansPage onNext={handleNext} currentPlanId={currentPlanId} plans={plans} isLoading={isPlansLoading} />
                  </motion.div>
                )}
                {/* {step === 1 && selection && (
                  <motion.div key="s1" className="flex-1 flex flex-col overflow-hidden"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <CheckoutPage
                      selection={selection}
                      onBack={() => setStep(0)}
                      onConfirm={handleConfirm}
                      isLoading={isLoading}
                    />
                  </motion.div>
                )} */}
                {step === 1 && selection && (
                  <motion.div key="s2" className="flex-1 flex flex-col overflow-hidden"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <SuccessPage selection={selection} onClose={handleClose} onDashboard={handleDashboard} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CommonModal>

          {/* modal
          <motion.div
            key="spf-md"
            initial={{ opacity: 0, scale: 0.95, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="   z-50 flex items-center justify-center p-4 mt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-4xl max-h-[120vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden">
               <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Subscription plans</p>
                    <p className="text-[10px] text-slate-400">Upgrade or renew your plan</p>
                  </div>
                </div>
                {step !== 2 && (
                  <button
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              
            </div>
          </motion.div> */}
        </div>
      )}</>
  );
}


/* ==========================================================================
   HOW TO WIRE INTO SubscriptionPlan WIDGET
   ==========================================================================

   1. Import at the top of your profile/settings page:

      import SubscriptionPlansFlow from "@/components/SubscriptionPlansFlow";

   2. Add state:

      const [showPlans, setShowPlans] = useState(false);

   3. Replace the toast.info call:

      // BEFORE
      onClick={() => toast.info("Redirecting to plans…")}

      // AFTER
      onClick={() => setShowPlans(true)}

   4. Mount the flow anywhere in the page JSX (outside table/cards):

      <SubscriptionPlansFlow
        open={showPlans}
        onClose={() => setShowPlans(false)}
        currentPlanId="starter"   // pass the user's current plan id
      />

   5. On step 3 (SuccessPage) "Go to dashboard" click, the modal closes.
      To also refetch subscription data, pass an onSuccess callback:

      <SubscriptionPlansFlow
        open={showPlans}
        onClose={() => { setShowPlans(false); refetchSubscription(); }}
        currentPlanId={user.planId}
      />

   6. Replace the fake setTimeout in handleConfirm() with your real API:

      const handleConfirm = async () => {
        setIsLoading(true);
        try {
          await subscribeApi({ planId: selection.plan.id, yearly: selection.yearly });
          setStep(2);
        } catch (err) {
          toast.error(err.message);
        } finally {
          setIsLoading(false);
        }
      };

   ========================================================================== */