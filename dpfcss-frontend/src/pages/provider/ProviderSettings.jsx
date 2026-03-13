import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Building2, Stethoscope, Phone, MapPin, FileText } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProviderSettings() {
    const { user, setUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: '', phone: '', specialization: '', hospital: '', licenseNumber: '', address: '',
    });
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [changingPass, setChangingPass] = useState(false);

    useEffect(() => {
        api.get('/providers/profile').then(({ data }) => {
            setProfile({
                name: data.name || '',
                phone: data.phone || '',
                specialization: data.specialization || '',
                hospital: data.hospital || '',
                licenseNumber: data.licenseNumber || '',
                address: data.address || '',
            });
        }).catch(() => toast.error('Failed to load profile'));
    }, []);

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.patch('/providers/profile', profile);
            if (setUser) setUser(data.user);
            toast.success('Profile updated successfully!');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setChangingPass(true);
        try {
            await api.patch('/auth/change-password', {
                currentPassword: passForm.currentPassword,
                newPassword: passForm.newPassword,
            });
            toast.success('Password changed successfully!');
            setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPass(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2540' }}>Settings</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        Manage your provider profile and account security
                    </p>
                </div>

                {/* Account info card */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(135deg, #eff8ff, #f0fdfa)', border: '1px solid #bfdbfe' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2074e8, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1.4rem', flexShrink: 0 }}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a2540' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.83rem', color: '#64748b' }}>{user?.email}</p>
                        <span style={{ display: 'inline-block', marginTop: '0.3rem', padding: '0.15rem 0.75rem', background: '#dbeafe', color: '#1d4ed8', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>
                            {user?.role} Account
                        </span>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f4', paddingBottom: '0' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.25rem',
                                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                                borderBottom: activeTab === tab.id ? '2px solid #2074e8' : '2px solid transparent',
                                color: activeTab === tab.id ? '#2074e8' : '#64748b',
                                background: 'transparent', marginBottom: '-2px', transition: 'all 0.2s',
                            }}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Profile tab */}
                {activeTab === 'profile' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="card">
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={18} color="#2074e8" /> Provider Information
                        </h2>
                        <form onSubmit={saveProfile}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                {[
                                    { field: 'name', label: 'Full Name', icon: User, placeholder: 'Dr. Jane Smith', required: true },
                                    { field: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+250 788 000 000' },
                                    { field: 'specialization', label: 'Specialization', icon: Stethoscope, placeholder: 'e.g. Cardiology' },
                                    { field: 'hospital', label: 'Hospital / Clinic', icon: Building2, placeholder: 'e.g. CHUK Hospital' },
                                    { field: 'licenseNumber', label: 'License Number', icon: FileText, placeholder: 'e.g. RWA-MD-2024-001' },
                                    { field: 'address', label: 'Address', icon: MapPin, placeholder: 'Kigali, Rwanda' },
                                ].map(({ field, label, icon: Icon, placeholder, required }) => (
                                    <div key={field}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.83rem', color: '#374151', marginBottom: '0.4rem' }}>
                                            <Icon size={14} color="#64748b" /> {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                                        </label>
                                        <input
                                            className="input"
                                            value={profile[field]}
                                            onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                                            placeholder={placeholder}
                                            required={required}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Security tab */}
                {activeTab === 'security' && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ maxWidth: 500 }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Lock size={18} color="#2074e8" /> Change Password
                        </h2>
                        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { field: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
                                { field: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
                                { field: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                            ].map(({ field, label, placeholder }) => (
                                <div key={field}>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#374151', marginBottom: '0.4rem' }}>{label}</label>
                                    <input
                                        className="input"
                                        type="password"
                                        value={passForm[field]}
                                        onChange={e => setPassForm(p => ({ ...p, [field]: e.target.value }))}
                                        placeholder={placeholder}
                                        required
                                    />
                                </div>
                            ))}
                            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#92400e' }}>
                                ⚠️ After changing your password you will need to log in again on all devices.
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn-primary" disabled={changingPass} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Lock size={16} /> {changingPass ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
