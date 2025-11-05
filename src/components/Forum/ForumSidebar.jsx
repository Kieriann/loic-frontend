import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import cx from 'classnames'
import { forumMe } from '../../api/forum'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function ForumSidebar() {
  const [groups, setGroups] = useState([])
  const [threads, setThreads] = useState([])
  const [sp] = useSearchParams()
  const activeGroup = sp.get('group') || 'general'
  const activeThread = sp.get('thread')
  const { id: routeId } = useParams()

  useEffect(() => {
    fetch(`${API}/api/forum/groups`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(r => r.json())
      .then(setGroups)
  }, [])

  useEffect(() => {
    fetch(`${API}/api/forum/threads?group=${encodeURIComponent(activeGroup)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(r => r.json())
      .then(setThreads)
  }, [activeGroup])

  return (
<aside className="w-72 shrink-0 border-r border-gray-200 bg-white rounded-3xl shadow-md p-3 space-y-4">
      <div>
        <div className="px-2 text-xs font-semibold uppercase text-gray-500">Fils</div>
        <ul className="mt-2 space-y-1">
{threads.map(t => (
  <li key={t.id}>
    <Link
  to={`/forum/${t.id}`}
  className={cx(
    'block truncate rounded px-2 py-1.5 hover:bg-blue-50',
    String(routeId) === String(t.id) && 'bg-blue-100 text-blue-700'
  )}
  title={t.title}
>
      <div className="font-semibold truncate">{t.title}</div>
      <div className="text-xs text-gray-600 mt-0.5">
        {t._count?.replies ?? 0} réponses · {t.views ?? 0} vues ·{' '}
        {new Date(t.lastActivityAt || t.createdAt).toLocaleDateString()}
      </div>
    </Link>
  </li>
))}
        </ul>
      </div>
    </aside>
  )
}
