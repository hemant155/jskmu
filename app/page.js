import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>

      {/* NAVBAR (shared component — handles top bar + nav + mobile menu) */}
      <Navbar />

      {/* HERO */}
      <section style={{ background: '#1e3a5f', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }}></span>
            <span style={{ color: '#93c5fd', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pan-India Database</span>
          </div>

          <h1 style={{ fontSize: 42, fontWeight: 300, color: '#ffffff', lineHeight: 1.3, marginBottom: 16, maxWidth: 600, letterSpacing: -0.5 }}>
            Har chehra ek naam hai.<br />
            <span style={{ color: '#93c5fd' }}>Har naam ek ghar hai.</span>
          </h1>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
            India ka pehla unified database jahan missing persons aur unidentified bodies ko ek jagah search kar sakte hain. Families ke liye. Police ke liye. Sabke liye.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/search" style={{ background: '#ffffff', color: '#1e3a5f', padding: '12px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
              Search Missing Persons
            </Link>
            <Link href="/register" style={{ background: 'transparent', color: '#ffffff', padding: '12px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 500, fontSize: 15, border: '1px solid rgba(255,255,255,0.3)' }}>
              Report a Missing Person
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { number: '0', label: 'Missing Persons Listed' },
            { number: '0', label: 'Unidentified Bodies' },
            { number: '0', label: 'Cases Resolved' },
            { number: '28+', label: 'States Covered' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '28px 24px', borderRight: i < 3 ? '1px solid #e2e8f0' : 'none' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e3a5f', marginBottom: 4 }}>{stat.number}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH BAR */}
      <section style={{ background: '#f0f4f8', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 20 }}>
            Search Missing Persons
          </h2>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 200 }}>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>NAME</label>
              <input placeholder="Search by name..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>STATE</label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                <option>All States</option>
                <option>Maharashtra</option>
                <option>Punjab</option>
                <option>Uttar Pradesh</option>
                <option>Gujarat</option>
                <option>Delhi</option>
                <option>Rajasthan</option>
                <option>Bihar</option>
                <option>West Bengal</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>GENDER</label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#1e293b', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                <option>All</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <Link href="/search" style={{ display: 'block', background: '#1e3a5f', color: '#fff', padding: '10px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#ffffff', padding: '64px 24px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 40 }}>Kaise kaam karta hai?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { step: '01', title: 'Search Karo', desc: 'Koi bhi, bina login ke, missing persons ko state, city, area se search kar sakta hai. Public database sabke liye open hai.', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
              { step: '02', title: 'Register Karo', desc: 'Family FIR copy ke saath register kare. Ek baar ₹499 payment ke baad 1 saal ke liye unidentified bodies database access milega.', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
              { step: '03', title: 'Match Pao', desc: 'System automatically possible matches dhundta hai aur family ko SMS + Email notification bhejta hai. Har match police verified hona chahiye.', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
            ].map((item) => (
              <div key={item.step} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 10, padding: 24 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: item.color, opacity: 0.25, marginBottom: 16, lineHeight: 1 }}>{item.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: item.color, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* UNIDENTIFIED BODIES — USP SECTION */}
<section style={{ background: '#fafafa', padding: '64px 24px', borderTop: '1px solid #e2e8f0' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

      {/* LEFT — Text */}
      <div>
        <div style={{ display: 'inline-block', background: '#fee2e2', color: '#991b1b', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
          India Mein Pehli Baar
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#1e3a5f', lineHeight: 1.35, marginBottom: 16 }}>
          Unidentified Bodies ka<br />
          <span style={{ color: '#dc2626' }}>National Database</span>
        </h2>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
          Har saal hazaron laashein India ki nadiyon, naliyon aur sadkon par milti hain — bina naam ke, bina pehchaan ke. Koi unhe dhundh raha hota hai. Koi unka intezaar kar raha hota hai.
        </p>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 28 }}>
          JSKMU India ka <strong>pehla platform</strong> hai jo missing persons aur unidentified bodies ko ek hi jagah connect karta hai — automatically.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Contributor network — Divers, NGOs aur police seedha add karte hain',
            'Blurred photos — sirf verified family dekh sakti hai',
            'Automatic matching — age, gender, state ke basis par',
            'SMS + Email alert — match milte hi family ko notify',
          ].map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ color: '#15803d', fontSize: 12, fontWeight: 700 }}>✓</span>
              </div>
              <span style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Stats Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: 12, padding: 24, borderLeft: '4px solid #dc2626' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>40,000+</div>
          <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>Unidentified bodies har saal India mein milti hain. Inme se hazaron kabhi identify nahi ho paati.</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24, borderLeft: '4px solid #2563eb' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>0</div>
          <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>National databases jo missing persons aur unidentified bodies ko automatically match karte hain. <strong>JSKMU pehla hoga.</strong></div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: 12, padding: 24, borderLeft: '4px solid #15803d' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#15803d', marginBottom: 4 }}>JSK</div>
          <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>Is platform ka naam Jaswant Singh Kalra aur unke kaam ko yaad karta hai. Poori kahani padhne ke liye About page visit karein.</div>
        </div>

      </div>
    </div>
  </div>
</section>

      {/* TRIBUTE */}
<section style={{ background: '#1e3a5f', padding: '32px 24px' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 3, height: 40, background: '#60a5fa', borderRadius: 2, flexShrink: 0 }}></div>
    <div>
      <span style={{ fontSize: 13, color: '#94a3b8' }}>
        This platform is dedicated to <strong style={{ color: '#ffffff' }}>Jaswant Singh Khalra (1952–1995)</strong> — whose work inspired JSKMU.
      </span>
      <Link href="/about" style={{ fontSize: 13, color: '#60a5fa', marginLeft: 12, textDecoration: 'none' }}>
        Read his story →
      </Link>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer style={{ background: '#0f2744', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>JSKMU</span>
            <span style={{ fontSize: 12, color: '#475569', marginLeft: 12 }}>Jaswant Singh Khalra Missing & Unidentified Database</span>
          </div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Emergency: 112 · Not affiliated with any government body
          </div>
        </div>
      </footer>

    </main>
  )
}