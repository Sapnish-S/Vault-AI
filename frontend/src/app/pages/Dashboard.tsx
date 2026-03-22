import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { VaultPanel } from '../components/VaultPanel';
import { DraggableGrid } from '../components/DraggableGrid';
import { FolderView } from '../components/FolderView';
import { VectorLoading } from '../components/VectorLoading';
import { ChatInterface } from '../components/ChatInterface';
import { ThemeToggle } from '../components/ThemeToggle';
import { CosmicNebulaBackground } from '../components/CosmicNebulaBackground';
import { RECENT_CHATS, VAULT_FOLDERS, FOLDER_DOCUMENTS } from '../constants';
import { VaultFolder } from '../types';

type ViewState = 'home' | 'loading' | 'chat';

export const Dashboard: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<VaultFolder | null>(null);
  const [viewState, setViewState] = useState<ViewState>('home');

  const handleFolderClick = (folder: VaultFolder) => {
    setSelectedFolder(folder);
  };

  const handleCloseFolderView = () => {
    setSelectedFolder(null);
  };

  const handleStartConversation = () => {
    setViewState('loading');
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
        <Sidebar recentChats={RECENT_CHATS} isDark={isDark} />
      </div>

      {/* Main Canvas (Z-20) */}
      <main className="flex-1 flex flex-col relative z-20 h-full p-12 overflow-hidden">
        
        {/* Top Bar: Settings & Theme Toggle */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={setIsDark} />
          <button className={`p-3 rounded-full transition-all duration-500 backdrop-blur-md border group ${
            isDark 
              ? 'text-white/30 hover:text-white hover:bg-white/10 border-white/5' 
              : 'text-[#64748b] hover:text-[#0f172a] hover:bg-black/5 border-black/5'
          }`}>
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" />
          </button>
        </div>

        {viewState === 'loading' && (
            <div className={`absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm transition-colors duration-700 ${isDark ? 'bg-[#05070A]/80' : 'bg-white/80'}`}>
                <VectorLoading onComplete={handleLoadingComplete} isDark={isDark} />
            </div>
        )}

        {viewState === 'chat' && (
            <ChatInterface onBack={() => setViewState('home')} isDark={isDark} />
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
                    <VaultPanel folders={VAULT_FOLDERS} onFolderClick={handleFolderClick} isDark={isDark} />
                </div>
            </>
            ) : (
            /* Folder View - Replaces Hero Section */
            <FolderView
                folderName={selectedFolder.name}
                documents={FOLDER_DOCUMENTS[selectedFolder.id] || []}
                onClose={handleCloseFolderView}
                onStartChat={handleStartConversation}
                isDark={isDark}
            />
            )
        )}
        
      </main>
    </div>
  );
};