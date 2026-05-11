import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, MoreVertical, Phone, Video, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_dashboard/messages")({
  component: MessagesPage,
});

const CONTACTS = [
  { id: 1, name: "Buildtech Constructions", last: "Please share the BOQ document.", time: "10:32 AM", unread: 2, online: true,  grad: "from-indigo-500 to-violet-500"  },
  { id: 2, name: "Apex Consultants",        last: "Meeting confirmed for Monday.",  time: "9:15 AM",  unread: 1, online: true,  grad: "from-violet-500 to-purple-500"  },
  { id: 3, name: "NHAI Project Team",       last: "Site inspection on Jun 18.",     time: "Yesterday",unread: 0, online: false, grad: "from-cyan-500 to-blue-500"      },
  { id: 4, name: "SteelMart Suppliers",     last: "Invoice #INV-2045 attached.",    time: "Yesterday",unread: 0, online: false, grad: "from-emerald-500 to-teal-500"   },
  { id: 5, name: "Indore PMC Group",        last: "Progress report submitted.",     time: "Mon",      unread: 0, online: true,  grad: "from-amber-500 to-orange-400"   },
];

const MESSAGES: Record<number, { from: "me" | "them"; text: string; time: string }[]> = {
  1: [
    { from: "them", text: "Hi, we reviewed your tender submission.", time: "10:20 AM" },
    { from: "me",   text: "Thank you! Any feedback on the pricing?", time: "10:25 AM" },
    { from: "them", text: "Please share the BOQ document.",          time: "10:32 AM" },
  ],
  2: [
    { from: "them", text: "Can we schedule a call this week?",       time: "9:00 AM" },
    { from: "me",   text: "Sure, Monday works for me.",              time: "9:10 AM" },
    { from: "them", text: "Meeting confirmed for Monday.",           time: "9:15 AM" },
  ],
  3: [{ from: "them", text: "Site inspection on Jun 18.", time: "Yesterday" }],
  4: [{ from: "them", text: "Invoice #INV-2045 attached.", time: "Yesterday" }],
  5: [{ from: "them", text: "Progress report submitted.", time: "Mon" }],
};

export default function MessagesPage() {
  const [active, setActive] = useState(1);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [localMessages, setLocalMessages] = useState(MESSAGES);

  const contact = CONTACTS.find((c) => c.id === active)!;
  const msgs = localMessages[active] ?? [];
  const filtered = CONTACTS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const sendMessage = () => {
    if (!input.trim()) return;
    setLocalMessages((prev) => ({
      ...prev,
      [active]: [...(prev[active] ?? []), { from: "me", text: input.trim(), time: "Now" }],
    }));
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

      {/* Contact sidebar */}
      <div className="flex w-72 shrink-0 flex-col bg-white/80 backdrop-blur-2xl border-r border-indigo-100/60 shadow-[2px_0_12px_rgba(99,102,241,0.06)]">
        <div className="border-b border-indigo-100/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-rose-500 shadow-md">
              <MessageSquare className="h-3.5 w-3.5 text-white" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">Messages</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-3 py-2 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
          {filtered.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, ease: "easeOut" }}
              onClick={() => setActive(c.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all ${
                active === c.id
                  ? "bg-linear-to-r from-indigo-50/90 to-violet-50/70 border-r-2 border-indigo-400"
                  : "hover:bg-slate-50/80"
              }`}
            >
              <div className="relative shrink-0">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white bg-linear-to-br ${
                  active === c.id ? c.grad : "from-slate-300 to-slate-400"
                } ${active === c.id ? "shadow-[0_0_12px_rgba(99,102,241,0.3)]" : ""}`}>
                  {c.name[0]}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`truncate text-xs font-bold ${active === c.id ? "text-indigo-800" : "text-slate-800"}`}>
                    {c.name}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-1">{c.time}</span>
                </div>
                <p className="truncate text-[11px] text-slate-400 mt-0.5">{c.last}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-linear-to-r from-indigo-500 to-violet-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                  {c.unread}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-linear-to-br from-slate-50 via-indigo-50/20 to-violet-50/10">

        {/* Chat header */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border-b border-indigo-100/60 shadow-[0_2px_8px_rgba(99,102,241,0.06)] px-5 py-3.5">
          <div className="relative">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br ${contact.grad} text-sm font-bold text-white shadow-md`}>
              {contact.name[0]}
            </div>
            {contact.online && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{contact.name}</p>
            <p className={`text-[11px] font-semibold ${contact.online ? "text-emerald-600" : "text-slate-400"}`}>
              {contact.online ? "● Online" : "○ Offline"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {[Phone, Video, MoreVertical].map((Icon, i) => (
              <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                <Icon className="h-4 w-4" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 [scrollbar-width:thin]">
          <AnimatePresence>
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.04, ease: "easeOut" }}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === "me"
                    ? "rounded-br-sm bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_16px_rgba(99,102,241,0.35)]"
                    : "rounded-bl-sm bg-white/80 backdrop-blur-xl text-slate-800 border border-white/80 shadow-[0_4px_16px_rgba(99,102,241,0.08)]"
                }`}>
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.from === "me" ? "text-indigo-200" : "text-slate-400"}`}>{m.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-indigo-100/60 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-4 py-2.5 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 shadow-sm">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message…"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={sendMessage}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.5)] transition-shadow"
            >
              <Send className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
