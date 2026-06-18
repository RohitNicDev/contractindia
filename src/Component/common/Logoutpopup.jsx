import { useState } from "react";
import { LogOut, X, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

/* ============================================================
   USAGE
   ============================================================
   import LogoutPopup from "./LogoutPopup";

   const [open, setOpen] = useState(false);

   <button onClick={() => setOpen(true)}>Sign out</button>

   <LogoutPopup
     open={open}
     user={{ name: "Arjun Mehta", email: "arjun.mehta@company.com" }}
     onCancel={() => setOpen(false)}
     onConfirm={async () => {
       await yourAuthSignOut();   // call your auth logout here
       window.location.href = "/login";
     }}
   />
   ============================================================ */

/* ── Tiny avatar with initials ── */
function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    ?.map((w) => w[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();
  const colors = [
    ["#eef2ff", "#4338ca"],
    ["#f0fdf4", "#15803d"],
    ["#fdf4ff", "#9333ea"],
    ["#fff7ed", "#c2410c"],
    ["#eff6ff", "#1d4ed8"],
  ];
 const index = name
  ? name.charCodeAt(0) % colors.length
  : 0;

const [bg, fg] = colors[index];
  return (
    <span
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: bg,
        color: fg,
        fontSize: 13,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}

/* ── Main component ── */
export default function LogoutPopup({
  open = false,
  user = { name: "Jane Smith", email: "jane@company.com" },
  onCancel,
  onConfirm,
}) {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "done"

  if (!open) return null;

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      await onConfirm?.();
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  };

  const handleCancel = () => {
    setStatus("idle");
    onCancel?.();
  };

  /* ── Backdrop ── */
  return (
    <div
      onClick={(e) => { if (e?.target === e?.currentTarget) handleCancel(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-300/30 overflow-hidden">

        {/* ── Success state ── */}
        {status === "done" ? (
          <div className="flex flex-col items-center gap-3 px-8 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-base">Signed out successfully</p>
              <p className="text-xs text-slate-500 mt-1">Your session has been securely ended.</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Close button ── */}
            <button
              onClick={handleCancel}
              disabled={status === "loading"}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ── Top icon + heading ── */}
            <div className="flex flex-col items-center gap-3 px-8 pt-8 pb-5 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-base leading-tight">Sign out of your account?</h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  You'll need to sign back in to access your dashboard and saved data.
                </p>
              </div>
            </div>

            {/* ── User card ── */}
            <div className="mx-5 mb-5 flex items-center gap-3 bg-slate-50 rounded-2xl px-3.5 py-3 border border-slate-100">
              <Avatar name={user?.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <span className="flex-shrink-0 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>

            {/* ── Actions ── */}
            <div className="flex gap-2.5 px-5 pb-5">
              <button
                onClick={handleCancel}
                disabled={status === "loading"}
                className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={status === "loading"}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-red-200 disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing out…
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </>
                )}
              </button>
            </div>

            {/* ── Security note ── */}
            <div className="flex items-center justify-center gap-1.5 pb-5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Your session will be securely terminated
            </div>
          </>
        )}
      </div>
    </div>
  );
}