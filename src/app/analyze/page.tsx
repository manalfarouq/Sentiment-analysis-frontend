'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SentimentResponse {
  label: string;
  score: number;
}

interface FolderIcon {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export default function AnalyzeSentiment() {
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [windowMinimizing, setWindowMinimizing] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SentimentResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

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

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      setError('Vous devez être connecté pour analyser un texte');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleCloseAnalyzeSentimentModal = () => {
    setWindowMinimizing(true);
    setTimeout(() => {
      setError('');
      setWindowMinimizing(false);
      router.push("/");
    }, 300);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Veuillez entrer du texte');
      return;
    }

    if (!token) {
      setError('⚠Session expirée. Veuillez vous reconnecter.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      // URL de l'API (utilise la variable d'environnement ou localhost)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/sentiment/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        throw new Error(errorData.detail || `Erreur ${response.status}`);
      }

      const data = await response.json();
      
      let sentimentResult;
      
      if (typeof data.result === 'string') {
        const resultText = data.result;
        const isPositive = resultText.toLowerCase().includes('positive');
        const isNegative = resultText.toLowerCase().includes('negative');
        
        sentimentResult = {
          label: isPositive ? 'POSITIVE' : isNegative ? 'NEGATIVE' : 'NEUTRAL',
          score: 0.95,
          original: resultText
        };
      }
      else if (data.result && typeof data.result === 'object' && data.result.label) {
        sentimentResult = data.result;
      }
      else if (data.label !== undefined) {
        sentimentResult = { label: data.label, score: data.score };
      }
      else {
        throw new Error('Format de réponse invalide');
      }
      
      setResult(sentimentResult);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse. Vérifiez que FastAPI est lancé.';
      setError(errorMessage);
      
      if (errorMessage.includes('Session expirée')) {
        setTimeout(() => router.push('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/background.png')",
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

      {/* Fenêtre Analyse - AVEC ANIMATION */}
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
            }}
          >
            {/* Barre de titre */}
            <div 
              className='flex items-center justify-between px-2 py-1'
              style={{
                backgroundImage: 'linear-gradient(90deg, #000080 0%, #1084d7 100%)',
                borderBottom: '2px solid',
                borderBottomColor: '#dfdfdf',
                padding: '4px 2px',
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
                Analyse Votre Feedback
              </span>
              <div className="flex items-center gap-2">
                {token && (
                  <button 
                    onClick={handleLogout}
                    className="px-2 py-1 text-xs hover:bg-gray-300 transition-colors"
                    style={{
                      border: '1px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      backgroundColor: '#c0c0c0',
                      fontFamily: '"MS Sans Serif", Arial, sans-serif',
                      fontSize: '10px',
                      color: '#000000',
                    }}
                    title="Se déconnecter"
                  >
                    Déconnexion
                  </button>
                )}
                <button 
                  onClick={handleCloseAnalyzeSentimentModal}
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
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-4">
              <p 
                style={{
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  fontSize: '11px',
                  color: '#000000',
                  marginBottom: '8px',
                }}
              >
                Entrez votre commentaire pour analyser son sentiment (Positif, Négatif, Neutre)
              </p>

              {/* Zone de texte */}
              <div>
                <label 
                  style={{
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#000000',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  Texte à analyser:
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Entrez votre texte ici..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    fontSize: '11px',
                    border: '2px solid',
                    borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Résultat */}
              {result && (
                <div 
                  style={{
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    backgroundColor: '#c0c0c0',
                    padding: '12px',
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    fontSize: '11px',
                    color: '#000000',
                  }}
                >
                  <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Résultat:</p>
                  <p>Sentiment: <strong>{result.label || 'N/A'}</strong></p>
                  <p>Confiance: <strong>{result.score ? (result.score * 100).toFixed(2) : '0.00'}%</strong></p>
                </div>
              )}

              {/* Erreur */}
              {error && (
                <div 
                  style={{
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    backgroundColor: '#c0c0c0',
                    color: '#c00000',
                    padding: '8px',
                    fontSize: '11px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  style={{
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    backgroundColor: '#c0c0c0',
                    color: '#000000',
                    padding: '4px 16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Analyse...' : 'Analyser'}
                </button>
                <button
                  onClick={handleCloseAnalyzeSentimentModal}
                  className="px-6 py-1 text-xs font-bold active:shadow-inset hover:brightness-95 transition-all"
                  style={{
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    backgroundColor: '#c0c0c0',
                    color: '#000000',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    backgroundColor: '#c0c0c0',
                    color: '#000000',
                    padding: '4px 16px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  Effacer
                </button>
              </div>
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