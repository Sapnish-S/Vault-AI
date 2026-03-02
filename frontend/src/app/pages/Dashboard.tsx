import React, { useState, useEffect, useCallback } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { VaultPanel } from '../components/VaultPanel';
import { DraggableGrid } from '../components/DraggableGrid';
import { FolderView } from '../components/FolderView';
import { VectorLoading } from '../components/VectorLoading';
import { ChatInterface } from '../components/ChatInterface';
import { CosmicNebulaBackground } from '../components/CosmicNebulaBackground';
import { RECENT_CHATS } from '../constants';
import { VaultFolder, VaultFile, Document } from '../types';

const API_BASE = 'http://localhost:8000';

type ViewState = 'home' | 'loading' | 'chat';

// Retrieve the logged-in user from localStorage
function getUser(): { user_id: number; username: string } | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [vaults, setVaults] = useState<VaultFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<VaultFolder | null>(null);
  const [folderFiles, setFolderFiles] = useState<VaultFile[]>([]);
  const [viewState, setViewState] = useState<ViewState>('home');
  const [uploadingVault, setUploadingVault] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  // ── Fetch vault list from backend ────────────────────────────────────────
  const fetchVaults = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/vaults?user_id=${user.user_id}`);
      if (!res.ok) return;
      const data = await res.json();
      // Map backend response to VaultFolder shape
      setVaults(
        data.vaults.map((v: { name: string; file_count: number }) => ({
          id: v.name,       // vault_name is used as the unique ID
          name: v.name,
          itemCount: v.file_count,
        }))
      );
    } catch {
      // silently ignore network errors on load
    }
  }, [user?.user_id]);

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  // ── Fetch files for a specific vault ────────────────────────────────────
  const fetchVaultFiles = async (vaultName: string): Promise<VaultFile[]> => {
    if (!user) return [];
    try {
      const res = await fetch(`${API_BASE}/vaults/${encodeURIComponent(vaultName)}/files?user_id=${user.user_id}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.files as VaultFile[];
    } catch {
      return [];
    }
  };

  // ── Create an empty vault ───────────────────────────────────────────────
  const handleCreateVault = async (vaultName: string) => {
    if (!user) return;
    setUploadError('');
    try {
      const res = await fetch(`${API_BASE}/vaults`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vault_name: vaultName, user_id: user.user_id })
      });
      if (!res.ok) {
        const data = await res.json();
        setUploadError(data.detail || 'Failed to create vault.');
        return;
      }
      await fetchVaults();
    } catch {
      setUploadError('Unable to reach the server.');
    }
  };

  // ── Upload a PDF to a vault ──────────────────────────────────────────────
  const handleAddFile = async (vaultName: string, file: File) => {
    if (!user) return;
    setUploadError('');
    setUploadingVault(vaultName);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('domain', vaultName);
      formData.append('user_id', String(user.user_id));

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.status === 409) {
        setUploadError(data.detail);
        return;
      }
      if (!res.ok) {
        setUploadError(data.detail || 'Upload failed. Please try again.');
        return;
      }

      // Refresh vault and file lists
      await fetchVaults();
      const updatedFiles = await fetchVaultFiles(vaultName);
      setFolderFiles(updatedFiles);
    } catch {
      setUploadError('Unable to reach the server. Is the backend running?');
    } finally {
      setUploadingVault(null);
    }
  };

  // ── Folder selection ─────────────────────────────────────────────────────
  const handleFolderClick = async (folder: VaultFolder) => {
    setSelectedFolder(folder);
    const files = await fetchVaultFiles(folder.id);
    setFolderFiles(files);
  };

  const handleCloseFolderView = () => {
    setSelectedFolder(null);
    setFolderFiles([]);
  };

  // Map VaultFile[] → Document[] for FolderView
  const folderDocuments: Document[] = folderFiles.map((f, i) => ({
    id: String(i),
    name: f.filename,
    type: 'pdf',
  }));

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen flex bg-[#020204] text-white overflow-hidden font-sans selection:bg-cyan-500/30">

      {/* --- Full Screen Cosmic Nebula Background --- */}
      <CosmicNebulaBackground />

      {/* Sidebar (Z-30) */}
      <div className="relative z-30 h-full">
        <Sidebar recentChats={RECENT_CHATS} />
      </div>

      {/* Main Canvas (Z-20) */}
      <main className="flex-1 flex flex-col relative z-20 h-full p-8 md:p-12 overflow-hidden">

        {/* Top Bar */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-2">
          {/* Upload error toast */}
          {uploadError && (
            <div
              className="px-4 py-2 rounded-lg text-xs text-red-300 max-w-xs text-right animate-fade-in"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
            >
              {uploadError}
              <button onClick={() => setUploadError('')} className="ml-2 text-red-400 hover:text-red-200">✕</button>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-3 rounded-full text-white/30 hover:text-red-400 hover:bg-white/10 transition-all duration-500 backdrop-blur-md border border-white/5 group"
          >
            <LogOut size={18} />
          </button>
          <button className="p-3 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-md border border-white/5 group">
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" />
          </button>
        </div>

        {viewState === 'loading' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <VectorLoading onComplete={() => setViewState('chat')} />
          </div>
        )}

        {viewState === 'chat' && (
          <ChatInterface onBack={() => setViewState('home')} />
        )}

        {viewState === 'home' && (
          !selectedFolder ? (
            <>
              {/* Hero Section */}
              <div className="flex flex-col items-center justify-center mt-12 mb-20 relative animate-[fadeIn_0.8s_ease-out] z-30">
                <div className="relative flex flex-col items-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />
                  <h1 className="relative z-10 text-center leading-tight tracking-tight drop-shadow-2xl">
                    <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 tracking-tight whitespace-nowrap px-[21px] py-[0px] mx-[11px] my-[0px] text-[64px]" style={{ fontFamily: "'Source Serif 4', serif" }}>
                      Your Private AI Assistant
                    </span>
                  </h1>
                  <div className="mt-6 flex items-center gap-4 opacity-70">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                    <p className="text-blue-100/80 font-light tracking-[0.4em] uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] text-[8px]">
                      Secure • Intelligent • Ethereal
                    </p>
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                  </div>
                </div>

                {/* Draggable Grid */}
                <div className="mt-12 scale-90 opacity-90 hover:opacity-100 transition-opacity duration-500">
                  <DraggableGrid />
                </div>
              </div>

              {/* Vault Panel Area */}
              <div className="relative z-30 w-full max-w-6xl mx-auto">
                <VaultPanel
                  folders={vaults}
                  onFolderClick={handleFolderClick}
                  onCreateVault={handleCreateVault}
                />
              </div>
            </>
          ) : (
            /* Folder View — shows real files from the backend */
            <FolderView
              folderName={selectedFolder.name}
              documents={folderDocuments}
              isUploading={uploadingVault === selectedFolder.name}
              onClose={handleCloseFolderView}
              onStartChat={() => setViewState('loading')}
              onAddFile={(file) => handleAddFile(selectedFolder.name, file)}
            />
          )
        )}

      </main>
    </div>
  );
};