// pages/CommercialDashboard/pages/Invoices/components/InvoicePrintTemplate.tsx
import { format } from "date-fns";

export default function InvoicePrintTemplate({ invoice }) {
    const totalBeforeTax = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const totalAfterDiscount = totalBeforeTax - (invoice.discount || 0);
    const total = totalAfterDiscount + invoice.tax;

    return (
        <div className="p-10 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-slate-300">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">INVOICE</h1>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase">Invoice #</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {invoice.invoiceNumber}
                    </p>
                </div>
            </div>

            {/* Company & Client Info */}
            <div className="grid grid-cols-2 gap-12">
                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-3">From</p>
                    <div className="text-sm space-y-1">
                        <p className="font-bold text-slate-900">ABC Corporation</p>
                        <p className="text-slate-600">123 Business Street</p>
                        <p className="text-slate-600">Delhi, India - 110001</p>
                        <p className="text-slate-600">contact@company.com</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-3">
                        Bill To
                    </p>
                    <div className="text-sm space-y-1">
                        <p className="font-bold text-slate-900">{invoice.clientName}</p>
                        <p className="text-slate-600">{invoice.clientEmail}</p>
                        <p className="text-slate-600">{invoice.clientPhone}</p>
                    </div>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-lg">
                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-1">
                        Invoice Date
                    </p>
                    <p className="text-sm font-semibold">
                        {format(new Date(invoice.date), "dd MMM yyyy")}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-1">
                        Due Date
                    </p>
                    <p className="text-sm font-semibold">
                        {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-1">
                        Description
                    </p>
                    <p className="text-sm font-semibold">{invoice.description}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className="overflow-hidden rounded-lg border border-slate-300">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800 text-white">
                            <th className="text-left px-6 py-3 font-bold text-sm">
                                Description
                            </th>
                            <th className="text-right px-6 py-3 font-bold text-sm">Qty</th>
                            <th className="text-right px-6 py-3 font-bold text-sm">Rate</th>
                            <th className="text-right px-6 py-3 font-bold text-sm">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, idx) => (
                            <tr
                                key={idx}
                                className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                                    } border-b border-slate-200`}
                            >
                                <td className="px-6 py-3 text-sm text-slate-900">
                                    {item.description}
                                </td>
                                <td className="text-right px-6 py-3 text-sm text-slate-900">
                                    {item.quantity}
                                </td>
                                <td className="text-right px-6 py-3 text-sm text-slate-900">
                                    ₹{item.rate.toLocaleString()}
                                </td>
                                <td className="text-right px-6 py-3 text-sm font-semibold text-slate-900">
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
                    <div className="space-y-2">
                        <div className="flex justify-between px-6 py-3 border-b border-slate-300">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-semibold text-slate-900">
                                ₹{totalBeforeTax.toLocaleString()}
                            </span>
                        </div>

                        {invoice.discount > 0 && (
                            <div className="flex justify-between px-6 py-3 border-b border-slate-300 bg-red-50">
                                <span className="text-red-600 font-medium">Discount</span>
                                <span className="font-semibold text-red-600">
                                    -₹{invoice.discount.toLocaleString()}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between px-6 py-3 border-b border-slate-300 bg-blue-50">
                            <span className="text-blue-600 font-medium">Tax (18%)</span>
                            <span className="font-semibold text-blue-600">
                                ₹{invoice.tax.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-between px-6 py-4 bg-slate-900 text-white rounded-lg">
                            <span className="font-bold">Total Amount</span>
                            <span className="text-2xl font-black">
                                ₹{total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
                <div className="border-t-2 border-slate-300 pt-6">
                    <p className="text-xs font-bold text-slate-600 uppercase mb-2">
                        Notes
                    </p>
                    <p className="text-sm text-slate-700">{invoice.notes}</p>
                </div>
            )}

            {/* Footer */}
            <div className="border-t-2 border-slate-300 pt-6 text-center text-xs text-slate-600">
                <p>Thank you for your business!</p>
                <p className="mt-2">
                    For questions, contact: contact@company.com | +91-98765-43210
                </p>
            </div>
        </div>
    );
}