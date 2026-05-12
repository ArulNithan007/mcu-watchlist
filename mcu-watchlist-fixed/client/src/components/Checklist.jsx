import { useState } from 'react'
import { MCU_DATA, ALL_ITEMS } from '../data'

function fmt(mins) {
  if (!mins) return 'TBD'
  const h = Math.floor(mins / 60), m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function fmtTotal(mins) {
  const h = Math.floor(mins / 60), m = mins % 60
  return `${h}h ${m}m`
}

export default function Checklist({ watched, onToggle }) {
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')

  const totalRuntime = ALL_ITEMS.filter(i => i.runtime).reduce((a, i) => a + i.runtime, 0)
  const watchedRuntime = ALL_ITEMS.filter(i => watched.includes(i.id) && i.runtime).reduce((a, i) => a + i.runtime, 0)
  const remainingRuntime = totalRuntime - watchedRuntime
  const pct = Math.round(watched.length / ALL_ITEMS.length * 100)

  function filterItems(items) {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || (filter === 'unwatched' && !watched.includes(item.id)) || (filter === 'essential' && item.essential)
      const matchType = typeFilter === 'all' || item.type === typeFilter
      return matchSearch && matchFilter && matchType
    })
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-gray-800">
          <div className="text-2xl font-bold text-red-500">{watched.length}</div>
          <div className="text-xs text-gray-500 mt-1">watched</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-gray-800">
          <div className="text-2xl font-bold text-yellow-500">{ALL_ITEMS.length - watched.length}</div>
          <div className="text-xs text-gray-500 mt-1">remaining</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-gray-800">
          <div className="text-lg font-bold text-green-500">{fmtTotal(remainingRuntime)}</div>
          <div className="text-xs text-gray-500 mt-1">hrs left</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Overall progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600 flex-1 min-w-[120px]"
        />
        {['all', 'unwatched', 'essential'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === f ? 'bg-red-700 text-white' : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:border-gray-500'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {['all', 'movie', 'show'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${typeFilter === t ? 'bg-yellow-700 text-white' : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:border-gray-500'}`}>
            {t === 'all' ? 'All types' : t === 'movie' ? '🎬 Movies' : '📺 Shows'}
          </button>
        ))}
      </div>

      {/* Phase groups */}
      {MCU_DATA.map(group => {
        const filtered = filterItems(group.items)
        if (!filtered.length) return null
        const watchedInPhase = group.items.filter(i => watched.includes(i.id)).length
        const phaseTotal = group.items.length
        const phasePct = Math.round(watchedInPhase / phaseTotal * 100)

        return (
          <div key={group.phase} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.phase}</h2>
              <span className="text-xs text-gray-600">{watchedInPhase}/{phaseTotal}</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-red-900 rounded-full transition-all" style={{ width: `${phasePct}%` }} />
            </div>
            <div className="space-y-1">
              {filtered.map(item => {
                const isWatched = watched.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${isWatched ? 'opacity-50 bg-[#1a1a1a]' : 'bg-[#1a1a1a] hover:bg-[#222]'} border border-gray-800`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition ${isWatched ? 'bg-green-600 border-green-600' : 'border-gray-600'}`}>
                      {isWatched && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isWatched ? 'line-through text-gray-500' : 'text-white'}`}>{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.year} · {item.type === 'movie' ? `🎬 ${fmt(item.runtime)}` : `📺 ${item.episodes} eps`}
                      </p>
                    </div>
                    {item.essential && (
                      <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full flex-shrink-0">Essential</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
