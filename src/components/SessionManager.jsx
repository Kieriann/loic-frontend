import { useEffect } from 'react'

export default function SessionManager({ timeoutMinutes = 30 }) {
  useEffect(() => {
    const timeout = timeoutMinutes * 60 * 1000
    let timer = setTimeout(logout, timeout)

    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(logout, timeout)
    }

    const logout = () => {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('scroll', resetTimer)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      window.removeEventListener('scroll', resetTimer)
    }
  }, [timeoutMinutes])

  return null
}
