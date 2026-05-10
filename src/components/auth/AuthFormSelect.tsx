import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ComponentType,
  type SelectHTMLAttributes,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type AuthFormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  icon?: ComponentType<{ className?: string }>;
  compact?: boolean;
};

/** Extract { value, label } pairs from <option> children — handles nested arrays */
function parseOptions(children: React.ReactNode): { value: string; label: string }[] {
  const opts: { value: string; label: string }[] = [];

  function traverse(nodes: React.ReactNode) {
    if (nodes === null || nodes === undefined || typeof nodes === "boolean") return;

    // Flat array or React fragment children
    if (Array.isArray(nodes)) {
      nodes.forEach(traverse);
      return;
    }

    if (typeof nodes !== "object") return;

    const el = nodes as ReactElement<{ value?: string; children?: React.ReactNode }>;

    // It's an <option>
    if (el.type === "option") {
      const val = String(el.props.value ?? "");
      const lbl =
        typeof el.props.children === "string"
          ? el.props.children
          : val;
      opts.push({ value: val, label: lbl });
      return;
    }

    // It might be a fragment or wrapper — recurse into its children
    if (el.props?.children) {
      traverse(el.props.children);
    }
  }

  traverse(children);
  return opts;
}

type DropdownPos = { top: number; left: number; width: number };

export const AuthFormSelect = forwardRef<HTMLSelectElement, AuthFormSelectProps>(
  function AuthFormSelect(
    {
      label, error, icon: Icon, className = "", id,
      children, compact, disabled,
      onChange, value, defaultValue,
      ...props
    },
    ref,
  ) {
    const fieldId = id ?? `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const dense = Boolean(compact);
    const options = parseOptions(children);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string>(String(value ?? defaultValue ?? ""));
    const [dropPos, setDropPos] = useState<DropdownPos>({ top: 0, left: 0, width: 0 });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLUListElement>(null);

    // Sync controlled value from outside (RHF reset / watch)
    useEffect(() => {
      if (value !== undefined) setSelected(String(value));
    }, [value]);

    // Calculate portal position when opening
    const openDropdown = useCallback(() => {
      if (disabled) return;
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setDropPos({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      setOpen(true);
    }, [disabled]);

    // Close on outside click or scroll
    useEffect(() => {
      if (!open) return;
      const close = (e: MouseEvent) => {
        if (
          triggerRef.current?.contains(e.target as Node) ||
          panelRef.current?.contains(e.target as Node)
        ) return;
        setOpen(false);
      };
      const closeOnScroll = () => setOpen(false);
      document.addEventListener("mousedown", close);
      window.addEventListener("scroll", closeOnScroll, true);
      return () => {
        document.removeEventListener("mousedown", close);
        window.removeEventListener("scroll", closeOnScroll, true);
      };
    }, [open]);

    const selectedLabel = options.find((o) => o.value === selected)?.label ?? "";
    const placeholder = options.find((o) => o.value === "")?.label ?? `${label}…`;
    const isPlaceholder = !selected;

    const handleSelect = useCallback(
      (val: string) => {
        setSelected(val);
        setOpen(false);
        // Sync the hidden <select> value and fire RHF's onChange
        if (onChange) {
          const nativeEvent = {
            target: { value: val, name: props.name ?? "" },
            currentTarget: { value: val, name: props.name ?? "" },
            type: "change",
          } as unknown as React.ChangeEvent<HTMLSelectElement>;
          onChange(nativeEvent);
        }
      },
      [onChange, props.name],
    );

    const dropdownPanel = (
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={panelRef}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: dropPos.top,
              left: dropPos.left,
              width: dropPos.width,
              zIndex: 9999,
            }}
            className="
              overflow-hidden rounded-xl
              border border-indigo-100 bg-white
              shadow-[0_8px_32px_rgba(99,102,241,0.18),0_2px_8px_rgba(0,0,0,0.10)]
            "
          >
            <div className="max-h-52 overflow-y-auto [scrollbar-width:thin]">
              {options
                .filter((o) => o.value !== "")
                .map((opt) => {
                  const isActive = opt.value === selected;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent blur before click registers
                        handleSelect(opt.value);
                      }}
                      className={`
                        flex cursor-pointer select-none items-center gap-2.5 px-3
                        font-medium transition-colors duration-100
                        ${dense ? "py-1.5 text-xs" : "py-2 text-sm"}
                        ${isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                        }
                      `}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          isActive ? "bg-indigo-500" : "bg-slate-200"
                        }`}
                      />
                      <span className="flex-1 truncate">{opt.label}</span>
                      {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-indigo-500" />}
                    </li>
                  );
                })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    );

    return (
      <div className="w-full min-w-0">
        {/* Label */}
        <label
          htmlFor={fieldId}
          className={`mb-1 block font-semibold text-[var(--auth-label)] ${
            dense ? "text-[11px] uppercase tracking-wide" : "mb-2 text-sm"
          }`}
        >
          {label}
        </label>

        {/* Hidden native select — RHF registers this */}
        <select
          id={fieldId}
          ref={ref}
          value={selected}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            setSelected(e.target.value);
            onChange?.(e);
          }}
          {...props}
        >
          {children}
        </select>

        {/* Visible trigger button */}
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openDropdown())}
          className={`
            flex w-full items-center gap-1.5 rounded-lg border-2 px-2.5
            text-left transition-all duration-150
            disabled:cursor-not-allowed disabled:opacity-50
            ${dense ? "min-h-[2.35rem]" : "min-h-[3rem]"}
            ${error
              ? "border-[var(--auth-error)] bg-red-50/40"
              : open
              ? "border-[var(--auth-input-border-focus)] bg-white ring-2 ring-[var(--auth-input-ring)]"
              : "border-[var(--auth-input-border)] bg-[var(--auth-field-bg)] hover:border-indigo-300"
            }
          `}
        >
          {Icon && (
            <Icon
              className={`shrink-0 text-[var(--auth-icon-muted)] ${dense ? "h-3.5 w-3.5" : "h-5 w-5"}`}
              aria-hidden
            />
          )}
          <span
            className={`flex-1 truncate font-medium ${dense ? "text-sm" : "text-base"} ${
              isPlaceholder ? "text-[var(--auth-placeholder)]" : "text-[var(--auth-text-input)]"
            }`}
          >
            {isPlaceholder ? placeholder : selectedLabel}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[var(--auth-icon-muted)] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>

        {/* Portal — renders outside overflow containers */}
        {createPortal(dropdownPanel, document.body)}

        {/* Error */}
        {error && (
          <p
            className={`font-medium text-[var(--auth-error)] ${
              dense ? "mt-0.5 text-[11px] leading-tight" : "mt-1.5 text-sm"
            }`}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
