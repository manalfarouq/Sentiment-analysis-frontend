'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {/* Animation subtile pour les ronds */}
              <div className="w-4 h-4 bg-purple rounded-full animate-bounce-slow delay-100"></div>
              <div className="w-4 h-4 bg-pink rounded-full animate-bounce-slow delay-200"></div>
              <div className="w-4 h-4 bg-green rounded-full animate-bounce-slow"></div>
            </div>
            {/* Ajout de l'animation pulse-shadow sur le titre */}
            <span className="text-2xl font-bold text-purple animate-pulse-shadow rounded-lg p-1">Sentiment</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                pathname === '/' ? 'bg-purple text-white' : 'text-purple hover:bg-purple/10'
              }`}
            >
              🏠 Accueil
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                🚪 Déconnexion
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    pathname === '/login' ? 'bg-pink text-white' : 'text-pink hover:bg-pink/10'
                  }`}
                >
                  🔐 Connexion
                </Link>
                <Link
                  href="/signup"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    pathname === '/signup' ? 'bg-green text-white' : 'text-green hover:bg-green/10'
                  }`}
                >
                  ✨ Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}