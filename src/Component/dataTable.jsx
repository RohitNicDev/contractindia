import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  X,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  MoreHorizontal,
  Trash2,
  CheckCircle,
  XCircle,
  FileDown,
} from "lucide-react";

/* ==========================================================================
   STATUS CONFIG
   ========================================================================== */
const STATUS_STYLES = {
  Success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed: "bg-red-50 text-red-600 border-red-200",
  Expired: "bg-slate-100 text-slate-500 border-slate-200",
  Inactive: "bg-slate-100 text-slate-500 border-slate-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Warning: "bg-amber-50 text-amber-700 border-amber-200",
};

/* ==========================================================================
   DEMO DATA — used when no rows/cols prop is passed
   ========================================================================== */
export const DEMO_COLS = [
  { key: "name", title: "Name", dataIndex: "name" },
  { key: "email", title: "Email", dataIndex: "email" },
  { key: "role", title: "Role", dataIndex: "role" },
  { key: "department", title: "Department", dataIndex: "department" },
  { key: "status", title: "Status", dataIndex: "status" },
  {
    key: "salary", title: "Salary", dataIndex: "salary",
    render: (v) => `$${Number(v).toLocaleString()}`,
  },
  { key: "joined", title: "Joined", dataIndex: "joined" },
  { key: "projects", title: "Projects", dataIndex: "projects" },
];

export const DEMO_ROWS = [
  { id: 1, name: "Ava Chen", email: "ava.chen@synapse.io", role: "Engineering Lead", department: "Engineering", status: "Active", salary: 142000, joined: "2021-03-15", projects: 8 },
  { id: 2, name: "Marcus Webb", email: "m.webb@synapse.io", role: "Product Manager", department: "Product", status: "Active", salary: 128000, joined: "2020-07-01", projects: 12 },
  { id: 3, name: "Priya Nair", email: "p.nair@synapse.io", role: "UX Designer", department: "Design", status: "Active", salary: 115000, joined: "2022-01-10", projects: 6 },
  { id: 4, name: "James Okafor", email: "j.okafor@synapse.io", role: "Backend Engineer", department: "Engineering", status: "Pending", salary: 132000, joined: "2023-06-20", projects: 3 },
  { id: 5, name: "Sofia Reyes", email: "s.reyes@synapse.io", role: "Data Scientist", department: "Analytics", status: "Active", salary: 138000, joined: "2021-09-05", projects: 10 },
  { id: 6, name: "Tom Hargreaves", email: "t.hargreaves@synapse.io", role: "DevOps Engineer", department: "Engineering", status: "Inactive", salary: 119000, joined: "2019-11-22", projects: 0 },
  { id: 7, name: "Leila Mansouri", email: "l.mansouri@synapse.io", role: "Sales Director", department: "Sales", status: "Active", salary: 155000, joined: "2020-02-14", projects: 15 },
  { id: 8, name: "Raj Patel", email: "r.patel@synapse.io", role: "Frontend Engineer", department: "Engineering", status: "Active", salary: 126000, joined: "2022-08-30", projects: 7 },
  { id: 9, name: "Nina Petrov", email: "n.petrov@synapse.io", role: "Legal Counsel", department: "Legal", status: "Active", salary: 162000, joined: "2018-04-11", projects: 4 },
  { id: 10, name: "Carlos Vega", email: "c.vega@synapse.io", role: "ML Engineer", department: "Analytics", status: "Pending", salary: 144000, joined: "2023-09-01", projects: 2 },
  { id: 11, name: "Amy Laurent", email: "a.laurent@synapse.io", role: "HR Manager", department: "HR", status: "Active", salary: 108000, joined: "2020-12-01", projects: 5 },
  { id: 12, name: "Derek Stone", email: "d.stone@synapse.io", role: "Security Engineer", department: "Engineering", status: "Failed", salary: 134000, joined: "2021-05-18", projects: 6 },
  { id: 13, name: "Yuki Tanaka", email: "y.tanaka@synapse.io", role: "Cloud Architect", department: "Engineering", status: "Active", salary: 158000, joined: "2019-08-27", projects: 11 },
  { id: 14, name: "Hannah Brooks", email: "h.brooks@synapse.io", role: "Content Strategist", department: "Marketing", status: "Active", salary: 97000, joined: "2022-03-07", projects: 9 },
  { id: 15, name: "Ethan Cole", email: "e.cole@synapse.io", role: "Finance Analyst", department: "Finance", status: "Inactive", salary: 112000, joined: "2020-10-15", projects: 0 },
  { id: 16, name: "Mei Lin", email: "m.lin@synapse.io", role: "QA Engineer", department: "Engineering", status: "Active", salary: 118000, joined: "2023-02-14", projects: 4 },
  { id: 17, name: "Oliver Grant", email: "o.grant@synapse.io", role: "Growth Manager", department: "Marketing", status: "Pending", salary: 122000, joined: "2023-11-01", projects: 1 },
  { id: 18, name: "Sara Kim", email: "s.kim@synapse.io", role: "iOS Engineer", department: "Engineering", status: "Active", salary: 131000, joined: "2021-07-22", projects: 8 },
  { id: 19, name: "Finn O'Brien", email: "f.obrien@synapse.io", role: "Platform Engineer", department: "Engineering", status: "Active", salary: 140000, joined: "2020-05-30", projects: 9 },
  { id: 20, name: "Zara Ahmed", email: "z.ahmed@synapse.io", role: "Chief of Staff", department: "Operations", status: "Active", salary: 168000, joined: "2018-01-08", projects: 18 },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */
export function StatusBadge({ value }) {
  const cls = STATUS_STYLES[value];
  if (!cls) return <span className="text-slate-700 text-sm">{value}</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {value}
    </span>
  );
}

