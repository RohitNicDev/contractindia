import { message, Switch } from "antd";
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Upload,
  X,
  FileText,
  Loader,
  GripVertical,
  Layers3,
  EyeOff,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  userBankDetailSave,
  userBasicInformationSave,

  UserDocumentStoreSave,

  DocumentCategoryGet,
} from "../../../../services/api";
import { formatDocumentPayload, validateDocumentFile } from "../../../../utils/Format";
import { SERVICES_HIERARCHY } from "../../../../data/services_hierarchy";

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1: COMPANY TYPE
// ═══════════════════════════════════════════════════════════════════════════════

export function Step1CompanyType({ store, nextStep }) {
  const companyTypes = [
    { id: "proprietor", label: "Proprietor", desc: "Single owner business" },
    { id: "partnership", label: "Partnership", desc: "Joint commercial venture" },
    { id: "private_limited", label: "Private Limited", desc: "PvT Ltd corporate structure" },
    { id: "public_limited", label: "Public Limited", desc: "Publicly listed enterprise" },
    { id: "opc", label: "OPC", desc: "One Person Company" },
    { id: "llp", label: "LLP", desc: "Limited Liability Partnership" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Select your organization structure. This will determine registration
        details and tax requirements.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {companyTypes.map((type) => {
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
                <div
                  className={`p-2 rounded-lg border ${isSelected
                    ? "bg-blue-50 border-blue-100 text-blue-600"
                    : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-slate-300 bg-white"
                    }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  {type.label}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{type.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-6 ">
        <button
          onClick={nextStep}
          disabled={!store.companyType}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
        >
          Save & Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2: BASIC INFO
// ═══════════════════════════════════════════════════════════════════════════════

export function Step2BasicInfo({ store, nextStep, prevStep, triggerOtpSend }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: store.basicInfo });

  // Mutation for saving basic info
  const { mutate: saveBasicInfo, isPending: isSaving } = useMutation({
    mutationFn: userBasicInformationSave,
    onSuccess: (response) => {
      if (response?.status) {
        toast.success(response?.message || "Basic Information saved successfully!");
        store.setBasicInfo(watch());
        nextStep();
      } else {
        toast.error(response?.message || "Failed to save basic information");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to save basic information. Please try again.");
    },
  });

  const onSaveStep2 = async (data) => {
    const payload = {
      userID: 0,
      companyTypeId: 0,
      companyTypeName: store.companyType || "",
      companyName: data.companyName || "",
      email: data.email || "",
      contactNo: data.mobile || "",
      address: data.address || "",
      gstNo: data.gstNo || "",
      panNo: data.panNo || "",
      esiNo: data.esiNo || "",
      cinNo: data.cinNo || "",
      isMSME: data.udyogAadhaarToggle ? 1 : 0,
      udyogRegistrationNo: data.msmeNo || "",
      isActive: 1,
      createdBy: 0,
      createdDate: new Date().toISOString(),
    };

    saveBasicInfo(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSaveStep2)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Company Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Acme Constructions Ltd"
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
            {...register("companyName", {
              required: "Company Name is required",
            })}
          />
          {errors.companyName && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.companyName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Company Type *
          </label>
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

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Contact Person *
          </label>
          <input
            type="text"
            placeholder="e.g. Ramesh Dev"
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
            {...register("contactPerson", {
              required: "Contact Person is required",
            })}
          />
          {errors.contactPerson && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.contactPerson.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Email Address *
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="e.g. contact@acme.com"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
            />
            <button
              type="button"
              onClick={() => triggerOtpSend("email", watch("email"))}
              className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${store.basicInfo.emailVerified
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
            >
              {store.basicInfo.emailVerified ? "Verified ✓" : "Verify OTP"}
            </button>
          </div>
          {errors.email && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Mobile Number *
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...register("mobile", {
                required: "Mobile is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid mobile number",
                },
              })}
            />
            <button
              type="button"
              onClick={() => triggerOtpSend("mobile", watch("mobile"))}
              className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${store.basicInfo.mobileVerified
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
            >
              {store.basicInfo.mobileVerified ? "Verified ✓" : "Verify OTP"}
            </button>
          </div>
          {errors.mobile && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.mobile.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Update Password{" "}
            <span className="text-[9px] font-medium text-slate-400">
              (optional)
            </span>
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
            {...register("password", {
              validate: (value) =>
                !value ||
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                  value,
                ) ||
                "Password must be at least 8 chars",
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2 relative">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Address *
          </label>
          <textarea
            placeholder="Registered company address"
            rows={2}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 resize-none shadow-sm"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.address.message}
            </span>
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
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
        >
          {isSaving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Save & Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4: DOCUMENTS WITH API INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

export function Step4Documents({ store, nextStep, prevStep }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});

  // Fetch document categories
  const {
    data: categoriesData = { data: [] },
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["documentCategories"],
    queryFn: DocumentCategoryGet,
    staleTime: Infinity,
  });

  const categories = categoriesData?.data || [];

  // Mutation for saving documents
  const { mutate: saveDocument, isPending: isSavingDoc } = useMutation({
    mutationFn: UserDocumentStoreSave,
    onSuccess: (response) => {
      if (response?.status) {
        toast.success("Document uploaded successfully!");
      } else {
        toast.error(response?.message || "Failed to upload document");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to upload document");
    },
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFileUpload(files, categoryId);
    }
  };

  const handleFileUpload = (files, categoryId) => {
    files.forEach((file) => {
      // Validate file
      const validation = validateDocumentFile(file, 5, [
        "pdf",
        "jpg",
        "jpeg",
        "png",
        "tiff",
      ]);

      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Set uploading state
      setUploadingFiles((prev) => ({
        ...prev,
        [file.name]: 0,
      }));

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setUploadingFiles((prev) => ({
          ...prev,
          [file.name]: progress,
        }));
        if (progress >= 100) clearInterval(interval);
      }, 250);

      // Format payload
      const payload = formatDocumentPayload(
        file,
        file.name,
        categoryId,
        0
      );

      // Save document
      saveDocument(payload);
    });
  };

  const handleDeleteDocument = (docId) => {
    // TODO: Implement delete with mutation
    toast.success("Document removed");
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        Upload your commercial validation documents. Each section represents a
        different compliance category.
      </p>

      {categoriesLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-slate-600">Loading categories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.DocumentCategoryID}
              className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 font-bold">
                  {cat.DocumentCategoryName}
                </h4>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={(e) => handleDrop(e, cat.DocumentCategoryID)}
                className={`relative py-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-white ${dragActive
                  ? "border-blue-400 bg-blue-50/30"
                  : "border-slate-200 hover:border-blue-400/80"
                  }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files)
                      handleFileUpload(
                        Array.from(e.target.files),
                        cat.DocumentCategoryID
                      );
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  Drag & Drop files here or click to upload
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  PDF, JPG, PNG, or TIFF format (max 5MB per file)
                </p>
              </div>

              {/* Upload progress */}
              {Object.entries(uploadingFiles).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-sm">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">
                        {fileName}
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-mono">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

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
  );
}

export function Step3Registration({ store, nextStep, prevStep }) {
  const {
    register: registerStep3,
    control: controlStep3,
    handleSubmit: handleSubmitStep3,
    formState: { errors: errorsStep3 },
    setValue: setValueStep3,
    watch: watchStep3,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      gstNo: store.registrationDetails?.gstNo || "",
      panNo: store.registrationDetails?.panNo || "",
      cinNo: store.registrationDetails?.cinNo || "",
      aadharNo: store.registrationDetails?.aadharNo || "",
      pfNo: store.registrationDetails?.pfNo || "",
      esiNo: store.registrationDetails?.esiNo || "",
      msmeNo: store.registrationDetails?.msmeNo || "",
      udyogAadhaarToggle: store.registrationDetails?.udyogAadhaarToggle || false,
      licenseNo: store.registrationDetails?.licenseNo || "",
      licenseExpiryDate: store.registrationDetails?.licenseExpiryDate || "",
    },
  });

  const [activeSection, setActiveSection] = useState("section-a");
  const [validationStatus, setValidationStatus] = useState({});

  // Validation patterns
  const patterns = {
    gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    aadhaar: /^\d{12}$/,
    cin: /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
  };

  const onSaveStep3 = async (data) => {
    try {
      // Validate at least one identifier is provided
      const hasIdentifier = data.gstNo || data.panNo || data.cinNo || data.aadharNo;
      if (!hasIdentifier) {
        toast.error("Please provide at least one identifier (GST/PAN/CIN/Aadhaar)");
        return;
      }

      // Save to store
      store.setRegistrationDetails(data);
      toast.success("✓ Registration & Compliance details saved successfully!");
      nextStep();
    } catch (error) {
      toast.error("Failed to save registration details");
    }
  };

  const validateField = (fieldName, value) => {
    if (!value) return null;

    const pattern = patterns[fieldName];
    if (pattern && !pattern.test(value)) {
      return `Invalid ${fieldName.toUpperCase()} format`;
    }
    return null;
  };

  const handleFieldBlur = (fieldName, value) => {
    const error = validateField(fieldName, value);
    setValidationStatus((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const sections = [
    {
      id: "section-a",
      title: "SECTION A – Registration Details",
      icon: "📋",
      color: "blue",
    },
    {
      id: "section-b",
      title: "SECTION B – Additional Compliance",
      icon: "⚖️",
      color: "purple",
    },
  ];

  return (
    <form onSubmit={handleSubmitStep3(onSaveStep3)} className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeSection === section.id
              ? `border-blue-600 text-blue-600`
              : `border-transparent text-slate-600 hover:text-slate-800`
              }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Section A - Registration Details */}
      <AnimatePresence mode="wait">
        {activeSection === "section-a" && (
          <motion.div
            key="section-a"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-6 space-y-4"
          >
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-700 mb-4">
              📋 Statutory Registration Numbers
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GST Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  GST Number
                  {validationStatus.gstNo && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 07AAAAA1111A1Z1"
                  maxLength="15"
                  className={`bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 shadow-sm transition-all ${validationStatus.gstNo
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                    }`}
                  {...registerStep3("gstNo")}
                  onBlur={(e) =>
                    handleFieldBlur("gstNo", e.target.value.toUpperCase())
                  }
                />
                {validationStatus.gstNo && (
                  <span className="text-red-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationStatus.gstNo}
                  </span>
                )}
                {errorsStep3.gstNo && (
                  <span className="text-red-500 text-[10px]">
                    {errorsStep3.gstNo.message}
                  </span>
                )}
              </div>

              {/* PAN Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  PAN Number
                  {validationStatus.pan && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  maxLength="10"
                  className={`bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 shadow-sm transition-all ${validationStatus.pan
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                    }`}
                  {...registerStep3("panNo")}
                  onBlur={(e) =>
                    handleFieldBlur("pan", e.target.value.toUpperCase())
                  }
                />
                {validationStatus.pan && (
                  <span className="text-red-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationStatus.pan}
                  </span>
                )}
              </div>

              {/* CIN Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  CIN Number (Corporate)
                  {validationStatus.cin && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. L27020MH1919PLC000540"
                  className={`bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 shadow-sm transition-all ${validationStatus.cin
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                    }`}
                  {...registerStep3("cinNo")}
                  onBlur={(e) =>
                    handleFieldBlur("cin", e.target.value.toUpperCase())
                  }
                />
                {validationStatus.cin && (
                  <span className="text-red-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationStatus.cin}
                  </span>
                )}
              </div>

              {/* Aadhaar Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  Aadhaar Number
                  {validationStatus.aadhaar && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789012"
                  maxLength="12"
                  className={`bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 shadow-sm transition-all ${validationStatus.aadhaar
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                    }`}
                  {...registerStep3("aadharNo")}
                  onBlur={(e) =>
                    handleFieldBlur("aadhaar", e.target.value)
                  }
                />
                {validationStatus.aadhaar && (
                  <span className="text-red-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationStatus.aadhaar}
                  </span>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-4 p-3 bg-blue-100/50 border border-blue-200 rounded-lg text-[10px] text-blue-800">
              ℹ️ At least one identification number (GST/PAN/CIN/Aadhaar) is required
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section B - Additional Compliance */}
      <AnimatePresence mode="wait">
        {activeSection === "section-b" && (
          <motion.div
            key="section-b"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl p-6 space-y-4"
          >
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-purple-700 mb-4">
              ⚖️ Employee & Labor Compliance
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PF Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Provident Fund Account No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. MHBAN1234567000"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                  {...registerStep3("pfNo")}
                />
              </div>

              {/* ESI Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  ESI Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 31000123450001001"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                  {...registerStep3("esiNo")}
                />
              </div>

              {/* License Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Trade/Shop License No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. LIC123456"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                  {...registerStep3("licenseNo")}
                />
              </div>

              {/* License Expiry */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100/50 text-slate-800 shadow-sm"
                  {...registerStep3("licenseExpiryDate")}
                />
              </div>
            </div>

            {/* MSME Toggle */}
            <div className="mt-6 p-4 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-slate-800">
                    Is this an MSME Enterprise?
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Micro, Small & Medium Enterprise Registration
                  </span>
                </div>
                <Controller
                  control={controlStep3}
                  name="udyogAadhaarToggle"
                  defaultValue={false}
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

              {/* MSME Number - Show if toggled */}
              {watchStep3("udyogAadhaarToggle") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-200"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Udyam Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UDYAM-MH-01-0012345"
                      className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                      {...registerStep3("msmeNo")}
                    />
                    <span className="text-[9px] text-slate-500">
                      ℹ️ Visit https://udyamregistration.gov.in to register
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Actions */}
      <div className="flex justify-between gap-3 pt-6 border-t border-slate-100 mt-8">
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
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6: BANKING DETAILS
// ═══════════════════════════════════════════════════════════════════════════════

export function Step6Banking({
  store,
  nextStep,
  prevStep,
  navigation,
  progress,
}) {
  const getBankLogo = (ifsc) => {
    const code = ifsc?.substring(0, 4).toUpperCase();
    if (code === "SBIN")
      return {
        name: "State Bank of India",
        color: "from-blue-600 to-sky-500",
        text: "SBI",
      };
    if (code === "HDFC")
      return {
        name: "HDFC Bank",
        color: "from-blue-900 to-indigo-700",
        text: "HDFC",
      };
    if (code === "ICIC")
      return {
        name: "ICICI Bank",
        color: "from-orange-600 to-amber-500",
        text: "ICICI",
      };
    if (code === "UTIB")
      return {
        name: "Axis Bank",
        color: "from-rose-900 to-pink-700",
        text: "AXIS",
      };
    if (code === "PUNB")
      return {
        name: "Punjab National Bank",
        color: "from-red-700 to-orange-600",
        text: "PNB",
      };
    return {
      name: "Commercial Bank",
      color: "from-slate-800 to-slate-700",
      text: "BANK",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: store.bankingDetails });

  // Mutation for saving bank details
  const { mutate: saveBankDetails, isPending: isSavingBank } = useMutation({
    mutationFn: userBankDetailSave,
    onSuccess: (response) => {
      if (response?.status) {
        toast.success(response?.message || "Banking Details saved successfully!");
        store.setBankingDetails(watch());
        nextStep();
      } else {
        toast.error(response?.message || "Failed to save banking details");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to save banking details. Please try again.");
    },
  });

  const watchIfsc = watch("ifscCode") || "";
  const detectedBank = getBankLogo(watchIfsc);

  const onSaveStep6 = async (data) => {
    const payload = {
      bankDetailID: 0,
      userID: 0,
      bankName: data.bankName || "",
      accountNo: data.accountNumber || "",
      ifsc: data.ifscCode || "",
      micr: data.micrCode || "",
      isPrimaryAccount: 1,
      isActive: 1,
      createdBy: 0,
      createdDate: new Date().toISOString(),
    };

    saveBankDetails(payload);
  };

  const handleFinish = () => {
    if (progress < 45) {
      toast.error(
        "You need at least 45% profile completion to save and finish."
      );
      return;
    }
    store.setIsSkipped(true);
    toast.success(
      "Congratulations! Your commercial profile is completed. Dashboard unlocked!"
    );
    navigation("/commercial/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSaveStep6)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Bank Name
            </label>
            <input
              type="text"
              placeholder="e.g. State Bank of India"
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...register("bankName", {
                required: "Bank Name is required",
              })}
            />
            {errors.bankName && (
              <span className="text-red-500 text-[10px]">
                {errors.bankName.message}
              </span>
            )}

            <div className="flex flex-col gap-1.5 mt-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Account Number *
              </label>
              <input
                type="password"
                placeholder="Encrypted account number"
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 font-mono shadow-sm"
                {...register("accountNumber", {
                  required: "Account Number is required",
                  pattern: {
                    value: /^\d{9,18}$/,
                    message: "Must be between 9 and 18 digits",
                  },
                })}
              />
              {errors.accountNumber && (
                <span className="text-red-500 text-[10px]">
                  {errors.accountNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="e.g. SBIN0001234"
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 font-mono uppercase shadow-sm"
                {...register("ifscCode", {
                  required: "IFSC is required",
                  pattern: {
                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Invalid IFSC code format",
                  },
                })}
              />
              {errors.ifscCode && (
                <span className="text-red-500 text-[10px]">
                  {errors.ifscCode.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                MICR Code
              </label>
              <input
                type="text"
                placeholder="e.g. 110002001"
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 font-mono shadow-sm"
                {...register("micrCode")}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className={`w-80 h-48 rounded-3xl bg-gradient-to-br ${detectedBank.color} p-6 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden border border-white/10 shadow-blue-500/5`}
          >
            <div className="absolute right-0 top-0 w-28 h-28 bg-white/5 rounded-full blur-xl translate-x-4 -translate-y-4" />
            <div className="absolute left-10 bottom-0 w-20 h-20 bg-black/10 rounded-full blur-lg" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] uppercase font-bold tracking-widest text-white/70">
                  ContractsIndia Premium settlement
                </p>
                <h4 className="text-sm font-black mt-0.5">
                  {detectedBank.name}
                </h4>
              </div>
              <span className="text-xs font-black bg-white/15 px-2.5 py-1 rounded-lg border border-white/10 tracking-widest font-mono">
                {detectedBank.text}
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                <span>••••</span> <span>••••</span> <span>••••</span>
                <span className="text-white font-bold ml-1">
                  {watch("accountNumber")
                    ? watch("accountNumber").slice(-4)
                    : "1234"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <p className="text-[8px] uppercase tracking-wider text-white/50">
                  Settlement Account
                </p>
                <p className="text-xs font-bold font-mono">
                  {watch("accountType") || "SAVINGS"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase tracking-wider text-white/50">
                  IFSC Routing
                </p>
                <p className="text-xs font-bold font-mono uppercase">
                  {watch("ifscCode") || "SBIN0000000"}
                </p>
              </div>
            </div>
          </div>
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
          disabled={isSavingBank}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
        >
          {isSavingBank ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Save & Continue <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}


export function Step5ServiceListing({ store, nextStep, prevStep }) {
  const [services, setServices] = useState(SERVICES_HIERARCHY);

  const colorMap = {
    violet: { border: "#c4b5fd", bg: "#f5f3ff", text: "#7c3aed", glow: "rgba(124, 58, 237, 0.4)" },
    cyan: { border: "#a5f3fc", bg: "#ecfeff", text: "#0891b2", glow: "rgba(8, 145, 178, 0.4)" },
    amber: { border: "#fde68a", bg: "#fffbeb", text: "#d97706", glow: "rgba(217, 119, 6, 0.4)" },
    rose: { border: "#fecdd3", bg: "#fff1f2", text: "#e11d48", glow: "rgba(225, 29, 72, 0.4)" },
    emerald: { border: "#a7f3d0", bg: "#ecfdf5", text: "#059669", glow: "rgba(5, 150, 105, 0.4)" },
  };
  const [activeIds, setActiveIds] = useState(store?.activeServices || []);
  const [expandedIds, setExpandedIds] = useState(store?.expandedServices || []);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleActive = (id) => {
    setActiveIds((prev) => {
      const isActive = prev.includes(id);
      if (isActive) {
        toast.success("Service deactivated");
        return prev.filter((x) => x !== id);
      }
      toast.success("Service activated");
      return [...prev, id];
    });
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedItem(null);
    setDragOverId(null);
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    setDragOverId(targetId);
  };

  const countTotalChildren = (item) => {
    let count = 0;
    const children = item.subServices || item.children || [];
    children.forEach((child) => {
      count++;
      if (child.children || child.subServices) {
        count += countTotalChildren(child);
      }
    });
    return count;
  };

  const renderServiceItem = (item, level = 0, parentColor = "violet") => {
    const isExpanded = expandedIds.includes(item.id);
    const isActive = activeIds.includes(item.id);
    const hasChildren = (item.subServices || item.children)?.length > 0;
    const children = item.subServices || item.children || [];
    const color = item.color || parentColor;
    const colors = colorMap[color];
    const isDraggedOver = dragOverId === item.id;

    return (
      <div key={item.id} className="relative">
        {/* Connecting line */}
        {level > 0 && (
          <div
            className="absolute left-0 top-0 h-full w-[2px] -translate-x-6 opacity-30"
            style={{
              background: `linear-gradient(to bottom, ${colors.border}, transparent)`,
            }}
          />
        )}

        {/* Service Card */}
        <motion.div
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, item.id)}
          whileHover={{ scale: 1.01 }}
          className={`
            group relative mb-3 overflow-hidden rounded-2xl
            border-2 transition-all duration-300
            cursor-move
            ${isDraggedOver ? "scale-[1.02] ring-4 ring-offset-2" : ""}
            ${isActive ? "bg-white" : "bg-slate-50/50"}
          `}
          style={{
            borderColor: isDraggedOver ? colors.border : (isActive ? colors.border : "#e5e7eb"),
            marginLeft: `${level * 40}px`,
            boxShadow: isActive
              ? `0 0 30px ${colors.glow}, 0 10px 40px -12px rgba(0,0,0,0.15)`
              : "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Main content */}
          <div className="relative p-4">
            <div className="flex items-start gap-3">
              {/* Drag handle */}
              <GripVertical className="mt-1 h-5 w-5 flex-shrink-0 cursor-grab text-slate-300 transition-colors group-hover:text-slate-500" />

              {/* Expand/Collapse button */}
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: isExpanded ? "rgb(241 245 250)" : "white",
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" style={{ color: colors.text }} />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" style={{ color: colors.text }} />
                  )}
                </button>
              )}

              {/* Icon & Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Service Icon */}
                    {level === 0 && item.icon && (
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                        style={{ backgroundColor: colors.bg }}
                      >
                        {item.icon}
                      </div>
                    )}

                    {/* Name & Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold ${level === 0 ? "text-base" : "text-sm"} text-slate-800`}>
                          {item.name}
                        </h4>

                        {/* Level badge */}
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}
                        >
                          L{level}
                        </span>
                      </div>

                      {/* Meta info */}
                      {hasChildren && (
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Layers3 className="h-3 w-3" />
                            {children.length} items
                          </span>

                          {level === 0 && (
                            <span className="text-[10px]">
                              {countTotalChildren(item)} nested items
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(item.id)}
                    className={`
                      flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 flex-shrink-0
                      text-xs font-bold transition-all
                      ${isActive ? "shadow-lg hover:shadow-xl" : "hover:scale-105"}
                    `}
                    style={{
                      borderColor: isActive ? colors.border : "#e5e7eb",
                      backgroundColor: isActive ? colors.bg : "white",
                      color: isActive ? colors.text : "#64748b",
                      boxShadow: isActive ? `0 0 20px ${colors.glow}` : undefined,
                    }}
                  >
                    {isActive ? (
                      <>
                        <Zap className="h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 opacity-50" />
                        Inactive
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active indicator glow */}
          {isActive && (
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background: `linear-gradient(to right, ${colors.glow}, ${colors.text}, ${colors.glow})`,
                boxShadow: `0 0 10px ${colors.glow}`,
              }}
            />
          )}
        </motion.div>

        {/* Render children recursively */}
        {isExpanded && hasChildren && (
          <div className="relative ml-6 mt-2 space-y-2 border-l-2 border-dashed border-slate-200 pl-4">
            {children.map((child) => renderServiceItem(child, level + 1, color))}
          </div>
        )}
      </div>
    );
  };

  const handleSave = () => {
    store.setActiveServices(activeIds);
    store.setExpandedServices(expandedIds);
    toast.success(`✓ ${activeIds.length} services activated!`);
    nextStep();
  };

  const totalActive = activeIds.length;
  const totalServices = services.reduce((acc, s) => acc + 1 + countTotalChildren(s), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-xl bg-emerald-50 px-4 py-2 border-2 border-emerald-200">
          <div className="text-xs font-medium text-emerald-600">Active Services</div>
          <div className="text-2xl font-black text-emerald-700">{totalActive}</div>
        </div>
        <div className="rounded-xl bg-violet-50 px-4 py-2 border-2 border-violet-200">
          <div className="text-xs font-medium text-violet-600">Total Services</div>
          <div className="text-2xl font-black text-violet-700">{totalServices}</div>
        </div>
        <div className="rounded-xl bg-cyan-50 px-4 py-2 border-2 border-cyan-200">
          <div className="text-xs font-medium text-cyan-600">Expanded</div>
          <div className="text-2xl font-black text-cyan-700">{expandedIds.length}</div>
        </div>
      </div>

      {/* Info */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
        <GripVertical className="h-4 w-4" />
        <span className="font-medium">
          Drag any service to reorder • Click chevron to expand/collapse • Click status badge to toggle
        </span>
      </div>

      {/* Service Tree */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-lg rounded-3xl p-6">
        <div className="space-y-4">
          {services.map((service) => renderServiceItem(service))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
        >
          Save & Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
