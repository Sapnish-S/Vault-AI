import React from 'react';
import { FileText, X } from 'lucide-react';
import { Document } from '../types';

interface FolderViewProps {
  folderName: string;
  documents: Document[];
  onClose: () => void;
}

export const FolderView: React.FC<FolderViewProps> = ({ folderName, documents, onClose }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start pt-12 px-8 animate-[fadeIn_0.4s_ease-out]">
      
      {/* Close Button - Top Right */}
      <button
        onClick={onClose}
        className="absolute top-8 right-24 p-3 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
      >
        <X size={24} />
      </button>

      {/* Folder Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light text-white/95 tracking-tight font-serif">
          {folderName}
        </h1>
      </div>

      {/* My Documents Section */}
      <div className="w-full max-w-3xl">
        <h2 className="text-lg font-light text-white/70 mb-4 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
          My Documents
        </h2>

        {/* Glassmorphism Container */}
        <div
          className="relative rounded-3xl p-8 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01] backdrop-blur-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-20px_40px_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.3)] before:absolute before:inset-x-0 before:top-0 before:h-1/3 before:rounded-3xl before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] after:pointer-events-none"
        >
          {/* Documents List */}
          <div className="space-y-3 mb-8 relative z-10">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer group"
                style={{
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FileText className="text-white/40 group-hover:text-white/60 transition-colors" size={20} />
                <span className="text-white/80 group-hover:text-white transition-colors font-light">
                  {doc.name}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 relative z-10">
            <button
              className="px-6 py-2.5 rounded-xl font-light text-sm transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Add More
            </button>
            <button
              className="px-6 py-2.5 rounded-xl font-light text-sm transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Start Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};