'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import type { AnalysisResult } from '@/lib/types'

function triggerConfetti() {
  // Simple CSS confetti — no external dependency needed
  const colors = ['#14b8a6', '#5eead4', '#ccfbf1', '#0ea5e9', '#e0f2fe']
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden'
  document.body.appendChild(container)

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = Math.random() * 8 + 6
    const left = Math.random() * 100
    const delay = Math.random() * 2
    const duration = Math.random() * 2 + 2
    piece.style.cssText = `
      position:absolute;top:-20px;left:${left}%;
      width:${size}px;height:${size}px;
      background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation:confettiFall ${duration}s ${delay}s ease-in forwards;
    `
    container.appendChild(piece)
  }

  // Inject keyframes once
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style')
    style.id = 'confetti-style'
    style.textContent = `
      @keyframes confettiFall {
        to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }

  setTimeout(() => container.remove(), 5000)
}

export default function EredmenyPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const confettiFired = useRef(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('analysisResult')
    if (!raw) {
      router.replace('/')
      return
    }
    try {
      const data = JSON.parse(raw) as AnalysisResult
      setResult(data)
      if (data.recommendation === 'relax' && !confettiFired.current) {
        confettiFired.current = true
        setTimeout(triggerConfetti, 400)
      }
    } catch {
      router.replace('/')
    }
  }, [router])

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-[hsl(173,80%,40%)] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
          <span className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'hsl(173,80%,40%)' }}>
            Elemzés kész
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          AI Második Vélemény
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Az alábbi elemzés mesterséges intelligencia alapján készült.
          Nem helyettesíti a szakorvosi vizsgálatot.
        </p>
      </motion.div>

      <ResultsDisplay result={result} />
    </div>
  )
}
