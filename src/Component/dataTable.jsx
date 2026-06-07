import { useState, useMemo, useRef } from "react";
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
  Eye,
  EyeOff,
  Settings2,
  ArrowUpDown,
} from "lucide-react";

/* ==========================================================================
   STATUS CONFIG — extend as needed
   ========================================================================== */
const STATUS_STYLES = {
  Success:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Active:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed:   "bg-red-50   text-red-600   border-red-200",
  Expired:  "bg-slate-100 text-slate-500 border-slate-200",
  Inactive: "bg-slate-100 text-slate-500 border-slate-200",
  Pending:  "bg-amber-50 text-amber-700 border-amber-200",
  Warning:  "bg-amber-50 text-amber-700 border-amber-200",
};

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
   COLUMN FILTER POPOVER
   ========================================================================== */
function ColumnFilterPopover({ colTitle, value, onChange, onClose }) {
  return (
    <div
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
  return (
    <div className="absolute right-0 z-50 mt-1 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 p-3">
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
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                isVisible ? "bg-indigo-50 text-indigo-700" : "bg-slate-50 text-slate-400"
              }`}
            >
              <input type="checkbox" checked={isVisible} onChange={() => onToggle(colKey)} className="sr-only" />
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  isVisible ? "border-indigo-400 bg-indigo-400" : "border-slate-300 bg-white"
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
   MAIN DATA TABLE COMPONENT
   ========================================================================== */

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const DataTableComponent = ({
  title,
  icon: Icon,
  cols = [],
  rows = [],
  accent = "blue",
  onRefresh,
  onExport,
  loading = false,
}) => {
  // Normalize columns for backward compatibility
  const normalizedCols = useMemo(() => {
    return cols.map(c => {
      if (typeof c === 'string') {
        return { title: c, dataIndex: c, key: c };
      }
      return { ...c, key: c.key || c.dataIndex };
    });
  }, [cols]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [globalFilter, setGlobalFilter]   = useState("");
  const [colFilters, setColFilters]       = useState({});       // { colKey: filterStr }
  const [activeColFilter, setActiveColFilter] = useState(null); // colKey | null
  const [sortColKey, setSortColKey]       = useState(null);
  const [sortDir, setSortDir]             = useState("asc");    // "asc" | "desc"
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(10);
  const [selectedRows, setSelectedRows]   = useState(new Set());
  const [hiddenCols, setHiddenCols]       = useState([]);
  const [showColPanel, setShowColPanel]   = useState(false);
  const [densityMode, setDensityMode]     = useState("normal"); // "compact" | "normal" | "relaxed"

  const visibleCols = normalizedCols.filter((c) => !hiddenCols.includes(c.key));

  // Helper to extract cell value
  const getCellValue = (row, col) => {
    if (!row) return null;
    if (Array.isArray(row)) {
      const idx = normalizedCols.findIndex(c => c.key === col.key);
      return row[idx];
    }
    return row[col.dataIndex];
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    let result = Array.isArray(rows) ? rows : [];

    // Global search
    if (globalFilter.trim()) {
      const term = globalFilter.toLowerCase();
      result = result.filter((row) =>
        normalizedCols.some((col) => {
          const val = getCellValue(row, col);
          return String(val ?? "").toLowerCase().includes(term);
        })
      );
    }

    // Per-column filters
    Object.entries(colFilters).forEach(([colKey, term]) => {
      if (!term?.trim()) return;
      const col = normalizedCols.find(c => c.key === colKey);
      if (!col) return;
      result = result.filter((row) => {
        const val = getCellValue(row, col);
        return String(val ?? "").toLowerCase().includes(term.toLowerCase());
      });
    });

    return result;
  }, [rows, globalFilter, colFilters, normalizedCols]);

  // ── Sorting ────────────────────────────────────────────────────────────────
  const sortedRows = useMemo(() => {
    if (!sortColKey) return filteredRows;
    const col = normalizedCols.find(c => c.key === sortColKey);
    if (!col) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const av = getCellValue(a, col) ?? "";
      const bv = getCellValue(b, col) ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredRows, sortColKey, sortDir, normalizedCols]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePageSize = pageSize === "all" ? sortedRows.length : pageSize;
  const paginatedRows = useMemo(() => {
    if (pageSize === "all") return sortedRows;
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedRows.map((_, i) => (page - 1) * pageSize + i)));
    }
  };

  const toggleSelectRow = (absoluteIdx) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(absoluteIdx)) next.delete(absoluteIdx);
      else next.add(absoluteIdx);
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
    compact:  "py-1.5 px-3",
    normal:   "py-3   px-4",
    relaxed:  "py-4   px-4",
  }[densityMode];

  const accentMap = {
    blue:   { ring: "focus:border-blue-400",   icon: "text-blue-500",   bg: "bg-blue-50",   check: "border-blue-400 bg-blue-400" },
    indigo: { ring: "focus:border-indigo-400", icon: "text-indigo-500", bg: "bg-indigo-50", check: "border-indigo-400 bg-indigo-400" },
    violet: { ring: "focus:border-violet-400", icon: "text-violet-500", bg: "bg-violet-50", check: "border-violet-400 bg-violet-400" },
    emerald:{ ring: "focus:border-emerald-400",icon: "text-emerald-500",bg: "bg-emerald-50",check: "border-emerald-400 bg-emerald-400" },
  };
  const ac = accentMap[accent] ?? accentMap.blue;

  // ── Export CSV ─────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (onExport) { onExport(sortedRows); return; }
    const header = visibleCols.map(c => c.title).join(",");
    const body = sortedRows.map((row) =>
      visibleCols.map((c) => {
        const val = getCellValue(row, c) ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",")
    ).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${title ?? "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Pagination range helper ────────────────────────────────────────────────
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
              {filteredRows.length} of {Array.isArray(rows) ? rows.length : 0} record{Array.isArray(rows) && rows.length !== 1 ? "s" : ""}
              {selectedRows.size > 0 && (
                <span className="ml-2 font-bold text-indigo-500">· {selectedRows.size} selected</span>
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

          {/* Density toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 gap-0.5">
            {["compact", "normal", "relaxed"].map((d) => (
              <button
                key={d}
                onClick={() => setDensityMode(d)}
                title={d}
                className={`h-7 px-2 rounded-lg text-[10px] font-bold transition-all capitalize ${
                  densityMode === d
                    ? "bg-white text-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {d[0].toUpperCase()}
              </button>
            ))}
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

          {/* Export CSV */}
          <button
            onClick={handleExport}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Column visibility */}
          <div className="relative">
            <button
              onClick={() => setShowColPanel((p) => !p)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                showColPanel
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
                {/* Select all */}
                <th className="py-2.5 px-4 w-10">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                      selectedRows.size === paginatedRows.length && paginatedRows.length > 0
                        ? `${ac.check} border-opacity-100`
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                    onClick={toggleSelectAll}
                  >
                    {selectedRows.size === paginatedRows.length && paginatedRows.length > 0 && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {selectedRows.size > 0 && selectedRows.size < paginatedRows.length && (
                      <div className="w-2 h-0.5 bg-slate-400 rounded" />
                    )}
                  </div>
                </th>

                {/* # */}
                <th className="py-2.5 px-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10">#</th>

                {visibleCols.map((col) => {
                  const isSorted   = sortColKey === col.key;
                  const hasFilter  = !!(colFilters[col.key]?.trim());
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
                        {/* Column filter trigger */}
                        <button
                          onClick={() => toggleColFilter(col.key)}
                          className={`flex h-5 w-5 items-center justify-center rounded-md transition-all ${
                            hasFilter
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

                      {/* Column filter popover */}
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
              </tr>
            </thead>

            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length + 2}
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
                  const absoluteIdx = (page - 1) * (pageSize === "all" ? 0 : pageSize) + rowIdx;
                  const isSelected  = selectedRows.has(absoluteIdx);
                  return (
                    <tr
                      key={row?.id || rowIdx}
                      onClick={() => toggleSelectRow(absoluteIdx)}
                      className={`border-b border-slate-50 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-indigo-50/60"
                          : "hover:bg-slate-50/70"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <div
                          onClick={() => toggleSelectRow(absoluteIdx)}
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
                      </td>

                      {/* Row number */}
                      <td className={`${densityPadding} text-[11px] text-slate-400 font-mono w-10`}>
                        {(page - 1) * (pageSize === "all" ? 0 : pageSize) + rowIdx + 1}
                      </td>

                      {visibleCols.map((col) => {
                        const cellValue = getCellValue(row, col);
                        const displayValue = col.render ? col.render(cellValue, row, absoluteIdx) : (cellValue ?? "—");
                        return (
                          <td key={col.key} className={`${densityPadding} text-slate-700`}>
                            {(!col.render && typeof displayValue === 'string' && STATUS_STYLES[displayValue])
                              ? <StatusBadge value={displayValue} />
                              : <span className="text-sm">{displayValue}</span>}
                          </td>
                        );
                      })}
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
          {/* Page size selector */}
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
                : `${Math.min((page - 1) * pageSize + 1, sortedRows.length)}–${Math.min(page * pageSize, sortedRows.length)} of ${sortedRows.length}`}
            </span>
          </div>

          {/* Page buttons */}
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
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      page === p
                        ? "bg-indigo-500 text-white border border-indigo-500 shadow-sm shadow-indigo-200"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
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