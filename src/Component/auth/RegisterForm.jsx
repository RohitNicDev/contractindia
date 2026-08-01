import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Building2,
  Phone,
  Briefcase,
  MapPin,
  Hash,
  ArrowRight,
  UserCircle,
  BadgeCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import registrationConfig from "../../data/registrationConfig.json";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import { AuthFormSelect } from "./AuthFormSelect";
import { CaptchaChallenge } from "./CaptchaChallenge";
import { GradientButton } from "./GradientButton";
import {
  getState,
  getCities,
  saveUserRegistration,
  ServiceRootGet,
  userType,
} from "../../services/api";

// ─── Captcha helper ───────────────────────────────────────────────────────────

const createAlphabetCaptcha = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let captchaText = "";
  for (let i = 0; i < 5; i++) {
    captchaText += letters[Math.floor(Math.random() * letters.length)];
  }
  return { question: captchaText, answer: captchaText };
};

// ─── API functions ────────────────────────────────────────────────────────────

const registerApi = async (payload) => {
  const response = await saveUserRegistration(payload);
  return response;
};

const getStateApi = async () => {
  const response = await getState();
  console.log(response, "response");

  // response.data.table = [{ value, name, label, nameHindi, type }]
  return response ?? [];
};
const getRootServiceApi = async () => {
  const response = await ServiceRootGet();
  console.log(response, "response");
  return response ?? [];
};

