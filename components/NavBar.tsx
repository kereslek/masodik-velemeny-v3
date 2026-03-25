'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { HeartPulse, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Főoldal' },
  { href: '/partnerek', label: 'Orvosi Partnerek' },
  { href: '/blog', label: 'Blog' },
  { href: '/adatvedelem', label: 'Adatvédelem' },
]

export function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 glass-panel" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group outline-none" aria-label="Diagnózisom főoldal">
            <div className="w-10 h-10 rounded-2xl bg-[hsl(173,80%,93%)] flex items-center justify-center group-hover:bg-[hsl(173,80%,88%)] transition-colors">
              <HeartPulse className="w-6 h-6 text-[hsl(173,80%,40%)]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                Diagnózisom
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Második vélemény, azonnal, ingyen
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Főnavigáció">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'bg-[hsl(173,80%,93%)] text-[hsl(173,80%,35%)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#elemzes"
              className="ml-4 px-6 py-2.5 health-button btn-primary text-sm"
              aria-label="Elemzés indítása — orvosi második vélemény kérése"
            >
              Elemzés indítása
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl py-4 px-4 flex flex-col gap-2"
          aria-label="Mobilnavigáció">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'px-4 py-3 rounded-2xl text-base font-medium transition-colors',
                pathname === link.href
                  ? 'bg-[hsl(173,80%,93%)] text-[hsl(173,80%,35%)]'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#elemzes"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-4 py-3 bg-[hsl(173,80%,40%)] text-white rounded-2xl font-bold text-center shadow-lg"
          >
            Elemzés indítása
          </a>
        </nav>
      )}
    </header>
  )
}
