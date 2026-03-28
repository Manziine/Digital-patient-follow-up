import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';

const patientLinks = [
    { to: '/patient', label: 'Dashboard' },
    { to: '/patient/messages', label: 'Messages' },
    { to: '/patient/settings', label: 'Settings' },
];

const providerLinks = [
    { to: '/provider', label: 'Dashboard' },
    { to: '/provider/patients', label: 'Patients' },
    { to: '/provider/appointments', label: 'Appointments' },
    { to: '/provider/messages', label: 'Messages' },
    { to: '/provider/settings', label: 'Settings' },
];

const adminLinks = [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/content', label: 'Content' },
];

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const { unreadCount } = useNotificationStore();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links =
        user?.role === 'patient' ? patientLinks
            : user?.role === 'provider' ? providerLinks
                : adminLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <style>{`
                .mobile-menu-btn {
                    display: none;
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    z-index: 50;
                    background-color: var(--color-primary);
                    color: var(--color-bg);
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: block; }
                }
            `}</style>
            
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                MENU
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div 
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(27, 58, 45, 0.4)', zIndex: 40 }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                <div style={{ padding: '0 2.5rem 3.5rem 2.5rem' }}>
                    <h1 className="editorial-heading" style={{ fontSize: '1.85rem', color: 'var(--color-bg)' }}>DPFCSS.</h1>
                    <p style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.05em', color: 'var(--color-bg)', marginTop: '0.2rem' }}>Architecture of Care</p>
                </div>

                <div style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-bg)', fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-bg)', marginTop: '0.2rem' }}>
                        {user?.role}
                    </p>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem' }}>
                    <p style={{ padding: '0 2.5rem 1rem 2.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, color: 'var(--color-bg)', fontWeight: 600 }}>
                        Menu
                    </p>
                    <ul style={{ listStyle: 'none' }}>
                        {links.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={to === '/patient' || to === '/provider' || to === '/admin'}
                                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {label}
                                    {label === 'Messages' && unreadCount > 0 && (
                                        <span style={{ marginLeft: '0.75rem', fontSize: '0.7rem', backgroundColor: 'var(--color-accent)', padding: '0.1rem 0.4rem', borderRadius: '1rem', color: 'var(--color-bg)' }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '0 2.5rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0', transition: 'color var(--transition-fast)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-bg)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--color-accent)'}
                    >
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
