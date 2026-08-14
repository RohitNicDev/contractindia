import { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Home,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import logo from "../assets/IMG/logo_con1.png";

/* ═══════════════════════════════════════════════════════════
   🖱️ REAL-TIME MOUSE GLOW — requestAnimationFrame loop with
   lerp smoothing (no React re-renders, pure transform updates)
   ═══════════════════════════════════════════════════════════ */
const MouseGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    let raf;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      // lerp — smooth real-time follow (har frame me render)
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${cx - 200}px, ${cy - 200}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] h-[400px] w-[400px] rounded-full will-change-transform"
      style={{
        background:
          "radial-gradient(circle, rgba(245,158,11,0.13) 0%, rgba(22,38,70,0.06) 45%, transparent 70%)",
      }}
    />
  );
};

/* ═══════════════════════════════════════════════════════════
   💧 INTERACTIVE CLICK RIPPLES — har click/tap pe expanding
   double-ring water ripple, animation end pe auto cleanup
   ═══════════════════════════════════════════════════════════ */
const RippleLayer = ({ ripples }) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
    {ripples.map((r) => (
      <span key={r.id}>
        {/* Main ring */}
        <motion.span
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 4.2, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            left: r.x - 30,
            top: r.y - 30,
            width: 60,
            height: 60,
            border: "1.5px solid rgba(245,158,11,0.55)",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 65%)",
          }}
        />
        {/* Delayed echo ring */}
        <motion.span
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 1.05, delay: 0.12, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            left: r.x - 30,
            top: r.y - 30,
            width: 60,
            height: 60,
            border: "1.5px solid rgba(22,38,70,0.35)",
          }}
        />
      </span>
    ))}
  </div>
);

const HERO_BY_PATH = {
  "/register": {
    kicker: "Contracts India™",
    title: "Build your",
    highlight: "business profile",
    subtitle:
      "Connect with contractors, consultants and suppliers across India through one powerful platform.",
    bullets: [
      { icon: Building2, text: "Verified contractor & supplier ecosystem" },
      { icon: ShieldCheck, text: "Secure onboarding with trusted verification" },
    ],
  },
  "/login": {
    kicker: "WELCOME BACK",
    title: "Access your",
    highlight: "workspace",
    subtitle: "Pick up right where you left off — your projects are waiting.",
    bullets: [
      { icon: ShieldCheck, text: "Verified contractor & supplier ecosystem" },
      { icon: Building2, text: "Centralized contractor management" },
    ],
  },
  "/otp": {
    kicker: "SECURITY CHECK",
    title: "Verify your",
    highlight: "identity",
    subtitle:
      "Enter the verification code sent to your email or mobile number.",
    bullets: [
      { icon: ShieldCheck, text: "Fast and secure verification" },
      { icon: Sparkles, text: "Protected access to your account" },
    ],
  },
};

const DEFAULT_HERO = HERO_BY_PATH["/login"];

