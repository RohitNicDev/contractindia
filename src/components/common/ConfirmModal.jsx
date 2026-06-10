import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
export const ConfirmModal = ({
  action,
  user,
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const isVerify = action === "Verified";

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await onConfirm({
        reason,
      });

      if (response) {
        toast.success(
          `User ${isVerify ? "verified" : "rejected"} successfully`
        );
      }
    } catch (error) {
      toast.error(
        error?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex justify-center mb-4">
          {isVerify ? (
            <div className="rounded-2xl bg-emerald-100 p-3">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          ) : (
            <div className="rounded-2xl bg-red-100 p-3">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-center">
          {isVerify ? "Verify User" : "Reject User"}
        </h3>

        <p className="mt-2 text-center text-slate-500">
          Are you sure you want to {isVerify ? "verify" : "reject"}{" "}
          <strong>{user?.Name}</strong>?
        </p>

        {!isVerify && (
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="mt-4 w-full rounded-xl border p-3"
          />
        )}

        <div className="mt-6 flex gap-3">
          <button
            disabled={loading}
            onClick={onCancel}
            className="flex-1 rounded-xl border py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`flex-1 rounded-xl py-3 text-white ${
              isVerify ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              action
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
