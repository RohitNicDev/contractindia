import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import { CaptchaChallenge } from "./CaptchaChallenge";
import { GradientButton } from "./GradientButton";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
  captcha: string;
};

const createAlphabetCaptcha = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let captchaText = '';
  for (let i = 0; i < 5; i++) {
    captchaText += letters[Math.floor(Math.random() * letters.length)];
  }
  return {
    question: captchaText,
    answer: captchaText,
  };
};

export function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "", remember: false, captcha: "" },
  });

  const [captcha, setCaptcha] = useState(createAlphabetCaptcha);

  const refreshCaptcha = () => {
    setCaptcha(createAlphabetCaptcha());
    setValue("captcha", "", { shouldValidate: false });
  };

  const onSubmit = (data: LoginValues) => {
    localStorage.setItem(
      "login_mock_v1",
      JSON.stringify({ email: data.email, remember: data.remember }),
    );
    toast.success("Signed in (demo). Continue with OTP.");
    navigate("/otp");
  };

  return (
    <AuthCard className="flex w-full max-w-sm flex-col justify-center p-5 lg:max-w-md lg:p-6">
      <header className="mb-4 shrink-0 border-b border-[var(--auth-section-border)] pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--auth-kicker)]">
          Welcome back
        </p>
        <h2 className="text-xl font-black tracking-tight text-[var(--auth-heading-display)] lg:text-2xl">
          Sign in
        </h2>
        <p className="mt-1 text-xs leading-snug text-[var(--auth-text-body)] lg:text-sm">
          Email, password, then OTP.
        </p>
      </header>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <AuthFormField
          compact
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          icon={Mail}
          error={errors.email?.message}
          {...register("email", {
            required: "Required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          })}
        />
        <AuthFormField
          compact
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          icon={Lock}
          error={errors.password?.message}
          {...register("password", {
            required: "Required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] lg:text-xs">
          <label className="flex cursor-pointer items-center gap-2 font-semibold text-[var(--auth-label)]">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-2 border-[var(--auth-input-border)] accent-[var(--auth-accent-strong)]"
              {...register("remember")}
            />
            Remember me
          </label>
          <button
            type="button"
            className="font-semibold text-[var(--auth-link)] hover:text-[var(--auth-link-hover)]"
          >
            Forgot password?
          </button>
        </div>

        <CaptchaChallenge
          question={captcha.question}
          onRefresh={refreshCaptcha}
          error={errors.captcha?.message}
          placeholder="Type the answer"
          {...register("captcha", {
            required: "Required",
            validate: (value) =>
              value.trim() === captcha.answer || "Incorrect captcha answer",
          })}
        />

        <GradientButton
          type="submit"
          className="py-2.5 text-sm"
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Sign in
        </GradientButton>
      </form>

      <p className="mt-4 border-t border-[var(--auth-section-border)] pt-3 text-center text-[11px] text-[var(--auth-text-body)] lg:text-xs">
        New here?{" "}
        <Link
          to="/register"
          className="font-semibold text-[var(--auth-link)] hover:text-[var(--auth-link-hover)]"
        >
          Register
        </Link>
      </p>
    </AuthCard>
  );
}
