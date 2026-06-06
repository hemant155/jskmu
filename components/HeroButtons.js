'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Hero action buttons. "Report a Missing Person" routes based on auth state:
//  - logged in  -> /dashboard/add-missing (straight to the report form)
//  - logged out -> /register (create an account first)
export default function HeroButtons() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setLoggedIn(!!session)
      setChecked(true)
    }
    check()
  }, [])

  // Until we know the auth state, default the report link to /register.
  const reportHref = checked && loggedIn ? '/dashboard/add-missing' : '/register'

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Link href="/search" style={{ background: '#ffffff', color: '#1e3a5f', padding: '12px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
        Search Missing Persons
      </Link>
      <Link href={reportHref} style={{ background: 'transparent', color: '#ffffff', padding: '12px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 500, fontSize: 15, border: '1px solid rgba(255,255,255,0.3)' }}>
        Report a Missing Person
      </Link>
    </div>
  )
}