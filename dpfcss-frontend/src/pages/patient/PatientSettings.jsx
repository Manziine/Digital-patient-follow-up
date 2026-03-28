import { useState } from 'react';
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
            toast.success('Profile updated.');
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
            toast.success('Password changed successfully.');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password.');
        } finally { setSavingPw(false); }
    };

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ marginBottom: '4rem', borderBottom: '1px solid var(--color-primary)', paddingBottom: '2rem' }}>
                    <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Preferences</p>
                    <h1 className="editorial-heading" style={{ fontSize: '3rem' }}>Account Settings</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 500px)', gap: '6rem' }}>
                    {/* Profile Information */}
                    <section>
                        <h2 className="editorial-heading" style={{ fontSize: '1.75rem', marginBottom: '2.5rem' }}>Personal Profile</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>Registered Email</p>
                                <p style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{user?.email}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>System Role</p>
                                <p style={{ fontSize: '1rem', color: 'var(--color-primary)', textTransform: 'capitalize' }}>{user?.role}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label>Full Name</label>
                                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                            </div>
                            
                            <div>
                                <label>Phone Output</label>
                                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+250 7XX XXX XXX" />
                            </div>
                            
                            <div>
                                <label>Gender Identity</label>
                                <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                                    <option value="">Prefer not to say</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label>Primary Address</label>
                                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Kigali, Rwanda" />
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Updating System...' : 'Update Profile'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Security */}
                    <section style={{ paddingBottom: '4rem' }}>
                        <h2 className="editorial-heading" style={{ fontSize: '1.75rem', marginBottom: '2.5rem' }}>Access Security</h2>
                        
                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label>Current Key</label>
                                <input type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))} />
                            </div>
                            
                            <div>
                                <label>New Key</label>
                                <input type="password" required minLength={6} placeholder="Minimum 6 characters" value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))} />
                            </div>
                            
                            <div>
                                <label>Confirm New Key</label>
                                <input type="password" required minLength={6} value={pwForm.confirmPassword} onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))} />
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn-outline" disabled={savingPw}>
                                    {savingPw ? 'Securing...' : 'Change Security Key'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
