import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  UserRegistrationUserIdGet,
  userBasicInformationbyParam,
  getUserServicesByParam,
  userRegistrationHomeDetails,
} from "../../services/api";

const BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || "";
const API_ROOT = BASE_URL.replace(/\/$/, "");

const fetchCompanyDetail = async (userId) => {
  const [regRes, basicRes, servicesRes] = await Promise.all([
    UserRegistrationUserIdGet(userId).then(
      (res) => res?.data?.[0] ?? res?.data ?? {},
    ),
    userBasicInformationbyParam(`userId=${userId}`).then(
      (res) => res?.data?.[0] ?? {},
    ),
    getUserServicesByParam(`userId=${userId}`).then((res) => res?.data ?? []),
  ]);

  return {
    registration: regRes,
    basic: basicRes,
    services: servicesRes,
  };
};

const fetchVerifiedCompanies = async () => {
  const response = await userRegistrationHomeDetails(
    "isVerifiedByAdmin=1&userType=2",
  );
  return response?.data ?? [];
};

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

export default function CompanyDetailPage() {
  const { userId } = useParams();
  const [imageUnavailable, setImageUnavailable] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-company-detail", userId],
    queryFn: () => fetchCompanyDetail(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const {
    data: companies = [],
    isLoading: companiesLoading,
    isError: companiesError,
  } = useQuery({
    queryKey: [
      "userRegistrationDetailsGetApi",
      { isVerifiedByAdmin: 1, userType: 2 },
    ],
    queryFn: fetchVerifiedCompanies,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const company = data?.registration || {};
  const basic = data?.basic || {};
  const services = Array.isArray(data?.services) ? data.services : [];
  const companyName = company.CompanyName || basic.CompanyName || "Company";

  const location =
    basic.Address ||
    [basic.CityName, basic.StateName || company.StateName]
      .filter(Boolean)
      .join(", ") ||
    company.Address ||
    "India";
  const phone =
    basic.MobileNo || basic.ContactNo || company.MobileNo || company.PhoneNo;
  const email = basic.EmailId || company.EmailId;
  const description =
    basic.CompanyDescription ||
    basic.AboutCompany ||
    basic.Description ||
    company.CompanyDescription ||
    company.Description;
  const imageUrl = `${API_ROOT}/UserDocumentStore/image?userId=${userId}&documentCategoryId=7&documentSubCategoryId=10`;
  useEffect(() => {
    setImageUnavailable(false);
  }, [imageUrl]);
  const activeServices = services
    .filter((service) => Number(service?.IsActive ?? service?.isActive) === 1)
    .map((service) => ({
      id:
        service?.ServiceID ??
        service?.serviceID ??
        service?.ServiceId ??
        service?.serviceId,
      name:
        service?.ServiceName ||
        service?.serviceName ||
        service?.Name ||
        service?.name,
    }))
    .filter((service) => service.name);
  const otherCompanies = companies.filter(
    (item) => String(item?.UserId) !== String(userId),
  );

  const registrationRows = [
    { label: "GST number", value: basic.GSTNo || company.GSTNo },
    { label: "CIN number", value: basic.CINNo || company.CINNo },
    {
      label: "MSME / Udyam",
      value: basic.UdyogRegistrationNo || company.UdyogRegistrationNo,
    },
  ].filter((item) => item.value);

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

  if (isError || !(company?.CompanyName || basic?.CompanyName)) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg font-semibold text-slate-700">
          Company details could not be loaded.
        </p>
        <Link
          to="/company-list"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to companies
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/company-list" className="hover:text-indigo-600">
            Companies
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="max-w-[220px] truncate text-slate-700">
            {companyName}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid h-56 grid-cols-1 gap-1 bg-slate-100 sm:h-72 md:grid-cols-[1.5fr_1fr]">
            <div className="relative min-h-0 overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-800">
              {!imageUnavailable ? (
                <img
                  src={imageUrl}
                  alt={`${companyName} profile`}
                  className="h-full w-full object-cover"
                  onError={() => setImageUnavailable(true)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-white/80">
                  <Building2 className="h-16 w-16" strokeWidth={1.2} />
                  <span className="mt-3 text-sm font-semibold">
                    Company profile
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <ImageIcon className="h-3.5 w-3.5" /> Company profile photo
              </div>
            </div>
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-6 md:flex md:flex-col md:justify-between">
              <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <span className="rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700">
                  Contracts India
                </span>
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                  Verified business profile
                </p>
                <p className="mt-2 text-2xl font-black leading-tight text-slate-800">
                  Connect with trusted industry professionals.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Explore the company’s services and business details below.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {company.Status || "Verified company"}
                </span>
                {(basic.CompanyTypeName || company.UserTypeName) && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                    {basic.CompanyTypeName || company.UserTypeName}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {companyName}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />{" "}
                {location}
              </p>
            </div>
            {/* <div className="flex shrink-0 flex-wrap gap-2">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <Phone className="h-4 w-4" /> Call company
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
                >
                  <Mail className="h-4 w-4" /> Send enquiry
                </a>
              ) : null}
              {!phone && !email && (
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
                  <ShieldCheck className="h-4 w-4" /> Contact details
                  unavailable
                </span>
              )}
            </div> */}
          </div>

          <nav
            className="flex gap-6 overflow-x-auto border-t border-slate-100 px-5 sm:px-7"
            aria-label="Company profile sections"
          >
            {[
              ["overview", "Overview"],
              ["services", "Services"],
              ["business-details", "Business details"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="whitespace-nowrap border-b-2 border-transparent py-3 text-xs font-bold text-slate-500 transition hover:border-indigo-500 hover:text-indigo-700"
              >
                {label}
              </a>
            ))}
          </nav>
        </motion.div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section
              id="overview"
              className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900">
                  About {companyName}
                </h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {description ||
                  `${companyName} is listed on Contracts India${location ? `, serving customers from ${location}` : ""}. Explore the company’s listed services and verified business information on this profile.`}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoRow label="Business name" value={companyName} />
                <InfoRow label="Location" value={location} />
                <InfoRow
                  label="Business type"
                  value={basic.CompanyTypeName || company.UserTypeName}
                />
                <InfoRow
                  label="Profile status"
                  value={company.Status || "Listed on Contracts India"}
                />
              </div>
            </section>

            <section
              id="services"
              className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900">
                  Services offered
                </h2>
              </div>
              {activeServices.length ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {activeServices.map((service, index) => {
                    const hasServiceId =
                      Number.isFinite(Number(service.id)) &&
                      Number(service.id) > 0;
                    const content = (
                      <>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                          <CheckCircle2 className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-700">
                            {service.name}
                          </span>
                          {hasServiceId && (
                            <span className="mt-1 block text-xs text-slate-500">
                              Explore contractors
                            </span>
                          )}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-indigo-600" />
                      </>
                    );

                    return hasServiceId ? (
                      <motion.div
                        key={`${service.id}-${service.name}-${index}`}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Link
                          to={`/service/${service.id}`}
                          state={{ serviceName: service.name }}
                          className="group flex h-full items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/70 p-4 shadow-sm transition-shadow hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          {content}
                        </Link>
                      </motion.div>
                    ) : (
                      <div
                        key={`${service.name}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No services have been added to this profile yet.
                </p>
              )}
            </section>

            <section
              id="business-details"
              className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900">
                  Business details
                </h2>
              </div>
              {registrationRows.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {registrationRows.map(({ label, value }) => (
                    <InfoRow key={label} label={label} value={value} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Registration information has not been provided.
                </p>
              )}
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Contact and registration information is displayed only when
                supplied in the company profile.
              </p>
            </section>
          </div>

          {/* <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-black text-slate-900">
                Contact company
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Reach out directly using the contact details shared on this
                profile.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {location}
                    </p>
                  </div>
                </div>
                {phone && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Phone
                      </p>
                      <a
                        href={`tel:${phone}`}
                        className="mt-1 block truncate text-sm font-semibold text-slate-700 hover:text-indigo-600"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}
                {email && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="mt-1 block break-all text-sm font-semibold text-slate-700 hover:text-indigo-600"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {email && (
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(`Business enquiry for ${companyName}`)}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Send business enquiry <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <Link
                to="/company-list"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back to companies
              </Link>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
              <div className="flex items-center gap-2 text-emerald-800">
                <BadgeCheck className="h-5 w-5" />
                <h3 className="text-sm font-black">Business profile</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-emerald-900/70">
                Company and service information shown here is fetched from the
                Contracts India profile.
              </p>
            </div>
          </aside> */}
        </div>

        {/* <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Explore the network
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Other companies
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Discover more verified businesses listed on Contracts India.
              </p>
            </div>
            <Link
              to="/company-list"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              View all companies <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {companiesLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          ) : companiesError ? (
            <p
              className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
              role="alert"
            >
              Other companies could not be loaded. Please try again later.
            </p>
          ) : otherCompanies.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {otherCompanies.map((item, index) => {
                const otherId = item?.UserId;
                const name = item?.CompanyName || "Company";
                const servicesList = String(item?.ServiceNames || "")
                  .split(",")
                  .map((service) => service.trim())
                  .filter(Boolean)
                  .slice(0, 2);

                return (
                  <motion.div
                    key={otherId ?? `${name}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.2, delay: Math.min(index, 5) * 0.04 }}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-indigo-950/10"
                  >
                    <Link
                      to={otherId ? `/company/${otherId}` : "/company-list"}
                      aria-label={`View ${name} company profile`}
                      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                    >
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-100 to-blue-100">
                        <div className="flex h-full items-center justify-center text-4xl font-black text-indigo-300">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        {otherId && (
                          <img
                            src={`${API_ROOT}/UserDocumentStore/image?userId=${otherId}&documentCategoryId=7&documentSubCategoryId=10`}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="truncate text-base font-black text-slate-900 transition-colors group-hover:text-indigo-700">
                          {name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                          {item?.UserTypeName || "Verified company"}
                        </p>
                        {item?.StateName && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            {item.StateName}
                          </p>
                        )}
                        {servicesList.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {servicesList.map((service) => (
                              <span
                                key={service}
                                className="max-w-full truncate rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-700">
                          View company profile
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <Building2 className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                No other verified companies are available yet.
              </p>
            </div>
          )}
        </section> */}
      </div>
    </main>
  );
}
