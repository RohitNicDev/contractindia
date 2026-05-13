import React from "react";
import { Link } from "react-router-dom";
import {  useScroll, useTransform } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);
  const cardY = useTransform(scrollY, [0, 600], [0, -30]);
  const onSubmit = () => {};

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
      <motion.div style={{ y: bgY }} className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -left-12 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      </motion.div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid w-full items-center gap-10 lg:grid-cols-2"
        >
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Welcome Back
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Sign in to your
              <span className="bg-linear-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                {" "}
                ContractsIndia™
              </span>
            </h1>
            <p className="mt-5 max-w-md text-slate-200">
              Manage projects, and verified partners from one animated
              dashboard experience.
            </p>
          </div>

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-3xl border border-white/20 bg-white p-8 text-slate-800 shadow-2xl backdrop-blur-sm"
          >
            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Sign in</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-600">
                  Email
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="you@company.com"
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
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-600">
                  Password
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    placeholder="********"
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
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 font-bold text-white shadow-lg transition-colors hover:bg-blue-800"
              >
                Sign in <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New user?{" "}
              <Link to="/registration" className="font-bold text-blue-700 hover:text-blue-800">
                Create account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
