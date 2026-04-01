import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  vaultName: string;
  chatId?: string | null;
  isReadOnly?: boolean;
  onChatUpdated?: () => void;
  onBack: () => void;
  isDark?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ vaultName, chatId, isReadOnly = false, onChatUpdated, onBack, isDark = true }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId);
      fetch(`http://127.0.0.1:8000/chats/${chatId}/messages?user_id=1`)
        .then(res => res.json())
        .then(data => {
            if (data.messages) {
                setMessages(data.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                    timestamp: new Date(m.timestamp)
                })));
            }
        })
        .catch(console.error);
    } else {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Vault AI secure environment initialized. Access granted to vector database. How can I assist you today?",
        timestamp: new Date()
      }]);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const userStr = sessionStorage.getItem('user');
      const activeUserId = userStr ? JSON.parse(userStr).id : 1;

      const res = await fetch('http://127.0.0.1:8000/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage, vault_name: vaultName, chat_id: currentChatId ? parseInt(currentChatId) : null, user_id: activeUserId }),
      });
      const data = await res.json();
      
      if (data.chat_id && !currentChatId) {
          setCurrentChatId(data.chat_id.toString());
          onChatUpdated?.();
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || "An error occurred while fetching the response.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Network error communicating with the Vault API.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
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
                className={`p-2 rounded-full transition-colors ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/50'}`}
                aria-label="Back to Dashboard"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]'}`} />
                <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-blue-100 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-blue-700'}`}>
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
                className={`max-w-[70%] p-4 rounded-2xl backdrop-blur-md border ${
                    msg.role === 'user' 
                    ? isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-50' : 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm' 
                    : isDark ? 'bg-white/5 border-white/10 text-white/90' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                } shadow-lg`}
                >
                <p className="text-base leading-relaxed font-light">
                    {msg.content}
                </p>
                <div className={`mt-2 text-[10px] uppercase tracking-wider opacity-40 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <Sparkles size={10} />}
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                </div>
            </motion.div>
            ))}
            {isTyping && (
                <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex w-full justify-start"
                >
                    <div className={`max-w-[70%] p-4 rounded-2xl backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'} shadow-lg`}>
                        <TypingIndicator isDark={isDark} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isReadOnly && (
      <div className="mt-4 px-4 pb-2">
        <form 
            onSubmit={handleSendMessage}
            className={`relative group rounded-xl overflow-hidden border transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl ${
              isDark 
                ? 'bg-white/5 border-white/10 focus-within:border-cyan-500/50 focus-within:bg-white/10' 
                : 'bg-white/80 border-slate-200 focus-within:border-blue-400 focus-within:bg-white shadow-sm'
            }`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex items-center gap-2 p-2 pl-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Vault AI..."
                    className={`flex-1 bg-transparent border-none outline-none font-light text-base h-10 px-2 transition-colors ${
                      isDark ? 'text-white/90 placeholder-white/30' : 'text-slate-900 placeholder-slate-400'
                    }`}
                />
                
                <div className="flex items-center gap-1">
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim()}
                        className={`p-2 transition-all rounded-lg disabled:opacity-30 disabled:cursor-not-allowed ${
                          isDark 
                            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </form>
        <div className="flex flex-col items-center justify-center gap-1 mt-3">
            <span className={`text-[10px] transition-colors ${isDark ? 'text-white/20' : 'text-slate-400'}`}>AI content may be inaccurate. Verify important information.</span>
            <div className={`text-[10px] font-light transition-colors ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
                Vault AI v2.4.0
            </div>
        </div>
      </div>
      )}
    </motion.div>
  );
};
