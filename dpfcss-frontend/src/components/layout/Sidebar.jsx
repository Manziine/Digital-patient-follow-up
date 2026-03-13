import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Calendar, Pill, MessageCircle, Settings,
    LogOut, Users, Activity, FileText, Bell, Menu, X, Heart
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';

const patientLinks = [
    { to: '/patient', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patient/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/patient/settings', icon: Settings, label: 'Settings' },
];

const providerLinks = [
    { to: '/provider', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/provider/patients', icon: Users, label: 'Patients' },
    { to: '/provider/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/provider/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/provider/settings', icon: Settings, label: 'Settings' },
];

const adminLinks = [
    { to: '/admin', icon: Activity, label: 'Overview' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/content', icon: FileText, label: 'Content' },
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

    const roleColor = user?.role === 'patient' ? 'bg-teal-100 text-teal-700'
        : user?.role === 'provider' ? 'bg-blue-100 text-blue-700'
            : 'bg-purple-100 text-purple-700';

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-xl bg-white shadow-md border border-[var(--color-border)]"
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-40 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="p-6 flex items-center justify-between border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center">
                            <Heart size={18} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-[15px] text-[var(--color-text-primary)]">DPFCSS</span>
                            <p className="text-[10px] text-[var(--color-text-secondary)] leading-none">Healthcare Platform</p>
                        </div>
                    </div>
                    <button className="md:hidden" onClick={() => setMobileOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                {/* User info */}
                <div className="px-4 py-4 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{user?.name}</p>
                            <span className={`badge text-[10px] ${roleColor}`}>
                                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                        Navigation
                    </p>
                    <ul className="space-y-1">
                        {links.map(({ to, icon: Icon, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={to === '/patient' || to === '/provider' || to === '/admin'}
                                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                    {label === 'Messages' && unreadCount > 0 && (
                                        <span className="ml-auto badge badge-blue text-[10px]">{unreadCount}</span>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-[var(--color-border)]">
                    <button
                        onClick={handleLogout}
                        className="sidebar-link w-full text-red-500 hover:!text-red-600 hover:!bg-red-50"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
