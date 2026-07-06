/**
 * PaymentHistory — Admin Panel Page
 *
 * Fetches all user payment records from:
 *   GET /api/UserPaymentHistory/get?userId=xxx  (per-user)
 *   GET /api/UserPaymentHistory/get             (all, for admin view)
 *
 * API response shape:
 *   { PaymentID, UserID, Payment, PaymentDate, TransactionID,
 *     TransactionDate, PaymentStatus, PaymentMode, Remark,
 *     EnterDate, IsActive }
 */

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  CreditCard, IndianRupee, TrendingUp, CheckCircle2,
  Clock, AlertCircle, Search, X, Eye, Download,
  RefreshCw, Loader2, Calendar, User, FileText,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import CustomHeading from "../../common/CustomHeading";
import DataTableComponent from "../../common/dataTable";
import { UserPaymentHistoryGet } from "../../../services/api";

// ── API ─────────────────────────────────────────────────────────────────────
const fetchPaymentHistory = async () => {
  const res = await UserPaymentHistoryGet();
  return res?.data ?? [];
};

// ── Formatters ───────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return iso; }
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

const formatAmount = (amount) => {
  if (amount == null || amount === "") return "—";
  const n = Number(amount);
  if (isNaN(n)) return amount;
  return n === 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`;
};

// ── Status badge style ────────────────────────────────────────────────────────
function PaymentStatusBadge({ status }) {
  const MAP = {
    Success:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:  "bg-amber-50 text-amber-700 border-amber-200",
    Failed:   "bg-red-50 text-red-700 border-red-200",
    Refunded: "bg-blue-50 text-blue-700 border-blue-200",
    Free:     "bg-violet-50 text-violet-700 border-violet-200",
  };
  const cls = MAP[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status ?? "—"}
    </span>
  );
}

// ── Detail modal ─────────────────────────────────────────────────────────────
function PaymentDetailModal({ record, onClose }) {
  if (!record) return null;

  const rows = [
    { label: "Payment ID",       value: `#${record.PaymentID}`,            icon: FileText   },
    { label: "User ID",          value: record.UserID,                      icon: User       },
    { label: "Amount",           value: formatAmount(record.Payment),       icon: IndianRupee },
    { label: "Status",           value: <PaymentStatusBadge status={record.PaymentStatus} />, icon: CheckCircle2 },
    { label: "Payment Mode",     value: record.PaymentMode ?? "—",          icon: CreditCard  },
    { label: "Transaction ID",   value: record.TransactionID || "—",        icon: FileText    },
    { label: "Payment Date",     value: formatDateTime(record.PaymentDate), icon: Calendar    },
    { label: "Transaction Date", value: formatDateTime(record.TransactionDate), icon: Calendar },
    { label: "Enter Date",       value: formatDateTime(record.EnterDate),   icon: Calendar    },
    { label: "Remark",           value: record.Remark || "—",               icon: AlertCircle },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 text-white ${
            record.PaymentStatus === "Success"
              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
              : record.PaymentStatus === "Failed"
              ? "bg-gradient-to-br from-red-500 to-rose-600"
              : "bg-gradient-to-br from-indigo-600 to-violet-700"
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
                  Payment #{record.PaymentID}
                </p>
                <h2 className="text-3xl font-black flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" />
                  {Number(record.Payment).toLocaleString("en-IN")}
                </h2>
                <p className="text-white/70 text-xs mt-1">{formatDateTime(record.PaymentDate)}</p>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3">
              <PaymentStatusBadge status={record.PaymentStatus} />
            </div>
          </div>

          {/* Fields */}
          <div className="p-5 grid grid-cols-2 gap-3">
            {rows.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                  <div className="text-xs font-bold text-slate-800 mt-0.5 truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
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

// ── Summary stat card ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, grad, corner }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-5 relative overflow-hidden"
    >
      <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full ${corner} blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
          {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${grad} shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function PaymentHistory() {
  const [searchUser, setSearchUser] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailRecord, setDetailRecord] = useState(null);

  const {
    data: rawPayments = [],
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["adminPaymentHistory"],
    queryFn: fetchPaymentHistory,
    retry: 2,
    onError: () => toast.error("Failed to load payment history."),
  });

  // ── Derived stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total      = rawPayments.reduce((a, r) => a + (Number(r?.Payment) || 0), 0);
    const successful = rawPayments.filter(r => r?.PaymentStatus === "Success");
    const pending    = rawPayments.filter(r => r?.PaymentStatus === "Pending");
    const failed     = rawPayments.filter(r => r?.PaymentStatus === "Failed");
    return { total, successful, pending, failed };
  }, [rawPayments]);

  // ── Filter ───────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return rawPayments.filter(r => {
      const matchUser   = !searchUser || String(r?.UserID).includes(searchUser);
      const matchStatus = statusFilter === "all" || r?.PaymentStatus === statusFilter;
      return matchUser && matchStatus;
    });
  }, [rawPayments, searchUser, statusFilter]);

  // ── CSV export ────────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!filtered.length) { toast.error("No records to export."); return; }
    const headers = ["Payment ID","User ID","Amount","Status","Mode","Transaction ID","Payment Date","Enter Date"];
    const rows = filtered.map(r => [
      r?.PaymentID, r?.UserID, r?.Payment ?? 0,
      r?.PaymentStatus ?? "—", r?.PaymentMode ?? "—",
      r?.TransactionID || "—",
      formatDate(r?.PaymentDate), formatDate(r?.EnterDate),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([headers.join(",") + "\n" + rows.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "payment_history.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully.");
  };

  // ── Table columns ─────────────────────────────────────────────────────────────
  const columns = [
    {
      title: "Name",
      key: "Name",
      render: (_, r) => (
        <span className="font-mono text-xs font-bold text-slate-600">{r?.Name}</span>
      ),
    },
    {
      title: "Email ",
      key: "EmailId",
      render: (_, r) => (
        <span className="font-mono text-xs text-slate-600">{r?.EmailId}</span>
      ),
    },
    {
      title: "User Type",
      key: "UserTypeName",
      render: (_, r) => (
        <span className="font-mono text-xs text-slate-600">{r?.UserTypeName}</span>
      ),
    },
    {
      title: "Amount",
      key: "Payment",
      render: (_, r) => (
        <span className="font-black text-indigo-600 text-sm">
          {formatAmount(r?.Payment)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "PaymentStatus",
      render: (_, r) => <PaymentStatusBadge status={r?.PaymentStatus} />,
    },
    {
      title: "Mode",
      key: "PaymentMode",
      render: (_, r) => (
        <span className="text-xs font-semibold text-slate-600">{r?.PaymentMode ?? "—"}</span>
      ),
    },
    {
      title: "Transaction ID",
      key: "TransactionID",
      render: (_, r) => (
        <span className="font-mono text-xs text-slate-500">{r?.TransactionID || "—"}</span>
      ),
    },
    {
      title: "Payment Date",
      key: "PaymentDate",
      render: (_, r) => (
        <span className="text-xs text-slate-600">{formatDateTime(r?.PaymentDate)}</span>
      ),
    },
    {
      title: "Remark",
      key: "Remark",
      render: (_, r) => (
        <span className="text-xs text-slate-600">{formatDateTime(r?.Remark)}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <button
          onClick={() => setDetailRecord(r)}
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
          title="View details"
        >
          <Eye className="h-4 w-4 text-slate-500" />
        </button>
      ),
    },
  ];

  const STATUS_FILTERS = [
    { key: "all",      label: "All"      },
    { key: "Success",  label: "Success"  },
    { key: "Pending",  label: "Pending"  },
    { key: "Failed",   label: "Failed"   },
  ];

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <CustomHeading
        title="Payment History"
        subtitle="View, filter, and export all user payment transactions."
        icon={CreditCard}
        badge={isLoading ? undefined : `${rawPayments.length} records`}
        badgeColor="violet"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition-all"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleExport}
              disabled={!filtered.length}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition-all"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        }
      />

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span><strong>Failed to load data.</strong> {error?.message}</span>
          <button onClick={() => refetch()} className="ml-auto text-xs font-bold underline">Retry</button>
        </div>
      )}

      {/* Summary stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={IndianRupee}
            label="Total Revenue"
            value={`₹${stats.total.toLocaleString("en-IN")}`}
            sub={`${rawPayments.length} transactions`}
            grad="from-indigo-500 to-violet-500"
            corner="bg-indigo-400/10"
          />
          <StatCard
            icon={CheckCircle2}
            label="Successful"
            value={stats.successful.length}
            sub={`₹${stats.successful.reduce((a,r)=>a+(Number(r?.Payment)||0),0).toLocaleString("en-IN")} collected`}
            grad="from-emerald-500 to-teal-500"
            corner="bg-emerald-400/10"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pending.length}
            sub={`₹${stats.pending.reduce((a,r)=>a+(Number(r?.Payment)||0),0).toLocaleString("en-IN")} pending`}
            grad="from-amber-500 to-orange-400"
            corner="bg-amber-400/10"
          />
          <StatCard
            icon={AlertCircle}
            label="Failed"
            value={stats.failed.length}
            sub={`₹${stats.failed.reduce((a,r)=>a+(Number(r?.Payment)||0),0).toLocaleString("en-IN")} lost`}
            grad="from-red-500 to-rose-500"
            corner="bg-red-400/10"
          />
        </div>
      )}

      {/* Filters row */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex flex-wrap items-center gap-3">
        {/* Search by user ID */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            placeholder="Search by User ID…"
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50 focus:bg-white transition-all"
          />
          {searchUser && (
            <button onClick={() => setSearchUser("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === f.key
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Record count */}
        <span className="text-xs text-slate-400 font-semibold shrink-0">
          {filtered.length} of {rawPayments.length} records
        </span>
      </div>

      {/* Data table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          <p className="text-xs text-slate-400">Loading payment records…</p>
        </div>
      ) : (
        <DataTableComponent
          title="Payment Records"
          icon={CreditCard}
          accent="violet"
          cols={columns}
          rows={filtered}
          onRefresh={refetch}
          loading={isFetching && !isLoading}
        />
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {detailRecord && (
          <PaymentDetailModal
            record={detailRecord}
            onClose={() => setDetailRecord(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
