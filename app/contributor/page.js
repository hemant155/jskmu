'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Shared hook: detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function ContributorDashboard() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('overview')
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!prof || prof.role !== 'contributor') {
        router.push('/dashboard')
        return
      }
      setProfile(prof)

      // Only fetch cases if verified (unverified can't add anyway)
      if (prof.is_verified) {
        const { data: bodiesData } = await supabase
          .from('unidentified_bodies')
          .select('*')
          .eq('added_by', session.user.id)
          .order('created_at', { ascending: false })
        setCases(bodiesData || [])
      }
      setLoading(false)
    }
    init()
  }, [])

  const tabStyle = (tab) => ({
    padding: isMobile ? '10px 14px' : '10px 20px',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? '#15803d' : 'transparent'}`,
    background: 'transparent',
    fontSize: 14,
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? '#15803d' : '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  })

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 80, color: '#94a3b8' }}>Loading...</div>
    </main>
  )

  // ───────────────────────────────────────────────
  // UNVERIFIED CONTRIBUTOR — Application Under Review
  // ───────────────────────────────────────────────
  if (profile && !profile.is_verified) {
    return (
      <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />

        {/* HEADER */}
        <div style={{ background: '#14532d', padding: isMobile ? '20px 16px' : '28px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 0 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', margin: 0, marginBottom: 4 }}>
                Contributor Dashboard
              </h1>
              <p style={{ fontSize: 13, color: '#86efac', margin: 0 }}>
                {profile?.full_name || 'Contributor'} — Field Network
              </p>
            </div>
            <div style={{ background: 'rgba(251,191,36,0.15)', color: '#fde68a', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20 }}>
              ⏳ Verification Pending
            </div>
          </div>
        </div>

        {/* PENDING REVIEW CARD */}
        <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 16px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: isMobile ? 28 : 40, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 30 }}>⏳</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 12 }}>Application Under Review</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
              Your contributor application has been sent to an admin for review. Once verification is complete, you'll be able to add unidentified body records.
            </p>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '16px 20px', textAlign: 'left', marginBottom: 24 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#92400e', lineHeight: 1.8 }}>
                ✓ Account created<br />
                ⏳ Admin verification pending<br />
                ✓ You'll be notified once approved<br />
                ✓ After approval, you can add records
              </p>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Verification usually takes 24–48 hours. An admin will verify your registered details — name, organization, and phone number.
            </p>
          </div>
        </div>

        <Footer />
      </main>
    )
  }

  // ───────────────────────────────────────────────
  // VERIFIED CONTRIBUTOR — Full Dashboard
  // ───────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {/* HEADER */}
      <div style={{ background: '#14532d', padding: isMobile ? '20px 16px' : '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 0 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', margin: 0, marginBottom: 4 }}>
              Contributor Dashboard
            </h1>
            <p style={{ fontSize: 13, color: '#86efac', margin: 0 }}>
              {profile?.full_name || 'Contributor'} — Field Network
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', color: '#86efac', fontSize: 12, padding: '6px 14px', borderRadius: 20 }}>
              ✓ Verified Contributor
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: isMobile ? '0 8px' : '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'add', label: '+ Add New Record' },
            { key: 'mycases', label: 'My Cases' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabStyle(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '20px 16px' : '28px 24px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Cases Added', value: cases.length, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
                { label: 'Identified Cases', value: cases.filter(c => c.status === 'identified').length, color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Pending Review', value: cases.filter(c => c.status === 'unidentified').length, color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#15803d', marginTop: 0, marginBottom: 16 }}>How It Works</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { step: '01', text: 'Add unidentified body details — location, description, photo' },
                  { step: '02', text: 'Our system automatically matches with missing person reports' },
                  { step: '03', text: 'When a family confirms a match — you receive a bonus payment' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#15803d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
                    <p style={{ margin: 0, fontSize: 14, color: '#475569', paddingTop: 4 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('add')}
              style={{ width: '100%', padding: '14px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              + Add New Unidentified Body Record
            </button>
          </div>
        )}

        {/* ADD NEW RECORD */}
        {activeTab === 'add' && (
          <AddBodyForm isMobile={isMobile} onSuccess={() => { setActiveTab('mycases'); router.refresh() }} />
        )}

        {/* MY CASES */}
        {activeTab === 'mycases' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>My Cases ({cases.length})</h2>
            {cases.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>No cases added yet. Add your first record.</p>
                <button onClick={() => setActiveTab('add')} style={{ marginTop: 16, padding: '10px 24px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  + Add Record
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cases.map(body => (
                  <div key={body.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, display: 'flex', gap: isMobile ? 14 : 20, flexDirection: isMobile ? 'column' : 'row' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {body.photo_url ? (
                        <img src={body.photo_url} alt="Case" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 28 }}>👤</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Case #{body.case_number || body.id.slice(0, 8).toUpperCase()}</span>
                        <span style={{ fontSize: 12, background: body.status === 'identified' ? '#dcfce7' : '#fef3c7', color: body.status === 'identified' ? '#15803d' : '#92400e', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                          {body.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#475569', flexWrap: 'wrap' }}>
                        <span>Gender: {body.gender}</span>
                        <span>Age: {body.estimated_age_min}-{body.estimated_age_max}</span>
                        <span>📍 {body.city}, {body.state}</span>
                        <span>Found: {body.found_date}</span>
                      </div>
                      {body.description && (
                        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{body.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

function AddBodyForm({ onSuccess, isMobile }) {
  const [form, setForm] = useState({
    gender: 'Male',
    estimated_age_min: '',
    estimated_age_max: '',
    state: '',
    city: '',
    area: '',
    found_date: '',
    description: '',
    case_number: '',
  })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async () => {
    if (!form.state || !form.city || !form.found_date || !form.gender) {
      setError('Please fill all required fields')
      return
    }
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      let photo_url = null

      if (photo) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', photo)
        uploadFormData.append('userId', session.user.id)
        uploadFormData.append('bucket', 'body-photos')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })
        const uploadData = await uploadRes.json()
        if (uploadData.success) photo_url = uploadData.url
      }

      const { error: insertError } = await supabase
        .from('unidentified_bodies')
        .insert({
          added_by: session.user.id,
          gender: form.gender,
          estimated_age_min: parseInt(form.estimated_age_min) || null,
          estimated_age_max: parseInt(form.estimated_age_max) || null,
          state: form.state,
          city: form.city,
          area: form.area,
          found_date: form.found_date,
          description: form.description,
          case_number: form.case_number,
          photo_url,
          status: 'unidentified'
        })

      if (insertError) throw insertError
      onSuccess()

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: '#fff' }
  const labelStyle = { fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }
  const threeCol = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 12 }
  const twoCol = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: isMobile ? 20 : 32, maxWidth: 680 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginTop: 0, marginBottom: 24 }}>Add Unidentified Body Record</h2>

      {/* PHOTO */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div
          onClick={() => document.getElementById('body-photo').click()}
          style={{ width: 120, height: 120, borderRadius: 10, border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', cursor: 'pointer', overflow: 'hidden', background: '#f8fafc' }}>
          {photoPreview ? (
            <img src={photoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>📷</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Add Photo</div>
            </div>
          )}
        </div>
        <input id="body-photo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Photo will be blurred for public — only verified families see it</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={threeCol}>
          <div>
            <label style={labelStyle}>GENDER *</label>
            <select value={form.gender} onChange={e => set('gender', e.target.value)} style={inputStyle}>
              <option>Male</option>
              <option>Female</option>
              <option>Unknown</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>MIN AGE</label>
            <input value={form.estimated_age_min} onChange={e => set('estimated_age_min', e.target.value)} placeholder="e.g. 25" type="number" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>MAX AGE</label>
            <input value={form.estimated_age_max} onChange={e => set('estimated_age_max', e.target.value)} placeholder="e.g. 35" type="number" style={inputStyle} />
          </div>
        </div>

        <div style={twoCol}>
          <div>
            <label style={labelStyle}>STATE *</label>
            <select value={form.state} onChange={e => set('state', e.target.value)} style={inputStyle}>
              <option value="">Select State</option>
              {['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>CITY / DISTRICT *</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Mumbai" style={inputStyle} />
          </div>
        </div>

        <div style={twoCol}>
          <div>
            <label style={labelStyle}>AREA / LOCATION</label>
            <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. Near Versova Beach" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>DATE FOUND *</label>
            <input value={form.found_date} onChange={e => set('found_date', e.target.value)} type="date" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>POLICE CASE NUMBER (if any)</label>
          <input value={form.case_number} onChange={e => set('case_number', e.target.value)} placeholder="e.g. MH/MUM/2025/001" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>PHYSICAL DESCRIPTION *</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Height, build, skin tone, hair, clothing, identifying marks, circumstances found..."
            style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
          />
        </div>

        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#dc2626', lineHeight: 1.6 }}>
            ⚠️ Only add records you have personally witnessed or have direct knowledge of. False records will result in permanent ban. Photos are stored securely and shown blurred to families only.
          </p>
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? '#94a3b8' : '#15803d', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Submitting...' : 'Submit Record'}
        </button>
      </div>
    </div>
  )
}