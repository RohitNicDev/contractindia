import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";

export const Route = createFileRoute("/_dashboard/messages")({
  component: MessagesPage,
});

const CONTACTS = [
  { id: 1, name: "Buildtech Constructions", last: "Please share the BOQ document.", time: "10:32 AM", unread: 2, online: true  },
  { id: 2, name: "Apex Consultants",        last: "Meeting confirmed for Monday.",  time: "9:15 AM",  unread: 1, online: true  },
  { id: 3, name: "NHAI Project Team",       last: "Site inspection on Jun 18.",     time: "Yesterday",unread: 0, online: false },
  { id: 4, name: "SteelMart Suppliers",     last: "Invoice #INV-2045 attached.",    time: "Yesterday",unread: 0, online: false },
  { id: 5, name: "Indore PMC Group",        last: "Progress report submitted.",     time: "Mon",      unread: 0, online: true  },
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
  3: [
    { from: "them", text: "Site inspection on Jun 18.",              time: "Yesterday" },
  ],
  4: [
    { from: "them", text: "Invoice #INV-2045 attached.",             time: "Yesterday" },
  ],
  5: [
    { from: "them", text: "Progress report submitted.",              time: "Mon" },
  ],
};

export default function MessagesPage() {
  const [active, setActive] = useState(1);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const contact = CONTACTS.find((c) => c.id === active)!;
  const msgs = MESSAGES[active] ?? [];

  const filtered = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Messages</h2>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${active === c.id ? "bg-indigo-50" : ""}`}
            >
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {c.name[0]}
                </div>
                {c.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs font-bold text-slate-800">{c.name}</p>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-1">{c.time}</span>
                </div>
                <p className="truncate text-[11px] text-slate-400 mt-0.5">{c.last}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3.5">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {contact.name[0]}
            </div>
            {contact.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{contact.name}</p>
            <p className="text-[11px] text-slate-400">{contact.online ? "Online" : "Offline"}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><Phone className="h-4 w-4" /></button>
            <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><Video className="h-4 w-4" /></button>
            <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><MoreVertical className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                m.from === "me"
                  ? "rounded-br-sm bg-indigo-600 text-white"
                  : "rounded-bl-sm bg-white text-slate-800 border border-slate-200"
              }`}>
                <p>{m.text}</p>
                <p className={`mt-1 text-[10px] ${m.from === "me" ? "text-indigo-200" : "text-slate-400"}`}>{m.time}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setInput("")}
              placeholder="Type a message…"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              onClick={() => setInput("")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
