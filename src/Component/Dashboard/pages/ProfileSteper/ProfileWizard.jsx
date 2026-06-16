import { message, Progress, Tooltip, Switch } from "antd";
import {
  Building2,
  User,
  FileText,
  CreditCard,
  Upload,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  AlertCircle,
  Info,
  ArrowRight,
  Clock,
  X,
} from "lucide-react";
import {
  useProfileWizardStore,
  calculateProgress,
  getProfileSuggestions,
} from "../../../../store/profileWizardStore";
import { useNavigate } from "react-router-dom";
import ServiceListing from "../ServiceListing";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import {
  Step1CompanyType,
  Step2BasicInfo,
  Step3Registration,
  Step4Documents,
  Step5ServiceListing,
  Step6Banking,
} from "./stepComponents";
import { UserRegistrationUserIdGet } from "../../../../services/api";
import { useUserStore } from "../../../../store/store";
import { useQuery } from "@tanstack/react-query";

// Steps definition
const STEPS = [
  {
    id: 1,
    label: "Company Type",
    icon: Building2,
    desc: "Organisation Structure",
  },
  { id: 2, label: "Basic Info", icon: User, desc: "Company Details" },
  { id: 3, label: "Registration", icon: FileText, desc: "Compliance & TAX" },
  { id: 4, label: "Documents", icon: Upload, desc: "Verification Files" },
  {
    id: 5,
    label: "Service Listing",
    icon: Briefcase,
    desc: "Service Listing",
  },
  {
    id: 6,
    label: "Banking Details",
    icon: CreditCard,
    desc: "Fintech Settlement",
  },
];
const UserRegistrationUserIdGetApi = async (userId) => {
  const response = await UserRegistrationUserIdGet(userId);
  console.log(response, "response");
  return response?.data ?? [];
};
export default function ProfileWizard() {
  const store = useProfileWizardStore();
  const progress = calculateProgress(store);
  const suggestions = getProfileSuggestions(store);
  const isDark = true; // Premium dark SaaS mode is default, we'll style with rich dark colors
  const navigation = useNavigate();
  const [otpModal, setOtpModal] = useState({
    isOpen: false,
    type: "email",
    val: "",
  });
  const [otpVal, setOtpVal] = useState("");

  const nextStep = () => {
    if (store.currentStep < 6) {
      store.setCurrentStep(store.currentStep + 1);
    }
  };

  const prevStep = () => {
    if (store.currentStep > 1) {
      store.setCurrentStep(store.currentStep - 1);
    }
  };

  const handleSaveServiceStep = (services) => {
    store.updateServiceOrder(services);
    nextStep();
  };

  const handleSkip = () => {
    navigation("/commercial/dashboard");
    if (progress >= 45) {
      store.setIsSkipped(true);
      message.success("You have skipped the profile wizard. Navigations unlocked!");
    } else {
      message.error("Please complete at least 80% of your profile before skipping.");
    }
  };
  const getloginResponce = useUserStore((state) => state?.loginResponce);

  const { data: UserData = [], isLoading: UserDataLoading } = useQuery({
    queryKey: ["UserData", getloginResponce?.userId],
    queryFn: () => UserRegistrationUserIdGetApi(getloginResponce?.userId),
    enabled: !!getloginResponce?.userId,
    retry: false,
  });

  React.useEffect(() => {
    if (!UserData || (Array.isArray(UserData) && UserData.length === 0)) return;
    const userObj = Array.isArray(UserData) ? UserData[0] : UserData;
    if (userObj) {
      if (!store.basicInfo.companyName && !store.basicInfo.contactPerson) {
        store.setBasicInfo({
          companyName: userObj.CompanyName || "",
          contactPerson: userObj.Name || "",
          email: userObj.EmailId || "",
          mobile: userObj.MobileNo || "",
          address: userObj.Address || "",
        });
      }
    }
  }, [UserData, store]);
  const triggerOtpSend = (type, val) => {
    if (!val) {
      message.error(`Please enter a valid ${type} before sending OTP.`);
      return;
    }
    setOtpModal({ isOpen: true, type, val });
    message.info(`6-digit OTP code sent to ${val}`);
  };

  // const verifyOtp = () => {
  //   if (otpVal === "123456" || otpVal.length === 6) {
  //     if (otpModal.type === "email") {
  //       store.setBasicInfo({ emailVerified: true });
  //     } else {
  //       store.setBasicInfo({ mobileVerified: true });
  //     }
  //     setOtpModal({ isOpen: false, type: "email", val: "" });
  //     setOtpVal("");
  //     message.success(
  //       `${otpModal.type === "email" ? "Email" : "Mobile"} verified successfully!`,
  //     );
  //   } else {
  //     message.error("Invalid OTP code. Please enter 123456 for testing.");
  //   }
  // };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans select-none relative overflow-hidden">
      {/* Background neon blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] animate-pulse duration-5000" />
        <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Progress bar at the very top */}
      <div className="h-1.5 w-full bg-slate-50/40 shrink-0 relative z-20">
        <motion.div
          className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Grid Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        <main className="flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] flex flex-col gap-2 lg:max-w-[75%]">
          {/* Circular progress & Stepper Header Row */}
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)] p-2 rounded-2xl">
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" className="stroke-slate-100" strokeWidth="5" fill="transparent" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-blue-500"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100),
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-slate-800">
                  {progress}%
                </span>
                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">
                  Done
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-lg font-extrabold text-slate-800">
                  Welcome,{" "}
                  {store.basicInfo.contactPerson || "Commercial Partner"}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${progress < 40
                      ? "text-red-600 bg-red-50 border-red-200"
                      : progress < 80
                        ? "text-orange-600 bg-orange-50 border-orange-200"
                        : "text-cyan-700 bg-cyan-50 border-cyan-200"
                    }`}
                >
                  {progress < 40
                    ? "Weak"
                    : progress < 80
                      ? "Moderate"
                      : "Strong & Verified"}
                </span>
              </div>
            </div>

            {progress >= 45 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-[0_4px_12px_rgba(16,185,129,0.3)] shrink-0 flex items-center justify-center gap-1.5 hover:from-emerald-400 hover:to-teal-400 transition-all border border-emerald-300/20"
              >
                Skip Steps <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>

          {/* Stepper Wizard Bar */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)] p-4 rounded-3xl overflow-x-auto [scrollbar-width:none]">
            <div className="flex items-center justify-between min-w-[650px] px-2">
              {STEPS.map((step, idx) => {
                const isCompleted =
                  progress >=
                  (idx === 0
                    ? 15
                    : idx === 1
                      ? 30
                      : idx === 2
                        ? 45
                        : idx === 3
                          ? 60
                          : idx === 4
                            ? 80
                            : 100);
                const isActive = store.currentStep === step.id;
                const Icon = step.icon;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => store.setCurrentStep(step.id)}
                      className={`flex flex-col items-center gap-2 group focus:outline-none transition-all relative ${isActive ? "scale-105" : ""
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isActive
                            ? "bg-linear-to-br from-blue-500 to-purple-500 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                            : isCompleted
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-300"
                          }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-bold tracking-tight transition-all ${isActive
                            ? "text-blue-600"
                            : "text-slate-500 group-hover:text-slate-700"
                          }`}
                      >
                        {step.label}
                      </span>
                    </button>
                    {idx < STEPS?.length - 1 && (
                      <div className="flex-1 h-[2px] mx-4 relative bg-slate-100">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-purple-500"
                          initial={{ width: "0%" }}
                          animate={{ width: isCompleted ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Stepper Card Content Container */}
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={store.currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)] rounded-3xl p-6 relative overflow-hidden"
              >
                {/* Step Title Header */}
                <div className="mb-6 flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 font-bold">
                      Step {store.currentStep} of 6
                    </h3>
                    <h2 className="text-xl font-black text-slate-800 mt-1">
                      {STEPS[store.currentStep - 1].desc}
                    </h2>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1 flex items-center gap-1.5 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-600">Verified Step</span>
                  </div>
                </div>

                {/* Step 1 */}
                {store.currentStep === 1 && (
                  <Step1CompanyType store={store} nextStep={nextStep} />
                )}

                {/* Step 2 */}
                {store.currentStep === 2 && (
                  <Step2BasicInfo
                    store={store}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    triggerOtpSend={triggerOtpSend}
                  />
                )}

                {/* Step 3 */}
                {store.currentStep === 3 && (
                  <Step3Registration store={store} nextStep={nextStep} prevStep={prevStep} />
                )}

                {/* Step 4 */}
                {store.currentStep === 4 && (
                  <Step4Documents store={store} nextStep={nextStep} prevStep={prevStep} />
                )}

                {/* Step 5 */}
                {store.currentStep === 5 && (
                  <div className="space-y-6">
                    <ServiceListing onSave={handleSaveServiceStep} onBack={prevStep} dashboardMode={true} />
                    {/* <Step5ServiceListing/> */}
                  </div>
                )}

                {/* Step 6 */}
                {store.currentStep === 6 && (
                  <Step6Banking store={store} nextStep={nextStep} prevStep={prevStep} navigation={navigation} progress={progress} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Side Summary Panel */}
        <aside className="w-full lg:w-[25%] border-t lg:border-t-0 lg:border-l border-slate-200 bg-white/70 backdrop-blur-xl p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Onboarding Health</h3>
            <h2 className="text-lg font-black text-slate-800 mt-1">Profile Summary</h2>
          </div>

          {/* Strength progress indicator */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col gap-2 shadow-inner">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-500">Completion</span>
              <span className="font-black text-slate-800">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300/30">
              <div
                className="bg-linear-to-r from-blue-500 via-purple-500 to-cyan-400 h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              {progress >= 45 ? (
                <span className="text-emerald-600 font-bold">✓ Profile qualified for dashboard release.</span>
              ) : (
                <span>Needs {45 - progress}% more progress to unlock sidebar.</span>
              )}
            </div>
          </div>

          {/* Completed steps checklist */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Verification Steps Checklist</h4>
            <div className="space-y-2">
              {STEPS.map((step, idx) => {
                const stepProg =
                  idx === 0
                    ? 15
                    : idx === 1
                      ? 30
                      : idx === 2
                        ? 45
                        : idx === 3
                          ? 60
                          : idx === 4
                            ? 80
                            : 100;
                const isCompleted = progress >= stepProg;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${isCompleted
                        ? "bg-blue-50 border-blue-100 text-slate-700"
                        : "bg-slate-50/40 border-slate-100 text-slate-400"
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${isCompleted
                          ? "bg-blue-100 border-blue-300 text-blue-600"
                          : "border-slate-200 bg-white"
                        }`}
                    >
                      {isCompleted && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs font-bold truncate">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics summary */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Selected Entity:</span>
              <span className="font-bold text-slate-800 capitalize">{store.companyType || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Marketplace Services:</span>
              <span className="font-bold text-cyan-600">{store.services.length} Active</span>
            </div>
          </div>

          {/* Suggested improvements */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Suggested Improvements</h4>
              <ul className="space-y-2">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-[10px] text-yellow-800 leading-snug"
                  >
                    <Info className="w-3.5 h-3.5 shrink-0 text-yellow-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* OTP verification Modal Overlay */}
      {/* {otpModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-purple-600">Security Check</h4>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                  Verify{" "}
                  {otpModal.type === "email" ? "Email Address" : "Mobile Phone"}
                </h3>
              </div>
              <button
                onClick={() =>
                  setOtpModal({ isOpen: false, type: "email", val: "" })
                }
                className="text-slate-400 hover:bg-slate-100 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              We have sent a security code to{" "}
              <strong className="text-slate-700">{otpModal.val}</strong>. Enter
              code below (Enter{" "}
              <strong className="text-slate-800 font-bold">123456</strong> to
              verify).
            </p>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP code"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest text-slate-800 focus:outline-none focus:border-blue-400"
              value={otpVal}
              onChange={(e) => setOtpVal(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="w-full py-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
            >
              Verify & Complete
            </button>
          </motion.div>
        </div>
      )} */}
    </div>
  );
}
