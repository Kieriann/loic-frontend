export async function getClientProfile() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/client/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (res.status === 401) { localStorage.removeItem('token') }
  if (!res.ok) return null
  return res.json()
}

export async function saveClientProfile(payload) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/client/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) { localStorage.removeItem('token') }
  if (!res.ok) throw new Error('SAVE_FAILED')
  return res.json()
}
