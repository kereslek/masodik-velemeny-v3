'use client'

import { useState, useEffect } from 'react'
import { Download, RefreshCw, LogOut, Users, Phone, Mail, CheckCircle, Clock, Search } from 'lucide-react'

interface Lead {
  id: string
  name: string | null
  email: string
  phone: string | null
  professional_followup: boolean
  created_at: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'followup'>('all')
  const [lastRefresh, setLastRefresh] = useState<string>('')

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'diagnozisom-admin-2025') {
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'x-admin-key': 'diagnozisom-admin-2025' }
      })
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
        setLastRefresh(new Date().toLocaleTimeString('hu-HU'))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchLeads()
  }, [authed])

  const exportCSV = () => {
    const rows = [
      ['ID', 'Név', 'Email', 'Telefon', 'Visszahívás kérve', 'Dátum'],
      ...leads.map(l => [
        l.id,
        l.name || '',
        l.email,
        l.phone || '',
        l.professional_followup ? 'igen' : 'nem',
        new Date(l.created_at).toLocaleString('hu-HU'),
      ])
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagnozisom-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search)
    const matchFilter = filter === 'all' || (filter === 'followup' && l.professional_followup)
    return matchSearch && matchFilter
  })

  const followupCount = leads.filter(l => l.professional_followup).length

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="health-card p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(173,80%,93%)' }}>
              <Users className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg leading-tight">Admin</h1>
              <p className="text-xs text-slate-400">Diagnózisom.hu</p>
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jelszó</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Admin jelszó"
            className="input-field mb-3"
            autoFocus
          />
          {pwError && <p className="text-xs text-red-500 mb-3 font-medium">Hibás jelszó.</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'hsl(173,80%,40%)' }}
          >
            Belépés
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(173,80%,93%)' }}>
            <Users className="w-4 h-4" style={{ color: 'hsl(173,80%,40%)' }} />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base leading-tight">Lead Dashboard</h1>
            <p className="text-xs text-slate-400">Diagnózisom.hu admin</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && <span className="text-xs text-slate-400">Frissítve: {lastRefresh}</span>}
          <button onClick={fetchLeads} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Frissítés
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: 'hsl(173,80%,40%)' }}>
            <Download className="w-3.5 h-3.5" />
            CSV export
          </button>
          <button onClick={() => setAuthed(false)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Összes lead', value: leads.length, icon: Users, color: 'hsl(173,80%,40%)' },
            { label: 'Visszahívást kért', value: followupCount, icon: Phone, color: 'hsl(38,92%,50%)' },
            { label: 'Csak email', value: leads.length - followupCount, icon: Mail, color: 'hsl(210,80%,50%)' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="health-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">{label}</span>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Keresés név, email, telefon..."
              className="input-field pl-9 text-sm py-2.5"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'followup'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f
                    ? 'text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                style={filter === f ? { background: 'hsl(173,80%,40%)' } : {}}>
                {f === 'all' ? 'Összes' : 'Visszahívást kért'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="health-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Users className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-sm font-medium">
                {leads.length === 0 ? 'Még nincsenek leadek' : 'Nincs találat'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Dátum', 'Email', 'Név', 'Telefon', 'Visszahívás'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id}
                    className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.created_at).toLocaleString('hu-HU', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`mailto:${lead.email}`}
                        className="text-sm font-medium text-slate-700 hover:underline"
                        style={{ color: 'hsl(173,80%,35%)' }}>
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{lead.name || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {lead.phone
                        ? <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {lead.professional_followup
                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: 'hsl(173,80%,93%)', color: 'hsl(173,80%,35%)' }}>
                            <CheckCircle className="w-3 h-3" />Igen
                          </span>
                        : <span className="text-xs text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          {filtered.length} lead megjelenítve · Adatok: Supabase · GDPR szerint kezeljük
        </p>
      </div>
    </div>
  )
}
