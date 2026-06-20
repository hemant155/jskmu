'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-browser'

export default function Navbar({ active }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    setMenuOpen(false)
    router.push('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* TOP BAR */}
      <div style={{ background: '#1e3a5f', padding: '6px 16px' }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 4,
        }}>
          <span style={{ color: '#93c5fd', fontSize: 11 }}>
            Emergency: 112 &nbsp;|&nbsp; Helpline: 1094
          </span>
          <span style={{ color: '#93c5fd', fontSize: 11 }}>
            JSK — We have not forgotten. We will not forget.
          </span>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 16px', position: 'relative', zIndex: 100 }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
        }}>
          {/* LOGO */}
          <Link href="/" style={{ textDecoration: 'none' }} onClick={closeMenu}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#1e3a5f' }}>JSK</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#2563eb' }}>MU</span>
            </div>
            <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: -2 }}>
              {isMobile ? 'Missing & Unidentified' : 'Missing & Unidentified Database'}
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Link href="/search" style={{ fontSize: 14, color: active === 'Search' ? '#1e3a5f' : '#475569', padding: '8px 16px', textDecoration: 'none', fontWeight: active === 'Search' ? 600 : 400, borderBottom: active === 'Search' ? '2px solid #1e3a5f' : '2px solid transparent' }}>Search</Link>
              <Link href="/about" style={{ fontSize: 14, color: active === 'About' ? '#1e3a5f' : '#475569', padding: '8px 16px', textDecoration: 'none', fontWeight: active === 'About' ? 600 : 400, borderBottom: active === 'About' ? '2px solid #1e3a5f' : '2px solid transparent' }}>About</Link>
              <Link href="/guidance" style={{ fontSize: 14, color: active === 'Guidance' ? '#1e3a5f' : '#475569', padding: '8px 16px', textDecoration: 'none', fontWeight: active === 'Guidance' ? 600 : 400, borderBottom: active === 'Guidance' ? '2px solid #1e3a5f' : '2px solid transparent' }}>Guidance</Link>

              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                  <Link href="/dashboard" style={{ fontSize: 14, color: '#475569', padding: '8px 16px', textDecoration: 'none' }}>Dashboard</Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0f4f8', padding: '6px 14px', borderRadius: 20 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, color: '#1e3a5f', fontWeight: 500 }}>
                      {profile?.full_name ? profile.full_name.split(' ')[0] : 'User'}
                    </span>
                  </div>
                  <button onClick={handleLogout} style={{ fontSize: 13, color: '#64748b', background: 'transparent', border: '1px solid #e2e8f0', padding: '7px 14px', borderRadius: 6, cursor: 'pointer' }}>
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                  <Link href="/login" style={{ fontSize: 14, color: '#475569', padding: '8px 16px', textDecoration: 'none' }}>Login</Link>
                  <Link href="/register" style={{ fontSize: 14, background: '#1e3a5f', color: '#fff', padding: '9px 20px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Register</Link>
                </div>
              )}
            </div>
          )}

          {/* MOBILE HAMBURGER */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle menu"
            >
              {/* Hamburger → X animation */}
              <span style={{
                display: 'block', width: 22, height: 2, background: '#1e3a5f', borderRadius: 2,
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                transition: 'transform 0.2s ease',
              }} />
              <span style={{
                display: 'block', width: 22, height: 2, background: '#1e3a5f', borderRadius: 2,
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }} />
              <span style={{
                display: 'block', width: 22, height: 2, background: '#1e3a5f', borderRadius: 2,
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                transition: 'transform 0.2s ease',
              }} />
            </button>
          )}
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobile && menuOpen && (
          <div style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 99,
            padding: '8px 0',
          }}>
            <Link href="/search" onClick={closeMenu} style={{ display: 'block', padding: '12px 24px', fontSize: 15, color: active === 'Search' ? '#1e3a5f' : '#475569', fontWeight: active === 'Search' ? 600 : 400, textDecoration: 'none', borderLeft: active === 'Search' ? '3px solid #1e3a5f' : '3px solid transparent' }}>
              🔍 Search
            </Link>
            <Link href="/about" onClick={closeMenu} style={{ display: 'block', padding: '12px 24px', fontSize: 15, color: active === 'About' ? '#1e3a5f' : '#475569', fontWeight: active === 'About' ? 600 : 400, textDecoration: 'none', borderLeft: active === 'About' ? '3px solid #1e3a5f' : '3px solid transparent' }}>
              ℹ️ About
            </Link>
            <Link href="/guidance" onClick={closeMenu} style={{ display: 'block', padding: '12px 24px', fontSize: 15, color: active === 'Guidance' ? '#1e3a5f' : '#475569', fontWeight: active === 'Guidance' ? 600 : 400, textDecoration: 'none', borderLeft: active === 'Guidance' ? '3px solid #1e3a5f' : '3px solid transparent' }}>
              📖 Guidance
            </Link>

            <div style={{ height: 1, background: '#f1f5f9', margin: '8px 24px' }} />

            {user ? (
              <>
                {/* Logged in user info */}
                <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1e3a5f' }}>
                      {profile?.full_name ? profile.full_name.split(' ')[0] : 'User'}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{user.email}</div>
                  </div>
                </div>
                <Link href="/dashboard" onClick={closeMenu} style={{ display: 'block', padding: '12px 24px', fontSize: 15, color: '#475569', textDecoration: 'none' }}>
                  📊 Dashboard
                </Link>
                <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 24px', fontSize: 15, color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} style={{ display: 'block', padding: '12px 24px', fontSize: 15, color: '#475569', textDecoration: 'none' }}>
                  🔑 Login
                </Link>
                <div style={{ padding: '12px 24px' }}>
                  <Link href="/register" onClick={closeMenu} style={{ display: 'block', background: '#1e3a5f', color: '#fff', padding: '12px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15, textAlign: 'center' }}>
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* MOBILE MENU BACKDROP - closes menu when tapping outside */}
      {isMobile && menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 98,
            background: 'rgba(0,0,0,0.2)',
          }}
        />
      )}
    </>
  )
}