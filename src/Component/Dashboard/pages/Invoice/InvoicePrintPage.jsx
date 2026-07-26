// pages/CommercialDashboard/pages/Invoices/InvoicePrintPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Download,
    Printer,
    Mail,
    Settings,
    Eye,
    X,
} from "lucide-react";
import { toast } from "sonner";
import InvoiceModernTemplate from "./InvoiceModernTemplate";
import InvoiceClassicTemplate from "./InvoiceClassicTemplate";
import InvoiceMinimalTemplate from "./InvoiceMinimalTemplate";
import InvoicePrintTemplate from "./InvoicePrintTemplate";

// Mock invoice data
const mockInvoices = {
    "INV-001": {
        id: "INV-001",
        invoiceNumber: "#INV-2024001",
        clientName: "ABC Corporation",
        clientEmail: "contact@abcorp.com",
        clientPhone: "+91-98765-43210",
        clientAddress: "123 Business Street, Delhi, India - 110001",
        amount: 45000,
        status: "paid",
        date: "2024-01-15",
        dueDate: "2024-02-15",
        description: "Web Development Services",
        items: [
            {
                description: "Website Design & Development",
                quantity: 1,
                rate: 35000,
                amount: 35000,
            },
            { description: "UI/UX Consultation", quantity: 5, rate: 2000, amount: 10000 },
        ],
        tax: 5400,
        discount: 2000,
        notes: "Thank you for your business!",
        paymentTerms: "Net 30",
        companyLogo:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%234F46E5' width='100' height='100'/%3E%3Ctext x='50' y='65' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3EAC%3C/text%3E%3C/svg%3E",
    },
    "INV-002": {
        id: "INV-002",
        invoiceNumber: "#INV-2024002",
        clientName: "XYZ Solutions",
        clientEmail: "billing@xyzsol.com",
        clientPhone: "+91-87654-32109",
        clientAddress: "456 Tech Park, Bangalore, India - 560001",
        amount: 28500,
        status: "pending",
        date: "2024-02-01",
        dueDate: "2024-03-01",
        description: "Electrical Repair Services",
        items: [
            {
                description: "Emergency Repair Work",
                quantity: 8,
                rate: 2500,
                amount: 20000,
            },
            { description: "Parts & Materials", quantity: 1, rate: 8500, amount: 8500 },
        ],
        tax: 4275,
        discount: 0,
        notes: "Payment terms: Net 30",
        paymentTerms: "Net 30",
        companyLogo:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%230EA5E9' width='100' height='100'/%3E%3Ctext x='50' y='65' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3EXY%3C/text%3E%3C/svg%3E",
    },
};

const TEMPLATES = [
    { id: "modern", name: "Modern", icon: "✨" },
    { id: "classic", name: "Classic", icon: "📋" },
    { id: "minimal", name: "Minimal", icon: "◻" },
    { id: "standard", name: "Standard", icon: "📄" },
];

const PRINT_SETTINGS = {
    paperSize: "a4",
    orientation: "portrait",
    margins: "normal",
};

export default function InvoicePrintPage() {
    const { invoiceId = "INV-001" } = useParams();
    const navigate = useNavigate();
    const printRef = useRef(null);

    const [selectedTemplate, setSelectedTemplate] = useState("modern");
    const [showSettings, setShowSettings] = useState(false);
    const [printSettings, setPrintSettings] = useState(PRINT_SETTINGS);

    const invoice = mockInvoices[invoiceId];

    if (!invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Invoice not found
                    </h1>
                    <button
                        onClick={() => navigate("/commercial/dashboard/invoices")}
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        Back to Invoices
                    </button>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
        toast.success("Opening print dialog...");
    };

    const handleDownloadPDF = () => {
        // In production, use libraries like html2pdf or pdfkit
        toast.success("PDF download feature coming soon!");
    };

    const handleSendEmail = () => {
        toast.success(`Email sent to ${invoice.clientEmail}`);
    };

    const renderTemplate = () => {
        const commonProps = { invoice, printSettings };

        switch (selectedTemplate) {
            case "modern":
                return <InvoiceModernTemplate {...commonProps} />;
            case "classic":
                return <InvoiceClassicTemplate {...commonProps} />;
            case "minimal":
                return <InvoiceMinimalTemplate {...commonProps} />;
            case "standard":
            default:
                return <InvoicePrintTemplate {...commonProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Top Navigation - Hide on Print */}
            <div className="print:hidden sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-full px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate("/commercial/dashboard/invoices")}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        {/* Invoice Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-black text-slate-900 truncate">
                                {invoice.invoiceNumber}
                            </h1>
                            <p className="text-xs text-slate-500">
                                {invoice.clientName}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                            >
                                <Download className="w-4 h-4" /> PDF
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSendEmail}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all"
                            >
                                <Mail className="w-4 h-4" /> Send
                            </motion.button>

                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Template Selector */}
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {TEMPLATES.map((template) => (
                            <motion.button
                                key={template.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${selectedTemplate === template.id
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                            >
                                {template.icon} {template.name}
                            </motion.button>
                        ))}
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Paper Size
                                    </label>
                                    <select
                                        value={printSettings.paperSize}
                                        onChange={(e) =>
                                            setPrintSettings({
                                                ...printSettings,
                                                paperSize: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                                    >
                                        <option value="a4">A4</option>
                                        <option value="letter">Letter</option>
                                        <option value="legal">Legal</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Orientation
                                    </label>
                                    <select
                                        value={printSettings.orientation}
                                        onChange={(e) =>
                                            setPrintSettings({
                                                ...printSettings,
                                                orientation: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                                    >
                                        <option value="portrait">Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Margins
                                    </label>
                                    <select
                                        value={printSettings.margins}
                                        onChange={(e) =>
                                            setPrintSettings({
                                                ...printSettings,
                                                margins: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                                    >
                                        <option value="small">Small</option>
                                        <option value="normal">Normal</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Print Area */}
            <div
                ref={printRef}
                className="print:bg-white"
                style={{
                    padding: printSettings.margins === "large" ? "60px" : printSettings.margins === "small" ? "20px" : "40px",
                }}
            >
                <div className="max-w-4xl mx-auto bg-white print:shadow-none shadow-2xl">
                    {renderTemplate()}
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:bg-white {
            background-color: white !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          @page {
            size: ${printSettings.paperSize === "a4" ? "A4" : printSettings.paperSize === "letter" ? "8.5in 11in" : "8.5in 14in"};
            margin: ${printSettings.margins === "large" ? "0.8in" : printSettings.margins === "small" ? "0.25in" : "0.5in"};
          }

          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          button {
            display: none !important;
          }

          a {
            color: inherit;
            text-decoration: none;
          }
        }
      `}</style>
        </div>
    );
}