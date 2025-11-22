'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FolderIcon {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export default function Desktop() {
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const folders: FolderIcon[] = [
    { id: '1', label: 'Analyse Sentiment', icon: '/sentiment.png', path: '/analyze' },
    { id: '2', label: 'Login', icon: '/login.png', path: '/login' },
    { id: '3', label: 'SignUp', icon: '/signup.png', path: '/signup' },
    { id: '4', label: 'À propos', icon: '/about.png', path: '/about' },
  ];

  const handleFolderClick = (folder: FolderIcon) => {
    setSelectedFolder(folder.id);
    setTimeout(() => {
      router.push(folder.path);
    }, 200);
  };

  const handleDoubleClick = (folder: FolderIcon) => {
    router.push(folder.path);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ton image de fond originale */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/background.png')",
        }}
      />

      {/* Bureau avec icônes style Windows 95 - disposition personnalisée */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Colonne gauche : SignUp et Login */}
        <div className="absolute left-8 top-8 flex flex-col gap-6">
          {folders.filter(f => f.id === '3' || f.id === '2').map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              onDoubleClick={() => handleDoubleClick(folder)}
              className="group cursor-pointer flex flex-col items-center"
            >
            {/* Container icône + label */}
            <div 
              className={`
                relative flex flex-col items-center gap-1 p-2 rounded
                transition-colors duration-100
                ${selectedFolder === folder.id ? 'bg-blue-600/30' : 'hover:bg-black/5'}
              `}
              style={{
                filter: selectedFolder === folder.id 
                  ? 'none' 
                  : 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))'
              }}
            >
              {/* Icône avec style pixel art */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <img 
                  src={folder.icon} 
                  alt={folder.label}
                  className="w-full h-full object-contain"
                  style={{
                    imageRendering: 'pixelated',
                    filter: 'contrast(1.1) saturate(0.9)',
                  }}
                />
              </div>
              
              {/* Label avec police bitmap style Windows 95 */}
              <p 
                className="text-center text-xs leading-tight max-w-[80px]"
                style={{
                  color: '#2C2C2C',
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  fontSize: '8px',
                  fontWeight: 'normal',
                  textShadow: selectedFolder === folder.id 
                    ? 'none' 
                    : '1px 1px 0px rgba(255,255,255,0.5)',
                  WebkitFontSmoothing: 'none',
                  MozOsxFontSmoothing: 'grayscale'
                }}
              >
                {folder.label}
              </p>

              {/* Bordure en pointillés pour la sélection (style Windows 95) */}
              {selectedFolder === folder.id && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    border: '1px dotted #000',
                    backgroundColor: 'rgba(0, 0, 128, 0.15)'
                  }}
                />
              )}
            </div>
          </div>
        ))}
        </div>

        {/* Colonne droite : Analyse Sentiment (haut) et À propos (bas) */}
        <div className="absolute right-8 top-8">
          {folders.filter(f => f.id === '1').map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              onDoubleClick={() => handleDoubleClick(folder)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div 
                className={`
                  relative flex flex-col items-center gap-1 p-1 rounded
                  transition-colors duration-100
                  ${selectedFolder === folder.id ? 'bg-blue-600/30' : 'hover:bg-black/5'}
                `}
                style={{
                  filter: selectedFolder === folder.id 
                    ? 'none' 
                    : 'drop-shadow(1px 1px 0px rgba(0,0,0,0.3))'
                }}
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <img 
                    src={folder.icon} 
                    alt={folder.label}
                    className="w-full h-full object-contain"
                    style={{
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.1) saturate(0.9)',
                    }}
                  />
                </div>
                
                <p 
                  className="text-center text-xs leading-tight max-w-[70px]"
                  style={{
                    color: '#2C2C2C',
                    fontFamily: '"Press Start 2P", "Courier New", monospace',
                    fontSize: '8px',
                    fontWeight: 'normal',
                    textShadow: selectedFolder === folder.id 
                      ? 'none' 
                      : '1px 1px 0px rgba(255,255,255,0.5)',
                    WebkitFontSmoothing: 'none',
                    MozOsxFontSmoothing: 'grayscale'
                  }}
                >
                  {folder.label}
                </p>

                {selectedFolder === folder.id && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      border: '1px dotted #000',
                      backgroundColor: 'rgba(0, 0, 128, 0.15)'
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute right-8 bottom-8">
          {folders.filter(f => f.id === '4').map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              onDoubleClick={() => handleDoubleClick(folder)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div 
                className={`
                  relative flex flex-col items-center gap-1 p-2 rounded
                  transition-colors duration-100
                  ${selectedFolder === folder.id ? 'bg-blue-600/30' : 'hover:bg-black/5'}
                `}
                style={{
                  filter: selectedFolder === folder.id 
                    ? 'none' 
                    : 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))'
                }}
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <img 
                    src={folder.icon} 
                    alt={folder.label}
                    className="w-full h-full object-contain"
                    style={{
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.1) saturate(0.9)',
                    }}
                  />
                </div>
                
                <p 
                  className="text-center text-xs leading-tight max-w-[70px]"
                  style={{
                    color: '#2C2C2C',
                    fontFamily: '"Press Start 2P", "Courier New", monospace',
                    fontSize: '8px',
                    fontWeight: 'normal',
                    textShadow: selectedFolder === folder.id 
                      ? 'none' 
                      : '1px 1px 0px rgba(255,255,255,0.5)',
                    WebkitFontSmoothing: 'none',
                    MozOsxFontSmoothing: 'grayscale'
                  }}
                >
                  {folder.label}
                </p>

                {selectedFolder === folder.id && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      border: '1px dotted #000',
                      backgroundColor: 'rgba(0, 0, 128, 0.15)'
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Import Google Font pour police pixel art */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        * {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
}