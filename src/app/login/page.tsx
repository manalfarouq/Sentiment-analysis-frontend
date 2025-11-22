'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      router.push('/');
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
      <div className="min-h-screen bg-gradient-to-br from-purple via-pink to-background flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-2">🔐</h1>
            <h2 className="text-4xl font-bold text-white">Connexion</h2>
            <p className="text-white/80 mt-2">Bon retour parmi nous !</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-purple font-semibold mb-2">
                  👤 Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  className="w-full p-4 border-2 border-purple rounded-xl focus:outline-none focus:ring-4 focus:ring-pink text-gray-800"
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
                  placeholder="Entrez votre mot de passe"
                  className="w-full p-4 border-2 border-purple rounded-xl focus:outline-none focus:ring-4 focus:ring-pink text-gray-800"
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
                className="w-full bg-gradient-to-r from-purple to-pink text-white font-bold py-4 rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/signup" className="text-pink font-bold hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}