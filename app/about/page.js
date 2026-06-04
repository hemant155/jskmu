import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>

      {/* NAVBAR */}
      <Navbar active="About" />

      {/* PAGE HEADER */}
      <div style={{ background: '#1e3a5f', padding: '48px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#ffffff', margin: 0, marginBottom: 8 }}>
            About JSKMU
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', margin: 0 }}>
            India's first unified missing persons and unidentified bodies database
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>

        {/* MISSION */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 16 }}>Our Mission</h2>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>
            Every year, thousands of families in India search desperately for missing loved ones. At the same time, thousands of unidentified bodies are found across the country — in rivers, canals, highways — with no one to claim them.
          </p>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8 }}>
            JSKMU bridges this gap. We connect missing persons reports with unidentified body records — automatically, securely, and with dignity — so that families can find answers, and the unclaimed can finally have a name.
          </p>
        </section>

        {/* WHAT MAKES US DIFFERENT */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 20 }}>What Makes JSKMU Different</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { title: 'Unidentified Bodies Database', desc: 'The only platform in India that maintains a searchable database of unidentified bodies alongside missing persons.', color: '#dc2626', bg: '#fff5f5', border: '#fecaca' },
              { title: 'Verified Reports Only', desc: 'FIR number and document verification ensures only genuine cases are listed. No spam, no misuse.', color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe' },
              { title: 'Automatic Matching', desc: 'Our system cross-references missing persons with unidentified bodies based on age, gender, state and physical description.', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
              { title: 'Field Contributor Network', desc: 'Divers, NGO workers and police can directly add unidentified body details — creating a ground-level network across India.', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
            ].map((item) => (
              <div key={item.title} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 10, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: item.color, marginBottom: 8, marginTop: 0 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JSK TRIBUTE — ONE PLACE, FULL STORY */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ background: '#1e3a5f', borderRadius: 12, padding: 32 }}>
            <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              In Memoriam · 1952 — 1995
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 300, color: '#ffffff', marginBottom: 20, marginTop: 0 }}>
              Jaswant Singh Khalra
            </h2>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
              Jaswant Singh Khalra was not a politician or a soldier. He was a bank officer from Amritsar who simply refused to look away.
            </p>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
              In the early 1990s, while searching for missing colleagues during the Punjab militancy era, Khalra walked into government offices and began examining cremation records. What he found was devastating, thousands of people had been secretly killed and cremated as "unidentified bodies." He documented over 6,000 such cases in Amritsar district alone.
            </p>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
              He gave names back to the nameless. He gave grief a place to stand.
            </p>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 20 }}>
              On October 27, 1995, Khalra was abducted from outside his home. He was beaten, shot twice in the chest, and his body was thrown into the Harike Canal, the same waters where so many of those he had fought for had been silently discarded. He was 43 years old.
            </p>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 20 }}>
              He was murdered. But the question he asked in 1995 remains unanswered for thousands of families across India today: <em style={{ color: '#ffffff' }}>Who is looking for those who are never found?</em>
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#475569', fontStyle: 'italic' }}>
                JSKMU is named in his memory. This platform is our attempt to continue the work he started ensuring that every unidentified person has a chance to be found, and every searching family has a place to look.
              </p>
              <p style={{ margin: '12px 0 0', fontSize: 13, color: '#60a5fa' }}>
                JSK — We have not forgotten. We will not forget.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 20 }}>How It Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '01', title: 'Public Search', desc: 'Anyone can search the missing persons database by name, state, city or area,  no registration required.' },
              { step: '02', title: 'Family Registration', desc: 'Families with an FIR file register with a one-time fee of ₹499. After admin verification, they can add a missing person report and access the unidentified bodies database for 1 year.' },
              { step: '03', title: 'Contributor Network', desc: 'Verified field contributors, divers, NGO workers, police, add unidentified body details directly to the platform. They earn a share for each case added and a bonus for confirmed identifications.' },
              { step: '04', title: 'Automatic Matching', desc: 'The system continuously cross-references missing persons with unidentified bodies. When a potential match is found, the family is notified immediately via SMS and email.' },
              { step: '05', title: 'Resolution', desc: 'When a family marks a case as resolved, the report is archived, contributors receive their bonus, and the data is anonymized to protect privacy.' },
            ].map((item, i, arr) => (
              <div key={item.step} style={{ display: 'flex', gap: 20, paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e3a5f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
                  {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: '#e2e8f0', marginTop: 8 }}></div>}
                </div>
                <div style={{ paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginBottom: 6, marginTop: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DATA SECURITY */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 16 }}>Data Security & Privacy</h2>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'FIR documents are stored in encrypted private storage and are never publicly accessible.',
                'Aadhaar verification is done via OTP only, no Aadhaar copies are stored on our servers.',
                'Unidentified body photographs are blurred and accessible only to verified family members.',
                'All personal data is governed by the Digital Personal Data Protection Act 2023 (DPDP Act).',
                'Missing person data is never deleted, cases are archived so they remain searchable indefinitely.',
                'Family contact information is encrypted in our database and never displayed publicly.',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ color: '#15803d', fontSize: 11, fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 16 }}>Contact & Legal</h2>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { label: 'General Enquiries', value: 'contact@jskmu.in' },
              { label: 'Report an Issue', value: 'report@jskmu.in' },
              { label: 'Emergency', value: '112' },
              { label: 'Missing Persons Helpline', value: '1094' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: '#1e3a5f', fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16, lineHeight: 1.6 }}>
            JSKMU is an independent civic technology platform. We are not affiliated with any government body. All match suggestions are algorithmic and must be verified by local police before any action is taken.
          </p>
        </section>

      </div>

      {/* FOOTER */}
        <Footer />

    </main>
  )
}