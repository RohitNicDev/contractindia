import { forwardRef, type ComponentType, type InputHTMLAttributes } from "react";

export type AuthFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
  /** Tighter layout for split-screen / no-scroll auth */
  compact?: boolean;
};

export const AuthFormField = forwardRef<HTMLInputElement, AuthFormFieldProps>(
  function AuthFormField(
    { label, error, hint, icon: Icon, className = "", id, compact, ...props },
    ref,
  ) {
    const fieldId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const dense = Boolean(compact);
    return (
      <div className="w-full min-w-0">
        <label
          htmlFor={fieldId}
          className={`mb-1 block font-semibold text-[var(--auth-label)] ${dense ? "text-[11px] uppercase tracking-wide" : "mb-2 text-sm"}`}
        >
          {label}
        </label>
        <div
          className={`flex items-center gap-1.5 rounded-lg border-2 bg-[var(--auth-field-bg)] px-2.5 transition-colors focus-within:border-[var(--auth-input-border-focus)] focus-within:ring-1 focus-within:ring-[var(--auth-input-ring)] ${dense ? "min-h-[2.35rem]" : "min-h-[3rem]"} ${error ? "border-[var(--auth-error)]" : "border-[var(--auth-input-border)]"}`}
        >
          {Icon ? (
            <Icon
              className={`shrink-0 text-[var(--auth-icon-muted)] ${dense ? "h-3.5 w-3.5" : "h-5 w-5"}`}
              aria-hidden
            />
          ) : null}
          <input
            id={fieldId}
            ref={ref}
            className={`w-full min-w-0 bg-transparent font-medium text-[var(--auth-text-input)] outline-none placeholder:text-[var(--auth-placeholder)] ${dense ? "min-h-[2rem] py-1 text-sm" : "min-h-[2.75rem] py-2 text-base"} ${className}`}
            {...props}
          />
        </div>
        {hint && !error ? (
          <p className={`font-medium text-[var(--auth-text-muted)] ${dense ? "mt-0.5 text-[10px]" : "mt-1.5 text-xs"}`}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p
            className={`font-medium text-[var(--auth-error)] ${dense ? "mt-0.5 text-[11px] leading-tight" : "mt-1.5 text-sm"}`}
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
