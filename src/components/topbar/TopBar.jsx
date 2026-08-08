import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from '../theme/ThemeToggle'
import IconComp from '../icon/IconComp'
import { useTheme } from '../../providers/ThemeProvider'
import { useAuth } from '../../providers/AuthProvider'
import { useInAppNotifications } from '../../providers/InAppNotificationProvider'
import useWindowSize from '../../hooks/useWindowSize'
import Button from '../button/Button'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/departments', label: 'Departments', icon: 'Building2' },
  { path: '/employees', label: 'Employees', icon: 'Users' },
  { path: '/subdepartments', label: 'Sub-departments', icon: 'Layers' },
  { path: '/items', label: 'Items', icon: 'Package' },
  { path: '/suppliers', label: 'Suppliers', icon: 'Truck' },
  { path: '/stores', label: 'Stores', icon: 'Warehouse' },
]

export default function TopBar() {
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAsRead } = useInAppNotifications()
  const navigate = useNavigate()
  const bg = theme?.panel?.background ?? theme?.base?.background
  const fg = theme?.text?.primary ?? theme?.base?.foreground
  const border = theme?.card?.line ?? theme?.base?.border ?? 'rgba(0,0,0,0.06)'
  const panelBg = theme?.modal?.background ?? theme?.base?.background ?? '#fff'
  const dangerColor = theme?.base?.danger ?? '#DC3545'
  const primaryColor = theme?.base?.primary ?? '#0D6EFD'

  const { width } = useWindowSize()
  const isCollapsed = width < 1200
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef(null)

  useEffect(() => {
    if (!isCollapsed) setDrawerOpen(false)
  }, [isCollapsed])

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleNotificationClick = (item) => {
    setBellOpen(false)
    markAsRead(item.id)
    if (item.onClick) item.onClick(item)
  }

  const displayName =
    user?.Username ?? user?.username ?? user?.UserName ?? user?.userName ??
    user?.FullName ?? user?.fullName ??
    (user?.FirstName ? `${user.FirstName} ${user.LastName ?? ''}`.trim() : null) ??
    user?.Email ?? user?.email ?? 'User'

  const navLinkStyle = ({ isActive }) => ({
    background: 'transparent',
    border: 'none',
    padding: '6px 10px',
    cursor: 'pointer',
    color: isActive ? fg : 'rgba(128,128,128,0.8)',
    fontWeight: isActive ? 600 : 400,
    textDecoration: 'none',
  })

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          background: bg,
          borderBottom: `1px solid ${border}`,
          color: fg,
          position: 'sticky',
          top: 0,
          zIndex: 60,
          backdropFilter: 'saturate(140%) blur(6px)',
          WebkitBackdropFilter: 'saturate(140%) blur(6px)',
        }}
      >
       
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isCollapsed && (
            <Button
              ariaLabel="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              variant="ghost"
              icon="Menu"
              iconOnly
              size="sm"
              style={{ color: fg }}
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: fg }}>
            <IconComp name="box" animate="spin" animateMode="hover" />
            <strong style={{ color: fg }}>{width <= 800 ? 'OMS' : 'Order Management System'}</strong>
          </div>

          {!isCollapsed && (
            <nav style={{ display: 'flex', gap: 8, marginLeft: 16, flexWrap: 'wrap' }} aria-label="Main navigation">
              {NAV_ITEMS.map((it) => (
                <NavLink key={it.path} to={it.path} style={navLinkStyle}>
                  {it.label}
                </NavLink>
              ))}
              {user?.Roles?.includes('Admin') || user?.roles?.includes('Admin') ? (
                <NavLink to="/visibility" style={navLinkStyle}>
                  Visibility
                </NavLink>
              ) : null}
            </nav>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isCollapsed && (
            <div style={{ fontSize: 14, color: fg, fontWeight: 500 }}>{displayName}</div>
          )}

          <div ref={bellRef} style={{ position: 'relative' }}>
            <button
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              onClick={() => setBellOpen((s) => !s)}
              title="Notifications"
              style={{
                width: 36, height: 36, borderRadius: 8, border: 'none',
                background: bellOpen ? (theme?.input?.background ?? 'rgba(0,0,0,0.06)') : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: fg, position: 'relative',
              }}
            >
              <IconComp name="Bell" size={18} animate="spin" animateMode="hover" />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16,
                  borderRadius: 999, background: dangerColor, color: '#fff',
                  fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', lineHeight: 1, padding: '0 3px',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, width: 320,
                background: panelBg, border: `1px solid ${border}`,
                borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: 999, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px', fontWeight: 600, fontSize: 14, color: fg,
                  borderBottom: `1px solid ${border}`,
                }}>
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '16px', fontSize: 13, color: theme?.text?.muted ?? '#888', textAlign: 'center' }}>
                    No notifications 🎉
                  </div>
                ) : (
                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        style={{
                          display: 'flex', flexDirection: 'column', width: '100%',
                          padding: '10px 16px', background: 'transparent', border: 'none',
                          borderBottom: `1px solid ${border}`, cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13, color: fg }}>
                          {item.title || `Notification ${item.id}`}
                        </span>
                        <span style={{ fontSize: 12, color: theme?.text?.muted ?? '#888', marginTop: 2 }}>
                          {item.description || item.message || 'No details available'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <ThemeToggle />

          <button
            aria-label="Logout"
            onClick={logout}
            title="Logout"
            style={{
              width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: fg,
            }}
          >
            <IconComp name="LogOut" size={18} animate="spin" animateMode="hover" />
          </button>
        </div>
      </header>

    
      {isCollapsed && (
        <>
         
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 80,
              background: 'rgba(0,0,0,0.45)',
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: drawerOpen ? 'auto' : 'none',
              transition: 'opacity 220ms ease',
            }}
          />

        
          <nav
            aria-label="Mobile navigation"
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: 280,
              background: panelBg,
              borderRight: `1px solid ${border}`,
              boxShadow: drawerOpen ? '4px 0 24px rgba(0,0,0,0.18)' : 'none',
              zIndex: 90,
              display: 'flex',
              flexDirection: 'column',
              transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 230ms cubic-bezier(0.4,0,0.2,1)',
              overflowY: 'auto',
            }}
          >
            
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: `1px solid ${border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconComp name="box" size={18} style={{ color: primaryColor }} />
                <strong style={{ color: fg, fontSize: 15 }}>OMS</strong>
              </div>
              <button
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 6,
                }}
              >
                <IconComp name="X" size={18} />
              </button>
            </div>

            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${border}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: primaryColor + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: primaryColor, fontWeight: 700, fontSize: 15,
                flexShrink: 0,
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </div>
                {user?.Email || user?.email ? (
                  <div style={{ fontSize: 12, color: theme?.text?.muted ?? '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.Email ?? user?.email}
                  </div>
                ) : null}
              </div>
            </div>

            
            <div style={{ padding: '8px 8px', flex: 1 }}>
              {NAV_ITEMS.map((it) => (
                <NavLink
                  key={it.path}
                  to={it.path}
                  onClick={() => setDrawerOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                    background: isActive ? primaryColor + '18' : 'transparent',
                    color: isActive ? primaryColor : fg,
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'background 150ms',
                  })}
                >
                  <IconComp name={it.icon} size={17} />
                  {it.label}
                </NavLink>
              ))}
              {user?.Roles?.includes('Admin') || user?.roles?.includes('Admin') ? (
                <NavLink
                  to="/visibility"
                  onClick={() => setDrawerOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                    background: isActive ? primaryColor + '18' : 'transparent',
                    color: isActive ? primaryColor : fg,
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'background 150ms',
                  })}
                >
                  <IconComp name="Eye" size={17} />
                  Visibility
                </NavLink>
              ) : null}
            </div>

           
            <div style={{
              padding: '12px 16px',
              borderTop: `1px solid ${border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <ThemeToggle />
              <button
                onClick={logout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: dangerColor, fontSize: 14, fontWeight: 500, padding: '6px 10px',
                  borderRadius: 6,
                }}
              >
                <IconComp name="LogOut" size={16} />
                Sign out
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
