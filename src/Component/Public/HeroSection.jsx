import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Select, Button, Modal, Row, Col, message, Space } from "antd";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  RocketOutlined, BankOutlined, UserOutlined, MailOutlined,
  PhoneOutlined, EnvironmentOutlined, SafetyCertificateOutlined, ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    badge: "🏛️ GOVERNMENT TENDERS",
    title: "Win Big Government Contracts",
    desc: "Access 8,400+ live PWD, NHAI & PSU tenders.",
    image: "https://www.hoffmannworkcomp.com/wp-content/uploads/why-workers-comp-claims-rise-during-construction-activity-1024x683.jpg",
  },
  {
    badge: "🏗️ VERIFIED CONTRACTORS",
    title: "Hire Top Civil Experts",
    desc: "50,000+ verified EPC, PMC & architects.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000",
  },
  {
    badge: "🧱 MATERIALS MARKET",
    title: "Source at Best Prices",
    desc: "Cement, steel & materials direct from suppliers.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000",
  },
];

const stats = [
  { value: "50K+", label: "Companies" },
  { value: "12K+", label: "Tenders" },
  { value: "₹8K Cr+", label: "Value" },
  { value: "28+", label: "States" },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyForm] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("companies_v1")) || [];
      localStorage.setItem("companies_v1", JSON.stringify([...existing, { id: Date.now(), ...values }]));
      message.success("Company registered successfully");
      companyForm.resetFields();
      setLoading(false);
      setOpen(false);
    }, 800);
  };

  return (
    <>
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden text-white">

        {/* ── Background image with crossfade ── */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={slides[currentSlide].image}
                className="w-full h-full object-cover"
                alt=""
              />
            </motion.div>
          </AnimatePresence>

          {/* Multi-layer overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/85 via-[#0a1628]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/70 via-transparent to-transparent" />

          {/* Animated grain texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ── Floating glow orbs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[15%] left-[5%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">

              {/* Slide badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-${currentSlide}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-amber-300"
                >
                  {slides[currentSlide].badge}
                </motion.div>
              </AnimatePresence>

              {/* Main heading */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
                >
                  India's Largest{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #fde68a 100%)" }}
                  >
                    Construction
                  </span>
                  <br />
                  <span className="text-white/90">Marketplace</span>
                </motion.h1>
              </AnimatePresence>

              {/* Slide desc */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentSlide}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="mt-5 text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-lg"
                >
                  {slides[currentSlide].desc}
                </motion.p>
              </AnimatePresence>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(245,158,11,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>  navigate("register")}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-[#162646] shadow-lg transition-all"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
                >
                  Register Company — FREE
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.18)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white border border-white/25 bg-white/10 backdrop-blur-md transition-all"
                >
                  Browse Tenders
                </motion.button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5"
              >
                {stats.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-amber-400/40 transition-colors duration-300" />
                    <div className="relative px-4 py-3">
                      <div className="text-2xl md:text-3xl font-black text-white">{item.value}</div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">{item.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Slide dots ── */}
        <div className="absolute bottom-8 right-10 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === i
                  ? "w-6 h-2 bg-amber-400"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>

        {/* ── Bottom glass edge ── */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
      </section>

 

      <style>{`
        .premium-modal .ant-modal-content { border-radius: 20px; overflow: hidden; }
      `}</style>
    </>
  );
};

export default HeroSection;
