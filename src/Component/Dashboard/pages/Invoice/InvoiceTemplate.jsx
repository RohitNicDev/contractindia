// pages/CommercialDashboard/pages/Invoices/components/InvoiceTemplate.tsx
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function InvoiceTemplate({ invoice, user }) {
    const totalBeforeTax = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const totalAfterDiscount = totalBeforeTax - (invoice.discount || 0);
    const total = totalAfterDiscount + invoice.tax;

    return (
        <div className="bg-white p-8 md:p-12 print:p-0 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-200 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                            {(user?.companyName || "C").charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">
                                {user?.companyName || "Your Company"}
                            </h1>
                            <p className="text-xs text-slate-500">
                                {user?.email} • {user?.mobile}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Invoice
                    </p>
                    <p className="text-3xl font-black text-indigo-600 mt-2">
                        {invoice.invoiceNumber}
                    </p>
                </div>
            </div>

            {/* From & To */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        From
                    </p>
                    <div className="space-y-1">
                        <p className="font-bold text-slate-900">{user?.companyName}</p>
                        <p className="text-sm text-slate-600">{user?.email}</p>
                        <p className="text-sm text-slate-600">{user?.mobile}</p>
                        {user?.pinCode && (
                            <p className="text-sm text-slate-600">Pin: {user.pinCode}</p>
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Bill To
                    </p>
                    <div className="space-y-1">
                        <p className="font-bold text-slate-900">{invoice.clientName}</p>
                        <p className="text-sm text-slate-600">{invoice.clientEmail}</p>
                    </div>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Invoice Date
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                        {format(new Date(invoice.date), "dd MMM yyyy")}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Due Date
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                        {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Description
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                        {invoice.description}
                    </p>
                </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-slate-200">
                            <th className="text-left font-bold text-slate-900 pb-3">
                                Description
                            </th>
                            <th className="text-right font-bold text-slate-900 pb-3">
                                Qty
                            </th>
                            <th className="text-right font-bold text-slate-900 pb-3">
                                Rate
                            </th>
                            <th className="text-right font-bold text-slate-900 pb-3">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-100">
                                <td className="py-4 text-slate-900">{item.description}</td>
                                <td className="text-right text-slate-900">{item.quantity}</td>
                                <td className="text-right text-slate-900">
                                    ₹{item.rate.toLocaleString()}
                                </td>
                                <td className="text-right font-semibold text-slate-900">
                                    ₹{item.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
                <div className="w-full md:w-80 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-slate-50">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-semibold">
                            ₹{totalBeforeTax.toLocaleString()}
                        </span>
                    </div>

                    {invoice.discount > 0 && (
                        <div className="flex justify-between items-center p-3 bg-red-50">
                            <span className="text-red-600 font-semibold">Discount</span>
                            <span className="font-semibold text-red-600">
                                -₹{invoice.discount.toLocaleString()}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-blue-50">
                        <span className="text-blue-600 font-semibold">Tax (18%)</span>
                        <span className="font-semibold text-blue-600">
                            ₹{invoice.tax.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
                        <span className="font-bold">Total Amount</span>
                        <span className="text-2xl font-black">
                            ₹{total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
                <div className="border-t-2 border-slate-200 pt-6">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Notes
                    </p>
                    <p className="text-sm text-slate-700">{invoice.notes}</p>
                </div>
            )}

            {/* Footer */}
            <div className="border-t-2 border-slate-200 pt-6 text-center text-xs text-slate-500">
                <p>Thank you for your business!</p>
                <p className="mt-2">
                    If you have any questions about this invoice, please contact{" "}
                    {user?.email}
                </p>
            </div>
        </div>
    );
}