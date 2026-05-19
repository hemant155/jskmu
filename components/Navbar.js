'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar({ active }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const links = [
    { href: '/search', label: 'Search' },
    { href: '/about', label: 'About' },
  ]

  return (
    <>
      {/* TOP BAR */}
      <div style={{ background: '#1e3a5f', padding: '8px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#93c5fd', fontSize: 12 }}>
            Emergency: 112 &nbsp;|&nbsp; Missing Persons Helpline: 1094
          </span>
          <span style={{ color: '#93c5fd', fontSize: 12 }}>
            JSK — We have not forgotten. We will not forget.
          </span>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#1e3a5f' }}>JSK</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#2563eb' }}>MU</span>
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: -2 }}>
              Missing & Unidentified Database
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  color: active === link.label ? '#1e3a5f' : '#475569',
                  padding: '8px 16px',
                  textDecoration: 'none',
                  fontWeight: active === link.label ? 600 : 400,
                  borderBottom: active === link.label ? '2px solid #1e3a5f' : '2px solid transparent',
                }}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              // LOGGED IN
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                <Link
                  href="/dashboard"
                  style={{ fontSize: 14, color: '#475569', padding: '8px 16px', textDecoration: 'none' }}
                >
                  Dashboard
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0f4f8', padding: '6px 14px', borderRadius: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: '#1e3a5f', fontWeight: 500 }}>
                    {profile?.full_name ? profile.full_name.split(' ')[0] : 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ fontSize: 13, color: '#64748b', background: 'transparent', border: '1px solid #e2e8f0', padding: '7px 14px', borderRadius: 6, cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              // NOT LOGGED IN
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                <Link
                  href="/login"
                  style={{ fontSize: 14, color: '#475569', padding: '8px 16px', textDecoration: 'none' }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  style={{ fontSize: 14, background: '#1e3a5f', color: '#fff', padding: '9px 20px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}