export default function AuthLayout() {
  const { pathname } = useLocation();
  const hero = HERO_BY_PATH[pathname] ?? DEFAULT_HERO;

  /* ── Ripple state + click handler ── */
  const rootRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const spawnRipple = (e) => {
    // Interactive elements (buttons/inputs/links/forms) pe ripple mat do —
    // warna form use karte time distracting lagega
    if (e.target.closest("button, a, input, select, textarea, form, .ant-form")) return;

    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const id = Date.now() + Math.random();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev.slice(-6), { id, x, y }]); // max 7 active
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1200);
  };

  return (
    <div
      ref={rootRef}
      onPointerDown={spawnRipple}
      className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-slate-900"
    >
      {/* ── Animated conic border-ring CSS (theme: navy #162646 + amber) ── */}
      <style>{`
        @property --border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes border-spin {
          to { --border-angle: 360deg; }
        }

        .animated-border-ring {
          --border-angle: 0deg;
          background: conic-gradient(
            from var(--border-angle),
            rgba(22, 38, 70, 0.30) 0%,
            rgba(22, 38, 70, 0.30) 30%,
            #f59e0b 45%,
            #fbbf24 52%,
            #0ea5e9 66%,
            rgba(22, 38, 70, 0.30) 79%,
            rgba(22, 38, 70, 0.30) 100%
          );
          animation: border-spin 6s linear infinite;
        }
      `}</style>

      {/* ── Background blobs (navy + amber theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(22,38,70,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(22,38,70,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* blob 1 — navy */}
        <motion.div
          className="absolute -left-[15%] top-[5%] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full blur-[120px]"
          style={{ background: "rgba(22,38,70,0.35)" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* blob 2 — amber */}
        <motion.div
          className="absolute right-[-12%] top-[15%] h-[min(85vw,480px)] w-[min(85vw,480px)] rounded-full blur-[120px]"
          style={{ background: "rgba(245,158,11,0.3)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
        />
        {/* blob 3 — light blue accent */}
        <motion.div
          className="absolute bottom-[-8%] left-[22%] h-[min(80vw,440px)] w-[min(80vw,440px)] rounded-full blur-[120px]"
          style={{ background: "rgba(59,130,246,0.22)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        {/* blob 4 — soft amber */}
        <motion.div
          className="absolute bottom-[12%] right-[8%] h-[min(70vw,360px)] w-[min(70vw,360px)] rounded-full blur-[120px]"
          style={{ background: "rgba(251,191,36,0.2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          transition={{ duration: 1.1, delay: 0.25 }}
        />
      </div>

      {/* 🖱️ Real-time mouse glow + 💧 click ripples */}
      <MouseGlow />
      <RippleLayer ripples={ripples} />

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
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200
                bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm
                transition-all duration-200 hover:border-[#162646]/40 hover:bg-white
                hover:text-[#162646] hover:shadow-md no-underline"
            >
              <Home className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>

          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src={logo}
                alt="Contracts India Logo"
                className="rounded-xl h-9 w-9 object-contain transition-all duration-300"
              />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#162646]">
                Contracts India™
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Integrated Solution For Construction &amp; Infrastructure
              </p>
            </div>
          </div>

          {/* Kicker badge */}
          <div className="mb-4 inline-flex w-fit items-center gap-2.5 rounded-full border border-amber-500/25 bg-amber-400/10 px-4 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-600">
              {hero.kicker}
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-1 max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-[#162646] sm:text-5xl xl:text-6xl">
            {hero.title}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #162646 0%, #192f46 55%, #165f46 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              {hero.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            {hero.subtitle}
          </p>

          {/* Feature bullets */}
          <div className="mt-9 grid gap-3 max-w-xl">
            {hero.bullets.map((item) => (
              <div
                key={item.text}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/80
                  bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all duration-300
                  hover:border-amber-300 hover:bg-white hover:shadow-lg hover:shadow-amber-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#162646] text-amber-400 shadow-md">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="flex-1 text-sm font-semibold text-slate-700 sm:text-base">
                  {item.text}
                </p>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-500" />
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
          <div className="relative w-full max-w-xl">
            {/* Soft glow behind card */}
            <div
              className="absolute -inset-6 rounded-[44px] opacity-60 blur-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(22,38,70,0.08) 60%, transparent 100%)",
              }}
            />

            {/* Card — animated conic border ring (p-[2px] wrapper = border),
                   inner card ka radius 2px kam rakha taaki ring evenly rounded lage */}
            <div className="animated-border-ring relative rounded-[30px] p-[2px] shadow-[0_20px_60px_-20px_rgba(22,38,70,0.32)]">
              <div className="relative overflow-hidden rounded-[28px] bg-white/95 backdrop-blur-2xl">
                {/* ✅ Top shimmer line — FIX: rounded corners ke andar fit hoti hai.
                       Pehle inset-x-0 top-0 full-width thi, isliye line ke corners
                       card ke rounded border ke BAHAR nikal jaate the (square edge).
                       Ab left/right offset + rounded-full diya hai. */}
                <div className="absolute left-8 right-8 top-0 h-[2.5px] " />

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 md:p-10">
                  <Outlet />
                </div>
              </div>
            </div>

            {/* Trust note below card */}
            <p className="mt-5 text-center text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              256-bit encrypted · ISO certified platform
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}