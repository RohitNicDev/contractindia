import { useState, useMemo, useCallback } from "react";
import {
  ShoppingCart, X, Plus, Minus, Trash2, ArrowLeft, ArrowRight,
  CheckCircle, Package, Tag, Truck, Shield, Star, Search,
  ChevronDown, Receipt, Clock, MapPin, CreditCard, Sparkles,
} from "lucide-react";

/* ============================================================
   CONSTANTS & DATA
   ============================================================ */
const CATEGORIES = ["All", "Design", "Development", "Marketing", "Analytics", "Support"];

const SERVICES = [
  {
    id: 1, category: "Design",
    title: "UI/UX Design Package",
    description: "Complete product design from wireframes to high-fidelity prototypes. Includes user research, design system, and handoff assets.",
    price: 1200, unit: "project",
    badge: "Popular", badgeColor: "bg-violet-100 text-violet-700",
    rating: 4.9, reviews: 128,
    features: ["Wireframes & Prototypes", "Design System", "Figma Handoff", "2 Revision Rounds"],
    icon: "🎨", accent: "from-violet-500 to-purple-600",
    deliveryDays: 7,
  },
  {
    id: 2, category: "Development",
    title: "React Frontend Build",
    description: "Production-ready React application with modern tooling, responsive design, and clean component architecture.",
    price: 2400, unit: "project",
    badge: "Best Value", badgeColor: "bg-blue-100 text-blue-700",
    rating: 4.8, reviews: 94,
    features: ["React + TypeScript", "Tailwind CSS", "Unit Tests", "CI/CD Setup"],
    icon: "⚛️", accent: "from-blue-500 to-cyan-600",
    deliveryDays: 14,
  },
  {
    id: 3, category: "Development",
    title: "API & Backend Service",
    description: "Scalable REST or GraphQL API with authentication, database design, and comprehensive documentation.",
    price: 1800, unit: "project",
    badge: null,
    rating: 4.7, reviews: 76,
    features: ["REST / GraphQL", "Auth & Security", "Database Design", "API Docs"],
    icon: "🔧", accent: "from-slate-600 to-slate-800",
    deliveryDays: 10,
  },
  {
    id: 4, category: "Marketing",
    title: "SEO & Content Strategy",
    description: "Full SEO audit, keyword strategy, and 90-day content calendar tailored to your target audience.",
    price: 750, unit: "month",
    badge: "New", badgeColor: "bg-emerald-100 text-emerald-700",
    rating: 4.6, reviews: 53,
    features: ["SEO Audit", "Keyword Research", "Content Calendar", "Monthly Report"],
    icon: "📈", accent: "from-emerald-500 to-teal-600",
    deliveryDays: 3,
  },
  {
    id: 5, category: "Analytics",
    title: "Data Dashboard Setup",
    description: "Custom analytics dashboard with KPI tracking, automated reports, and real-time data visualization.",
    price: 950, unit: "project",
    badge: null,
    rating: 4.8, reviews: 41,
    features: ["Custom KPIs", "Real-time Charts", "Auto Reports", "Data Integration"],
    icon: "📊", accent: "from-amber-500 to-orange-600",
    deliveryDays: 5,
  },
  {
    id: 6, category: "Support",
    title: "Priority Tech Support",
    description: "Dedicated support engineer available Mon–Fri with guaranteed 2-hour response time and monthly check-ins.",
    price: 490, unit: "month",
    badge: null,
    rating: 4.9, reviews: 210,
    features: ["2-hr Response SLA", "Dedicated Engineer", "Monthly Review", "Incident Reports"],
    icon: "🛡️", accent: "from-red-500 to-rose-600",
    deliveryDays: 0,
  },
  {
    id: 7, category: "Design",
    title: "Brand Identity Kit",
    description: "Logo design, color palette, typography system, and brand guidelines document ready for production use.",
    price: 850, unit: "project",
    badge: null,
    rating: 4.7, reviews: 89,
    features: ["Logo Suite", "Color System", "Type Scale", "Brand Guidelines"],
    icon: "✨", accent: "from-pink-500 to-rose-600",
    deliveryDays: 6,
  },
  {
    id: 8, category: "Marketing",
    title: "Email Campaign Setup",
    description: "End-to-end email marketing setup including sequences, templates, automation flows, and A/B testing.",
    price: 620, unit: "project",
    badge: "Popular", badgeColor: "bg-violet-100 text-violet-700",
    rating: 4.6, reviews: 67,
    features: ["3 Email Sequences", "Custom Templates", "Automation Flows", "A/B Testing"],
    icon: "📧", accent: "from-indigo-500 to-blue-600",
    deliveryDays: 5,
  },
];

