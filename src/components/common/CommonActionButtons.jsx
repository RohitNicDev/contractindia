import {
  Eye,
  CheckCircle,
  XCircle,
  Phone,
} from "lucide-react";

export default function CommonActionButtons({
  row,
  onAction,
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onAction("view", row)}
        className="action-btn view"
      >
        <Eye size={14} />
        View
      </button>

      <button
        onClick={() => onAction("verify", row)}
        disabled={row.Status === "Verified"}
        className="action-btn verify"
      >
        <CheckCircle size={14} />
        Verify
      </button>

      <button
        onClick={() => onAction("reject", row)}
        disabled={row.Status === "Rejected"}
        className="action-btn reject"
      >
        <XCircle size={14} />
        Reject
      </button>

      <button
        onClick={() => onAction("call", row)}
        className="action-btn call"
      >
        <Phone size={14} />
        Call
      </button>
    </div>
  );
}