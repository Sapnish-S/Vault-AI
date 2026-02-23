import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { VaultPanel } from '../components/VaultPanel';
import { DraggableGrid } from '../components/DraggableGrid';
import { FolderView } from '../components/FolderView';
import { RECENT_CHATS, VAULT_FOLDERS, FOLDER_DOCUMENTS } from '../constants';
import { VaultFolder } from '../types';

export const Dashboard: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<VaultFolder | null>(null);

  const handleFolderClick = (folder: VaultFolder) => {
    setSelectedFolder(folder);
  };

  const handleCloseFolderView = () => {
    setSelectedFolder(null);
  };

  return (
    <div className="relative w-full h-screen flex bg-black text-white overflow-hidden font-sans">
      {/* Sidebar (Z-20) */}
      <Sidebar recentChats={RECENT_CHATS} />

      {/* Main Canvas (Z-10) */}
      <main className="flex-1 flex flex-col relative z-10 h-full p-8 md:p-12">
        
        {/* Top Bar: Settings Icon */}
        <div className="absolute top-8 right-8 z-50">
          <button className="p-3 rounded-full text-white/40 hover:text-white hover:bg-white/5 hover:rotate-90 transition-all duration-500">
            <Settings size={24} />
          </button>
        </div>

        {/* Conditional Rendering: Hero Section OR Folder View */}
        {!selectedFolder ? (
          <>
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center mt-8 mb-16 relative animate-[fadeIn_0.4s_ease-out]">
                
                {/* Typography */}
                <h1 className="tracking-tight text-white/95 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] text-[64px] p-[0px] mx-[0px] my-[-15px] text-[#ffffff]" style={{ fontFamily: "'Source Serif 4', serif" }}>
                  Your Private AI Assistant
                </h1>
                <p className="mt-5 text-white/60 font-light text-lg tracking-wide drop-shadow-md">
                    Secure. Intelligent. Yours.
                </p>
                
                {/* Draggable Grid */}
                <DraggableGrid />
            </div>

            {/* Vault Panel Area */}
            <VaultPanel folders={VAULT_FOLDERS} onFolderClick={handleFolderClick} />
          </>
        ) : (
          /* Folder View - Replaces Hero Section */
          <FolderView
            folderName={selectedFolder.name}
            documents={FOLDER_DOCUMENTS[selectedFolder.id] || []}
            onClose={handleCloseFolderView}
          />
        )}
        
      </main>
    </div>
  );
};