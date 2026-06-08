/**
 * ClientsHistory page
 *
 * Depends on:
 *  - DataTable   — ../components/DataTable
 *  - PageHeading — ../components/PageHeading
 */

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

import { clientHistoryGet } from "../../../services/api";
import DataTableComponent from "../../dataTable";
import CustomHeading from "../../../components/CustomHeading";
import { handleExport } from "../../uiUtiles";

/* ═══════════════════════════════════════════════════════════════════════════
   1. API ADAPTER
═══════════════════════════════════════════════════════════════════════════ */
const fetchClientHistory = async () => {
  const response = await clientHistoryGet();
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
const formatDate = (val) => {
  if (!val) return "—";
  // If it's already a formatted string like "10 May 2026", just return it
  if (isNaN(Date.parse(val))) return val;
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return val; }
};

const resolveStatus = (row) => {
  if (row.isActive === 1 || row.isActive === true || row.status?.toLowerCase() === "active") return "Active";
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
  { title: "Name", dataIndex: "name", key: "name", render: (val) => val ?? "—" },
  { title: "Email", dataIndex: "email", key: "email", render: (val) => val ?? "—" },
  { title: "Service", dataIndex: "service", key: "service", render: (val) => val ?? "—" },
  { title: "Date", dataIndex: "date", key: "date", render: (val) => formatDate(val) },
  { title: "Status", dataIndex: "status", key: "status", render: (_, row) => resolveStatus(row) },
];

/* ═══════════════════════════════════════════════════════════════════════════
   5. MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function ClientsHistory() {
  /* ── Fetch ── */
  const {
    data: rawList = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["clientsHistory"],
    queryFn: fetchClientHistory,

    retry: 2,
    onError: () => toast.error("Failed to load client history."),
  });

  /* ── Derived table rows ── */
  const safeList = rawList || [];

  /* ── Summary stats ── */
  const totalClients = safeList.length;
  const activeClients = safeList.filter((r) => resolveStatus(r) === "Active").length;
  const inactiveClients = totalClients - activeClients;



  /* ══════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.07),_transparent_55%),#f8fafc] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Page heading ── */}
        <CustomHeading
          title="Client History"
          subtitle="View and manage all registered clients and their details."
          icon={Users}
          badge={isLoading ? undefined : `${totalClients} record${totalClients !== 1 ? "s" : ""}`}
          badgeColor="emerald"
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
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatCard
              icon={TrendingUp}
              label="Total Clients"
              value={totalClients}
              sub="all time"
              color="emerald"
            />
            <StatCard
              icon={CheckCircle2}
              label="Active Clients"
              value={activeClients}
              sub={activeClients === 0 ? "none currently" : "currently active"}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Inactive Clients"
              value={inactiveClients}
              sub="past or suspended"
              color="amber"
            />
          </div>
        )}

        {/* ── Data table ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <p className="text-xs font-medium text-slate-400">
              Loading client records…
            </p>
          </div>
        ) : (
          <DataTableComponent
            title="Client History"
            icon={Users}
            accent="emerald"
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