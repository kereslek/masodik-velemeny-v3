import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MásodikVélemény – Értsd meg a diagnózisodat. AI orvosi segítség.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #f0fdfb 0%, #e0f2fe 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'hsl(173,80%,40%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>❤️</div>
          <span style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em' }}>
            Második<span style={{ color: 'hsl(173,80%,40%)' }}>Vélemény</span>
          </span>
        </div>

        <div style={{ fontSize: '52px', fontWeight: '800', color: '#0f172a', textAlign: 'center', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '20px', maxWidth: '900px' }}>
          Értsd meg a diagnózisodat.
          <br />
          <span style={{ color: 'hsl(173,80%,40%)' }}>AI segítség azonnal.</span>
        </div>

        <div style={{ fontSize: '22px', color: '#475569', textAlign: 'center', maxWidth: '720px', lineHeight: 1.5, marginBottom: '36px' }}>
          Lelet értelmezés · Diagnózis magyarázat · Orvosi második vélemény
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          {['Ingyenes', 'Anonim · GDPR', 'Claude AI · Anthropic'].map((badge) => (
            <div key={badge} style={{ padding: '10px 20px', background: 'white', borderRadius: '9999px', border: '1.5px solid #e2e8f0', fontSize: '16px', fontWeight: '600', color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {badge}
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: '28px', fontSize: '16px', color: '#94a3b8', fontWeight: '500' }}>
          masodikvelemeny.hu
        </div>
      </div>
    ),
    { ...size }
  )
}
