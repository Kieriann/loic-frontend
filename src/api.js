//
// ─── Fonctions API : authentification et profil utilisateur ───────
//
console.log('AUTH_URL =', AUTH_URL);

const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth`

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
  const json = await res.json()
  if (!res.ok) {
    const err = new Error(json.error || 'Erreur de connexion')
    err.response = { status: res.status, data: json }
    throw err
  }
  return json
}


export const fetchProfile = async (token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/profil`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Unauthorized')

  return res.json()
}
