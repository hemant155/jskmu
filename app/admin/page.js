'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Shared hook: detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function AdminPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('overview')
  const [authChecked, setAuthChecked] = useState(false)

  // Data states
  const [pendingContributors, setPendingContributors] = useState([])
  const [verifiedContributors, setVerifiedContributors] = useState([])
  const [stats, setStats] = useState({ missing: 0, bodies: 0, pending: 0, payments: 0 })
  const [actionLoading, setActionLoading] = useState(null) // holds id being processed

  // AUTH GUARD — only admin can access
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        router.push('/')
        return
      }
      setAuthChecked(true)
      loadData()
    }
    checkAdmin()
  }, [])

  const loadData = async () => {
    // Pending contributors (unverified)
    const { data: pending } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'contributor')
      .eq('is_verified', false)
      .order('created_at', { ascending: false })

    // Verified contributors
    const { data: verified } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'contributor')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    // Counts
    const { count: missingCount } = await supabase
      .from('missing_persons').select('*', { count: 'exact', head: true })
    const { count: bodiesCount } = await supabase
      .from('unidentified_bodies').select('*', { count: 'exact', head: true })

    setPendingContributors(pending || [])
    setVerifiedContributors(verified || [])
    setStats({
      missing: missingCount || 0,
      bodies: bodiesCount || 0,
      pending: (pending || []).length,
      payments: 0,
    })
  }

  const handleApprove = async (id) => {
    setActionLoading(id)
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', id)
    if (!error) await loadData()
    setActionLoading(null)
  }

  const handleReject = async (id) => {
    if (!confirm('Reject and delete this contributor application? This cannot be undone.')) return
    setActionLoading(id)
    // Delete auth user — profile cascades. Requires service role normally;
    // here we delete the profile row directly.
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    if (!error) await loadData()
    setActionLoading(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const tabStyle = (tab) => ({
    padding: isMobile ? '10px 14px' : '10px 20px',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? '#1e3a5f' : 'transparent'}`,
    background: 'transparent',
    fontSize: 14,
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? '#1e3a5f' : '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  })

  const badgeStyle = (color) => ({
    fontSize: 11, fontWeight: 600, padding: '3px 10px',
    borderRadius: 20,
    background: color === 'green' ? '#dcfce7' : color === 'red' ? '#fee2e2' : color === 'yellow' ? '#fef3c7' : '#f1f5f9',
    color: color === 'green' ? '#15803d' : color === 'red' ? '#dc2626' : color === 'yellow' ? '#92400e' : '#475569'
  })

  // While auth is being checked, show nothing (prevents flash of admin content)
  if (!authChecked) {
    return (
      <main style={{ minHeight: '100vh', background: '#0f2744', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>Verifying access...</span>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>

      {/* ADMIN NAVBAR */}
      <nav style={{ background: '#0f2744', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>JSK</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa' }}>MU</span>
            </div>
            {!isMobile && (
              <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: 20, letterSpacing: '0.08em' }}>ADMIN PANEL</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16 }}>
            {!isMobile && <Link href="/" style={{ fontSize: 13, color: '#60a5fa', textDecoration: 'none' }}>View Site →</Link>}
            <button onClick={handleLogout} style={{ fontSize: 13, color: '#94a3b8', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </nav>

      {/* TABS */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: isMobile ? '0 8px' : '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'verifications', label: 'Pending Verifications', count: stats.pending },
            { key: 'missing', label: 'Missing Persons' },
            { key: 'bodies', label: 'Unidentified Bodies' },
            { key: 'contributors', label: 'Contributors' },
            { key: 'payments', label: 'Payments' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabStyle(tab.key)}>
              {tab.label}
              {tab.count > 0 && (
                <span style={{ marginLeft: 6, background: '#dc2626', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '20px 16px' : '28px 24px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 16, marginBottom: 28 }}>
              {[
                { label: 'Total Missing Reports', value: String(stats.missing), sub: 'Active cases', color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Unidentified Bodies', value: String(stats.bodies), sub: 'In database', color: '#dc2626', bg: '#fff5f5', border: '#fecaca' },
                { label: 'Pending Verifications', value: String(stats.pending), sub: 'Needs review', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
                { label: 'Total Revenue', value: `₹${stats.payments}`, sub: 'All time', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{stat.label}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginTop: 0, marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Review Pending Verifications', color: '#b45309', bg: '#fffbeb', border: '#fde68a', action: 'verifications' },
                    { label: 'View Contributors', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', action: 'contributors' },
                    { label: 'View Missing Persons', color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe', action: 'missing' },
                    { label: 'View Payment Reports', color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe', action: 'payments' },
                  ].map(item => (
                    <button key={item.label} onClick={() => setActiveTab(item.action)} style={{ padding: '12px 16px', background: item.bg, border: `1px solid ${item.border}`, borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500, color: item.color }}>
                      {item.label} →
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginTop: 0, marginBottom: 16 }}>Pending Contributor Applications</h3>
                {pendingContributors.length === 0 ? (
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>No pending applications right now.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {pendingContributors.slice(0, 5).map((c, i) => (
                      <div key={c.id} style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: i < Math.min(pendingContributors.length, 5) - 1 ? '1px solid #f1f5f9' : 'none', paddingTop: i > 0 ? 14 : 0 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b45309', flexShrink: 0, marginTop: 4 }}></div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, color: '#334155' }}>{c.full_name || 'Unnamed'} — awaiting verification</p>
                          <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>{c.phone || 'No phone'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PENDING VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Pending Contributor Verifications</h2>
            {pendingContributors.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>All caught up</h3>
                <p style={{ fontSize: 14, color: '#64748b' }}>No contributor applications pending verification.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {pendingContributors.map((c) => (
                  <div key={c.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 16, flexDirection: isMobile ? 'column' : 'row' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{c.full_name || 'Unnamed Contributor'}</span>
                        <span style={badgeStyle('green')}>Contributor</span>
                        <span style={badgeStyle('yellow')}>Pending</span>
                      </div>
                      <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#64748b', flexWrap: 'wrap' }}>
                        <span>Phone: {c.phone || 'N/A'}</span>
                        {c.organization && <span>Org: {c.organization}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, width: isMobile ? '100%' : 'auto' }}>
                      <button
                        onClick={() => handleApprove(c.id)}
                        disabled={actionLoading === c.id}
                        style={{ flex: isMobile ? 1 : 'none', padding: '8px 16px', background: actionLoading === c.id ? '#94a3b8' : '#15803d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: actionLoading === c.id ? 'not-allowed' : 'pointer' }}>
                        {actionLoading === c.id ? '...' : 'Approve ✓'}
                      </button>
                      <button
                        onClick={() => handleReject(c.id)}
                        disabled={actionLoading === c.id}
                        style={{ flex: isMobile ? 1 : 'none', padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: actionLoading === c.id ? 'not-allowed' : 'pointer' }}>
                        Reject ✗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MISSING PERSONS */}
        {activeTab === 'missing' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Missing Persons</h2>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                {stats.missing === 0 ? 'No records yet. Records will appear here as families register.' : `${stats.missing} missing person record(s) in database.`}
              </p>
            </div>
          </div>
        )}

        {/* UNIDENTIFIED BODIES */}
        {activeTab === 'bodies' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Unidentified Bodies</h2>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                {stats.bodies === 0 ? 'No records yet. Verified contributors will add records here.' : `${stats.bodies} unidentified body record(s) in database.`}
              </p>
            </div>
          </div>
        )}

        {/* CONTRIBUTORS */}
        {activeTab === 'contributors' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Verified Contributors</h2>
            {verifiedContributors.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>No verified contributors yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {verifiedContributors.map((c) => (
                  <div key={c.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{c.full_name || 'Unnamed'}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>
                        {c.phone || 'No phone'}{c.organization ? ` · ${c.organization}` : ''}
                      </div>
                    </div>
                    <span style={badgeStyle('green')}>✓ Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Payments</h2>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>No payments yet. Payment records will appear here once Razorpay is live.</p>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}