'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';

export default function SignUp() {  

  const [windowMinimizing, setWindowMinimizing] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

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
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      {/* Fenêtre */}
      <div className="relative z-10 w-full max-w-md">
        <div 
          className={`rounded-sm transition-all duration-300 ${windowMinimizing ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}
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

            {/* --- BOUTON X --- */}
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

              <div className="space-y-4">

                {/* FORMULAIRE */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Username */}
                  <div>
                    <label 
                      style={{
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#000000',
                        marginBottom: '4px',
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
                        marginBottom: '4px',
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
                        marginBottom: '4px',
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
                        padding: '8px',
                        fontSize: '11px',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="flex gap-2 justify-center pt-2">

                    {/* Créer */}
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

                    {/* --- ANNULER --- */}
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
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
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
  );
}
