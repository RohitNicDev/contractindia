import { motion } from "framer-motion";

export function AuthCard({ children, className = "", ...motionProps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
