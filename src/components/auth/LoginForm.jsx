import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import { CaptchaChallenge } from "./CaptchaChallenge";
import { GradientButton } from "./GradientButton";
import { authentication } from "../../services/api";
import { useMutation } from "@tanstack/react-query";

const createAlphabetCaptcha = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let captchaText = "";

  for (let i = 0; i < 5; i++) {
    captchaText += letters[Math.floor(Math.random() * letters.length)];
  }

  return {
    question: captchaText,
    answer: captchaText,
  };
};

const LoginApi = async (payload) => {
  const response = await authentication(payload);

  return response;
};

const LoginForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const [captcha, setCaptcha] = useState(createAlphabetCaptcha);

  const refreshCaptcha = () => {
    setCaptcha(createAlphabetCaptcha());
    setValue("captcha", "", { shouldValidate: false });
  };

  const { mutate: login, isPending } = useMutation({
    mutationFn: LoginApi,

    onSuccess: (response, variables) => {
      console.log("Login Success", response);

      localStorage.setItem("accessToken", response.accessToken);

      localStorage.setItem("refreshToken", response.refreshToken);

      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("login_user", JSON.stringify(response.user));

      // window.dispatchEvent(new Event("auth_changed"));

      toast.success("Login successful");

      navigate(
        response?.userRole === 2
          ? "/commercial/dashboard"
          : "/individual/dashboard",
        {
          state: {
            email: variables.email,
            userType: response.userRole,
            singleVerification: true,
          },
        },
      );
    },

    onError: (error) => {
      toast.error(error?.message || "Unable to login. Please try again.");

      refreshCaptcha();
    },
  });

  const onSubmit = (data) => {
    // captcha validation
    if (data.captcha.trim().toUpperCase() !== captcha.answer.toUpperCase()) {
      toast.error("Invalid captcha answer");
      refreshCaptcha();
      return;
    }

    login({
      email: data.email,
      password: data.password,
    });
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
          Login with your registered account.
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
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email",
            },
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
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
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

          <Link
            to="/forgot-password"
            className="font-semibold text-[var(--auth-link)] hover:text-[var(--auth-link-hover)]"
          >
            Forgot password?
          </Link>
        </div>

        <CaptchaChallenge
          question={captcha.question}
          onRefresh={refreshCaptcha}
          error={errors.captcha?.message}
          placeholder="Type the answer"
          {...register("captcha", {
            required: "Captcha is required",
          })}
        />

        <GradientButton
          type="submit"
          disabled={isPending}
          className="py-2.5 text-sm"
          icon={<ArrowRight className="h-4 w-4" />}
        >
          {isPending ? "Signing In..." : "Sign In"}
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
};
export default LoginForm;
