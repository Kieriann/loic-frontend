//
// ─── Fonctions API : authentification et profil utilisateur ───────
//

const AUTH_URL = 'http://localhost:4000/api/auth'

export const signup = async (data) => {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const login = async (data) => {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const fetchProfile = async (token) => {
  const res = await fetch('http://localhost:4000/api/profile/profil', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Unauthorized')

  return res.json()
}
