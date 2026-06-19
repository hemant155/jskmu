'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AddMissingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: 'Male',
    state: '',
    city: '',
    area: '',
    last_seen_date: '',
    description: '',
    fir_number: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!form.full_name || !form.age || !form.state || !form.city || !form.last_seen_date) {
      setError('Please fill all required fields')
      return
    }
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      let photo_url = null

      // Photo upload
if (photo) {
  const uploadFormData = new FormData()
  uploadFormData.append('file', photo)
  uploadFormData.append('bucket', 'missing-photos')

  const uploadRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${session.access_token}` },
    body: uploadFormData
  })
  const uploadData = await uploadRes.json()

  if (uploadData.success) {
    photo_url = uploadData.url
    console.log('Photo uploaded:', photo_url)
  } else {
    console.error('Upload failed:', uploadData.error)
    // Continue without photo
  }
}
      // Save to database
      const { error: insertError } = await supabase
        .from('missing_persons')
        .insert({
          reported_by: session.user.id,
          full_name: form.full_name,
          age: parseInt(form.age),
          gender: form.gender,
          state: form.state,
          city: form.city,
          area: form.area,
          last_seen_date: form.last_seen_date,
          description: form.description,
          fir_number: form.fir_number,
          photo_url,
          status: 'active'
        })

      if (insertError) throw insertError
      router.push('/dashboard?success=true')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1e293b',
    background: '#fff'
  }

  const labelStyle = {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 500,
    display: 'block',
    marginBottom: 6
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ background: '#1e3a5f', padding: '28px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/dashboard')} style={{ color: '#93c5fd', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', margin: 0 }}>
            Add Missing Person Report
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32 }}>

          {/* PHOTO UPLOAD */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div
              onClick={() => document.getElementById('photo-input').click()}
              style={{ width: 120, height: 120, borderRadius: '50%', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', cursor: 'pointer', overflow: 'hidden', background: '#f8fafc' }}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28 }}>📷</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Add Photo</div>
                </div>
              )}
            </div>
            <input id="photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Click to upload photo — JPG, PNG max 5MB</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* NAME */}
            <div>
              <label style={labelStyle}>FULL NAME *</label>
              <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Missing person's full name" style={inputStyle} />
            </div>

            {/* AGE + GENDER */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>AGE *</label>
                <input value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 34" type="number" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>GENDER *</label>
                <select value={form.gender} onChange={e => set('gender', e.target.value)} style={inputStyle}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* STATE + CITY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

            {/* AREA + LAST SEEN DATE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>AREA / LOCALITY</label>
                <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. Andheri West" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>LAST SEEN DATE *</label>
                <input value={form.last_seen_date} onChange={e => set('last_seen_date', e.target.value)} type="date" style={inputStyle} />
              </div>
            </div>

            {/* FIR NUMBER */}
            <div>
              <label style={labelStyle}>FIR NUMBER</label>
              <input value={form.fir_number} onChange={e => set('fir_number', e.target.value)} placeholder="e.g. FIR/2024/MH/001234" style={inputStyle} />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label style={labelStyle}>PHYSICAL DESCRIPTION *</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Physical appearance, clothing when last seen, identifying marks, circumstances of disappearance..."
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
              />
            </div>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{error}</p>
              </div>
            )}

            {/* INFO BOX */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '14px 16px' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
                ℹ️ After submission, your report will be publicly visible on the search page. Our system will automatically check for matches with unidentified body records and notify you via email.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 8, background: loading ? '#94a3b8' : '#1e3a5f', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Submitting...' : 'Submit Missing Person Report'}
            </button>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}