import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Cancellation Policy — JSKMU',
}

export default function CancellationPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>Cancellation Policy</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>Last updated: June 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '32px auto 64px', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '32px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>

          <p>This Cancellation Policy explains how registrations and subscriptions on JSKMU (https://jskmu.in) can be cancelled.</p>

          <h2 style={sectionStyle}>1. One-Time Registration</h2>
          <p>Family registration is a one-time payment of ₹499 that provides one year of access. It is not a recurring or auto-renewing subscription. No automatic charges are made after the initial payment, so there is nothing to cancel to avoid future billing.</p>

          <h2 style={sectionStyle}>2. Cancelling Before Payment</h2>
          <p>You may cancel the registration process at any time before completing payment, simply by closing the payment window or not proceeding. No charge will be made and no account access will be granted for the paid features.</p>

          <h2 style={sectionStyle}>3. Cancelling After Payment</h2>
          <p>Once payment is complete and access has been activated, the registration cannot be "cancelled" in the sense of stopping future charges, because there are no future charges. If you believe you are entitled to a refund, please refer to our Refund Policy.</p>

          <h2 style={sectionStyle}>4. Account Closure</h2>
          <p>If you wish to close your account and have your data removed, you may request this by emailing contact@jskmu.in. Please note that certain records related to a missing person may be retained for the platform's humanitarian purpose where lawful.</p>

          <h2 style={sectionStyle}>5. Contributor Accounts</h2>
          <p>Field Contributors may stop using the platform at any time. As contributor registration is free, no cancellation charges apply.</p>

          <h2 style={sectionStyle}>6. Contact</h2>
          <p>For cancellation or account closure requests, contact us at contact@jskmu.in.</p>

        </div>
      </div>

      <Footer />
    </main>
  )
}

const sectionStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: '#1e3a5f',
  margin: '28px 0 8px',
}