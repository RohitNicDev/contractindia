import { motion } from "framer-motion";

type ChipMultiSelectProps = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  compact?: boolean;
};

export function ChipMultiSelect({
  options,
  value,
  onChange,
  error,
  compact,
}: ChipMultiSelectProps) {
  const dense = Boolean(compact);
  const toggle = (item: string) => {
    const exists = value.includes(item);
    onChange(exists ? value.filter((v) => v !== item) : [...value, item]);
  };

  return (
    <div className="w-full min-w-0">
      <p
        className={`mb-1 font-semibold text-[var(--auth-label)] ${dense ? "text-[11px] uppercase tracking-wide" : "mb-2 block text-sm"}`}
      >
        Sub-services <span className="font-normal normal-case text-[var(--auth-text-muted)]">(pick one+)</span>
      </p>
      <div
        className={`rounded-lg border-2 border-[var(--auth-input-border)] bg-[var(--auth-field-bg)] ${dense ? "grid grid-cols-2 gap-1 p-1.5 sm:grid-cols-4" : "flex min-h-[3.5rem] flex-wrap gap-2 p-3"}`}
      >
        {options.length === 0 ? (
          <span
            className={`col-span-full font-medium text-[var(--auth-text-muted)] ${dense ? "py-1 text-center text-[11px]" : "self-center text-sm"}`}
          >
            Choose a category above.
          </span>
        ) : (
          options.map((item, i) => {
            const active = value.includes(item);
            return (
              <motion.button
                key={item}
                type="button"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: dense ? 0 : i * 0.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(item)}
                className={`rounded-md border-2 font-semibold transition-colors ${dense ? "px-1.5 py-1 text-[10px] leading-tight sm:text-[11px]" : "px-3 py-2 text-sm"}`}
                style={{
                  background: active ? "var(--auth-chip-active-bg)" : "var(--auth-chip-inactive-bg)",
                  borderColor: active ? "var(--auth-chip-active-bg)" : "var(--auth-chip-inactive-border)",
                  color: active ? "var(--auth-chip-active-fg)" : "var(--auth-text-input)",
                }}
              >
                {item}
              </motion.button>
            );
          })
        )}
      </div>
      {error ? (
        <p
          className={`font-medium text-[var(--auth-error)] ${dense ? "mt-0.5 text-[11px]" : "mt-2 text-sm"}`}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
