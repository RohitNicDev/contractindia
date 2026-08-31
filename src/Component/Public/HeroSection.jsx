import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import { Form, Input, Select, Button, Modal, Row, Col, message } from "antd";
import { ArrowRight, FileText, FlaskConical, CheckCircle2 } from "lucide-react";
import {
  RocketOutlined,
  BankOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Consulting_service from "../../assets/IMG/Consulting_service.jpeg";
import Industrial_labservice from "../../assets/IMG/Industrial_labservice.jpeg";

const slides = [
  {
    badge: "Consulting Services",
    title: "Expert Project",
    accent: "Consulting",
    desc: "Get professional support for DPR, estimation, project planning, approvals, tender documentation and compliance — all in one place.",
    image: Consulting_service,
    objectPosition: "center",
  },
  {
    badge: "Industrial Lab Services",
    title: "Certified Testing &",
    accent: "Inspection",
    desc: "Book NABL accredited laboratories for material testing, quality assurance, soil investigation and structural testing across India.",
    image: Industrial_labservice,
    objectPosition: "center",
  }, // {
  //   badge: "🏛️ GOVERNMENT TENDERS",
  //   title: "Win Big Government Contracts",
  //   desc: "Access 8,400 plus live PWD, NHAI, CPWD and PSU tenders across India.",
  //   image: "https://www.hoffmannworkcomp.com/wp-content/uploads/why-workers-comp-claims-rise-during-construction-activity-1024x683.jpg",
  // },
  {
    badge: "VERIFIED CONTRACTORS",
    title: "Hire Top Civil Experts",
    accent: "CONTRACTORS",

    objectPosition: "center",
    desc: "Connect with 50,000 plus verified EPC contractors, consultants, architects and engineers.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000",
  },
  // {
  //   badge: "🧱 MATERIALS MARKET",
  //   title: "Source at Best Prices",
  //   desc: "Buy cement, steel, electrical, plumbing and construction materials directly from trusted suppliers.",
  //   image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000",
  // },
];

const stats = [
  { target: 50, suffix: "K+", label: "Verified Companies" },
  { target: 12, suffix: "K+", label: "Live Tenders" },
  { prefix: "₹", target: 8, suffix: "K Cr+", label: "Project Value" },
  { target: 28, suffix: "+", label: "States Covered" },
];

const trustChips = [
  { icon: <SafetyCertificateOutlined />, text: "50K+ Verified EPC Partners" },
  { icon: <FlaskConical size={14} />, text: "NABL Accredited Labs" },
  { icon: <ThunderboltOutlined />, text: "24-Hour Expert Response" },
];

const SLIDE_DURATION = 6; // seconds

/* ── Animated counter (runs once when scrolled into view) ── */
const Counter = ({ target, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

/* ── Slide text variants ── */
const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const textItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (slides?.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides?.length);
    }, SLIDE_DURATION * 1000);
    return () => clearInterval(timer);
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("companies_v1")) || [];
      localStorage.setItem(
        "companies_v1",
        JSON.stringify([...existing, { id: Date.now(), ...values }]),
      );
      message.success("Company registered successfully");
      companyForm.resetFields();
      setLoading(false);
      setOpen(false);
    }, 800);
  };

  const slide = slides[currentSlide];

  /* ── Shared text block: badge → title → desc → CTAs → trust → controls ── */
  const renderTextBlock = () => (
<div className="hidden md:block max-w-2xl scale-[0.75] md:scale-[0.75] lg:scale-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          variants={textContainer}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {/* Badge pill */}
          <motion.div variants={textItem}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              {slide.badge}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={textItem}
            className="mt-4 font-black leading-[1.08] tracking-tight text-[clamp(1.8rem,3.4vw,3.25rem)]"
          >
            {slide.title}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #fbbf24 0%, #fde68a 55%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              {slide.accent}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={textItem}
            className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl"
          >
            {slide.desc}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* CTAs */}
      {/* <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 flex flex-wrap items-center gap-3.5"
      >
        <button
          onClick={() => navigate("/register")}
          className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-6 py-3 text-sm font-bold text-[#1a1206] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
            boxShadow: "0 12px 32px -8px rgba(245,158,11,0.45)",
          }}
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <RocketOutlined />
          Register Your Company
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

        <button
          onClick={() => navigate("/contact")}
          className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40"
        >
          Talk to an Expert
        </button>
      </motion.div> */}
 
    </div>
  );

  return (
    <>
      <section className="relative w-full text-white bg-[#0a1628]">
        {/* ══ BANNER — full image visible, ZERO crop, no zoom/parallax ══
             Height is driven by the image's own aspect ratio (invisible
             sizer <img>), so the complete banner always shows edge-to-edge. */}
        <div className="relative">
          {/* Aspect-ratio sizer (invisible) — keeps section height = image ratio */}
          <img
            src={slides[0].image}
            alt=""
            aria-hidden
            className="invisible block w-full h-auto select-none pointer-events-none"
          />

          {/* Crossfading slides — fade only, absolutely no scale/movement */}
          <div className="absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentSlide}
                src={slide.image}
                alt={slide.badge}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: slide.objectPosition || "center" }}
              />
            </AnimatePresence>
          </div>

          {/* Readability gradient — bottom only, banner stays fully visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-transparent to-transparent pointer-events-none" />

          {/* Grain texture (static) */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* ── Desktop: title/desc bottom-left over banner (above stats) ── */}
          <div className="hidden lg:block absolute inset-x-0 bottom-0 z-10">
            <div className="  mx-auto px-6 lg:px-12">
              <div className="flex items-end justify-end gap-10 pb-15 lg:pb-20 2xl:pb-28">
                {renderTextBlock()}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile/tablet: title/desc BELOW the full banner (stacked) ── */}
        <div className="lg:hidden absolute inset-x-0 top-0 z-10">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
            {renderTextBlock()}
          </div>
        </div>
      </section>

      <style>{`
        .premium-modal .ant-modal-content { border-radius: 20px; overflow: hidden; }
      `}</style>
    </>
  );
};

export default HeroSection;
