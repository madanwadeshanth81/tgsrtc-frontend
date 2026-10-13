import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    CalendarClock,
    Route,
    BarChart3,
    Bell,
    Info,
    Bus,
    LogOut,
    UserCheck,
    Shield
} from 'lucide-react'
import { useAuth } from '../utils/AuthContext'

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'DEPOT_MANAGER'
    const isPassenger = user?.role === 'PASSENGER'

    const navItems = [
        { label: 'Overview', type: 'section' },
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        ...(isPassenger ? [
            { label: 'Commuter Hub', type: 'section' },
            { path: '/passenger', label: 'Routes & Safety Desk', icon: Route },
            { path: '/drivers', label: 'Crew Directory', icon: Users },
        ] : []),
        ...(isAdminOrManager ? [
            { label: 'Operations', type: 'section' },
            { path: '/drivers', label: 'Drivers & Conductors', icon: Users },
            { path: '/passengers', label: 'Passenger Accounts', icon: UserCheck },
            { path: '/shifts', label: 'Shift Scheduling', icon: CalendarClock },
            { path: '/routes', label: 'Route Management', icon: Route },
            { label: 'Intelligence', type: 'section' },
            { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
            { path: '/alerts', label: 'Alerts & Policies', icon: Bell },
        ] : []),
        ...(user?.role === 'DRIVER' ? [
            { label: 'My Portal', type: 'section' },
            { path: '/driver-portal', label: 'Driver Dashboard', icon: UserCheck },
            { path: '/drivers', label: 'Colleague Directory', icon: Users },
        ] : []),
        { label: 'System', type: 'section' },
        { path: '/system', label: 'System Architecture', icon: Info },
    ]

    return (
        <aside className="sidebar">
            <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                    src="/tgsrtc_logo.png"
                    alt="TGSRTC Logo"
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(245, 158, 11, 0.4)',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                    }}
                />
                <div className="sidebar-brand">
                    <h1>TGSRTC</h1>
                    <span>Shift & Fatigue Portal</span>
                </div>
            </div>

            {/* User Profile Pill in Sidebar */}
            {user && (
                <div style={{
                    margin: '0.75rem 1rem',
                    padding: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '8px',
                    border: '1px solid rgba(148, 163, 184, 0.15)'
                }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <span className={`badge ${user.role === 'ADMIN' ? 'purple' : user.role === 'DEPOT_MANAGER' ? 'cyan' : user.role === 'DRIVER' ? 'success' : 'warning'}`} style={{ fontSize: '0.65rem' }}>
                            {user.role}
                        </span>
                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>
            )}

            <nav className="sidebar-nav">
                {navItems.map((item, i) => {
                    if (item.type === 'section') {
                        return (
                            <div key={i} className="nav-section-label">
                                {item.label}
                            </div>
                        )
                    }
                    const Icon = item.icon
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                            end={item.path === '/'}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-footer-info">
                    <div className="sidebar-footer-dot"></div>
                    <span>MariaDB Live • v1.0</span>
                </div>
            </div>
        </aside>
    )
}
