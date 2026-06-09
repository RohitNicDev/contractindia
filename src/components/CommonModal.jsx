/**
 * CommonModal — universal modal component
 *
 * Replaces ServiceFormModal + DeleteConfirmModal and covers any future modal need.
 *
 * Usage examples at the bottom of this file.
 *
 * Props:
 *  isOpen        boolean                  — controls visibility
 *  onClose       () => void               — called on backdrop click or X button
 *  title         string                   — modal header title
 *  subtitle      string?                  — small muted line below title
 *  icon          ReactNode?               — icon shown in the header circle
 *  variant       "default"|"danger"|"success"|"warning"|"info"  — controls gradient + accent
 *  size          "sm"|"md"|"lg"|"xl"      — max-width of the panel
 *  hideCloseBtn  boolean?                 — hide the X button
 *  children      ReactNode                — modal body
 *  footer        ReactNode?               — custom footer; if omitted the built-in
 *                                           confirm/cancel row renders via the
 *                                           confirmLabel / cancelLabel / onConfirm props
 *  confirmLabel  string?                  — text for the primary action button
 *  cancelLabel   string?                  — text for the cancel button (default "Cancel")
 *  onConfirm     () => void?              — primary action handler
 *  isLoading     boolean?                 — shows spinner on confirm button
 *  hideFooter    boolean?                 — render body only, no footer at all
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

/* ── variant map ───────────────────────────────────────────────────────────── */
const VARIANTS = {
  default: {
    gradient: "from-violet-600 to-fuchsia-600",
    confirmBtn: "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-200",
  },
  danger: {
    gradient: "from-red-500 to-rose-600",
    confirmBtn: "bg-gradient-to-r from-red-500 to-rose-600 shadow-rose-200",
  },
  success: {
    gradient: "from-emerald-500 to-teal-600",
    confirmBtn: "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-200",
  },
  warning: {
    gradient: "from-amber-500 to-orange-500",
    confirmBtn: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-200",
  },
  info: {
    gradient: "from-sky-500 to-blue-600",
    confirmBtn: "bg-gradient-to-r from-sky-500 to-blue-600 shadow-sky-200",
  },
};

/* ── size map ──────────────────────────────────────────────────────────────── */
const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/* ========================================================================== */
export function CommonModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  variant = "default",
  size = "md",
  hideCloseBtn = false,
  children,
  footer,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  hideFooter = false,
}) {
  const { gradient, confirmBtn } = VARIANTS[variant] ?? VARIANTS.default;
  const sizeClass = SIZES[size] ?? SIZES.md;

  /* close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── backdrop ── */}
          <motion.div
            key="cm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ── panel ── */}
          <motion.div
            key="cm-panel"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-full ${sizeClass} max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200/70 overflow-hidden`}
            >
              {/* ── header ── */}
              <div className={`bg-gradient-to-r ${gradient} px-5 py-4 flex-shrink-0`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {icon && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                        {icon}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="text-sm font-extrabold text-white truncate">{title}</h2>
                      {subtitle && (
                        <p className="text-[11px] text-white/70 mt-0.5 truncate">{subtitle}</p>
                      )}
                    </div>
                  </div>
                  {!hideCloseBtn && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* ── body ── */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {children}
              </div>

              {/* ── footer ── */}
              {!hideFooter && (
                <div className="flex-shrink-0 border-t border-slate-100 px-5 py-4 flex items-center justify-end gap-2 bg-white">
                  {footer ?? (
                    <>
                      <button
                        type="button"
                        onClick={onClose}
                        className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        {cancelLabel}
                      </button>
                      {onConfirm && (
                        <button
                          type="button"
                          onClick={onConfirm}
                          disabled={isLoading}
                          className={`flex h-9 items-center gap-1.5 rounded-xl ${confirmBtn} px-5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                          {confirmLabel}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CommonModal;


/* ==========================================================================
   SECTION HELPERS  (re-exported so forms stay clean)
   ========================================================================== */

