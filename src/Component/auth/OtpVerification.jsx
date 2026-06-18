import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  ArrowRight,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { SHA256 } from "crypto-js";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import { OtpInput } from "./OtpInput";
import { GradientButton } from "./GradientButton";
import {
  verifyEmail,
  verifyMobile,
  setPassword,
  resendOtp,
} from "../../services/api";
import { useUserStore } from "../../store/store";

// ─── Constants ───────────────────────────────────────────────────────────────

const RESEND_SEC = 30;

// ─── Component ───────────────────────────────────────────────────────────────

const verifyMobileApi = async (payload) => {
  console.log("Verifying email with payload:", payload);
  const response = await verifyMobile({
    id: payload?.id,
    otp: payload?.otp,
  });
  return response;
};

const verifyEmailApi = async (payload) => {
  console.log("Verifying   with payload:", payload);
  const response = await verifyEmail({
    id: payload?.id,
    otp: payload?.otp,
  });
  return response;
};

const setPasswordApi = async (payload) => {
  const response = await setPassword({
    id: payload.id,
    password: SHA256(payload.password).toString(),
  });
  return response;
};
const resendOtpApi = async (payload) => {
  const response = await resendOtp({
    type: payload.type,
    id: payload.id,
  });
  return response;
};
// const getOtpApi = async (payload) => {
//   const response = await getOtp({
//     type: payload.type,
//     emailId: payload.emailId,
//     mobileNo: payload.mobileNo,
//   });

