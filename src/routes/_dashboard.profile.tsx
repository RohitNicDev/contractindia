import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Building2,
  Briefcase, FileText, Edit3, CheckCircle2, Camera,
} from "lucide-react";

const fu = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");
  const initials = (user.fullName || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const isCommercial = user.userType === "commercial";

  const fields = [
    { icon: User,      label: "Full Name",       value: user.fullName     || "—", grad: "from-indigo-500 to-violet-500"  },
    { icon: Mail,      label: "Email",            value: user.email        || "—", grad: "from-cyan-500 to-blue-500"      },
    { icon: Phone,     label: "Phone",            value: user.phone        || "—", grad: "from-emerald-500 to-teal-500"   },
    { icon: MapPin,    label: "State",            value: user.state        || "—", grad: "from-violet-500 to-purple-500"  },
    { icon: MapPin,    label: "City",             value: user.city         || "—", grad: "from-violet-500 to-purple-500"  },
    { icon: MapPin,    label: "Pin Code",         value: user.pinCode      || "—", grad: "from-amber-500 to-orange-400"   },
    { icon: Briefcase, label: "Company Type",     value: user.companyType  || "—", grad: "from-pink-500 to-rose-500"      },
    { icon: Briefcase, label: "Service Category", value: user.serviceGroup || "—", grad: "from-indigo-500 to-cyan-500"    },
  ];

  const commercialFields = [
    { icon: Building2, label: "Business Name", value: user.businessName || "—", grad: "from-indigo-500 to-violet-500" },
    { icon: FileText,  label: "GST Number",    value: user.gstNumber    || "—", grad: "from-cyan-500 to-blue-500"     },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl">

      {/* Page title */}
      <motion.div {...fu(0)}>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-500 shadow-md">
            <User className="h-4 w-4 text-white" />
          </span>
          <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
        </div>
        <p className="mt-1 text-sm text-slate-600 ml-11">Manage your personal and business information.</p>
      </motion.div>

      {/* Profile hero card */}
      <motion.div {...fu(1)}
        className={`overflow-hidden ${glassCard} hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 hover:border-indigo-200/60`}
      >
        {/* Cover — rich gradient with mesh overlay */}
        <div className="relative h-32 bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)",
            }}
          />
          <div className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%), linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />
          {/* Floating blobs */}
          <div className="absolute right-10 top-2 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute left-20 bottom-0 h-16 w-16 rounded-full bg-cyan-300/20 blur-xl" />
        </div>

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-end gap-4 -mt-12">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-linear-to-br from-indigo-500 to-violet-500 text-2xl font-black text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)]">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-indigo-100 shadow-md hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                <Camera className="h-3.5 w-3.5 text-indigo-500" />
              </button>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{user.fullName || "Your Name"}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide border ${
                  isCommercial
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  {isCommercial ? "Commercial" : "Individual"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="ml-auto flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] transition-shadow"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </motion.button>
          </div>

          {/* Sub-services */}
          {user.subServices?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.subServices.map((s: string) => (
                <span key={s} className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Personal info grid */}
      <motion.div {...fu(2)} className={`${glassCard} p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 shadow-md">
            <User className="h-3.5 w-3.5 text-white" />
          </span>
          <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <motion.div
              key={f.label}
              whileHover={{ x: 2 }}
              className="flex items-start gap-3 rounded-xl bg-slate-50/80 border border-slate-100 p-3.5 transition-all hover:border-indigo-100 hover:bg-indigo-50/30"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${f.grad} shadow-sm`}>
                <f.icon className="h-4 w-4 text-white" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{f.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{f.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Commercial section */}
      {isCommercial && (
        <motion.div {...fu(3)}
          className="rounded-2xl bg-indigo-50/60 backdrop-blur-xl border border-indigo-200/60 shadow-[0_4px_24px_rgba(99,102,241,0.10)] transition-all duration-300 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 shadow-md">
              <Building2 className="h-3.5 w-3.5 text-white" />
            </span>
            <h3 className="text-sm font-bold text-indigo-800">Business Details</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {commercialFields.map((f) => (
              <div key={f.label} className="flex items-start gap-3 rounded-xl bg-white/70 border border-indigo-100 p-3.5">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${f.grad} shadow-sm`}>
                  <f.icon className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-400">{f.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Verification */}
      <motion.div {...fu(4)}
        className="flex items-center gap-3 rounded-2xl bg-emerald-50/80 backdrop-blur-xl border border-emerald-200/60 shadow-[0_4px_24px_rgba(16,185,129,0.10)] p-4"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-md">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">Email Verified</p>
          <p className="text-xs text-emerald-600">Your account is active and verified via OTP.</p>
        </div>
      </motion.div>
    </div>
  );
}
