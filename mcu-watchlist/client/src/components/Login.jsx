import { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name.trim() })
      })
      if (!res.ok) throw new Error('Server error')
      const user = await res.json()
      onLogin(user)
    } catch (err) {
      setError(`Error: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">MARVEL</h1>
          <p className="text-gray-400 text-sm">MCU Watchlist — Before Doomsday</p>
          <p className="text-yellow-500 text-xs mt-1">53 movies & shows to track</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
          <label className="block text-sm text-gray-400 mb-2">Enter your name to start</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Aruln"
            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 mb-4"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Joining...' : "Let's go! 🚀"}
          </button>
          <p className="text-center text-xs text-gray-600 mt-4">Share the app URL with friends so they can join too!</p>
        </form>
      </div>
    </div>
  )
}
