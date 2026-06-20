'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const router = useRouter()

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

  const validate = () => {
    const e = {}
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.password.trim()) e.password = 'Password required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) throw error

const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', data.user.id)
  .single()

if (profile?.role === 'admin') {
  router.push('/admin')
} else if (profile?.role === 'contributor') {
  router.push('/contributor')
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
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>

      {/* NAVBAR (shared component — handles top bar + nav + mobile menu) */}
      <Navbar active="Login" />

      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>Login</h1>
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: '40px auto', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
              <input
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="email@example.com"
                type="email"
                style={inputStyle('email')}
              />
              {errors.email && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.email}</p>}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>PASSWORD</label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <input
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Enter password"
                type="password"
                style={inputStyle('password')}
              />
              {errors.password && <p style={{ color: '#dc2626', fontSize: 11, margin: '4px 0 0' }}>{errors.password}</p>}
            </div>
          </div>

          {errors.general && (
            <div style={{ marginTop: 16, background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{errors.general}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', marginTop: 24, padding: '12px', border: 'none', borderRadius: 8, background: loading ? '#94a3b8' : '#1e3a5f', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Register here</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
              Admin?{' '}
              <Link href="/admin/login" style={{ color: '#1e3a5f', fontWeight: 600, textDecoration: 'none' }}>Admin panel login →</Link>
            </p>
          </div>

        </div>

        <div style={{ marginTop: 20, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#1e40af' }}>
            Emergency? Call <strong>112</strong> · Missing Persons Helpline: <strong>1094</strong>
          </p>
        </div>
      </div>

      <div style={{ background: '#0f2744', padding: '24px', marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>JSKMU</span>
          <span style={{ fontSize: 12, color: '#475569' }}>Emergency: 112 · Not affiliated with any government body</span>
        </div>
      </div>

    </main>
  )
}