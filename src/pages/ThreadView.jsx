import React, { useEffect, useState } from 'react'
import { getThread, createReply } from '../api/forum'
import { useParams } from 'react-router-dom'
import { getSocket } from '../api/socket'

export default function ThreadView() {
  const { id } = useParams()
  const [thread, setThread] = useState(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    getThread(id).then(setThread)
    const s = getSocket()
    // rejoindre la room du thread
    s.emit('join', { room: `thread:${id}` })
    const onReply = (reply) => {
      setThread((t) => t ? { ...t, replies: [...t.replies, reply] } : t)
    }
    s.on('reply:new', onReply)
    return () => {
      s.emit('leave', { room: `thread:${id}` })
      s.off('reply:new', onReply)
    }
  }, [id])

  const send = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    await createReply(id, { content })
    setContent('')
  }

  if (!thread) return null

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{thread.title}</h1>
      <div className="text-sm text-gray-600 mt-1">
        #{thread.author?.anonymousTag} • {new Date(thread.createdAt).toLocaleString()}
      </div>
      <p className="mt-4 whitespace-pre-wrap">{thread.content}</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Réponses</h2>
      <ul className="space-y-3">
        {thread.replies.map((r) => (
          <li key={r.id} className="border rounded p-3">
            <div className="text-sm text-gray-600">
              #{r.author?.anonymousTag} • {new Date(r.createdAt).toLocaleString()}
            </div>
            <p className="mt-2 whitespace-pre-wrap">{r.content}</p>
          </li>
        
        ))}
      </ul>

      <form onSubmit={send} className="mt-6 space-y-2">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Votre réponse…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="px-4 py-2 rounded bg-blue-500 text-white">Envoyer</button>
      </form>
    </div>
  )
}
