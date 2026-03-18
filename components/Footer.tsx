import Link from 'next/link'
import { HeartPulse } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className="bg-slate-50 border-t border-slate-200 mt-auto"
      role="contentinfo"
      aria-label="Lábléc"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
              <span
                className="font-display font-bold text-lg text-slate-900 tracking-tight"
                itemProp="name"
              >
                MásodikVélemény
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Magyarország AI-alapú orvosi második vélemény platformja.
              Powered by Anthropic Claude.
            </p>
          </div>

          {/* Description — semantic, crawlable */}
          <p className="text-slate-500 text-sm text-center max-w-sm leading-relaxed hidden md:block">
            Tünetek elemzése és leletek értelmezése mesterséges intelligenciával.
            Az adatok az elemzés után azonnal és véglegesen törlésre kerülnek.
          </p>

          {/* Links */}
          <nav aria-label="Lábléc navigáció">
            <ul className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-900 transition-colors">
                  Főoldal
                </Link>
              </li>
              <li>
                <Link href="/partnerek" className="hover:text-slate-900 transition-colors">
                  Partnerek
                </Link>
              </li>
              <li>
                <Link href="/adatvedelem" className="hover:text-slate-900 transition-colors">
                  Adatvédelem
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@masodikvelemeny.hu"
                  className="hover:text-slate-900 transition-colors"
                >
                  Kapcsolat
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} MásodikVélemény · Minden jog fenntartva
          </p>
          <p className="text-xs text-slate-400 text-center">
            ⚠️ Nem orvosi diagnózis. Sürgős esetben hívja a <strong>112</strong>-t.
          </p>
          <p className="text-xs text-slate-400">
            AI: <span className="font-medium">Claude Sonnet</span> by Anthropic
          </p>
        </div>

      </div>
    </footer>
  )
}
