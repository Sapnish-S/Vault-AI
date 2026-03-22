import React from 'react';
import { FileText, X } from 'lucide-react';
import { Document } from '../types';

interface FolderViewProps {
  folderName: string;
  documents: Document[];
  onClose: () => void;
  onStartChat: () => void;
  isDark?: boolean;
}

export const FolderView: React.FC<FolderViewProps> = ({ folderName, documents, onClose, onStartChat, isDark = true }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start pt-12 px-8 animate-[fadeIn_0.4s_ease-out]">

      {/* Close Button - Top Right */}
      <button
        onClick={onClose}
        className={`absolute top-8 right-24 p-3 rounded-full transition-all duration-300 ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-800 hover:bg-black/5'}`}
      >
        <X size={24} />
      </button>

      {/* Folder Title */}
      <div className="text-center mb-12">
        <h1 className={`text-5xl font-light tracking-tight font-serif transition-colors ${isDark ? 'text-white/95' : 'text-slate-800'}`}>
          {folderName}
        </h1>
      </div>

      {/* My Documents Section */}
      <div className="w-full max-w-3xl">
        <h2 className={`text-lg font-light mb-4 tracking-wide transition-colors ${isDark ? 'text-white/70' : 'text-slate-500'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
          My Documents
        </h2>

        {/* Glassmorphism Container */}
        <div
          className={`relative rounded-3xl p-8 backdrop-blur-3xl overflow-hidden transition-all duration-700 ${isDark
              ? 'bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-20px_40px_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.3)] before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]'
              : 'bg-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4)_0%,transparent_70%)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]'
            } before:absolute before:inset-x-0 before:top-0 before:h-1/3 before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none`}
        >
          {/* Documents List */}
          <div className="space-y-3 mb-8 relative z-10">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer group ${isDark ? 'hover:bg-white/5' : 'hover:bg-white/60'}`}
                style={{
                  background: 'transparent',
                }}
              >
                <FileText className={`transition-colors ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-slate-400 group-hover:text-blue-500'}`} size={20} />
                <span className={`font-light transition-colors ${isDark ? 'text-white/80 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {doc.name}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className={`flex justify-end gap-3 pt-4 border-t relative z-10 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
            <button
              className={`px-6 py-2.5 rounded-xl font-light text-sm transition-all duration-300 ${isDark
                  ? 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  : 'bg-white/50 border border-white/80 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }`}
            >
              Add More
            </button>
            <button
              onClick={onStartChat}
              className={`group relative px-8 py-3 rounded-xl font-medium tracking-wide transition-all duration-500 backdrop-blur-xl overflow-hidden ${isDark
                  ? 'bg-blue-900/20 hover:bg-blue-800/30 text-blue-50 border border-white/10 hover:border-white/20 shadow-[0_0_20px_rgba(30,58,138,0.2)] hover:shadow-[0_0_35px_rgba(59,130,246,0.3)]'
                  : 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-400 shadow-md hover:shadow-lg'
                }`}
            >
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />

              <span className="relative z-10 flex items-center justify-center">
                Start Conversation
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};