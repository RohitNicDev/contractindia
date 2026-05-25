import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { message, Progress, Tooltip, Switch } from "antd";
import {
  Building2, User, FileText, CreditCard, Upload, Briefcase,
  ChevronRight, ChevronLeft, Check, Sparkles, AlertCircle, Info,
  Search, Plus, Trash2, ShieldCheck, Moon, Sun, ArrowRight,
  Clock, CheckCircle2, Lock, X, Globe, Phone, Mail, MapPin, Eye, Play
} from "lucide-react";
import { useProfileWizardStore, calculateProgress, getProfileSuggestions, ServiceItem, FileItem } from "../../store/profileWizardStore";
import { useNavigate } from "react-router-dom";

// Steps definition
const STEPS = [
  { id: 1, label: "Company Type", icon: Building2, desc: "Organisation Structure" },
  { id: 2, label: "Basic Info", icon: User, desc: "Company Details" },
  { id: 3, label: "Registration", icon: FileText, desc: "Compliance & TAX" },
  { id: 4, label: "Documents", icon: Upload, desc: "Verification Files" },
  { id: 5, label: "Service Listing", icon: Briefcase, desc: "Marketplace Setup" },
  { id: 6, label: "Banking Details", icon: CreditCard, desc: "Fintech Settlement" },
];

