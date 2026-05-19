export default function Footer() {
  return (
    <footer style={{ background: '#0f2744', padding: '24px', marginTop: 40 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>JSKMU</span>
        <span style={{ fontSize: 12, color: '#475569' }}>
          Emergency: 112 · Not affiliated with any government body
        </span>
      </div>
    </footer>
  )
}