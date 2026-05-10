import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Building2,
  Briefcase, FileText, Edit3, CheckCircle2, Camera,
} from "lucide-react";

export const Route = createFileRoute("/_dashboard/profile")({
  component: ProfilePage,
});

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
});

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("registration_form_v1") || "{}");
  const initials = (user.fullName || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const isCommercial = user.userType === "commercial";

  const fields = [
    { icon: User,      label: "Full Name",       value: user.fullName      || "—" },
    { icon: Mail,      label: "Email",            value: user.email         || "—" },
    { icon: Phone,     label: "Phone",            value: user.phone         || "—" },
    { icon: MapPin,    label: "State",            value: user.state         || "—" },
    { icon: MapPin,    label: "City",             value: user.city          || "—" },
    { icon: MapPin,    label: "Pin Code",         value: user.pinCode       || "—" },
    { icon: Briefcase, label: "Company Type",     value: user.companyType   || "—" },
    { icon: Briefcase, label: "Service Category", value: user.serviceGroup  || "—" },
  ];

  const commercialFields = [
    { icon: Building2, label: "Business Name", value: user.businessName || "—" },
    { icon: FileText,  label: "GST Number",    value: user.gstNumber    || "—" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal and business information.</p>
      </motion.div>

      {/* Profile card */}
      <motion.div {...fadeUp(1)} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-end gap-4 -mt-10">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-indigo-600 text-2xl font-black text-white shadow-md">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-indigo-50 transition-colors">
                <Camera className="h-3 w-3 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{user.fullName || "Your Name"}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${isCommercial ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                  {isCommercial ? "Commercial" : "Individual"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>
            <button className="ml-auto flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>

          {/* Sub-services */}
          {user.subServices?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.subServices.map((s: string) => (
                <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Info grid */}
      <motion.div {...fadeUp(2)} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-indigo-500 shadow-sm">
                <f.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{f.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Commercial section */}
      {isCommercial && (
        <motion.div {...fadeUp(3)} className="rounded-2xl border border-indigo-100 bg-white shadow-sm p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-indigo-400">Business Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {commercialFields.map((f) => (
              <div key={f.label} className="flex items-start gap-3 rounded-xl bg-indigo-50/50 p-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-indigo-100 text-indigo-500 shadow-sm">
                  <f.icon className="h-4 w-4" />
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

      {/* Verification status */}
      <motion.div {...fadeUp(4)} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-bold text-emerald-800">Email Verified</p>
          <p className="text-xs text-emerald-600">Your account is active and verified via OTP.</p>
        </div>
      </motion.div>
    </div>
  );
}
