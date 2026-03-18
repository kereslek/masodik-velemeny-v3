'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, CheckCircle2, Clock, Activity,
  ChevronDown, ChevronUp, Printer, ListChecks,
  RotateCcw, ArrowRight, ShieldAlert, BookOpen,
  FileCheck, FileX, Minus, Hospital, Search,
  Mail, Download, Phone, User, Bell, CheckCircle,
  Loader2, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalysisResult } from '@/lib/types'

interface Props { result: AnalysisResult }

const RECOMMENDATION_CONFIG = {
  urgent: {
    label: 'Sürgős orvosi vizsgálat',
    sublabel: 'Kérjük, 24 órán belül keress fel orvost vagy menj sürgősségire.',
    icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700',
  },
  soon: {
    label: 'Mielőbbi orvosi konzultáció',
    sublabel: 'A tünetek alapján 1–2 héten belül javasolt orvoshoz fordulni.',
    icon: Clock, bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700',
  },
  monitor: {
    label: 'Figyelj és tájékozódj',
    sublabel: 'Nem sürgős, de érdemes nyomon követni a tüneteket.',
    icon: Activity, bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700',
  },
  relax: {
    label: 'Valószínűleg nem komoly',
    sublabel: 'A leírtak alapján nem kell azonnal aggódni, de figyelj magadra.',
    icon: CheckCircle2, bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700',
  },
}

