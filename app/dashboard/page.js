'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'


function BodiesTab({ missingReport }) {
  const [bodies, setBodies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBodies = async () => {
      const { data } = await supabase
        .from('unidentified_bodies')
        .select('*')
        .order('created_at', { ascending: false })
      setBodies(data || [])
      setLoading(false)
    }
    fetchBodies()
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading...</div>

  return (
    <div>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 20px', marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
          🔒 This database is accessible only to verified family members. Photos are blurred. If you believe any record may be your missing person, contact your local police station with the case number.
        </p>
      </div>

      {bodies.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>No unidentified body records yet</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Records will appear here as field contributors add them.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {bodies.map(body => {
            const isMatch = missingReport && body.gender === missingReport.gender

            return (
              <div key={body.id} style={{ background: '#ffffff', border: `1px solid ${isMatch ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 10, padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                {/* BLURRED PHOTO */}
                <div style={{ width: 80, height: 80, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e2e8f0', overflow: 'hidden', filter: body.photo_url ? 'blur(4px)' : 'none' }}>
                  {body.photo_url ? (
                    <img src={body.photo_url} alt="Unidentified" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 28 }}>👤</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e3a5f' }}>Case #{body.case_number || body.id.slice(0, 8).toUpperCase()}</span>
                      {isMatch && (
                        <span style={{ marginLeft: 10, background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>Possible Match</span>
                      )}
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Found: {body.found_date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: '#475569' }}>Gender: {body.gender}</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>Age: {body.estimated_age_min}-{body.estimated_age_max}</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>Location: {body.city}, {body.state}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{body.description}</p>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button style={{ padding: '6px 14px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>View Full Details</button>
                    <button style={{ padding: '6px 14px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Not a Match</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


function EditReportForm({ report, onSaved }) {
  const [form, setForm] = useState({
    full_name: report.full_name || '',
    age: report.age || '',
    description: report.description || '',
    city: report.city || '',
    state: report.state || '',
    last_seen_date: report.last_seen_date || '',
    fir_number: report.fir_number || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const { error } = await supabase
        .from('missing_persons')
        .update({
          full_name: form.full_name,
          age: parseInt(form.age),
          description: form.description,
          city: form.city,
          state: form.state,
          last_seen_date: form.last_seen_date,
          fir_number: form.fir_number,
        })
        .eq('id', report.id)
      if (error) throw error
      setSaved(true)
      setTimeout(() => { setSaved(false); onSaved() }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleMarkFound = async () => {
    if (!confirm('Are you sure? This will archive your report.')) return
    setSaving(true)
    try {
      await supabase.from('missing_persons').update({ status: 'resolved' }).eq('id', report.id)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1e293b' }
  const labelStyle = { fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>FULL NAME</label>
        <input value={form.full_name} onChange={e => set('full_name', e.target.value)} style={inputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>AGE</label>
          <input value={form.age} onChange={e => set('age', e.target.value)} type="number" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>LAST SEEN DATE</label>
          <input value={form.last_seen_date} onChange={e => set('last_seen_date', e.target.value)} type="date" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>CITY</label>
          <input value={form.city} onChange={e => set('city', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>STATE</label>
          <select value={form.state} onChange={e => set('state', e.target.value)} style={inputStyle}>
            {['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>FIR NUMBER</label>
        <input value={form.fir_number} onChange={e => set('fir_number', e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>PHYSICAL DESCRIPTION</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} />
      </div>
      {error && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>}
      {saved && <p style={{ color: '#15803d', fontSize: 13, margin: 0 }}>✓ Saved successfully!</p>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '11px', background: saving ? '#94a3b8' : '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
        <button onClick={handleMarkFound} disabled={saving} style={{ flex: 1, padding: '11px', background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>
          Mark as Found ✓
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  const [missingReport, setMissingReport] = useState(null)
const [loadingReport, setLoadingReport] = useState(true)

useEffect(() => {
  const fetchReport = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('missing_persons')
      .select('*')
      .eq('reported_by', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data) setMissingReport(data)
    setLoadingReport(false)
  }
  fetchReport()
}, [])

const [stats, setStats] = useState({
  daysSince: 0,
  bodiesCount: 0,
  daysRemaining: 0,
  matchesCount: 0
})

useEffect(() => {
  const fetchStats = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Bodies count
    const { count: bodiesCount } = await supabase
      .from('unidentified_bodies')
      .select('*', { count: 'exact', head: true })

    // Missing report for days calculation
    const { data: report } = await supabase
      .from('missing_persons')
      .select('created_at')
      .eq('reported_by', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let daysSince = 0
    let daysRemaining = 0

    if (report) {
      const created = new Date(report.created_at)
      const now = new Date()
      daysSince = Math.floor((now - created) / (1000 * 60 * 60 * 24))
      daysRemaining = Math.max(0, 365 - daysSince)
    }

    setStats({
      daysSince,
      bodiesCount: bodiesCount || 0,
      daysRemaining,
      matchesCount: 0
    })
  }
  fetchStats()
}, [])

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

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {/* PAGE HEADER */}
      <div style={{ background: '#1e3a5f', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', margin: 0, marginBottom: 4 }}>
              Family Dashboard
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Welcome back — your case is being monitored
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20 }}>
              ✓ Verified Account
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', color: '#93c5fd', fontSize: 12, padding: '6px 14px', borderRadius: 20 }}>
              Access expires: May 2027
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex' }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'report', label: 'My Report' },
            { key: 'bodies', label: 'Unidentified Bodies' },
            { key: 'matches', label: 'Matches' },
            { key: 'settings', label: 'Settings' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabStyle(tab.key)}>
              {tab.label}
              {tab.key === 'matches' && stats.matchesCount > 0 && (
  <span style={{ marginLeft: 6, background: '#dc2626', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{stats.matchesCount}</span>
)}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* ALERT — MATCH FOUND */}
            {stats.matchesCount > 0 && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', marginTop: 6, flexShrink: 0, animation: 'pulse 2s infinite' }}></div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#15803d' }}>{stats.matchesCount} Possible Matches Found</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#16a34a' }}>
                  Our system has found potential matches for your report. Please review them and contact local police to verify.
                </p>
                <button onClick={() => setActiveTab('matches')} style={{ marginTop: 10, padding: '7px 16px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  View Matches →
                </button>
              </div>
            </div>}

            {/* STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Days Since Report', value: String(stats.daysSince), color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe' },
{ label: 'Possible Matches', value: String(stats.matchesCount), color: '#dc2626', bg: '#fff5f5', border: '#fecaca' },
{ label: 'Bodies Reviewed', value: String(stats.bodiesCount), color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
{ label: 'Access Remaining', value: `${stats.daysRemaining} days`, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* REPORT SUMMARY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                {missingReport?.photo_url && (
  <div style={{ marginBottom: 16, textAlign: 'center' }}>
    <img
      src={missingReport.photo_url}
      alt={missingReport.full_name}
      style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
    />
  </div>
)}
<h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginBottom: 16, marginTop: 0 }}>Missing Person Report</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(missingReport ? [
                    { label: 'Name', value: missingReport.full_name },
                    { label: 'Age', value: String(missingReport.age) },
                    { label: 'Gender', value: missingReport.gender },
                    { label: 'Last Seen', value: `${missingReport.city}, ${missingReport.state}` },
                    { label: 'Date', value: missingReport.last_seen_date },
                    { label: 'FIR Number', value: missingReport.fir_number || 'N/A' },
                    { label: 'Status', value: missingReport.status },
                  ] : [
                    { label: 'Name', value: '—' },
                    { label: 'Status', value: 'No report added yet' },
                  ]).map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#94a3b8' }}>{item.label}</span>
                      <span style={{ color: item.label === 'Status' ? '#15803d' : '#1e293b', fontWeight: item.label === 'Status' ? 600 : 400 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('report')} style={{ marginTop: 16, width: '100%', padding: '9px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#1e3a5f', fontWeight: 500 }}>
                  Edit Report →
                </button>
              </div>

              {/* RECENT ACTIVITY */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginBottom: 16, marginTop: 0 }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { date: 'Today', text: 'New possible match found — Male, 30-40, Maharashtra', type: 'match' },
                    { date: '3 days ago', text: 'System reviewed 12 new unidentified body records', type: 'scan' },
                    { date: '1 week ago', text: 'New possible match found — Male, 28-38, Mumbai', type: 'match' },
                    { date: '2 weeks ago', text: 'Your report was verified by admin', type: 'verify' },
                    { date: '4 months ago', text: 'Account registered and report submitted', type: 'register' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 16, borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none', paddingTop: i > 0 ? 16 : 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.type === 'match' ? '#dc2626' : item.type === 'verify' ? '#15803d' : '#94a3b8', flexShrink: 0, marginTop: 5 }}></div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, color: '#334155' }}>{item.text}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BODIES TAB */}
        {activeTab === 'bodies' && (
          <BodiesTab missingReport={missingReport} />
        )}

        {/* MATCHES TAB */}
        {activeTab === 'matches' && (
          <div>
            <p style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>
              These are algorithmically generated matches based on age, gender, state and physical description. These are not confirmed identifications. Please contact your local police station to verify.
            </p>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>No matches found yet</h3>
              <p style={{ fontSize: 14, color: '#64748b' }}>Our system continuously scans unidentified body records. You will be notified when a potential match is found.</p>
            </div>
          </div>
        )}
                <div key={match.id} style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: 10, padding: 24, borderLeft: '4px solid #dc2626' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f' }}>Case #{match.id}</span>
                      <span style={{ marginLeft: 10, fontSize: 13, color: '#64748b' }}>Found: {match.found} · {match.city}</span>
                    </div>
                    <div style={{ background: '#fee2e2', color: '#dc2626', fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>
                      {match.score}% match
                    </div>
                  </div>
                  <p style={{ margin: '0 0 16px', fontSize: 13, color: '#475569' }}>
                    <strong>Why matched:</strong> {match.reason}
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{ padding: '8px 18px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>View Full Record</button>
                    <button style={{ padding: '8px 18px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Contact Police</button>
                    <button style={{ padding: '8px 18px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Not a Match</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORT TAB */}
        {activeTab === 'report' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => router.push('/dashboard/add-missing')}
                style={{ padding: '10px 24px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                + Add Missing Person Report
              </button>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 28, maxWidth: 600 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e3a5f', marginBottom: 20, marginTop: 0 }}>Edit Missing Person Report</h3>
              {missingReport ? (
                <EditReportForm report={missingReport} onSaved={() => window.location.reload()} />
              ) : (
                <p style={{ color: '#94a3b8', fontSize: 14 }}>No report found. Add one above.</p>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginTop: 0, marginBottom: 16 }}>Notification Preferences</h3>
              {[
                { label: 'Email notifications for new matches', default: true },
                { label: 'SMS notifications for new matches', default: true },
                { label: 'Weekly summary email', default: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', marginBottom: i < 2 ? 14 : 0 }}>
                  <span style={{ fontSize: 14, color: '#334155' }}>{item.label}</span>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: item.default ? '#1e3a5f' : '#e2e8f0', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: item.default ? 21 : 3, transition: 'left 0.2s' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 10, padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#dc2626', marginTop: 0, marginBottom: 8 }}>Danger Zone</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>Marking your case as resolved will archive your report and close your access to the unidentified bodies database.</p>
              <button style={{ padding: '9px 20px', background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Mark Case as Resolved
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </main>
  )
}