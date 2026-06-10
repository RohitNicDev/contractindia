import { AlertTriangle } from "lucide-react";
import VerifyAction from "./actions/VerifyAction";
import RejectAction from "./actions/RejectAction";
import ReviewAction from "./actions/ReviewAction";

/**
 * DynamicActionToBeTaken
 *
 * Resolves the correct action component from `data.actionType` (the "prompt"),
 * then renders it with the full location.state payload spread as props.
 *
 * Props
 * ─────────────────────────────────────────────────────────────────
 * data          object   — full location.state from ActionWrapperMain
 * applicationId string   — from URL params
 */

// Map of actionType string → component
const ACTION_MAP = {
  verify: VerifyAction,
  reject: RejectAction,
  review: ReviewAction,
};

export default function DynamicActionToBeTaken({ data, applicationId }) {
  const actionType = data?.actionType?.toLowerCase();
  const ActionComponent = ACTION_MAP[actionType];

  if (!ActionComponent) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-black text-amber-800 text-sm">Unknown Action Type</p>
          <p className="text-xs text-amber-700 mt-1">
            The action type{" "}
            <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded-md">
              {data?.actionType ?? "(none)"}
            </code>{" "}
            is not recognized. Valid types: <strong>verify</strong>, <strong>reject</strong>, <strong>review</strong>.
          </p>
          {data && (
            <details className="mt-3">
              <summary className="text-xs font-bold text-amber-600 cursor-pointer select-none">
                View received data
              </summary>
              <pre className="mt-2 text-[11px] bg-amber-100 rounded-xl p-3 overflow-x-auto text-amber-800 leading-relaxed">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Spread all location.state fields as props so each action component
  // can destructure exactly what it needs.
  return <ActionComponent applicationId={applicationId} {...data} />;
}
