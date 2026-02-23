import React from 'react';
import { Logo } from './Logo';
import { Edit3, Search, MoreHorizontal, X } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  recentChats: ChatSession[];
}

export const Sidebar: React.FC<SidebarProps> = ({ recentChats }) => {
  return (
    <div className="relative flex flex-col w-72 h-full z-20 border-r border-vault-border bg-[#050505]/60 backdrop-blur-xl">
      {/* Header Area */}
      <div className="flex items-center justify-between px-5 py-4">
        <Logo />
        <button className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
        </button>
      </div>

      {/* Primary Actions */}
      <div className="px-4 space-y-3 mb-8">
        {/* New Chat - Pill Shape Hover */}
        <button className="group w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 hover:bg-[#1F1F2E] hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] text-blue-100/90 hover:text-white border border-transparent hover:border-white/5">
          <Edit3 size={20} className="text-white/40 group-hover:text-white/80 transition-colors" />
          <span className="text-sm font-medium">New Chat</span>
        </button>

        <button className="group w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 hover:bg-[#1F1F2E] hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] text-white/50 hover:text-white border border-transparent hover:border-white/5">
          <Search size={20} className="text-white/40 group-hover:text-white/80 transition-colors" />
          <span className="text-sm font-medium">Chat Search</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-transparent hover:border-white/5 cursor-pointer group transition-all duration-300 hover:bg-[#1F1F2E] hover:shadow-[0_0_20px_rgba(79,70,229,0.2)]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden">
             {/* Simple Avatar Placeholder */}
             <span className="text-xs font-bold text-white/70">AL</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white/90 group-hover:text-white">Ari Lee</span>
            <span className="text-xs text-white/40 group-hover:text-blue-300 transition-colors">Sales Manager</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <h3 className="px-4 text-xs font-bold text-white/30 uppercase tracking-widest mb-3">My Chat</h3>
        <ul className="space-y-1">
          {recentChats.map((chat) => (
            <li key={chat.id}>
              <button className="w-full text-left flex items-center justify-between px-4 py-2.5 rounded-full transition-all duration-300 hover:bg-[#1F1F2E] hover:shadow-[0_0_15px_rgba(79,70,229,0.15)] group border border-transparent hover:border-white/5">
                <span className="text-sm text-white/60 group-hover:text-white truncate max-w-[160px]">
                  {chat.title}
                </span>
                <MoreHorizontal size={14} className="text-white/0 group-hover:text-white/30 transition-all opacity-0 group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};