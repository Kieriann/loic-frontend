const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem('token') || ''
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function listClientSavedSearches() {
  const res = await fetch(`${API_URL}/api/client-saved-searches`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Erreur liste recherches')
  return res.json()
}

export async function createClientSavedSearch(query, name) {
  const res = await fetch(`${API_URL}/api/client-saved-searches`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ query, name }),
  })
  if (!res.ok) throw new Error('Erreur création recherche')
  return res.json()
}

export async function updateClientSavedSearch(id, payload) {
  const res = await fetch(`${API_URL}/api/client-saved-searches/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erreur mise à jour recherche')
  return res.json()
}

export async function deleteClientSavedSearch(id) {
  const res = await fetch(`${API_URL}/api/client-saved-searches/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Erreur suppression recherche')
  return res.json()
}