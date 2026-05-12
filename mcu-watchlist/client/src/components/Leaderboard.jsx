import { useState, useEffect } from 'react'
import { TOTAL_ITEMS } from '../data'

export default function Leaderboard({ currentUser }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <p className="text-gray-500 text-center py-10">Loading friends...</p>

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">Friends Leaderboard</h2>
      <p className="text-xs text-gray-500 mb-5">Share the app URL with friends so they can join!</p>

      {data.length === 0 && (
        <p className="text-gray-500 text-center py-10">No friends yet — share the link! 🔗</p>
      )}

      <div className="space-y-3">
        {data.map((user, i) => {
          const pct = Math.round(user.watched / TOTAL_ITEMS * 100)
          const isMe = user.id === currentUser.id
          return (
            <div key={user.id} className={`bg-[#1a1a1a] rounded-xl p-4 border ${isMe ? 'border-red-800' : 'border-gray-800'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-gray-600 w-6">#{i + 1}</span>
                <span className={`font-medium flex-1 ${isMe ? 'text-yellow-400' : 'text-white'}`}>
                  {user.username} {isMe && '(you)'}
                </span>
                <span className="text-sm text-gray-400">{user.watched}/{TOTAL_ITEMS}</span>
                <span className="text-sm font-bold text-red-500">{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-700 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
