import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from "lucide-react";

const steps = ["Account", "Verify Mobile", "Verify Email"];

export default function IndividualRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Valid email required";
    if (!form.mobile.match(/^[0-9]{10}$/)) e.mobile = "10-digit mobile required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    toast.success("OTP sent to your mobile number");
    setStep(1);
  };

  const verifyMobile = () => {
    if (mobileOtp.length !== 6) { toast.error("Enter 6-digit OTP"); return; }
    toast.success("Mobile verified!");
    setStep(2);
  };

  const verifyEmail = () => {
    if (emailOtp.length !== 6) { toast.error("Enter 6-digit OTP"); return; }
    localStorage.setItem("individual_user_v1", JSON.stringify({ ...form, userType: "individual", verified: true }));
    toast.success("Account verified! Redirecting to dashboard…");
    setTimeout(() => navigate("/individual/dashboard"), 900);
  };

  const field = (label, key, type = "text", icon, placeholder) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          type={key === "password" ? (showPass ? "text" : "password") : type}
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-white/70 backdrop-blur outline-none transition-all
            ${errors[key] ? "border-red-400 bg-red-50/30" : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`}
        />
        {key === "password" && (
          <button type="button" onClick={() => setShowPass(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[key] && <p className="text-xs text-red-500 font-medium">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 flex items-center justify-center p-4">
      {/* Glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_20px_60px_rgba(99,102,241,0.15)] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-5 transition-colors">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">Individual Registration</h1>
                <p className="text-xs text-slate-500">ContractsIndia™ — Personal Account</p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black transition-all duration-300 ${
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-slate-100 text-slate-400"
                  }`}>
                    {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:block ${i === step ? "text-indigo-600" : "text-slate-400"}`}>{s}</span>
                  {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 py-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.form key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }} onSubmit={handleSubmit} className="space-y-4">
                  {field("Full Name *", "name", "text", <User className="w-4 h-4" />, "Your full name")}
                  {field("Email Address *", "email", "email", <Mail className="w-4 h-4" />, "you@example.com")}
                  {field("Mobile Number *", "mobile", "tel", <Phone className="w-4 h-4" />, "10-digit mobile")}
                  {field("Password *", "password", "password", <ShieldCheck className="w-4 h-4" />, "Min. 6 characters")}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    Submit & Get OTP <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <p className="text-center text-xs text-slate-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
                  </p>
                </motion.form>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">Verify Mobile</h3>
                    <p className="text-sm text-slate-500 mt-1">OTP sent to <span className="font-bold text-slate-700">{form.mobile}</span></p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Enter 6-digit OTP</label>
                    <input value={mobileOtp} onChange={e => setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="• • • • • •" maxLength={6}
                      className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-white/70" />
                    <p className="text-xs text-slate-400 text-center mt-2">Demo: enter any 6 digits</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={verifyMobile}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    Verify Mobile OTP <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">Verify Email</h3>
                    <p className="text-sm text-slate-500 mt-1">OTP sent to <span className="font-bold text-slate-700">{form.email}</span></p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Enter 6-digit OTP</label>
                    <input value={emailOtp} onChange={e => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="• • • • • •" maxLength={6}
                      className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-white/70" />
                    <p className="text-xs text-slate-400 text-center mt-2">Demo: enter any 6 digits</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={verifyEmail}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                    Verify Email & Continue <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
