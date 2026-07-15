import { useState, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  HelpCircle,
  Loader2,
  X,
} from "lucide-react";

/**
 * ConfirmModal - Universal confirmation dialog component
 * Supports multiple variants: verify, reject, delete, warning, info, custom
 * 
 * Usage examples:
 * 
 * 1. User Verification:
 *    <ConfirmModal
 *      isOpen={showModal}
 *      variant="verify"
 *      title="Verify User"
 *      message="Are you sure you want to verify {username}?"
 *      data={{ username: user.name }}
 *      onConfirm={handleVerify}
 *      onCancel={handleCancel}
 *    />
 * 
 * 2. Rejection with Reason:
 *    <ConfirmModal
 *      isOpen={showModal}
 *      variant="reject"
 *      title="Reject Application"
 *      message="Are you sure you want to reject this?"
 *      requireReason={true}
 *      onConfirm={handleReject}
 *      onCancel={handleCancel}
 *    />
 * 
 * 3. Dangerous Action (Delete):
 *    <ConfirmModal
 *      isOpen={showModal}
 *      variant="delete"
 *      title="Delete Contractor"
 *      message="This action cannot be undone. Are you sure?"
 *      actionLabel="Delete"
 *      onConfirm={handleDelete}
 *      onCancel={handleCancel}
 *    />
 * 
 * 4. Custom Confirmation:
 *    <ConfirmModal
 *      isOpen={showModal}
 *      variant="custom"
 *      title="View Details"
 *      message="You are about to view {name}'s details"
 *      data={{ name: "John" }}
 *      iconColor="blue"
 *      actionLabel="View"
 *      onConfirm={handleView}
 *      onCancel={handleCancel}
 *    />
 * 
 * 5. View Contractor Details:
 *    <ConfirmModal
 *      isOpen={showModal}
 *      variant="info"
 *      title="Confirm Action"
 *      message="View details for {contractor}?"
 *      data={{ contractor: item.CompanyName }}
 *      showDetails={item}
 *      onConfirm={handleConfirm}
 *      onCancel={handleCancel}
 *    />
 */
