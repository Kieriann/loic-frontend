// src/api/fetchProfile.js

const API = import.meta.env.VITE_API_URL

export async function fetchProfile(token) {
  const [profileRes, realRes] = await Promise.all([
    fetch(`${API}/api/profile/profil`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${API}/api/realisations`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  ])

  if (!profileRes.ok) throw new Error('Erreur récupération profil')
  if (!realRes.ok) throw new Error('Erreur récupération réalisations')

  const profile = await profileRes.json()
  const realisations = await realRes.json()

  return { ...profile, realisations }
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
