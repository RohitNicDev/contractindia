import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Plus, Eye, Download, RefreshCw, Loader2, CreditCard, TrendingUp, Wallet, X } from "lucide-react";
import CustomHeading from "../../../components/CustomHeading";
import DataTableComponent from "../../dataTable";

const glassCard = "rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/70 shadow-[0_4px_24px_rgba(99,102,241,0.07)]";

const transactionColumns = [
  {
    title: "Txn ID",
    dataIndex: "txnId",
    key: "txnId",
    render: (val) => <span className="font-mono text-xs font-bold text-slate-700">{val ?? "—"}</span>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (val, row) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
        val === "Credit" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
      }`}>
        {val}
      </span>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (val) => <span className="font-black text-slate-900">₹{val?.toLocaleString?.() ?? val}</span>,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (val) => <span className="text-xs text-slate-600">{val ?? "—"}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (val) => {
      const statusMap = {
        Success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Pending: "bg-amber-50 text-amber-700 border-amber-200",
        Failed: "bg-red-50 text-red-700 border-red-200",
      };
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusMap[val] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
          {val}
        </span>
      );
    },
  },
];

export default function MyCredits() {
  const [credits, setCredits] = useState(500);
  const [addAmt, setAddAmt] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [transactions, setTransactions] = useState([
    { txnId: "TXN001", type: "Credit", amount: 500, date: "10 Jun 2026", status: "Success" },
    { txnId: "TXN002", type: "Credit", amount: 1000, date: "05 Jun 2026", status: "Success" },
    { txnId: "TXN003", type: "Debit", amount: 200, date: "01 Jun 2026", status: "Success" },
    { txnId: "TXN004", type: "Credit", amount: 2000, date: "28 May 2026", status: "Success" },
  ]);

  const handleQuickAdd = (value) => {
    setSelectedQuickAmount(value);
    setAddAmt(String(value));
  };

  const handleOpenPayment = () => {
    const amt = parseInt(addAmt);
    if (!amt || amt <= 0) {
      toast.error("Please select or enter a valid amount");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const amt = parseInt(addAmt);
      setCredits((c) => c + amt);
      const newTxn = {
        txnId: `TXN${String(transactions.length + 1).padStart(3, "0")}`,
        type: "Credit",
        amount: amt,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Success",
      };
      setTransactions((prev) => [newTxn, ...prev]);
      setProcessing(false);
      setPaymentSuccess(true);
      setAddAmt("");
      setSelectedQuickAmount(null);
      toast.success(`₹${amt} credits added successfully!`);
    }, 2000);
  };

  const handleSuccessDone = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }
    const headers = ["Txn ID", "Type", "Amount", "Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) => [t.txnId, t.type, t.amount, t.date, t.status].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credit-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transactions exported");
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const statsData = [
    { label: "Total Credits", value: credits, sub: "Available", icon: Wallet, color: "indigo" },
    { label: "Total Spent", value: 200, sub: "Lifetime", icon: TrendingUp, color: "rose" },
    { label: "Transactions", value: transactions.length, sub: "All time", icon: CreditCard, color: "violet" },
  ];

  return (
    <div className="space-y-6">
      <CustomHeading
        title="My Credits"
        subtitle="Manage your account balance and payment history."
        icon={Wallet}
        badge={`₹${credits.toLocaleString()} available`}
        badgeColor="indigo"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={transactions.length === 0}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                setTransactions([]);
                toast.success("History cleared");
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`${glassCard} p-5 group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-900 leading-tight">
                    {typeof s.value === "number" && s.label !== "Total Credits" && s.label !== "Total Spent"
                      ? s.value
                      : `₹${s.value?.toLocaleString?.() ?? s.value}`}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{s.sub}</p>
                </div>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                  s.color === "indigo"
                    ? "from-indigo-500 to-violet-500"
                    : s.color === "rose"
                    ? "from-rose-500 to-pink-500"
                    : "from-violet-500 to-purple-500"
                } shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Credits Card */}
      <div className={`${glassCard} p-6 space-y-5`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">Add Credits</h3>
            <p className="text-xs text-slate-500">Top up your account balance securely</p>
          </div>
        </div>

        <div>
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick amounts</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {quickAmounts.map((v) => (
              <button
                key={v}
                onClick={() => handleQuickAdd(v)}
                className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  selectedQuickAmount === v
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200"
                }`}
              >
                ₹{v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₹</span>
            <input
              type="number"
              value={addAmt}
              onChange={(e) => {
                setAddAmt(e.target.value);
                setSelectedQuickAmount(null);
              }}
              placeholder="Enter custom amount"
              className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenPayment}
            disabled={!addAmt || parseInt(addAmt) <= 0}
            className={`px-6 py-2.5 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 ${
              addAmt && parseInt(addAmt) > 0
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4" /> Add Credits
          </motion.button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`${glassCard} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-500" />
            Transaction History
          </h3>
          <span className="text-xs font-semibold text-slate-500">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</span>
        </div>
        <DataTableComponent
          title=""
          icon={null}
          accent="indigo"
          cols={transactionColumns}
          rows={transactions}
          loading={false}
        />
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={!processing && !paymentSuccess ? handleSuccessDone : undefined}
            />
            {paymentSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl p-8 flex flex-col items-center justify-center gap-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
                  className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center"
                >
                  <CheckCircle2 className="h-11 w-11 text-emerald-600" />
                </motion.div>
                <h3 className="text-xl font-black text-slate-900">Payment Successful!</h3>
                <p className="text-sm text-slate-600 text-center">
                  ₹{parseInt(addAmt || "0").toLocaleString()} credits have been added to your account.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSuccessDone}
                  className="px-8 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg"
                >
                  Done
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
              >
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Complete Payment</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add <span className="font-bold text-indigo-600">₹{parseInt(addAmt || "0").toLocaleString()}</span> to your account
                      </p>
                    </div>
                    <button
                      onClick={handleSuccessDone}
                      disabled={processing}
                      className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                    >
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg">
                    <p className="text-xs text-indigo-200 font-semibold uppercase tracking-widest">Total Amount</p>
                    <p className="text-4xl font-black mt-1">₹{parseInt(addAmt || "0").toLocaleString()}</p>
                  </div>

                  {processing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                      <p className="text-sm font-bold text-slate-700">Processing payment…</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Card Holder</label>
                          <input
                            type="text"
                            placeholder="Name on card"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm uppercase outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">CVV</label>
                            <input
                              type="password"
                              placeholder="•••"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Pay ₹{parseInt(addAmt || "0").toLocaleString()}
                      </motion.button>
                      <p className="text-center text-[10px] text-slate-400">Secure demo payment — no real transaction processed</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
