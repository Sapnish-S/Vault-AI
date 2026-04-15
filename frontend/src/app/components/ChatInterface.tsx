import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, ArrowLeft, FileText, X } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '@react-pdf-viewer/search';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: any[];
}

interface ChatInterfaceProps {
  vaultName: string;
  chatId?: string | null;
  isReadOnly?: boolean;
  onChatUpdated?: () => void;
  onBack: () => void;
  isDark?: boolean;
}

const PDFPreviewComponent: React.FC<{ url: string; keyword: string; page: number }> = ({ url, keyword, page }) => {
    // Calling searchPlugin at the top level of this standard component securely respects React Hook rules
    const searchPluginInstance = searchPlugin({ keyword });
    const token = sessionStorage.getItem('token');
    return (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer 
                fileUrl={url} 
                httpHeaders={{ 'Authorization': `Bearer ${token}` }}
                initialPage={Math.max(0, page - 1)}
                plugins={[searchPluginInstance]} 
                defaultScale={1.2}
            />
        </Worker>
    );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ vaultName, chatId, isReadOnly = false, onChatUpdated, onBack, isDark = true }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKeyword, setPreviewKeyword] = useState<string>('');
  const [previewPage, setPreviewPage] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId);
      const token = sessionStorage.getItem('token');
      fetch(`http://127.0.0.1:8000/chats/${chatId}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
            if (data.messages) {
                setMessages(data.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                    timestamp: new Date(m.timestamp),
                    sources: m.sources || []
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
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/chat/query', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ query: userMessage, vault_name: vaultName, chat_id: currentChatId ? parseInt(currentChatId) : null }),
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
        timestamp: new Date(),
        sources: data.sources || []
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
    <div className="flex w-full h-full max-w-[90rem] mx-auto relative z-20 gap-6 px-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className={`flex flex-col h-full transition-all duration-500 ease-in-out ${previewUrl ? 'w-1/2' : 'w-full max-w-5xl mx-auto'}`}
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
                <div className={`flex flex-col gap-2 max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                    className={`w-full p-4 rounded-3xl backdrop-blur-md border ${
                        msg.role === 'user' 
                        ? isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-blue-50 border-blue-200 text-blue-900 shadow-md' 
                        : isDark ? 'bg-white/5 border-white/10 text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'bg-white border-slate-200 text-slate-800 shadow-md'
                    }`}
                    >
                        <div className="text-base leading-relaxed font-light">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                                    li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                                    strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                                    em: ({node, ...props}) => <em className="italic opacity-90" {...props} />,
                                    a: ({node, href, children, ...props}) => {
                                        if (href === '#vault-source') {
                                            return (
                                                <span className={`font-semibold inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[13px] tracking-wide mx-1 my-0.5 align-middle ${isDark ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] border border-cyan-500/30' : 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'}`}>
                                                    <FileText size={12} strokeWidth={2.5} />
                                                    {children}
                                                </span>
                                            );
                                        }
                                        return <a href={href} className="underline hover:opacity-80 transition-opacity" {...props}>{children}</a>
                                    }
                                }}
                            >
                                {msg.content.replace(/\[Source:\s*([^,]+),\s*Page:\s*(\d+)\]/gi, (match, file, page) => {
                                    return `[Source: ${file}, Page: ${page}](#vault-source)`;
                                })}
                            </ReactMarkdown>
                        </div>
                        <div className={`mt-3 text-[10px] uppercase tracking-[0.1em] font-medium opacity-50 flex items-center gap-1.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && <Sparkles size={10} />}
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1 px-1">
                            {msg.sources.map((src, idx) => {
                                const page = src.metadata?.page || 1;
                                const filename = src.metadata?.source || 'document.pdf';
                                const text = src.content || '';
                                const keywords = text.split(/\s+/).slice(0, 3).join(" ");
                                const url = `http://127.0.0.1:8000/vaults/${vaultName}/files/${encodeURIComponent(filename)}/download`;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setPreviewUrl(url);
                                            setPreviewKeyword(keywords);
                                            setPreviewPage(page);
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border shadow-sm ${
                                            isDark 
                                            ? previewUrl === url ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/10 hover:text-white/90' 
                                            : previewUrl === url ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        <FileText size={12} />
                                        {filename} <span className="opacity-60 text-[10px]">(Pg {page})</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
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
      
      {/* PDF Preview Panel */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div 
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '50%' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className={`h-[calc(100%-2rem)] mt-4 flex flex-col rounded-3xl shadow-2xl border overflow-hidden backdrop-blur-xl ${
                isDark ? 'bg-black/60 border-white/10' : 'bg-white/90 border-slate-200'
            }`}
          >
            <div className={`flex justify-between items-center px-5 py-4 border-b relative z-10 ${isDark ? 'border-white/10 bg-gradient-to-b from-[#1a1e26] to-transparent' : 'border-slate-200 bg-gradient-to-b from-slate-50 to-transparent'}`}>
                <h3 className={`font-semibold tracking-wide flex items-center gap-2 text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                    <FileText size={16} className={isDark ? 'text-cyan-400' : 'text-blue-500'} /> 
                    Source Preview
                </h3>
                <button 
                    onClick={() => setPreviewUrl(null)}
                    className={`p-1.5 rounded-full transition-all duration-300 ${isDark ? 'text-white/40 hover:text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'}`}
                >
                    <X size={18} />
                </button>
            </div>
            <div className="flex-1 relative bg-white overflow-hidden rounded-b-3xl">
                {previewUrl && (
                    <PDFPreviewComponent 
                        key={previewUrl + previewKeyword + previewPage} 
                        url={previewUrl} 
                        keyword={previewKeyword} 
                        page={previewPage}
                    />
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
