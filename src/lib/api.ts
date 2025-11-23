interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  token: string;
}

interface SentimentResponse {
  result: string;
}

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

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return await response.json();
}

export async function analyzeSentiment(text: string, token: string): Promise<SentimentResponse> {
  const response = await fetch(`${API_URL}/sentiment/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Analysis failed');
  }

  return await response.json();
}