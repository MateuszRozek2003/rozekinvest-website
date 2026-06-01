import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

export function Chatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: t("chat.welcome") || "Dzień dobry! Jestem wirtualnym asystentem Rożek Invest. W czym mogę dzisiaj pomóc?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            id: "welcome",
            role: "model",
            text: t("chat.welcome") || "Dzień dobry! Jestem wirtualnym asystentem Rożek Invest. W czym mogę dzisiaj pomóc?",
          },
        ];
      }
      return prev;
    });
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal("");
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const chatHistory = messages.filter(m => m.id !== "welcome").map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          userText,
          language
        })
      });

      if (!res.ok) {
        throw new Error("Błąd sieci");
      }

      const data = await res.json();
      const botText = data.text || t("chat.error") || "Przepraszam, coś poszło nie tak.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: botText,
        },
      ]);
    } catch (error) {
      console.error("Błąd czatu:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: t("chat.tech_issue") || "Przepraszam, mam w tej chwili problemy techniczne. Proszę spróbować później lub użyć formularza kontaktowego.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 hidden md:block"
            >
              <p className="text-sm font-semibold text-brand-navy">{t("chat.ask_question")}</p>
              <p className="text-xs text-slate-500">{t("chat.ask_desc")}</p>
            </motion.div>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="p-4 bg-brand-navy text-white rounded-full shadow-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 group"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#e0e0e0]"
          >
            {/* Header */}
            <div className="bg-brand-navy px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-copper flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <h3 className="text-white font-medium">{t("chat.assistant_name") || "Asystent Rożek Invest"}</h3>
                  <div className="text-white/70 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span> {t("chat.online") || "Online"}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div 
                    className={
                      msg.role === "user" 
                        ? "max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed bg-brand-navy text-white rounded-tr-sm" 
                        : "max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed bg-white text-slate-800 shadow-sm border border-slate-200 rounded-tl-sm"
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-[#f0f0f0] shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-brand-navy/40 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-brand-navy/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-brand-navy/80 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-[#f0f0f0]">
              <div className="relative flex items-center">
                <textarea
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("chat.placeholder") || "Napisz wiadomość..."}
                  className="w-full bg-slate-50 border border-[#e0e0e0] rounded-xl pl-4 pr-12 py-3 text-[14px] focus:outline-none focus:border-brand-navy resize-none h-[48px] placeholder-slate-400"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputVal.trim() || isLoading}
                  className="absolute right-2 p-2 text-brand-navy hover:text-brand-copper disabled:text-slate-300 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
