import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Save, MapPin } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function PatientSettings() {
    const { user, updateUser } = useAuthStore();
    const [form, setForm] = useState({
        name: user?.name || '', phone: user?.phone || '', address: user?.address || '', gender: user?.gender || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const { data } = await api.patch('/patients/profile', form);
            updateUser(data.user);
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update profile.'); }
        finally { setSaving(false); }
    };

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2540', marginBottom: '2rem' }}>Account Settings</h1>
                <div style={{ maxWidth: 560 }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                        <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={18} color="#2074e8" /> Personal Information
                        </h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Full Name</label>
                                <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Phone</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input className="input" style={{ paddingLeft: '2.2rem' }} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+250 7XX XXX XXX" />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Gender</label>
                                    <select className="input" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                                        <option value="">Prefer not to say</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input className="input" style={{ paddingLeft: '2.2rem' }} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Kigali, Rwanda" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '1rem', background: '#f8faff', borderRadius: '0.75rem', border: '1px solid #e2e8f4' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>EMAIL</p>
                                    <p style={{ fontSize: '0.9rem', color: '#1a2540', marginTop: '0.15rem' }}>{user?.email}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>ROLE</p>
                                    <p style={{ fontSize: '0.9rem', color: '#1a2540', textTransform: 'capitalize', marginTop: '0.15rem' }}>{user?.role}</p>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
