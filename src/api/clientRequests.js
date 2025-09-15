export async function getClientRequests() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/client/requests`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (res.status === 401) { localStorage.removeItem('token') }
  if (!res.ok) throw new Error('REQUESTS_FETCH_FAILED')
  return res.json()
}

export async function getClientRequest(id) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/client/requests/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('REQUEST_FETCH_FAILED')
  return res.json()
}

export async function updateClientRequest(id, payload) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/client/requests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'REQUEST_UPDATE_FAILED')
  return data
}
