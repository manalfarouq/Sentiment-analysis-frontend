'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';

interface FolderIcon {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export default function SignUp() {  
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [windowMinimizing, setWindowMinimizing] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

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

  const handleCloseSignUpModal = () => {
    setWindowMinimizing(true);
    setTimeout(() => {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setWindowMinimizing(false);
      router.push("/");
    }, 300);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await register(username, password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
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

      {/* Bureau avec icônes style Windows 95 - disposition personnalisée */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Colonne gauche : Login et SignUp (petites icônes - MÊME TAILLE QUE LOGIN) */}
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

        {/* Colonne droite : Analyse Sentiment (haut) - icône moyenne */}
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

        {/* Colonne droite : À propos (bas) - MÊME TAILLE QUE LOGIN */}
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

      {/* Modal SignUp - Overlay (légèrement transparent) */}
      <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center" />

      {/* Modal SignUp - Fenêtre AVEC ANIMATION */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
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
                Inscription
              </span>

              {/* BOUTON X */}
              <button 
                onClick={handleCloseSignUpModal}
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
              {success ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', color: '#000000' }}>Inscription réussie !</p>
                  <p style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: '11px', color: '#000080' }}>Redirection vers la connexion...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* FORMULAIRE */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Username */}
                    <div>
                      <label 
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#000000',
                          marginBottom: '2px',
                          display: 'block'
                        }}
                      >
                        Nom d'utilisateur:
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Entrez votre nom"
                        className="w-full px-2 py-2 text-xs"
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          border: '2px solid',
                          borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                          backgroundColor: '#ffffff',
                          color: '#000',
                          outline: 'none',
                        }}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label 
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#000000',
                          marginBottom: '2px',
                          display: 'block'
                        }}
                      >
                        Mot de passe:
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-2 py-2 text-xs"
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          border: '2px solid',
                          borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                          backgroundColor: '#ffffff',
                          color: '#000',
                          outline: 'none',
                        }}
                        required
                      />
                    </div>

                    {/* Confirm */}
                    <div>
                      <label 
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#000000',
                          marginBottom: '2px',
                          display: 'block'
                        }}
                      >
                        Confirmer:
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-2 py-2 text-xs"
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          border: '2px solid',
                          borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                          backgroundColor: '#ffffff',
                          color: '#000',
                          outline: 'none',
                        }}
                        required
                      />
                    </div>

                    {/* Erreur */}
                    {error && (
                      <div 
                        style={{
                          border: '2px solid',
                          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                          backgroundColor: '#c0c0c0',
                          color: '#c00000',
                          padding: '6px',
                          fontSize: '11px',
                        }}
                      >
                        {error}
                      </div>
                    )}

                    {/* Boutons */}
                    <div className="flex gap-2 justify-center pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          border: '2px solid',
                          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                          backgroundColor: '#c0c0c0',
                          color: '#000',
                          padding: '4px 16px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          opacity: loading ? 0.6 : 1,
                        }}
                      >
                        {loading ? '...' : 'Créer'}
                      </button>

                      <button
                        type="button"
                        onClick={handleCloseSignUpModal}
                        style={{
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          border: '2px solid',
                          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                          backgroundColor: '#c0c0c0',
                          color: '#000',
                          padding: '4px 16px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>

                  {/* Lien vers login */}
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <p style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: '11px', color: '#000000' }}>
                      Déjà un compte ? <Link href="/login" style={{ color: '#000080', textDecoration: 'underline' }}>Se connecter</Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Import Google Font pour police pixel art + ANIMATIONS */}
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