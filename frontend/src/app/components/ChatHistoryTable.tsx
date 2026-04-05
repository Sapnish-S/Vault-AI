import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowLeft, Search } from 'lucide-react';
import { ChatSession } from '../types';

interface ChatHistoryTableProps {
  userId: number;
  isDark: boolean;
  onClose: () => void;
  onChatSelect: (chatId: string) => void;
}

export const ChatHistoryTable: React.FC<ChatHistoryTableProps> = ({ userId, isDark, onClose, onChatSelect }) => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Unified Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced fetch
  useEffect(() => {
    const fetchFilteredChats = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({ user_id: userId.toString() });
        if (searchQuery) queryParams.append('search_query', searchQuery);
        
        const response = await fetch(`http://127.0.0.1:8000/chats?${queryParams.toString()}`);
        const data = await response.json();
        setChats(data.chats || []);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchFilteredChats, 300);
    return () => clearTimeout(debounceTimeout);
  }, [userId, searchQuery]);

  return (
    <div className={`w-full h-full flex flex-col p-8 rounded-3xl backdrop-blur-xl border transition-all duration-700 animate-[fadeIn_0.5s_ease-out] ${
      isDark 
        ? 'bg-black/40 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
        : 'bg-white/60 border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)]'
    }`}>
      {/* Header section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-black/5 text-slate-600'
            }`}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className={`text-2xl font-light tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Chat History Archive
          </h2>
        </div>
      </div>

      {/* Search Filters Row */}
      <div className="mb-8">
        {/* Unified Search API */}
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors">
            <Search size={22} className={isDark ? 'text-white/40 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-blue-500'} />
          </div>
          <input
            type="text"
            placeholder="Search across all columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-14 pr-4 py-4 rounded-2xl border outline-none transition-all text-lg ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                : 'bg-white/50 border-white/80 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]'
            }`}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className={`flex-1 overflow-auto rounded-2xl border shadow-inner ${
        isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white/40 border-white/60'
      }`}>
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/50'}`}>
              <th className={`p-5 font-medium sticky top-0 backdrop-blur-md tracking-wide text-sm z-10 ${isDark ? 'text-white/60 bg-[#1a1e26]/80' : 'text-slate-500 bg-slate-50/80'}`}>Conversation</th>
              <th className={`p-5 font-medium sticky top-0 backdrop-blur-md tracking-wide text-sm z-10 ${isDark ? 'text-white/60 bg-[#1a1e26]/80' : 'text-slate-500 bg-slate-50/80'}`}>From</th>
              <th className={`p-5 font-medium sticky top-0 backdrop-blur-md tracking-wide text-sm z-10 ${isDark ? 'text-white/60 bg-[#1a1e26]/80' : 'text-slate-500 bg-slate-50/80'}`}>To</th>
              <th className={`p-5 font-medium sticky top-0 backdrop-blur-md tracking-wide text-sm z-10 ${isDark ? 'text-white/60 bg-[#1a1e26]/80' : 'text-slate-500 bg-slate-50/80'}`}>Label</th>
              <th className={`p-5 font-medium sticky top-0 backdrop-blur-md tracking-wide text-sm z-10 ${isDark ? 'text-white/60 bg-[#1a1e26]/80' : 'text-slate-500 bg-slate-50/80'}`}>Time Frame</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className={`animate-pulse flex flex-col items-center gap-4 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`}>
                    <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span className="tracking-widest font-light text-sm">LOADING ARCHIVES...</span>
                  </div>
                </td>
              </tr>
            ) : chats.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center">
                  <div className={`flex flex-col items-center gap-3 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                    <MessageSquare size={32} />
                    <span className="font-light tracking-wide">No history matching your criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              chats.map((chat) => (
                <tr 
                  key={chat.id} 
                  onClick={() => onChatSelect(chat.id)}
                  className={`border-b transition-all duration-300 cursor-pointer group ${
                    isDark 
                      ? 'border-white/5 hover:bg-white/5 text-white/80 hover:shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]' 
                      : 'border-slate-100 hover:bg-white/60 text-slate-700 hover:shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]'
                  }`}
                >
                  <td className={`p-5 font-medium transition-colors ${isDark ? 'group-hover:text-cyan-400' : 'group-hover:text-blue-600'}`}>
                    {chat.title}
                  </td>
                  <td className="p-5 font-light">{chat.sender_name || 'User'}</td>
                  <td className="p-5 font-light">{chat.receiver_name || 'Vault AI'}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
                      isDark 
                        ? 'bg-blue-500/10 text-cyan-300 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                    }`}>
                      {chat.label || 'General'}
                    </span>
                  </td>
                  <td className="p-5 text-sm font-light opacity-60">
                    {chat.time_frame || new Date(chat.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
