import Link from 'next/link'

export default function Footer() {
  const linkStyle = { fontSize: 12, color: '#94a3b8', textDecoration: 'none' }

  return (
    <footer style={{ background: '#0f2744', padding: '28px 24px', marginTop: 40 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Top row: brand + legal links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>JSKMU</span>

          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <Link href="/guidance" style={linkStyle}>Guidance</Link>
            <Link href="/about" style={linkStyle}>About</Link>
            <Link href="/terms" style={linkStyle}>Terms</Link>
            <Link href="/privacy" style={linkStyle}>Privacy</Link>
            <Link href="/refund" style={linkStyle}>Refund</Link>
            <Link href="/cancellation" style={linkStyle}>Cancellation</Link>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '18px 0' }}></div>

        {/* Bottom row: disclaimer */}
        <div style={{ fontSize: 12, color: '#475569' }}>
          Emergency: 112 · Not affiliated with any government body · contact@jskmu.in
        </div>

      </div>
    </footer>
  )
}