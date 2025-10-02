import axios from 'axios'
const API = import.meta.env.VITE_API_URL || ''

export async function computeShortlist({ criteria, weights }) {
  const token = localStorage.getItem('token')
  const { data } = await axios.post(
    `${API}/api/shortlist/compute`,
    { criteria, weights },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return data
}