export const ConfirmModal = ({
  // Core
  isOpen = false,
  onConfirm,
  onCancel,
  
  // Content
  variant = "custom", // 'verify' | 'reject' | 'delete' | 'warning' | 'info' | 'custom'
  title,
  message,
  actionLabel,
  cancelLabel = "Cancel",
  
  // Dynamic data
  data = {}, // Object to interpolate in message/title {key}
  
  // Options
  requireReason = false, // For rejection variants
  reasonPlaceholder = "Enter reason...",
  reasonLabel = "Reason",
  showDetails = null, // Optional details card to display
  detailsFields = [], // [{label, value}]
  closeOnConfirm = true,
  autoClose = false, // Auto close on success (ms)
  
  // Styling
  size = "md", // 'sm' | 'md' | 'lg'
  iconColor, // Override icon color: 'emerald' | 'red' | 'amber' | 'blue' | 'slate'
  showCloseButton = true,
  allowClickOutside = true,
  
  // Callbacks
  onShowToast = true, // Show toast on success
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  // ─── Variant configuration ─────────────────────────────────────────
  const variantConfig = {
    verify: {
      icon: "check",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      actionColor: "bg-emerald-600 hover:bg-emerald-700",
      actionLabel: "Verify",
      toastMessage: (data) => `User verified successfully`,
    },
    reject: {
      icon: "x",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      actionColor: "bg-red-600 hover:bg-red-700",
      actionLabel: "Reject",
      toastMessage: (data) => `User rejected successfully`,
    },
    delete: {
      icon: "trash",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      actionColor: "bg-red-600 hover:bg-red-700",
      actionLabel: "Delete",
      toastMessage: (data) => `Deleted successfully`,
      requireConfirm: true,
    },
    warning: {
      icon: "alert",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      actionColor: "bg-amber-600 hover:bg-amber-700",
      actionLabel: "Confirm",
      toastMessage: (data) => `${data}`,
    },
    info: {
      icon: "help",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      actionColor: "bg-blue-600 hover:bg-blue-700",
      actionLabel: "Confirm",
      toastMessage: (data) => `Action confirmed`,
    },
    custom: {
      icon: "help",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      actionColor: "bg-slate-900 hover:bg-slate-800",
      actionLabel: "Confirm",
      toastMessage: (data) => `Action completed`,
    },
  };

  const config = { ...variantConfig[variant] };
  if (iconColor) {
    const colorMap = {
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      red: { bg: "bg-red-100", text: "text-red-600" },
      amber: { bg: "bg-amber-100", text: "text-amber-600" },
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      slate: { bg: "bg-slate-100", text: "text-slate-600" },
    };
    config.iconBg = colorMap[iconColor]?.bg || config.iconBg;
    config.iconColor = colorMap[iconColor]?.text || config.iconColor;
  }

  // ─── Interpolate dynamic data into message/title ─────────────────────
  const interpolate = (text) => {
    if (!text) return text;
    return text.replace(/{(\w+)}/g, (match, key) => data[key] || match);
  };

  const finalTitle = interpolate(title || config.actionLabel);
  const finalMessage = interpolate(message);
  const finalActionLabel = actionLabel || config.actionLabel;

  // ─── Icon renderer ─────────────────────────────────────────────────
  const renderIcon = () => {
    const iconProps = "h-8 w-8";
    switch (config.icon) {
      case "check":
        return <CheckCircle className={`${iconProps} ${config.iconColor}`} />;
      case "x":
        return <XCircle className={`${iconProps} ${config.iconColor}`} />;
      case "trash":
        return <Trash2 className={`${iconProps} ${config.iconColor}`} />;
      case "alert":
        return <AlertCircle className={`${iconProps} ${config.iconColor}`} />;
      case "help":
      default:
        return <HelpCircle className={`${iconProps} ${config.iconColor}`} />;
    }
  };

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    // Validate reason if required
    if (requireReason && !reason.trim()) {
      setError("Please enter a reason");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const payload = {
        reason: reason.trim() || undefined,
        ...data,
      };

      const response = await onConfirm?.(payload);

      if (response !== false) {
        if (onShowToast) {
          // toast.success(config.toastMessage(data));
        }

        if (autoClose) {
          setTimeout(() => {
            handleCancel();
          }, autoClose);
        } else if (closeOnConfirm) {
          handleCancel();
        }
      }
    } catch (err) {
      const errorMsg = err?.message || "Something went wrong";
      setError(errorMsg);
      if (onShowToast) {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [reason, data, onConfirm, onShowToast, closeOnConfirm, autoClose]);

  const handleCancel = useCallback(() => {
    setReason("");
    setError("");
    setLoading(false);
    onCancel?.();
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (allowClickOutside && e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // ─── Size configuration ────────────────────────────────────────────
  const sizeConfig = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full ${sizeConfig[size]} rounded-3xl bg-white p-6 shadow-2xl mx-4`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="flex justify-between items-start mb-4">
            <div className={`${config.iconBg} rounded-2xl p-3`}>
              {renderIcon()}
            </div>
            {showCloseButton && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {finalTitle}
          </h3>

          {/* Message */}
          {finalMessage && (
            <p className="text-slate-600 text-sm mb-4">
              {finalMessage}
            </p>
          )}

          {/* Details card (optional) */}
          {showDetails && (
            <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              {Array.isArray(showDetails) ? (
                showDetails.map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {detail.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {detail.value}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm font-semibold text-slate-800">
                  {showDetails}
                </div>
              )}
            </div>
          )}

          {/* Reason textarea (for rejection) */}
          {requireReason && (
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                {reasonLabel}
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError(""); // Clear error on input
                }}
                placeholder={reasonPlaceholder}
                disabled={loading}
                className={`w-full rounded-xl border p-3 text-sm placeholder-slate-400 transition-colors resize-none ${
                  error
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                } disabled:bg-slate-50 disabled:text-slate-500`}
              />
              {error && (
                <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>
              )}
            </div>
          )}

          {/* Error message (general) */}
          {error && !requireReason && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              disabled={loading}
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-slate-200 py-3 px-4 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className={`flex-1 rounded-xl py-3 px-4 font-bold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${config.actionColor}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                finalActionLabel
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;