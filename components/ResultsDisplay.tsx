'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, CheckCircle2, Clock, Activity,
  ChevronDown, ChevronUp, Search, Printer,
  ListChecks, RotateCcw, ArrowRight, ShieldAlert,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalysisResult } from '@/lib/types'

interface Props {
  result: AnalysisResult
}

const RECOMMENDATION_CONFIG = {
  urgent: {
    label: 'Sürgős orvosi vizsgálat',
    sublabel: 'Kérjük, 24 órán belül keress fel orvost vagy menj sürgősségire.',
    icon: AlertTriangle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    icon_color: 'text-red-500',
    dot: 'bg-red-500',
  },
  soon: {
    label: 'Mielőbbi orvosi konzultáció',
    sublabel: 'A tünetek alapján 1–2 héten belül javasolt orvoshoz fordulni.',
    icon: Clock,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    icon_color: 'text-amber-500',
    dot: 'bg-amber-500',
  },
  monitor: {
    label: 'Figyelj és tájékozódj',
    sublabel: 'Nem sürgős, de érdemes nyomon követni a tüneteket.',
    icon: Activity,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    icon_color: 'text-blue-500',
    dot: 'bg-blue-500',
  },
  relax: {
    label: 'Valószínűleg nem komoly',
    sublabel: 'A leírtak alapján nem kell azonnal aggódni, de figyelj magadra.',
    icon: CheckCircle2,
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
    icon_color: 'text-teal-500',
    dot: 'bg-teal-500',
  },
}

export function ResultsDisplay({ result }: Props) {
  const [showQuestions, setShowQuestions] = useState(true)
  const [showFlags, setShowFlags] = useState(true)

  const config = RECOMMENDATION_CONFIG[result.recommendation] ?? RECOMMENDATION_CONFIG.monitor
  const Icon = config.icon

  const handleGoogleSearch = () => {
    if (!result.google_search_query) return
    const q = encodeURIComponent(result.google_search_query)
    window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">

      {/* ── Recommendation Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('health-card p-6 md:p-8 border-2', config.bg, config.border)}
      >
        <div className="flex items-start gap-4">
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', config.badge)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide', config.badge)}>
                AI értékelés
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{config.label}</h2>
            <p className="text-slate-600">{config.sublabel}</p>
          </div>
        </div>

        {result.recommendation_text && (
          <div className="mt-4 pt-4 border-t border-current/10">
            <p className="text-slate-700 leading-relaxed">{result.recommendation_text}</p>
          </div>
        )}
      </motion.div>

      {/* ── Summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="health-card p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
          <h3 className="text-lg font-bold text-slate-900">Összefoglaló</h3>
        </div>
        <p className="text-slate-700 leading-relaxed text-base">{result.summary}</p>
      </motion.div>

      {/* ── Findings ── */}
      {result.findings?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="health-card p-6 md:p-8"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Főbb megfigyelések</h3>
          <ul className="space-y-3">
            {result.findings.map((finding, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                  style={{ background: 'hsl(173,80%,40%)' }}
                />
                <p className="text-slate-700 leading-relaxed">{finding}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── Red Flags ── */}
      {result.red_flags?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="health-card p-6 md:p-8 bg-red-50 border-red-200 border"
        >
          <button
            className="flex items-center justify-between w-full"
            onClick={() => setShowFlags(!showFlags)}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-red-800">Figyelmeztető jelek</h3>
            </div>
            {showFlags ? <ChevronUp className="w-5 h-5 text-red-400" /> : <ChevronDown className="w-5 h-5 text-red-400" />}
          </button>

          <AnimatePresence>
            {showFlags && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-2 overflow-hidden"
              >
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

      {/* ── Questions to Ask ── */}
      {result.questions_to_ask?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="health-card p-6 md:p-8"
        >
          <button
            className="flex items-center justify-between w-full"
            onClick={() => setShowQuestions(!showQuestions)}
          >
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
              <motion.ol
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-3 overflow-hidden"
              >
                {result.questions_to_ask.map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'hsl(173,80%,40%)' }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-slate-700 leading-relaxed">{q}</p>
                  </li>
                ))}
              </motion.ol>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {result.google_search_query && (
          <button
            onClick={handleGoogleSearch}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 health-button btn-outline text-sm font-semibold"
          >
            <Search className="w-4 h-4" />
            Témában keresés Google-n
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 health-button btn-outline text-sm font-semibold no-print"
        >
          <Printer className="w-4 h-4" />
          Nyomtatás / Mentés PDF
        </button>
      </motion.div>

      {/* ── Disclaimer ── */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-xs text-slate-500 leading-relaxed text-center">
          <strong>Fontos:</strong> {result.disclaimer || 'Ez az elemzés nem helyettesíti a szakorvosi diagnózist. Kérjük, minden egészségügyi döntést orvosával konzultálva hozzon meg.'}
        </p>
      </div>

      {/* ── New Analysis ── */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-3.5 px-8 health-button btn-primary text-sm font-semibold"
          onClick={() => {
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.removeItem('analysisResult')
            }
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Új elemzés indítása
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  )
}
