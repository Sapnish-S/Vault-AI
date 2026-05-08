import React, { useState, useEffect } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu';
import { Sidebar } from '../components/Sidebar';
import { VaultPanel } from '../components/VaultPanel';
import { DraggableGrid } from '../components/DraggableGrid';
import { FolderView } from '../components/FolderView';
import { VectorLoading } from '../components/VectorLoading';
import { ChatInterface } from '../components/ChatInterface';
import { ThemeToggle } from '../components/ThemeToggle';
import { CosmicNebulaBackground } from '../components/CosmicNebulaBackground';
import { VaultFolder, ChatSession } from '../types';
import { CreateVaultModal } from '../components/CreateVaultModal';
import { ChatHistoryTable } from '../components/ChatHistoryTable';
import { ProfileModal } from '../components/ProfileModal';

type ViewState = 'home' | 'loading' | 'chat' | 'past_chat' | 'chat_history';

export const Dashboard: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<VaultFolder | null>(null);
  const [viewState, setViewState] = useState<ViewState>('home');
  const [vaults, setVaults] = useState<VaultFolder[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const fetchVaults = async (userId: number) => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/vaults`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      if (data.vaults) {
        setVaults(data.vaults);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChats = async (userId: number) => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/chats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      if (data.chats) setChats(data.chats);
    } catch (e) { console.error(e); }
  };

  const fetchUser = async (userId: number) => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      if (data.first_name || data.username) setCurrentUser(data);
    } catch (e) { console.error(e); }
  };

  const getActiveUserId = () => {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr).id : 1;
  };

  const handleRoleSave = async (newRole: string) => {
    try {
      const activeUserId = getActiveUserId();
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/auth/profile/${activeUserId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        // Update local session
        const updatedUser = { ...currentUser, role: newRole };
        setCurrentUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error('Failed to update role', e);
    }
  };

  useEffect(() => {
    const activeUserId = getActiveUserId();
    
    fetchVaults(activeUserId);
    fetchChats(activeUserId);
    fetchUser(activeUserId);
  }, []);

  const handleCreateVault = async (name: string) => {
    try {
      const activeUserId = getActiveUserId();
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/vaults', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vault_name: name, user_id: activeUserId })
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        fetchVaults(activeUserId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVault = async (folder: VaultFolder) => {
    if (!window.confirm(`Are you sure you want to permanently delete '${folder.name}' and its chat history?`)) {
        return;
    }
    try {
        const activeUserId = getActiveUserId();
        const token = sessionStorage.getItem('token');
        const res = await fetch(`http://127.0.0.1:8000/vaults/${encodeURIComponent(folder.name)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setVaults(prev => prev.filter(v => v.name !== folder.name));
            fetchChats(activeUserId); 
        } else {
            console.error("Failed to delete vault");
        }
    } catch (e) {
        console.error(e);
    }
  };

  const handleFolderClick = (folder: VaultFolder) => {
    setSelectedFolder(folder);
  };

  const handleCloseFolderView = () => {
    setSelectedFolder(null);
  };

  const handleStartConversation = () => {
    setSelectedChatId(null);
    setViewState('loading');
    window.history.pushState({}, '', '/chat');
  };

  const handleHomeClick = () => {
    setViewState('home');
    setSelectedFolder(null);
    setSelectedChatId(null);
    window.history.pushState({}, '', '/dashboard');
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setViewState('past_chat');
    window.history.pushState({}, '', `/chat/past`);
  };

  const handleLoadingComplete = () => {
    setViewState('chat');
  };

  return (
    <div className={`relative w-full h-screen flex overflow-hidden font-sans transition-colors duration-700 ${isDark ? 'bg-[#05070A] text-white selection:bg-cyan-500/30' : 'bg-[#eef4f9] text-[#1e293b] selection:bg-blue-500/30'}`}>
      
      {/* --- Full Screen Cosmic Nebula Background --- */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <CosmicNebulaBackground />
      </div>
      
      {/* Light Mode Specific Background (Subtle Light Blue Grid/Glow) */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,#c4dafc40_0%,transparent_70%)] blur-[100px]" />
      </div>

      {/* Sidebar (Z-30) */}
      <div className="relative z-30 h-full">
        <Sidebar 
          recentChats={chats} 
          user={currentUser} 
          onChatSelect={handleChatSelect} 
          onHome={handleHomeClick} 
          onSearchClick={() => setViewState('chat_history')} 
          onProfileClick={() => setIsProfileModalOpen(true)}
          isDark={isDark} 
        />
      </div>

      {/* Main Canvas (Z-20) */}
      <main className="flex-1 flex flex-col relative z-20 h-full p-12 overflow-hidden">
        
        {/* Top Bar: Settings & Theme Toggle */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={setIsDark} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`p-3 rounded-full transition-all duration-500 backdrop-blur-md border group ${
                isDark 
                  ? 'text-white/30 hover:text-white hover:bg-white/10 border-white/5' 
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-black/5 border-black/5'
              }`}>
                <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-48 mt-2 shadow-xl border backdrop-blur-xl ${isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-800'}`}>
              <DropdownMenuItem 
                onClick={handleLogout}
                className={`cursor-pointer flex items-center gap-2 font-medium transition-colors ${isDark ? 'text-red-400 focus:bg-red-500/20 focus:text-red-400' : 'text-red-600 focus:bg-red-50 focus:text-red-600'}`}
              >
                <LogOut size={16} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {viewState === 'loading' && (
            <div className={`absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm transition-colors duration-700 ${isDark ? 'bg-[#05070A]/80' : 'bg-white/80'}`}>
                <VectorLoading onComplete={handleLoadingComplete} isDark={isDark} />
            </div>
        )}

        {viewState === 'chat' && (
            <ChatInterface vaultName={selectedFolder?.name || ''} chatId={selectedChatId} isReadOnly={false} onChatUpdated={() => {
              const userStr = localStorage.getItem('user');
              const activeUserId = userStr ? JSON.parse(userStr).id : 1;
              fetchChats(activeUserId);
            }} onBack={() => {
                setViewState('home');
                window.history.pushState({}, '', '/dashboard');
            }} isDark={isDark} />
        )}

        {viewState === 'past_chat' && (
            <ChatInterface 
              vaultName={chats.find(c => c.id.toString() === selectedChatId)?.vault_name || ""} 
              chatId={selectedChatId} 
              isReadOnly={true} 
              onBack={() => {
                setViewState('home');
                window.history.pushState({}, '', '/dashboard');
              }} 
              isDark={isDark} 
            />
        )}

        {viewState === 'chat_history' && (
            <ChatHistoryTable 
              userId={getActiveUserId()} 
              isDark={isDark} 
              onClose={() => setViewState('home')}
              onChatSelect={handleChatSelect}
            />
        )}

        {viewState === 'home' && (
            /* Conditional Rendering: Hero Section OR Folder View */
            !selectedFolder ? (
            <>
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center mt-2 mb-10 relative animate-[fadeIn_0.8s_ease-out] z-30">
                    
                    {/* Typography - Cinematic & Impactful */}
                    <div className="relative flex flex-col items-center">
                        {/* Subtle Text Glow for Readability */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] blur-[80px] rounded-full pointer-events-none transition-colors duration-700 ${
                          isDark ? 'bg-blue-900/10' : 'bg-blue-300/20'
                        }`} />
                        
                        <h1 className="relative z-10 text-center leading-tight tracking-tight drop-shadow-2xl">
                            <span className={`block font-bold text-transparent bg-clip-text tracking-tight whitespace-nowrap text-[111px] mx-[11px] my-[0px] px-[21px] py-[0px] transition-all duration-700 ${
                              isDark 
                                ? 'bg-gradient-to-b from-white via-white to-white/50' 
                                : 'bg-gradient-to-b from-[#0f172a] via-[#334155] to-[#64748b]'
                            }`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
                                Your Private AI Assistant
                            </span>
                        </h1>

                        <div className="mt-2 flex items-center gap-4 opacity-70">
                            <div className={`h-[1px] w-12 bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-blue-400/50' : 'via-blue-600/30'}`} />
                            <p className={`font-light tracking-[0.4em] uppercase text-[8px] transition-colors duration-700 ${
                              isDark 
                                ? 'text-blue-100/80 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                                : 'text-blue-900/60 drop-shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                            }`}>
                                Secure • Intelligent • Ethereal
                            </p>
                            <div className={`h-[1px] w-12 bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-blue-400/50' : 'via-blue-600/30'}`} />
                        </div>
                    </div>
                
                {/* Draggable Grid */}
                <div className="mt-6 mb-6 scale-90 opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <DraggableGrid isDark={isDark} />
                </div>
            </div>

                {/* Vault Panel Area */}
                <div className="relative z-30 w-full max-w-6xl mx-auto pt-8">
                    <VaultPanel folders={vaults} onFolderClick={handleFolderClick} onCreateVaultClick={() => setIsCreateModalOpen(true)} onDeleteVault={handleDeleteVault} isDark={isDark} />
                </div>
            </>
            ) : (
            /* Folder View - Replaces Hero Section */
            <FolderView
                folderName={selectedFolder.name}
                onClose={handleCloseFolderView}
                onStartChat={handleStartConversation}
                isDark={isDark}
            />
            )
        )}
        
        <CreateVaultModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleCreateVault} 
          isDark={isDark} 
        />

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onSave={handleRoleSave}
          isDark={isDark}
        />
        
      </main>
    </div>
  );
};