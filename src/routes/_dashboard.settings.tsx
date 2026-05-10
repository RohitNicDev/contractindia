import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Shield, Palette, Globe, Trash2,
  ChevronRight, Moon, Sun, Monitor, Settings,
  Lock, Smartphone, Activity,
} from "lucide-react";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsPage,
});

const fu = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});

const glassCard = "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300 overflow-hidden";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked
          ? "bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
          : "bg-slate-200"
      }`}
    >
      <motion.span
        layout
        className="inline-block h-4 w-4 rounded-full bg-white shadow"
        animate={{ x: checked ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({
    email: true, sms: false, tenders: true, messages: true, updates: false,
  });
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [lang, setLang] = useState("en");

  return (
    <div className="p-6 space-y-6 max-w-2xl">

      {/* Header */}
      <motion.div {...fu(0)}>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 shadow-md">
            <Settings className="h-4.5 w-4.5 text-white" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Settings</h1>
            <div className="h-0.5 w-14 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 mt-0.5" />
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 ml-12">Manage your account preferences and security.</p>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fu(1)} className={`${glassCard} hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] hover:border-indigo-200/60`}>
        <div className="flex items-center gap-3 border-b border-indigo-100/60 px-5 py-4 bg-gradient-to-r from-indigo-50/40 to-transparent">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md">
            <Bell className="h-4 w-4 text-white" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Notifications</h2>
            <p className="text-[11px] text-slate-400">Control how you receive alerts</p>
          </div>
        </div>
        <div className="divide-y divide-slate-100/60">
          {[
            { key: "email",    label: "Email notifications",  sub: "Receive updates via email"         },
            { key: "sms",      label: "SMS alerts",           sub: "Get SMS for critical updates"      },
            { key: "tenders",  label: "New tender alerts",    sub: "Notify when matching tenders post" },
            { key: "messages", label: "Message notifications",sub: "Alerts for new messages"           },
            { key: "updates",  label: "Product updates",      sub: "News about ContractIndia features" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between px-5 py-3.5 hover:bg-indigo-50/20 transition-colors">
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
      <motion.div {...fu(2)} className={`${glassCard} hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] hover:border-indigo-200/60`}>
        <div className="flex items-center gap-3 border-b border-indigo-100/60 px-5 py-4 bg-gradient-to-r from-violet-50/40 to-transparent">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-md">
            <Palette className="h-4 w-4 text-white" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Appearance</h2>
            <p className="text-[11px] text-slate-400">Customize your visual experience</p>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: "light",  label: "Light",  icon: Sun,     grad: "from-amber-400 to-orange-400"  },
              { value: "dark",   label: "Dark",   icon: Moon,    grad: "from-slate-600 to-slate-700"   },
              { value: "system", label: "System", icon: Monitor, grad: "from-indigo-500 to-violet-500" },
            ] as const).map(({ value, label, icon: Icon, grad }) => (
              <motion.button
                key={value}
                onClick={() => setTheme(value)}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3.5 text-xs font-semibold transition-all ${
                  theme === value
                    ? "border-indigo-300 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-700 shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                    : "border-slate-200/80 bg-white/50 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/40"
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${grad} shadow-sm`}>
                  <Icon className="h-4 w-4 text-white" />
                </span>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div {...fu(3)} className={`${glassCard} hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] hover:border-indigo-200/60`}>
        <div className="flex items-center gap-3 border-b border-indigo-100/60 px-5 py-4 bg-gradient-to-r from-cyan-50/40 to-transparent">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md">
            <Globe className="h-4 w-4 text-white" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Language & Region</h2>
            <p className="text-[11px] text-slate-400">Set your preferred language</p>
          </div>
        </div>
        <div className="p-5">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 block">Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="mr">🇮🇳 Marathi</option>
            <option value="gu">🇮🇳 Gujarati</option>
          </select>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div {...fu(4)} className={`${glassCard} hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] hover:border-indigo-200/60`}>
        <div className="flex items-center gap-3 border-b border-indigo-100/60 px-5 py-4 bg-gradient-to-r from-emerald-50/40 to-transparent">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
            <Shield className="h-4 w-4 text-white" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Security</h2>
            <p className="text-[11px] text-slate-400">Protect your account</p>
          </div>
        </div>
        <div className="divide-y divide-slate-100/60">
          {[
            { label: "Change Password",  sub: "Update your account password",       icon: Lock        },
            { label: "Two-Factor Auth",  sub: "Add an extra layer of security",     icon: Smartphone  },
            { label: "Active Sessions",  sub: "Manage devices logged into account", icon: Activity    },
          ].map(({ label, sub, icon: Icon }) => (
            <motion.button
              key={label}
              whileHover={{ x: 2 }}
              className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-emerald-50/20 transition-colors group"
            >
              <div className="flex items-center gap-3 text-left">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div {...fu(5)}
        className="rounded-2xl bg-red-50/60 backdrop-blur-xl border border-red-200/60 shadow-[0_4px_24px_rgba(239,68,68,0.08)] transition-all duration-300 overflow-hidden hover:shadow-[0_8px_32px_rgba(239,68,68,0.12)]"
      >
        <div className="flex items-center gap-3 border-b border-red-100/60 px-5 py-4 bg-gradient-to-r from-red-50/60 to-transparent">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-md">
            <Trash2 className="h-4 w-4 text-white" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-red-700">Danger Zone</h2>
            <p className="text-[11px] text-red-400">Irreversible actions</p>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-600 mb-4">
            Permanently delete your account and all associated data. This action <span className="font-bold text-red-600">cannot be undone</span>.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-red-200 bg-white/70 backdrop-blur-xl px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100/80 hover:border-red-300 transition-all shadow-sm"
          >
            Delete Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
