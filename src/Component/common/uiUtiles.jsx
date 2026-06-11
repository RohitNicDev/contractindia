import Input from "antd/es/input/Input";

export const glass = { background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: "16px" };
export const gradBtn = { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "10px", padding: "8px 18px", fontWeight: 600, fontSize: "13px", cursor: "pointer" };
export const Badge = ({ color, children }) => (
  <span style={{ background: color === "green" ? "#dcfce7" : color === "red" ? "#fee2e2" : color === "yellow" ? "#fef9c3" : "#e0e7ff", color: color === "green" ? "#16a34a" : color === "red" ? "#dc2626" : color === "yellow" ? "#ca8a04" : "#4f46e5", borderRadius: "999px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>{children}</span>
);
export const btnPrimary = { background: "linear-gradient(135deg,#3b82f6,#6366f1)" };
export const StatCard = ({
  title,
  value,
}) => {
  return (
    <div
      className="
        rounded-2xl border border-slate-100
        bg-slate-50/70 p-4
      "
    >
      <p className="text-xs text-slate-400">
        {title}
      </p>

      <h4 className="mt-1 text-2xl font-black text-slate-800">
        {value}
      </h4>
    </div>
  );
}

export const Inputs = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <Input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          h-12 w-full rounded-xl border
          border-slate-200 px-4
          text-sm outline-none
          transition-all
          focus:border-violet-400
          focus:ring-4
          focus:ring-violet-100
        "
      />
    </div>
  );
}

export const handleExport = (rowsToExport) => {
  if (!rowsToExport || rowsToExport.length === 0) return;
  const header = columns.map((c) => c.title).filter(Boolean).join(",");
  const body = rowsToExport
    .map((row) =>
      columns
        .filter(c => c.title)
        .map((c) => {
          let val = row?.[c.dataIndex];
          if (c.render) {
            const rendered = c.render(val, row);
            if (typeof rendered === "string" || typeof rendered === "number") {
              val = rendered;
            }
          }
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `leads.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported successfully.");
};