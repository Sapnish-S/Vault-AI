import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vaultName: string) => void;
  isDark?: boolean;
}

export const CreateVaultModal: React.FC<CreateVaultModalProps> = ({ isOpen, onClose, onSubmit, isDark = true }) => {
  const [vaultName, setVaultName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vaultName.trim()) {
      onSubmit(vaultName.trim());
      setVaultName('');
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-500 ${isDark ? 'bg-[#05070A]/90' : 'bg-white/80'}`}>
      <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all border ${isDark ? 'bg-gradient-to-b from-[#1c2e3c] to-[#0c131a] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-500'}`}>
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <FolderPlus size={24} />
          </div>
          <h2 className="text-xl font-semibold">Create New Vault</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className={`block text-sm mb-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Vault Name</label>
            <input 
              type="text" 
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
              placeholder="e.g. Q4 Financials"
              className={`w-full px-4 py-3 rounded-xl outline-none transition-all border ${isDark ? 'bg-black/20 border-white/10 focus:border-blue-500/50 text-white placeholder-white/30 shadow-inner' : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-900 placeholder-slate-400'}`}
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'hover:bg-white/5 text-white/70' : 'hover:bg-slate-100 text-slate-600'}`}>
              Cancel
            </button>
            <button type="submit" disabled={!vaultName.trim()} className={`px-5 py-2.5 rounded-xl font-medium transition-all ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md hover:shadow-lg'}`}>
              Create Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
