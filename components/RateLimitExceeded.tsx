'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Hospital, Search, Mail, Phone, User,
  Bell, CheckCircle, Loader2, X, ChevronDown, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  resetAt: string   // ISO timestamp when limit resets
  used: number
  limit: number
}

export function RateLimitExceeded({ resetAt, used, limit }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [followup, setFollowup] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [formOpen, setFormOpen] = useState(true)

  // Calculate hours until reset
  const hoursLeft = Math.ceil((new Date(resetAt).getTime() - Date.now()) / 3600000)
  const resetLabel = hoursLeft <= 1 ? 'kb. 1 óra múlva' : `kb. ${hoursLeft} óra múlva`

  const handleSubmit = async () => {
    setErrorMsg('')
    if (!email || !email.includes('@')) {
      setErrorMsg('Kérlek adj meg egy érvényes email címet.')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, professional_followup: followup }),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error || 'Hiba.'); setStatus('error'); return }
      setStatus('done')
    } catch {
      setErrorMsg('Hálózati hiba.')
      setStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Main message */}
      <div className="health-card p-7 text-center border-2"
        style={{ borderColor: 'hsl(38,92%,70%)', background: 'hsl(38,92%,98%)' }}>
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'hsl(38,92%,93%)' }}>
          <Clock className="w-7 h-7" style={{ color: 'hsl(38,92%,45%)' }} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Elérted a napi {limit} elemzési limitet
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-3">
          Naponta legfeljebb <strong>{limit} ingyenes elemzést</strong> biztosítunk IP-címenként,
          hogy a szolgáltatás mindenki számára elérhető maradjon.
          A kvótád <strong>{resetLabel}</strong> újul meg (éjfélkor UTC szerint).
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: 'hsl(38,92%,88%)', color: 'hsl(38,92%,30%)' }}>
          {used}/{limit} elemzés felhasználva ma
        </div>
      </div>

      {/* Options heading */}
      <p className="text-center text-slate-500 text-sm font-medium">
        Mit tehetsz most?
      </p>

      {/* Option 1 — Contact form */}
      <div className="health-card overflow-hidden border"
        style={{ borderColor: 'hsl(173,80%,70%)' }}>
        <button
          onClick={() => setFormOpen(o => !o)}
          className="w-full flex items-center gap-4 p-5 text-left"
          style={{ background: 'hsl(173,80%,98%)' }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(173,80%,90%)' }}>
            <Bell className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm mb-0.5">
              Értesítést kérek vagy orvosi visszahívást
            </p>
            <p className="text-xs text-slate-500">
              Add meg az elérhetőségedet — értesítünk, ha a kvótád megújul, vagy orvosi szakembert kérhetsz
            </p>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', formOpen && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100"
            >
              <div className="p-5 space-y-4 bg-white">
                {status === 'done' ? (
                  <div className="flex flex-col items-center py-6 gap-3 text-center">
                    <CheckCircle className="w-10 h-10 text-teal-500" />
                    <p className="font-bold text-slate-900">Köszönjük!</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Rögzítettük az adataidat és küldtünk egy visszaigazolót emailben.
                      {followup && ' Orvosi partnerünk hamarosan felveszi veled a kapcsolatot.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        <User className="w-3 h-3 inline mr-1" />Teljes név (opcionális)
                      </label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="pl. Kovács Anna" className="input-field text-sm py-2.5" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        <Mail className="w-3 h-3 inline mr-1" />Email cím <span className="text-red-500">*</span>
                      </label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="pelda@email.hu" className="input-field text-sm py-2.5" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        <Phone className="w-3 h-3 inline mr-1" />Telefonszám (opcionális)
                      </label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+36 30 123 4567" className="input-field text-sm py-2.5" />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input type="checkbox" checked={followup}
                          onChange={e => setFollowup(e.target.checked)} className="sr-only" />
                        <div className={cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                          followup
                            ? 'border-[hsl(173,80%,40%)] bg-[hsl(173,80%,40%)]'
                            : 'border-slate-300 bg-white'
                        )}>
                          {followup && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Orvosi szakember hívjon fel
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Egy regisztrált orvosi partnerünk emailben vagy telefonon felveszi veled a kapcsolatot.
                          Adataidat harmadik félnek nem adjuk át.
                        </p>
                      </div>
                    </label>

                    {errorMsg && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5" />{errorMsg}
                      </p>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={status === 'sending'}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60"
                      style={{ background: 'hsl(173,80%,40%)' }}
                    >
                      {status === 'sending'
                        ? <><Loader2 className="w-4 h-4 animate-spin" />Küldés...</>
                        : <><Bell className="w-4 h-4" />Elküldés</>}
                    </button>
                    <p className="text-xs text-slate-400 text-center">GDPR szerint kezeljük az adataidat.</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Option 2 — Google searches */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1">
          Vagy tájékozódj saját magad
        </p>
        <a
          href={`https://www.google.hu/search?q=${encodeURIComponent('magánorvos rendelés közelben szakorvos')}&hl=hu&gl=hu`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 health-card hover:shadow-health-lg transition-all group no-underline"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Hospital className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm mb-0.5">Keress szakorvost vagy klinikát</p>
            <p className="text-xs text-slate-500">Google keresés magyar orvosi ellátókra</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </a>
        <a
          href={`https://www.google.hu/search?q=${encodeURIComponent('tünetek értelmezése orvosi információ')}&hl=hu&gl=hu`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 health-card hover:shadow-health-lg transition-all group no-underline"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm mb-0.5">Tájékozódj a témában</p>
            <p className="text-xs text-slate-500">Magyar orvosi és egészségügyi információk</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </a>
      </div>

      <p className="text-xs text-slate-400 text-center leading-relaxed pb-2">
        A napi limit éjfélkor (UTC) automatikusan megújul. Holnap ismét {limit} ingyenes elemzés áll rendelkezésre.
      </p>
    </motion.div>
  )
}
