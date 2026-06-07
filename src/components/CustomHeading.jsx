/**
 * CustomHeading — universal page/section heading wrapper
 *
 * Props
 * ─────────────────────────────────────────────────────────────────────────
 * title        string                               required
 * subtitle     string                               optional description line
 * icon         LucideIcon                           optional left icon
 * badge        string                               optional pill label
 * badgeColor   "blue"|"green"|"amber"|"red"|"violet"|"slate"  (default "blue")
 * actions      ReactNode                            right-side slot (buttons, etc.)
 * breadcrumbs  { label: string, onClick?: fn }[]    trail rendered above title
 * back         { label?: string, onClick: fn }      back arrow link above title
 * variant      "default" | "bordered" | "flush"     (default "default")
 * size         "sm" | "md" | "lg"                   (default "md")
 * divider      boolean                              bottom rule (default true)
 * className    string                               extra wrapper classes
 */

import { ChevronRight, ArrowLeft } from "lucide-react";

/* ── Badge variants ──────────────────────────────────────────────────────── */
const BADGE = {
  blue:   "bg-blue-50   text-blue-700   border-blue-200",
  green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber:  "bg-amber-50  text-amber-700  border-amber-200",
  red:    "bg-red-50    text-red-700    border-red-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  slate:  "bg-slate-100 text-slate-600  border-slate-200",
};

/* ── Size tokens ─────────────────────────────────────────────────────────── */
const SIZE = {
  sm: {
    wrap:     "py-3 px-4",
    title:    "text-base font-bold",
    subtitle: "text-xs mt-0.5",
    icon:     "h-8 w-8 rounded-xl",
    iconSz:   "h-4 w-4",
  },
  md: {
    wrap:     "py-4 px-5",
    title:    "text-xl font-black",
    subtitle: "text-sm mt-1",
    icon:     "h-9 w-9 rounded-2xl",
    iconSz:   "h-[18px] w-[18px]",
  },
  lg: {
    wrap:     "py-5 px-6",
    title:    "text-2xl font-black",
    subtitle: "text-sm mt-1.5",
    icon:     "h-11 w-11 rounded-2xl",
    iconSz:   "h-5 w-5",
  },
};

/* ── Variant wrappers ────────────────────────────────────────────────────── */
const VARIANT = {
  default:  "bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm",
  bordered: "bg-white rounded-2xl border border-slate-200",
  flush:    "",
};

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function CustomHeading({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor  = "blue",
  actions,
  breadcrumbs,
  back,
  variant     = "default",
  size        = "md",
  divider     = true,
  className   = "",
}) {
  const s  = SIZE[size]    ?? SIZE.md;
  const v  = VARIANT[variant] ?? VARIANT.default;
  const bc = BADGE[badgeColor] ?? BADGE.blue;

  const showDivider = divider && variant !== "flush";

  return (
    <div className={`${v} ${s.wrap} ${className}`}>

      {/* ── Breadcrumbs ── */}
      {breadcrumbs?.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2.5 flex flex-wrap items-center gap-1">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-slate-300"
                  aria-hidden="true"
                />
              )}
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="text-[11px] font-semibold leading-none text-slate-400 transition-colors hover:text-slate-700"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-[11px] font-semibold leading-none text-slate-600">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* ── Back button ── */}
      {back && (
        <button
          type="button"
          onClick={back.onClick}
          className="group mb-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 transition-colors hover:text-slate-700"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          {back.label ?? "Back"}
        </button>
      )}

      {/* ── Main row ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        {/* Left: icon + text */}
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div
              className={`${s.icon} flex shrink-0 items-center justify-center border border-slate-200/80 bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500 shadow-sm`}
              aria-hidden="true"
            >
              <Icon className={s.iconSz} />
            </div>
          )}

          <div className="min-w-0">
            {/* Title + badge */}
            <div className="flex flex-wrap items-center gap-2 leading-none">
              <h1 className={`${s.title} truncate text-slate-900`}>{title}</h1>
              {badge && (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide ${bc}`}
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className={`${s.subtitle} leading-snug text-slate-500`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions slot */}
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* ── Bottom divider ── */}
      {showDivider && (
        <div className={`-mx-5 mt-4 border-b border-slate-100 ${size === "sm" ? "-mx-4" : size === "lg" ? "-mx-6" : "-mx-5"}`} />
      )}
    </div>
  );
}

/*
  ════════════════════════════════════════════════════════════════════════
  USAGE EXAMPLES
  ════════════════════════════════════════════════════════════════════════

  // 1 — minimal
  <CustomHeading title="Dashboard" />

  // 2 — icon + subtitle
  <CustomHeading
    title="Service Listing"
    subtitle="Manage your marketplace service structure."
    icon={Briefcase}
  />

  // 3 — badge + actions
  <CustomHeading
    title="Service Listing"
    subtitle="Manage your marketplace service structure."
    icon={Briefcase}
    badge="Beta"
    badgeColor="amber"
    actions={
      <>
        <button className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
        <button className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-xs font-bold text-white">
          <Plus className="h-3.5 w-3.5" /> Add New
        </button>
      </>
    }
  />

  // 4 — breadcrumbs + back + flush
  <CustomHeading
    title="Edit Service"
    icon={Pencil}
    breadcrumbs={[
      { label: "Home",     onClick: () => navigate("/") },
      { label: "Services", onClick: () => navigate("/services") },
      { label: "Edit" },
    ]}
    back={{ label: "Back to Services", onClick: () => navigate(-1) }}
    size="sm"
    variant="flush"
  />

  // 5 — large flush hero
  <CustomHeading
    title="User Management"
    subtitle="View and manage all registered users across your platform."
    icon={Users}
    badge="24 active"
    badgeColor="green"
    size="lg"
    variant="flush"
    divider={false}
    actions={<button>…</button>}
  />
*/