// ── Coherence Bar ──────────────────────────────────────────────────────────────
function CoherenceIndicator({ score, summary }: { score: number; summary: string | null }) {
  const cfg = score >= 75
    ? { label: 'Összhangban', color: 'hsl(173,80%,40%)', track: 'hsl(173,80%,93%)', icon: FileCheck, iconCls: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' }
    : score >= 40
    ? { label: 'Részben egyezik', color: 'hsl(38,92%,50%)', track: 'hsl(38,92%,93%)', icon: Minus, iconCls: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    : { label: 'Eltérés észlelhető', color: 'hsl(0,84%,60%)', track: 'hsl(0,84%,95%)', icon: FileX, iconCls: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' }

  const Icon = cfg.icon
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
      className={cn('health-card p-6 md:p-8 border', cfg.bg, cfg.border)}>
      <div className="flex items-start gap-4 mb-5">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border', cfg.bg, cfg.border)}>
          <Icon className={cn('w-5 h-5', cfg.iconCls)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-slate-900">Leírás–dokumentum összhang</h3>
            <span className="text-2xl font-extrabold" style={{ color: cfg.color }}>{score}%</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
        </div>
      </div>
      <div className="h-2.5 rounded-full mb-3" style={{ background: cfg.track }}>
        <motion.div className="h-2.5 rounded-full" style={{ background: cfg.color }}
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }} />
      </div>
      <div className="flex justify-between text-xs text-slate-400 font-medium mb-4">
        <span>Eltér</span><span>Részben egyezik</span><span>Egyezik</span>
      </div>
      {summary && <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{summary}</p>}
    </motion.div>
  )
}

// ── Email / Lead Panel ─────────────────────────────────────────────────────────
function EmailLeadPanel() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [followup, setFollowup] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
      if (!res.ok) { setErrorMsg(data.error || 'Hiba történt.'); setStatus('error'); return }
      setStatus('done')
    } catch {
      setErrorMsg('Hálózati hiba. Kérlek próbáld újra.')
      setStatus('error')
    }
  }

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      {/* Trigger row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-slate-500" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-sm">Eredmény küldése emailben</p>
          <p className="text-xs text-slate-500">Kapj értesítést és iratkozz fel orvosi visszajelzésre</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0', open && 'rotate-180')} />
      </button>

      {/* Expandable form */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50 space-y-4">

              {status === 'done' ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <CheckCircle className="w-10 h-10 text-teal-500" />
                  <p className="font-bold text-slate-900">Köszönjük!</p>
                  <p className="text-sm text-slate-500 text-center">
                    Rögzítettük az adataidat.
                    {followup && ' Orvosi szakember hamarosan felveszi veled a kapcsolatot.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      <User className="w-3 h-3 inline mr-1" />Teljes név (opcionális)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="pl. Kovács Anna"
                      className="input-field text-sm py-2.5"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      <Mail className="w-3 h-3 inline mr-1" />Email cím <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="pelda@email.hu"
                      className="input-field text-sm py-2.5"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      <Phone className="w-3 h-3 inline mr-1" />Telefonszám (opcionális)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+36 30 123 4567"
                      className="input-field text-sm py-2.5"
                    />
                  </div>

                  {/* Followup consent checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={followup}
                        onChange={e => setFollowup(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
                          followup
                            ? 'border-[hsl(173,80%,40%)] bg-[hsl(173,80%,40%)]'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        )}
                      >
                        {followup && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-snug">
                        Szeretném, ha orvosi szakember felvenne velem a kapcsolatot
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Beleegyezem, hogy a Diagnózisom.hu platformon regisztrált orvosi partner
                        emailben vagy telefonon felvegye velem a kapcsolatot. Adataimat harmadik
                        félnek nem adjuk át, és bármikor leiratkozhatsz.
                      </p>
                    </div>
                  </label>

                  {/* Error */}
                  {(status === 'error' || errorMsg) && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5" />{errorMsg}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'sending'}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60"
                    style={{ background: 'hsl(173,80%,40%)' }}
                  >
                    {status === 'sending'
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Küldés...</>
                      : <><Bell className="w-4 h-4" />Elküldés és feliratkozás</>
                    }
                  </button>

                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    GDPR: az adatokat biztonságosan tároljuk és kizárólag az általad megjelölt célra használjuk.
                    Az egészségügyi adatokat külön nem tároljuk.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Next Steps Panel ───────────────────────────────────────────────────────────
function NextStepsPanel({ result }: { result: AnalysisResult }) {
  const clinicQuery = result.clinic_search_query || 'szakorvos magánrendelés Magyarország'
  const clinicUrl   = `https://www.google.hu/search?q=${encodeURIComponent(clinicQuery)}&hl=hu&gl=hu`

  // Info search — now fully Hungarian query + Hungarian Google
  const infoQuery = result.google_search_query || ''
  const infoUrl   = infoQuery
    ? `https://www.google.hu/search?q=${encodeURIComponent(infoQuery)}&hl=hu&gl=hu`
    : null

  const handleSavePDF = () => {
    const s = document.createElement('style')
    s.textContent = `@page{size:A4;margin:15mm}@media print{.no-print{display:none!important}}`
    document.head.appendChild(s)
    window.print()
    setTimeout(() => document.head.removeChild(s), 1000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="health-card p-6 md:p-8"
      style={{ background: 'linear-gradient(135deg,hsl(173,80%,98%),hsl(210,60%,98%))' }}>

      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Mi legyen a következő lépés?</h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          Az AI elemzés egy kiindulópont. Találj szakembert, tájékozódj tovább, vagy mentsd el az eredményt.
        </p>
      </div>

      {/* 1 — Find a doctor */}
      <a href={clinicUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 mb-3 rounded-2xl border-2 bg-white transition-all duration-200 group no-underline"
        style={{ borderColor: 'hsl(173,80%,70%)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'hsl(173,80%,97%)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'hsl(173,80%,93%)' }}>
          <Hospital className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm mb-0.5">Szakorvos vagy klinika keresése</p>
          <p className="text-xs text-slate-500 truncate">
            <em className="text-slate-600 not-italic">„{clinicQuery}"</em>
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </a>

      {/* 2 — General info (Hungarian) */}
      {infoUrl && (
        <a href={infoUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 mb-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group no-underline"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm mb-0.5">Tájékozódás a témában</p>
            <p className="text-xs text-slate-500 truncate">
              <em className="text-slate-600 not-italic">„{infoQuery}"</em>
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </a>
      )}

      {/* 3 — Print + Save PDF */}
      <div className="grid grid-cols-2 gap-3 mb-3 no-print">
        <button onClick={() => window.print()}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <Printer className="w-4 h-4 text-slate-500" />Nyomtatás
        </button>
        <button onClick={handleSavePDF}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <Download className="w-4 h-4 text-slate-500" />Mentés PDF
        </button>
      </div>

      {/* 4 — Email / Lead capture */}
      <EmailLeadPanel />

    </motion.div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────────────
export function ResultsDisplay({ result }: Props) {
  const [showQuestions, setShowQuestions] = useState(true)
  const [showFlags, setShowFlags] = useState(true)

  const config = RECOMMENDATION_CONFIG[result.recommendation] ?? RECOMMENDATION_CONFIG.monitor
  const Icon = config.icon

  return (
    <div className="space-y-6">

      {/* Recommendation banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={cn('health-card p-6 md:p-8 border-2', config.bg, config.border)}>
        <div className="flex items-start gap-4">
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', config.badge)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide inline-block mb-2', config.badge)}>
              AI értékelés
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{config.label}</h2>
            <p className="text-slate-600">{config.sublabel}</p>
          </div>
        </div>
        {result.recommendation_text && (
          <div className="mt-4 pt-4 border-t border-black/5">
            <p className="text-slate-700 leading-relaxed">{result.recommendation_text}</p>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="health-card p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
          <h3 className="text-lg font-bold text-slate-900">Összefoglaló</h3>
        </div>
        <p className="text-slate-700 leading-relaxed text-base">{result.summary}</p>
      </motion.div>

      {/* Coherence (only when files uploaded) */}
      {result.coherence_score !== null && result.coherence_score !== undefined && (
        <CoherenceIndicator score={result.coherence_score} summary={result.coherence_summary} />
      )}

      {/* Findings */}
      {result.findings?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="health-card p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Főbb megfigyelések</h3>
          <ul className="space-y-3">
            {result.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: 'hsl(173,80%,40%)' }} />
                <p className="text-slate-700 leading-relaxed">{f}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Red flags */}
      {result.red_flags?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="health-card p-6 md:p-8 bg-red-50 border-red-200 border">
          <button className="flex items-center justify-between w-full" onClick={() => setShowFlags(v => !v)}>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-red-800">Figyelmeztető jelek</h3>
            </div>
            {showFlags ? <ChevronUp className="w-5 h-5 text-red-400" /> : <ChevronDown className="w-5 h-5 text-red-400" />}
          </button>
          <AnimatePresence>
            {showFlags && (
              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-2 overflow-hidden">
                {result.red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm leading-relaxed">{flag}</p>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Questions for doctor */}
      {result.questions_to_ask?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="health-card p-6 md:p-8">
          <button className="flex items-center justify-between w-full" onClick={() => setShowQuestions(v => !v)}>
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
              <h3 className="text-lg font-bold text-slate-900">Kérdések az orvosnak</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'hsl(173,80%,93%)', color: 'hsl(173,80%,35%)' }}>
                {result.questions_to_ask.length} kérdés
              </span>
            </div>
            {showQuestions ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          <AnimatePresence>
            {showQuestions && (
              <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-3 overflow-hidden">
                {result.questions_to_ask.map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'hsl(173,80%,40%)' }}>{i + 1}</span>
                    <p className="text-slate-700 leading-relaxed">{q}</p>
                  </li>
                ))}
              </motion.ol>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Next steps: doctor search + info + print/PDF + email/lead */}
      <NextStepsPanel result={result} />

      {/* Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-xs text-slate-500 leading-relaxed text-center">
          <strong>Fontos:</strong>{' '}
          {result.disclaimer || 'Ez az elemzés nem helyettesíti a szakorvosi diagnózist. Minden egészségügyi döntést orvosával konzultálva hozzon meg.'}
        </p>
      </div>

      {/* New analysis */}
      <div className="text-center pt-2 no-print">
        <Link href="/"
          className="inline-flex items-center gap-2 py-3.5 px-8 health-button btn-primary text-sm font-semibold"
          onClick={() => { if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('analysisResult') }}>
          <RotateCcw className="w-4 h-4" />Új elemzés indítása<ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  )
}
