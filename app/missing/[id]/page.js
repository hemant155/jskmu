'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MissingPersonDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFullPhoto, setShowFullPhoto] = useState(false)

  useEffect(() => {
    const fetchPerson = async () => {
      const { data, error } = await supabase
        .from('missing_persons')
        .select('*')
        .eq('id', id)
        .single()
      if (data) setPerson(data)
      setLoading(false)
    }
    fetchPerson()
  }, [id])

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8' }}>Loading...</div>
    </main>
  )

  if (!person) return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ color: '#1e3a5f' }}>Record not found</h2>
        <button onClick={() => router.push('/search')} style={{ marginTop: 16, padding: '10px 24px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Back to Search</button>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {/* FULL PHOTO MODAL */}
      {showFullPhoto && person.photo_url && (
        <div
          onClick={() => setShowFullPhoto(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ position: 'relative', maxWidth: 600, width: '100%' }}>
            <img src={person.photo_url} alt={person.full_name} style={{ width: '100%', borderRadius: 12, maxHeight: '80vh', objectFit: 'contain' }} />
            <button
              onClick={() => setShowFullPhoto(false)}
              style={{ position: 'absolute', top: -16, right: -16, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </button>
            <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: 12, fontSize: 13 }}>Click anywhere to close</p>
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <div style={{ background: '#1e3a5f', padding: '28px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/search')} style={{ color: '#93c5fd', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            ← Back to Search
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', margin: 0 }}>
            Missing Person Report
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32 }}>

          {/* TOP SECTION */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 32 }}>

            {/* PHOTO */}
            <div style={{ flexShrink: 0 }}>
              <div
                onClick={() => person.photo_url && setShowFullPhoto(true)}
                style={{ width: 140, height: 140, borderRadius: 12, background: '#f1f5f9', border: '2px solid #e2e8f0', overflow: 'hidden', cursor: person.photo_url ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {person.photo_url ? (
                  <img src={person.photo_url} alt={person.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 48 }}>👤</span>
                )}
              </div>
              {person.photo_url && (
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>Click to enlarge</p>
              )}
            </div>

            {/* BASIC INFO */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1e293b' }}>{person.full_name}</h2>
                <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>MISSING</span>
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: '#475569' }}>Age: <strong>{person.age}</strong></span>
                <span style={{ fontSize: 14, color: '#475569' }}>Gender: <strong>{person.gender}</strong></span>
                <span style={{ fontSize: 14, color: '#475569' }}>Status: <strong style={{ color: '#15803d' }}>{person.status}</strong></span>
              </div>
              <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', display: 'inline-block' }}>
                <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>
                  📍 Last seen: {person.city}, {person.state} — {person.last_seen_date}
                </span>
              </div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Full Name', value: person.full_name },
              { label: 'Age', value: person.age },
              { label: 'Gender', value: person.gender },
              { label: 'State', value: person.state },
              { label: 'City / District', value: person.city },
              { label: 'Area / Locality', value: person.area || 'Not specified' },
              { label: 'Last Seen Date', value: person.last_seen_date },
              { label: 'FIR Number', value: person.fir_number || 'N/A' },
            ].map(item => (
              <div key={item.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.06em', marginBottom: 4 }}>{item.label.toUpperCase()}</div>
                <div style={{ fontSize: 14, color: '#1e293b', fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          {person.description && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e3a5f', marginBottom: 10 }}>Physical Description</h3>
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '16px', fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
                {person.description}
              </div>
            </div>
          )}

          {/* CALL TO ACTION */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 20 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#1e40af' }}>
              Do you have information about this person?
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#3b82f6' }}>
              If you have seen this person or have any information, please contact the authorities immediately.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="tel:112" style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                📞 Call 112 — Emergency
              </a>
              <a href="tel:1094" style={{ padding: '10px 20px', background: '#1e3a5f', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                📞 Call 1094 — Missing Persons
              </a>
            </div>
          </div>

        </div>

        {/* DISCLAIMER */}
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16, textAlign: 'center', lineHeight: 1.6 }}>
          This report was submitted by the family. JSKMU is not affiliated with any government body. Always verify information with local police.
        </p>
      </div>

      <Footer />
    </main>
  )
}