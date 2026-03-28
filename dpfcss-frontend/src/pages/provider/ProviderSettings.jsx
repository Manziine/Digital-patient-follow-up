import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProviderSettings() {
    const { user, setUser } = useAuthStore();
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
        }).catch(() => toast.error('Failed to load credentials'));
    }, []);

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.patch('/providers/profile', profile);
            if (setUser) setUser(data.user);
            toast.success('Credentials updated.');
        } catch {
            toast.error('Failed to update credentials.');
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) {
            toast.error('Passkeys do not match.');
            return;
        }
        if (passForm.newPassword.length < 6) {
            toast.error('Passkey must be at least 6 characters.');
            return;
        }
        setChangingPass(true);
        try {
            await api.patch('/auth/change-password', {
                currentPassword: passForm.currentPassword,
                newPassword: passForm.newPassword,
            });
            toast.success('Passkey updated securely.');
            setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update passkey.');
        } finally {
            setChangingPass(false);
        }
    };

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ marginBottom: '4rem', borderBottom: '1px solid var(--color-primary)', paddingBottom: '2rem' }}>
                    <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Preferences</p>
                    <h1 className="editorial-heading" style={{ fontSize: '3rem' }}>Physician Setup</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 500px)', gap: '6rem' }}>
                    {/* Profile Information */}
                    <section>
                        <h2 className="editorial-heading" style={{ fontSize: '1.75rem', marginBottom: '2.5rem' }}>Medical Profile</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>Registered Email</p>
                                <p style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{user?.email}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>Clearance Level</p>
                                <p style={{ fontSize: '1rem', color: 'var(--color-primary)', textTransform: 'capitalize' }}>{user?.role}</p>
                            </div>
                        </div>

                        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label>Provider Name</label>
                                <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} required />
                            </div>
                            
                            <div>
                                <label>Contact Node</label>
                                <input type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="+250 7XX XXX XXX" />
                            </div>

                            <div>
                                <label>Medical Specialization</label>
                                <input value={profile.specialization} onChange={(e) => setProfile((p) => ({ ...p, specialization: e.target.value }))} placeholder="e.g. Oncology" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label>Institution</label>
                                    <input value={profile.hospital} onChange={(e) => setProfile((p) => ({ ...p, hospital: e.target.value }))} placeholder="e.g. King Faisal Hospital" />
                                </div>
                                <div>
                                    <label>License Registration</label>
                                    <input value={profile.licenseNumber} onChange={(e) => setProfile((p) => ({ ...p, licenseNumber: e.target.value }))} placeholder="RWA-MD-XXXX" />
                                </div>
                            </div>
                            
                            <div>
                                <label>Clinical Address</label>
                                <input value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} placeholder="Kigali, Rwanda" />
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Transmitting...' : 'Update Information'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Security */}
                    <section style={{ paddingBottom: '4rem' }}>
                        <h2 className="editorial-heading" style={{ fontSize: '1.75rem', marginBottom: '2.5rem' }}>Access Architecture</h2>
                        
                        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label>Current Key</label>
                                <input type="password" required value={passForm.currentPassword} onChange={(e) => setPassForm((f) => ({ ...f, currentPassword: e.target.value }))} />
                            </div>
                            
                            <div>
                                <label>New Key</label>
                                <input type="password" required minLength={6} placeholder="Minimum 6 characters" value={passForm.newPassword} onChange={(e) => setPassForm((f) => ({ ...f, newPassword: e.target.value }))} />
                            </div>
                            
                            <div>
                                <label>Confirm New Key</label>
                                <input type="password" required minLength={6} value={passForm.confirmPassword} onChange={(e) => setPassForm((f) => ({ ...f, confirmPassword: e.target.value }))} />
                            </div>

                            <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                System dictates re-authentication upon issuing a new key.
                            </p>

                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn-outline" disabled={changingPass}>
                                    {changingPass ? 'Generating...' : 'Establish New Key'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
