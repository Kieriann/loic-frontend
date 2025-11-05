import React, { useEffect, useState } from 'react'
import { getThread, createThread, createReply, deleteThread, deleteReply, forumMe } from '../api/forum'
import { getSocket } from '../api/socket'
import { useNavigate, useParams } from 'react-router-dom'
import ForumSidebar from '../components/Forum/ForumSidebar.jsx'
import SideBar from '../components/SideBar.jsx'

export default function ForumPage() {
const [me, setMe] = useState(null)
const [thread, setThread] = useState(null)
const [form, setForm] = useState({ title: '', content: '' })
const [err, setErr] = useState('')
const [submitting, setSubmitting] = useState(false)
const [showCompose, setShowCompose] = useState(false)
const navigate = useNavigate()
const { id } = useParams()
const [reply, setReply] = useState('')
const [replying, setReplying] = useState(false)

const onDeleteThread = async () => {
  if (!thread?.id) return
  try {
    await deleteThread(thread.id)
    navigate('/forum')
  } catch (e) {
    setErr(e.status === 401 ? 'Non connecté' : 'Suppression du fil impossible')
  }
}

const onDeleteReply = async (rid) => {
  try {
    await deleteReply(rid)
    setThread(t => t ? {
      ...t,
      replies: (t.replies || []).filter(r => r.id !== rid),
      _count: { ...(t._count || {}), replies: Math.max(0, (t._count?.replies || 1) - 1) }
    } : t)
  } catch (e) {
    setErr(e.status === 401 ? 'Non connecté' : 'Suppression de la réponse impossible')
  }
}

useEffect(() => {
  forumMe()
    .then(setMe)
    .catch(e => { if (e.status === 401) setErr('Non connecté') })

  if (!id) return
  getThread(id)
    .then(setThread)
    .catch(e => setErr(e.status === 401 ? 'Non connecté' : 'Erreur chargement'))

  const s = getSocket()
  const onReply = (r) => {
    if (String(r.threadId) === String(id)) {
      setThread(t => t ? { ...t, replies: [r, ...(t.replies || [])], _count: { ...(t._count||{}), replies: (t._count?.replies||0)+1 } } : t)
    }
  }
  s.on('reply:new', onReply)
  return () => s.off('reply:new', onReply)
}, [id])

const submit = async (e) => {
  e.preventDefault()
  if (!form.title.trim() || !form.content.trim() || err === 'Non connecté') return
  setSubmitting(true)
  try {
    const th = await createThread({ ...form })
    setForm({ title: '', content: '' })
    setShowCompose(false)
    setThread(th)
    setThreads((t) => [th, ...(t || [])])
    if (th?.id) navigate(`/forum/${th.id}`)
  } catch (e) {
    setErr(e.status === 401 ? 'Non connecté' : 'Erreur création sujet')
  } finally {
    setSubmitting(false)
  }
}

const submitReply = async (e) => {
  e.preventDefault()
  if (!reply.trim() || err === 'Non connecté' || !thread?.id) return
  setReplying(true)
  try {
    const r = await createReply(thread.id, { content: reply.trim() })
    setThread(t =>
      t
        ? {
            ...t,
            replies: [r, ...(t.replies || [])],
            _count: { ...(t._count || {}), replies: (t._count?.replies || 0) + 1 },
            lastActivityAt: r.createdAt,
          }
        : t
    )
    setReply('')
  } catch (e) {
    setErr(e.status === 401 ? 'Non connecté' : 'Erreur envoi réponse')
  } finally {
    setReplying(false)
  }
}

return (
  <div className="min-h-screen bg-primary">
 <div className="grid grid-cols-[14rem_minmax(0,1fr)_16rem] gap-4 px-6 py-6 w-full max-w-[1600px] mx-auto">
     {/* Colonne latérale à GAUCHE (navigation profil/exp/…) */}
     <SideBar
       selectedTab="forum"
       setSelectedTab={() => {}}
       unreadCount={0}
       navigate={navigate}
     />      
     
     <main className="p-6 bg-white rounded-3xl shadow-md">
        <div className="flex items-center justify-between mb-4">
  <h1 className="text-2xl font-bold text-center mb-10 mx-auto">Forum</h1>
  <div className="flex items-center gap-2">
    {thread && me && me.id === thread.authorId && (
      <button
        onClick={onDeleteThread}
        className="rounded bg-red-600 px-3 py-2 text-white hover:opacity-90"
        title="Supprimer ce fil"
      >
        Supprimer le fil
      </button>
    )}
<button
  onClick={() => {
    setShowCompose(true)
    setForm({ title: '', content: '' })
    setThread(null)
  }}
  className="rounded bg-blue-700 px-3 py-2 text-white hover:opacity-90"
>
  Nouveau fil
</button>

  </div>
</div>

        {err && (
          <div className="mb-4 text-sm text-red-600">
            {err === 'Non connecté' ? 'Connectez-vous pour participer.' : err}
          </div>
        )}

        {showCompose && (
          <form onSubmit={submit} className="mb-6 space-y-2">
            <input
              id="forum-title"
              className="w-full border rounded p-2"
              placeholder="Titre du sujet"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              disabled={err === 'Non connecté' || submitting}
            />
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Contenu"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              disabled={err === 'Non connecté' || submitting}
            />
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
              disabled={
                submitting ||
                err === 'Non connecté' ||
                !form.title.trim() ||
                !form.content.trim()
              }
            >
              {submitting ? 'Création…' : 'Créer le sujet'}
            </button>
          </form>
        )}

 {thread && (
  <>
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-1">{thread.title}</h2>
      <p className="text-sm text-gray-600 mb-4">
        {thread._count?.replies ?? 0} réponses · {thread.views ?? 0} vues ·{' '}
        {new Date(thread.lastActivityAt || thread.createdAt).toLocaleString()}
      </p>
      <p className="text-gray-800 whitespace-pre-line">{thread.content}</p>
    </div>

    <div className="space-y-4">
      {[...(thread.replies || [])].reverse().map((r) => (
        <div key={r.id} className="border rounded-lg p-3 bg-white">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>
              #{r.author?.anonymousTag} • {new Date(r.createdAt).toLocaleString()}
            </span>
            {me && me.id === r.authorId && (
              <button
                type="button"
                onClick={() => onDeleteReply(r.id)}
                className="text-red-600 hover:underline"
                title="Supprimer cette réponse"
              >
                Supprimer
              </button>
            )}
          </div>
          <p className="text-gray-800 whitespace-pre-line">{r.content}</p>
        </div>
      ))}
    </div>

    {me ? (
      <form onSubmit={submitReply} className="mt-6 space-y-2">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Écrire une réponse…"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          disabled={err === 'Non connecté' || replying}
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            disabled={replying || err === 'Non connecté' || !reply.trim()}
          >
            {replying ? 'Envoi…' : 'Répondre'}
          </button>
        </div>
      </form>
    ) : (
      <p className="mt-6 text-sm text-gray-600">Connectez-vous pour répondre.</p>
    )}
  </>
)}
</main>
      {/* Colonne latérale à DROITE */}
      <ForumSidebar />
    </div>
  </div>
)

}