const getCitiesApi = async (stateId) => {
  const response = await getCities(stateId);
  console.log(response, "response");
  return response ?? [];
};
const getuserTypeApi = async () => {
  const response = await userType();
  console.log(response, "response");
  return response ?? [];
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userType: 1,
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      state: "", // stores stateId (number)
      stateName: "", // stores state label (string) — hidden
      city: "", // stores city value/id
      cityName: "", // stores city label — hidden
      // pinCode: "",
      serviceGroup: "",
      captcha: "",
    },
  });

  const [captcha, setCaptcha] = useState(createAlphabetCaptcha);
  const selectedUserType = watch("userType");
  const isCommercial = Number(selectedUserType) === 2;
  const refreshCaptcha = () => {
    setCaptcha(createAlphabetCaptcha());
    setValue("captcha", "", { shouldValidate: false });
  };

  const userType = watch("userType");
  // const isCommercial = userType === "commercial";
  const selectedStateId = watch("state"); // numeric id from API
  const selectedServiceGroup = watch("serviceGroup");
  const email = watch("email");
  const phone = watch("phone");

  // ── 1. Fetch states on mount ───────────────────────────────────────────────
  const { data: stateList = [], isLoading: statesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: getStateApi,
    staleTime: Infinity, // states rarely change
  });
  const { data: rootServiceList = [], isLoading: rootServicesLoading } =
    useQuery({
      queryKey: ["RootServiceApi"],
      queryFn: getRootServiceApi,
      retry: false,
      staleTime: Infinity, // states rarely change
    });
  const { data: userTypeList = [], isLoading: userTypeLoading } = useQuery({
    queryKey: ["userType"],
    queryFn: getuserTypeApi,
    staleTime: Infinity,
  });
  // ── 2. Fetch cities when state changes (mutation so we can call on demand) ─
  const {
    mutate: fetchCities,
    data: cityList = [],
    isPending: citiesLoading,
    reset: resetCities,
  } = useMutation({
    mutationFn: getCitiesApi,
    onError: () => {
      toast.error("Failed to load cities. Please try again.");
    },
  });

  // Trigger city fetch whenever selectedStateId changes
  useEffect(() => {
    // Reset city selection and list when state changes
    setValue("city", "");
    setValue("cityName", "");
    resetCities();

    if (selectedStateId) {
      fetchCities(Number(selectedStateId));
    }
  }, [selectedStateId, fetchCities, resetCities, setValue]);

  // Keep stateName in sync with the selected state label
  useEffect(() => {
    const matched = stateList.find(
      (s) => String(s.value) === String(selectedStateId),
    );
    setValue("stateName", matched?.label ?? "");
  }, [selectedStateId, stateList, setValue]);

  // ── 3. Register mutation ───────────────────────────────────────────────────
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: (response) => {
      console.log(response, "register response");
      if (!response?.status) {
        toast.error(response?.message || "Registration failed");
        refreshCaptcha();
        return;
      }
      toast.success(response?.remark || "Registration successful", {
        duration: Infinity,
      });
      navigate("/otp", {
        state: {
          singleVerification: false,
          email,
          phone,
          userType,
          selectedServiceGroup,
          guId: response?.value || null, // Pass the entire data object for OTP screen to use (if needed)
        },
      });
    },
    onError: (error) => {
      toast.error(error?.message || "Unable to register. Please try again.");
      refreshCaptcha();
    },
  });

  // ── 4. Service sub-options ─────────────────────────────────────────────────
  const subServiceOptions = useMemo(() => {
    const g = registrationConfig.serviceGroups.find(
      (x) => x.value === selectedServiceGroup,
    );
    return g?.subServices ?? [];
  }, [selectedServiceGroup]);

  // ── 5. Reset commercial fields ─────────────────────────────────────────────
  useEffect(() => {
    if (!isCommercial) {
      setValue("businessName", "");
      setValue("serviceGroup", "");
    }
  }, [isCommercial, setValue]);

  // ── 6. Submit ──────────────────────────────────────────────────────────────
  const onSubmit = (values) => {
    // Find the numeric stateId
    const stateObj = stateList.find(
      (s) => String(s.value) === String(values.state),
    );
    console.log(values, "123");
    console.log(rootServiceList, "123");

    registerUser({
      name: values.fullName,
      emailId: values.email,
      mobileNo: values.phone,
      stateId: stateObj?.value ?? 0,
      stateName: stateObj?.label ?? values.state,
      cityName: values.cityName,
      // pinCode: values.pinCode,
      userType: Number(values.userType),
      companyName: isCommercial ? values.businessName || "" : "",
      serviceId: isCommercial ? values.serviceGroup || 0 : 0,
      serviceName: isCommercial
        ? rootServiceList?.find((elm) => elm?.value == values?.serviceGroup)
          ?.label || ""
        : "",
    });
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <AuthCard className="flex h-full min-h-0 max-h-full w-full flex-col overflow-hidden lg:p-2">
      {/* Header */}
      <header className="mb-2 shrink-0 border-b border-[var(--auth-section-border)] pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--auth-kicker)]">
          Create account
        </p>
        <h2 className="text-lg font-black tracking-tight text-[var(--auth-heading-display)] lg:text-xl">
          Join Contracts India
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
            {userTypeList?.map((type) => {
              const active = Number(selectedUserType) === Number(type.value);

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setValue("userType", type.value, {
                      shouldValidate: true,
                    })
                  }
                  className={`
          flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5
          text-left text-xs font-semibold transition-all duration-200
          ${active
                      ? "border-[var(--auth-input-border-focus)] bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-[var(--auth-input-border)] bg-white/60 text-[var(--auth-text-body)] hover:border-indigo-200 hover:bg-white"
                    }
        `}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${active
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {Number(type.value) === 1 ? (
                      <UserCircle className="h-4 w-4" />
                    ) : (
                      <BadgeCheck className="h-4 w-4" />
                    )}
                  </span>

                  <span>
                    <span className="block leading-tight">{type.label}</span>
                    <span className="block text-[10px] font-normal opacity-70">
                      {Number(type.value) === 1 ? "Personal use" : "Business"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <input type="hidden" {...register("userType")} />
        <input type="hidden" {...register("stateName")} />
        <input type="hidden" {...register("cityName")} />

        {/* ── Scrollable fields ── */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible [scrollbar-width:thin]">
          <div className="relative grid grid-cols-2 gap-x-3 gap-y-2 pb-1">
            {/* ── Commercial fields ── */}
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

                  <AuthFormSelect
                    compact
                    label="Service category"
                    icon={Briefcase}
                    error={errors.serviceGroup?.message}
                    {...register("serviceGroup", {
                      required: isCommercial ? "Required" : false,
                    })}
                  >
                    <option value="">Category…</option>
                    {rootServiceList?.map((elm) => (
                      <option key={elm?.value} value={elm.value}>
                        {elm.label}
                      </option>
                    ))}
                  </AuthFormSelect>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Common fields ── */}
            <AuthFormField
              compact
              label={isCommercial ? "Contact person name" : "Full name"}
              placeholder={isCommercial ? "Contact person name" : "Full name"}
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
                pattern: {
                  value: /^[0-9+\-\s]{10,16}$/,
                  message: "Invalid phone",
                },
              })}
            />

            {/* ── State (API-driven) ── */}
            <AuthFormSelect
              compact
              label="State"
              icon={MapPin}
              disabled={statesLoading}
              error={errors.state?.message}
              {...register("state", { required: "Required" })}
            >
              <option value="">
                {statesLoading ? "Loading states…" : "State…"}
              </option>
              {stateList.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </AuthFormSelect>

            {/* ── City (API-driven via mutation) ── */}
            <AuthFormSelect
              compact
              label="City"
              icon={MapPin}
              disabled={!selectedStateId || citiesLoading}
              error={errors.city?.message}
              {...register("city", {
                required: "Required",
                onChange: (e) => {
                  // Keep cityName in sync
                  const matched = cityList.find(
                    (c) => String(c.value ?? c) === String(e.target.value),
                  );
                  setValue(
                    "cityName",
                    matched?.label ?? matched?.name ?? e.target.value,
                  );
                },
              })}
            >
              <option value="">
                {citiesLoading
                  ? "Loading cities…"
                  : !selectedStateId
                    ? "Select state first"
                    : "City…"}
              </option>
              {cityList?.map((c) => {
                // Support both flat string arrays and object arrays
                const val = c?.value ?? c;
                const label = c?.label ?? c?.name ?? c;
                return (
                  <option key={val} value={val}>
                    {label}
                  </option>
                );
              })}
            </AuthFormSelect>

            {/* <AuthFormField
              compact
              label="Pin code"
              placeholder="6-digit pin code"
              icon={Hash}
              error={errors.pinCode?.message}
              {...register("pinCode", {
                required: "Required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Invalid pin code (must be 6 digits)",
                },
              })}
            /> */}

            {/* ── Captcha ── */}
            <div className="col-span-2">
              <CaptchaChallenge
                question={captcha.question}
                onRefresh={refreshCaptcha}
                error={errors.captcha?.message}
                placeholder="Type the answer"
                {...register("captcha", {
                  required: "Required",
                  validate: (value) =>
                    value.trim() === captcha.answer ||
                    "Incorrect captcha answer",
                })}
              />
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="shrink-0 space-y-2 border-t border-[var(--auth-section-border)] pt-2">
          <GradientButton
            type="submit"
            disabled={isPending || statesLoading}
            className="py-2.5 text-sm"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            {isPending ? "Creating account…" : "Create account"}
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
