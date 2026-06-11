import { motion, AnimatePresence } from "framer-motion";
import { StatusBadge } from "./dataTable";
import { XCircle } from "lucide-react";
export const UserDetailDrawer = ({ user, tab, onClose }) => {
    if (!user) return null;
    const isCommercial = tab === 2;

    const fields = [
        ...(isCommercial ? [{ label: "Company Name", value: user.CompanyName }] : []),
        { label: "Name", value: user.Name },
        { label: "Email", value: user.EmailId },
        { label: "Mobile", value: user.MobileNo },
        { label: "State", value: user.StateName },
        { label: "Pin Code", value: user.PinCode },
        ...(isCommercial ? [{ label: "Service Name", value: user.ServiceName }] : []),
        { label: "Status", value: user.Status },
    ];

    return (
        <motion.div
            key="drawer"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                        {(user.Name ?? user.CompanyName ?? "?")[0]}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-sm">{user.Name ?? user.CompanyName ?? "—"}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{isCommercial ? "Commercial Account" : "Individual Account"}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/80 transition-colors text-slate-400 hover:text-slate-700">
                    <XCircle className="w-5 h-5" />
                </button>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                {fields.map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                            <p className="mt-0.5 text-sm font-semibold text-slate-800">
                                {label === "Status"
                                    ? <StatusBadge val={value} />
                                    : (value ?? "—")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <p className="text-[11px] text-slate-400 text-center">
                    Use the table action buttons to Verify or Reject this user.
                </p>
            </div>
        </motion.div>
    );
}