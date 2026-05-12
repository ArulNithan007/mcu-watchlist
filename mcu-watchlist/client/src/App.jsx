import { useState, useEffect } from 'react'
import Login from './components/Login'
import Checklist from './components/Checklist'
import Leaderboard from './components/Leaderboard'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mcu-user')
    return saved ? JSON.parse(saved) : null
  })
  const [tab, setTab] = useState('checklist')
  const [watched, setWatched] = useState([])

  useEffect(() => {
    if (user) fetchProgress()
  }, [user])

  async function fetchProgress() {
    const res = await fetch(`/api/progress/${user.id}`)
    const data = await res.json()
    setWatched(data.map(p => p.item_id))
  }

  async function handleLogin(userData) {
    localStorage.setItem('mcu-user', JSON.stringify(userData))
    setUser(userData)
  }

  function handleLogout() {
    localStorage.removeItem('mcu-user')
    setUser(null)
    setWatched([])
  }

  async function toggleWatched(itemId) {
    const isWatched = watched.includes(itemId)
    if (isWatched) {
      await fetch('/api/progress', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, itemId })
      })
      setWatched(prev => prev.filter(id => id !== itemId))
    } else {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, itemId })
      })
      setWatched(prev => [...prev, itemId])
    }
  }

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="bg-[#1a1a1a] border-b border-red-900 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-red-600">MCU</span>
          <span className="text-sm text-gray-400">Before Doomsday</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-yellow-500 font-medium">👤 {user.username}</span>
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-400 transition">logout</button>
        </div>
      </header>

      <div className="flex border-b border-gray-800 bg-[#141414]">
        <button
          onClick={() => setTab('checklist')}
          className={`px-6 py-3 text-sm font-medium transition ${tab === 'checklist' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
        >
          My Watchlist
        </button>
        <button
          onClick={() => setTab('leaderboard')}
          className={`px-6 py-3 text-sm font-medium transition ${tab === 'leaderboard' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
        >
          Friends
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {tab === 'checklist'
          ? <Checklist watched={watched} onToggle={toggleWatched} />
          : <Leaderboard currentUser={user} />
        }
      </main>
    </div>
  )
}
