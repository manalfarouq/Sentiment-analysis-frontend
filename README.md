# zoroXP - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.x-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com/)


## Description

**zoroXP** est une application web moderne déguisée en système d'exploitation rétro ! Inspirée par l'esthétique emblématique de Windows XP, cette interface offre une expérience nostalgique tout en utilisant les technologies web les plus récentes.

L'application permet d'analyser le sentiment de textes (positif, neutre, négatif) via une API d'intelligence artificielle, le tout dans une interface ludique et immersive.

---

## Fonctionnalités

### Interface Desktop Style Windows XP
- Bureau virtuel avec icônes cliquables (style voxel art / low-poly)
- Navigation intuitive : double-clic pour ouvrir les applications
- Sélection visuelle avec bordures en pointillés (effet Windows 95/XP)
- Police pixel art **"Press Start 2P"** pour une authenticité rétro

### Système d'Authentification
- **Page Login** : Connexion utilisateur avec JWT
- **Page SignUp** : Inscription de nouveaux utilisateurs
- Stockage sécurisé des tokens JWT dans `localStorage`
- Protection des routes : Redirection automatique si non authentifié

### Analyse de Sentiment IA
- Interface de saisie pour entrer du texte à analyser
- Appel API vers le backend FastAPI
- Affichage en temps réel du résultat :
  - 😊 **Positif** (score 4-5)
  - 😐 **Neutre** (score 3)
  - 😞 **Négatif** (score 1-2)
- États visuels : loading, success, error

### Page À propos
- Informations sur le projet
- Technologies utilisées
- Crédits et liens utiles

---

## Technologies Utilisées

| Technologie | Version | Rôle |
|------------|---------|------|
| **Next.js** | 14.x | Framework React pour SSR et routing |
| **TypeScript** | 5.x | Typage statique pour plus de robustesse |
| **Tailwind CSS** | 3.x | Styling utilitaire et responsive |
| **React** | 18.x | Bibliothèque UI |
| **Google Fonts** | - | Police "Press Start 2P" pour l'effet rétro |

---

## Structure du Projet
```
SENTIMENT-ANALYSIS-FRONTEND/
├── public/                    # Assets statiques
│   ├── background.png         # Image de fond du desktop
│   ├── sentiment.png          # Icône Analyse
│   ├── login.png              # Icône Login
│   ├── signup.png             # Icône SignUp
│   └── about.png              # Icône À propos
│
├── src/
│   ├── app/                   # Pages Next.js (App Router)
│   │   ├── about/
│   │   │   └── page.tsx       # Page À propos
│   │   ├── analyze/
│   │   │   └── page.tsx       # Page Analyse de sentiment
│   │   ├── login/
│   │   │   └── page.tsx       # Page Login
│   │   ├── signup/
│   │   │   └── page.tsx       # Page Inscription
│   │   ├── globals.css        # Styles globaux
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil (Desktop)
│   │
│   ├── components/            # Composants réutilisables
│   │   ├── Desktop.tsx        # Bureau virtuel Windows XP
│   │   ├── Navbar.tsx         # Barre de navigation (si utilisée)
│   │   └── TypewriterBanner.tsx # Effet machine à écrire
│   │
│   └── lib/
│       └── api.ts             # Configuration Axios et appels API
│
├── .gitignore
├── next.config.ts             # Configuration Next.js
├── package.json               # Dépendances npm
├── tailwind.config.js         # Configuration Tailwind
├── tsconfig.json              # Configuration TypeScript
└── README.md                  # Ce fichier !
```

---

## Installation et Lancement

### Prérequis

- **Node.js** >= 18.x
- **npm** 

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/sentiment-analysis-frontend.git
cd sentiment-analysis-frontend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_API_URL=https://tasentimentxp-backend-nnql.onrender.com
```

### 4. Lancer en mode développement
```bash
npm run dev

