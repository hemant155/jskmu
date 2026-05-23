'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [errors, setErrors] = useState({})
const [loading, setLoading] = useState(false)
const [authError, setAuthError] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', state: '', password: '',
    firNumber: '', organization: '', aadhaar: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const router = useRouter()

const handleRegister = async () => {
  setLoading(true)
  setAuthError('')
  try {
    // 1. Supabase Auth mein user banao
 const { data: authData, error: signUpError } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    data: {
      full_name: form.name,
      phone: form.phone,
      role: role,  // 'family' or 'contributor'
      fir_number: form.firNumber || null,
    }
  }
})
    if (signUpError) throw signUpError

    // 2. Profile save karo
    // Profile will be updated after email verification
// Trigger handles basic profile creation
router.push('/register/success')
return

    // 3. Contributor ke liye direct success
    if (role === 'contributor') {
      router.push('/register/success')
      return
    }


    // Payment will be integrated post-launch
router.push('/register/success')
return

  } catch (err) {
    setAuthError(err.message)
  } finally {
    setLoading(false)
  }
}

  const validateStep2 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone number required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.state) e.state = 'State select karo'
    if (!form.password.trim() || form.password.length < 8) e.password = 'Minimum 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e = {}
    if (role === 'family' && !form.firNumber.trim()) e.firNumber = 'FIR number required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${errors[field] ? '#fca5a5' : '#e2e8f0'}`,
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    background: errors[field] ? '#fff5f5' : '#fff',
    color: '#1e293b'
  })

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>

      {/* NAVBAR */}
      <Navbar active="Register" />

      {/* PAGE HEADER */}
      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>
            Register
          </h1>
        </div>
      </div>

      {/* FORM AREA */}
      <div style={{ maxWidth: 560, margin: '32px auto', padding: '0 24px' }}>

        {/* STEP INDICATOR */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
          {['Role', 'Details', 'Documents', 'Payment'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  background: step > i + 1 ? '#15803d' : step === i + 1 ? '#1e3a5f' : '#e2e8f0',
                  color: step >= i + 1 ? '#ffffff' : '#94a3b8'
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: 10,
                  color: step === i + 1 ? '#1e3a5f' : '#94a3b8',
                  fontWeight: step === i + 1 ? 600 : 400
                }}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div style={{
                  flex: 1, height: 1,
                  background: step > i + 1 ? '#15803d' : '#e2e8f0',
                  margin: '0 4px', marginBottom: 20
                }}></div>
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — ROLE */}
        {step === 1 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 6, marginTop: 0 }}>
              Aap kaun hain?
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, marginTop: 0 }}>
              Apna role chunein
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div onClick={() => setRole('family')} style={{ border: `2px solid ${role === 'family' ? '#1e3a5f' : '#e2e8f0'}`, borderRadius: 10, padding: 20, cursor: 'pointer', background: role === 'family' ? '#eff6ff' : '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginBottom: 6 }}>👨‍👩‍👧 Family Member</div>
                    <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>Maine FIR file ki hai aur apna missing person report karna chahta/chahti hoon.</div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['FIR copy required', '₹499 one-time', '1 year access'].map(tag => (
                        <span key={tag} style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${role === 'family' ? '#1e3a5f' : '#cbd5e1'}`, background: role === 'family' ? '#1e3a5f' : 'transparent', flexShrink: 0, marginTop: 2 }}></div>
                </div>
              </div>

              <div onClick={() => setRole('contributor')} style={{ border: `2px solid ${role === 'contributor' ? '#15803d' : '#e2e8f0'}`, borderRadius: 10, padding: 20, cursor: 'pointer', background: role === 'contributor' ? '#f0fdf4' : '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#15803d', marginBottom: 6 }}>🔍 Field Contributor</div>
                    <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>Main diver, NGO worker ya police hoon — unidentified bodies ki details add karna chahta/chahti hoon.</div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['Free registration', 'Admin verified', 'Earnings per case'].map(tag => (
                        <span key={tag} style={{ fontSize: 11, background: '#f0fdf4', color: '#15803d', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${role === 'contributor' ? '#15803d' : '#cbd5e1'}`, background: role === 'contributor' ? '#15803d' : 'transparent', flexShrink: 0, marginTop: 2 }}></div>
                </div>
              </div>
            </div>

            {errors.role && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>{errors.role}</p>}

            <button
              onClick={() => {
                if (!role) { setErrors({ role: 'Pehle role chunein' }); return; }
                setErrors({})
                setStep(2)
              }}
              style={{ width: '100%', marginTop: 24, padding: '12px', border: 'none', borderRadius: 8, background: role ? '#1e3a5f' : '#e2e8f0', color: role ? '#ffffff' : '#94a3b8', fontSize: 15, fontWeight: 600, cursor: role ? 'pointer' : 'not-allowed' }}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — DETAILS */}
        {step === 2 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Aapki details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>FULL NAME *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Apna poora naam" style={inputStyle('name')} />
                {errors.name && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.name}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>MOBILE NUMBER *</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" style={inputStyle('phone')} />
                {errors.phone && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.phone}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS *</label>
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" type="email" style={inputStyle('email')} />
                {errors.email && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>STATE *</label>
                <select value={form.state} onChange={e => set('state', e.target.value)} style={inputStyle('state')}>
                  <option value="">Select State</option>
                  {['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.state}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>PASSWORD *</label>
                <input value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" type="password" style={inputStyle('password')} />
                {errors.password && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.password}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => { setErrors({}); setStep(1) }} style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#475569' }}>← Back</button>
              <button onClick={() => { if (validateStep2()) setStep(3) }} style={{ flex: 2, padding: '12px', border: 'none', borderRadius: 8, background: '#1e3a5f', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — DOCUMENTS */}
        {step === 3 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 6, marginTop: 0 }}>Documents Upload</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, marginTop: 0 }}>Sirf admin verification ke liye — publicly visible nahi honge</p>

            {role === 'family' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>FIR NUMBER *</label>
                  <input value={form.firNumber} onChange={e => set('firNumber', e.target.value)} placeholder="e.g. FIR/2024/MH/001234" style={inputStyle('firNumber')} />
                  {errors.firNumber && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.firNumber}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>FIR COPY UPLOAD *</label>
                  <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: '24px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                    <div style={{ fontSize: 14, color: '#475569', marginBottom: 4 }}>Click karke upload karo</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>PDF, JPG, PNG — max 5MB</div>
                    <input type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} />
                  </div>
                  {errors.firFile && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.firFile}</p>}
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px' }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#92400e' }}>🔒 FIR document encrypted storage mein rakha jayega. Sirf admin verification ke liye use hoga.</p>
                </div>
              </div>
            )}

            {role === 'contributor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>ORGANIZATION / AFFILIATION</label>
                  <select
  value={form.organization}
  onChange={e => set('organization', e.target.value)}
  style={inputStyle('organization')}>
  <option value="">Select type</option>
  <option value="Individual">Individual</option>
  <option value="NGO / Non-profit">NGO / Non-profit</option>
  <option value="Police Department">Police Department</option>
  <option value="Government Body">Government Body</option>
  <option value="Media / Journalist">Media / Journalist</option>
  <option value="Other">Other</option>
</select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>AADHAAR VERIFICATION *</label>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '16px' }}>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: '#15803d', fontWeight: 500 }}>OTP se verify karein — copy store nahi hogi</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={form.aadhaar} onChange={e => set('aadhaar', e.target.value)} placeholder="Aadhaar number" style={{ flex: 1, padding: '10px 14px', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 14, outline: 'none', color: '#1e293b', background: '#ffffff' }} />
                      <button style={{ padding: '10px 16px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Send OTP</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => { setErrors({}); setStep(2) }} style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#475569' }}>← Back</button>
              <button onClick={() => { if (validateStep3()) setStep(4) }} style={{ flex: 2, padding: '12px', border: 'none', borderRadius: 8, background: '#1e3a5f', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — PAYMENT */}
        {/* STEP 4 — PAYMENT */}
{step === 4 && (
  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28 }}>
    {role === 'family' ? (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 6, marginTop: 0 }}>Payment</h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, marginTop: 0 }}>One-time fee — 1 year access</p>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#1e40af', fontWeight: 600 }}>JSKMU Family Registration</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#1e3a5f' }}>₹499</span>
          </div>
          <div style={{ fontSize: 12, color: '#3b82f6', lineHeight: 1.8 }}>
            ✓ Add missing person report<br />
            ✓ Access unidentified bodies database<br />
            ✓ Automatic match notifications — 1 year<br />
            ✓ Admin verified account
          </div>
        </div>

        {authError && (
          <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{authError}</p>
          </div>
        )}

        <button
          onClick={() => { setErrors({}); setStep(3) }}
          style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#475569', marginBottom: 12 }}>
          ← Back
        </button>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', border: 'none', borderRadius: 8,
            background: loading ? '#94a3b8' : '#1e3a5f',
            color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
          {loading ? 'Creating account...' : 'Create Account & Pay ₹499'}
        </button>

        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 12 }}>
          🔒 Secure payment · UPI, Cards, Net Banking accepted
        </p>
      </>
    ) : (
      <>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#15803d', marginBottom: 6, marginTop: 0 }}>
          Almost Done!
        </h2>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginTop: 0, marginBottom: 20 }}>
          Review your details before submitting your contributor application.
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          {[
            { label: 'Name', value: form.name },
            { label: 'Email', value: form.email },
            { label: 'Phone', value: form.phone },
            { label: 'State', value: form.state },
            { label: 'Organization', value: form.organization || 'Independent' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#94a3b8' }}>{item.label}</span>
              <span style={{ color: '#1e293b', fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#15803d', lineHeight: 1.7 }}>
            ✓ Registration is free<br />
            ✓ Admin will verify within 24-48 hours<br />
            ✓ You will be notified via email after approval<br />
            ✓ Earnings per confirmed identification
          </p>
        </div>

        {authError && (
          <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{authError}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => { setErrors({}); setStep(3) }}
            style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#475569' }}>
            ← Back
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              flex: 2, padding: '12px', border: 'none', borderRadius: 8,
              background: loading ? '#94a3b8' : '#15803d',
              color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </>
    )}
  </div>
)}

      </div>

        {/* FOOTER */}
        <Footer />
    </main>
  )
}