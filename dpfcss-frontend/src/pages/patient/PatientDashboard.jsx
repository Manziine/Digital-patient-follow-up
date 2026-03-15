import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Pill, BookOpen, TrendingUp, CheckCircle, Clock, AlertCircle, Bell } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const statusColors = {
    scheduled: 'badge-blue',
    completed: 'badge-green',
    missed: 'badge-red',
    cancelled: 'badge-gray',
};

const freqLabel = {
    once_daily: 'Once daily',
    twice_daily: 'Twice daily',
    three_times_daily: '3× daily',
    as_needed: 'As needed',
    weekly: 'Weekly',
};

export default function PatientDashboard() {
    const { user } = useAuthStore();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taking, setTaking] = useState(null);

    useEffect(() => {
        api.get('/patients/dashboard').then((r) => {
            setData(r.data);
        }).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false));
    }, []);

    const takeMedication = async (id) => {
        setTaking(id);
        try {
            await api.patch(`/patients/medications/${id}/take`);
            toast.success('Medication marked as taken!');
            setData((prev) => ({
                ...prev,
                medications: prev.medications.map((m) =>
                    m._id === id ? { ...m, takenLog: [...m.takenLog, { taken: true, date: new Date() }] } : m
                ),
            }));
        } catch { toast.error('Could not mark medication.'); }
        finally { setTaking(null); }
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
                        Here's your health overview for today.
                    </p>
                </motion.div>

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div className="spinner" />
                    </div>
                )}

                {data && (
                    <>
                        {/* Stats row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'Upcoming Appointments', value: data.appointments.length, icon: Calendar, colorClass: 'blue' },
                                { label: 'Active Medications',    value: data.medications.length,   icon: Pill,     colorClass: 'teal' },
                                { label: 'Adherence Rate',        value: `${data.adherenceRate}%`,  icon: TrendingUp, colorClass: 'purple' },
                                { label: 'Notifications',         value: data.notifications.length, icon: Bell,     colorClass: 'pink' },
                            ].map((s, i) => (
                                <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
                                    <div className={`stat-icon ${s.colorClass}`}>
                                        <s.icon size={22} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</p>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                            {/* Upcoming appointments */}
                            <div className="card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                    <Calendar size={18} color="var(--accent-blue)" />
                                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Upcoming Appointments</h2>
                                </div>
                                {data.appointments.length === 0 && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>No upcoming appointments</p>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {data.appointments.map((apt) => (
                                        <div key={apt._id} style={{ display: 'flex', gap: '1rem', padding: '0.875rem', background: 'rgba(14,165,233,0.05)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(14,165,233,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-blue)', lineHeight: 1 }}>
                                                    {new Date(apt.scheduledDate).getDate()}
                                                </span>
                                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                    {new Date(apt.scheduledDate).toLocaleString('default', { month: 'short' })}
                                                </span>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{apt.title}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                                                    Dr. {apt.provider?.name} • {apt.provider?.hospital || apt.provider?.specialization}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem' }}>
                                                    <Clock size={12} color="var(--text-muted)" />
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                        {new Date(apt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className={`badge ${statusColors[apt.status]}`} style={{ fontSize: '0.7rem', marginLeft: 'auto' }}>{apt.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Medications */}
                            <div className="card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                    <Pill size={18} color="var(--accent-teal)" />
                                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Today's Medications</h2>
                                </div>
                                {data.medications.length === 0 && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>No medications prescribed</p>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {data.medications.map((med) => {
                                        const takenToday = med.takenLog.some((l) => {
                                            const d = new Date(l.date);
                                            const today = new Date();
                                            return l.taken && d.toDateString() === today.toDateString();
                                        });
                                        return (
                                            <div key={med._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', background: takenToday ? 'rgba(6,214,160,0.07)' : 'rgba(245,158,11,0.07)', borderRadius: '0.75rem', border: `1px solid ${takenToday ? 'rgba(6,214,160,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 10, background: takenToday ? 'rgba(6,214,160,0.15)' : 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    {takenToday ? <CheckCircle size={20} color="var(--accent-teal)" /> : <AlertCircle size={20} color="#fbbf24" />}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{med.name}</p>
                                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{med.dosage} • {freqLabel[med.frequency]}</p>
                                                </div>
                                                {!takenToday && (
                                                    <button onClick={() => takeMedication(med._id)} disabled={taking === med._id}
                                                        className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem', flexShrink: 0 }}>
                                                        {taking === med._id ? '...' : 'Mark Taken'}
                                                    </button>
                                                )}
                                                {takenToday && <span className="badge badge-green" style={{ fontSize: '0.72rem', flexShrink: 0 }}>Taken ✓</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Health content */}
                            <div className="card" style={{ gridColumn: '1 / -1' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                    <BookOpen size={18} color="var(--accent-purple)" />
                                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Health Education</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                                    {data.healthContent.map((c) => (
                                        <div key={c._id} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}>
                                            <span className="badge badge-purple" style={{ marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'capitalize' }}>{c.category}</span>
                                            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{c.title}</h3>
                                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.body?.substring(0, 120)}...</p>
                                        </div>
                                    ))}
                                    {data.healthContent.length === 0 && (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No health content available yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
