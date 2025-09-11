import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

export default function IndepMessagerie() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherId, setOtherId] = useState('') // ID de l'autre utilisateur
  const API = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')
  const [sendStatus, setSendStatus] = useState(null)



  const bottomRef = useRef(null)

  useEffect(() => {
    if (!otherId) return

    const fetchMessages = () => {
        axios.get(`${API}/api/messages/${otherId}`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error(err))
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)

    return () => clearInterval(interval)
  }, [otherId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

const sendMessage = async () => {
  if (!newMessage || !otherId) return
try {
  const res = await axios.post(`${API}/api/messages`, {
    receiverId: parseInt(otherId, 10),
    content: newMessage,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  setMessages([...messages, res.data])
  setNewMessage('')
  setSendStatus('ok')
  setTimeout(() => setSendStatus(null), 1500)
} catch (err) {
  console.error(err)
  setSendStatus('err')
  setTimeout(() => setSendStatus(null), 2500)
}

}


  return (
    <div className="p-4 flex flex-col h-full">
      <input
        type="text"
        placeholder="ID du client"
        value={otherId}
        onChange={e => setOtherId(e.target.value)}
        className="border p-2 mb-2"
      />

<div className="flex-1 border p-2 mb-2 overflow-y-auto max-h-[500px]">
        {Array.isArray(messages) && messages.map(msg => (
          <div
            key={msg.id}
            className={`p-2 my-1 rounded ${
              msg.senderId === parseInt(otherId, 10)
                ? 'bg-gray-200 self-start text-left'
                : 'bg-green-200 self-end text-right'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
            {(msg.sender?.profile?.workerStatus === 'indep' ? 'Indep' : 'Client') + ' ' + msg.senderId}
            </div>

            <div className="flex items-center justify-between">
              <span>{msg.content}</span>
              {msg.senderId !== parseInt(otherId, 10) && (
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
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 ml-2"
        >
          Envoyer
        </button>
        {sendStatus === 'ok'  && <span className="ml-2 text-green-600 text-sm">Message envoyé</span>}
        {sendStatus === 'err' && <span className="ml-2 text-red-600 text-sm">Échec d’envoi</span>}

      </div>
    </div>
  )
}
