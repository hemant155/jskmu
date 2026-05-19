'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${errors[field] ? '#fca5a5' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.08)',
    color: '#ffffff'
  })

  const validate = () => {
    const e = {}
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.password.trim()) e.password = 'Password required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const router = useRouter()

const handleLogin = async () => {
  if (!validate()) return
  setLoading(true)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (error) throw error

    // Role check karo — admin, family, contributor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }

  } catch (err) {
    setErrors({ general: err.message })
  } finally {
    setLoading(false)
  }
}

  return (
    <main style={{ minHeight: '100vh', background: '#0f2744', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* LOGO */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#ffffff' }}>JSK</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#60a5fa' }}>MU</span>
        </div>
        <div style={{ fontSize: 11, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
          Admin Panel
        </div>
      </div>

      {/* FORM */}
      <div style={{ width: '100%', maxWidth: 400, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 32 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', margin: '0 0 24px' }}>
          Admin Login
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
            <input
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="admin@jskmu.com"
              type="email"
              style={inputStyle('email')}
            />
            {errors.email && <p style={{ color: '#fca5a5', fontSize: 11, margin: '4px 0 0' }}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: 6 }}>PASSWORD</label>
            <input
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="Enter password"
              type="password"
              style={inputStyle('password')}
            />
            {errors.password && <p style={{ color: '#fca5a5', fontSize: 11, margin: '4px 0 0' }}>{errors.password}</p>}
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', marginTop: 24, padding: '12px', border: 'none', borderRadius: 8, background: loading ? '#334155' : '#2563eb', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Logging in...' : 'Login to Admin Panel'}
        </button>
        {errors.general && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 16, textAlign: 'center' }}>{errors.general}</p>}

        {/* WARNING */}
        <div style={{ marginTop: 20, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '12px 16px' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#fca5a5' }}>
            🔒 Restricted access. Unauthorized login attempts are logged.
          </p>
        </div>
      </div>

      {/* BACK LINK */}
      <Link href="/" style={{ marginTop: 24, fontSize: 13, color: '#475569', textDecoration: 'none' }}>
        ← Back to JSKMU
      </Link>

    </main>
  )
}