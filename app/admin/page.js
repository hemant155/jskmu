'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? '#1e3a5f' : 'transparent'}`,
    background: 'transparent',
    fontSize: 14,
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? '#1e3a5f' : '#64748b',
    cursor: 'pointer'
  })

  const badgeStyle = (color) => ({
    fontSize: 11, fontWeight: 600, padding: '3px 10px',
    borderRadius: 20,
    background: color === 'green' ? '#dcfce7' : color === 'red' ? '#fee2e2' : color === 'yellow' ? '#fef3c7' : '#f1f5f9',
    color: color === 'green' ? '#15803d' : color === 'red' ? '#dc2626' : color === 'yellow' ? '#92400e' : '#475569'
  })

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>

      {/* ADMIN NAVBAR */}
      <nav style={{ background: '#0f2744', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>JSK</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa' }}>MU</span>
            </div>
            <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: 20, letterSpacing: '0.08em' }}>ADMIN PANEL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Admin</span>
            <Link href="/" style={{ fontSize: 13, color: '#60a5fa', textDecoration: 'none' }}>View Site →</Link>
            <button style={{ fontSize: 13, color: '#94a3b8', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </nav>

      {/* TABS */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex' }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'verifications', label: 'Pending Verifications', count: 4 },
            { key: 'missing', label: 'Missing Persons' },
            { key: 'bodies', label: 'Unidentified Bodies' },
            { key: 'contributors', label: 'Contributors' },
            { key: 'payments', label: 'Payments' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabStyle(tab.key)}>
              {tab.label}
              {tab.count && (
                <span style={{ marginLeft: 6, background: '#dc2626', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Total Missing Reports', value: '0', sub: 'Active cases', color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Unidentified Bodies', value: '0', sub: 'In database', color: '#dc2626', bg: '#fff5f5', border: '#fecaca' },
                { label: 'Pending Verifications', value: '4', sub: 'Needs review', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
                { label: 'Total Revenue', value: '₹0', sub: 'All time', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{stat.label}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginTop: 0, marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Review Pending Verifications', color: '#b45309', bg: '#fffbeb', border: '#fde68a', action: 'verifications' },
                    { label: 'Add Unidentified Body Record', color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe', action: 'bodies' },
                    { label: 'Review Contributor Applications', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', action: 'contributors' },
                    { label: 'View Payment Reports', color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe', action: 'payments' },
                  ].map(item => (
                    <button key={item.label} onClick={() => setActiveTab(item.action)} style={{ padding: '12px 16px', background: item.bg, border: `1px solid ${item.border}`, borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500, color: item.color }}>
                      {item.label} →
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginTop: 0, marginBottom: 16 }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { text: 'New family registration — Pending verification', time: '2 hours ago', color: '#b45309' },
                    { text: 'Contributor application received', time: '5 hours ago', color: '#15803d' },
                    { text: 'Payment received — ₹499', time: '1 day ago', color: '#15803d' },
                    { text: 'New family registration — Pending verification', time: '2 days ago', color: '#b45309' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none', paddingTop: i > 0 ? 14 : 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: 4 }}></div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, color: '#334155' }}>{item.text}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PENDING VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Pending Verifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'Sunita Kumar', role: 'Family', fir: 'MH/MUM/2025/001234', submitted: '2 hours ago', state: 'Maharashtra' },
                { name: 'Harbir Singh', role: 'Family', fir: 'PB/LDH/2025/005678', submitted: '5 hours ago', state: 'Punjab' },
                { name: 'Ravi NGO Trust', role: 'Contributor', fir: 'N/A', submitted: '1 day ago', state: 'Gujarat' },
                { name: 'Pradeep Sharma', role: 'Family', fir: 'UP/LKO/2025/009012', submitted: '2 days ago', state: 'Uttar Pradesh' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                      <span style={badgeStyle(item.role === 'Family' ? 'blue' : 'green')}>{item.role}</span>
                      <span style={badgeStyle('yellow')}>Pending</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#64748b' }}>
                      <span>FIR: {item.fir}</span>
                      <span>State: {item.state}</span>
                      <span>Submitted: {item.submitted}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '8px 16px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      View FIR
                    </button>
                    <button style={{ padding: '8px 16px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Approve ✓
                    </button>
                    <button style={{ padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Reject ✗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MISSING PERSONS */}
        {activeTab === 'missing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', margin: 0 }}>Missing Persons</h2>
              <input placeholder="Search by name..." style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', width: 240 }} />
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Name', 'Age', 'State', 'Last Seen', 'FIR No.', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      No records yet. Records will appear here as families register.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UNIDENTIFIED BODIES */}
        {activeTab === 'bodies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', margin: 0 }}>Unidentified Bodies</h2>
              <button style={{ padding: '9px 20px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                + Add New Record
              </button>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Case No.', 'Gender', 'Est. Age', 'Location', 'Found Date', 'Added By', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      No records yet. Contributors will add records as they are verified.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTRIBUTORS */}
        {activeTab === 'contributors' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Contributors</h2>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Name', 'Organization', 'State', 'Cases Added', 'Earnings', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      No contributors yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Revenue', value: '₹0', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
                { label: 'This Month', value: '₹0', color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Pending Payouts', value: '₹0', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['User', 'Type', 'Amount', 'Razorpay ID', 'Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      No payments yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}