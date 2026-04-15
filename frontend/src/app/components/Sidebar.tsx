import React from 'react';
import { Logo } from './Logo';
import { Search, MoreHorizontal, X } from 'lucide-react';
import { ChatSession } from '../types';
import profileImg from '../../assets/2be51f959d31760d9fea5b9fa18cd530ec37cff3.png';

interface SidebarProps {
  recentChats: ChatSession[];
  user?: { first_name: string; last_name: string; role: string; username?: string; };
  onChatSelect?: (chatId: string) => void;
  onHome?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  isDark?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ recentChats, user, onChatSelect, onHome, onSearchClick, onProfileClick, isDark = true }) => {
  return (
    <div className="relative flex flex-col w-80 h-full z-20 p-4">
      {/* Container with VaultPanel glass styling */}
      <div className={`relative flex flex-col h-full backdrop-blur-3xl rounded-3xl overflow-hidden transition-all duration-700 ${isDark
        ? 'bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.01] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-20px_40px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.4)] before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
        : 'bg-white/50 shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.05)] border border-white/80 before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.6)_0%,transparent_70%)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]'
        } before:absolute before:inset-x-0 before:top-0 before:h-1/3 before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none`}>

        {/* Header Area */}
        <div className="flex items-center justify-between px-6 py-5 relative z-10">
          <div className="cursor-pointer" onClick={onHome}>
            <Logo isDark={isDark} />
          </div>
          <button className={`transition-colors ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}>
            <X size={18} />
          </button>
        </div>

        {/* User Profile - Large Layout (Moved to Top) */}
        <div className="px-6 mb-6 mt-2 relative z-10">
          <div onClick={onProfileClick} className="flex flex-col items-center justify-center p-4 cursor-pointer group transition-all duration-500">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden mb-4 transition-all duration-300 z-10 group-hover:-translate-y-1 ${isDark
              ? 'bg-gradient-to-br from-[#3B82F6]/20 to-[#1d4ed8]/20 border border-white/20 shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]'
              : 'bg-gradient-to-br from-blue-100 to-blue-200 border border-white shadow-[0_10px_15px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              }`}>
              <img src={profileImg} alt="Ari Lee" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 mix-blend-overlay pointer-events-none ${isDark ? 'bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-30' : 'bg-gradient-to-tr from-white/40 via-transparent to-transparent'}`}></div>
            </div>
            <div className="flex flex-col items-center text-center relative z-10 w-full min-h-[50px]">
              {user ? (
                <>
                  <span className={`text-lg font-bold mb-1 transition-colors ${isDark ? 'text-white/90 group-hover:text-white' : 'text-slate-800 group-hover:text-blue-600'}`}>
                    {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'User'}
                  </span>
                  <span className={`text-sm font-medium transition-colors ${isDark ? 'text-white/50 group-hover:text-blue-300' : 'text-slate-500 group-hover:text-blue-500'}`}>
                    {user.role || 'Welcome'}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 mt-1">
                  <div className={`h-5 w-28 rounded-md animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <div className={`h-3 w-20 rounded-md animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="px-6 space-y-3 mb-8 relative z-10">
          <button onClick={onSearchClick} className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 border overflow-hidden ${isDark
            ? 'hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] text-white/50 hover:text-white border-transparent hover:border-white/10'
            : 'hover:bg-white/60 hover:shadow-[0_4px_15px_rgba(255,51,102,0.15)] text-slate-500 hover:text-slate-800 border-transparent hover:border-white/80 bg-white/30'
            }`}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[#ff3366] transition-all duration-300 group-hover:h-3/5 shadow-[0_0_10px_#ff3366] opacity-0 group-hover:opacity-100 rounded-r-md"></div>
            <Search size={20} className={`transition-colors relative z-10 ${isDark ? 'text-white/40 group-hover:text-white/80' : 'text-slate-400 group-hover:text-slate-700'}`} />
            <span className="text-sm font-medium relative z-10">Chat Search</span>
          </button>
        </div>

        {/* Divider */}
        <div className={`mx-6 h-px mb-6 relative z-10 ${isDark ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`}></div>

        {/* Chat List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: isDark ? 'rgba(255,255,255,0.1) transparent' : 'rgba(0,0,0,0.1) transparent' }}>
          <h3 className={`px-2 text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>My Chat</h3>
          <ul className="space-y-1">
            {recentChats.map((chat) => (
              <li key={chat.id}>
                <button
                  title={chat.title}
                  onClick={() => onChatSelect?.(chat.id)}
                  className={`relative w-full text-left flex items-center justify-between px-4 py-2.5 rounded-full transition-all duration-300 group border overflow-hidden ${isDark
                    ? 'hover:bg-white/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] border-transparent hover:border-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-white/60 hover:shadow-[0_4px_10px_rgba(59,130,246,0.1)] border-transparent hover:border-white/80 text-slate-600 hover:text-slate-900 bg-white/10'
                    }`}>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[#3B82F6] transition-all duration-300 group-hover:h-3/5 shadow-[0_0_10px_#3B82F6] opacity-0 group-hover:opacity-100 rounded-r-md"></div>
                  <span className="text-sm truncate max-w-[160px] relative z-10">
                    {chat.title}
                  </span>
                  <MoreHorizontal size={14} className={`transition-all opacity-0 group-hover:opacity-100 relative z-10 ${isDark ? 'text-white/0 group-hover:text-white/30' : 'text-transparent group-hover:text-slate-400'}`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};