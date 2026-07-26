// pages/CommercialDashboard/pages/Invoices/components/InvoiceMinimalTemplate.tsx
import { format } from "date-fns";

export default function InvoiceMinimalTemplate({ invoice }) {
    const totalBeforeTax = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const totalAfterDiscount = totalBeforeTax - (invoice.discount || 0);
    const total = totalAfterDiscount + invoice.tax;

    return (
        <div className="p-8 md:p-12 space-y-6 text-slate-900">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-4xl font-black">INVOICE</h1>
                </div>
                <div className="text-right text-sm">
                    <p className="font-bold">{invoice.invoiceNumber}</p>
                    <p className="text-slate-600">
                        {format(new Date(invoice.date), "dd MMM yyyy")}
                    </p>
                </div>
            </div>

            {/* From & To */}
            <div className="grid grid-cols-2 gap-12 text-sm py-8 border-y border-slate-200">
                <div>
                    <p className="font-bold mb-2">From</p>
                    <p>ABC Corporation</p>
                    <p className="text-slate-600">123 Business Street</p>
                    <p className="text-slate-600">Delhi, India</p>
                </div>

                <div>
                    <p className="font-bold mb-2">To</p>
                    <p>{invoice.clientName}</p>
                    <p className="text-slate-600">{invoice.clientEmail}</p>
                </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b-2 border-slate-900">
                        <th className="text-left py-2 font-bold">Item</th>
                        <th className="text-right py-2 font-bold">Qty</th>
                        <th className="text-right py-2 font-bold">Rate</th>
                        <th className="text-right py-2 font-bold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                            <td className="py-2">{item.description}</td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">₹{item.rate.toLocaleString()}</td>
                            <td className="text-right py-2 font-semibold">
                                ₹{item.amount.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end">
                <div className="w-80 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{totalBeforeTax.toLocaleString()}</span>
                    </div>
                    {invoice.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                            <span>Discount</span>
                            <span>-₹{invoice.discount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{invoice.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-slate-300 pt-2">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-600 border-t border-slate-200 pt-8">
                {invoice.notes}
            </div>
        </div>
    );
}