const TAX_RATE = 0.08;
const SHIPPING = 0; // digital services

/* ============================================================
   UTILITY
   ============================================================ */
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const generateOrderId = () => `ORD-${Date.now().toString(36).toUpperCase().slice(-8)}`;

/* ============================================================
   STAR RATING
   ============================================================ */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ============================================================
   SERVICE CARD
   ============================================================ */
function ServiceCard({ service, cartQty, onAdd, onRemove }) {
  const inCart = cartQty > 0;
  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${inCart ? "border-indigo-300 shadow-lg shadow-indigo-100/60" : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/80"}`}>
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${service.accent}`} />

      {/* Badge */}
      {service.badge && (
        <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${service.badgeColor}`}>
          {service.badge}
        </span>
      )}

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Icon + title */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.accent} flex items-center justify-center text-lg flex-shrink-0`}>
            {service.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm leading-tight">{service.title}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Stars rating={service.rating} />
              <span className="text-[10px] text-slate-400 font-medium">{service.rating} ({service.reviews})</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed flex-1">{service.description}</p>

        {/* Features */}
        <ul className="space-y-1">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
              <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Delivery */}
        {service.deliveryDays > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            Delivered in {service.deliveryDays} business day{service.deliveryDays !== 1 ? "s" : ""}
          </div>
        )}

        {/* Price + actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-auto">
          <div>
            <span className="text-lg font-black text-slate-900">{fmt(service.price)}</span>
            <span className="text-[11px] text-slate-400 font-medium ml-1">/ {service.unit}</span>
          </div>

          {inCart ? (
            <div className="flex items-center gap-1 bg-indigo-50 rounded-xl p-1">
              <button onClick={() => onRemove(service.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors">
                {cartQty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>
              <span className="w-6 text-center text-sm font-bold text-indigo-700">{cartQty}</span>
              <button onClick={() => onAdd(service)} className="w-7 h-7 flex items-center justify-center rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAdd(service)}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-xl bg-gradient-to-r ${service.accent} text-white text-xs font-bold shadow-sm hover:shadow-md hover:opacity-90 transition-all`}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CART SIDEBAR
   ============================================================ */
