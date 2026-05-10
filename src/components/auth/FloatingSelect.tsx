import { forwardRef, type ComponentType, type SelectHTMLAttributes } from "react";

export type FloatingSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  icon?: ComponentType<{ className?: string }>;
};

export const FloatingSelect = forwardRef<HTMLSelectElement, FloatingSelectProps>(
  function FloatingSelect({ label, error, icon: Icon, className = "", children, ...props }, ref) {
    return (
      <div className="w-full">
        <div
          className={`group relative flex items-center rounded-2xl border transition-all duration-200 focus-within:shadow-[var(--shadow-glow)] ${error ? "border-[var(--auth-error)]" : "border-[var(--auth-input-border)]"}`}
          style={{ background: "var(--auth-input-bg)" }}
        >
          {Icon ? (
            <Icon className="pointer-events-none ml-3 h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--auth-icon-muted)] transition-transform duration-200 group-focus-within:scale-110" />
          ) : null}
          <select
            ref={ref}
            className={`peer w-full appearance-none bg-transparent px-3 pb-2.5 pt-5 text-[0.9375rem] font-medium text-[var(--auth-text-primary)] outline-none ${Icon ? "pl-2" : "pl-4"} ${className}`}
            {...props}
          >
            {children}
          </select>
          <label
            className={`pointer-events-none absolute left-3 top-3 z-10 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--auth-kicker)] ${Icon ? "left-10" : ""}`}
          >
            {label}
          </label>
          <span className="pointer-events-none mr-3 text-[var(--auth-icon-muted)]">▾</span>
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-[var(--auth-error)]">{error}</p>
        ) : null}
      </div>
    );
  },
);
