// src/api/fetchProfile.js

const API = import.meta.env.VITE_API_URL

export async function fetchProfile(token) {
  const res = await fetch(`${API}/api/profile/profil`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Erreur récupération profil')
  return res.json()
}

export async function signup(credentials) {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return res.json()
}

export async function login(credentials) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  return res.json()
}

export async function confirmEmail(token) {
  const res = await fetch(`${API}/api/auth/confirm-email?token=${token}`)
  return res.json()
}
