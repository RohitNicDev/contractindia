import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Home,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import logo from "../assets/IMG/logo_con1.png";
export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

type HeroConfig = {
  kicker: string;
  title: string;
  highlight: string;
  subtitle: string;
  bullets: { icon: any; text: string }[];
};

const HERO_BY_PATH: Record<string, HeroConfig> = {
  "/register": {
    kicker: "CONTRACT INDIA",
    title: "Build your",
    highlight: "business profile",
    subtitle:
      "Connect with contractors, consultants and suppliers  across India through one powerful platform.",
    bullets: [
      { icon: Building2, text: "Verified contractor & supplier ecosystem" },
      { icon: ShieldCheck, text: "Secure onboarding with trusted verification" },
      // { icon: Zap, text: "Tenders, procurement & compliance in one place" },
    ],
  },
  "/login": {
    kicker: "WELCOME BACK",
    title: "Access your",
    highlight: "workspace",
    subtitle:
      "Manage procurement, contracts, and business services from your dashboard.",
    bullets: [
      { icon: ShieldCheck, text: "OTP-secured authentication system" },
      { icon: Building2, text: "Centralized contractor management" },
      { icon: Sparkles, text: "Smart service & tender tracking" },
    ],
  },
  "/otp": {
    kicker: "SECURITY CHECK",
    title: "Verify your",
    highlight: "identity",
    subtitle: "Enter the verification code sent to your email or mobile number.",
    bullets: [
      { icon: ShieldCheck, text: "Fast and secure verification" },
      { icon: Zap, text: "Auto-detect & resend support" },
      { icon: Sparkles, text: "Protected access to your account" },
    ],
  },
};

const DEFAULT_HERO = HERO_BY_PATH["/login"];

function AuthLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hero = HERO_BY_PATH[pathname] ?? DEFAULT_HERO;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f1f5ff] text-slate-900">

      {/* ── Animated blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* blob 1 — indigo */}
        <motion.div
          className="absolute -left-[15%] top-[5%] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full blur-[120px] mix-blend-multiply"
          style={{ background: "var(--auth-blob-1)" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.45, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* blob 2 — violet */}
        <motion.div
          className="absolute right-[-12%] top-[15%] h-[min(85vw,480px)] w-[min(85vw,480px)] rounded-full blur-[120px] mix-blend-multiply"
          style={{ background: "var(--auth-blob-2)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.38, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
        />
        {/* blob 3 — cyan */}
        <motion.div
          className="absolute bottom-[-8%] left-[22%] h-[min(80vw,440px)] w-[min(80vw,440px)] rounded-full blur-[120px] mix-blend-multiply"
          style={{ background: "var(--auth-blob-3)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.32 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        {/* blob 4 — rose */}
        <motion.div
          className="absolute bottom-[12%] right-[8%] h-[min(70vw,360px)] w-[min(70vw,360px)] rounded-full blur-[120px] mix-blend-multiply"
          style={{ background: "var(--auth-blob-4)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          transition={{ duration: 1.1, delay: 0.25 }}
        />
      </div>

      {/* ── Main layout ── */}
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">

        {/* ── LEFT SIDE ── */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24"
        >
          {/* Home button */}
          <div className="mb-8">
            <Link
              to="/"
              className="
                inline-flex items-center gap-2
                rounded-xl
                border border-indigo-200
                bg-white/70
                px-4 py-2
                text-xs font-semibold text-slate-600
                shadow-sm
                backdrop-blur-sm
                transition-all duration-200
                hover:border-indigo-400
                hover:bg-white
                hover:text-indigo-600
                hover:shadow-md
              "
            >
              <Home className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>

          {/* Logo */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-200 bg-white shadow-sm">
              <img
                src={logo}
                alt="Contracts India Logo"
                className="rounded-2xl h-9 w-9 sm:h-11 sm:w-11 object-contain 
                    transition-all duration-300 
                    group-hover:scale-105"
              />
              {/* <Building2 className="" /> */}
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-slate-900">
                Contract India
              </h2>
              <p className="text-xs tracking-wider text-slate-500">
                Integrated Solution For Construction & Infrastructure
              </p>
            </div>
          </div>

          {/* Kicker badge */}
          {/* <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
            <Sparkles className="h-3.5 w-3.5" />
            {hero.kicker}
          </div> */}

          {/* Heading */}
          <h1 className="mt-1 max-w-xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl xl:text-6xl">
            {hero.title}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #06b6d4 100%)",
              }}
            >
              {hero.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {hero.subtitle}
          </p>

          {/* Feature bullets */}
          <div className="mt-10 grid gap-3">
            {hero.bullets.map((item) => (
              <div
                key={item.text}
                className="
                  group flex items-center gap-4
                  rounded-2xl
                  border border-indigo-100
                  bg-white/60
                  p-4
                  shadow-sm
                  backdrop-blur-sm
                  transition-all duration-300
                  hover:border-indigo-300
                  hover:bg-white/90
                  hover:shadow-md
                "
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="flex-1 text-sm font-medium text-slate-700 sm:text-base">
                  {item.text}
                </p>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-500" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── RIGHT SIDE ── */}
        <motion.section
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-10"
        >
          {/* Animated border wrapper */}
          <div className="relative w-full max-w-xl">
            {/* Animated conic border layer */}
            <div className="animated-border-ring absolute -inset-[2px] rounded-[34px]" />

            {/* Card */}
            <div className="relative overflow-hidden rounded-[32px] border border-indigo-100 bg-white/80 shadow-[0_8px_40px_rgba(99,102,241,0.12)] backdrop-blur-2xl">
              {/* Top shimmer line */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/60 to-transparent" />

              {/* Subtle inner tint */}
              <div className="absolute inset-0 bg-linear-to-br from-indigo-50/40 to-violet-50/30" />

              {/* Form content */}
              <div className="relative z-10 p-6 sm:p-8 md:p-10">
                <Outlet />
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

export default AuthLayout;
