import { type InputHTMLAttributes } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { AuthFormField } from "./AuthFormField";

type CaptchaChallengeProps = {
  question: string;
  error?: string;
  onRefresh: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

export function CaptchaChallenge({
  question,
  error,
  onRefresh,
  className = "",
  ...inputProps
}: CaptchaChallengeProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--auth-label)]">
          Captcha
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--auth-input-border)] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[var(--auth-link)] transition hover:border-[var(--auth-input-border-focus)] hover:text-[var(--auth-link-hover)]"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--auth-section-border)] bg-[var(--auth-field-bg)] px-3 py-2 text-sm text-[var(--auth-text-body)]">
        <span className="font-semibold">{question}</span>
      </div>

      <AuthFormField
        compact
        label="Answer"
        icon={ShieldCheck}
        error={error}
        {...inputProps}
      />
    </div>
  );
}
