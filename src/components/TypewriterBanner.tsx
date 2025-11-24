'use client';

import { useState, useEffect } from 'react';

export default function TypewriterBanner() {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  
  const fullText = "Bienvenue dans zoroXP de MANAL";
  const typingSpeed = 80; // ms par caractère
  const displayDuration = 3000; // Temps d'affichage après l'écriture complète
  const fadeOutDuration = 500; // Durée du fade out

  useEffect(() => {
    let currentIndex = 0;
    
    // Animation d'écriture
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Faire disparaître le curseur
        setTimeout(() => {
          setShowCursor(false);
        }, 500);
        
        // Commencer le fade out après displayDuration
        setTimeout(() => {
          setIsVisible(false);
        }, displayDuration);
      }
    }, typingSpeed);

    // Clignotement du curseur
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  if (!isVisible && text === fullText) {
    return null; // Complètement masqué après l'animation
  }

  return (
    <div 
      className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none"
      style={{
        animation: !isVisible ? `fadeOut ${fadeOutDuration}ms ease-out forwards` : 'slideDownBanner 0.5s ease-out',
      }}
    >
      {/* Fenêtre style Windows 95 */}
      <div 
        className="rounded-sm"
        style={{
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          backgroundColor: '#c0c0c0',
          boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080, 2px 2px 8px rgba(0,0,0,0.4)',
          minWidth: '400px',
        }}
      >
        {/* Barre de titre */}
        <div 
          style={{
            backgroundImage: 'linear-gradient(90deg, #000080 0%, #1084d7 100%)',
            padding: '4px 8px',
            borderBottom: '2px solid #dfdfdf',
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
            System Message
          </span>
        </div>

        {/* Contenu avec texte qui s'écrit - SANS ICÔNE */}
        <div 
          className="p-4"
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '10px',
            color: '#000000',
            backgroundColor: '#c0c0c0',
            lineHeight: '1.6',
          }}
        >
          <span>{text}</span>
          {/* Curseur clignotant */}
          {text !== fullText && (
            <span 
              style={{
                display: 'inline-block',
                width: '8px',
                height: '12px',
                backgroundColor: showCursor ? '#000000' : 'transparent',
                marginLeft: '2px',
                animation: 'blink 1s step-end infinite',
              }}
            />
          )}
        </div>

        {/* Barre de progression */}
        <div 
          style={{
            height: '4px',
            backgroundColor: '#dfdfdf',
            border: '1px solid #808080',
            margin: '0 4px 4px 4px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div 
            style={{
              height: '100%',
              backgroundColor: '#000080',
              width: `${(text.length / fullText.length) * 100}%`,
              transition: 'width 0.08s linear',
            }}
          />
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes slideDownBanner {
          0% {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}