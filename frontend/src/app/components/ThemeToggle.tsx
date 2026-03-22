import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark?: boolean;
  onToggle?: (isDark: boolean) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark = true, onToggle }) => {
  const [dark, setDark] = useState(isDark);

  const handleToggle = () => {
    const newState = !dark;
    setDark(newState);
    onToggle?.(newState);
  };

  return (
    <button 
      onClick={handleToggle}
      className="relative flex items-center w-[76px] h-[38px] rounded-[24px] p-1 transition-colors duration-500 overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(180deg, #1b1d24 0%, #2b2f3a 100%)',
        boxShadow: 'inset 0px 4px 8px rgba(0,0,0,0.5), inset 0px -1px 2px rgba(255,255,255,0.1), 0 1px 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Background Track Glow matching the image */}
      <div className={`absolute -left-10 -top-10 w-32 h-32 bg-white/20 blur-[24px] rounded-full pointer-events-none transition-opacity duration-700 ${dark ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-amber-200/20 blur-[24px] rounded-full pointer-events-none transition-opacity duration-700 ${!dark ? 'opacity-100' : 'opacity-0'}`} />

      {/* Track Icons */}
      <div className="absolute inset-0 flex justify-between items-center px-[12px] pointer-events-none">
        <Moon 
            size={16} 
            className={`transition-all duration-500 text-[#8b92a5] ${!dark ? 'opacity-60 scale-100' : 'opacity-0 scale-75'}`} 
            strokeWidth={2.5}
        />
        <Sun 
            size={16} 
            className={`transition-all duration-500 text-[#8b92a5] ${dark ? 'opacity-60 scale-100' : 'opacity-0 scale-75'}`} 
            strokeWidth={2.5}
        />
      </div>

      {/* Thumb */}
      <div 
        className={`relative flex items-center justify-center w-[30px] h-[30px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 ${
          dark ? 'translate-x-0' : 'translate-x-[38px]'
        }`}
        style={{
          background: 'linear-gradient(135deg, #3f4453 0%, #262933 100%)',
          boxShadow: dark 
            ? '-2px 0px 10px 1px rgba(255,255,255,0.3), inset 1px 1px 2px rgba(255,255,255,0.4), 0px 4px 8px rgba(0,0,0,0.5)' 
            : '2px 0px 10px 1px rgba(255,255,255,0.3), inset -1px 1px 2px rgba(255,255,255,0.4), 0px 4px 8px rgba(0,0,0,0.5)',
        }}
      >
         {/* Thumb Icon */}
         <div className="relative w-full h-full flex items-center justify-center">
             <Moon 
                 size={15} 
                 className={`absolute transition-all duration-500 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] ${dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
                 strokeWidth={2.5}
             />
             <Sun 
                 size={15} 
                 className={`absolute transition-all duration-500 text-amber-50 drop-shadow-[0_0_4px_rgba(255,200,100,0.8)] ${dark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
                 strokeWidth={2.5}
             />
         </div>
      </div>
    </button>
  );
};
