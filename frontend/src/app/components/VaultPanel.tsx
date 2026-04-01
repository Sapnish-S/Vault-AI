import React from 'react';
import { Shield, Plus, MoreHorizontal, Copy } from 'lucide-react';
import { VaultFolder } from '../types';

interface VaultPanelProps {
  folders: VaultFolder[];
  onFolderClick?: (folder: VaultFolder) => void;
  onCreateVaultClick?: () => void;
  isDark?: boolean;
}

export const VaultPanel: React.FC<VaultPanelProps> = ({ folders, onFolderClick, onCreateVaultClick, isDark = true }) => {
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 relative z-40 animate-fade-in-up -mt-[80px]">
        
      {/* Glass Container */}
      <div 
        className={`relative flex-1 mx-auto backdrop-blur-3xl rounded-3xl p-8 overflow-hidden transition-all duration-700 ${
          isDark 
            ? 'bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.01] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-20px_40px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.4)] before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' 
            : 'bg-white/50 shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.05)] border border-white/80 before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.6)_0%,transparent_70%)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]'
        } before:absolute before:inset-x-0 before:top-0 before:h-1/3 before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none`}
        style={{ width: 'calc(95% + 26px)', transform: 'translate(13px, 26px)' }}
      >
        
        {/* Panel Header */}
        <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
          <Shield size={16} className={`transition-colors ${isDark ? 'text-blue-400/80 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-blue-500 drop-shadow-md'}`} />
          <h2 className={`text-sm font-bold tracking-widest uppercase transition-colors ${isDark ? 'text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-slate-700 drop-shadow-sm'}`}>My Vault</h2>
        </div>

        {/* Add Button */}
        <button 
          onClick={onCreateVaultClick}
          className={`absolute top-6 right-6 w-12 h-12 rounded-full border flex items-center justify-center hover:scale-105 transition-all duration-300 z-20 group ${
          isDark 
            ? 'border-white/20 text-white/50 hover:text-white hover:border-white/50 hover:bg-white/5' 
            : 'border-slate-300/50 text-slate-400 hover:text-slate-700 hover:border-slate-400 hover:bg-white/50 bg-white/20 shadow-sm'
        }`}>
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Content Grid */}
        <div className="w-full h-full overflow-y-auto vault-scrollbar pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-[58px] pb-12 px-2 max-w-7xl mx-auto">
                {folders.map((folder, index) => {
                    const safeId = folder.id || folder.name.replace(/\s+/g, '-').toLowerCase() + '-' + index;
                    return (
                    <div 
                        key={safeId}
                        onClick={() => onFolderClick?.(folder)}
                        className="group relative w-[90%] mx-auto aspect-[320/280] cursor-pointer transition-all duration-500 hover:-translate-y-2"
                    >
                        {/* Folder Content Container */}
                        <div className="absolute inset-0">
                            
                            {/* Back Body (Container 1) - Dark Cyan Metallic Glass */}
                            <div 
                                className={`absolute inset-0 rounded-[32px] overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] border ${isDark ? 'border-[#86B3CD]/20' : 'border-[#86B3CD]/40'}`}
                                style={{
                                    background: isDark
                                      ? `linear-gradient(145deg,
                                          rgba(28, 46, 60, 0.98) 0%,
                                          rgba(20, 32, 43, 0.95) 26%,
                                          rgba(12, 19, 26, 0.9) 58%,
                                          rgba(38, 61, 80, 0.95) 100%
                                        )`
                                      : `linear-gradient(145deg,
                                          rgba(112, 155, 185, 0.95) 0%,
                                          rgba(82, 122, 150, 0.88) 26%,
                                          rgba(62, 97, 122, 0.82) 58%,
                                          rgba(134, 179, 205, 0.92) 100%
                                        )`,
                                    boxShadow: isDark
                                      ? `
                                          inset 0 1px 0 rgba(134,179,205,0.25),
                                          inset 0 -10px 18px rgba(0,0,0,0.6),
                                          0 10px 24px rgba(0,0,0,0.5)
                                        `
                                      : `
                                          inset 0 1px 0 rgba(255,255,255,0.5),
                                          inset 0 -10px 18px rgba(22,37,52,0.3),
                                          0 10px 24px rgba(0,0,0,0.2)
                                        `
                                }}
                            >
                                {/* Metallic Highlight Overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                      background: isDark
                                        ? `linear-gradient(135deg, rgba(134,179,205,0.4) 0%, rgba(134,179,205,0.15) 18%, rgba(255,255,255,0.02) 40%, rgba(134,179,205,0.2) 100%)`
                                        : `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 18%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.25) 100%)`
                                    }}
                                />
                                {/* Marble Streak / Vein Overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-30"
                                    style={{
                                      background: `
                                        radial-gradient(circle at 22% 26%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 26%),
                                        linear-gradient(
                                          118deg,
                                          rgba(255,255,255,0) 0%,
                                          rgba(255,255,255,0.08) 34%,
                                          rgba(255,255,255,0.02) 52%,
                                          rgba(255,255,255,0.10) 68%,
                                          rgba(255,255,255,0) 100%
                                        )
                                      `
                                    }}
                                />
                            </div>

                            {/* Papers Wrapper - 크기 30% 축소 */}
                            <div className="absolute top-[8.5%] left-0 w-full h-[42.8%] pointer-events-none z-10 scale-[0.7] origin-[50%_90%]">
                                {/* Paper 3 (Right) - Container 3 */}
                                <div 
                                    className="absolute left-[40.7%] top-[11.2%] w-[36.25%] h-[120%] rounded-[14px] border-[0.89px] border-[rgba(200,220,255,0.35)] shadow-[0_10px_22px_rgba(40,60,100,0.25)] rotate-[12deg] transition-all duration-500 group-hover:translate-x-5 group-hover:-translate-y-3 group-hover:rotate-[18deg] p-3 flex flex-col gap-2 overflow-hidden"
                                    style={{
                                        background: `linear-gradient(145deg, rgba(245,249,255,0.95) 0%, rgba(221,235,255,0.92) 28%, rgba(183,208,245,0.88) 55%, rgba(235,242,255,0.94) 100%)`
                                    }}
                                >
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 18%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.25) 100%)` }} />
                                    <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: `radial-gradient(circle at 25% 30%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 70% 65%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 28%), linear-gradient(118deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.14) 70%, rgba(255,255,255,0) 100%)` }} />
                                    <div className="relative z-10 w-[70%] h-[16%] bg-[#8ea8c7]/40 rounded-full mt-2 ml-1"></div>
                                    <div className="relative z-10 w-[58%] h-[14%] bg-[#8ea8c7]/40 rounded-full ml-1"></div>
                                </div>

                                {/* Paper 2 (Middle) - Container 6 */}
                                <div 
                                    className="absolute left-[31.6%] top-[10.5%] w-[38.75%] h-[133%] rounded-[14px] border-[0.89px] border-[rgba(200,220,255,0.4)] shadow-[0_12px_24px_rgba(40,60,100,0.22)] rotate-[2deg] transition-all duration-500 group-hover:-translate-y-5 p-3.5 flex flex-col gap-2.5 overflow-hidden"
                                    style={{
                                        background: `linear-gradient(145deg, rgba(250,252,255,0.95) 0%, rgba(219,231,255,0.92) 28%, rgba(195,215,250,0.88) 55%, rgba(240,245,255,0.94) 100%)`
                                    }}
                                >
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 18%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.3) 100%)` }} />
                                    <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: `radial-gradient(circle at 25% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 70% 65%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 28%), linear-gradient(118deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 35%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.18) 70%, rgba(255,255,255,0) 100%)` }} />
                                    <div className="relative z-10 w-[66%] h-[10%] bg-[#8ea8c7]/50 rounded-full mt-2"></div>
                                    <div className="relative z-10 w-[73%] h-[10%] bg-[#8ea8c7]/40 rounded-full"></div>
                                    <div className="relative z-10 w-[48%] h-[9%] bg-[#8ea8c7]/40 rounded-full"></div>
                                </div>

                                {/* Paper 1 (Left) - Container 10 */}
                                <div 
                                    className="absolute left-[11.6%] top-[-0.8%] w-[41.25%] h-[146%] rounded-[14px] border-[0.89px] border-[rgba(200,220,255,0.5)] shadow-[0_16px_32px_rgba(40,60,100,0.2)] -rotate-[6deg] transition-all duration-500 group-hover:-translate-x-4 group-hover:-translate-y-4 group-hover:-rotate-[12deg] p-4 flex flex-col gap-2.5 overflow-hidden"
                                    style={{
                                        background: `linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(238,244,255,0.94) 28%, rgba(215,230,255,0.9) 55%, rgba(248,250,255,0.96) 100%)`
                                    }}
                                >
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 18%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.4) 100%)` }} />
                                    <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: `radial-gradient(circle at 25% 30%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 70% 65%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 28%), linear-gradient(118deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 35%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0) 100%)` }} />
                                    <div className="relative z-10 w-[74%] h-[10%] bg-[#8ea8c7]/60 rounded-full mt-1"></div>
                                    <div className="relative z-10 w-[68%] h-[9.5%] bg-[#8ea8c7]/50 rounded-full"></div>
                                    <div className="relative z-10 w-[56%] h-[9%] bg-[#8ea8c7]/40 rounded-full"></div>
                                </div>
                            </div>

                            {/* Front Glass Clip Path */}
                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <clipPath id={`front-tab-clip-${safeId}`} clipPathUnits="objectBoundingBox">
                                        <path d="M 0,1.5 L 0,0.105 C 0,0.05 0.02,0 0.052,0 L 0.38,0 C 0.43,0 0.45,0.16 0.52,0.16 L 0.948,0.16 C 0.98,0.16 1,0.18 1,0.26 L 1,1.5 Z" />
                                    </clipPath>
                                </defs>
                            </svg>

                            {/* Front Glass Wrapper */}
                            <div className="absolute w-[95%] h-[54.2%] left-[2.5%] bottom-[2.8%] z-20">
                                
                                {/* Top Shadow/Glows */}
                                <div className="absolute top-[-16px] left-0 w-full h-[32px] bg-black/10 blur-[12px] opacity-40 rounded-full pointer-events-none"></div>
                                <div className="absolute top-[-24px] left-[10%] w-[80%] h-[40px] bg-white/30 blur-[16px] rounded-full pointer-events-none mix-blend-overlay"></div>

                                {/* The Dark Glass Body */}
                                <div 
                                    className="absolute inset-0 backdrop-blur-[20px] rounded-b-[24px] transition-all duration-500 overflow-hidden"
                                    style={{ clipPath: `url(#front-tab-clip-${safeId})` }}
                                >
                                    {/* Gradients matching Figma */}
                                    <div className="absolute inset-0 transition-colors duration-500 group-hover:from-[#6a6c74]/70 group-hover:via-[#3a3c42]/75 group-hover:to-[#25262a]/80" style={{ backgroundImage: "linear-gradient(153.4deg, rgba(94, 96, 103, 0.6) 0%, rgba(54, 56, 60, 0.65) 50%, rgba(33, 34, 38, 0.75) 100%)" }}></div>
                                    <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(26.5deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(0, 0, 0, 0) 100%)" }}></div>
                                    <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: "linear-gradient(153.4deg, rgba(255, 255, 255, 0.5) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }}></div>
                                    
                                    {/* Inner Light/Shadow Bevel */}
                                    <div className="absolute inset-0 rounded-b-[24px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),inset_-1px_-1px_3px_rgba(0,0,0,0.6)] pointer-events-none"></div>
                                </div>
                                
                                {/* Precise SVG Edge Highlight mapped to the clip-path */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-100 z-30 drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]" preserveAspectRatio="none" viewBox="0 0 304 152">
                                    <path 
                                        d="M 0,16 C 0,8 6,0 16,0 L 115.5,0 C 130,0 136,24.3 158,24.3 L 288,24.3 C 297,24.3 304,27 304,39" 
                                        fill="none" 
                                        stroke="rgba(255,255,255,0.9)" 
                                        strokeWidth="1.5" 
                                        vectorEffect="non-scaling-stroke"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {/* Card Foreground Info */}
                                <div className="absolute inset-0 flex flex-col justify-between p-5 lg:p-6 z-30 pointer-events-none">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1 mt-1">
                                            <h3 className="font-semibold text-base lg:text-[17px] text-[#f1f2f4] tracking-[0.4px] leading-tight drop-shadow-sm">
                                                {folder.name}
                                            </h3>
                                            <p className="font-medium text-xs lg:text-[14px] text-[#989ca5] leading-tight">
                                                Notes & More
                                            </p>
                                        </div>
                                        <button className="text-[#989ca5] hover:text-white transition-colors p-1 pointer-events-auto -mt-1 -mr-1">
                                            <MoreHorizontal size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5 opacity-80 mb-[-2px] ml-1">
                                        <Copy size={14} className="text-[#989ca5]" />
                                        <span className="font-medium text-[11px] lg:text-[12px] text-[#989ca5]">
                                            {folder.file_count} Files
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};
