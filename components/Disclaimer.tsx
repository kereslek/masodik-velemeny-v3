'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function Disclaimer() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="sticky bottom-0 z-50 bg-amber-50 border-t border-amber-200 px-4 py-3 shadow-[0_-4px_20px_rgb(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-800 flex-1 leading-relaxed">
          <strong>Fontos nyilatkozat:</strong> Ez az alkalmazás kizárólag tájékoztató jellegű és nem
          helyettesíti a szakorvosi vizsgálatot, diagnózist vagy kezelést. Sürgős esetben hívja a{' '}
          <strong>112-t</strong>. Az adatokat nem tároljuk, az elemzés után azonnal törlődnek.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-amber-100 transition-colors"
          aria-label="Bezárás"
        >
          <X className="w-4 h-4 text-amber-600" />
        </button>
      </div>
    </div>
  )
}