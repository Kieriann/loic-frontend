import React, { useEffect } from 'react'
import { decodeToken } from '../utils/decodeToken'
import { logout as revokeSession } from '../api'


export default function SessionManager({ token, timeoutMinutes = 30, children }) {
  useEffect(() => {
    if (!token) return undefined

    let loggingOut = false
    const logout = async () => {
      if (loggingOut) return
      loggingOut = true
      await revokeSession()
      window.location.href = '/login'
    }

    const timeout = timeoutMinutes * 60 * 1000
    let timer = setTimeout(logout, timeout)
    const expiresAt = Number(decodeToken(token)?.exp || 0) * 1000
    const expiryDelay = Math.max(0, expiresAt - Date.now())
    const expiryTimer = setTimeout(logout, Math.min(expiryDelay, 2_147_483_647))

    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(logout, timeout)
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('scroll', resetTimer)

    return () => {
      clearTimeout(timer)
      clearTimeout(expiryTimer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      window.removeEventListener('scroll', resetTimer)
    }
  }, [timeoutMinutes, token])

  return children
}
