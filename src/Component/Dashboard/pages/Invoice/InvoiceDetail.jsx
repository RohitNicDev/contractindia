// pages/CommercialDashboard/pages/Invoices/components/InvoiceDetail.tsx
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Download,
    Printer,
    Mail,
    Share2,
    MoreVertical,
    Copy,
    CheckCircle2,
    AlertCircle,
    Clock,
} from "lucide-react";
import { useState } from "react";
import InvoiceTemplate from "./InvoiceTemplate";
import { glass } from "../../CommercialDashboard";
import { useNavigate } from "react-router-dom";

export default function InvoiceDetail({
    invoice,
    user,
    onBack,
    onDownload,
    onPrint,
    onEmail,
}) {
    const [showTemplate, setShowTemplate] = useState(true);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const totalBeforeTax = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const totalAfterDiscount = totalBeforeTax - (invoice.discount || 0);
    const total = totalAfterDiscount + invoice.tax;

    const statusConfig = {
        paid: {
            label: "Paid",
            color: "emerald",
            icon: CheckCircle2,
            bg: "bg-emerald-50",
            border: "border-emerald-200",
        },
        pending: {
            label: "Pending",
            color: "amber",
            icon: Clock,
            bg: "bg-amber-50",
            border: "border-amber-200",
        },
        overdue: {
            label: "Overdue",
            color: "red",
            icon: AlertCircle,
            bg: "bg-red-50",
            border: "border-red-200",
        },
        draft: {
            label: "Draft",
            color: "slate",
            icon: Clock,
            bg: "bg-slate-50",
            border: "border-slate-200",
        },
    };

    const currentStatus = statusConfig[invoice.status] || statusConfig.draft;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDownload(invoice)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/commercial/dashboard/invoices/print/${invoice.id}`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEmail(invoice)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all"
                    >
                        <Mail className="w-4 h-4" /> Send Email
                    </motion.button>

                    <div className="relative group">
                        <button className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Share2 className="w-4 h-4" /> Share Invoice
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 border-t border-slate-100">
                                Mark as Paid
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-semibold text-red-600 border-t border-slate-100">
                                Delete Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice Template */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={glass + " overflow-hidden shadow-2xl"}
                    >
                        <InvoiceTemplate invoice={invoice} user={user} />
                    </motion.div>
                </div>

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    {/* Status Card */}
                    <div
                        className={`${glass} ${currentStatus.bg} border-2 ${currentStatus.border} p-6`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <StatusIcon className="w-6 h-6 text-amber-600" />
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">
                                    Status
                                </p>
                                <p className="text-lg font-black text-slate-900">
                                    {currentStatus.label}
                                </p>
                            </div>
                        </div>

                        {invoice.status === "pending" && (
                            <button className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors text-sm">
                                Mark as Paid
                            </button>
                        )}

                        {invoice.status === "draft" && (
                            <button className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors text-sm">
                                Send Invoice
                            </button>
                        )}
                    </div>

                    {/* Invoice Number */}
                    <div className={glass + " p-6"}>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                            Invoice Number
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={invoice.invoiceNumber}
                                readOnly
                                className="flex-1 px-3 py-2 rounded-lg bg-slate-50 text-slate-900 font-semibold text-sm"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(invoice.invoiceNumber);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <Copy className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                        {copied && (
                            <p className="text-xs text-emerald-600 font-semibold mt-2">
                                ✓ Copied
                            </p>
                        )}
                    </div>

                    {/* Important Dates */}
                    <div className={glass + " p-6 space-y-4"}>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">
                                Invoice Date
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                {new Date(invoice.date).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">
                                Due Date
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">
                                Days Until Due
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                {Math.ceil(
                                    (new Date(invoice.dueDate) - new Date()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                days
                            </p>
                        </div>
                    </div>

                    {/* Amount Summary */}
                    <div className={glass + " p-6 space-y-3"}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Subtotal</span>
                            <span className="font-semibold text-slate-900">
                                ₹{totalBeforeTax.toLocaleString()}
                            </span>
                        </div>

                        {invoice.discount > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Discount</span>
                                <span className="font-semibold text-red-600">
                                    -₹{invoice.discount.toLocaleString()}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Tax (18%)</span>
                            <span className="font-semibold text-slate-900">
                                ₹{invoice.tax.toLocaleString()}
                            </span>
                        </div>

                        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                            <span className="font-bold text-slate-900">Total Amount</span>
                            <span className="text-2xl font-black text-indigo-600">
                                ₹{total.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Client Details */}
                    <div className={glass + " p-6"}>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                            Bill To
                        </p>
                        <div className="space-y-2">
                            <p className="font-bold text-slate-900">{invoice.clientName}</p>
                            <p className="text-sm text-slate-600">{invoice.clientEmail}</p>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className={glass + " p-6"}>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                                Notes
                            </p>
                            <p className="text-sm text-slate-700">{invoice.notes}</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}