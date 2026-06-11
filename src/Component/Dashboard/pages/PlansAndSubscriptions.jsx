import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Briefcase, CreditCard, Eye, Plus, RefreshCw, Loader2, X, Lock, IndianRupee } from "lucide-react";
import CustomHeading from "../../common/CustomHeading";
import DataTableComponent from "../../common/dataTable";

import { planMasterGet, subscriptionHistoryGet } from "../../../services/api";

const planMasterGetApi = async () => {
  const response = await planMasterGet();
  return response?.data ?? [];
};

const fetchSubscriptionHistory = async () => {
  const response = await subscriptionHistoryGet();
  let list = response;
  if (typeof list === "string") {
    try { list = JSON.parse(list); } catch (e) { list = []; }
  }
  return Array.isArray(list) ? list : [];
};

const formatPrice = (price) => {
  if (price == null || price === "") return "—";
  const num = Number(price);
  return isNaN(num) ? price : `₹${num.toLocaleString("en-IN")}`;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return iso; }
};

const resolvePlanStatus = (record) => {
  const active = Number(record?.IsActive ?? record?.isActive) === 1;
  return active ? "Active" : "Inactive";
};

const resolveSubStatus = (row) => {
  if (row.isActive === 1 || row.isActive === true) return "Active";
  if (row.endDate && new Date(row.endDate) < new Date()) return "Expired";
  return "Inactive";
};

