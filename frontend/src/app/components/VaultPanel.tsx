import React from 'react';
import { Shield, Plus, MoreHorizontal } from 'lucide-react';
import { VaultFolder } from '../types';

interface VaultPanelProps {
  folders: VaultFolder[];
  onFolderClick?: (folder: VaultFolder) => void;
}

export const VaultPanel: React.FC<VaultPanelProps> = ({ folders, onFolderClick }) => {
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 relative z-10 animate-fade-in-up">
        
      {/* Panel Header */}
      <div className="w-[95%] mx-auto flex items-center gap-2 px-1 mb-4 -mt-8">
        <Shield size={16} className="text-blue-400/80" />
        <h2 className="text-sm font-bold text-white/40 tracking-widest uppercase">My Vault</h2>
      </div>

      {/* Glass Container */}
      <div className="relative flex-1 w-[95%] mx-auto bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01] backdrop-blur-3xl rounded-3xl p-8 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-20px_40px_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.3)] before:absolute before:inset-x-0 before:top-0 before:h-1/3 before:rounded-3xl before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] after:pointer-events-none -mt-12">
        
        {/* Inner Add Button (Floating top-left of container content as per sketch) */}
        <button className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 hover:bg-white/5 hover:scale-105 transition-all duration-300 z-20 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Content Grid */}
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8 pb-12">
                {folders.map((folder) => (
                    <div 
                        key={folder.id}
                        onClick={() => onFolderClick?.(folder)}
                        className="group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-500 cursor-pointer"
                    >
                        {/* Custom Glass Folder Icon Construction */}
                        <div className="relative w-24 h-24 flex items-end justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                            {/* Back Sheet (Paper) */}
                            <div className="absolute top-3 w-14 h-16 bg-gradient-to-b from-[#3B82F6] to-[#1d4ed8] rounded-md rounded-tr-[20px] z-0"></div>
                            
                            {/* Front Glass Pocket */}
                            <div className="relative w-20 h-14 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border-t border-l border-white/20 border-r border-white/10 rounded-xl shadow-lg z-10 flex items-center justify-center overflow-hidden">
                                {/* Subtle sheen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-30"></div>
                            </div>
                            
                            {/* Item count badge (Floating top-right of folder) */}
                            <span className="absolute top-2 right-2 z-20 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                                {folder.itemCount}
                            </span>
                        </div>
                        
                        {/* Label */}
                        <span className="text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                            {folder.name}
                        </span>
                    </div>
                ))}

                {/* Overflow Indicator Card */}
                
            </div>
        </div>
      </div>
    </div>
  );
};