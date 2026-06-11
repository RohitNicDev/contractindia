import { motion } from "framer-motion";

const blobBase =
  "pointer-events-none absolute rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen";

export function AuthBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden auth-page-bg"
      aria-hidden
    >
      <div className="auth-grid-overlay absolute inset-0 opacity-40" />
      <div className="auth-noise-overlay absolute inset-0 opacity-50" />

      <motion.div
        className={`${blobBase} -left-[20%] top-[10%] h-[min(90vw,520px)] w-[min(90vw,520px)] animate-blob-drift`}
        style={{ background: "var(--auth-blob-1)" }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.32, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className={`${blobBase} right-[-15%] top-[20%] h-[min(85vw,480px)] w-[min(85vw,480px)] animate-blob-drift-slow`}
        style={{ background: "var(--auth-blob-2)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.28, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
      />
      <motion.div
        className={`${blobBase} bottom-[-10%] left-[25%] h-[min(80vw,440px)] w-[min(80vw,440px)] animate-blob-drift`}
        style={{ background: "var(--auth-blob-3)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.24 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div
        className={`${blobBase} bottom-[15%] right-[10%] h-[min(70vw,360px)] w-[min(70vw,360px)] animate-float`}
        style={{ background: "var(--auth-blob-4)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.22 }}
        transition={{ duration: 1.1, delay: 0.25 }}
      />
    </div>
  );
}
