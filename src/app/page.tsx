'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeSentiment } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setShowLoginPrompt(false);

    const token = localStorage.getItem('token');

    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);

    try {
      const data = await analyzeSentiment(comment, token);
      setResult(data.result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      if (errorMessage.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        setShowLoginPrompt(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-pink-100 to-purple-100 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header avec les cercles de couleurs */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-purple rounded-full animate-bounce-slow shadow-xl"></div>
              <div className="w-20 h-20 bg-pink rounded-full animate-bounce-slow delay-100 shadow-xl"></div>
              <div className="w-20 h-20 bg-green rounded-full animate-bounce-slow delay-200 shadow-xl"></div>
            </div>
            <h1 className="text-6xl font-bold text-purple mb-4">
              Analyse de Sentiment
            </h1>
            <p className="text-gray-700 text-xl">
              Découvrez instantanément le sentiment de vos commentaires ! 
            </p>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
            <form onSubmit={handleSubmit}>
              <label className="block text-purple font-bold mb-4 text-2xl">
                💬 Votre commentaire :
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Écrivez votre commentaire ici... Par exemple : 'Ce produit est incroyable !'"
                className="w-full p-6 border-4 border-purple rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink resize-none h-40 text-gray-800 text-lg"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple via-pink to-green text-white font-bold py-5 rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-xl disabled:opacity-50 text-xl"
              >
                {loading ? 'Analyse en cours...' : 'Analyser le sentiment'}
              </button>
            </form>

            {/* Popup de connexion requise */}
            {showLoginPrompt && (
              <div className="mt-6 p-6 bg-gradient-to-r from-pink to-purple rounded-2xl text-white animate-fade-in">
                <h3 className="text-2xl font-bold mb-3">Connexion requise</h3>
                <p className="mb-4 text-lg">
                  Vous devez être connecté pour analyser un commentaire !
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => router.push('/login')}
                    className="flex-1 bg-white text-purple font-bold py-3 rounded-xl hover:scale-105 transform transition-all"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => router.push('/signup')}
                    className="flex-1 bg-green text-white font-bold py-3 rounded-xl hover:scale-105 transform transition-all"
                  >
                    Créer un compte
                  </button>
                </div>
              </div>
            )}

            {/* Résultat de l'analyse */}
            {result && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green to-pink rounded-2xl text-white animate-fade-in shadow-xl">
                <h3 className="text-3xl font-bold mb-3">Résultat :</h3>
                <p className="text-2xl font-semibold">{result}</p>
              </div>
            )}

            {/* Erreurs */}
            {error && (
              <div className="mt-6 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-xl animate-fade-in">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Section d'explication */}
          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-purple mb-4">
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-purple text-xl mb-2">1. Écrivez</h3>
                <p className="text-gray-600">Entrez votre commentaire</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-pink text-xl mb-2">2. Analysez</h3>
                <p className="text-gray-600">L&apos;IA analyse le sentiment</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-green text-xl mb-2">3. Découvrez</h3>
                <p className="text-gray-600">Obtenez le résultat instantané</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}