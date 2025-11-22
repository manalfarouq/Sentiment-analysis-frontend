'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SentimentResponse {
  label: string;
  score: number;
}

interface AnalyzeSentimentProps {
  onClose: () => void;
}

export default function AnalyzeSentiment({ onClose }: AnalyzeSentimentProps) {
  const [windowMinimizing, setWindowMinimizing] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SentimentResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  // AJOUT : Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      setError('⚠Vous devez être connecté pour analyser un texte');
      // Rediriger vers login après 2 secondes
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

    // AJOUT : Vérifier le token
    if (!token) {
      setError('⚠Session expirée. Veuillez vous reconnecter.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      // URL  vers /sentiment/predict
      const response = await fetch('http://localhost:8000/sentiment/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token, // Ajout du header token
        },
        body: JSON.stringify({ text }),
      });

      // AJOUT : Gestion des erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          // Token invalide ou expiré
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        throw new Error(errorData.detail || `Erreur ${response.status}`);
      }

      const data = await response.json();
      
      console.log('========== DEBUG RÉPONSE API ==========');
      console.log('Réponse complète:', JSON.stringify(data, null, 2));
      console.log('=======================================');
      
      let sentimentResult;
      
      // CAS 1 : result est un string 
      if (typeof data.result === 'string') {
        // Extraire le sentiment du texte
        const resultText = data.result;
        const isPositive = resultText.toLowerCase().includes('positive');
        const isNegative = resultText.toLowerCase().includes('negative');
        
        sentimentResult = {
          label: isPositive ? 'POSITIVE' : isNegative ? 'NEGATIVE' : 'NEUTRAL',
          score: 0.95, // Score par défaut car non fourni
          original: resultText // Garder le texte original
        };
      }
      // CAS 2 : result est un objet avec label et score
      else if (data.result && typeof data.result === 'object' && data.result.label) {
        sentimentResult = data.result;
      }
      // CAS 3 : label et score directement dans data
      else if (data.label !== undefined) {
        sentimentResult = { label: data.label, score: data.score };
      }
      else {
        console.error('Structure de réponse non reconnue:', data);
        throw new Error('Format de réponse invalide');
      }
      
      console.log('Résultat final à afficher:', sentimentResult);
      setResult(sentimentResult);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse. Vérifiez que FastAPI est lancé.';
      setError(errorMessage);
      
      // Si erreur de session, rediriger
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

  // AJOUT : Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Fenêtre Windows 95 */}
      <div className="relative z-10 w-full max-w-2xl">
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
              {/* BOUTON DÉCONNEXION - Afficher SEULEMENT si connecté */}
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

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>
    </div>
  );
}