export default function ProfileWizard() {
  const store = useProfileWizardStore();
  const progress = calculateProgress(store);
  const { getValues } = useForm();
  const suggestions = getProfileSuggestions(store);
  const isDark = true; // Premium dark SaaS mode is default, we'll style with rich dark colors
  const navigation = useNavigate();
  const [otpModal, setOtpModal] = useState<{ isOpen: boolean; type: "email" | "mobile"; val: string }>({
    isOpen: false,
    type: "email",
    val: ""
  });
  const [otpVal, setOtpVal] = useState("");
  // const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressInput, setAddressInput] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Local state for service adding
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    tagsInput: "",
    status: "Active" as const
  });

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

  const handleSkip = () => {
    navigation("/commercial/dashboard");
    if (progress >= 45) {
      store.setIsSkipped(true);
      message.success("You have skipped the profile wizard. Navigations unlocked!");
    } else {
      message.error("Please complete at least 80% of your profile before skipping.");
    }
  };

  // Step 2 Form Hook
  const { register: registerStep2, handleSubmit: handleSubmitStep2, formState: { errors: errorsStep2 }, setValue: setValueStep2, watch: watchStep2 } = useForm({
    defaultValues: store.basicInfo
  });

  // Step 3 Form Hook
  const { register: registerStep3, control: controlStep3, handleSubmit: handleSubmitStep3, formState: { errors: errorsStep3 }, setValue: setValueStep3, watch: watchStep3 } = useForm({
    defaultValues: {
      gstNo: store.registrationDetails.gstNo,
      panNo: store.registrationDetails.panNo,
      cinNo: store.registrationDetails.cinNo,
      aadharNo: store.registrationDetails.aadharNo,
      pfNo: store.registrationDetails.pfNo,
      esiNo: store.registrationDetails.esiNo,
      msmeNo: store.registrationDetails.msmeNo,
      udyogAadhaarToggle: store.registrationDetails.udyogAadhaarToggle
    }
  });

  // Step 4 Form Hook
  const { register: registerStep4, handleSubmit: handleSubmitStep4, formState: { errors: errorsStep4 }, setValue: setValueStep4, watch: watchStep4 } = useForm({
    defaultValues: store.bankingDetails
  });

  // Address Autocomplete suggestion simulator
  // useEffect(() => {
  //   if (addressInput.length > 3) {
  //     setAddressSuggestions([
  //       `${addressInput}, Connaught Place, New Delhi, 110001`,
  //       `${addressInput}, Bandra Kurla Complex, Mumbai, Maharashtra, 400051`,
  //       `${addressInput}, Sector 62, Noida, Uttar Pradesh, 201301`,
  //       `${addressInput}, Whitefield, Bengaluru, Karnataka, 560066`
  //     ]);
  //   } else {
  //     setAddressSuggestions([]);
  //   }
  // }, [addressInput]);

  // Sync React Hook Form with Zustand on submit
  const onSaveStep2 = (data: typeof store.basicInfo) => {
    store.setBasicInfo(data);
    message.success("Basic Info saved successfully!");
    nextStep();
  };

  const onSaveStep3 = (data: any) => {
    store.setRegistrationDetails(data);
    message.success("Registration & Compliance details saved!");
    nextStep();
  };

  const onSaveStep4 = (data: typeof store.bankingDetails) => {
    store.setBankingDetails(data);
    message.success("Banking Details saved!");
    nextStep();
  };

  // Simulated OTP verification trigger
  const triggerOtpSend = (type: "email" | "mobile", val: string) => {
    if (!val) {
      message.error(`Please enter a valid ${type} before sending OTP.`);
      return;
    }
    setOtpModal({ isOpen: true, type, val });
    message.info(`6-digit OTP code sent to ${val}`);
  };

  const verifyOtp = () => {
    if (otpVal === "123456" || otpVal.length === 6) {
      if (otpModal.type === "email") {
        store.setBasicInfo({ emailVerified: true });
        setValueStep2("emailVerified", true);
      } else {
        store.setBasicInfo({ mobileVerified: true });
        setValueStep2("mobileVerified", true);
      }
      setOtpModal({ isOpen: false, type: "email", val: "" });
      setOtpVal("");
      message.success(`${otpModal.type === "email" ? "Email" : "Mobile"} verified successfully!`);
    } else {
      message.error("Invalid OTP code. Please enter 123456 for testing.");
    }
  };

  // Step 3 Document drag-and-drop
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      uploadStep3Files(files);
    }
  };

  const uploadStep3Files = (files: File[]) => {
    // Validate file sizes (< 5MB)
    const validFiles = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        message.error(`File ${f.name} exceeds 5MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Simulate progress upload
    const updatedFiles = [...store.registrationDetails.importExportCertFiles];
    validFiles.forEach(file => {
      const newFileObj: FileItem = { name: file.name, size: file.size, progress: 0 };
      updatedFiles.push(newFileObj);

      // Simulate progress bar increment
      let progressVal = 0;
      const interval = setInterval(() => {
        progressVal += 20;
        newFileObj.progress = progressVal;
        store.setRegistrationDetails({ importExportCertFiles: [...updatedFiles] });

        if (progressVal >= 100) {
          clearInterval(interval);
        }
      }, 300);
    });
  };

  // Bank name auto-detection from IFSC code
  const watchIfsc = watchStep4("ifscCode") || "";
  const getBankLogo = (ifsc: string) => {
    const code = ifsc.substring(0, 4).toUpperCase();
    if (code === "SBIN") return { name: "State Bank of India", color: "from-blue-600 to-sky-500", text: "SBI" };
    if (code === "HDFC") return { name: "HDFC Bank", color: "from-blue-900 to-indigo-700", text: "HDFC" };
    if (code === "ICIC") return { name: "ICICI Bank", color: "from-orange-600 to-amber-500", text: "ICICI" };
    if (code === "UTIB") return { name: "Axis Bank", color: "from-rose-900 to-pink-700", text: "AXIS" };
    if (code === "PUNB") return { name: "Punjab National Bank", color: "from-red-700 to-orange-600", text: "PNB" };
    return { name: "Commercial Bank", color: "from-slate-800 to-slate-700", text: "BANK" };
  };
  const detectedBank = getBankLogo(watchIfsc);

  // Step 5: Document Category upload
  const [selectedDocType, setSelectedDocType] = useState<Record<string, string>>({
    businessRegistration: "GST Certificate",
    identityAddress: "PAN Card",
    complianceCertificates: "Bank Certificate",
    otherDocuments: "Company Profile"
  });

  const handleDocCategoryDrop = (e: React.DragEvent, category: "businessRegistration" | "identityAddress" | "complianceCertificates" | "otherDocuments") => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      uploadCategoryFiles(files, category);
    }
  };

  const uploadCategoryFiles = (files: File[], category: "businessRegistration" | "identityAddress" | "complianceCertificates" | "otherDocuments") => {
    const type = selectedDocType[category];
    const existingSections = [...(store.documents[category] || [])];

    // Find or create section for this type
    let section = existingSections.find(s => s.type === type);
    if (!section) {
      section = { type, files: [] };
      existingSections.push(section);
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        message.error(`File ${file.name} exceeds 5MB size limit.`);
        return;
      }

      const fileObj: FileItem = { name: file.name, size: file.size, progress: 0 };
      section!.files.push(fileObj);

      let prog = 0;
      const interval = setInterval(() => {
        prog += 25;
        fileObj.progress = prog;
        store.setDocuments(category, [...existingSections]);
        if (prog >= 100) {
          clearInterval(interval);
        }
      }, 250);
    });
  };

  const removeCategoryFile = (category: "businessRegistration" | "identityAddress" | "complianceCertificates" | "otherDocuments", sectionIndex: number, fileIndex: number) => {
    const existingSections = [...(store.documents[category] || [])];
    const section = existingSections[sectionIndex];
    section.files = section.files.filter((_, idx) => idx !== fileIndex);

    // Remove section if empty
    const filteredSections = section.files.length === 0
      ? existingSections.filter((_, idx) => idx !== sectionIndex)
      : existingSections;

    store.setDocuments(category, filteredSections);
    message.success("Document removed successfully.");
  };

  // Step 6 Services setup
  const addCustomService = () => {
    if (!newService.name || !newService.category || !newService.price) {
      message.error("Please fill in Service Name, Category, and Pricing.");
      return;
    }
    const tags = newService.tagsInput
      ? newService.tagsInput.split(",").map(t => t.trim()).filter(t => t)
      : [];

    store.addService({
      name: newService.name,
      category: newService.category,
      price: newService.price,
      description: newService.description,
      tags,
      status: newService.status
    });

    setNewService({
      name: "",
      category: "",
      price: "",
      description: "",
      tagsInput: "",
      status: "Active"
    });
    message.success("Service added successfully!");
  };

  // Service list reordering (drag & drop)
  const [draggedServiceIndex, setDraggedServiceIndex] = useState<number | null>(null);

  const handleServiceDragStart = (idx: number) => {
    setDraggedServiceIndex(idx);
  };

  const handleServiceDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedServiceIndex === null || draggedServiceIndex === idx) return;

    const listCopy = [...store.services];
    const draggedItem = listCopy[draggedServiceIndex];
    listCopy.splice(draggedServiceIndex, 1);
    listCopy.splice(idx, 0, draggedItem);

    setDraggedServiceIndex(idx);
    store.updateServiceOrder(listCopy);
  };

  const handleServiceDragEnd = () => {
    setDraggedServiceIndex(null);
  };

  // Sub-items count for files uploaded
  const getUploadedFilesCount = () => {
    const docs = store.documents;
    return (
      (store.registrationDetails.importExportCertFiles?.length || 0) +
      docs.businessRegistration.reduce((a, b) => a + b.files.length, 0) +
      docs.identityAddress.reduce((a, b) => a + b.files.length, 0) +
      docs.complianceCertificates.reduce((a, b) => a + b.files.length, 0) +
      docs.otherDocuments.reduce((a, b) => a + b.files.length, 0)
    );
  };

  // Determine Profile Strength label and color
  const getProfileStrength = (p: number) => {
    if (p < 40) return { label: "Weak", color: "text-red-600 bg-red-50 border-red-200" };
    if (p < 80) return { label: "Moderate", color: "text-orange-600 bg-orange-50 border-orange-200" };
    return { label: "Strong & Verified", color: "text-cyan-700 bg-cyan-50 border-cyan-200" };
  };
  const strength = getProfileStrength(progress);

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

      {/* Top Header Section */}
      <header className="relative z-10 border-b border-white/5 bg-slate-50/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md" />
            <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 border border-white/10 flex items-center justify-center font-black text-white text-lg">
              CI
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">ContractsIndia™</span>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-slate-400 border border-white/10 font-mono">v1.4</span>
            </div>
            <h1 className="text-base font-extrabold  font-extrabold text-slate-800 tracking-tight ">Profile Onboarding Wizard</h1>
          </div>
        </div>

        {/* Dynamic header info */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-300 font-semibold">
              Est. time remaining: <strong className="text-purple-400">{Math.max(0, Math.ceil((45 - progress) / 8))} mins</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-slate-300 font-semibold">Auto-save: <span className="text-emerald-400 font-bold">Active</span></span>
          </div>
        </div>
      </header>

      {/* Grid Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:none] flex flex-col gap-6 lg:max-w-[75%]">

          {/* Circular progress & Stepper Header Row (Mobile-optimized) */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)] p-5 rounded-3xl">

            {/* Animated Circular Progress Ring */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="34" className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                <motion.circle
                  cx="40" cy="40" r="34"
                  className="stroke-blue-500"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-800">{progress}%</span>
                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Done</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-lg font-extrabold text-slate-800">Welcome, {store.basicInfo.contactPerson || "Commercial Partner"}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
              {/* <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Please complete your enterprise profile verification to publish your listings . Complete 45% to open all dashboard features.
              </p> */}
            </div>

            {progress >= 45 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-[0_4px_12px_rgba(16,185,129,0.3)] shrink-0 flex items-center justify-center gap-1.5 hover:from-emerald-400 hover:to-teal-400 transition-all border border-emerald-300/20"
              >
                Skip  Steps <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>

          {/* Stepper Wizard Bar */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_2px_20px_rgba(99,102,241,0.07)] p-4 rounded-3xl overflow-x-auto [scrollbar-width:none]">
            <div className="flex items-center justify-between min-w-[650px] px-2">
              {STEPS.map((step, idx) => {
                const isCompleted = progress >= (idx === 0 ? 15 : idx === 1 ? 30 : idx === 2 ? 45 : idx === 3 ? 60 : idx === 4 ? 80 : 100);
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
                          ? "bg-linear-to-br from-blue-500 to-purple-500 border-blue-400   shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                          : isCompleted
                            ? "bg-blue-50 border-blue-200 text-blue-600"
                            : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-300"
                          }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span
                        className={`text-[11px] font-bold tracking-tight transition-all ${isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                          }`}
                      >
                        {step.label}
                      </span>
                    </button>
                    {idx < STEPS.length - 1 && (
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
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 font-bold">Step {store.currentStep} of 6</h3>
                    <h2 className="text-xl font-black text-slate-800 mt-1">{STEPS[store.currentStep - 1].desc}</h2>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1 flex items-center gap-1.5 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-600">Verified Step</span>
                  </div>
                </div>

                {/* STEP 1: COMPANY TYPE */}
                {store.currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">Select your organization structure. This will determine registration details and tax requirements.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { id: "proprietor", label: "Proprietor", desc: "Single owner business" },
                        { id: "partnership", label: "Partnership", desc: "Joint commercial venture" },
                        { id: "private_limited", label: "Private Limited", desc: "PvT Ltd corporate structure" },
                        { id: "public_limited", label: "Public Limited", desc: "Publicly listed enterprise" },
                        { id: "opc", label: "OPC", desc: "One Person Company" },
                        { id: "llp", label: "LLP", desc: "Limited Liability Partnership" }
                      ].map(type => {
                        const isSelected = store.companyType === type.id;
                        return (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => store.setCompanyType(type.id)}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all relative overflow-hidden group ${isSelected
                              ? "bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-200 shadow-md"
                              : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm"
                              }`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <div className={`p-2 rounded-lg border ${isSelected ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"
                                }`}>
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-blue-500 bg-blue-600 text-white" : "border-slate-300 bg-white"
                                }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-800">{type.label}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5">{type.desc}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-6 " >
                      <button
                        onClick={nextStep}
                        disabled={!store.companyType}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                      >
                        Save & Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: BASIC INFO */}
                {store.currentStep === 2 && (
                  <form onSubmit={handleSubmitStep2(onSaveStep2)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Company Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Constructions Ltd"
                          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                          {...registerStep2("companyName", { required: "Company Name is required" })}
                        />
                        {errorsStep2.companyName && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorsStep2.companyName.message}</span>}
                      </div>

                      {/* Select Company Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Company Type *</label>
                        <select
                          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 shadow-sm"
                          value={store.companyType}
                          onChange={(e) => store.setCompanyType(e.target.value)}
                        >
                          <option value="">-- Choose Type --</option>
                          <option value="proprietor">Proprietor</option>
                          <option value="partnership">Partnership</option>
                          <option value="private_limited">Private Limited</option>
                          <option value="public_limited">Public Limited</option>
                          <option value="opc">OPC</option>
                          <option value="llp">LLP</option>
                        </select>
                      </div>

                      {/* Contact Person */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Contact Person *</label>
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Dev"
                          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                          {...registerStep2("contactPerson", { required: "Contact Person is required" })}
                        />
                        {errorsStep2.contactPerson && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorsStep2.contactPerson.message}</span>}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address *</label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="e.g. contact@acme.com"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep2("email", {
                              required: "Email is required",
                              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                            })}
                          />
                          <button
                            type="button"
                            onClick={() => triggerOtpSend("email", watchStep2("email"))}
                            className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${store.basicInfo.emailVerified
                              ? "bg-emerald-550 bg-emerald-50 border-emerald-200 text-emerald-600"
                              : "bg-slate-50 border-slate-200 text-slate-655 text-slate-600 hover:bg-slate-100"
                              }`}
                          >
                            {store.basicInfo.emailVerified ? "Verified ✓" : "Verify OTP"}
                          </button>
                        </div>
                        {errorsStep2.email && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorsStep2.email.message}</span>}
                      </div>

                      {/* Mobile */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile Number *</label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep2("mobile", {
                              required: "Mobile is required",
                              pattern: { value: /^[6-9]\d{9}$/, message: "Invalid mobile number" }
                            })}
                          />
                          <button
                            type="button"
                            onClick={() => triggerOtpSend("mobile", watchStep2("mobile"))}
                            className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${store.basicInfo.mobileVerified
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                          >
                            {store.basicInfo.mobileVerified ? "Verified ✓" : "Verify OTP"}
                          </button>
                        </div>
                        {errorsStep2.mobile && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorsStep2.mobile.message}</span>}
                      </div>
                        {/* password       */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Password *</label>
                        <input
                          type="password"
                          placeholder="Create a strong password"
                          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                          {...registerStep2("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Minimum 8 characters" },
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              message: "Must include uppercase, lowercase, number, and special character"
                            }
                          })}
                        />
                        {errorsStep2.password && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorsStep2.password.message}</span>}
                      </div>
                          {/* confirm password */}
                      {/* <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Confirm Password *</label>
                        <input
                          type="password"
                          placeholder="Confirm your password"
                          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                          {...registerStep2("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === getValues("password") || "Passwords do not match"
                          })}
                        />
                        {errorsStep2.confirmPassword && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorsStep2.confirmPassword.message}</span>}
                      </div> */}

                      {/* Address with suggestions */}
                      <div className="flex flex-col gap-1.5 md:col-span-2 relative">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Address *</label>
                        <textarea
                          placeholder="Registered company address"
                          rows={2}
                          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 resize-none shadow-sm"
                          value={addressInput}
                          onChange={(e) => {
                            setAddressInput(e.target.value);
                            setValueStep2("address", e.target.value);
                          }}
                        />
                        {/* {addressSuggestions.length > 0 && (
                          <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-40 overflow-y-auto overflow-hidden">
                            {addressSuggestions.map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setAddressInput(s);
                                  setValueStep2("address", s);
                                  setAddressSuggestions([]);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-0 font-medium"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-slate-100 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-655 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                      >
                        Save & Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: REGISTRATION DETAILS */}
                {store.currentStep === 3 && (
                  <form onSubmit={handleSubmitStep3(onSaveStep3)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Section A */}
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                        <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 border-b border-slate-100 pb-2">SECTION A — Registration Details</h4>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GST Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 07AAAAA1111A1Z1"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep3("gstNo", {
                              pattern: {
                                value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
                                message: "Invalid GSTIN format"
                              }
                            })}
                          />
                          {errorsStep3.gstNo && <span className="text-red-500 text-[10px]">{errorsStep3.gstNo.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">State PAN NO.</label>
                          <input
                            type="text"
                            placeholder="e.g. ABCDE1234F"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep3("panNo", {
                              pattern: {
                                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                message: "Invalid PAN format"
                              }
                            })}
                          />
                          {errorsStep3.panNo && <span className="text-red-500 text-[10px]">{errorsStep3.panNo.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CIN Number</label>
                          <input
                            type="text"
                            placeholder="e.g. L27020MH1919PLC000540"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep3("cinNo")}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Aadhaar Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 123456789012"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep3("aadharNo", {
                              pattern: {
                                value: /^\d{12}$/,
                                message: "Aadhaar must be 12 digits"
                              }
                            })}
                          />
                          {errorsStep3.aadharNo && <span className="text-red-500 text-[10px]">{errorsStep3.aadharNo.message}</span>}
                        </div>
                      </div>

                      {/* Section B */}
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                        <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 border-b border-slate-100 pb-2">SECTION B — Additional Compliance</h4>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Provident Fund Account No.</label>
                          <input
                            type="text"
                            placeholder="e.g. MHBAN1234567000"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep3("pfNo")}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ESI Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 31000123450001001"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep3("esiNo")}
                          />
                        </div>

                       
                        {/* Udyog Aadhaar Toggle */}
                        <div className="flex items-center justify-between py-2 border-t border-slate-100 mt-2">
                          <span className="text-[11px] font-bold text-slate-600">MSME (Y/N)</span>
                          <Controller
                            control={controlStep3}
                            name="udyogAadhaarToggle"
                            defaultValue={store.registrationDetails.udyogAadhaarToggle}
                            render={({ field }) => (
                              <Switch
                                checked={field.value ?? false}
                                onChange={(val) => {
                                  field.onChange(val);
                                  setValueStep3("udyogAadhaarToggle", val);
                                }}
                              />
                            )}
                          />
                        </div>
                         {watchStep3("udyogAadhaarToggle") && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Udyog Aadhaar / Registration</label>
                            <input
                              type="text"
                              placeholder="e.g. UDYAM-MH-01-0012345"
                              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                              {...registerStep3("msmeNo")}
                            />
                          </div>)}

                      </div>
                    </div>

                    {/* Import & Export Upload Zone */}
                    <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4 mt-6">
                      <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 border-b border-slate-100 pb-2">Import & Export Certificate Upload</h4>

                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden bg-white ${dragActive ? "border-blue-400 bg-blue-50/30" : "border-slate-200 hover:border-blue-400/80"
                          }`}
                      >
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            if (e.target.files) uploadStep3Files(Array.from(e.target.files));
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-sm">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Drag & Drop files here or click to upload</p>
                        <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG, or TIFF format (max 5MB per file)</p>
                      </div>

                      {/* Display Uploaded files */}
                      {store.registrationDetails.importExportCertFiles?.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {store.registrationDetails.importExportCertFiles.map((file, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden shadow-sm">
                              <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-lg bg-slate-50 text-purple-600 border border-slate-100">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = store.registrationDetails.importExportCertFiles.filter((_, i) => i !== idx);
                                    store.setRegistrationDetails({ importExportCertFiles: filtered });
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-all border border-transparent hover:border-red-150"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {file.progress < 100 && (
                                <div className="w-full mt-2.5 bg-slate-100 rounded-full h-1">
                                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: `${file.progress}%` }} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-slate-100 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                      >
                        Save & Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 4: BANKING DETAILS */}
                {store.currentStep === 6 && (
                  <form onSubmit={handleSubmitStep4(onSaveStep4)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                      {/* Form Details */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bank Name</label>
                          <input
                            type="text"
                            placeholder="e.g. State Bank of India"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            {...registerStep4("bankName", { required: "Bank Name is required" })}
                          />
                          {errorsStep4.bankName && <span className="text-red-500 text-[10px]">{errorsStep4.bankName.message}</span>}

                          <input
                            type="password"
                            placeholder="Encrypted account number"
                            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 font-mono shadow-sm"
                            {...registerStep4("accountNumber", {
                              required: "Account Number is required",
                              pattern: { value: /^\d{9,18}$/, message: "Must be between 9 and 18 digits" }
                            })}
                          />
                          {errorsStep4.accountNumber && <span className="text-red-550 text-[10px]">{errorsStep4.accountNumber.message}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">IFSC Code</label>
                            <input
                              type="text"
                              placeholder="e.g. SBIN0001234"
                              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 font-mono uppercase shadow-sm"
                              {...registerStep4("ifscCode", {
                                required: "IFSC is required",
                                pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC code format" }
                              })}
                            />
                            {errorsStep4.ifscCode && <span className="text-red-550 text-[10px]">{errorsStep4.ifscCode.message}</span>}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">MICR Code</label>
                            <input
                              type="text"
                              placeholder="e.g. 110002001"
                              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 font-mono shadow-sm"
                              {...registerStep4("micrCode")}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fintech Bank Card Preview */}
                      <div className="flex justify-center">
                        <div className={`w-80 h-48 rounded-3xl bg-gradient-to-br ${detectedBank.color} p-6 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden border border-white/10 shadow-blue-500/5`}>
                          {/* Ambient shapes on card */}
                          <div className="absolute right-0 top-0 w-28 h-28 bg-white/5 rounded-full blur-xl translate-x-4 -translate-y-4" />
                          <div className="absolute left-10 bottom-0 w-20 h-20 bg-black/10 rounded-full blur-lg" />

                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[9px] uppercase font-bold tracking-widest text-white/70">ContractsIndia Premium settlement</p>
                              <h4 className="text-sm font-black mt-0.5">{detectedBank.name}</h4>
                            </div>
                            <span className="text-xs font-black bg-white/15 px-2.5 py-1 rounded-lg border border-white/10 tracking-widest font-mono">
                              {detectedBank.text}
                            </span>
                          </div>

                          <div className="my-2">
                            <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                              <span>••••</span> <span>••••</span> <span>••••</span>
                              <span className="text-white font-bold ml-1">
                                {watchStep4("accountNumber") ? watchStep4("accountNumber").slice(-4) : "1234"}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-end border-t border-white/10 pt-3">
                            <div>
                              <p className="text-[8px] uppercase tracking-wider text-white/50">Settlement Account</p>
                              <p className="text-xs font-bold font-mono">{watchStep4("accountType") || "SAVINGS"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] uppercase tracking-wider text-white/50">IFSC Routing</p>
                              <p className="text-xs font-bold font-mono uppercase">{watchStep4("ifscCode") || "SBIN0000000"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-slate-100 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1  "
                      >
                        <ChevronLeft className="w-4 h-4" /> Back 
                      </button>
                      <button
                        // type="submit"
                         onClick={() => {
                          if (progress < 45) {
                            message.error("You need at least 45% profile completion to save and finish.");
                            return;
                          }
                          store.setIsSkipped(true);
                          message.success("Congratulations! Your commercial profile is completed. Dashboard unlocked!");
                          navigation("/commercial/dashboard");
                        }} 
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                      >
                        Save & Continue <Check className="w-4 h-4" />
                      </button>
                    </div>

                  </form>
                )}

                {/* STEP 5: DOCUMENT UPLOAD CENTER */}
                {store.currentStep === 4 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-505 text-slate-500">Upload your commercial validation documents. Each section represents a different compliance category.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          id: "businessRegistration",
                          label: "Business Registration",
                          options: ["GST Certificate", "Incorporation Certificate", "Trade License", "Shop Act"]
                        },
                        {
                          id: "identityAddress",
                          label: "Identity & Address Proof",
                          options: ["PAN Card", "Aadhaar Card", "Utility Bill", "Passport"]
                        },
                        {
                          id: "complianceCertificates",
                          label: "Compliance Certificates",
                          options: ["ISO Certificates", "Labour License", "Cancelled Cheque"]
                        },
                        {
                          id: "otherDocuments",
                          label: "Other Enterprise Documents",
                          options: ["Company Brochure", "NOC Certificate", "Audit Reports", "Others"]
                        }
                      ].map(cat => {
                        const uploadedSections = store.documents[cat.id as keyof typeof store.documents] || [];
                        const totalFilesCount = uploadedSections.reduce((a, b) => a + b.files.length, 0);

                        return (
                          <div key={cat.id} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 border-b border-slate-100 font-bold">{cat.label}</h4>
                              {totalFilesCount > 0 && (
                                <span className="text-[10px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full text-blue-600 font-bold shadow-sm">
                                  {totalFilesCount} File(s)
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <select
                                value={selectedDocType[cat.id]}
                                onChange={(e) => setSelectedDocType(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 flex-1 focus:outline-none focus:border-blue-400 shadow-sm"
                              >
                                {cat.options.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>

                            {/* Drop Zone */}
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleDocCategoryDrop(e, cat.id as any)}
                              className="relative py-6 border border-dashed border-slate-200 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center bg-white/50 cursor-pointer shadow-inner"
                            >
                              <input
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files) uploadCategoryFiles(Array.from(e.target.files), cat.id as any);
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <Upload className="w-4 h-4 text-slate-400 mb-1" />
                              <span className="text-[11px] font-bold text-slate-600">Drag or browse to upload</span>
                            </div>

                            {/* File Listing Cards */}
                            {uploadedSections.map((sec, secIdx) => (
                              <div key={secIdx} className="space-y-2 mt-2">
                                <h5 className="text-[10px] uppercase font-bold tracking-wider text-purple-600">{sec.type}</h5>
                                {sec.files.map((file, fileIdx) => (
                                  <div key={fileIdx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-sm">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                      <span className="truncate text-slate-700 font-medium">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {file.progress < 100 ? (
                                        <span className="text-[10px] text-purple-600 font-mono">{file.progress}%</span>
                                      ) : (
                                        <button
                                          onClick={() => removeCategoryFile(cat.id as any, secIdx, fileIdx)}
                                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-white/5 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                      >
                        Save & Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: SERVICE LISTING */}
                {/* {store.currentStep === 6 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400">List the services you provide. Clients will see these services when browsing the ContractsIndia™ marketplace.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

               
                      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                        <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-400 border-b border-white/5 pb-2">Add New Service</h4>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Civil Construction Work"
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-white"
                            value={newService.name}
                            onChange={(e) => setNewService(p => ({ ...p, name: e.target.value }))}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category *</label>
                          <select
                            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-white"
                            value={newService.category}
                            onChange={(e) => setNewService(p => ({ ...p, category: e.target.value }))}
                          >
                            <option value="">-- Choose Category --</option>
                            <option value="Consulting">Consulting Services</option>
                            <option value="Construction">Construction & Engineering</option>
                            <option value="Material">Material Manufacturing & Supply</option>
                            <option value="Legal">Legal & Contracts</option>
                            <option value="Tenders">Tender Advisory</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pricing Estimate *</label>
                          <input
                            type="text"
                            placeholder="e.g. ₹5,00,000 onwards"
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-white"
                            value={newService.price}
                            onChange={(e) => setNewService(p => ({ ...p, price: e.target.value }))}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                          <textarea
                            placeholder="Detail your capabilities, machinery, and team size..."
                            rows={2}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-white resize-none"
                            value={newService.description}
                            onChange={(e) => setNewService(p => ({ ...p, description: e.target.value }))}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tags (comma-separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. residential, concrete, commercial"
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-white"
                            value={newService.tagsInput}
                            onChange={(e) => setNewService(p => ({ ...p, tagsInput: e.target.value }))}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={addCustomService}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Service Listing
                        </button>
                      </div>

                      
                      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-400">Active Listing ({store.services.length})</h4>
                          <div className="relative w-40">
                            <input
                              type="text"
                              placeholder="Search..."
                              className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-2.5 py-1 text-[10px] text-white focus:outline-none"
                              value={serviceSearch}
                              onChange={(e) => setServiceSearch(e.target.value)}
                            />
                            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
                          </div>
                        </div>

                        {store.services.length === 0 ? (
                          <div className="h-48 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs">
                            <Briefcase className="w-8 h-8 text-slate-600 mb-2" />
                            No services listed yet. Add one on the left.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {store.services
                              .filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()))
                              .map((service, idx) => (
                                <div
                                  key={service.id}
                                  draggable
                                  onDragStart={() => handleServiceDragStart(idx)}
                                  onDragOver={(e) => handleServiceDragOver(e, idx)}
                                  onDragEnd={handleServiceDragEnd}
                                  className="p-3 bg-slate-900 border border-white/5 rounded-xl flex items-start justify-between cursor-move hover:border-purple-500/40 transition-all"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[8px] bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded text-purple-400 uppercase font-bold">
                                        {service.category}
                                      </span>
                                      <span className="text-xs font-black text-white truncate">{service.name}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 truncate">{service.description || "No description provided."}</p>
                                    <p className="text-[10px] font-bold text-blue-400 mt-0.5">{service.price}</p>
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {service.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[8px] bg-slate-800 border border-white/5 px-1.5 py-0.5 rounded text-slate-400">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => store.removeService(service.id)}
                                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-all shrink-0 ml-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
 
                    <div className="flex justify-between gap-3 pt-6 border-t border-slate-100 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                      >
                        Save & Continue5 <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )} */}

                {/* STEP 6: SERVICE LISTING */}
                {store.currentStep === 5 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-500">List the services you provide. Clients will see these services when browsing the ContractsIndia™ marketplace.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Left: Add Service Form */}
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                        <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 border-b border-slate-100 pb-2 font-bold">Add New Service</h4>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Service Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Civil Construction Work"
                            className=" border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            value={newService.name}
                            onChange={(e) => setNewService(p => ({ ...p, name: e.target.value }))}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category *</label>
                          <select
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 shadow-sm"
                            value={newService.category}
                            onChange={(e) => setNewService(p => ({ ...p, category: e.target.value }))}
                          >
                            <option value="">-- Choose Category --</option>
                            <option value="Consulting">Consulting Services</option>
                            <option value="Construction">Construction & Engineering</option>
                            <option value="Material">Material Manufacturing & Supply</option>
                            <option value="Legal">Legal & Contracts</option>
                            <option value="Tenders">Tender Advisory</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pricing Estimate *</label>
                          <input
                            type="text"
                            placeholder="e.g. ₹5,00,000 onwards"
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            value={newService.price}
                            onChange={(e) => setNewService(p => ({ ...p, price: e.target.value }))}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description</label>
                          <textarea
                            placeholder="Detail your capabilities, machinery, and team size..."
                            rows={2}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 resize-none shadow-sm"
                            value={newService.description}
                            onChange={(e) => setNewService(p => ({ ...p, description: e.target.value }))}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tags (comma-separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. residential, concrete, commercial"
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                            value={newService.tagsInput}
                            onChange={(e) => setNewService(p => ({ ...p, tagsInput: e.target.value }))}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={addCustomService}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1 border border-transparent"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Service Listing
                        </button>
                      </div>

                      {/* Right: Service List & Search */}
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 font-bold">Active Listing ({store.services.length})</h4>
                          <div className="relative w-40">
                            <input
                              type="text"
                              placeholder="Search..."
                              className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-2.5 py-1.5 text-[10px] text-slate-850 focus:outline-none focus:border-blue-400 shadow-sm"
                              value={serviceSearch}
                              onChange={(e) => setServiceSearch(e.target.value)}
                            />
                            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                          </div>
                        </div>

                        {store.services.length === 0 ? (
                          <div className="h-48 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs">
                            <Briefcase className="w-8 h-8 text-slate-350 mb-2" />
                            No services listed yet. Add one on the left.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {store.services
                              .filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()))
                              .map((service, idx) => (
                                <div
                                  key={service.id}
                                  draggable
                                  onDragStart={() => handleServiceDragStart(idx)}
                                  onDragOver={(e) => handleServiceDragOver(e, idx)}
                                  onDragEnd={handleServiceDragEnd}
                                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between cursor-move hover:border-purple-300 transition-all shadow-sm"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[8px] bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded text-purple-600 uppercase font-bold">
                                        {service.category}
                                      </span>
                                      <span className="text-xs font-black text-slate-800 truncate">{service.name}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 truncate">{service.description || "No description provided."}</p>
                                    <p className="text-[10px] font-bold text-blue-600 mt-0.5">{service.price}</p>
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {service.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[8px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => store.removeService(service.id)}
                                    className="text-red-500 hover:text-red-750 p-1 rounded hover:bg-red-50 transition-all shrink-0 ml-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-white/5 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
                      >
                        Save & Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
              <div className="bg-linear-to-r from-blue-500 via-purple-500 to-cyan-400 h-full rounded-full" style={{ width: `${progress}%` }} />
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
                const stepProg = idx === 0 ? 15 : idx === 1 ? 30 : idx === 2 ? 45 : idx === 3 ? 60 : idx === 4 ? 80 : 100;
                const isCompleted = progress >= stepProg;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${isCompleted
                      ? "bg-blue-50 border-blue-100 text-slate-700"
                      : "bg-slate-50/40 border-slate-100 text-slate-400"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${isCompleted ? "bg-blue-100 border-blue-300 text-blue-600" : "border-slate-200 bg-white"
                      }`}>
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
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Uploaded Docs:</span>
              <span className="font-bold text-purple-600">{getUploadedFilesCount()} Files</span>
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
                  <li key={idx} className="flex gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-[10px] text-yellow-800 leading-snug">
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
      {otpModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-purple-600">Security Check</h4>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">Verify {otpModal.type === "email" ? "Email Address" : "Mobile Phone"}</h3>
              </div>
              <button
                onClick={() => setOtpModal({ isOpen: false, type: "email", val: "" })}
                className="text-slate-400 hover:bg-slate-100 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              We have sent a security code to <strong className="text-slate-700">{otpModal.val}</strong>. Enter code below (Enter <strong className="text-slate-800 font-bold">123456</strong> to verify).
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
      )}
    </div>
  );
}
