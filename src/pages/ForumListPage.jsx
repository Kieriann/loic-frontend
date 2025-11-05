import React, { useEffect, useState } from 'react'
import { listThreads, createThread, forumMe } from '../api/forum'
import { getSocket } from '../api/socket'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import SideBar from '../components/SideBar.jsx'



export default function ForumListPage() {
  const [me, setMe] = useState(null)
  const [threads, setThreads] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const group = sp.get('group') || 'general'
  const [showCompose, setShowCompose] = useState(false)


  useEffect(() => {
    forumMe()
      .then(setMe)
      .catch(e => {
        if (e.status === 401) setErr('Non connecté')
      })

    listThreads(group)
      .then(xs => setThreads(Array.isArray(xs) ? xs : []))
      .catch(e => {
        setErr(e.status === 401 ? 'Non connecté' : 'Erreur chargement')
        setThreads([])
      })

    const s = getSocket()
    const onNew = (th) => setThreads((xs) => [th, ...(Array.isArray(xs) ? xs : [])])
    s.on('thread:new', onNew)
    return () => s.off('thread:new', onNew)
  }, [group])


  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim() || err === 'Non connecté') return
    setSubmitting(true)
    try {
      const th = await createThread({ ...form, group })
      setForm({ title: '', content: '' })
      // on navigue vers le thread créé pour fluidité
      if (th?.id) navigate(`/forum/${th.id}`)
    } catch (e) {
      setErr(e.status === 401 ? 'Non connecté' : 'Erreur création sujet')
    } finally {
      setSubmitting(false)
    }
  }



return (
  <div className="min-h-screen bg-primary">
 <div className="grid grid-cols-[14rem_1fr] gap-4 px-6 py-6 w-full max-w-[1600px] mx-auto">
      <SideBar
        selectedTab="forum"
        setSelectedTab={() => {}}
        unreadCount={0}
        navigate={navigate}
      />

<main className="p-6 bg-white rounded-3xl shadow-md h-full min-h-[80vh]">
<div className="flex items-center justify-between mb-6 relative">
  <h1 className="text-2xl font-bold text-center mb-10 flex-1 text-center">Forum</h1>
  {me && (
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

  )}
</div>
<h2 className="text-xl font-semibold mb-3 text-gray-700">Dernières discussions</h2>
{showCompose && (
  <form id="forum-compose" onSubmit={submit} className="mb-6 space-y-2">
    <input
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
    <div className="flex justify-end">
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
    </div>
  </form>
)}

        <ul className="space-y-3">
          {threads.map((t) => (
            <li key={t.id} className="border rounded-lg p-4 bg-white hover:shadow-sm">
              <Link to={`/forum/${t.id}`} className="font-semibold text-lg hover:text-blue-600">
                {t.title}
              </Link>
              <div className="text-sm text-gray-600 mt-1">
                {t._count?.replies ?? 0} réponses · {t.views ?? 0} vues ·{' '}
                {new Date(t.lastActivityAt || t.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  </div>
)
}
