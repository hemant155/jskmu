'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function SuccessContent() {
  const searchParams = useSearchParams()
  const isFamily = searchParams.get('role') === 'family'

  return (
    <div style={{ maxWidth: 500, margin: '48px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, color: '#15803d' }}>✓</div>

        {isFamily ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#15803d', marginBottom: 12, marginTop: 0 }}>Account Created!</h1>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
              Your account is ready. You can now log in and access your dashboard to report a missing person and search the database.
            </p>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#15803d', lineHeight: 1.8 }}>
                ✓ Your account has been created<br />
                ✓ Add your missing person report<br />
                ✓ Access the unidentified bodies database<br />
                ✓ Log in to get started
              </p>
            </div>
            <Link href="/login" style={{ display: 'inline-block', padding: '11px 28px', background: '#15803d', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              Log In to Dashboard
            </Link>
            <br />
            <Link href="/" style={{ display: 'inline-block', padding: '8px 20px', color: '#64748b', textDecoration: 'none', fontSize: 13 }}>
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#15803d', marginBottom: 12, marginTop: 0 }}>Application Submitted!</h1>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
              Your application has been received. An admin will review and verify your details within 24-48 hours. You will be notified via email once approved.
            </p>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#15803d', lineHeight: 1.8 }}>
                ✓ Your account has been created<br />
                ✓ Admin verification pending<br />
                ✓ Check your email for confirmation<br />
                ✓ Log in once approved
              </p>
            </div>
            <Link href="/" style={{ display: 'inline-block', padding: '11px 28px', background: '#1e3a5f', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      <Suspense fallback={<div style={{ maxWidth: 500, margin: '48px auto', padding: '0 24px', textAlign: 'center', color: '#64748b' }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  )
}