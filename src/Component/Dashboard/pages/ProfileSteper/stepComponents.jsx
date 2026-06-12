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
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { userBankDetailSave, userBasicInformationSave } from "../../../../services/api";
 

export function Step1CompanyType({ store, nextStep }) {
  const companyTypes = [
    { id: "proprietor", label: "Proprietor", desc: "Single owner business" },
    {
      id: "partnership",
      label: "Partnership",
      desc: "Joint commercial venture",
    },
    {
      id: "private_limited",
      label: "Private Limited",
      desc: "PvT Ltd corporate structure",
    },
    {
      id: "public_limited",
      label: "Public Limited",
      desc: "Publicly listed enterprise",
    },
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
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-200 shadow-md"
                  : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div
                  className={`p-2 rounded-lg border ${
                    isSelected
                      ? "bg-blue-50 border-blue-100 text-blue-600"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected
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

export function Step2BasicInfo({ store, nextStep, prevStep, triggerOtpSend }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: store.basicInfo });

  const onSaveStep2 = async (data) => {
    try {
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
      };

      await userBasicInformationSave(payload);
      store.setBasicInfo(data);
      message.success("Basic Info saved successfully!");
      nextStep();
    } catch (err) {
      message.error("Failed to save basic information. Please try again.");
    }
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
              className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                store.basicInfo.emailVerified
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {store.basicInfo.emailVerified ? "Verified âœ“" : "Verify OTP"}
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
              className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                store.basicInfo.mobileVerified
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {store.basicInfo.mobileVerified ? "Verified âœ“" : "Verify OTP"}
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
          className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
        >
          Save & Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
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
    defaultValues: {
      gstNo: store.registrationDetails.gstNo,
      panNo: store.registrationDetails.panNo,
      cinNo: store.registrationDetails.cinNo,
      aadharNo: store.registrationDetails.aadharNo,
      pfNo: store.registrationDetails.pfNo,
      esiNo: store.registrationDetails.esiNo,
      msmeNo: store.registrationDetails.msmeNo,
      udyogAadhaarToggle: store.registrationDetails.udyogAadhaarToggle,
    },
  });

  const onSaveStep3 = async (data) => {
    store.setRegistrationDetails(data);
    message.success("Registration & Compliance details saved!");
    nextStep();
  };

  return (
    <form onSubmit={handleSubmitStep3(onSaveStep3)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 border-b border-slate-100 pb-2">
            SECTION A â€” Registration Details
          </h4>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              GST Number
            </label>
            <input
              type="text"
              placeholder="e.g. 07AAAAA1111A1Z1"
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...registerStep3("gstNo", {
                pattern: {
                  value:
                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
                  message: "Invalid GSTIN format",
                },
              })}
            />
            {errorsStep3.gstNo && (
              <span className="text-red-500 text-[10px]">
                {errorsStep3.gstNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              State PAN NO.
            </label>
            <input
              type="text"
              placeholder="e.g. ABCDE1234F"
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...registerStep3("panNo", {
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Invalid PAN format",
                },
              })}
            />
            {errorsStep3.panNo && (
              <span className="text-red-500 text-[10px]">
                {errorsStep3.panNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              CIN Number
            </label>
            <input
              type="text"
              placeholder="e.g. L27020MH1919PLC000540"
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...registerStep3("cinNo")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Aadhaar Number
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789012"
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...registerStep3("aadharNo", {
                pattern: {
                  value: /^\d{12}$/,
                  message: "Aadhaar must be 12 digits",
                },
              })}
            />
            {errorsStep3.aadharNo && (
              <span className="text-red-500 text-[10px]">
                {errorsStep3.aadharNo.message}
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 border-b border-slate-100 pb-2">
            SECTION B â€” Additional Compliance
          </h4>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Provident Fund Account No.
            </label>
            <input
              type="text"
              placeholder="e.g. MHBAN1234567000"
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...registerStep3("pfNo")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              ESI Number
            </label>
            <input
              type="text"
              placeholder="e.g. 31000123450001001"
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
              {...registerStep3("esiNo")}
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100 mt-2">
            <span className="text-[11px] font-bold text-slate-600">
              MSME (Y/N)
            </span>
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Udyog Aadhaar / Registration
              </label>
              <input
                type="text"
                placeholder="e.g. UDYAM-MH-01-0012345"
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 text-slate-800 placeholder-slate-400 shadow-sm"
                {...registerStep3("msmeNo")}
              />
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
          Save & Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export function Step4Documents({ store, nextStep, prevStep }) {
  const [selectedDocType, setSelectedDocType] = useState({
    businessRegistration: "GST Certificate",
    identityAddress: "PAN Card",
    complianceCertificates: "Bank Certificate",
    otherDocuments: "Company Profile",
  });
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      uploadCategoryFiles(files, category);
    }
  };

  const uploadCategoryFiles = (files, category) => {
    const type = selectedDocType[category];
    const existingSections = [...(store.documents[category] || [])];
    let section = existingSections.find((s) => s.type === type);
    if (!section) {
      section = { type, files: [] };
      existingSections.push(section);
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        message.error(`File ${file.name} exceeds 5MB size limit.`);
        return;
      }
      const fileObj = { name: file.name, size: file.size, progress: 0 };
      section.files.push(fileObj);
      let prog = 0;
      const interval = setInterval(() => {
        prog += 25;
        fileObj.progress = prog;
        store.setDocuments(category, [...existingSections]);
        if (prog >= 100) clearInterval(interval);
      }, 250);
    });
  };

  const removeCategoryFile = (category, sectionIndex, fileIndex) => {
    const existingSections = [...(store.documents[category] || [])];
    const section = existingSections[sectionIndex];
    section.files = section.files.filter((_, idx) => idx !== fileIndex);
    const filteredSections =
      section.files.length === 0
        ? existingSections.filter((_, idx) => idx !== sectionIndex)
        : existingSections;
    store.setDocuments(category, filteredSections);
    message.success("Document removed successfully.");
  };

  const categories = [
    {
      id: "businessRegistration",
      label: "Business Registration",
      options: [
        "GST Certificate",
        "Incorporation Certificate",
        "Trade License",
        "Shop Act",
      ],
    },
    {
      id: "identityAddress",
      label: "Identity & Address Proof",
      options: ["PAN Card", "Aadhaar Card", "Utility Bill", "Passport"],
    },
    {
      id: "complianceCertificates",
      label: "Compliance Certificates",
      options: ["ISO Certificates", "Labour License", "Cancelled Cheque"],
    },
    {
      id: "otherDocuments",
      label: "Other Enterprise Documents",
      options: [
        "Company Brochure",
        "NOC Certificate",
        "Audit Reports",
        "Others",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <p className="text-xs text-slate-500">
          Upload your commercial validation documents. Each section represents a
          different compliance category.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const uploadedSections = store.documents[cat.id] || [];
            const totalFilesCount = uploadedSections.reduce(
              (a, b) => a + b.files.length,
              0,
            );

            return (
              <div
                key={cat.id}
                className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 font-bold">
                    {cat.label}
                  </h4>
                  {totalFilesCount > 0 && (
                    <span className="text-[10px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full text-blue-600 font-bold shadow-sm">
                      {totalFilesCount} File(s)
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedDocType[cat.id]}
                    onChange={(e) =>
                      setSelectedDocType((prev) => ({
                        ...prev,
                        [cat.id]: e.target.value,
                      }))
                    }
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 flex-1 focus:outline-none focus:border-blue-400 shadow-sm"
                  >
                    {cat.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={(e) => handleDrop(e, cat.id)}
                  className={`relative py-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-white ${
                    dragActive
                      ? "border-blue-400 bg-blue-50/30"
                      : "border-slate-200 hover:border-blue-400/80"
                  }`}
                >
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files)
                        uploadCategoryFiles(Array.from(e.target.files), cat.id);
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

                {uploadedSections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-2 mt-2">
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-purple-600">
                      {sec.type}
                    </h5>
                    {sec.files.map((file, fileIdx) => (
                      <div
                        key={fileIdx}
                        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate text-slate-700 font-medium">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {file.progress < 100 ? (
                            <span className="text-[10px] text-purple-600 font-mono">
                              {file.progress}%
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                removeCategoryFile(cat.id, secIdx, fileIdx)
                              }
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
    </div>
  );
}

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

  const watchIfsc = watch("ifscCode") || "";
  const detectedBank = getBankLogo(watchIfsc);

  const onSaveStep4 = async (data) => {
    try {
      const payload = {
        bankDetailID: 0,
        userID: 0,
        bankName: data.bankName || "",
        accountNo: data.accountNumber || "",
        ifsc: data.ifscCode || "",
        micr: data.micrCode || "",
        isPrimaryAccount: 1,
        isActive: 1,
      };
      await userBankDetailSave(payload);
      store.setBankingDetails(data);
      message.success("Banking Details saved!");
      nextStep();
    } catch (err) {
      message.error("Failed to save banking details. Please try again.");
    }
  };

  const handleFinish = () => {
    if (progress < 45) {
      message.error(
        "You need at least 45% profile completion to save and finish.",
      );
      return;
    }
    store.setIsSkipped(true);
    message.success(
      "Congratulations! Your commercial profile is completed. Dashboard unlocked!",
    );
    navigation("/commercial/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSaveStep4)} className="space-y-6">
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
              {...register("bankName", { required: "Bank Name is required" })}
            />
            {errors.bankName && (
              <span className="text-red-500 text-[10px]">
                {errors.bankName.message}
              </span>
            )}

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
          className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
        >
          Save & Continue <Check className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