function PaymentModal({ plan, onClose, onSuccess }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
    amount: plan?.Price ?? plan?.price ?? 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "cardNumber") {
      formatted = value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    if (name === "expiry") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
      if (formatted.length >= 3) formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
    }
    if (name === "cvv") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
    }
    setForm((p) => ({ ...p, [name]: formatted }));
  };

  const isValid =
    form.cardNumber.replace(/\s/g, "").length === 16 &&
    form.cardHolder.trim().length > 0 &&
    form.expiry.length === 5 &&
    form.cvv.length >= 3;

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Please fill in valid card details.");
      return;
    }
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      toast.success("Payment successful!");
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
        {step === "form" && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Complete Payment</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Subscribing to <span className="font-bold text-indigo-600">{plan?.PlanName ?? "Plan"}</span>
                </p>
              </div>
              <button onClick={onClose} className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-indigo-200 font-semibold uppercase tracking-widest">Total Amount</p>
                  <p className="text-3xl font-black mt-1 flex items-center gap-1">
                    <IndianRupee className="h-6 w-6" />{formatPrice(form.amount).replace("₹", "")}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-white/30" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Card Number</label>
                <div className="relative">
                  <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                  <Lock className="absolute right-3 top-3.5 h-4 w-4 text-slate-300" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Card Holder</label>
                <input type="text" name="cardHolder" value={form.cardHolder} onChange={handleChange} placeholder="Name on card"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm uppercase outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Expiry</label>
                  <input type="text" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">CVV</label>
                  <input type="password" name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit} disabled={!isValid}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg ${
                isValid
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90"
                  : "bg-slate-300 cursor-not-allowed"
              }`}>
              Pay {formatPrice(form.amount)}
            </motion.button>
            <p className="text-center text-[10px] text-slate-400">Secure demo payment — no real transaction processed</p>
          </div>
        )}

        {step === "processing" && (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-sm font-bold text-slate-700">Processing payment…</p>
          </div>
        )}

        {step === "success" && (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
            </motion.div>
            <h3 className="text-lg font-black text-slate-900">Payment Successful!</h3>
            <p className="text-sm text-slate-500 text-center">You are now subscribed to <span className="font-bold text-indigo-600">{plan?.PlanName ?? "Plan"}</span>.</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onSuccess}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg">
              Done
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function PlansAndSubscriptions() {
  const [tab, setTab] = useState("plans");
  const [paymentPlan, setPaymentPlan] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: plans = [],
    isLoading: plansLoading,
    refetch: refetchPlans,
    isFetching: plansFetching,
  } = useQuery({
    queryKey: ["planMasterList"],
    queryFn: planMasterGetApi,
    retry: 1,
  });

  const {
    data: subscriptions = [],
    isLoading: subsLoading,
    refetch: refetchSubs,
    isFetching: subsFetching,
  } = useQuery({
    queryKey: ["subscriptionHistory"],
    queryFn: fetchSubscriptionHistory,
    retry: 1,
  });

  const activePlans = plans.filter((p) => resolvePlanStatus(p) === "Active");
  const activeSubs = subscriptions.filter((r) => resolveSubStatus(r) === "Active");

  const planColumns = [
    {
      title: "Plan Name",
      dataIndex: "PlanName",
      key: "PlanName",
      render: (val) => <span className="font-semibold text-slate-800">{val ?? "—"}</span>,
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (val) => <span className="font-black text-indigo-600">{formatPrice(val)}</span>,
    },
    {
      title: "Credits",
      dataIndex: "CreditsIncluded",
      key: "CreditsIncluded",
      render: (_, record) => record?.CreditsIncluded ?? 0,
    },
    {
      title: "Duration",
      dataIndex: "DurationType",
      key: "DurationType",
      render: (_, record) => record?.DurationType ?? "—",
    },
    {
      title: "Status",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (_, record) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
          resolvePlanStatus(record) === "Active"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-slate-100 text-slate-500 border-slate-200"
        }`}>
          {resolvePlanStatus(record)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info(`Viewing ${record?.PlanName ?? "plan"} details (demo)`)}
            className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </button>
          {resolvePlanStatus(record) === "Active" && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPaymentPlan(record)}
              className="h-8 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold flex items-center gap-1 hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Subscribe
            </motion.button>
          )}
        </div>
      ),
    },
  ];

  const subscriptionColumns = [
    {
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
      render: (val) => <span className="font-semibold text-slate-800">{val ?? "—"}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (val) => <span className="font-black text-indigo-600">{formatPrice(val)}</span>,
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (val, row) => val ?? row?.durationType ?? "—",
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (val) => formatDate(val ?? val),
    },
    {
      title: "Start",
      key: "startDate",
      render: (_, row) => formatDate(row?.startDate),
    },
    {
      title: "End",
      key: "endDate",
      render: (_, row) => formatDate(row?.endDate),
    },
    {
      title: "Status",
      key: "status",
      render: (_, row) => {
        const status = resolveSubStatus(row);
        const colorMap = {
          Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
          Expired: "bg-red-50 text-red-700 border-red-200",
          Inactive: "bg-slate-100 text-slate-500 border-slate-200",
        };
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${colorMap[status] ?? colorMap.Inactive}`}>
            {status}
          </span>
        );
      },
    },
  ];

  const handlePaymentSuccess = () => {
    setPaymentPlan(null);
    refetchSubs();
    refetchPlans();
  };

  return (
    <div className="space-y-6">
      <CustomHeading
        title="Plans & Subscriptions"
        subtitle="Browse available plans and manage your subscription history."
        icon={Briefcase}
        badge={
          tab === "plans"
            ? `${activePlans.length} active`
            : `${subscriptions.length} record${subscriptions.length !== 1 ? "s" : ""}`
        }
        badgeColor="violet"
      />

      <div className="flex rounded-xl bg-slate-100 p-1 w-fit">
        <button
          onClick={() => setTab("plans")}
          className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
            tab === "plans"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Available Plans
        </button>
        <button
          onClick={() => setTab("subscriptions")}
          className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
            tab === "subscriptions"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          My Subscriptions
        </button>
      </div>

      {tab === "plans" ? (
        plansLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <p className="text-xs font-medium text-slate-400">Loading available plans…</p>
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
      ) : (
        subsLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <p className="text-xs font-medium text-slate-400">Loading subscription records…</p>
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
        )
      )}

      <AnimatePresence>
        {paymentPlan && (
          <PaymentModal
            key="payment-modal"
            plan={paymentPlan}
            onClose={() => setPaymentPlan(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
