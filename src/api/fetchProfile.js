//
// ─── Récupère le profil de l'utilisateur connecté ─────────────────
//

export async function fetchProfile(token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/profil`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Erreur récupération profil')

  return await res.json()
}
