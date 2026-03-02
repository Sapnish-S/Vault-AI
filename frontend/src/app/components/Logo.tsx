import React from 'react';
import { Shield } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
        <Shield size={18} className="text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-white/90 font-serif">
        Vault AI
      </span>
    </div>
  );
};