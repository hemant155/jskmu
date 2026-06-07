import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Terms and Conditions — JSKMU',
}

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0 }}>Terms and Conditions</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>Last updated: June 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '32px auto 64px', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '32px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>

          <p>Welcome to JSKMU (Jaswant Singh Khalra Missing &amp; Unidentified Database), accessible at https://jskmu.in. By accessing or using this website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.</p>

          <h2 style={sectionStyle}>1. About the Platform</h2>
          <p>JSKMU is an independent, privately operated online platform that helps families locate missing persons by maintaining a searchable database of missing person reports and records of unidentified bodies. JSKMU is not affiliated with, endorsed by, or operated by any government body, police department, or official agency.</p>

          <h2 style={sectionStyle}>2. Eligibility</h2>
          <p>You must be at least 18 years of age to register and use the paid features of this platform. By registering, you confirm that the information you provide is true, accurate, and complete to the best of your knowledge.</p>

          <h2 style={sectionStyle}>3. User Accounts and Roles</h2>
          <p>The platform offers two types of accounts: Family Members (who report missing persons and access the database) and Field Contributors (who add records of unidentified bodies and are verified by an administrator). Family registration requires a valid FIR (First Information Report) number. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2 style={sectionStyle}>4. Fees and Access</h2>
          <p>Family registration involves a one-time fee of ₹499, which grants one year of access to the unidentified bodies database and automatic match notifications. Field Contributor registration is free. All fees are processed securely through Razorpay. Access is granted on a subscription basis as described at the time of payment.</p>

          <h2 style={sectionStyle}>5. Acceptable Use</h2>
          <p>You agree to use the platform only for its intended humanitarian purpose. You must not: submit false or misleading reports; misuse personal data of any individual; attempt to gain unauthorised access to the system; or use the platform for any unlawful activity. JSKMU reserves the right to suspend or terminate accounts that violate these terms.</p>

          <h2 style={sectionStyle}>6. Accuracy of Information</h2>
          <p>While we strive to keep records accurate, JSKMU does not guarantee the accuracy, completeness, or reliability of any information on the platform. Any match suggested by the system is indicative only and must be independently verified by the police and competent authorities. JSKMU does not confirm identities.</p>

          <h2 style={sectionStyle}>7. Limitation of Liability</h2>
          <p>JSKMU provides this platform on an "as is" basis. To the maximum extent permitted by law, JSKMU shall not be liable for any direct, indirect, or consequential loss arising from the use of, or inability to use, the platform, including any decisions made based on information found here.</p>

          <h2 style={sectionStyle}>8. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised Terms.</p>

          <h2 style={sectionStyle}>9. Contact</h2>
          <p>For any questions regarding these Terms, contact us at contact@jskmu.in.</p>

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