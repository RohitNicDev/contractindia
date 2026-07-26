// pages/CommercialDashboard/pages/Invoices/components/InvoiceClassicTemplate.tsx
import { format } from "date-fns";

export default function InvoiceClassicTemplate({ invoice }) {
    const totalBeforeTax = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const totalAfterDiscount = totalBeforeTax - (invoice.discount || 0);
    const total = totalAfterDiscount + invoice.tax;

    return (
        <div className="p-10 md:p-14 space-y-8 print:space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b-4 border-slate-900 pb-6">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                        INVOICE
                    </h1>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-2">
                        Professional Service Invoice
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Invoice Number
                    </p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                        {invoice.invoiceNumber}
                    </p>
                </div>
            </div>

            {/* Company Info & Dates */}
            <div className="grid grid-cols-2 gap-12">
                <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">
                        From
                    </p>
                    <div className="space-y-2 text-sm">
                        <p className="font-bold text-slate-900">ABC Corporation</p>
                        <p className="text-slate-600">123 Business Street</p>
                        <p className="text-slate-600">Delhi, India - 110001</p>
                        <p className="text-slate-600">contact@company.com</p>
                        <p className="text-slate-600">+91-98765-43210</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">
                        Invoice Details
                    </p>
                    <div className="space-y-2 text-sm">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Date</p>
                            <p className="font-bold text-slate-900">
                                {format(new Date(invoice.date), "dd MMM yyyy")}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Due Date</p>
                            <p className="font-bold text-slate-900">
                                {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">
                    Bill To
                </p>
                <div className="space-y-1 text-sm">
                    <p className="font-bold text-slate-900 text-lg">{invoice.clientName}</p>
                    <p className="text-slate-600">{invoice.clientEmail}</p>
                    <p className="text-slate-600">{invoice.clientPhone}</p>
                    <p className="text-slate-600">{invoice.clientAddress}</p>
                </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-6 rounded-none border-l-4 border-slate-900">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                    Description
                </p>
                <p className="text-sm font-semibold text-slate-900">
                    {invoice.description}
                </p>
            </div>

            {/* Items Table - Classic Style */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-t-2 border-b-2 border-slate-900">
                        <th className="text-left py-3 font-bold text-slate-900">
                            Description
                        </th>
                        <th className="text-right py-3 font-bold text-slate-900 w-16">Qty</th>
                        <th className="text-right py-3 font-bold text-slate-900 w-28">
                            Rate
                        </th>
                        <th className="text-right py-3 font-bold text-slate-900 w-28">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                            <td className="py-3 text-slate-900">{item.description}</td>
                            <td className="text-right py-3 text-slate-900">{item.quantity}</td>
                            <td className="text-right py-3 text-slate-900">
                                ₹{item.rate.toLocaleString()}
                            </td>
                            <td className="text-right py-3 font-semibold text-slate-900">
                                ₹{item.amount.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals - Classic */}
            <div className="flex justify-end">
                <div className="w-full md:w-80">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-t border-slate-300">
                                <td className="py-3 text-slate-600">Subtotal</td>
                                <td className="text-right py-3 text-slate-900 font-semibold">
                                    ₹{totalBeforeTax.toLocaleString()}
                                </td>
                            </tr>

                            {invoice.discount > 0 && (
                                <tr className="border-t border-slate-300">
                                    <td className="py-3 text-slate-600">Discount</td>
                                    <td className="text-right py-3 text-red-600 font-semibold">
                                        -₹{invoice.discount.toLocaleString()}
                                    </td>
                                </tr>
                            )}

                            <tr className="border-t border-slate-300">
                                <td className="py-3 text-slate-600">Tax (18%)</td>
                                <td className="text-right py-3 text-slate-900 font-semibold">
                                    ₹{invoice.tax.toLocaleString()}
                                </td>
                            </tr>

                            <tr className="border-t-2 border-b-2 border-slate-900">
                                <td className="py-4 font-bold text-slate-900 text-lg">
                                    Total Amount Due
                                </td>
                                <td className="text-right py-4 text-slate-900 font-black text-2xl">
                                    ₹{total.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-300">
                <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                        Notes
                    </p>
                    <p className="text-sm text-slate-600">{invoice.notes}</p>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                        Terms & Conditions
                    </p>
                    <p className="text-sm text-slate-600">{invoice.paymentTerms}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t-2 border-slate-300 text-center">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                    Thank you for your business
                </p>
                <p className="text-xs text-slate-500">
                    Contact us: contact@company.com | +91-98765-43210
                </p>
            </div>
        </div>
    );
}