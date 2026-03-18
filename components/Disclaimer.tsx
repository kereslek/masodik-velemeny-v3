'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function Disclaimer() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 flex-1 leading-relaxed">
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
