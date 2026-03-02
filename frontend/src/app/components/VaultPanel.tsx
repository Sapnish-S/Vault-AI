import React, { useState } from 'react';
import { Shield, Plus, X } from 'lucide-react';
import { VaultFolder } from '../types';

interface VaultPanelProps {
  folders: VaultFolder[];
  onFolderClick?: (folder: VaultFolder) => void;
  onCreateVault: (vaultName: string) => void;
}

export const VaultPanel: React.FC<VaultPanelProps> = ({
  folders,
  onFolderClick,
  onCreateVault,
}) => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [vaultNameInput, setVaultNameInput] = useState('');

  // ── Global + button → open custom modal ──────────────────────────────────
  const handlePlusClick = () => {
    setVaultNameInput('');
    setShowModal(true);
  };

  const handleCreateVault = () => {
    const trimmed = vaultNameInput.trim();
    if (!trimmed) return;
    setShowModal(false);
    onCreateVault(trimmed);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 relative z-10 animate-fade-in-up">

      {/* ── Create Vault Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-2xl p-8 flex flex-col gap-5"
            style={{
              background: 'rgba(10, 11, 14, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: `
                inset 0px 0px 30px rgba(255, 255, 255, 0.04),
                0 24px 60px rgba(0, 0, 0, 0.6)
              `,
            }}
          >
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div>
              <h2 className="text-white text-lg font-semibold tracking-wide">New Vault</h2>
              <p className="text-white/40 text-xs mt-1">Give your vault a name, then pick a PDF to upload.</p>
            </div>

            {/* Vault name input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50 tracking-wider uppercase">Name of the vault</label>
              <input
                type="text"
                value={vaultNameInput}
                onChange={(e) => setVaultNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateVault()}
                placeholder="e.g. Finance Reports"
                autoFocus
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06B6D4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Create Vault button */}
            <button
              onClick={handleCreateVault}
              disabled={!vaultNameInput.trim()}
              className="w-full py-3 rounded-xl text-white text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: vaultNameInput.trim()
                  ? 'rgba(56, 189, 248, 0.18)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
              onMouseEnter={(e) => {
                if (!vaultNameInput.trim()) return;
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.28)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = vaultNameInput.trim()
                  ? 'rgba(56, 189, 248, 0.18)'
                  : 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              Create Vault
            </button>
          </div>
        </div>
      )}

      {/* Panel Header */}
      <div className="w-[95%] mx-auto flex items-center gap-2 px-1 mb-4 -mt-8">
        <Shield size={16} className="text-blue-400/80" />
        <h2 className="text-sm font-bold text-white/40 tracking-widest uppercase">My Vault</h2>
      </div>

      {/* Glass Container */}
      <div className="relative flex-1 w-[95%] mx-auto bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01] backdrop-blur-3xl rounded-3xl p-8 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-20px_40px_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.3)] before:absolute before:inset-x-0 before:top-0 before:h-1/3 before:rounded-3xl before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] after:pointer-events-none -mt-12">

        {/* Global + Button */}
        <button
          onClick={handlePlusClick}
          title="Create a new vault"
          className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 hover:bg-white/5 hover:scale-105 transition-all duration-300 z-20 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Content Grid */}
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
          {folders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40 pt-16">
              <Shield size={40} className="text-blue-400/60" />
              <p className="text-white/50 text-sm text-center">
                Your vault is empty.<br />
                Click <strong>+</strong> to create your first vault.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8 pb-12">
              {folders.map((folder) => {
                return (
                  <div
                    key={folder.id}
                    onClick={() => onFolderClick?.(folder)}
                    className="group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative w-24 h-24 flex items-end justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                      <div className="absolute top-3 w-14 h-16 bg-gradient-to-b from-[#3B82F6] to-[#1d4ed8] rounded-md rounded-tr-[20px] z-0" />
                      <div className="relative w-20 h-14 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border-t border-l border-white/20 border-r border-white/10 rounded-xl shadow-lg z-10 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-30" />
                      </div>
                      <span className="absolute top-2 right-2 z-20 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                        {folder.itemCount}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white/50 group-hover:text-white transition-colors text-center">
                      {folder.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};