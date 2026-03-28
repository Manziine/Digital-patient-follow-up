import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProviderAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/providers/appointments').then((r) => setAppointments(r.data))
            .catch(() => toast.error('Failed to load schedule'))
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/providers/appointments/${id}`, { status });
            setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
            toast.success('Record updated.');
        } catch { toast.error('Failed to update record.'); }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <style>{`
                    .filter-btn {
                        background: none;
                        border: none;
                        padding: 0.5rem 0;
                        margin-right: 2rem;
                        font-family: var(--font-sans);
                        font-size: 0.75rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        letterSpacing: 0.05em;
                        cursor: pointer;
                        color: var(--color-text-muted);
                        position: relative;
                        transition: color var(--transition-fast);
                    }
                    .filter-btn.active { color: var(--color-primary); }
                    .filter-btn.active::after {
                        content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
                        height: 2px; background-color: var(--color-primary);
                    }
                `}</style>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem', marginBottom: '3rem' }}>
                    <div>
                        <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 5vw, 4rem)' }}>Schedules.</h1>
                    </div>
                    <div style={{ display: 'flex' }}>
                        {['all', 'scheduled', 'completed', 'missed', 'cancelled'].map((f) => (
                            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
                ) : (
                    <div>
                        {filtered.length === 0 ? (
                            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>No records established for this filter.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {filtered.map((apt) => (
                                    <div key={apt._id} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 2fr 1fr', gap: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2.5rem', alignItems: 'flex-start' }}>
                                        {/* Date Block */}
                                        <div>
                                            <span style={{ display: 'block', fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', lineHeight: 1 }}>
                                                {new Date(apt.scheduledDate).getDate()}
                                            </span>
                                            <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.4rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                                                {new Date(apt.scheduledDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                            </span>
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                                                @ {new Date(apt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Info Block */}
                                        <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '2rem' }}>
                                            <h3 className="editorial-heading" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{apt.title}</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Patient: <strong>{apt.patient?.name}</strong></p>
                                            {apt.notes && (
                                                <div style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: '1rem', marginTop: '1rem' }}>
                                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Clinical Directives</p>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontStyle: 'italic', lineHeight: 1.6 }}>{apt.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status & Actions Block */}
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                                            <span style={{ 
                                                fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, 
                                                color: apt.status === 'scheduled' ? 'var(--color-primary)' : apt.status === 'completed' ? 'var(--color-text-muted)' : 'var(--color-accent)'
                                            }}>
                                                Status: {apt.status}
                                            </span>

                                            {apt.status === 'scheduled' && (
                                                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                                                    <button onClick={() => updateStatus(apt._id, 'completed')} style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--color-primary)' }}>
                                                        Mark Completed
                                                    </button>
                                                    <button onClick={() => updateStatus(apt._id, 'missed')} style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--color-accent)' }}>
                                                        Log Missed
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