function SortIcon({ direction }) {
  if (!direction) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 transition-opacity" />;
  if (direction === "asc") return <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />;
  return <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />;
}

/* ==========================================================================
   EXPORT UTILITIES — fixed CSV + Excel
   ========================================================================== */
function getRawCellValue(row, col) {
  return row[col.dataIndex ?? col.key] ?? "";
}

function exportToCSV(cols, rows, filename) {
  const header = cols.map((c) => `"${c.title}"`).join(",");
  const body = rows
    .map((row) =>
      cols
        .map((col) => {
          const val = getRawCellValue(row, col);
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToExcel(cols, rows, filename) {
  const header = cols.map((c) => `<th>${c.title}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${cols
          .map((col) => `<td>${getRawCellValue(row, col)}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'>
    <head><meta charset='UTF-8'><style>th{font-weight:bold;background:#f0f0f0;}td,th{border:1px solid #ccc;padding:6px;}</style></head>
    <body><table><tr>${header}</tr>${body}</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   COLUMN FILTER POPOVER
   ========================================================================== */
function ColumnFilterPopover({ colTitle, value, onChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 p-3"
      style={{ top: "100%", left: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter: {colTitle}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Filter ${colTitle}...`}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-400 focus:bg-white transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="mt-2 w-full text-center text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}

/* ==========================================================================
   COLUMN VISIBILITY PANEL
   ========================================================================== */
function ColumnVisibilityPanel({ cols, hidden, onToggle, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 z-50 mt-1 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 p-3"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Columns</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1">
        {cols.map((col) => {
          const colKey = col.key || col.dataIndex;
          const isVisible = !hidden.includes(colKey);
          return (
            <label
              key={colKey}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${isVisible ? "bg-indigo-50 text-indigo-700" : "bg-slate-50 text-slate-400"
                }`}
            >
              <input type="checkbox" checked={isVisible} onChange={() => onToggle(colKey)} className="sr-only" />
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isVisible ? "border-indigo-400 bg-indigo-400" : "border-slate-300 bg-white"
                  }`}
              >
                {isVisible && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {col.title}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   EXPORT DROPDOWN
   ========================================================================== */
function ExportDropdown({ onCSV, onExcel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${open
            ? "border-indigo-300 bg-indigo-50 text-indigo-600"
            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          }`}
        title="Export"
      >
        <Download className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 py-1.5">
          <button
            onClick={() => { onCSV(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            Export all as CSV
          </button>
          <button
            onClick={() => { onExcel(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-500" />
            Export all as Excel
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   BULK ACTION TOOLBAR — only renders when selectedRows.size > 0
   ========================================================================== */
function BulkActionToolbar({ count, onAction, onClear }) {
  if (count === 0) return null;
  return (
    <div className="mx-5 mb-0 flex items-center gap-3 flex-wrap rounded-2xl bg-indigo-600 px-4 py-2.5 text-white shadow-lg shadow-indigo-500/25">
      <span className="flex items-center gap-2 text-xs font-bold flex-shrink-0">
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-white/20 px-1.5 text-[10px] font-extrabold">
          {count}
        </span>
        {count === 1 ? "item" : "items"} selected
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {/* <button
          onClick={() => onAction("approve")}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold hover:bg-white/20 transition-colors"
        >
          <CheckCircle className="w-3 h-3" /> Approve Selected
        </button>
        <button
          onClick={() => onAction("reject")}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold hover:bg-white/20 transition-colors"
        >
          <XCircle className="w-3 h-3" /> Reject Selected
        </button> */}
        <button
          onClick={() => onAction("export-csv")}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold hover:bg-white/20 transition-colors"
        >
          <FileDown className="w-3 h-3" /> Export Selected
        </button>
        {/* <button
          onClick={() => onAction("delete")}
          className="flex items-center gap-1.5 rounded-lg bg-red-500/50 px-2.5 py-1 text-[11px] font-semibold hover:bg-red-500/70 transition-colors"
        >
          <Trash2 className="w-3 h-3" /> Delete Selected
        </button> */}
      </div>
      <button onClick={onClear} className="ml-auto text-white/60 hover:text-white transition-colors" title="Clear selection">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ==========================================================================
   ROW ACTION MENU — stopPropagation prevents row selection
   ========================================================================== */
function RowActionMenu({ row, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleTrigger = (e) => {
    e.stopPropagation(); // prevents row click / toggleSelectRow
    setOpen((p) => !p);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    onAction?.(action, row);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleTrigger}
        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all opacity-0 group-hover:opacity-100 ${open
            ? "border-indigo-300 bg-indigo-50 text-indigo-600 opacity-100"
            : "border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300"
          }`}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 py-1.5 overflow-hidden">
          <button
            onClick={(e) => handleAction(e, "view")}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> View Details
          </button>
          <button
            onClick={(e) => handleAction(e, "approve")}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Approve
          </button>
          <button
            onClick={(e) => handleAction(e, "reject")}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5 text-amber-500" /> Reject
          </button>
          <button
            onClick={(e) => handleAction(e, "delete")}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   MAIN DATA TABLE COMPONENT
   ========================================================================== */
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const DataTableComponent = ({
  title,
  icon: Icon,
  cols = DEMO_COLS,
  rows = DEMO_ROWS,
  accent = "indigo",
  onRefresh,
  onExport,
  onBulkAction,
  onRowAction,
  loading = false,
}) => {
  // ── Normalize columns ────────────────────────────────────────────────────
  const normalizedCols = useMemo(() => {
    return cols.map((c) => {
      if (typeof c === "string") return { title: c, dataIndex: c, key: c };
      return { ...c, key: c.key || c.dataIndex };
    });
  }, [cols]);

  // ── State ────────────────────────────────────────────────────────────────
  const [globalFilter, setGlobalFilter] = useState("");
  const [colFilters, setColFilters] = useState({});
  const [activeColFilter, setActiveColFilter] = useState(null);
  const [sortColKey, setSortColKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set()); // tracks by row.id
  const [hiddenCols, setHiddenCols] = useState([]);
  const [showColPanel, setShowColPanel] = useState(false);
  const [densityMode] = useState("normal");

  const visibleCols = useMemo(
    () => normalizedCols.filter((c) => !hiddenCols.includes(c.key)),
    [normalizedCols, hiddenCols]
  );

  // ── Cell value helper ────────────────────────────────────────────────────
  const getCellValue = useCallback(
    (row, col) => {
      if (!row) return null;
      if (Array.isArray(row)) {
        const idx = normalizedCols.findIndex((c) => c.key === col.key);
        return row[idx];
      }
      return row[col.dataIndex] ?? row[col.key] ?? null;
    },
    [normalizedCols]
  );

  // ── Filtering ────────────────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    let result = Array.isArray(rows) ? rows : [];
    if (globalFilter.trim()) {
      const term = globalFilter.toLowerCase();
      result = result.filter((row) =>
        normalizedCols.some((col) =>
          String(getCellValue(row, col) ?? "").toLowerCase().includes(term)
        )
      );
    }
    Object.entries(colFilters).forEach(([colKey, term]) => {
      if (!term?.trim()) return;
      const col = normalizedCols.find((c) => c.key === colKey);
      if (!col) return;
      result = result.filter((row) =>
        String(getCellValue(row, col) ?? "").toLowerCase().includes(term.toLowerCase())
      );
    });
    return result;
  }, [rows, globalFilter, colFilters, normalizedCols, getCellValue]);

  // ── Sorting ──────────────────────────────────────────────────────────────
  const sortedRows = useMemo(() => {
    if (!sortColKey) return filteredRows;
    const col = normalizedCols.find((c) => c.key === sortColKey);
    if (!col) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const av = getCellValue(a, col) ?? "";
      const bv = getCellValue(b, col) ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredRows, sortColKey, sortDir, normalizedCols, getCellValue]);

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / (pageSize === "all" ? sortedRows.length : pageSize)));

  const paginatedRows = useMemo(() => {
    if (pageSize === "all") return sortedRows;
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  // ── Selected rows (by id) ────────────────────────────────────────────────
  const selectedRowObjects = useMemo(
    () => sortedRows.filter((r) => selectedIds.has(r?.id)),
    [sortedRows, selectedIds]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSort = (colKey) => {
    if (sortColKey === colKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColKey(colKey);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handlePageSize = (val) => {
    setPageSize(val === "all" ? "all" : Number(val));
    setPage(1);
  };

  const handleGlobalFilter = (val) => {
    setGlobalFilter(val);
    setPage(1);
  };

  const toggleColFilter = (colKey) => {
    setActiveColFilter((prev) => (prev === colKey ? null : colKey));
  };

  const setColFilter = (colKey, val) => {
    setColFilters((prev) => ({ ...prev, [colKey]: val }));
    setPage(1);
  };

  const toggleColVisibility = (colKey) => {
    setHiddenCols((prev) =>
      prev.includes(colKey) ? prev.filter((c) => c !== colKey) : [...prev, colKey]
    );
  };

  // Row selection persists across pages using row.id
  const toggleSelectRow = (row) => {
    const id = row?.id ?? row;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allOnPageSelected =
    paginatedRows.length > 0 && paginatedRows.every((r) => selectedIds.has(r?.id));
  const someOnPageSelected = paginatedRows.some((r) => selectedIds.has(r?.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paginatedRows.forEach((r) => next.delete(r?.id));
      } else {
        paginatedRows.forEach((r) => r?.id != null && next.add(r.id));
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setGlobalFilter("");
    setColFilters({});
    setSortColKey(null);
    setPage(1);
  };

  const hasActiveFilters =
    globalFilter.trim() ||
    Object.values(colFilters).some((v) => v?.trim()) ||
    sortColKey;

  const densityPadding = {
    compact: "py-1.5 px-3",
    normal: "py-3 px-4",
    relaxed: "py-4 px-4",
  }[densityMode];

  const accentMap = {
    blue: { ring: "focus:border-blue-400", icon: "text-blue-500", bg: "bg-blue-50", check: "border-blue-400 bg-blue-400" },
    indigo: { ring: "focus:border-indigo-400", icon: "text-indigo-500", bg: "bg-indigo-50", check: "border-indigo-400 bg-indigo-400" },
    violet: { ring: "focus:border-violet-400", icon: "text-violet-500", bg: "bg-violet-50", check: "border-violet-400 bg-violet-400" },
    emerald: { ring: "focus:border-emerald-400", icon: "text-emerald-500", bg: "bg-emerald-50", check: "border-emerald-400 bg-emerald-400" },
  };
  const ac = accentMap[accent] ?? accentMap.indigo;

  // ── Export ───────────────────────────────────────────────────────────────
  const exportCols = visibleCols; // only export visible columns

  const handleExportCSVAll = () => {
    if (onExport) { onExport(sortedRows); return; }
    exportToCSV(exportCols, sortedRows, title ?? "export");
  };

  const handleExportExcelAll = () => {
    exportToExcel(exportCols, sortedRows, title ?? "export");
  };

  // ── Bulk action handler ───────────────────────────────────────────────────
  const handleBulkAction = (action) => {
    if (action === "export-csv") {
      exportToCSV(exportCols, selectedRowObjects, `${title ?? "export"}-selected`);
      return;
    }
    if (action === "delete") {
      setSelectedIds(new Set());
    }
    onBulkAction?.(action, selectedRowObjects);
  };

  // ── Row action handler ────────────────────────────────────────────────────
  const handleRowAction = (action, row) => {
    onRowAction?.(action, row);
  };

  // ── Pagination range ─────────────────────────────────────────────────────
  const pageRange = useMemo(() => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift("...");
    if (page + delta < totalPages - 1) range.push("...");
    if (totalPages > 1) range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return [...new Set(range)];
  }, [page, totalPages]);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className={`w-9 h-9 rounded-2xl flex items-center justify-center ${ac.bg}`}>
              <Icon className={`w-4 h-4 ${ac.icon}`} />
            </span>
          )}
          <div>
            <h3 className="font-black text-slate-800 text-base leading-tight">{title}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {filteredRows.length} of {Array.isArray(rows) ? rows.length : 0} record
              {Array.isArray(rows) && rows.length !== 1 ? "s" : ""}
              {selectedIds.size > 0 && (
                <span className="ml-2 font-bold text-indigo-500">· {selectedIds.size} selected</span>
              )}
            </p>
          </div>
        </div>

        {/* Top-right toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Global search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={globalFilter}
              onChange={(e) => handleGlobalFilter(e.target.value)}
              placeholder="Search all..."
              className={`h-8 w-44 rounded-full border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium outline-none transition-all ${ac.ring} focus:bg-white`}
            />
            {globalFilter && (
              <button
                onClick={() => handleGlobalFilter("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-red-200 bg-red-50 text-[11px] font-bold text-red-600 hover:bg-red-100 transition-all"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}

          {/* Refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}

          {/* Export — fixed dropdown with CSV + Excel */}
          <ExportDropdown onCSV={handleExportCSVAll} onExcel={handleExportExcelAll} />

          {/* Column visibility */}
          <div className="relative">
            <button
              onClick={() => setShowColPanel((p) => !p)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${showColPanel
                  ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              title="Column visibility"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
            {showColPanel && (
              <ColumnVisibilityPanel
                cols={normalizedCols}
                hidden={hiddenCols}
                onToggle={toggleColVisibility}
                onClose={() => setShowColPanel(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Bulk Action Toolbar — only shown when rows are selected ── */}
      {/* {selectedIds.size > 0 && (
        <div className="pt-3">
          <BulkActionToolbar
            count={selectedIds.size}
            onAction={handleBulkAction}
            onClear={() => setSelectedIds(new Set())}
          />
        </div>
      )} */}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading data...</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {/* Select all checkbox */}
                {/* <th className="py-2.5 px-4 w-10">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                      allOnPageSelected
                        ? `${ac.check}`
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                    onClick={toggleSelectAll}
                  >
                    {allOnPageSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {!allOnPageSelected && someOnPageSelected && (
                      <div className="w-2 h-0.5 bg-indigo-500 rounded" />
                    )}
                  </div>
                </th> */}

                {/* Row number */}
                <th className="py-2.5 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10">S.NO</th>

                {visibleCols.map((col) => {
                  const isSorted = sortColKey === col.key;
                  const hasFilter = !!(colFilters[col.key]?.trim());
                  const filterOpen = activeColFilter === col.key;
                  return (
                    <th key={col.key} className="py-2.5 px-4 text-left relative">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSort(col.key)}
                          className="group flex items-center gap-1 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
                        >
                          {col.title}
                          <SortIcon direction={isSorted ? sortDir : null} />
                        </button>
                        <button
                          onClick={() => toggleColFilter(col.key)}
                          className={`flex h-5 w-5 items-center justify-center rounded-md transition-all ${hasFilter
                              ? "bg-indigo-100 text-indigo-600"
                              : filterOpen
                                ? "bg-slate-200 text-slate-600"
                                : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                            }`}
                          title={`Filter by ${col.title}`}
                        >
                          <Filter className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      {filterOpen && (
                        <ColumnFilterPopover
                          colTitle={col.title}
                          value={colFilters[col.key] ?? ""}
                          onChange={(val) => setColFilter(col.key, val)}
                          onClose={() => setActiveColFilter(null)}
                        />
                      )}
                    </th>
                  );
                })}

                {/* Actions column header */}
                <th className="py-2.5 px-4 w-12" />
              </tr>
            </thead>

            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length + 3}
                    className="text-center py-16 text-slate-400 text-xs font-medium"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-20" />
                      No records match your filters
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, rowIdx) => {
                  const isSelected = selectedIds.has(row?.id);
                  const rowNum =
                    (page - 1) * (pageSize === "all" ? 0 : pageSize) + rowIdx + 1;

                  return (
                    <tr
                      key={row?.id ?? rowIdx}
                      className={`group border-b border-slate-50 transition-colors ${isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50/70"
                        }`}
                    >
                      {/* Checkbox — stopPropagation so it doesn't double-fire */}
                      {/* <td className="py-3 px-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <div
                          onClick={() => toggleSelectRow(row)}
                          className={`w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                            isSelected
                              ? `${ac.check}`
                              : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </td> */}

                      {/* Row number */}
                      <td className={`${densityPadding} text-[11px] text-slate-400 font-mono w-10`}>
                        {rowNum}
                      </td>

                      {/* Data cells */}
                      {visibleCols.map((col) => {
                        const cellValue = getCellValue(row, col);
                        const displayValue = col.render
                          ? col.render(cellValue, row, rowIdx)
                          : (cellValue ?? "—");
                        return (
                          <td key={col.key} className={`${densityPadding} text-slate-700`}>
                            {!col.render &&
                              typeof displayValue === "string" &&
                              STATUS_STYLES[displayValue] ? (
                              <StatusBadge value={displayValue} />
                            ) : (
                              <span className="text-sm">{displayValue}</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Row action menu — clicking does NOT select the row */}
                      <td
                        className={`${densityPadding} text-right`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RowActionMenu row={row} onAction={handleRowAction} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Footer / Pagination ── */}
      {!loading && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSize(e.target.value)}
              className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-400 cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="all">All</option>
            </select>
            <span className="text-[11px] text-slate-400">
              {pageSize === "all"
                ? `${sortedRows.length} total`
                : `${Math.min((page - 1) * pageSize + 1, sortedRows.length)}–${Math.min(
                  page * pageSize,
                  sortedRows.length
                )} of ${sortedRows.length}`}
            </span>
          </div>

          {pageSize !== "all" && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {pageRange.map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="w-7 text-center text-xs text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${page === p
                        ? "bg-indigo-500 text-white border border-indigo-500 shadow-sm shadow-indigo-200"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTableComponent;