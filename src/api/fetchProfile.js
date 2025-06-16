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

  if (!res.ok) {
    throw new Error('Erreur récupération profil')
  }

  const { isAdmin, profile, experiences, documents, prestations } = await res.json()
  return { isAdmin, profile, experiences, documents, prestations }
}
