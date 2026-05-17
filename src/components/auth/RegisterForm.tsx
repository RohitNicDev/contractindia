import { useEffect, useMemo, useState } from "react";
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
  Home,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import registrationConfig from "../../data/registrationConfig.json";
import { detectLocationFromCoordinates } from "../../services/geolocationService";
import {
  getLocationFromPincode,
  isValidPincode,
} from "../../services/pincodeService";
import { AuthCard } from "./AuthCard";
import { AuthFormField } from "./AuthFormField";
import { AuthFormSelect } from "./AuthFormSelect";
import { AuthFormTextarea } from "./AuthFormTextarea";
import { ChipMultiSelect } from "./ChipMultiSelect";
import { CaptchaChallenge } from "./CaptchaChallenge";
import { GradientButton } from "./GradientButton";

type UserType = "individual" | "commercial";

const createAlphabetCaptcha = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let captchaText = "";
  for (let i = 0; i < 5; i++) {
    captchaText += letters[Math.floor(Math.random() * letters.length)];
  }
  return {
    question: captchaText,
    answer: captchaText,
  };
};

type RegistrationFormValues = {
  userType: UserType;
  fullName: string;
  address: string;
  email: string;
  phone: string;
  alternatePhone: string;
  password: string;
  confirmPassword: string;

  // Commercial only
  businessName: string;
  gstNumber: string;
  companyType: string;
  state: string;
  city: string;
  pinCode: string;
  serviceGroup: string;
  subServices: string[];
  captcha: string;
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
      address: "",
      email: "",
      phone: "",
      alternatePhone: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      gstNumber: "",
      companyType: "",
      state: "",
      city: "",
      pinCode: "",
      serviceGroup: "",
      // subServices: [],
      captcha: "",
    },
  });

  const [captcha, setCaptcha] = useState(createAlphabetCaptcha);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);

  const refreshCaptcha = () => {
    setCaptcha(createAlphabetCaptcha());
    setValue("captcha", "", { shouldValidate: false });
  };

  const detectLocation = async () => {
    setDetectingLocation(true);
    try {
      const locationData = await detectLocationFromCoordinates();

      // Find matching state
      const matchedState = registrationConfig.states.find(
        (s) =>
          s.label.toLowerCase() === locationData.state.toLowerCase() ||
          s.value.toLowerCase() ===
          locationData.state.toLowerCase().replace(/\s+/g, "_"),
      );

      if (matchedState) {
        setValue("state", matchedState.value, { shouldValidate: true });

        // Find matching city
        const matchedCity = matchedState.cities.find(
          (c) => c.toLowerCase() === locationData.city.toLowerCase(),
        );
        if (matchedCity) {
          setValue("city", matchedCity, { shouldValidate: true });
        }
      }

      // Set pincode if valid
      if (/^\d{6}$/.test(locationData.pincode)) {
        setValue("pinCode", locationData.pincode, { shouldValidate: true });
      }

      // Set address
      if (locationData.address) {
        setValue("address", locationData.address, { shouldValidate: true });
      }

      toast.success(
        `Location detected: ${locationData.city}, ${locationData.state}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to detect location. Please enable location access.",
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  const handlePincodeChange = async (pincode: string) => {
    if (!isValidPincode(pincode)) {
      return; // Don't lookup until we have 6 digits
    }

    setFetchingPincode(true);
    try {
      const locationData = await getLocationFromPincode(pincode);
      console.log(locationData, "locationData");
      setValue("state", locationData.state, { shouldValidate: true });
      setValue("city", locationData.city, { shouldValidate: true });

      // Find matching state
    } catch (error) {
      // Show error toast for API/lookup failures
      toast.error(
        error instanceof Error ? error.message : "Failed to look up pincode",
      );
    } finally {
      setFetchingPincode(false);
    }
  };

  const userType = watch("userType");
  const isCommercial = userType === "commercial";
  const selectedCity = watch("city");
  const selectedState = watch("state");
  const selectedServiceGroup = watch("serviceGroup");
  const subServices = watch("subServices") ?? [];
  const pinCode = watch("pinCode");
  useEffect(() => {
    console.log(selectedState, "selectedState");
    console.log(selectedCity, "selectedCity");
  }, [selectedState, selectedCity]);

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

  // Auto-lookup state/city when pincode is entered
  useEffect(() => {
    if (isValidPincode(pinCode)) {
      handlePincodeChange(pinCode);
    }
  }, [pinCode]);
  useEffect(() => {
    detectLocation();
  }, [])
  // Reset commercial-only fields when switching to individual
  useEffect(() => {

    if (!isCommercial) {
      setValue("businessName", "");
      setValue("gstNumber", "");
    }
  }, [isCommercial, setValue]);

  const onSubmit = (values: RegistrationFormValues) => {
    localStorage.setItem("registration_form_v1", JSON.stringify(values));
    toast.success("Registration saved. Verify your email and mobile.");
    navigate("/otp", {
      state: {
        email: values.email,
        phone: values.phone,
        userType: values.userType,
      },
    });
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
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${!isCommercial
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-400"
                  }`}
              >
                <UserCircle className="h-4 w-4" />
              </span>
              <span>
                <span className="block leading-tight">Individual</span>
                <span className="block text-[10px] font-normal opacity-70">
                  Personal use
                </span>
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
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isCommercial
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-400"
                  }`}
              >
                <BadgeCheck className="h-4 w-4" />
              </span>
              <span>
                <span className="block leading-tight">Commercial</span>
                <span className="block text-[10px] font-normal opacity-70">
                  Business / GST
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* ── Scrollable fields ── */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible [scrollbar-width:thin]">
          <div className="relative grid grid-cols-2 gap-x-3 gap-y-2 pb-1">
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
                        value:
                          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                        message: "Invalid GST format",
                      },
                    })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* ── Common fields (both types) ── */}
            <AuthFormField
              compact
              label={isCommercial ? "Contact Person Name" : "Full name"}
              placeholder={isCommercial ? "Contact Person Name" : "Full name"}
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
            {/* {isCommercial && (
              <AuthFormField
                compact
                label="Alternate Phone"
                type="tel"
                placeholder="Phone number"
                icon={Phone}
                error={errors.alternatePhone?.message}
                {...register("alternatePhone", {
                  // required: "Required",
                  pattern: {
                    value: /^[0-9+\-\s]{10,16}$/,
                    message: "Invalid phone",
                  },
                })}
              />
            )} */}
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
            <div className="col-span-2 flex gap-2">
              <AuthFormSelect
                compact
                label="State"
                icon={MapPin}
                error={errors.state?.message}
                {...register("state", { required: "Required" })}
              >
                <option value="">State…</option>
                {registrationConfig.states.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </AuthFormSelect>
              {/* <button
                type="button"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="mt-auto flex h-auto min-h-[2.35rem] items-center gap-2 rounded-lg border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition-all hover:bg-indigo-100 disabled:opacity-50"
                title="Detect location from GPS"
              >
                <Zap className="h-4 w-4" />
                {detectingLocation ? "Detecting…" : "Auto-detect"}
              </button> */}
            </div>
            <AuthFormSelect
              compact
              label="City"
              icon={MapPin}
              disabled={!selectedState}
              error={errors.city?.message}
              {...register("city", { required: "Required" })}
            >
              <option value="">
                {selectedState ? "City…" : "Select state first"}
              </option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </AuthFormSelect>
            <div className="col-span-2 flex gap-2">
              <AuthFormField
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
              />
              {fetchingPincode && (
                <div className="mt-auto flex h-auto min-h-[2.35rem] items-center gap-2 rounded-lg border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
                  Fetching…
                </div>
              )}
            </div>{" "}

            {isCommercial && (
              <AuthFormSelect
                compact
                label="Service category"
                icon={Briefcase}
                error={errors.serviceGroup?.message}
                {...register("serviceGroup", { required: "Required" })}
              >
                <option value="">Category…</option>
                {registrationConfig.serviceGroups.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </AuthFormSelect>
            )}

            <div className="col-span-2">
              <AuthFormTextarea
                compact
                label="Address"
                placeholder="Enter your full address"
                icon={Home}
                error={errors.address?.message}
                {...register("address", { required: "Required" })}
              />
            </div>
            {/* <div className="col-span-2">
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
            </div> */}
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
            <div className="col-span-2">
              <AuthFormField
                compact
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                icon={Lock}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Required",
                  minLength: { value: 6, message: "Min 6 chars" },
                })}
              />
            </div>
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
