// src/api.js

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const AUTH_URL = `${BASE_URL}/api/auth`

export const signup = async (data) => {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erreur d’inscription')
  return json
}

export const login = async (data) => {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) {
    const err = new Error(json.error || 'Erreur de connexion')
    err.response = { status: res.status, data: json }
    throw err
  }
  return json
}

export async function getAllDocuments() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Erreur lors de la récupération des documents')
  return res.json()
}

export const fetchProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/api/profile/profil`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  console.log('[fetchProfile] status', res.status);

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(
      `Profil : ${res.status} ${res.statusText} – ${txt || 'aucune donnée'}`
    );
  }

  return res.json();
};
