import React, { useEffect } from 'react'


export default function SessionManager({ timeoutMinutes = 30, children }) {
  useEffect(() => {
    const logout = () => {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    const timeout = timeoutMinutes * 60 * 1000
    let timer = setTimeout(logout, timeout)

    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(logout, timeout)
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

  return children
}
