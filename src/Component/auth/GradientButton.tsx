import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type GradientButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"button">, "children">;

export function GradientButton({
  children,
  icon,
  className = "",
  disabled,
  type = "submit",
  ...props
}: GradientButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      className={`relative isolate w-full overflow-hidden rounded-xl py-3.5 text-base font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #06b6d4 100%)" }}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.35), transparent)",
        }}
      />
      <span className="relative z-[1] flex items-center justify-center gap-2">
        {children}
        {icon}
      </span>
    </motion.button>
  );
}
