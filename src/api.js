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
  if (!res.ok) throw new Error(json.message || json.error || 'Erreur d’inscription')
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

export const fetchCurrentUser = async (token) => {
  const res = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(json.error || 'Session invalide')
    error.status = res.status
    throw error
  }
  return json
}

export const logout = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    await fetch(`${AUTH_URL}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export async function setSponsorEmail(token, email) {
  const res = await fetch(`${BASE_URL}/api/sponsor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email })
  })
  if (!res.ok) throw await res.json()
  return res.json()
}

export async function getCvProfilesCount() {
  const res = await fetch(`${BASE_URL}/api/documents/count-cv-profiles`, {
    method: 'GET',
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Erreur compte CV profils')
  return data?.count ?? 0
}

export async function getProfilesCount() {
  const res = await fetch(`${BASE_URL}/api/documents/count-profiles`, {
    method: 'GET',
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Erreur fetch count-profiles')
  return data?.count ?? 0
}



export async function createClientRequest(payload) {
  const res = await fetch(`${BASE_URL}/api/client/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Erreur serveur')
  // attendu: { id: number }
  return data
}
