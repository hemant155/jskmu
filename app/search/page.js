'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function SearchPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [filters, setFilters] = useState({
    name: '', state: '', city: '', gender: '', age: ''
  })

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      let query = supabase
        .from('missing_persons')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (filters.name.trim()) {
        query = query.ilike('full_name', `%${filters.name}%`)
      }
      if (filters.state && filters.state !== 'All States') {
        query = query.eq('state', filters.state)
      }
      if (filters.city.trim()) {
        query = query.ilike('city', `%${filters.city}%`)
      }
      if (filters.gender && filters.gender !== 'All') {
        query = query.eq('gender', filters.gender)
      }

      const { data, error } = await query
      if (error) throw error
      setResults(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar active="Search" />

      {/* PAGE HEADER */}
      <div style={{ background: '#1e3a5f', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0, marginBottom: 6 }}>
            Search Missing Persons
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>
            Public database — anyone can search. Filter by state, city, area.
          </p>
        </div>
      </div>

      {/* SEARCH FILTERS */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 200 }}>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>SEARCH BY NAME</label>
              <input
                value={filters.name}
                onChange={e => set('name', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Enter name..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1e293b' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>STATE</label>
              <select value={filters.state} onChange={e => set('state', e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', background: '#fff', color: '#1e293b', boxSizing: 'border-box' }}>
                <option>All States</option>
                {['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>CITY / DISTRICT</label>
              <input value={filters.city} onChange={e => set('city', e.target.value)} placeholder="Enter city..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1e293b' }} />
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 6 }}>GENDER</label>
              <select value={filters.gender} onChange={e => set('gender', e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', background: '#fff', color: '#1e293b', boxSizing: 'border-box' }}>
                <option value="All">All</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <button
                onClick={handleSearch}
                disabled={loading}
                style={{ background: loading ? '#94a3b8' : '#1e3a5f', color: '#fff', padding: '10px 28px', borderRadius: 6, border: 'none', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            {searched ? `Showing ${results.length} result${results.length !== 1 ? 's' : ''}` : ''}
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Last updated: Today</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#94a3b8' }}>Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>No records found</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
              {searched ? 'Try different search terms.' : 'No missing person reports yet.'}
            </p>
            <Link href="/register" style={{ background: '#1e3a5f', color: '#fff', padding: '10px 24px', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              Report Missing Person
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {results.map(person => (
              <div key={person.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* PHOTO */}
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #e2e8f0', overflow: 'hidden' }}>
                  {person.photo_url ? (
                    <img src={person.photo_url} alt={person.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 28 }}>👤</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{person.full_name}</h3>
                      <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, marginTop: 4, display: 'inline-block' }}>MISSING</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Last seen: {person.last_seen_date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: '#475569' }}>Age: {person.age}</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>Gender: {person.gender}</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>📍 {person.city}, {person.state}</span>
                    {person.area && <span style={{ fontSize: 13, color: '#475569' }}>Area: {person.area}</span>}
                  </div>
                  {person.description && (
                    <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {person.description}
                    </p>
                  )}
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '6px 14px', fontSize: 12, color: '#1e40af' }}>
                      ℹ If you have information, call: 112
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INFO BANNER */}
        <div style={{ marginTop: 20, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ color: '#2563eb', fontSize: 16, flexShrink: 0 }}>ℹ</span>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: '#1e40af', fontWeight: 500 }}>Do you have information about a missing person?</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#3b82f6' }}>
              Contact the family directly or report to local police. Emergency: <strong>112</strong>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}