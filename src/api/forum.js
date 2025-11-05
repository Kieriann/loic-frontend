const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function authHeaders() {
  const t = localStorage.getItem('token') || ''
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function jsonOrThrow(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data.error || `HTTP_${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export async function forumMe() {
  const res = await fetch(`${API}/api/forum/me`, { headers: { ...authHeaders() } })
  return jsonOrThrow(res)
}

export async function listThreads(group = 'general', take = 20) {
  const url = `${API}/api/forum/threads?group=${encodeURIComponent(group)}&take=${take}`
  const res = await fetch(url, { headers: { ...authHeaders() } })
  return jsonOrThrow(res)
}

export async function createThread(payload) {
  const res = await fetch(`${API}/api/forum/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return jsonOrThrow(res)
}

export async function getThread(id) {
  const res = await fetch(`${API}/api/forum/threads/${id}`, { headers: { ...authHeaders() } })
  return jsonOrThrow(res)
}

export async function createReply(threadId, payload) {
  const res = await fetch(`${API}/api/forum/threads/${threadId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return jsonOrThrow(res)
}
export async function deleteThread(id) {
  const res = await fetch(`${API}/api/forum/threads/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw { status: res.status }
  return true
}

export async function deleteReply(id) {
  const res = await fetch(`${API}/api/forum/reply/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw { status: res.status }
  return true
}