//   return response;
// };
const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state || {};
  console.log(location, "location");
  const { setloginResponce } = useUserStore();

  const [valueId, setvalueId] = useState(state?.guId || "");
  const [emailCode, setEmailCode] = useState("");
  const [mobileCode, setMobileCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SEC);
  const [successPulse, setSuccessPulse] = useState(false);

  const [step, setStep] = useState(
    state?.singleVerification ? "mobile" : "email",
  );

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("login_mock_v1") || "{}");
    } catch {
      return {};
    }
  }, []);

  const emailComplete = /^\d{6}$/.test(emailCode);
  const mobileComplete = /^\d{6}$/.test(mobileCode);
  const passwordComplete =
    step === "password" && password.length >= 6 && password === confirmPassword;

  const isComplete =
    (step === "email" && emailComplete) ||
    (step === "mobile" && mobileComplete) ||
    passwordComplete;

  // ── Countdown timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((p) => p - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const ringProgress = useMemo(() => {
    const circumference = 2 * Math.PI * 18;
    return circumference * (seconds / RESEND_SEC);
  }, [seconds]);

  // ── Navigation helper ────────────────────────────────────────────────────
  const redirectUser = () => {
    if (user.email === "admin@gmail.com") {
      navigate("/admin/dashboard");
      return;
    }
    const userType = user.userType || state?.userType;
    userType === 2
      ? navigate("/commercial/dashboard")
      : userType === 1
        ? navigate("/")
        : navigate("/admin/dashboard");
  };

  // ── Mutations ────────────────────────────────────────────────────────────
  // const { data: userOtp, isLoading: userOptLoading } = useQuery({
  //   queryKey: ["userOtp", step, state?.email, state?.phone],
  //   queryFn: () =>
  //     getOtpApi({
  //       type: step,
  //       emailId: state?.email,
  //       mobileNo: state?.phone,
  //     }),
  //   enabled: !!state?.email && !!state?.phone,
  //   retry: 1,
  // });
  //   console.log(userOtp,"userOtp");

  const { mutate: doVerifyEmail, isPending: emailPending } = useMutation({
    mutationFn: verifyEmailApi,
    onSuccess: (res) => {
      console.log(res, "Cannot ");

      if (!res.status) {
        toast.error(res.message || res.error || "Email verification failed");
        return;
      }
      toast.success(res.message || "Email verified!");
      setStep("mobile");
      setSeconds(RESEND_SEC);
      setMobileCode("");
    },
    onError: (err) => {
      toast.error(err?.message || "Email verification failed");
    },
  });

  const { mutate: doVerifyMobile, isPending: mobilePending } = useMutation({
    mutationFn: verifyMobileApi,
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message || res.error || "Mobile verification failed");
        return;
      }

      if (state?.singleVerification) {
        // localStorage.setItem(
        //   "otp_verified_v1",
        //   JSON.stringify({ mobileCode, at: Date.now() }),
        // );
        toast.success(res.message || "Mobile verified!");
        setSuccessPulse(true);
        setStep("complete");
        console.log(state?.response,"ok");
        
        setloginResponce(state?.response || null);
        setTimeout(redirectUser, 600);
        return;
      } else {
        setStep("password");
      }

      // Check if registration flow → need password step
      // const registrationData = localStorage.getItem("registration_form_v1");
      // if (registrationData) {
      //   toast.success(res.message || "Mobile verified! Set your password.");
      //   setStep("password");
      // } else {
      //   // localStorage.setItem(
      //   //   "otp_verified_v1",
      //   //   JSON.stringify({ emailCode, mobileCode, at: Date.now() }),
      //   // );
      //   toast.success(res.message || "Both verified!");
      //   setSuccessPulse(true);
      //   setStep("complete");
      //   setTimeout(redirectUser, 600);
      // }
    },
    onError: (err) => {
      toast.error(err?.message || "Mobile verification failed");
    },
  });

  const { mutate: doSetPassword, isPending: passwordPending } = useMutation({
    mutationFn: setPasswordApi,
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message || res.error || "Failed to set password");
        return;
      }

      // try {
      //   const registrationData = localStorage.getItem("registration_form_v1");
      //   const parsed = registrationData ? JSON.parse(registrationData) : {};
      //   const updated = { ...parsed, password, confirmPassword };
      //   // localStorage.setItem("registration_form_v1", JSON.stringify(updated));
      //   // if (updated.email) {
      //   //   localStorage.setItem(
      //   //     "user_credentials_" + updated.email,
      //   //     JSON.stringify(updated),
      //   //   );
      //   // }
      //   // localStorage.setItem(
      //   //   "otp_verified_v1",
      //   //   JSON.stringify({ emailCode, mobileCode, at: Date.now() }),
      //   // );
      // } catch {
      //   // silently ignore local storage errors
      // }

      toast.success(res.message || "Registration complete!");
      setSuccessPulse(true);
      setStep("complete");
      setTimeout(redirectUser, 600);
      if (userType === 2) navigate("/commercial/dashboard");
      else navigate("/individual/dashboard");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to set password");
    },
  });

  const isLoading = emailPending || mobilePending || passwordPending;

  // ── Verify step handler ──────────────────────────────────────────────────
  const verifyStep = () => {
    if (!isComplete || isLoading) return;

    if (step === "email") {
      doVerifyEmail({ otp: emailCode, id: valueId });
      return;
    }

    if (step === "mobile") {
      doVerifyMobile({
        id: valueId,
        otp: mobileCode,
      });
      return;
    }

    if (step === "password") {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      doSetPassword({
        id: valueId,
        password,
      });
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const { mutate: doResend } = useMutation({
    mutationFn: resendOtpApi,
    onSuccess: (res) => {
      const target = step === "email" ? "email" : "mobile";
      console.log(res, "res");

      if (!res.status) {
        console.log(res, "res1");
        toast.error(res?.message || `Failed to resend OTP to ${target}`);
        return;
      }
      toast.success(res?.remark || "`OTP resent ", {
        autoClose: 30000,
      });
      setvalueId(res?.value || valueId);
    },
    onError: (e) => {
      console.log(e, "Failed to resend OTP1");

      toast.error("Failed to   OTP");
    },
  });

  const resend = () => {
    if (seconds > 0) return;
    setSeconds(RESEND_SEC);
    doResend({
      type: step,
      id: valueId,
      // emailId: state?.email,
      // mobileNo: state?.phone || state?.mobile,
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AuthCard className="w-full max-w-md p-5 lg:max-w-sm lg:p-6">
      {/* HEADER */}
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
            {step === "password" && "Create Password"}
            {step === "complete" && "All Set!"}
          </h2>

          <p className="mt-0.5 text-xs leading-snug text-[var(--auth-text-body)]">
            {step === "email" &&
              `6-digit code sent to ${state?.email || "your email"}`}
            {step === "mobile" &&
              `6-digit code sent to ${state?.phone || state?.mobile || "your mobile"}`}
            {step === "password" && "Create a password to secure your account"}
            {step === "complete" && "Account verified successfully"}
          </p>
        </div>
      </header>

      {/* STEP PROGRESS (email → mobile → password) */}
      {!state?.singleVerification && step !== "complete" && (
        <div className="mb-4 flex items-center gap-1.5">
          {["email", "mobile", "password"].map((s, i) => {
            const steps = ["email", "mobile", "password", "complete"];
            const current = steps.indexOf(step);
            const stepIdx = i;
            const done = stepIdx < current;
            const active = stepIdx === current;

            return (
              <div key={s} className="flex flex-1 items-center gap-1.5">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${done
                      ? "bg-[var(--auth-accent-strong)]"
                      : active
                        ? "bg-[var(--auth-accent-strong)] opacity-60"
                        : "bg-[var(--auth-step-inactive)]"
                    }`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* OTP / PASSWORD SECTION */}
      <AnimatePresence mode="wait">
        {step !== "complete" && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
          >
            {step === "password" ? (
              <div className="space-y-3">
                <AuthFormField
                  compact
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <AuthFormField
                  compact
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                />
              </div>
            ) : (
              <>
                <OtpInput
                  key={step}
                  compact
                  length={6}
                  disabled={successPulse || isLoading}
                  onCodeChange={step === "email" ? setEmailCode : setMobileCode}
                />

                {/* TIMER */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <div className="relative h-11 w-11">
                    <svg
                      className="-rotate-90"
                      width="44"
                      height="44"
                      viewBox="0 0 48 48"
                    >
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
              </>
            )}

            {/* VERIFY BUTTON */}
            <motion.div
              animate={successPulse ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="mt-4"
            >
              <GradientButton
                type="button"
                className="py-2.5 text-sm"
                disabled={!isComplete || successPulse || isLoading}
                icon={
                  isLoading ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="31.4"
                        strokeDashoffset="10"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )
                }
                onClick={verifyStep}
              >
                {isLoading
                  ? "Please wait…"
                  : step === "email"
                    ? "Verify & Continue"
                    : step === "mobile"
                      ? state?.singleVerification
                        ? "Verify Mobile"
                        : "Continue"
                      : "Set Password & Complete"}
              </GradientButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS UI */}
      <AnimatePresence>
        {step === "complete" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {!state?.singleVerification && (
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900">Email verified</p>
                  <p className="text-xs text-green-700">{state?.email}</p>
                </div>
                <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
              </div>
            )}

            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
              <Phone className="h-5 w-5 text-green-600" />
              <div className="text-sm">
                <p className="font-semibold text-green-900">Mobile verified</p>
                <p className="text-xs text-green-700">
                  {state?.phone || state?.mobile}
                </p>
              </div>
              <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
            </div>

            {!state?.singleVerification && (
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                <Lock className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900">Password set</p>
                  <p className="text-xs text-green-700">Account secured</p>
                </div>
                <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
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
};
export default OtpVerification;