function CartSidebar({ cart, services, onAdd, onRemove, onClear, onCheckout, onClose }) {
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <ShoppingCart className="w-7 h-7 text-slate-300" />
        </div>
        <div>
          <p className="font-bold text-slate-600 text-sm">Your cart is empty</p>
          <p className="text-xs text-slate-400 mt-1">Add services to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.accent} flex items-center justify-center text-base flex-shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate">{item.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{fmt(item.price)} / {item.unit}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-0.5">
                  <button onClick={() => onRemove(item.id)} className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors rounded">
                    {item.qty === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-5 text-center text-[11px] font-bold text-slate-700">{item.qty}</span>
                  <button onClick={() => onAdd(item)} className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors rounded">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs font-black text-slate-800">{fmt(item.price * item.qty)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-slate-100 px-5 py-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Subtotal</span><span className="font-semibold text-slate-700">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Tax (8%)</span><span className="font-semibold text-slate-700">{fmt(tax)}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
          <span>Total</span><span>{fmt(total)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full mt-2 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200"
        >
          Checkout <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={onClear} className="w-full text-center text-[11px] text-slate-400 hover:text-red-500 transition-colors mt-1 font-medium">
          Clear cart
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   BILLING PAGE
   ============================================================ */
function BillingPage({ cart, onBack, onConfirm }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", zip: "", country: "United States",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const set = (field) => (e) => {
    let val = e.target.value;
    if (field === "cardNumber") val = val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    if (field === "expiry") val = val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);
    if (field === "cvv") val = val.replace(/\D/g, "").slice(0, 4);
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (!form.cardName.trim()) e.cardName = "Required";
    if (form.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "16 digits required";
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY format";
    if (form.cvv.length < 3) e.cvv = "3-4 digits";
    return e;
  };

  const handleSubmit = async () => {
    // const e = validate();
    // if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400)); // simulate API
    onConfirm({ form, orderId: generateOrderId(), total, tax, subtotal, cart, date: new Date() });
  };

  const Field = ({ label, field, placeholder, half, type = "text" }) => (
    <div className={half ? "col-span-1" : "col-span-2 sm:col-span-2"}>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={set(field)}
        className={`w-full h-10 rounded-xl border px-3.5 text-sm outline-none transition-all bg-white placeholder-slate-300 ${errors[field] ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`}
      />
      {errors[field] && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to services
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Cart", "Billing", "Confirmation"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${i === 1 ? "bg-indigo-600 text-white" : i < 1 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                {i < 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i === 1 ? "text-indigo-600" : i < 1 ? "text-emerald-600" : "text-slate-400"}`}>{step}</span>
              {i < 2 && <ChevronDown className="w-3.5 h-3.5 text-slate-300 -rotate-90" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — forms */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" field="firstName" placeholder="Jane" half />
                <Field label="Last name" field="lastName" placeholder="Smith" half />
                <Field label="Email address" field="email" placeholder="jane@company.com" type="email" />
                <Field label="Phone (optional)" field="phone" placeholder="+1 (555) 000-0000" half />
              </div>
            </section>

            {/* Billing address */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">2</span>
                Billing Address
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Street address" field="address" placeholder="123 Main Street" />
                <Field label="City" field="city" placeholder="San Francisco" half />
                <Field label="ZIP / Postal code" field="zip" placeholder="94105" half />
                <div className="col-span-2 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country</label>
                  <select value={form.country} onChange={set("country")} className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white">
                    {["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "India", "Other"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">3</span>
                Payment Details
              </h2>

              {/* Card art */}
              <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 mb-5 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-8" />
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Card Number</p>
                <p className="text-white font-mono text-base font-bold mt-1 tracking-widest">
                  {form.cardNumber || "•••• •••• •••• ••••"}
                </p>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Cardholder</p>
                    <p className="text-white text-sm font-bold mt-0.5">{form.cardName || "YOUR NAME"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Expires</p>
                    <p className="text-white text-sm font-bold mt-0.5">{form.expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Name on card" field="cardName" placeholder="Jane Smith" />
                <Field label="Card number" field="cardNumber" placeholder="1234 5678 9012 3456" />
                <Field label="Expiry date" field="expiry" placeholder="MM/YY" half />
                <Field label="CVV" field="cvv" placeholder="•••" half />
              </div>

              <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                256-bit SSL encrypted · PCI DSS compliant
              </div>
            </section>
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-6">
              <h2 className="font-black text-slate-800 text-sm mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.accent} flex items-center justify-center text-sm flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate leading-tight">{item.title}</p>
                      <p className="text-[10px] text-slate-400">×{item.qty}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-800 flex-shrink-0">{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-semibold text-slate-700">{fmt(subtotal)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Tax (8%)</span><span className="font-semibold text-slate-700">{fmt(tax)}</span></div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-100">
                  <span>Total due</span><span>{fmt(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-5 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay {fmt(total)}</>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-3">
                {["VISA", "MC", "AMEX", "PayPal"].map((b) => (
                  <span key={b} className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   RECEIPT PAGE
   ============================================================ */
function ReceiptPage({ order, onDone }) {
  const { orderId, form, cart, subtotal, tax, total, date } = order;

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg">

        {/* Success header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-3">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Payment confirmed!</h1>
          <p className="text-sm text-slate-500 mt-1">
            Receipt sent to <span className="font-semibold text-slate-700">{form.email}</span>
          </p>
        </div>

        {/* Receipt card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100/80 overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-white/70" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">Tax Invoice</span>
                </div>
                <p className="font-black text-lg">{fmt(total)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Order</p>
                <p className="font-mono font-bold text-sm mt-0.5">{orderId}</p>
              </div>
            </div>
          </div>

          {/* Dashed separator (receipt tear) */}
          <div className="relative flex items-center px-4 py-0">
            <div className="absolute left-0 w-5 h-5 bg-slate-50 rounded-full -translate-x-1/2 border border-slate-200" />
            <div className="flex-1 border-t-2 border-dashed border-slate-100 mx-4" />
            <div className="absolute right-0 w-5 h-5 bg-slate-50 rounded-full translate-x-1/2 border border-slate-200" />
          </div>

          <div className="px-6 py-5 space-y-5">

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Date", value: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Time", value: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
                { label: "Customer", value: `${form.firstName} ${form.lastName}` },
                { label: "Payment", value: `•••• ${(form.cardNumber.replace(/\s/g, "")).slice(-4)}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Billing address */}
            <div className="bg-slate-50 rounded-xl p-3 flex gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Billing Address</p>
                <p className="text-xs text-slate-600">{form.address}, {form.city}, {form.zip}</p>
                <p className="text-xs text-slate-600">{form.country}</p>
              </div>
            </div>

            {/* Line items */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Services Purchased</p>
              <div className="space-y-2.5">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.accent} flex items-center justify-center text-sm flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{fmt(item.price)} × {item.qty}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 flex-shrink-0">{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-dashed border-slate-200 pt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal</span><span className="font-semibold text-slate-700">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tax (8%)</span><span className="font-semibold text-slate-700">{fmt(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-emerald-600">{fmt(total)}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-1">
              {[
                { icon: <Shield className="w-3.5 h-3.5 text-emerald-500" />, label: "Secure Payment" },
                { icon: <Package className="w-3.5 h-3.5 text-blue-500" />, label: "Delivery Guaranteed" },
                { icon: <Receipt className="w-3.5 h-3.5 text-violet-500" />, label: "Invoice Sent" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">{icon}</div>
                  <span className="text-[9px] font-bold text-slate-400 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 text-center">
            <p className="text-[10px] text-slate-400">Thank you for your purchase · Questions? <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">support@synapse.io</span></p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => window.print()}
            className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Receipt className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={onDone}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md shadow-indigo-200"
          >
            Shop More <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function BuyingService() {
  const [page, setPage] = useState("shop"); // "shop" | "billing" | "receipt"
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [order, setOrder] = useState(null);

  // ── Cart helpers ──────────────────────────────────────────
  const addToCart = useCallback((service) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === service.id);
      if (exists) return prev.map((i) => i.id === service.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...service, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.qty === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  // ── Filter services ───────────────────────────────────────
  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchSearch = !search.trim() || s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  // ── Receipt ───────────────────────────────────────────────
  const handleConfirm = (orderData) => {
    setOrder(orderData);
    setCart([]);
    setCartOpen(false);
    setPage("receipt");
  };

  /* ── RECEIPT PAGE ── */
  if (page === "receipt" && order) {
    return <ReceiptPage order={order} onDone={() => { setOrder(null); setPage("shop"); }} />;
  }

  /* ── BILLING PAGE ── */
  if (page === "billing") {
    return <BillingPage cart={cart} onBack={() => setPage("shop")} onConfirm={handleConfirm} />;
  }

  /* ── SHOP PAGE ── */
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 text-base">Synapse</span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium ml-1">Services</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services…"
              className="w-full h-9 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-medium outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen((p) => !p)}
            className="relative flex items-center gap-2 h-9 px-4 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-6">

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              Professional Services
            </h1>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">
              Handpicked digital services from vetted experts. Fixed pricing, guaranteed delivery.
            </p>
          </div>

          {/* Mobile search */}
          <div className="relative sm:hidden mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services…"
              className="w-full h-9 rounded-full border border-slate-200 bg-white pl-9 pr-4 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-8 px-3.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
              >
                {cat}
              </button>
            ))}
            {(search || activeCategory !== "All") && (
              <span className="text-[11px] text-slate-400 font-medium ml-1">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <p className="font-bold text-slate-500 text-sm">No services match your search</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="text-xs text-indigo-600 font-semibold hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  cartQty={cart.find((i) => i.id === service.id)?.qty ?? 0}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </main>

        {/* ── Desktop Cart Panel ── */}
        <aside className={`hidden lg:flex flex-col w-80 flex-shrink-0 transition-all duration-300 ${cartOpen || cartCount > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sticky top-24 max-h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-slate-600" />
                <h2 className="font-black text-slate-800 text-sm">Cart</h2>
                {cartCount > 0 && <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">{cartCount}</span>}
              </div>
              {cartCount > 0 && (
                <button
                  onClick={() => setPage("billing")}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <CartSidebar
                cart={cart}
                services={SERVICES}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onClear={() => setCart([])}
                onCheckout={() => setPage("billing")}
                onClose={() => setCartOpen(false)}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ── Mobile Cart Drawer ── */}
      {cartOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
            <div className="relative w-80 max-w-full h-full bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-slate-600" />
                  <h2 className="font-black text-slate-800 text-sm">Your Cart</h2>
                  {cartCount > 0 && <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">{cartCount}</span>}
                </div>
                <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CartSidebar
                  cart={cart}
                  services={SERVICES}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                  onClear={() => setCart([])}
                  onCheckout={() => { setCartOpen(false); setPage("billing"); }}
                  onClose={() => setCartOpen(false)}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Sticky mobile checkout bar ── */}
      {cartCount > 0 && !cartOpen && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full h-13 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-between px-5 shadow-xl shadow-indigo-500/30"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              View Cart ({cartCount})
            </span>
            <span>{fmt(cart.reduce((s, i) => s + i.price * i.qty, 0))}</span>
          </button>
        </div>
      )}
    </div>
  );
}