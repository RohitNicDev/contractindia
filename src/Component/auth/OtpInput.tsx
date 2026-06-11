import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";

type OtpInputProps = {
  length?: number;
  onCodeChange?: (code: string) => void;
  disabled?: boolean;
  compact?: boolean;
};

export function OtpInput({ length = 6, onCodeChange, disabled, compact }: OtpInputProps) {
  const dense = Boolean(compact);
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const emit = (next: string[]) => {
    setDigits(next);
    onCodeChange?.(next.join(""));
  };

  const focusAt = (i: number) => {
    const el = inputsRef.current[Math.max(0, Math.min(i, length - 1))];
    el?.focus();
    el?.select();
  };

  const handleChange = (index: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(-1);
    if (!v) {
      const next = [...digits];
      next[index] = "";
      emit(next);
      return;
    }
    const next = [...digits];
    next[index] = v;
    emit(next);
    if (index < length - 1) focusAt(index + 1);
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        emit(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        emit(next);
        focusAt(index - 1);
      }
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && index > 0) focusAt(index - 1);
    if (e.key === "ArrowRight" && index < length - 1) focusAt(index + 1);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    const next = [...digits];
    for (let i = 0; i < length; i++) next[i] = text[i] ?? "";
    emit(next);
    focusAt(Math.min(text.length, length) - 1);
  };

  return (
    <div className={`flex justify-center ${dense ? "gap-1.5" : "gap-2 sm:gap-3"}`}>
      {digits.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <input
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
            className={`rounded-lg border-2 text-center font-black text-[var(--auth-text-input)] outline-none transition-all focus:border-[var(--auth-input-border-focus)] focus:ring-1 focus:ring-[var(--auth-input-ring)] ${dense ? "h-10 w-9 text-base" : "h-12 w-10 text-lg sm:h-14 sm:w-12 sm:text-xl"}`}
            style={{
              background: "var(--auth-field-bg)",
              borderColor: "var(--auth-input-border)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
