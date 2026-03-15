import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Save, MapPin, Lock, Shield } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function PatientSettings() {
    const { user, updateUser } = useAuthStore();
    const [form, setForm] = useState({
        name: user?.name || '', phone: user?.phone || '', address: user?.address || '', gender: user?.gender || '',
    });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const { data } = await api.patch('/patients/profile', form);
            updateUser(data.user);
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update profile.'); }
        finally { setSaving(false); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }
        setSavingPw(true);
        try {
            await api.patch('/auth/change-password', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            toast.success('Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password.');
        } finally { setSavingPw(false); }
    };

    const labelStyle = { display: 'block', fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Account Settings
                </motion.h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Manage your personal information and security.
                </p>

                <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Profile Card */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                        <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontSize: '1rem' }}>
                            <User size={18} color="var(--accent-blue)" /> Personal Information
                        </h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Phone</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input className="input" style={{ paddingLeft: '2.2rem' }} value={form.phone}
                                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+250 7XX XXX XXX" />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Gender</label>
                                    <select className="input" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                                        <option value="">Prefer not to say</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input className="input" style={{ paddingLeft: '2.2rem' }} value={form.address}
                                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Kigali, Rwanda" />
                                </div>
                            </div>

                            {/* Read-only info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '1rem', background: 'rgba(14,165,233,0.05)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                                <div>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>{user?.email}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'capitalize', marginTop: '0.15rem' }}>{user?.role}</p>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Change Password Card */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
                        <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontSize: '1rem' }}>
                            <Shield size={18} color="var(--accent-teal)" /> Change Password
                        </h2>
                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'Current Password', field: 'currentPassword', placeholder: '••••••••' },
                                { label: 'New Password',     field: 'newPassword',     placeholder: 'Min. 6 characters' },
                                { label: 'Confirm New Password', field: 'confirmPassword', placeholder: 'Re-enter new password' },
                            ].map(({ label, field, placeholder }) => (
                                <div key={field}>
                                    <label style={labelStyle}>{label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input className="input" style={{ paddingLeft: '2.2rem' }} type="password"
                                            placeholder={placeholder} value={pwForm[field]}
                                            onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))} />
                                    </div>
                                </div>
                            ))}
                            <button type="submit" className="btn-secondary" disabled={savingPw} style={{ alignSelf: 'flex-start' }}>
                                <Lock size={16} /> {savingPw ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
