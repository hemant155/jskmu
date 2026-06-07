import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Refund Policy — JSKMU',
}

export default function RefundPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>Refund Policy</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>Last updated: June 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '32px auto 64px', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '32px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>

          <p>This Refund Policy explains the terms under which refunds are provided for payments made on JSKMU (https://jskmu.in).</p>

          <h2 style={sectionStyle}>1. Nature of the Service</h2>
          <p>Family registration on JSKMU involves a one-time fee of ₹499, which provides one year of access to the unidentified bodies database, the matching system, and match notifications. This is a digital service and access is granted immediately upon successful payment.</p>

          <h2 style={sectionStyle}>2. Refund Eligibility</h2>
          <p>Because access to the database is granted immediately and is a digital service, fees are generally non-refundable once access has been activated. However, we want to be fair to families. A refund may be considered in the following cases:</p>
          <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
            <li style={{ marginBottom: 6 }}>A duplicate or accidental payment was made for the same account.</li>
            <li style={{ marginBottom: 6 }}>You were charged but access was not granted due to a technical error on our side.</li>
            <li style={{ marginBottom: 6 }}>The payment was made in error and you have not yet used the database access.</li>
          </ul>

          <h2 style={sectionStyle}>3. How to Request a Refund</h2>
          <p>To request a refund, email us at contact@jskmu.in within 7 days of the transaction. Please include your registered email address, the payment ID, and the reason for the request. We will review each request individually.</p>

          <h2 style={sectionStyle}>4. Processing of Refunds</h2>
          <p>Approved refunds will be processed to the original payment method through our payment partner (Razorpay). Refunds typically take 5–7 working days to reflect, depending on your bank.</p>

          <h2 style={sectionStyle}>5. Contributor Accounts</h2>
          <p>Field Contributor registration is free, so no refund provisions apply to contributor accounts.</p>

          <h2 style={sectionStyle}>6. Contact</h2>
          <p>For any questions about refunds, contact us at contact@jskmu.in.</p>

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