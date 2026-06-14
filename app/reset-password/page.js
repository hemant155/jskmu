'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleReset = async () => {
    if (!password.trim() || password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${hasError ? '#fca5a5' : '#e2e8f0'}`,
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1e293b',
    background: hasError ? '#fff5f5' : '#fff'
  })

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>
            Reset Password
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: '40px auto', padding: '0 24px' }}>
        {!done ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 14, color: '#475569', marginTop: 0, marginBottom: 24, lineHeight: 1.7 }}>
              Enter your new password below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>NEW PASSWORD</label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  type="password"
                  style={inputStyle(error && error.includes('8'))}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>CONFIRM PASSWORD</label>
                <input
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  type="password"
                  style={inputStyle(error && error.includes('match'))}
                />
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 12, background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              style={{ width: '100%', marginTop: 20, padding: '12px', border: 'none', borderRadius: 8, background: loading ? '#94a3b8' : '#1e3a5f', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Link href="/login" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>✓</div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#15803d', marginBottom: 12 }}>Password Updated!</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
              Your password has been successfully updated. Redirecting to login page in 3 seconds...
            </p>
            <Link href="/login" style={{ display: 'inline-block', padding: '10px 24px', background: '#1e3a5f', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              Go to Login
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}