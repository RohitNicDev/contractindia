import { forwardRef, type ComponentType, type InputHTMLAttributes } from "react";

export type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: ComponentType<{ className?: string }>;
};

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  function FloatingInput({ label, error, icon: Icon, className = "", ...props }, ref) {
    return (
      <div className="w-full">
        <div
          className={`group relative flex items-center rounded-2xl border transition-all duration-200 focus-within:shadow-[var(--shadow-glow)] ${error ? "border-[var(--auth-error)]" : "border-[var(--auth-input-border)]"}`}
          style={{ background: "var(--auth-input-bg)" }}
        >
          {Icon ? (
            <Icon className="pointer-events-none ml-3 h-[1.125rem] w-[1.125rem] shrink-0 text-[var(--auth-icon-muted)] transition-transform duration-200 group-focus-within:scale-110" />
          ) : null}
          <input
            ref={ref}
            className={`peer w-full bg-transparent px-3 pb-2.5 pt-5 text-[0.9375rem] font-medium text-[var(--auth-text-primary)] outline-none placeholder:text-transparent ${Icon ? "" : "pl-4"} ${className}`}
            placeholder=" "
            {...props}
          />
          <label
            className={`pointer-events-none absolute top-1/2 z-10 origin-[0] -translate-y-1/2 text-[0.8125rem] font-semibold uppercase tracking-wider text-[var(--auth-kicker)] transition-all duration-200 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[0.65rem] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.65rem] ${Icon ? "left-10 peer-focus:left-10 peer-[:not(:placeholder-shown)]:left-10" : "left-3 peer-focus:left-3 peer-[:not(:placeholder-shown)]:left-3"}`}
          >
            {label}
          </label>
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-[var(--auth-error)]">{error}</p>
        ) : null}
      </div>
    );
  },
);
