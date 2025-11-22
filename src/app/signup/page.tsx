'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function SignUp() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green via-pink to-purple flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-2">✨</h1>
            <h2 className="text-4xl font-bold text-white">Inscription</h2>
            <p className="text-white/80 mt-2">Rejoignez-nous dès maintenant !</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
            {success ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green mb-2">
                  Inscription réussie !
                </h3>
                <p className="text-gray-600">
                  Redirection vers la connexion...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-purple font-semibold mb-2">
                    👤 Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choisissez un nom d'utilisateur"
                    className="w-full p-4 border-2 border-purple rounded-xl focus:outline-none focus:ring-4 focus:ring-green text-gray-800"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-purple font-semibold mb-2">
                    🔒 Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Créez un mot de passe (min 6 caractères)"
                    className="w-full p-4 border-2 border-purple rounded-xl focus:outline-none focus:ring-4 focus:ring-green text-gray-800"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-purple font-semibold mb-2">
                    🔒 Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className="w-full p-4 border-2 border-purple rounded-xl focus:outline-none focus:ring-4 focus:ring-green text-gray-800"
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-xl animate-fade-in">
                    ❌ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green to-purple text-white font-bold py-4 rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? '⏳ Inscription...' : '🎉 Créer mon compte'}
                </button>
              </form>
            )}

            {!success && (
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-purple font-bold hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}