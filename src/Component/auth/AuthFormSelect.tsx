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
import { ChevronDown, Check, Search, X } from "lucide-react";
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
    if (Array.isArray(nodes)) { nodes.forEach(traverse); return; }
    if (typeof nodes !== "object") return;

    const el = nodes as ReactElement<{ value?: string; children?: React.ReactNode }>;

    if (el.type === "option") {
      const val = String(el.props.value ?? "");
      const lbl = typeof el.props.children === "string" ? el.props.children : val;
      opts.push({ value: val, label: lbl });
      return;
    }

    if (el.props?.children) traverse(el.props.children);
  }

  traverse(children);
  return opts;
}

type DropdownPos = { top: number; left: number; width: number; openUp: boolean };

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
    const [dropPos, setDropPos] = useState<DropdownPos>({ top: 0, left: 0, width: 0, openUp: false });
    const [search, setSearch] = useState("");

    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Sync controlled value from outside (RHF reset / watch)
    useEffect(() => {
      if (value !== undefined) setSelected(String(value));
    }, [value]);

    // Recalculate position (called on open and on window scroll/resize)
    const calcPosition = useCallback(() => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const PANEL_HEIGHT = 280; // max expected height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < PANEL_HEIGHT && spaceAbove > spaceBelow;

      setDropPos({
        top: openUp
          ? rect.top + window.scrollY - PANEL_HEIGHT - 4
          : rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        openUp,
      });
    }, []);

    const openDropdown = useCallback(() => {
      if (disabled) return;
      calcPosition();
      setOpen(true);
      setSearch("");
      // Focus search input after dropdown renders
      setTimeout(() => searchRef.current?.focus(), 50);
    }, [disabled, calcPosition]);

    // Close only on outside click — NOT on scroll
    useEffect(() => {
      if (!open) return;

      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          triggerRef.current?.contains(target) ||
          panelRef.current?.contains(target)
        ) return;
        setOpen(false);
      };

      // Reposition (don't close) on scroll
      const handleScroll = (e: Event) => {
        // If scroll happens inside the panel itself, do nothing
        if (panelRef.current?.contains(e.target as Node)) return;
        calcPosition();
      };

      // Close on resize (layout shift)
      const handleResize = () => setOpen(false);

      document.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }, [open, calcPosition]);

    // Keyboard navigation
    useEffect(() => {
      if (!open) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }, [open]);

    const filteredOptions = options.filter(
      (o) =>
        o.value !== "" &&
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedLabel = options.find((o) => o.value === selected)?.label ?? "";
    const placeholder = options.find((o) => o.value === "")?.label ?? `${label}…`;
    const isPlaceholder = !selected;

    const handleSelect = useCallback(
      (val: string) => {
        setSelected(val);
        setOpen(false);
        setSearch("");
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
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: dropPos.openUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropPos.openUp ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: dropPos.top,
              left: dropPos.left,
              width: dropPos.width,
              zIndex: 9999,
            }}
            className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-[0_8px_32px_rgba(99,102,241,0.18),0_2px_8px_rgba(0,0,0,0.10)]"
          >
            {/* Search bar */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="flex-1 bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 outline-none"
                // Prevent the select from closing when typing
                onMouseDown={(e) => e.stopPropagation()}
              />
              {search && (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setSearch(""); searchRef.current?.focus(); }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Options list — scrollable, won't close dropdown */}
            <ul
              role="listbox"
              aria-label={label}
              className="max-h-52 overflow-y-auto [scrollbar-width:thin]"
              // Stop scroll events from bubbling to window (prevents repositioning loop)
              onScroll={(e) => e.stopPropagation()}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-3 text-center text-xs text-slate-400">
                  No results for "{search}"
                </li>
              ) : (
                filteredOptions.map((opt) => {
                  const isActive = opt.value === selected;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={(e) => {
                        e.preventDefault();
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
                })
              )}
            </ul>
          </motion.div>
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