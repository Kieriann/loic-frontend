// src/api.js

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const AUTH_URL = `${baseURL}/api/auth`

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

export const fetchProfile = async (token) => {
  const res = await fetch(`${baseURL}/api/profile/profil`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}
