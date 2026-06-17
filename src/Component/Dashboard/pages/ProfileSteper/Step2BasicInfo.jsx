import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "../../../../store/store";
import { userBasicInformationSave } from "../../../../services/api";

const Step2BasicInfo = ({ store, nextStep, prevStep, triggerOtpSend }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ defaultValues: store.basicInfo });

  useEffect(() => {
    reset(store.basicInfo);
  }, [store.basicInfo, reset]);

  const { loginResponce } = useUserStore();
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

      userId: loginResponce?.userId || 0,

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
            disabled
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
            {/* <button
              type="button"
              onClick={() => triggerOtpSend("email", watch("email"))}
              className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${store.basicInfo.emailVerified
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
            >
              {store.basicInfo.emailVerified ? "Verified ✓" : "Verify OTP"}
            </button>*/}
          </div>
          {/* {errors.email && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </span>
          )} */}
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
            {/* <button
              type="button"
              onClick={() => triggerOtpSend("mobile", watch("mobile"))}
              className={`px-4 rounded-xl font-bold text-xs border flex items-center justify-center shrink-0 shadow-sm transition-colors ${store.basicInfo.mobileVerified
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
            >
              {store.basicInfo.mobileVerified ? "Verified ✓" : "Verify OTP"}
            </button> */}
          </div>
          {/* {errors.mobile && (
            <span className="text-red-500 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.mobile.message}
            </span>
          )} */}
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
export default Step2BasicInfo;