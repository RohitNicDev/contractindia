import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Building2, User, Mail, Phone, ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";

const steps = ["Company Info", "Verify Mobile", "Verify Email"];

const BUSINESS_TYPES = [
  { value: "contractor", label: "Contractor" },
  { value: "builder", label: "Builder" },
  { value: "interior", label: "Interior" },
  { value: "manufacturer", label: "Manufacturer" },
];

export default function CommercialRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [form, setForm] = useState({
    companyName: "", contactPersonName: "", email: "",
    mobile1: "", mobile2: "", password: "", businessType: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Company name required";
    if (!form.contactPersonName.trim()) e.contactPersonName = "Contact person required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Valid email required";
    if (!form.mobile1.match(/^[0-9]{10}$/)) e.mobile1 = "10-digit mobile required";
    if (form.mobile2 && !form.mobile2.match(/^[0-9]{10}$/)) e.mobile2 = "10-digit mobile required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (!form.businessType) e.businessType = "Select business type";
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
    localStorage.setItem("commercial_user_v1", JSON.stringify({ ...form, userType: "commercial", verified: true }));
    toast.success("Account verified! Redirecting to Commercial Dashboard…");
    setTimeout(() => navigate("/commercial/dashboard"), 900);
  };

  const inputCls = (key) => `w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-white/70 backdrop-blur outline-none transition-all ${
    errors[key] ? "border-red-400 bg-red-50/30" : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_20px_60px_rgba(59,130,246,0.15)] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 mb-5 transition-colors">← Back to Home</Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">Commercial Registration</h1>
                <p className="text-xs text-slate-500">ContractsIndia™ — Business Account</p>
              </div>
            </div>
            {/* Steps */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black transition-all duration-300 ${
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "bg-slate-100 text-slate-400"
                  }`}>
                    {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:block ${i === step ? "text-blue-600" : "text-slate-400"}`}>{s}</span>
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

                  {/* Company Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Company Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input value={form.companyName} onChange={e => set("companyName", e.target.value)}
                        placeholder="Your company name" className={inputCls("companyName")} />
                    </div>
                    {errors.companyName && <p className="text-xs text-red-500 mt-0.5">{errors.companyName}</p>}
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Contact Person Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input value={form.contactPersonName} onChange={e => set("contactPersonName", e.target.value)}
                        placeholder="Authorized contact person" className={inputCls("contactPersonName")} />
                    </div>
                    {errors.contactPersonName && <p className="text-xs text-red-500 mt-0.5">{errors.contactPersonName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                        placeholder="company@example.com" className={inputCls("email")} />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                  </div>

                  {/* Mobile 1 + Mobile 2 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Mobile 1 *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="tel" value={form.mobile1} onChange={e => set("mobile1", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="Primary mobile" className={inputCls("mobile1")} />
                      </div>
                      {errors.mobile1 && <p className="text-xs text-red-500 mt-0.5">{errors.mobile1}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Mobile 2</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="tel" value={form.mobile2} onChange={e => set("mobile2", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="Alternate mobile" className={inputCls("mobile2")} />
                      </div>
                      {errors.mobile2 && <p className="text-xs text-red-500 mt-0.5">{errors.mobile2}</p>}
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Business Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BUSINESS_TYPES.map(bt => (
                        <button key={bt.value} type="button" onClick={() => set("businessType", bt.value)}
                          className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                            form.businessType === bt.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 text-slate-600 hover:border-blue-200"
                          }`}>
                          {bt.label}
                        </button>
                      ))}
                    </div>
                    {errors.businessType && <p className="text-xs text-red-500 mt-0.5">{errors.businessType}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Password *</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                        placeholder="Min. 6 characters" className={`${inputCls("password")} pr-10`} />
                      <button type="button" onClick={() => setShowPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                    Submit & Get OTP <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <p className="text-center text-xs text-slate-500">
                    Already registered? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
                  </p>
                </motion.form>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">Verify Mobile</h3>
                    <p className="text-sm text-slate-500 mt-1">OTP sent to <span className="font-bold text-slate-700">{form.mobile1}</span></p>
                  </div>
                  <input value={mobileOtp} onChange={e => setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •" maxLength={6}
                    className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none bg-white/70" />
                  <p className="text-xs text-slate-400 text-center">Demo: enter any 6 digits</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={verifyMobile}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
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
                  <input value={emailOtp} onChange={e => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •" maxLength={6}
                    className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/70" />
                  <p className="text-xs text-slate-400 text-center">Demo: enter any 6 digits</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={verifyEmail}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                    Verify Email & Go to Dashboard <ArrowRight className="w-4 h-4" />
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
