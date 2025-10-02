import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

export default function IndepMessagerie() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherId, setOtherId] = useState('')
  const [sendStatus, setSendStatus] = useState(null)
  const [threads, setThreads] = useState([])
  const bottomRef = useRef(null)
  const [searchParams] = useSearchParams()

  const API = import.meta.env.VITE_API_URL || ''
  const otherIdNum = Number(otherId) || 0

  useEffect(() => {
    const id = searchParams.get('otherId') || localStorage.getItem('lastOtherId')
    if (id) setOtherId(String(id))
  }, [searchParams])

  useEffect(() => {
    if (otherId) localStorage.setItem('lastOtherId', String(otherId))
  }, [otherId])

  // Charger la liste des fils (threads)
  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) return
    axios
      .get(`${API}/api/messages/threads`, { headers: { Authorization: `Bearer ${t}` } })
      .then(res => Array.isArray(res.data) && setThreads(res.data))
      .catch(() => {})
  }, [API])

  // Charger les messages avec otherId sélectionné + poll
  useEffect(() => {
    if (!otherId) return
    const fetchMessages = () => {
      const t = localStorage.getItem('token')
      if (!t) return (window.location.href = '/login')
      axios
        .get(`${API}/api/messages/${otherId}`, {
          headers: { Authorization: `Bearer ${t}` },
        })
        .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
        .catch(err => {
          if (err?.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
          } else {
            console.error(err)
          }
        })
    }
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [otherId, API])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage || !otherIdNum) return
    const t = localStorage.getItem('token')
    if (!t) return (window.location.href = '/login')
    try {
      const res = await axios.post(
        `${API}/api/messages`,
        { receiverId: otherIdNum, content: newMessage },
        { headers: { Authorization: `Bearer ${t}` } }
      )
      setMessages(prev => [...prev, res.data])
      setNewMessage('')
      setSendStatus('ok')
      setTimeout(() => setSendStatus(null), 1500)
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else {
        console.error(err)
        setSendStatus('err')
        setTimeout(() => setSendStatus(null), 2500)
      }
    }
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="ID de l’autre"
          value={otherId}
          onChange={e => setOtherId(e.target.value)}
          className="border p-2"
        />
        {threads.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {threads.map(t => (
              <button
                key={t.otherId}
                type="button"
                onClick={() => setOtherId(String(t.otherId))}
                className="px-2 py-1 text-xs rounded border"
                title={t.lastMessage?.content || ''}
              >
                #{t.otherId}
                {t.unread ? ` · ${t.unread}` : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 border p-2 mb-2 overflow-y-auto max-h-[500px]">
        {Array.isArray(messages) &&
          messages.map(msg => (
            <div
              key={msg.id}
              className={`p-2 my-1 rounded ${
                msg.senderId === otherIdNum
                  ? 'bg-gray-200 self-start text-left'
                  : 'bg-green-200 self-end text-right'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {(msg.sender?.Profile?.workerStatus === 'indep' ? 'Indep' : 'Client') +
                  ' ' +
                  msg.senderId}
              </div>

              <div className="flex items-center justify-between">
                <span>{msg.content}</span>
                {msg.senderId !== otherIdNum && (
                  <span className="text-xs ml-2 text-gray-400">
                    {msg.isRead ? '✓ Lu' : '• Non lu'}
                  </span>
                )}
              </div>
            </div>
          ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Écrire un message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="border p-2 flex-1"
        />
        <button onClick={sendMessage} className="bg-green-500 text-white px-4 ml-2">
          Envoyer
        </button>
        {sendStatus === 'ok' && <span className="ml-2 text-green-600 text-sm">Message envoyé</span>}
        {sendStatus === 'err' && (
          <span className="ml-2 text-red-600 text-sm">Échec d’envoi</span>
        )}
      </div>
    </div>
  )
}
