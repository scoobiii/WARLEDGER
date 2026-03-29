import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { askAssistant } from '../services/GeminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function WarLedgerAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello. I'm the WarLedger Assistant. I can help you navigate the data, explain the costs of this conflict, or discuss the proposed corrections. How can I assist you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await askAssistant(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my intelligence core. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-accent text-bg flex items-center justify-center shadow-2xl hover:scale-105 transition-transform ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[70] w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-bg-secondary border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-bg-tertiary">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="font-display font-bold text-sm tracking-tight">WarLedger Assistant</div>
                  <div className="font-mono text-[9px] text-accent flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    AI INTELLIGENCE ACTIVE
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-ink-tertiary hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-accent text-bg font-medium rounded-br-none' 
                      : 'bg-bg-tertiary text-ink-secondary border border-border rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-tertiary text-ink-tertiary border border-border p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs font-mono">Analyzing ledger...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-bg-tertiary">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about the costs, events, or solutions..."
                  className="w-full bg-bg border border-border rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-accent text-bg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-2 text-[9px] font-mono text-ink-tertiary text-center uppercase tracking-widest">
                Powered by Gemini 3 Flash
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
