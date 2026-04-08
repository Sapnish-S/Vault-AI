import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (role: string) => void;
  isDark?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onSave, isDark = true }) => {
  const [role, setRole] = useState(user?.role || '');

  useEffect(() => {
    setRole(user?.role || '');
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 transform scale-100 opacity-100 animate-in zoom-in-95 duration-200 ${
        isDark 
          ? 'bg-[#1a1e26] border border-white/10' 
          : 'bg-white border border-slate-200'
      }`}>
        <div className={`flex justify-between items-center px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
          <h2 className={`font-semibold tracking-wide flex items-center gap-2 ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
            <User size={18} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
            Edit Profile
          </h2>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Name
            </label>
            <input 
              type="text" 
              value={`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || 'User'} 
              disabled
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium opacity-60 cursor-not-allowed ${
                isDark 
                  ? 'bg-white/5 border border-white/5 text-white' 
                  : 'bg-slate-50 border border-slate-200 text-slate-700'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Role
            </label>
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-300 outline-none ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'bg-white border border-slate-200 text-slate-800 focus:border-blue-400 focus:shadow-sm'
              }`}
            />
          </div>
        </div>

        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            Cancel
          </button>
          <button 
            onClick={() => {
                onSave(role);
                onClose();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
