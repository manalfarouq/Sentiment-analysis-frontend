'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FolderIcon {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export default function Login() {
  const router = useRouter();   

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [windowMinimizing, setWindowMinimizing] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  //  Ouvrir le modal automatiquement au chargement
  useEffect(() => {
    setLoginModalOpen(true);
  }, []);

  const folders: FolderIcon[] = [
    { id: '1', label: 'Analyse Sentiment', icon: '/sentiment.png', path: '/analyze' },
    { id: '2', label: 'Login', icon: '/login.png', path: '/login' },
    { id: '3', label: 'SignUp', icon: '/signup.png', path: '/signup' },
    { id: '4', label: 'À propos', icon: '/about.png', path: '/about' },
  ];

  const handleFolderClick = (folder: FolderIcon) => {
    if (folder.id === '2') {
      setLoginModalOpen(true);
      setWindowMinimizing(false);
    } else {
      setSelectedFolder(folder.id);
      setTimeout(() => {
        router.push(folder.path);
      }, 200);
    }
  };

  const handleCloseLoginModal = () => {
    setWindowMinimizing(true);
    setTimeout(() => {
      setLoginModalOpen(false);
      setUsername('');
      setPassword('');
      setError('');
      setWindowMinimizing(false);
      router.push("/");
    }, 300);
  };

  // FONCTION : Appel API réel
  const handleLoginSubmit = async () => {
    setError('');
    setLoading(true);
    
    // Validation basique
    if (!username.trim() || !password.trim()) {
      setError('⚠Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      // URL de l'API (utilise la variable d'environnement ou localhost)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Appel API vers FastAPI
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Erreur 401 ou 500
        throw new Error(data.detail || 'Erreur de connexion');
      }

      // Succès : Stocker le token
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);

      // Message de succès
      setError('✓ Connexion réussie !');
      
      // Redirection vers la page d'accueil ou analyse
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (err) {
      // Gestion des erreurs
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
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

      {/* Bureau avec icônes */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Colonne gauche : SignUp et Login */}
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

        {/* Colonne droite : Analyse Sentiment (haut) et À propos (bas) */}
        <div className="absolute right-8 top-8">
          {folders.filter(f => f.id === '1').map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
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

      {/* Modal Login - Overlay */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center" />
      )}

      {/* Modal Login - Fenêtre */}
      {loginModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div 
            className="pointer-events-auto"
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
                minWidth: '320px',
              }}
            >
              {/* Barre de titre */}
              <div 
                className="flex items-center justify-between px-1 py-1"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #000080 0%, #1084d7 100%)',
                  borderBottom: '2px solid',
                  borderBottomColor: '#dfdfdf',
                  cursor: 'move',
                }}
              >
                <span 
                  className="text-white text-sm font-bold"
                  style={{
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    fontSize: '11px',
                    textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                  }}
                >
                  Connexion
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
              <div className="p-4">
                <div className="mb-6 text-center">
                  <p 
                    className="text-sm font-bold mb-2"
                    style={{
                      fontFamily: '"MS Sans Serif", Arial, sans-serif',
                      color: '#000000',
                    }}
                  >
                    Bienvenue sur le Bureau
                  </p>
                  <p 
                    className="text-xs"
                    style={{
                      fontFamily: '"MS Sans Serif", Arial, sans-serif',
                      color: '#000080',
                    }}
                  >
                    Veuillez vous identifier
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Champ Utilisateur */}
                  <div>
                    <label 
                      className="block text-xs font-bold mb-1"
                      style={{
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        color: '#000000',
                      }}
                    >
                      Nom d'utilisateur:
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLoginSubmit()}
                      placeholder="Entrez votre nom"
                      className="w-full px-2 py-2 text-xs"
                      style={{
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        border: '2px solid',
                        borderColor: focusedField === 'username' 
                          ? '#ffffff #808080 #808080 #ffffff' 
                          : '#808080 #dfdfdf #dfdfdf #808080',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Champ Mot de passe */}
                  <div>
                    <label 
                      className="block text-xs font-bold mb-1"
                      style={{
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        color: '#000000',
                      }}
                    >
                      Mot de passe:
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLoginSubmit()}
                      placeholder="••••••••"
                      className="w-full px-2 py-2 text-xs"
                      style={{
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        border: '2px solid',
                        borderColor: focusedField === 'password' 
                          ? '#ffffff #808080 #808080 #ffffff' 
                          : '#808080 #dfdfdf #dfdfdf #808080',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Message d'erreur */}
                  {error && (
                    <div 
                      className="p-2 text-xs"
                      style={{
                        border: '2px solid',
                        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                        backgroundColor: '#c0c0c0',
                        color: error.includes('✓') ? '#008000' : '#c00000',
                      }}
                    >
                       {error}
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={handleLoginSubmit}
                      disabled={loading}
                      className="px-6 py-1 text-xs font-bold active:shadow-inset hover:brightness-95 transition-all"
                      style={{
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        border: '2px solid',
                        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                        backgroundColor: '#c0c0c0',
                        color: '#000000',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      {loading ? '⏳ ...' : '✓ OK'}
                    </button>
                    <button
                      onClick={handleCloseLoginModal}
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
                  </div>
                </div>

                {/* Lien Signup */}
                <div className="mt-4 text-center">
                  <p 
                    className="text-xs"
                    style={{
                      fontFamily: '"MS Sans Serif", Arial, sans-serif',
                      color: '#000000',
                    }}
                  >
                    Pas de compte ?{" "}
                    <Link
                      href="/signup"
                      className="font-bold"
                      style={{
                        color: '#000080',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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