import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative w-full max-w-xl rounded-3xl p-8 sm:p-10"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/40 to-transparent opacity-60" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
