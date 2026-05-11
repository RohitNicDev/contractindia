import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  Briefcase,
  MapPin,
  Hash,
  ArrowRight,
  UserCircle,
  BadgeCheck,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import registrationConfig from "../../data/registrationConfig.json";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import { AuthFormSelect } from "./AuthFormSelect";
import { ChipMultiSelect } from "./ChipMultiSelect";
import { GradientButton } from "./GradientButton";

type UserType = "individual" | "commercial";

type RegistrationFormValues = {
  userType: UserType;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  // Commercial only
  businessName: string;
  gstNumber: string;
  companyType: string;
  state: string;
  city: string;
  pinCode: string;
  serviceGroup: string;
  subServices: string[];
};

export function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      userType: "individual",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      businessName: "",
      gstNumber: "",
      companyType: "",
      state: "",
      city: "",
      pinCode: "",
      serviceGroup: "",
      subServices: [],
    },
  });

  const userType = watch("userType");
  const isCommercial = userType === "commercial";

  const selectedState = watch("state");
  const selectedServiceGroup = watch("serviceGroup");
  const subServices = watch("subServices") ?? [];

  const cityOptions = useMemo(() => {
    const s = registrationConfig.states.find((x) => x.value === selectedState);
    return s?.cities ?? [];
  }, [selectedState]);

  const subServiceOptions = useMemo(() => {
    const g = registrationConfig.serviceGroups.find(
      (x) => x.value === selectedServiceGroup,
    );
    return g?.subServices ?? [];
  }, [selectedServiceGroup]);

  useEffect(() => {
    setValue("subServices", []);
  }, [selectedServiceGroup, setValue]);

  // Reset commercial-only fields when switching to individual
  useEffect(() => {
    if (!isCommercial) {
      setValue("businessName", "");
      setValue("gstNumber", "");
    }
  }, [isCommercial, setValue]);

  const onSubmit = (values: RegistrationFormValues) => {
    localStorage.setItem("registration_form_v1", JSON.stringify(values));
    toast.success("Registration saved. Verify your email with OTP.");
    navigate("/otp");
  };

  return (
    <AuthCard className="flex h-full min-h-0 max-h-full w-full flex-col overflow-hidden lg:p-2">
      {/* Header */}
      <header className="mb-2 shrink-0 border-b border-[var(--auth-section-border)] pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--auth-kicker)]">
          Create account
        </p>
        <h2 className="text-lg font-black tracking-tight text-[var(--auth-heading-display)] lg:text-xl">
          Join ContractsIndia
        </h2>
      </header>

      <form
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* ── User Type Toggle ── */}
        <div className="shrink-0">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--auth-label)]">
            I am registering as
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* Individual */}
            <button
              type="button"
              onClick={() => setValue("userType", "individual")}
              className={`
                flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5
                text-left text-xs font-semibold transition-all duration-200
                ${!isCommercial
                  ? "border-[var(--auth-input-border-focus)] bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-[var(--auth-input-border)] bg-white/60 text-[var(--auth-text-body)] hover:border-indigo-200 hover:bg-white"
                }
              `}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  !isCommercial ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                <UserCircle className="h-4 w-4" />
              </span>
              <span>
                <span className="block leading-tight">Individual</span>
                <span className="block text-[10px] font-normal opacity-70">Personal use</span>
              </span>
            </button>

            {/* Commercial */}
            <button
              type="button"
              onClick={() => setValue("userType", "commercial")}
              className={`
                flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5
                text-left text-xs font-semibold transition-all duration-200
                ${isCommercial
                  ? "border-[var(--auth-input-border-focus)] bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-[var(--auth-input-border)] bg-white/60 text-[var(--auth-text-body)] hover:border-indigo-200 hover:bg-white"
                }
              `}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isCommercial ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                <BadgeCheck className="h-4 w-4" />
              </span>
              <span>
                <span className="block leading-tight">Commercial</span>
                <span className="block text-[10px] font-normal opacity-70">Business / GST</span>
              </span>
            </button>
          </div>
        </div>

        {/* ── Scrollable fields ── */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible [scrollbar-width:thin]">
          <div className="relative grid grid-cols-2 gap-x-3 gap-y-2 pb-1">

            {/* ── Common fields (both types) ── */}
            <AuthFormField
              compact
              label="Full name"
              placeholder="Full name"
              icon={User}
              error={errors.fullName?.message}
              {...register("fullName", { required: "Required" })}
            />
            <AuthFormField
              compact
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              icon={Mail}
              error={errors.email?.message}
              {...register("email", {
                required: "Required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
            />
            <AuthFormField
              compact
              label="Phone"
              type="tel"
              placeholder="Phone number"
              icon={Phone}
              error={errors.phone?.message}
              {...register("phone", {
                required: "Required",
                pattern: { value: /^[0-9+\-\s]{10,16}$/, message: "Invalid phone" },
              })}
            />
            {/* <AuthFormSelect
              compact
              label="Company type"
              icon={Briefcase}
              error={errors.companyType?.message}
              {...register("companyType", { required: "Required" })}
            >
              <option value="">Type…</option>
              {registrationConfig.companyTypes.map((x) => (
                <option key={x.value} value={x.value}>{x.label}</option>
              ))}
            </AuthFormSelect> */}
            <AuthFormSelect
              compact
              label="State"
              icon={MapPin}
              error={errors.state?.message}
              {...register("state", { required: "Required" })}
            >
              <option value="">State…</option>
              {registrationConfig.states.map((x) => (
                <option key={x.value} value={x.value}>{x.label}</option>
              ))}
            </AuthFormSelect>
            <AuthFormSelect
              compact
              label="City"
              icon={MapPin}
              disabled={!selectedState}
              error={errors.city?.message}
              {...register("city", { required: "Required" })}
            >
              <option value="">{selectedState ? "City…" : "Select state first"}</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </AuthFormSelect>
            <AuthFormField
              compact
              label="Pin code"
              placeholder="6-digit pin code"
              icon={Hash}
              error={errors.pinCode?.message}
              {...register("pinCode", {
                required: "Required",
                pattern: { value: /^[1-9][0-9]{5}$/, message: "Invalid pin code" },
              })}
            />
            <AuthFormSelect
              compact
              label="Service category"
              icon={Briefcase}
              error={errors.serviceGroup?.message}
              {...register("serviceGroup", { required: "Required" })}
            >
              <option value="">Category…</option>
              {registrationConfig.serviceGroups.map((x) => (
                <option key={x.value} value={x.value}>{x.label}</option>
              ))}
            </AuthFormSelect>
            <div className="col-span-2">
              <input
                type="hidden"
                {...register("subServices", {
                  validate: (v) => (v && v.length > 0) || "Pick at least one",
                })}
              />
              <ChipMultiSelect
                compact
                options={subServiceOptions}
                value={subServices}
                onChange={(next) =>
                  setValue("subServices", next, { shouldValidate: true })
                }
                error={
                  typeof errors.subServices?.message === "string"
                    ? errors.subServices.message
                    : undefined
                }
              />
            </div>
            <div className="col-span-2">
              <AuthFormField
                compact
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                icon={Lock}
                error={errors.password?.message}
                {...register("password", {
                  required: "Required",
                  minLength: { value: 6, message: "Min 6 chars" },
                })}
              />
            </div>

            {/* ── Commercial-only: Business name + GST only ── */}
            <AnimatePresence>
              {isCommercial && (
                <motion.div
                  key="commercial-fields"
                  className="col-span-2 grid grid-cols-2 gap-x-3 gap-y-2"
                  initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {/* Divider */}
                  <div className="col-span-2 flex items-center gap-2 pt-1">
                    <div className="h-px flex-1 bg-[var(--auth-section-border)]" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--auth-text-muted)]">
                      Business details
                    </span>
                    <div className="h-px flex-1 bg-[var(--auth-section-border)]" />
                  </div>

                  <AuthFormField
                    compact
                    label="Business name"
                    placeholder="Company / firm name"
                    icon={Building2}
                    error={errors.businessName?.message}
                    {...register("businessName", {
                      required: isCommercial ? "Required" : false,
                    })}
                  />
                  <AuthFormField
                    compact
                    label="GST number"
                    placeholder="22AAAAA0000A1Z5"
                    icon={FileText}
                    error={errors.gstNumber?.message}
                    {...register("gstNumber", {
                      required: isCommercial ? "Required" : false,
                      pattern: {
                        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                        message: "Invalid GST format",
                      },
                    })}
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ── Submit ── */}
        <div className="shrink-0 space-y-2 border-t border-[var(--auth-section-border)] pt-2">
          <GradientButton
            type="submit"
            className="py-2.5 text-sm"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Create account
          </GradientButton>
          <p className="text-center text-[11px] text-[var(--auth-text-body)]">
            Have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--auth-link)] hover:text-[var(--auth-link-hover)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
