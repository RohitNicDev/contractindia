import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, FileText, User, Mail, Phone, MapPin, Building2 } from "lucide-react";

export default function VerifyAction({ applicationId, userRow, userTab }) {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isCommercial = userTab === 2;

  const infoFields = [
    ...(isCommercial ? [{ label: "Company Name", value: userRow?.CompanyName, icon: Building2 }] : []),
    { label: "Name",     value: userRow?.Name,      icon: User     },
    { label: "Email",    value: userRow?.EmailId,   icon: Mail     },
    { label: "Mobile",   value: userRow?.MobileNo,  icon: Phone    },
    { label: "State",    value: userRow?.StateName, icon: MapPin   },
    { label: "Pin Code", value: userRow?.PinCode,   icon: MapPin   },
    ...(isCommercial ? [{ label: "Service", value: userRow?.ServiceName, icon: FileText }] : []),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await verifyUserApi(applicationId, { remarks });
      await new Promise((r) => setTimeout(r, 800)); // demo delay
      toast.success("User verified successfully!");
      setDone(true);
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User info summary */}
      <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
            <User className="w-3.5 h-3.5 text-white" />
          </span>
          <h4 className="font-black text-slate-800 text-sm">Applicant Details</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {infoFields.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-2.5 bg-white/70 rounded-xl p-3 border border-emerald-100/60">
              <Icon className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{value ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verify form */}
      {!done ? (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </span>
            <div>
              <h3 className="font-black text-slate-900 text-base">Verify User</h3>
              <p className="text-xs text-slate-500 mt-0.5">Approve this user's account and grant access.</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">
              Verification Remarks <span className="font-normal normal-case text-slate-400">(optional)</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              placeholder="Add any internal notes about this verification…"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none bg-white transition-all"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {loading ? "Verifying…" : "Confirm Verification"}
          </motion.button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-black text-emerald-800 text-lg">User Verified!</h3>
          <p className="text-sm text-emerald-600 mt-1">
            This user's account has been approved and they have been notified.
          </p>
        </motion.div>
      )}
    </div>
  );
}
