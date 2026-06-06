'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { findMatchesForPerson } from '@/lib/matching'

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


function BodiesTab({ missingReport }) {
  const [bodies, setBodies] = useState([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

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
              <div key={body.id} style={{ background: '#ffffff', border: `1px solid ${isMatch ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 10, padding: 20, display: 'flex', gap: isMobile ? 14 : 20, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
                <div style={{ width: 80, height: 80, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e2e8f0', overflow: 'hidden', filter: body.photo_url ? 'blur(4px)' : 'none' }}>
                  {body.photo_url ? (
                    <img src={body.photo_url} alt="Unidentified" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 28 }}>👤</span>
                  )}
                </div>
                <div style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
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
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


function MatchesTab({ missingReport, isMobile, onMatchCountChange }) {
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState([])      // [{ body, score, breakdown, matchRow }]
  const [error, setError] = useState('')
  const [scannedOnce, setScannedOnce] = useState(false)

  // Load any matches already saved in the DB for this person
  useEffect(() => {
    const loadExisting = async () => {
      if (!missingReport) { setLoading(false); return }
      try {
        const { data: matchRows } = await supabase
          .from('matches')
          .select('*')
          .eq('missing_person_id', missingReport.id)
          .order('match_score', { ascending: false })

        if (matchRows && matchRows.length > 0) {
          const bodyIds = matchRows.map(m => m.unidentified_body_id)
          const { data: bodies } = await supabase
            .from('unidentified_bodies')
            .select('*')
            .in('id', bodyIds)

          const byId = {}
          ;(bodies || []).forEach(b => { byId[b.id] = b })

          const mapped = matchRows
            .filter(m => byId[m.unidentified_body_id])
            .map(m => ({
              body: byId[m.unidentified_body_id],
              score: m.match_score,
              breakdown: null,
              matchRow: m,
            }))
          setResults(mapped)
          if (onMatchCountChange) onMatchCountChange(mapped.filter(r => r.matchRow.status === 'pending').length)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadExisting()
  }, [missingReport])

  // Run the matching scan on demand
  const handleFindMatches = async () => {
    if (!missingReport) return
    setScanning(true)
    setError('')
    try {
      const { data: bodies } = await supabase
        .from('unidentified_bodies')
        .select('*')

      const found = findMatchesForPerson(missingReport, bodies || [])

      // Don't overwrite user decisions: keep existing rows' status
      const { data: existing } = await supabase
        .from('matches')
        .select('*')
        .eq('missing_person_id', missingReport.id)

      const existingByBody = {}
      ;(existing || []).forEach(m => { existingByBody[m.unidentified_body_id] = m })

      const finalResults = []
      for (const r of found) {
        const already = existingByBody[r.body.id]
        if (already) {
          finalResults.push({ body: r.body, score: r.score, breakdown: r.breakdown, matchRow: already })
        } else {
          const { data: inserted, error: insErr } = await supabase
            .from('matches')
            .insert({
              missing_person_id: missingReport.id,
              unidentified_body_id: r.body.id,
              match_score: r.score,
              status: 'pending',
            })
            .select()
            .single()
          if (insErr) throw insErr
          finalResults.push({ body: r.body, score: r.score, breakdown: r.breakdown, matchRow: inserted })
        }
      }

      finalResults.sort((a, b) => b.score - a.score)
      setResults(finalResults)
      setScannedOnce(true)
      if (onMatchCountChange) onMatchCountChange(finalResults.filter(r => r.matchRow.status === 'pending').length)
    } catch (err) {
      setError(err.message)
    } finally {
      setScanning(false)
    }
  }

  const updateStatus = async (matchRow, newStatus) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: newStatus })
        .eq('id', matchRow.id)
      if (error) throw error
      setResults(prev => {
        const next = prev.map(r => r.matchRow.id === matchRow.id
          ? { ...r, matchRow: { ...r.matchRow, status: newStatus } }
          : r)
        if (onMatchCountChange) onMatchCountChange(next.filter(r => r.matchRow.status === 'pending').length)
        return next
      })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading...</div>

  if (!missingReport) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>Add a report first</h3>
        <p style={{ fontSize: 14, color: '#64748b' }}>Once you add a missing person report, you can scan for possible matches.</p>
      </div>
    )
  }

  const scoreColor = (s) => s >= 80 ? '#15803d' : s >= 70 ? '#b45309' : '#64748b'

  return (
    <div>
      <p style={{ fontSize: 14, color: '#475569', marginBottom: 16 }}>
        These are algorithmically generated suggestions based on gender, age, state, city and date — <strong>not confirmed identifications</strong>. Review the descriptions carefully and contact your local police station to verify any possible match.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={handleFindMatches}
          disabled={scanning}
          style={{ padding: '11px 24px', background: scanning ? '#94a3b8' : '#1e3a5f', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: scanning ? 'not-allowed' : 'pointer' }}>
          {scanning ? 'Scanning...' : '🔍 Find Matches'}
        </button>
        {scannedOnce && <span style={{ fontSize: 13, color: '#64748b' }}>Scan complete — {results.length} possible match(es) found.</span>}
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {results.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>No matches found yet</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Click "Find Matches" to scan current unidentified body records against your report.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {results.map(({ body, score, breakdown, matchRow }) => (
            <div key={matchRow.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: isMobile ? 16 : 24, opacity: matchRow.status === 'rejected' ? 0.55 : 1 }}>

              {/* Header: score + status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor(score) }}>{score}%</span>
                  <span style={{ fontSize: 13, color: '#64748b' }}>match</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 20,
                  background: matchRow.status === 'confirmed' ? '#dcfce7' : matchRow.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                  color: matchRow.status === 'confirmed' ? '#15803d' : matchRow.status === 'rejected' ? '#dc2626' : '#92400e' }}>
                  {matchRow.status === 'confirmed' ? 'Confirmed' : matchRow.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                </span>
              </div>

              {/* Side-by-side comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Your report */}
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', letterSpacing: '0.05em', marginBottom: 10 }}>YOUR REPORT</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>{missingReport.full_name}</div>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
                    Gender: {missingReport.gender}<br />
                    Age: {missingReport.age}<br />
                    Location: {missingReport.city}, {missingReport.state}<br />
                    Last seen: {missingReport.last_seen_date}
                  </div>
                  {missingReport.description && (
                    <p style={{ margin: '10px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6, borderTop: '1px solid #bfdbfe', paddingTop: 10 }}>
                      {missingReport.description}
                    </p>
                  )}
                </div>

                {/* Body record */}
                <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#991b1b', letterSpacing: '0.05em', marginBottom: 10 }}>UNIDENTIFIED RECORD</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Case #{body.case_number || body.id.slice(0, 8).toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
                    Gender: {body.gender}<br />
                    Est. age: {body.estimated_age_min}–{body.estimated_age_max}<br />
                    Location: {body.city}, {body.state}<br />
                    Found: {body.found_date}
                  </div>
                  {body.description && (
                    <p style={{ margin: '10px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6, borderTop: '1px solid #fecaca', paddingTop: 10 }}>
                      {body.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Score breakdown (only available right after a fresh scan) */}
              {breakdown && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {[
                    { label: 'Gender', val: breakdown.gender },
                    { label: 'Age', val: breakdown.age },
                    { label: 'State', val: breakdown.state },
                    { label: 'City', val: breakdown.city },
                  ].map(b => (
                    <span key={b.label} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: b.val > 0 ? '#f0fdf4' : '#f1f5f9', color: b.val > 0 ? '#15803d' : '#94a3b8', fontWeight: 500 }}>
                      {b.label} {b.val > 0 ? `+${b.val}` : '—'}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href={`/missing/${body.id}`} style={{ padding: '8px 18px', background: '#1e3a5f', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                  View Full Details
                </Link>
                {matchRow.status !== 'confirmed' && (
                  <button onClick={() => updateStatus(matchRow, 'confirmed')} style={{ padding: '8px 18px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    This Could Be Them ✓
                  </button>
                )}
                {matchRow.status !== 'rejected' && (
                  <button onClick={() => updateStatus(matchRow, 'rejected')} style={{ padding: '8px 18px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                    Not a Match
                  </button>
                )}
              </div>
            </div>
          ))}
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
  const isMobile = useIsMobile()

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
  const twoCol = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>FULL NAME</label>
        <input value={form.full_name} onChange={e => set('full_name', e.target.value)} style={inputStyle} />
      </div>
      <div style={twoCol}>
        <div>
          <label style={labelStyle}>AGE</label>
          <input value={form.age} onChange={e => set('age', e.target.value)} type="number" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>LAST SEEN DATE</label>
          <input value={form.last_seen_date} onChange={e => set('last_seen_date', e.target.value)} type="date" style={inputStyle} />
        </div>
      </div>
      <div style={twoCol}>
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
      <div style={{ display: 'flex', gap: 10, flexDirection: isMobile ? 'column' : 'row' }}>
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
  const isMobile = useIsMobile()

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

      const { count: bodiesCount } = await supabase
        .from('unidentified_bodies')
        .select('*', { count: 'exact', head: true })

      const { data: report } = await supabase
        .from('missing_persons')
        .select('id, created_at')
        .eq('reported_by', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let daysSince = 0
      let daysRemaining = 0
      let matchesCount = 0

      if (report) {
        const created = new Date(report.created_at)
        const now = new Date()
        daysSince = Math.floor((now - created) / (1000 * 60 * 60 * 24))
        daysRemaining = Math.max(0, 365 - daysSince)

        const { count: pendingCount } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
          .eq('missing_person_id', report.id)
          .eq('status', 'pending')
        matchesCount = pendingCount || 0
      }

      setStats({
        daysSince,
        bodiesCount: bodiesCount || 0,
        daysRemaining,
        matchesCount
      })
    }
    fetchStats()
  }, [])

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

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {/* PAGE HEADER */}
      <div style={{ background: '#1e3a5f', padding: isMobile ? '20px 16px' : '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 0 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', margin: 0, marginBottom: 4 }}>
              Family Dashboard
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Welcome back — your case is being monitored
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20 }}>
              ✓ Verified Account
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: isMobile ? '0 8px' : '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
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
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '20px 16px' : '28px 24px' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {stats.matchesCount > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', marginTop: 6, flexShrink: 0 }}></div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#15803d' }}>{stats.matchesCount} Possible Match(es) Awaiting Review</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#16a34a' }}>
                    Our system has found potential matches for your report. Please review them and contact local police to verify.
                  </p>
                  <button onClick={() => setActiveTab('matches')} style={{ marginTop: 10, padding: '7px 16px', background: '#15803d', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    View Matches →
                  </button>
                </div>
              </div>
            )}

            {/* STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 16, marginBottom: 24 }}>
              {[
                { label: 'Days Since Report', value: String(stats.daysSince), color: '#1e3a5f', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Possible Matches', value: String(stats.matchesCount), color: '#dc2626', bg: '#fff5f5', border: '#fecaca' },
                { label: 'Bodies in Database', value: String(stats.bodiesCount), color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
                { label: 'Access Remaining', value: `${stats.daysRemaining} days`, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* REPORT SUMMARY */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                {missingReport?.photo_url && (
                  <div style={{ marginBottom: 16, textAlign: 'center' }}>
                    <img src={missingReport.photo_url} alt={missingReport.full_name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }} />
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

              {/* HOW MATCHING WORKS */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginBottom: 16, marginTop: 0 }}>How Matching Works</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Go to the Matches tab and click "Find Matches".',
                    'Our system compares your report against all unidentified body records using gender, age, state, city and date.',
                    'Review each suggestion and the side-by-side description carefully.',
                    'If a record could be your loved one, contact your local police with the case number to verify.',
                  ].map((text, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1e3a5f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                      <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{text}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('matches')} style={{ marginTop: 16, width: '100%', padding: '9px', border: 'none', borderRadius: 6, background: '#1e3a5f', fontSize: 13, cursor: 'pointer', color: '#fff', fontWeight: 600 }}>
                  Go to Matches →
                </button>
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
          <MatchesTab
            missingReport={missingReport}
            isMobile={isMobile}
            onMatchCountChange={(n) => setStats(s => ({ ...s, matchesCount: n }))}
          />
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
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: isMobile ? 20 : 28, maxWidth: 600 }}>
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
              <p style={{ fontSize: 11, color: '#94a3b8', margin: '14px 0 0' }}>Note: Notification delivery will be enabled soon.</p>
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