import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Vault AI secure environment initialized. Access granted to vector database. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm processing your request within the secure sanctuary. Accessing encrypted nodes...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col w-full h-full max-w-5xl mx-auto relative z-20"
    >
      {/* Header / Status */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Back to Dashboard"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                <span className="text-[10px] font-semibold text-blue-100 tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                    Secure Connection Active
                </span>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-6 pb-4">
        <AnimatePresence>
            {messages.map((msg) => (
            <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div 
                className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl backdrop-blur-md border ${
                    msg.role === 'user' 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-50' 
                    : 'bg-white/5 border-white/10 text-white/90'
                } shadow-lg`}
                >
                <p className="text-sm md:text-base leading-relaxed font-light">
                    {msg.content}
                </p>
                <div className={`mt-2 text-[10px] uppercase tracking-wider opacity-40 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <Sparkles size={10} />}
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 px-4 pb-2">
        <form 
            onSubmit={handleSendMessage}
            className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10 focus-within:border-cyan-500/50 focus-within:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex items-center gap-2 p-2 pl-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Vault AI..."
                    className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/30 font-light text-sm md:text-base h-10 px-2"
                />
                
                <div className="flex items-center gap-1">
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim()}
                        className="p-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </form>
        <div className="flex flex-col items-center justify-center gap-1 mt-3">
            <span className="text-[10px] text-white/20">AI content may be inaccurate. Verify important information.</span>
            <div className="text-white/20 text-[10px] font-light">
                Vault AI v2.4.0
            </div>
        </div>
      </div>
    </motion.div>
  );
};
