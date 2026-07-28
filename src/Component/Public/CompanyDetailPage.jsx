import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
} from "lucide-react";
import {
  UserRegistrationUserIdGet,
  userBasicInformationbyParam,
  userBankDetailbyParams,
  UserDocumentStoreGetById,
  getUserServicesByParam,
} from "../../services/api";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  "";

const fetchCompanyDetail = async (userId) => {
  const [regRes, basicRes, bankRes, docsRes, servicesRes] = await Promise.all([
    UserRegistrationUserIdGet(userId).then((res) => res?.data?.[0] ?? res?.data ?? {}),
    userBasicInformationbyParam(`userId=${userId}`).then((res) => res?.data?.[0] ?? {}),
    userBankDetailbyParams(`userId=${userId}`).then((res) => res?.data?.[0] ?? {}),
    UserDocumentStoreGetById(`userId=${userId}`).then((res) => res?.data ?? []),
    getUserServicesByParam(`userId=${userId}`).then((res) => res?.data ?? []),
  ]);

  return {
    registration: regRes,
    basic: basicRes,
    bank: bankRes,
    documents: docsRes,
    services: servicesRes,
  };
};

function SectionCard({ title, icon: Icon, children, accent = "indigo" }) {
  const accentColors = {
    indigo: "from-indigo-500/12 to-violet-500/8 text-indigo-700",
    emerald: "from-emerald-500/12 to-teal-500/8 text-emerald-700",
    blue: "from-blue-500/12 to-cyan-500/8 text-blue-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className={`mb-4 flex items-center gap-2 rounded-2xl bg-gradient-to-r ${accentColors[accent] ?? accentColors.indigo} px-3 py-2`}>
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-black text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value || "—"}</p>
    </div>
  );
}

export default function CompanyDetailPage() {
  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-company-detail", userId],
    queryFn: () => fetchCompanyDetail(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const company = data?.registration || {};
  const basic = data?.basic || {};
  const bank = data?.bank || {};
  const documents = data?.documents || [];
  const services = data?.services || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-40 rounded-full bg-slate-200" />
          <div className="h-32 rounded-3xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-40 rounded-3xl bg-slate-200" />
            <div className="h-40 rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !company?.CompanyName) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg font-semibold text-slate-700">Company details could not be loaded.</p>
        <Link to="/company-list" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Back to companies
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 py-16">
      <div className="container mx-auto px-4">
        <Link to="/company-list" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Back to Verified Companies
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_12px_50px_rgba(15,23,42,0.08)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified company
              </div>
              <h1 className="text-3xl font-black text-slate-900">{company.CompanyName || basic.CompanyName || "Company"}</h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {basic.CompanyTypeName || company.UserTypeName || "Professional service provider"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-500" />
                {basic.Address || company.StateName || "Location available on request"}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* <SectionCard title="Company Information" icon={Building2} accent="indigo">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="Contact Person" value={basic.ContactNo || company.Name} />
                <InfoRow label="Email" value={company.EmailId || basic.EmailId} />
                <InfoRow label="Mobile" value={basic.ContactNo || company.MobileNo} />
                <InfoRow label="Address" value={basic.Address || company.Address} />
              </div>
            </SectionCard> */}

            <SectionCard title="Registration Details" icon={FileText} accent="blue">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="GST Number" value={basic.GSTNo || company.GSTNo} />
                <InfoRow label="PAN Number" value={basic.PANNo || company.PANNo} />
                <InfoRow label="CIN Number" value={basic.CINNo || company.CINNo} />
                <InfoRow label="MSME / Udyam" value={basic.UdyogRegistrationNo || company.UdyogRegistrationNo} />
              </div>
            </SectionCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <SectionCard title="Banking Details" icon={ShieldCheck} accent="emerald">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="Bank Name" value={bank.BankName} />
                <InfoRow label="IFSC" value={bank.IFSC} />
                <InfoRow label="MICR" value={bank.MICR} />
                <InfoRow label="Account" value={bank.AccountNo ? `••••${String(bank.AccountNo).slice(-4)}` : ""} />
              </div>
            </SectionCard>

            <SectionCard title="Services" icon={Briefcase} accent="indigo">
              {services?.length ? (
                <div className="flex flex-wrap gap-2">
                  {services.map((service, idx) => (
                    <span key={idx} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {service.ServiceName || service.serviceName || service.Name || service.name || "Service"}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No service list available.</p>
              )}
            </SectionCard>
          </div>

          <div className="mt-6">
            <SectionCard title="Documents" icon={Upload} accent="blue">
              {documents?.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-sm font-semibold text-slate-800">{doc.DocumentName || doc.documentName || `Document ${idx + 1}`}</p>
                      <p className="mt-1 text-xs text-slate-500">{doc.DocumentCategoryName || doc.documentCategoryName || "Uploaded document"}</p>
                      {doc.DocumentPath || doc.documentPath ? (
                        <a
                          href={`${BASE_URL}/${doc.DocumentPath || doc.documentPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-xs font-bold text-indigo-600"
                        >
                          View file
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No documents available at the moment.</p>
              )}
            </SectionCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
