'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>
            Forgot Password
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: '40px auto', padding: '0 24px' }}>
        {!sent ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 14, color: '#475569', marginTop: 0, marginBottom: 24, lineHeight: 1.7 }}>
              Enter your registered email address. We will send you a link to reset your password.
            </p>

            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                type="email"
                style={{ width: '100%', padding: '10px 14px', border: `1px solid ${error ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: error ? '#fff5f5' : '#fff' }}
              />
              {error && <p style={{ color: '#dc2626', fontSize: 12, margin: '6px 0 0' }}>{error}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', marginTop: 20, padding: '12px', border: 'none', borderRadius: 8, background: loading ? '#94a3b8' : '#1e3a5f', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
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
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#15803d', marginBottom: 12 }}>Reset Link Sent!</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
              We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px', marginBottom: 24, textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                ⚠️ Link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
            </div>
            <Link href="/login" style={{ display: 'inline-block', padding: '10px 24px', background: '#1e3a5f', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}