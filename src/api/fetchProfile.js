const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function fetchProfile(token) {
  const res = await fetch(`${API}/api/profile/profil`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Erreur récupération profil')
  return await res.json()
}
