import {
  forwardRef,
  type ComponentType,
  type TextareaHTMLAttributes,
} from "react";

export type AuthFormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  icon?: ComponentType<{ className?: string }>;
  compact?: boolean;
};

export const AuthFormTextarea = forwardRef<HTMLTextAreaElement, AuthFormTextareaProps>(
  function AuthFormTextarea(
    { label, error, icon: Icon, className = "", id, compact, ...props },
    ref,
  ) {
    const fieldId = id ?? `textarea-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const dense = Boolean(compact);

    return (
      <div className="w-full min-w-0">
        {/* Label */}
        <label
          htmlFor={fieldId}
          className={`mb-1 block font-semibold text-[var(--auth-label)] ${
            dense ? "text-[11px] uppercase tracking-wide" : "mb-2 text-sm"
          }`}
        >
          {label}
        </label>

        {/* Textarea wrapper */}
        <div className="relative">
          {Icon && (
            <Icon
              className={`absolute left-2.5 top-2.5 shrink-0 text-[var(--auth-icon-muted)] ${
                dense ? "h-3.5 w-3.5" : "h-5 w-5"
              }`}
              aria-hidden
            />
          )}

          {/* Textarea */}
          <textarea
            id={fieldId}
            ref={ref}
            className={`
              w-full resize-none rounded-lg border-2 
              px-2.5 text-[var(--auth-text-input)] font-medium
              transition-all duration-150
              placeholder:text-[var(--auth-placeholder)]
              focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
              ${Icon ? "pl-9" : ""}
              ${dense ? "min-h-[6rem] py-1.5 text-sm" : "min-h-[8rem] py-2 text-base"}
              ${
                error
                  ? "border-[var(--auth-error)] bg-red-50/40 focus:border-[var(--auth-error)] focus:ring-2 focus:ring-red-200/50"
                  : "border-[var(--auth-input-border)] bg-[var(--auth-field-bg)] hover:border-indigo-300 focus:border-[var(--auth-input-border-focus)] focus:ring-2 focus:ring-[var(--auth-input-ring)]"
              }
            `}
            {...props}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className={`font-medium text-[var(--auth-error)] ${
              dense ? "mt-0.5 text-[11px] leading-tight" : "mt-1.5 text-sm"
            }`}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
