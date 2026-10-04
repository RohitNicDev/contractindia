import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Building2,
  BriefcaseBusiness,
  ExternalLink,
  Headset,
  MessageCircle,
  MessagesSquare,
  Phone,
  Search,
  Send,
  Sparkles,
  X 
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const WhatsAppMark = ({ className = "h-5 w-5" }) => (
  <FaWhatsapp aria-hidden="true" className={`block shrink-0 ${className}`} />
);

const QUICK_QUESTIONS = [
  "What services do you offer?",
  "How do I find a contractor?",
  "How can I contact support?",
];

const getFaqReply = (message) => {
  const question = message.toLowerCase();

  if (/service|what can you do|offerings/.test(question)) {
    return "Contracts India offers contractor and consulting services, tender support, legal contracts, asset management, marketing, materials supply and manufacturing, and construction audit. Browse Services in the site menu to learn more.";
  }

  if (/contractor|supplier|company|vendor|find|search/.test(question)) {
    return "You can browse verified companies from the Company List in the site menu. Open a company profile to review its details and available contact options.";
  }

  if (/tender|bid|government/.test(question)) {
    return "We offer tender services to help businesses with tender-related requirements. Choose Tender Services from the Services menu, or message our team on WhatsApp for help with your specific requirement.";
  }

  if (/account|register|sign.?up|login|password/.test(question)) {
    return "Use Register to create an account, or Sign in if you already have one. If you are stuck during registration or login, contact our team on WhatsApp.";
  }

  if (/contact|support|phone|whatsapp|number|call|human|team/.test(question)) {
    return "You can reach Contracts India at +91 99994 18599 or +91 98683 18936. Use the WhatsApp button here to start a message, or visit the Contact page for the office address and email.";
  }

  return "I can help with services, finding contractors, tenders, accounts, or contacting the team. For anything specific, message us on WhatsApp and our team can help.";
};

const getAssistantReply = async (message, history) => {
  const endpoint = import.meta.env.VITE_AI_CHAT_API_URL;

  if (!endpoint) return getFaqReply(message);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history.map(({ role, content }) => ({ role, content })),
    }),
  });

  if (!response.ok) throw new Error("The assistant is temporarily unavailable.");

  const data = await response.json();
  return data.reply || data.message || getFaqReply(message);
};

export default function SupportChatWidget() {
  const [activePanel, setActivePanel] = useState(null);
  const [draft, setDraft] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I’m the Contracts India assistant. Ask me about our services, finding contractors, tenders, or getting in touch.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isReplying]);

  const submitMessage = async (message) => {
    const content = message.trim();
    if (!content || isReplying) return;

    const history = [...messages, { role: "user", content }];
    setMessages(history);
    setDraft("");
    setIsReplying(true);

    try {
      const reply = await getAssistantReply(content, history);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: getFaqReply(content),
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence mode="wait">
        {activePanel === "assistant" && (
          <motion.section
            aria-label="Contracts India support chat"
            className="flex h-[min(580px,calc(100dvh-104px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.45)]"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
          >
            <header className="relative overflow-hidden bg-[#162646] px-5 pb-5 pt-4 text-white">
              <div aria-hidden="true" className="absolute -right-6 -top-10 h-36 w-36 rounded-full border-[24px] border-white/5" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <Bot className="h-5 w-5 text-amber-300" />
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#162646] bg-emerald-400" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">Contracts India</h2>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Support assistant
                    </p>
                  </div>
                </div>
                <button
                  aria-label="Close support chat"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setActivePanel(null)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="relative mt-4 text-xs text-slate-300">
                Ask a question and we’ll point you in the right direction.
              </p>
            </header>

            <div
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto bg-[#f5f7fa] px-4 py-5"
            >
              {messages.map((message, index) => (
                <div
                  className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  key={`${message.role}-${index}`}
                >
                  {message.role === "assistant" && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#162646] text-amber-300">
                      <Bot className="h-4 w-4" />
                    </span>
                  )}
                  <p
                    className={`max-w-[84%] whitespace-pre-wrap px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      message.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-[#162646] text-white"
                        : "rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}
              {isReplying && (
                <div className="flex items-center gap-2" role="status">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#162646] text-amber-300">
                    <Bot className="h-4 w-4" />
                  </span>
                  <span className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-500 shadow-sm">
                    Thinking...
                  </span>
                </div>
              )}
              {messages.length === 1 && (
                <div className="pl-9 pt-1">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Suggested questions
                  </p>
                  <div className="space-y-2">
                    {QUICK_QUESTIONS.map((question, index) => {
                      const Icon = [BriefcaseBusiness, Search, Headset][index];
                      return (
                        <button
                          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50"
                          disabled={isReplying}
                          key={question}
                          onClick={() => submitMessage(question)}
                          type="button"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-[#162646]" />
                          {question}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              className="border-t border-slate-100 bg-white p-3.5"
              onSubmit={(event) => {
                event.preventDefault();
                submitMessage(draft);
              }}
            >
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pl-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
                <label className="sr-only" htmlFor="support-chat-message">
                  Message the support assistant
                </label>
                <input
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  id="support-chat-message"
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write your message..."
                  value={draft}
                />
                <button
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-[#162646] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!draft.trim() || isReplying}
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Contracts India · support
              </p>
            </form>
          </motion.section>
        )}

        {activePanel === "whatsapp" && (
          <motion.section
            aria-label="WhatsApp contacts"
            className="w-[min(350px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.4)]"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
          >
            <header className="flex items-center justify-between bg-emerald-700 px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <WhatsAppMark />
                </span>
                <div>
                  <h2 className="text-sm font-bold">Chat on WhatsApp</h2>
                  <p className="mt-0.5 text-xs text-emerald-100">Choose a contact to continue</p>
                </div>
              </div>
              <button
                aria-label="Close WhatsApp contacts"
                className="rounded-lg p-2 text-emerald-100 transition hover:bg-white/10 hover:text-white"
                onClick={() => setActivePanel(null)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="space-y-2.5 p-3">
              {[
                { number: "919999418599", label: "+91 99994 18599" },
                { number: "919868318936", label: "+91 98683 18936" },
              ].map((contact) => (
                <a
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                  href={`https://wa.me/${contact.number}?text=${encodeURIComponent("Hello, I need help with Contracts India.")}`}
                  key={contact.number}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{contact.label}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">Open WhatsApp chat</span>
                    </span>
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-emerald-700" />
                </a>
              ))}
              <a
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[#162646] transition hover:bg-slate-50 hover:text-amber-700"
                href="/contact"
                onClick={() => setActivePanel(null)}
              >
                <Building2 className="h-4 w-4" />
                Office details and email
              </a>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2.5">
        <button
          aria-expanded={activePanel === "whatsapp"}
          aria-label="Open WhatsApp contacts"
          className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#20b85a] text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#159447] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          onClick={() =>
            setActivePanel(activePanel === "whatsapp" ? null : "whatsapp")
          }
          title="Chat on WhatsApp"
          type="button"
        >
          <WhatsAppMark className="h-6 w-6" />
        </button>
        <button
          aria-expanded={activePanel === "assistant"}
          aria-label="Open support assistant"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#162646] text-white shadow-xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:bg-[#20375f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          onClick={() =>
            setActivePanel(activePanel === "assistant" ? null : "assistant")
          }
          title="Chat with Contracts India"
          type="button"
        >
          {activePanel === "assistant" ? (
            <X className="h-5 w-5" />
          ) : (
            <span className="relative">
              <MessagesSquare className="h-6 w-6" />
              <Sparkles className="absolute -right-2 -top-2 h-3.5 w-3.5 text-amber-300" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}