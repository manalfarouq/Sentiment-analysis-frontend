'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FolderIcon {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export default function About() {
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [windowMinimizing, setWindowMinimizing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

  const handleCloseLoginModal = () => {
    setWindowMinimizing(true);
    setTimeout(() => {
      setError('');
      setWindowMinimizing(false);
      router.push("/");
    }, 300);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/background2.png')",
        }}
      />

      {/* Bureau avec icônes style Windows 95 */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Colonne gauche : Login et SignUp */}
        <div className="absolute left-8 top-8 flex flex-col gap-6">
          {folders.filter(f => f.id === '3' || f.id === '2').map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              onDoubleClick={() => handleFolderClick(folder)}
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

        {/* Colonne droite : Analyse Sentiment (haut) */}
        <div className="absolute right-8 top-8">
          {folders.filter(f => f.id === '1').map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              onDoubleClick={() => handleFolderClick(folder)}
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

        {/* Colonne droite : À propos (bas) */}
        <div className="absolute right-8 bottom-8">
          {folders.filter(f => f.id === '4').map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              onDoubleClick={() => handleFolderClick(folder)}
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

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center" />

      {/* Fenêtre About - AVEC ANIMATION */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div 
          className="pointer-events-auto w-full max-w-2xl px-4"
          style={{
            animation: windowMinimizing 
              ? 'minimize 0.3s ease-in forwards' 
              : 'slideDown 0.3s ease-out',
          }}
        >
          <div 
            className="rounded-sm"
            style={{
              border: '2px solid',
              borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
              backgroundColor: '#c0c0c0',
              boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080, 1px 1px 0 #000000, 2px 2px 5px rgba(0,0,0,0.3)',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            {/* Barre de titre */}
            <div 
              className="flex items-center justify-between px-2 py-1"
              style={{
                backgroundImage: 'linear-gradient(90deg, #000080 0%, #1084d7 100%)',
                borderBottom: '2px solid #dfdfdf',
                position: 'sticky',
                top: 0,
              }}
            >
              <span 
                style={{
                  color: '#ffffff',
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                }}
              >
                À propos
              </span>
              <button 
                onClick={handleCloseLoginModal}
                className="w-5 h-5 flex items-center justify-center hover:bg-gray-300 transition-colors"
                style={{
                  border: '2px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  backgroundColor: '#c0c0c0',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#000000' }}>X</span>
              </button>
            </div>

            {/* Contenu */}
            <div 
              className="p-4"
              style={{
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '11px',
                color: '#000000',
                lineHeight: '1.8',
              }}
            >
              <p style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '12px' }}>
                Analyse de Sentiment v1.0
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Description:</strong><br />
                Outil d'analyse de sentiment alimenté par l'IA, permettant de déterminer rapidement le ton émotionnel d'un texte. Cet outil utilise des modèles de machine learning avancés pour classifier le sentiment avec haute précision.
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Modèle IA:</strong><br />
                Nous utilisons un modèle pré-entraîné de <strong>Hugging Face</strong> (nlptown/bert-base-multilingual-uncased-sentiment) qui détecte le sentiment avec haute précision. Ce modèle supporte 6 langues et offre d'excellentes performances.
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Backend:</strong><br />
                Le backend est construit avec <strong>FastAPI</strong>, un framework Python moderne et performant qui expose les API d'analyse en temps réel. FastAPI offre une documentation automatique et une excellente performance grâce à Uvicorn.
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Frontend:</strong><br />
                L'interface utilisateur est développée avec <strong>Next.js</strong> et <strong>React</strong>, offrant une expérience fluide et réactive. Le design rétro Windows XP apporte une touche nostalgique unique.
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Stack Technique:</strong><br />
                • <strong>AI/ML:</strong> Hugging Face BERT, PyTorch<br />
                • <strong>Backend:</strong> FastAPI, Python 3.11, PostgreSQL<br />
                • <strong>Frontend:</strong> Next.js 14+, React 18+, TypeScript<br />
                • <strong>Styling:</strong> Tailwind CSS<br />
                • <strong>Déploiement:</strong> Vercel (Frontend), Render (Backend)
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Fonctionnalités:</strong><br />
                • Analyse de sentiment en temps réel<br />
                • Support multilingue (6 langues)<br />
                • Authentification JWT sécurisée<br />
                • Interface intuitive et accessible<br />
                • Documentation API interactive
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Cas d'usage:</strong><br />
                • Analyse des avis clients<br />
                • Monitoring des réseaux sociaux<br />
                • Analyse des retours utilisateurs<br />
                • Études de sentiment de marque
              </p>

              <p style={{ marginBottom: '12px' }}>
                <strong>Pour plus d'informations:</strong><br />
                • <a 
                    href="https://github.com/manalfarouq/Sentiment-analysis-backend-.git" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#000080', textDecoration: 'underline' }}
                  >
                    Backend Repository
                  </a><br />
                • <a 
                    href="https://github.com/manalfarouq/Sentiment-analysis-frontend.git" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#000080', textDecoration: 'underline' }}
                  >
                    Frontend Repository
                  </a><br />
                • <a 
                    href="https://tasentimentxp-backend-nnql.onrender.com/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#000080', textDecoration: 'underline' }}
                  >
                    Documentation API
                  </a>
              </p>

              <p style={{ marginTop: '16px', color: '#000080', textAlign: 'center', borderTop: '1px solid #808080', paddingTop: '8px' }}>
                © 2025 - Tous droits réservés<br />
                Made with ❤ by M A N A L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        * {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        @keyframes slideDown {
          0% {
            transform: translateY(-30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes minimize {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}