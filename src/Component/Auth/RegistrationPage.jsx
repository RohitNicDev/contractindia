import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Building2, Phone, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import registrationConfig from "../../data/registrationConfig.json";

const fieldAnimation = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.35, ease: "easeOut" },
};

const RegistrationPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subServices: [],
    },
  });
  const selectedState = watch("state");
  const selectedServiceGroup = watch("serviceGroup");
  const selectedSubServices = watch("subServices") || [];

  const cityOptions = useMemo(() => {
    const stateObj = registrationConfig.states.find(
      (item) => item.value === selectedState,
    );
    return stateObj?.cities || [];
  }, [selectedState]);

  const subServiceOptions = useMemo(() => {
    const group = registrationConfig.serviceGroups.find(
      (item) => item.value === selectedServiceGroup,
    );
    return group?.subServices || [];
  }, [selectedServiceGroup]);

  useEffect(() => {
    setValue("subServices", []);
  }, [selectedServiceGroup, setValue]);

  const toggleSubService = (item) => {
    const exists = selectedSubServices.includes(item);
    const updated = exists
      ? selectedSubServices.filter((v) => v !== item)
      : [...selectedSubServices, item];
    setValue("subServices", updated, { shouldValidate: true });
  };

  const onSubmit = (values) => {
    localStorage.setItem("registration_form_v1", JSON.stringify(values));
  };

  return (
    <div className="min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-blue-950 to-slate-900 px-6 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Registration
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Build your
            <span className="bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              {" "}
              business profile
            </span>
          </h1>
      
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/20 bg-white p-8 shadow-2xl"
        >
          <h2 className="mb-6 text-3xl font-black text-slate-900">Create account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                Full Name
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                <User className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rohit Kumar"
                  {...register("fullName", { required: "Full name is required" })}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                Business Name
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Building2 className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Skyline Infra Pvt Ltd"
                  {...register("businessName", {
                    required: "Business name is required",
                  })}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
              {errors.businessName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.businessName.message}
                </p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                Email
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                Phone
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9+\-\s]{10,14}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                Company Type
              </label>
              <select
                {...register("companyType", { required: "Company type is required" })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none"
              >
                <option value="">Select company type</option>
                {registrationConfig.companyTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              {errors.companyType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyType.message}
                </p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                State
              </label>
              <select
                {...register("state", { required: "State is required" })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none"
              >
                <option value="">Select state</option>
                {registrationConfig.states.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                City
              </label>
              <select
                {...register("city", { required: "City is required" })}
                disabled={!selectedState}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {selectedState ? "Select city" : "Select state first"}
                </option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                Service Category
              </label>
              <select
                {...register("serviceGroup", {
                  required: "Service category is required",
                })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none"
              >
                <option value="">Select service category</option>
                {registrationConfig.serviceGroups.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              {errors.serviceGroup && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.serviceGroup.message}
                </p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Sub Services (multi-select)
              </label>
              <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {subServiceOptions.length > 0 ? (
                  subServiceOptions.map((item) => {
                    const active = selectedSubServices.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSubService(item)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">Select service category first</p>
                )}
              </div>
              <input
                type="hidden"
                {...register("subServices", {
                  validate: (v) =>
                    (v && v.length > 0) || "Please select at least one sub service",
                })}
              />
              {errors.subServices && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.subServices.message}
                </p>
              )}
            </motion.div>

            <motion.div {...fieldAnimation}>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                Password
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Lock className="h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 font-bold text-white transition-colors hover:bg-blue-800"
            >
              Create account <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-700 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationPage;