/** Labelled section with an icon + title divider */
export function ModalSection({ label, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/** Labelled form field wrapper */
export function ModalField({ label, children, span }) {
  return (
    <div className={span === "full" ? "sm:col-span-2" : ""}>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

/** Shared input style injected once at app level — or import this style tag anywhere */
export function ModalInputStyles() {
  return (
    <style>{`
      .modal-input {
        width: 100%;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        padding: 7px 12px;
        font-size: 12px;
        color: #0f172a;
        outline: none;
        transition: border-color .15s, background .15s;
      }
      .modal-input:focus {
        border-color: #a78bfa;
        background: #fff;
      }
    `}</style>
  );
}


/* ==========================================================================
   USAGE EXAMPLES
   ==========================================================================

   ── 1. Confirmation / delete modal ──────────────────────────────────────────

   import { CommonModal } from "@/components/CommonModal";
   import { Trash2 } from "lucide-react";

   <CommonModal
     isOpen={deleteModal.open}
     onClose={closeDelete}
     title="Delete service"
     subtitle="This action cannot be undone"
     icon={<Trash2 className="h-4 w-4" />}
     variant="danger"
     size="sm"
     confirmLabel="Delete"
     cancelLabel="Cancel"
     onConfirm={handleConfirmDelete}
     isLoading={isDeleting}
   >
     <p className="text-sm text-slate-600">
       Are you sure you want to delete{" "}
       <span className="font-bold text-slate-900">"{nodeName}"</span>?
       All child services will also be removed.
     </p>
   </CommonModal>


   ── 2. Form modal (service add / edit) ──────────────────────────────────────

   import { CommonModal, ModalSection, ModalField, ModalInputStyles } from "@/components/CommonModal";
   import { Tag, Plus, Pencil, Check, Loader2 } from "lucide-react";

   <CommonModal
     isOpen={modal.open}
     onClose={closeModal}
     title={mode === "edit" ? `Edit — "${parentName}"` : "Add root service"}
     subtitle={mode === "addChild" ? "Nested under selected parent" : undefined}
     icon={mode === "edit" ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
     variant={mode === "edit" ? "warning" : "default"}
     size="md"
     confirmLabel={mode === "edit" ? "Save changes" : "Create service"}
     onConfirm={handleSubmit}
     isLoading={isSaving || isUpdating}
   >
     <ModalInputStyles />
     <ModalSection label="Basic information" icon={<Tag className="h-3.5 w-3.5" />}>
       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
         <ModalField label="Service name *" span="full">
           <input
             value={form.serviceName}
             onChange={(e) => set("serviceName", e.target.value)}
             placeholder="e.g. EPC Consultancy"
             className="modal-input"
           />
         </ModalField>
         <ModalField label="Service code">
           <input
             value={form.serviceCode}
             onChange={(e) => set("serviceCode", e.target.value)}
             placeholder="e.g. EPC-001"
             className="modal-input"
           />
         </ModalField>
       </div>
     </ModalSection>
   </CommonModal>


   ── 3. Custom footer ─────────────────────────────────────────────────────────

   <CommonModal
     isOpen={open}
     onClose={close}
     title="Preview"
     variant="info"
     size="lg"
     footer={
       <div className="flex w-full items-center justify-between">
         <span className="text-xs text-slate-400">Step 2 of 3</span>
         <div className="flex gap-2">
           <button onClick={back} className="h-9 px-4 rounded-xl border text-xs font-bold">Back</button>
           <button onClick={next} className="h-9 px-5 rounded-xl bg-sky-600 text-white text-xs font-bold">Next</button>
         </div>
       </div>
     }
   >
     <p>Modal with a fully custom footer.</p>
   </CommonModal>


   ── 4. Body-only (no footer) ─────────────────────────────────────────────────

   <CommonModal
     isOpen={open}
     onClose={close}
     title="Image preview"
     variant="default"
     size="xl"
     hideFooter
   >
     <img src={previewUrl} className="w-full rounded-xl" />
   </CommonModal>

   ========================================================================== */