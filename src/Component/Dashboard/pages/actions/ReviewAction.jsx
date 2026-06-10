import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, User, Mail, Phone, MapPin, Building2, FileText, MessageSquare, Send } from "lucide-react";

const REVIEW_TAGS = [
  "Needs more documents",
  "Contact required",
  "Pending background check",
  "Awaiting manager approval",
  "In legal review",
];

export default function ReviewAction({ applicationId, userRow, userTab }) {
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [priority, setPriority] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isCommercial = userTab === 2;

  const infoFields = [
    ...(isCommercial ? [{ label: "Company Name", value: userRow?.CompanyName, icon: Building2 }] : []),
    { label: "Name",     value: userRow?.Name,      icon: User   },
    { label: "Email",    value: userRow?.EmailId,   icon: Mail   },
    { label: "Mobile",   value: userRow?.MobileNo,  icon: Phone  },
    { label: "State",    value: userRow?.StateName, icon: MapPin },
    ...(isCommercial ? [{ label: "Service", value: userRow?.ServiceName, icon: FileText }] : []),
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim() && selectedTags.length === 0) {
      toast.error("Add at least one review note or tag.");
      return;
    }
    setLoading(true);
    try {
      // await reviewUserApi(applicationId, { notes, tags: selectedTags, priority });
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Review notes submitted successfully.");
      setDone(true);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Applicant summary */}
      <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
            <Eye className="w-3.5 h-3.5 text-white" />
          </span>
          <h4 className="font-black text-slate-800 text-sm">Applicant Details</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {infoFields.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-2.5 bg-white/70 rounded-xl p-3 border border-indigo-100/60">
              <Icon className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{value ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review form */}
      {!done ? (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <MessageSquare className="w-4 h-4 text-white" />
            </span>
            <div>
              <h3 className="font-black text-slate-900 text-base">Send for Review</h3>
              <p className="text-xs text-slate-500 mt-0.5">Add notes and flag this application for further review.</p>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">Priority</label>
            <div className="flex gap-2">
              {[
                { value: "low",    label: "Low",    color: "emerald" },
                { value: "normal", label: "Normal", color: "indigo"  },
                { value: "high",   label: "High",   color: "amber"   },
                { value: "urgent", label: "Urgent", color: "red"     },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    priority === p.value
                      ? p.value === "urgent"
                        ? "bg-red-50 border-red-400 text-red-700"
                        : p.value === "high"
                        ? "bg-amber-50 border-amber-400 text-amber-700"
                        : p.value === "low"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "bg-indigo-50 border-indigo-400 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Review tags */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">
              Review Tags <span className="font-normal normal-case text-slate-400">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/40"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">
              Review Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Describe what needs to be reviewed or clarified…"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none bg-white transition-all"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <Send className="w-4 h-4" />
            {loading ? "Submitting…" : "Submit for Review"}
          </motion.button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-indigo-50 border border-indigo-200 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-black text-indigo-800 text-lg">Sent for Review</h3>
          <p className="text-sm text-indigo-600 mt-1">
            This application has been flagged for further review by the team.
          </p>
        </motion.div>
      )}
    </div>
  );
}
