import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { XCircle, User, Mail, Phone, MapPin, Building2, FileText, AlertTriangle } from "lucide-react";

const REJECT_REASONS = [
  "Incomplete documentation",
  "Invalid identity proof",
  "Duplicate registration",
  "Business credentials mismatch",
  "Suspicious activity detected",
  "Other",
];

export default function RejectAction({ applicationId, userRow, userTab }) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isCommercial = userTab === 2;

  const infoFields = [
    ...(isCommercial ? [{ label: "Company Name", value: userRow?.CompanyName, icon: Building2 }] : []),
    { label: "Name",     value: userRow?.Name,      icon: User   },
    { label: "Email",    value: userRow?.EmailId,   icon: Mail   },
    { label: "Mobile",   value: userRow?.MobileNo,  icon: Phone  },
    { label: "State",    value: userRow?.StateName, icon: MapPin },
    ...(isCommercial ? [{ label: "Service", value: userRow?.ServiceName, icon: FileText }] : []),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setLoading(true);
    try {
      // await rejectUserApi(applicationId, { reason: finalReason });
      await new Promise((r) => setTimeout(r, 800));
      toast.success("User rejected successfully.");
      setDone(true);
    } catch {
      toast.error("Failed to reject user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Applicant summary */}
      <div className="rounded-2xl bg-red-50/60 border border-red-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-sm">
            <User className="w-3.5 h-3.5 text-white" />
          </span>
          <h4 className="font-black text-slate-800 text-sm">Applicant Details</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {infoFields.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-2.5 bg-white/70 rounded-xl p-3 border border-red-100/60">
              <Icon className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{value ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject form */}
      {!done ? (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-md">
              <XCircle className="w-4 h-4 text-white" />
            </span>
            <div>
              <h3 className="font-black text-slate-900 text-base">Reject User</h3>
              <p className="text-xs text-slate-500 mt-0.5">This will deny the user's registration request.</p>
            </div>
          </div>

          {/* Warning banner */}
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-amber-700">
              The user will be notified about this rejection. Please provide an accurate reason.
            </p>
          </div>

          {/* Reason selector */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REJECT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    reason === r
                      ? "bg-red-50 border-red-400 text-red-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50/40"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason when "Other" selected */}
          {reason === "Other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">
                Custom Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                placeholder="Describe the reason for rejection…"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none bg-white transition-all"
              />
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading || !reason}
            whileHover={!loading && reason ? { scale: 1.02 } : {}}
            whileTap={!loading && reason ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
          >
            <XCircle className="w-4 h-4" />
            {loading ? "Processing…" : "Confirm Rejection"}
          </motion.button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-black text-red-800 text-lg">User Rejected</h3>
          <p className="text-sm text-red-600 mt-1">
            This registration has been declined. The user has been notified.
          </p>
        </motion.div>
      )}
    </div>
  );
}
