import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Palette, Globe, Trash2, ChevronRight, Moon, Sun, Monitor } from "lucide-react";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsPage,
});

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ email: true, sms: false, tenders: true, messages: true, updates: false });
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [lang, setLang] = useState("en");

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account preferences.</p>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fadeUp(1)} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Bell className="h-4.5 w-4.5 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-800">Notifications</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { key: "email",    label: "Email notifications",   sub: "Receive updates via email"          },
            { key: "sms",      label: "SMS alerts",            sub: "Get SMS for critical updates"       },
            { key: "tenders",  label: "New tender alerts",     sub: "Notify when matching tenders post"  },
            { key: "messages", label: "Message notifications", sub: "Alerts for new messages"            },
            { key: "updates",  label: "Product updates",       sub: "News about ContractIndia features"  },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <Toggle
                checked={notifs[key as keyof typeof notifs]}
                onChange={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof notifs] }))}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div {...fadeUp(2)} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Palette className="h-4.5 w-4.5 text-violet-500" />
          <h2 className="text-sm font-bold text-slate-800">Appearance</h2>
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: "light",  label: "Light",  icon: Sun     },
              { value: "dark",   label: "Dark",   icon: Moon    },
              { value: "system", label: "System", icon: Monitor },
            ] as const).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-xs font-semibold transition-all ${
                  theme === value
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-indigo-200"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div {...fadeUp(3)} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Globe className="h-4.5 w-4.5 text-cyan-500" />
          <h2 className="text-sm font-bold text-slate-800">Language & Region</h2>
        </div>
        <div className="p-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2 block">Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
            <option value="gu">Gujarati</option>
          </select>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div {...fadeUp(4)} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Shield className="h-4.5 w-4.5 text-emerald-500" />
          <h2 className="text-sm font-bold text-slate-800">Security</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { label: "Change Password",        sub: "Update your account password"       },
            { label: "Two-Factor Auth",         sub: "Add an extra layer of security"     },
            { label: "Active Sessions",         sub: "Manage devices logged into account" },
          ].map(({ label, sub }) => (
            <button key={label} className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div {...fadeUp(5)} className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-red-50 px-5 py-4">
          <Trash2 className="h-4.5 w-4.5 text-red-500" />
          <h2 className="text-sm font-bold text-red-700">Danger Zone</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
