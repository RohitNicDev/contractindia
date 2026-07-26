// pages/CommercialDashboard/pages/Invoices/InvoicesPage.tsx
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Printer,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Calendar,
  IndianRupee,
  Check,
  Clock,
  AlertCircle,
  Mail,
  Share2,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import InvoiceDetail from "./Invoice/InvoiceDetail";
import { glass } from "../CommercialDashboard";

const INVOICE_STATUSES = {
  paid: { label: "Paid", color: "emerald", icon: Check },
  pending: { label: "Pending", color: "amber", icon: Clock },
  overdue: { label: "Overdue", color: "red", icon: AlertCircle },
  draft: { label: "Draft", color: "slate", icon: Clock },
};

export default function InvoicesPage() {
  const { user } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list or detail
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock invoice data
  const invoices = [
    {
      id: "INV-001",
      invoiceNumber: "#INV-2024001",
      clientName: "ABC Corporation",
      clientEmail: "contact@abcorp.com",
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
    },
    {
      id: "INV-002",
      invoiceNumber: "#INV-2024002",
      clientName: "XYZ Solutions",
      clientEmail: "billing@xyzsol.com",
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
    },
    {
      id: "INV-003",
      invoiceNumber: "#INV-2024003",
      clientName: "Tech Startups Inc",
      clientEmail: "accounts@techstartup.com",
      amount: 62000,
      status: "overdue",
      date: "2024-01-01",
      dueDate: "2024-02-01",
      description: "Plumbing Installation Project",
      items: [
        {
          description: "Full Bathroom Installation",
          quantity: 1,
          rate: 40000,
          amount: 40000,
        },
        { description: "Pipe & Fitting Supply", quantity: 1, rate: 15000, amount: 15000 },
        { description: "Labor Charges", quantity: 10, rate: 700, amount: 7000 },
      ],
      tax: 9300,
      discount: 3000,
      notes: "Please remit payment urgently",
    },
    {
      id: "INV-004",
      invoiceNumber: "#INV-2024004",
      clientName: "Enterprise Solutions",
      clientEmail: "finance@enterprise.com",
      amount: 15000,
      status: "draft",
      date: "2024-02-10",
      dueDate: "2024-03-10",
      description: "Maintenance Services",
      items: [
        {
          description: "Monthly Maintenance",
          quantity: 1,
          rate: 12000,
          amount: 12000,
        },
        { description: "Emergency Support", quantity: 0.5, rate: 6000, amount: 3000 },
      ],
      tax: 2250,
      discount: 2250,
      notes: "Draft invoice - pending approval",
    },
    {
      id: "INV-005",
      invoiceNumber: "#INV-2024005",
      clientName: "Global Industries",
      clientEmail: "payment@globalind.com",
      amount: 95000,
      status: "paid",
      date: "2023-12-20",
      dueDate: "2024-01-20",
      description: "HVAC System Installation",
      items: [
        {
          description: "HVAC Unit Supply",
          quantity: 3,
          rate: 25000,
          amount: 75000,
        },
        {
          description: "Installation & Setup",
          quantity: 20,
          rate: 500,
          amount: 10000,
        },
        { description: "Testing & Commissioning", quantity: 1, rate: 5000, amount: 5000 },
      ],
      tax: 13500,
      discount: 8500,
      notes: "Thank you for choosing our services",
    },
  ];

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.amount, 0),
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewMode("detail");
  };

  const handleDownloadPDF = (invoice) => {
    toast.success(`Downloading invoice ${invoice.invoiceNumber}...`);
    // In production, implement actual PDF generation using libraries like jsPDF or pdfkit
  };

  const handlePrint = (invoice) => {
    window.print();
  };

  const handleSendEmail = (invoice) => {
    toast.success(`Sending invoice to ${invoice.clientEmail}...`);
  };

  if (viewMode === "detail" && selectedInvoice) {
    return (
      <InvoiceDetail
        invoice={selectedInvoice}
        user={user}
        onBack={() => {
          setViewMode("list");
          setSelectedInvoice(null);
        }}
        onDownload={handleDownloadPDF}
        onPrint={handlePrint}
        onEmail={handleSendEmail}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Manage and track your invoices</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${stats.total.toLocaleString()}`,
            icon: IndianRupee,
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "Paid",
            value: `₹${stats.paid.toLocaleString()}`,
            icon: Check,
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Pending",
            value: `₹${stats.pending.toLocaleString()}`,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "Overdue",
            value: `₹${stats.overdue.toLocaleString()}`,
            icon: AlertCircle,
            color: "from-red-500 to-pink-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className={glass + " p-5"}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
              >
                <stat.icon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={glass + " p-4 flex flex-col md:flex-row gap-4"}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice number or client name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm font-semibold"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Invoices List */}
      <motion.div
        layout
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredInvoices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={glass + " p-12 text-center"}
            >
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold">No invoices found</p>
              <p className="text-slate-400 text-sm mt-1">
                Try adjusting your search filters
              </p>
            </motion.div>
          ) : (
            filteredInvoices.map((invoice, idx) => {
              const statusConfig =
                INVOICE_STATUSES[invoice.status] ||
                INVOICE_STATUSES.draft;
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={invoice.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={glass + " group hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer"}
                >
                  <div
                    onClick={() => handleViewInvoice(invoice)}
                    className="p-4 md:p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-slate-900 truncate">
                            {invoice.invoiceNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shrink-0 bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}
                            style={{
                              backgroundColor: `var(--color-${statusConfig.color}-100, #f0f9ff)`,
                              color: `var(--color-${statusConfig.color}-700, #0c4a6e)`,
                            }}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-slate-500 font-semibold">
                              CLIENT
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                              {invoice.clientName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-semibold">
                              DATE
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                              {new Date(invoice.date).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-semibold">
                              DUE DATE
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                              {new Date(invoice.dueDate).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className="flex items-center justify-between md:justify-end gap-4 md:flex-col md:items-end">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 font-semibold">
                            AMOUNT
                          </p>
                          <p className="text-2xl font-black text-indigo-600 mt-1">
                            ₹{invoice.amount.toLocaleString()}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewInvoice(invoice);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF(invoice);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendEmail(invoice);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </motion.button>

                          <div className="relative group">
                            <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrint(invoice);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-semibold text-slate-700"
                              >
                                <Printer className="w-4 h-4" /> Print
                              </button>
                              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-semibold text-slate-700 border-t border-slate-100">
                                <Share2 className="w-4 h-4" /> Share
                              </button>
                              <button className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-semibold text-red-600 border-t border-slate-100">
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}