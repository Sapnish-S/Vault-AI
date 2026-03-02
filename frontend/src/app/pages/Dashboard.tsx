import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { VaultPanel } from '../components/VaultPanel';
import { DraggableGrid } from '../components/DraggableGrid';
import { FolderView } from '../components/FolderView';
import { VectorLoading } from '../components/VectorLoading';
import { ChatInterface } from '../components/ChatInterface';
import { CosmicNebulaBackground } from '../components/CosmicNebulaBackground';
import { RECENT_CHATS, VAULT_FOLDERS, FOLDER_DOCUMENTS } from '../constants';
import { VaultFolder } from '../types';

type ViewState = 'home' | 'loading' | 'chat';

export const Dashboard: React.FC = () => {
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
    <div className="relative w-full h-screen flex bg-[#020204] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* --- Full Screen Cosmic Nebula Background --- */}
      <CosmicNebulaBackground />

      {/* Sidebar (Z-30) */}
      <div className="relative z-30 h-full">
        <Sidebar recentChats={RECENT_CHATS} />
      </div>

      {/* Main Canvas (Z-20) */}
      <main className="flex-1 flex flex-col relative z-20 h-full p-8 md:p-12 overflow-hidden">
        
        {/* Top Bar: Settings Icon */}
        <div className="absolute top-8 right-8 z-50">
          <button className="p-3 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-md border border-white/5 group">
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" />
          </button>
        </div>

        {viewState === 'loading' && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <VectorLoading onComplete={handleLoadingComplete} />
            </div>
        )}

        {viewState === 'chat' && (
            <ChatInterface onBack={() => setViewState('home')} />
        )}

        {viewState === 'home' && (
            /* Conditional Rendering: Hero Section OR Folder View */
            !selectedFolder ? (
            <>
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center mt-12 mb-20 relative animate-[fadeIn_0.8s_ease-out] z-30">
                    
                    {/* Typography - Cinematic & Impactful */}
                    <div className="relative flex flex-col items-center">
                        {/* Subtle Text Glow for Readability */}
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
                    <VaultPanel folders={VAULT_FOLDERS} onFolderClick={handleFolderClick} />
                </div>
            </>
            ) : (
            /* Folder View - Replaces Hero Section */
            <FolderView
                folderName={selectedFolder.name}
                documents={FOLDER_DOCUMENTS[selectedFolder.id] || []}
                onClose={handleCloseFolderView}
                onStartChat={handleStartConversation}
            />
            )
        )}
        
      </main>
    </div>
  );
};