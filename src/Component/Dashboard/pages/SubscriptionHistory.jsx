/**
 * SubscriptionHistory page
 *
 * Depends on:
 *  - DataTable   — ../components/DataTable
 *  - PageHeading — ../components/PageHeading
 *
 * API shape expected from subscriptionHistoryGet():
 *  [{ subscriptionID, planName, price, paymentType, paymentDate,
 *     startDate, endDate, isActive, durationType, remark }]
 */

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Briefcase,
  CreditCard,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { subscriptionHistoryGet } from "../../../services/api";
import DataTableComponent from "../../dataTable";
import CustomHeading from "../../../components/CustomHeading";

/* ═══════════════════════════════════════════════════════════════════════════
   1. API ADAPTER
═══════════════════════════════════════════════════════════════════════════ */
const fetchSubscriptionHistory = async () => {
  const response = await subscriptionHistoryGet();
  let list = response;
  if (typeof list === "string") {
    try {
      list = JSON.parse(list);
    } catch (e) {
      list = [];
    }
  }
  return Array.isArray(list) ? list : [];
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. DATA FORMATTERS
═══════════════════════════════════════════════════════════════════════════ */
const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return iso; }
};

const formatPrice = (price) => {
  if (price == null || price === "") return "—";
  const num = Number(price);
  return isNaN(num) ? price : `₹${num.toLocaleString("en-IN")}`;
};

const resolveStatus = (row) => {
  if (row.isActive === 1 || row.isActive === true) return "Active";
  if (row.endDate && new Date(row.endDate) < new Date()) return "Expired";
  return "Inactive";
};



/* ═══════════════════════════════════════════════════════════════════════════
   3. SUMMARY STAT CARD
═══════════════════════════════════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  };
  const c = colors[color] ?? colors.violet;

  return (
    <div className={`flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm ${c.border}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg}`}>
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-xl font-black text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. TABLE COLUMNS
═══════════════════════════════════════════════════════════════════════════ */
const columns = [
  { title: "Plan", dataIndex: "planName", key: "planName", render: (val) => val ?? "—" },
  { title: "Price", dataIndex: "price", key: "price", render: (val) => formatPrice(val) },
  { title: "Payment Type", dataIndex: "paymentType", key: "paymentType", render: (val, row) => val ?? row?.durationType ?? "—" },
  { title: "Payment Date", dataIndex: "paymentDate", key: "paymentDate", render: (val) => formatDate(val) },
  { title: "Start", dataIndex: "startDate", key: "startDate", render: (val) => formatDate(val) },
  { title: "End", dataIndex: "endDate", key: "endDate", render: (val) => formatDate(val) },
  { title: "Status", dataIndex: "isActive", key: "status", render: (_, row) => resolveStatus(row) },
];

/* ═══════════════════════════════════════════════════════════════════════════
   5. MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function SubscriptionHistory() {
  /* ── Fetch ── */
  const {
    data: rawList = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["subscriptionHistory"],
    queryFn: fetchSubscriptionHistory,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: () => toast.error("Failed to load subscription history."),
  });

  /* ── Derived table rows ── */
  const safeList = rawList || [];

  /* ── Summary stats ── */
  const totalPlans = safeList.length;
  const activePlans = safeList.filter((r) => r?.isActive === 1 || r?.isActive === true).length;
  const expiredPlans = safeList.filter(
    (r) => r?.endDate && new Date(r.endDate) < new Date() && !r?.isActive
  ).length;
  const totalSpend = safeList.reduce((acc, r) => acc + (Number(r?.price) || 0), 0);

  /* ── CSV export helper ── */
  const handleExport = (rowsToExport) => {
    if (!rowsToExport || rowsToExport.length === 0) return;
    const header = columns.map(c => c.title).join(",");
    const body = rowsToExport
      .map((row) =>
        columns.map((c) => {
          let val = row?.[c.dataIndex];
          if (c.render) {
            const rendered = c.render(val, row);
            if (typeof rendered === 'string' || typeof rendered === 'number') {
              val = rendered;
            }
          }
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        }).join(",")
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url, download: "subscription-history.csv",
    });
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully.");
  };

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.07),_transparent_55%),#f8fafc] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Page heading ── */}
        <CustomHeading
          title="Subscription History"
          subtitle="Track all your plan purchases, renewals, and payment records."
          icon={Briefcase}
          badge={isLoading ? undefined : `${totalPlans} record${totalPlans !== 1 ? "s" : ""}`}
          badgeColor="violet"
          variant="default"
          size="md"
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refresh"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => handleExport(safeList)}
                disabled={safeList.length === 0}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          }
        />

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span><strong>Failed to load data.</strong> {error?.message}</span>
            <button
              onClick={() => refetch()}
              className="ml-auto text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Summary stats ── */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={TrendingUp}
              label="Total Plans"
              value={totalPlans}
              sub="all time"
              color="violet"
            />
            <StatCard
              icon={CheckCircle2}
              label="Active Plans"
              value={activePlans}
              sub={activePlans === 0 ? "none currently" : "currently running"}
              color="emerald"
            />
            <StatCard
              icon={Clock}
              label="Expired"
              value={expiredPlans}
              sub="past plans"
              color="amber"
            />
            <StatCard
              icon={CreditCard}
              label="Total Spend"
              value={`₹${totalSpend.toLocaleString("en-IN")}`}
              sub="across all plans"
              color="blue"
            />
          </div>
        )}

        {/* ── Data table ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <p className="text-xs font-medium text-slate-400">
              Loading subscription records…
            </p>
          </div>
        ) : (
          <DataTableComponent
            title="Subscription History"
            icon={Briefcase}
            accent="violet"
            cols={columns}
            rows={safeList}
            onRefresh={refetch}
            onExport={handleExport}
            loading={isFetching && !isLoading}
          />
        )}

      </div>
    </div>
  );
}