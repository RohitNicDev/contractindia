import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { OtpInput } from "./OtpInput";
import { GradientButton } from "./GradientButton";

const RESEND_SEC = 60;

export function OtpVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SEC);
  const [successPulse, setSuccessPulse] = useState(false);
  const location = useLocation();
  const isComplete = /^\d{6}$/.test(code);
  const datatoNavigate = location?.state;
  console.log(datatoNavigate, "datatoNavigate");

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

  const verify = () => {
    if (!isComplete) return;
    localStorage.setItem("otp_mock_verified_v1", JSON.stringify({ code, at: Date.now() }));
    toast.success("Verified successfully");
    setSuccessPulse(true);
    datatoNavigate.email == "admin@gmail.com" ?
      navigate("/admin/dashboard") :
      datatoNavigate.email == "individual@gmail.com"
        ? navigate("/individual/dashboard") :
        datatoNavigate.email == "commercial@gmail.com"
          ? navigate("/commercial/dashboard") : navigate("/home")

  };

  const resend = () => {
    if (seconds > 0) return;
    setSeconds(RESEND_SEC);
    toast.info("OTP resent (demo)");
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
            Enter OTP
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-[var(--auth-text-body)]">
            6-digit code — paste or type.
          </p>
        </div>
      </header>

      <OtpInput compact length={6} onCodeChange={setCode} disabled={successPulse} />

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
          onClick={verify}
        >
          Verify & continue
        </GradientButton>
      </motion.div>

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