```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 5. Build pour production
```bash
npm run build
npm start
```

---

## Déploiement

### Déployé sur Vercel

L'application est automatiquement déployée sur **Vercel** à chaque push sur la branche `main`.

**URL de production** : [https://sentiment-analysis-frontend-vert.vercel.app/](https://sentiment-analysis-frontend-vert.vercel.app/)

### Configuration Vercel

1. Connectez votre repository GitHub à Vercel
2. Ajoutez la variable d'environnement :
```
   NEXT_PUBLIC_API_URL = https://tasentimentxp-backend-nnql.onrender.com
```
3. Déployez automatiquement !

---

## Guide d'Utilisation

### Navigation dans le Desktop

- **Simple clic** : Sélectionne une icône
- **Double-clic** : Ouvre l'application correspondante

### Workflow Complet
```
1. Page Desktop (/)
   ↓
2. Cliquer sur "SignUp" → Créer un compte
   ↓
3. Cliquer sur "Login" → Se connecter
   ↓ (JWT stocké)
4. Cliquer sur "Analyse Sentiment"
   ↓
5. Entrer un texte → Cliquer "Analyser"
   ↓
6. Voir le résultat : Positif / Neutre / Négatif
```

---

## Authentification JWT

### Comment ça marche ?

1. **Login** : L'utilisateur entre `username`/`password`
2. Backend renvoie un token JWT
3. Frontend stocke le JWT dans `localStorage`
4. **Requêtes protégées** : Le JWT est envoyé dans le header `Authorization: Bearer <token>`
5. **Vérification** : Le backend valide le token avant de traiter la requête

### Code Exemple (`lib/api.ts`)
```typescript
// Utilise la variable d'environnement, sinon localhost en développement
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function register(username: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/register/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }

  return await response.json();
}
```

---

## Design System

### Palette de Couleurs (Windows XP Inspired)

- **Bleu primaire** : `#0078D4` (Sélection)
- **Gris clair** : `#ECE9D8` (Fond fenêtre)
- **Vert taskbar** : `#3A6EA5` (Barre des tâches)
- **Texte** : `#2C2C2C` (Noir doux)

### Typographie

- **Police principale** : "Press Start 2P" (Google Fonts)
- **Taille icônes** : 64x64px
- **Taille labels** : 8px (effet bitmap)

### Effets Spéciaux

- **Image rendering** : `pixelated` pour les icônes
- **Drop shadow** : `2px 2px rgba(0,0,0,0.3)` pour la profondeur
- **Sélection** : Bordure pointillée + fond bleu transparent

---

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile l'application pour production |
| `npm start` | Lance l'application en mode production |
| `npm run lint` | Vérifie le code avec ESLint |

---

## Problèmes Connus et Solutions

### Erreur CORS

**Problème** : Requêtes bloquées par CORS lors des appels API

**Solution** : Le backend doit autoriser l'origine frontend dans les CORS headers
```python
# Backend FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # URL du frontend
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)
```

### Token JWT expiré

**Problème** : Erreur 401 après un certain temps

**Solution** : Implémenter un refresh token ou rediriger vers `/login`

---

## Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## Remerciements

- **Inspiration** : Windows XP UI/UX
- **Icônes** : Création custom style voxel art
- **Backend** : FastAPI + HuggingFace API
- **Hébergement** : Vercel (Frontend) + Render (Backend)

---

## 🔗 Liens Utiles

- **Backend Repository** : [GitHub](https://github.com/manalfarouq/Sentiment-analysis-backend-.git)
- **Backend API** : [https://tasentimentxp-backend-nnql.onrender.com](https://tasentimentxp-backend-nnql.onrender.com)
- **Documentation API** : [https://tasentimentxp-backend-nnql.onrender.com/docs](https://tasentimentxp-backend-nnql.onrender.com/docs)
- **Application Live** : [https://sentiment-analysis-frontend-vert.vercel.app/](https://sentiment-analysis-frontend-vert.vercel.app/)
