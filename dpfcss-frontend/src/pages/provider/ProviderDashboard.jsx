import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Clock, Plus, X, Activity } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProviderDashboard() {
    const { user } = useAuthStore();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [patients, setPatients] = useState([]);
    const [aptForm, setAptForm] = useState({ patientId: '', title: '', type: 'follow-up', scheduledDate: '', notes: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get('/providers/dashboard'),
            api.get('/providers/patients'),
        ]).then(([d, p]) => {
            setData(d.data);
            setPatients(p.data);
        }).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false));
    }, []);

    const scheduleAppt = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/providers/appointments', aptForm);
            toast.success('Appointment scheduled successfully!');
            setShowModal(false);
            const { data: fresh } = await api.get('/providers/dashboard');
            setData(fresh);
        } catch { toast.error('Failed to schedule appointment.'); }
        finally { setSaving(false); }
    };

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2540' }}>Provider Dashboard</h1>
                        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                            {user?.specialization && `${user.specialization} • `}{user?.hospital}
                        </p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> Schedule Follow-Up
                    </button>
                </div>

                {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>}

                {data && (
                    <>
                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'My Patients', value: data.patients.length, icon: Users, color: '#eff8ff', iconColor: '#2074e8' },
                                { label: 'Upcoming This Week', value: data.upcomingAppointments.length, icon: Calendar, color: '#f0fdfa', iconColor: '#0d9488' },
                                { label: 'Missed Follow-Ups', value: data.missedAppointments.length, icon: Clock, color: '#fef2f2', iconColor: '#ef4444' },
                                { label: 'Active Medications', value: data.medications.length, icon: Activity, color: '#f5f3ff', iconColor: '#7c3aed' },
                            ].map((s, i) => (
                                <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
                                    <div className="stat-icon" style={{ background: s.color }}><s.icon size={22} color={s.iconColor} /></div>
                                    <div>
                                        <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2540', lineHeight: 1 }}>{s.value}</p>
                                        <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                            {/* Upcoming appointments */}
                            <div className="card">
                                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Calendar size={18} color="#2074e8" /> Upcoming Follow-Ups
                                </h2>
                                {data.upcomingAppointments.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '1rem 0' }}>No upcoming appointments</p>}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {data.upcomingAppointments.map((apt) => (
                                        <div key={apt._id} style={{ display: 'flex', gap: '1rem', padding: '0.875rem', background: '#f8faff', borderRadius: '0.75rem', border: '1px solid #e2e8f4' }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff8ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#2074e8', lineHeight: 1 }}>{new Date(apt.scheduledDate).getDate()}</span>
                                                <span style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase' }}>{new Date(apt.scheduledDate).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a2540' }}>{apt.title}</p>
                                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{apt.patient?.name} • {apt.patient?.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Patient list */}
                            <div className="card">
                                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Users size={18} color="#0d9488" /> Recent Patients
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {data.patients.slice(0, 6).map((p) => (
                                        <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: '#f8faff', borderRadius: '0.75rem', border: '1px solid #e2e8f4' }}>
                                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #dbeefe, #ccfbf1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2074e8', fontSize: '0.9rem', flexShrink: 0 }}>
                                                {p.name?.charAt(0)}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a2540' }}>{p.name}</p>
                                                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{p.phone || p.email}</p>
                                            </div>
                                            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Active</span>
                                        </div>
                                    ))}
                                    {data.patients.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No patients assigned yet.</p>}
                                </div>
                            </div>

                            {/* Missed appointments */}
                            {data.missedAppointments.length > 0 && (
                                <div className="card" style={{ border: '1px solid #fecaca' }}>
                                    <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Clock size={18} color="#ef4444" /> Missed Appointments
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {data.missedAppointments.map((apt) => (
                                            <div key={apt._id} style={{ display: 'flex', gap: '1rem', padding: '0.875rem', background: '#fef2f2', borderRadius: '0.75rem' }}>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a2540' }}>{apt.title}</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{apt.patient?.name} • {new Date(apt.scheduledDate).toLocaleDateString()}</p>
                                                </div>
                                                <span className="badge badge-red" style={{ fontSize: '0.7rem', marginLeft: 'auto', alignSelf: 'flex-start' }}>Missed</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Schedule modal */}
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Schedule Follow-Up</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={scheduleAppt} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Patient *</label>
                                    <select className="input" value={aptForm.patientId} onChange={(e) => setAptForm((f) => ({ ...f, patientId: e.target.value }))} required>
                                        <option value="">Select patient...</option>
                                        {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Appointment Title *</label>
                                    <input className="input" placeholder="e.g. Post-surgery follow-up" value={aptForm.title} onChange={(e) => setAptForm((f) => ({ ...f, title: e.target.value }))} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Type</label>
                                        <select className="input" value={aptForm.type} onChange={(e) => setAptForm((f) => ({ ...f, type: e.target.value }))}>
                                            {['follow-up', 'consultation', 'checkup', 'emergency', 'other'].map((t) => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Date & Time *</label>
                                        <input className="input" type="datetime-local" value={aptForm.scheduledDate} onChange={(e) => setAptForm((f) => ({ ...f, scheduledDate: e.target.value }))} required />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Notes</label>
                                    <textarea className="input" rows={3} placeholder="Optional notes..." value={aptForm.notes} onChange={(e) => setAptForm((f) => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Scheduling...' : 'Schedule'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
}
