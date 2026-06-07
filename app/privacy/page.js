import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacy Policy — JSKMU',
}

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>Last updated: June 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '32px auto 64px', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '32px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>

          <p>JSKMU ("we", "us") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what we collect, how we use it, and your rights. By using https://jskmu.in, you consent to the practices described here.</p>

          <h2 style={sectionStyle}>1. Information We Collect</h2>
          <p>We collect information you provide directly, including: your name, email address, phone number, and state during registration; the FIR number and FIR document for family verification; details of missing persons or unidentified bodies that you submit; and payment information processed securely by our payment partner. We do not store your card or UPI credentials on our servers.</p>

          <h2 style={sectionStyle}>2. How We Use Your Information</h2>
          <p>We use your information to: create and manage your account; verify family and contributor registrations; operate the missing-persons matching system; send you match notifications and important service updates; process payments; and comply with legal obligations.</p>

          <h2 style={sectionStyle}>3. Sensitive Records and Photographs</h2>
          <p>Photographs of unidentified bodies are stored securely and shown in a blurred form to the public. Clear images and sensitive details are made available only to verified family members for the purpose of identification. FIR documents are used solely for administrative verification and are not displayed publicly.</p>

          <h2 style={sectionStyle}>4. Sharing of Information</h2>
          <p>We do not sell your personal information. We may share information with: our payment processor (Razorpay) to complete transactions; service providers who help us operate the platform (such as hosting and email); and law enforcement or authorities where required by law or to assist in identifying a missing person.</p>

          <h2 style={sectionStyle}>5. Data Security</h2>
          <p>We use industry-standard measures to protect your data, including encrypted storage and access controls. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>

          <h2 style={sectionStyle}>6. Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide the service, comply with legal obligations, and resolve disputes.</p>

          <h2 style={sectionStyle}>7. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data by contacting us. Please note that certain records related to missing persons may be retained for the platform's humanitarian purpose where lawful.</p>

          <h2 style={sectionStyle}>8. Children's Privacy</h2>
          <p>The platform is intended for use by adults. We do not knowingly collect personal information from children for account creation.</p>

          <h2 style={sectionStyle}>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. The latest version will always be available on this page.</p>

          <h2 style={sectionStyle}>10. Contact</h2>
          <p>For privacy-related questions or requests, contact us at contact@jskmu.in.</p>

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