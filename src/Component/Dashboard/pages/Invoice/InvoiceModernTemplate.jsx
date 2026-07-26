// pages/CommercialDashboard/pages/Invoices/components/InvoiceModernTemplate.tsx
import { format } from "date-fns";

export default function InvoiceModernTemplate({ invoice }) {
    const totalBeforeTax = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const totalAfterDiscount = totalBeforeTax - (invoice.discount || 0);
    const total = totalAfterDiscount + invoice.tax;

    const statusColors = {
        paid: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
        pending: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
        overdue: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
        draft: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
    };

    const statusColor = statusColors[invoice.status] || statusColors.draft;

    return (
        <div className="p-8 md:p-12 space-y-8">
            {/* Header with Background */}
            <div className="relative -mx-8 -mt-8 md:-mx-12 md:-mt-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-8 md:p-12">
                <div className="absolute top-0 right-0 opacity-10">
                    <svg className="w-64 h-64" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="white" />
                    </svg>
                </div>

                <div className="relative">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center font-black text-lg mb-3">
                                {invoice.invoiceNumber.charAt(5)}
                            </div>
                            <h1 className="text-4xl font-black">INVOICE</h1>
                        </div>

                        <div className="text-right">
                            <div className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${invoice.status === "paid"
                                    ? "bg-emerald-500/30 text-emerald-200 border border-emerald-300"
                                    : invoice.status === "pending"
                                        ? "bg-amber-500/30 text-amber-200 border border-amber-300"
                                        : "bg-red-500/30 text-red-200 border border-red-300"
                                }`}>
                                {invoice.status.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">
                                Invoice Number
                            </p>
                            <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
                        </div>

                        <div className="text-right">
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">
                                Invoice Date
                            </p>
                            <p className="text-2xl font-bold">
                                {format(new Date(invoice.date), "dd MMM yyyy")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* From & To Section */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                        From
                    </p>
                    <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-900">ABC Corporation</p>
                        <p className="text-sm text-slate-600">contact@company.com</p>
                        <p className="text-sm text-slate-600">+91-98765-43210</p>
                        <p className="text-sm text-slate-600">123 Business Street</p>
                        <p className="text-sm text-slate-600">Delhi, India - 110001</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                        Bill To
                    </p>
                    <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-900">{invoice.clientName}</p>
                        <p className="text-sm text-slate-600">{invoice.clientEmail}</p>
                        <p className="text-sm text-slate-600">{invoice.clientPhone}</p>
                        <p className="text-sm text-slate-600">{invoice.clientAddress}</p>
                    </div>
                </div>
            </div>

            {/* Important Dates */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Issue Date
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                        {format(new Date(invoice.date), "dd MMM yyyy")}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Due Date
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                        {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Due In
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                        {Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </p>
                </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Description
                </p>
                <p className="text-sm font-semibold text-slate-900">
                    {invoice.description}
                </p>
            </div>

            {/* Items Table */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                            <th className="text-left px-6 py-4 font-bold text-sm">Description</th>
                            <th className="text-right px-6 py-4 font-bold text-sm">Qty</th>
                            <th className="text-right px-6 py-4 font-bold text-sm">Rate</th>
                            <th className="text-right px-6 py-4 font-bold text-sm">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, idx) => (
                            <tr
                                key={idx}
                                className={`border-b border-slate-200 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                                    } hover:bg-blue-50 transition-colors`}
                            >
                                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                                    {item.description}
                                </td>
                                <td className="text-right px-6 py-4 text-sm text-slate-900 font-medium">
                                    {item.quantity}
                                </td>
                                <td className="text-right px-6 py-4 text-sm text-slate-900 font-medium">
                                    ₹{item.rate.toLocaleString()}
                                </td>
                                <td className="text-right px-6 py-4 text-sm font-bold text-slate-900">
                                    ₹{item.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
                <div className="w-full md:w-96">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                        <span className="text-slate-600 font-medium">Subtotal</span>
                        <span className="text-slate-900 font-bold">
                            ₹{totalBeforeTax.toLocaleString()}
                        </span>
                    </div>

                    {/* Discount */}
                    {invoice.discount > 0 && (
                        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-red-50">
                            <span className="text-red-600 font-medium">Discount</span>
                            <span className="text-red-600 font-bold">
                                -₹{invoice.discount.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* Tax */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-blue-50">
                        <span className="text-blue-600 font-medium">Tax (18%)</span>
                        <span className="text-blue-600 font-bold">
                            ₹{invoice.tax.toLocaleString()}
                        </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
                        <span className="font-bold text-lg">Total Amount</span>
                        <span className="text-3xl font-black">
                            ₹{total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-200">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Notes
                    </p>
                    <p className="text-sm text-slate-700">{invoice.notes}</p>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Payment Terms
                    </p>
                    <p className="text-sm text-slate-700">{invoice.paymentTerms}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t-2 border-slate-200 pt-8">
                <p className="text-sm text-slate-600 font-medium">
                    Thank you for your business!
                </p>
                <p className="text-xs text-slate-500 mt-2">
                    If you have any questions about this invoice, please contact us.
                </p>
            </div>
        </div>
    );
}