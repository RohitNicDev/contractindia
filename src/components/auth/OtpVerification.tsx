import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight, Mail, Phone } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { OtpInput } from "./OtpInput";
import { GradientButton } from "./GradientButton";

const RESEND_SEC = 60;

type VerificationStep = "email" | "mobile" | "complete";

export function OtpVerification() {
  const navigate = useNavigate();
  const [emailCode, setEmailCode] = useState("");
  const [mobileCode, setMobileCode] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SEC);
  const [successPulse, setSuccessPulse] = useState(false);
  const [step, setStep] = useState<VerificationStep>("email");
  const location = useLocation();
  const state = location?.state;

  const emailComplete = /^\d{6}$/.test(emailCode);
  const mobileComplete = /^\d{6}$/.test(mobileCode);
  const currentCode = step === "email" ? emailCode : mobileCode;
  const isComplete = (step === "email" && emailComplete) || (step === "mobile" && mobileComplete);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearInterval(t);
  }, [seconds]);

  const ringProgress = useMemo(() => {
    const p = seconds / RESEND_SEC;
    const c = 2 * Math.PI * 18;
    return c * p;
  }, [seconds]);

  const verifyStep = () => {
    if (!isComplete) return;

    if (step === "email") {
      toast.success("Email verified!");
      setStep("mobile");
      setSeconds(RESEND_SEC);
      setMobileCode("");
    } else if (step === "mobile") {
      // Both verified
      localStorage.setItem("otp_verified_v1", JSON.stringify({
        emailCode,
        mobileCode,
        at: Date.now()
      }));
      toast.success("Both verified successfully!");
      setSuccessPulse(true);
      setStep("complete");
      // Navigate based on user type or email
      setTimeout(() => {
        navigate("/home");
      }, 500);
    }
  };

  const resend = () => {
    if (seconds > 0) return;
    setSeconds(RESEND_SEC);
    const target = step === "email" ? "email" : "mobile";
    toast.info(`OTP resent to ${target}`);
  };

  return (
    <AuthCard className="w-full max-w-md p-5 lg:max-w-sm lg:p-6">
      <header className="mb-4 flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--auth-section-border)] bg-[var(--auth-section-bg)]">
          <ShieldCheck className="h-6 w-6 text-[var(--auth-accent-strong)]" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--auth-kicker)]">
            Verification
          </p>
          <h2 className="text-lg font-black tracking-tight text-[var(--auth-heading-display)] lg:text-xl">
            {step === "email" && "Verify Email"}
            {step === "mobile" && "Verify Mobile"}
            {step === "complete" && "All Set!"}
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-[var(--auth-text-body)]">
            {step === "email" && `6-digit code sent to ${state?.email}`}
            {step === "mobile" && `6-digit code sent to ${state?.phone}`}
            {step === "complete" && "Account verified successfully"}
          </p>
        </div>
      </header>

      {step !== "complete" && (
        <>
          <OtpInput
            key={step}
            compact
            length={6}
            onCodeChange={step === "email" ? setEmailCode : setMobileCode}
            disabled={successPulse}
          />

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="relative h-11 w-11">
              <svg className="-rotate-90" width="44" height="44" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  fill="none"
                  stroke="var(--auth-step-inactive)"
                  strokeWidth="3"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  fill="none"
                  stroke="var(--auth-accent-strong)"
                  strokeWidth="3"
                  strokeDasharray={`${ringProgress} ${2 * Math.PI * 18}`}
                  strokeLinecap="round"
                  className={seconds === 0 ? "animate-pulse-ring" : ""}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-[var(--auth-text-input)]">
                {seconds}
              </span>
            </div>
            <button
              type="button"
              onClick={resend}
              disabled={seconds > 0}
              className="text-xs font-semibold text-[var(--auth-link)] disabled:cursor-not-allowed disabled:opacity-45 hover:text-[var(--auth-link-hover)]"
            >
              Resend code
            </button>
          </div>

          <motion.div
            animate={successPulse ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="mt-4"
          >
            <GradientButton
              type="button"
              className="py-2.5 text-sm"
              disabled={!isComplete || successPulse}
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={verifyStep}
            >
              {step === "email" && "Verify & continue"}
              {step === "mobile" && "Complete verification"}
            </GradientButton>
          </motion.div>
        </>
      )}

      {step === "complete" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
            <Mail className="h-5 w-5 text-green-600" />
            <div className="text-sm">
              <p className="font-semibold text-green-900">Email verified</p>
              <p className="text-xs text-green-700">{state?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
            <Phone className="h-5 w-5 text-green-600" />
            <div className="text-sm">
              <p className="font-semibold text-green-900">Mobile verified</p>
              <p className="text-xs text-green-700">{state?.phone}</p>
            </div>
          </div>
        </motion.div>
      )}

      <p className="mt-4 border-t border-[var(--auth-section-border)] pt-3 text-center text-[11px] text-[var(--auth-text-body)]">
        Wrong account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[var(--auth-link)] hover:text-[var(--auth-link-hover)]"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
