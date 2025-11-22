'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyzeSentimentProps {
    onClose: () => void; // pour fermer la fenêtre
}


export default function About() {

    const [windowMinimizing, setWindowMinimizing] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const router = useRouter();

  const handleCloseLoginModal = () => {
    setWindowMinimizing(true);
    setTimeout(() => {
      setError('');
      setWindowMinimizing(false);
      router.push("/");
    }, 300);
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
              Nous utilisons un modèle pré-entraîné de <strong>Hugging Face</strong> (distilbert-base-uncased-finetuned-sst-2-english) qui détecte le sentiment avec haute précision. Ce modèle a été fine-tuné sur le dataset SST-2 et offre d'excellentes performances.
            </p>

            <p style={{ marginBottom: '12px' }}>
              <strong>⚙Backend:</strong><br />
              Le backend est construit avec <strong>FastAPI</strong>, un framework Python moderne et performant qui expose les API d'analyse en temps réel. FastAPI offre une documentation automatique et une excellente performance grâce à Uvicorn.
            </p>

            <p style={{ marginBottom: '12px' }}>
              <strong>Frontend:</strong><br />
              L'interface utilisateur est développée avec <strong>Next.js</strong> et <strong>React</strong>, offrant une expérience fluide et réactive. Le design rétro Windows 95 apporte une touche nostalgique unique.
            </p>

            <p style={{ marginBottom: '12px' }}>
              <strong>Stack Technique Complet:</strong><br />
              • <strong>AI/ML:</strong> Hugging Face Transformers, PyTorch<br />
              • <strong>Backend:</strong> FastAPI (Python), Uvicorn<br />
              • <strong>Frontend:</strong> Next.js 14+, React 18+<br />
              • <strong>Styling:</strong> Tailwind CSS<br />
              • <strong>Déploiement:</strong> Vercel (Frontend), Heroku/Railway (Backend)
            </p>

            <p style={{ marginBottom: '12px' }}>
              <strong>Fonctionnalités:</strong><br />
              • Analyse de sentiment en temps réel<br />
              • Support du texte multi-langue<br />
              • Affichage du score de confiance<br />
              • Interface intuitive et accessible<br />
              • Performance optimisée
            </p>

            <p style={{ marginBottom: '12px' }}>
              <strong>Cas d'usage:</strong><br />
              • Analyse des avis clients<br />
              • Monitoring des réseaux sociaux<br />
              • Analyse des retours utilisateurs<br />
              • Études de sentiment de marque<br />
              • Recherche en NLP
            </p>

            <p style={{ marginTop: '16px', color: '#000080', textAlign: 'center', borderTop: '1px solid #808080', paddingTop: '8px' }}>
              © 2024 - Tous droits réservés<br />
              Made with ❤ by M A N A L
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>
    </div>
  );
}