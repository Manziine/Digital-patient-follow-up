import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
    scheduled: 'badge-blue', completed: 'badge-green', missed: 'badge-red', cancelled: 'badge-gray',
};
const statusIcons = {
    scheduled: Clock, completed: CheckCircle, missed: XCircle, cancelled: XCircle,
};

export default function ProviderAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/providers/appointments').then((r) => setAppointments(r.data))
            .catch(() => toast.error('Failed to load appointments'))
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/providers/appointments/${id}`, { status });
            setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
            toast.success('Status updated');
        } catch { toast.error('Failed to update.'); }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2540' }}>Appointments</h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage all patient follow-up appointments</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {['all', 'scheduled', 'completed', 'missed', 'cancelled'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            style={{ padding: '0.4rem 1rem', borderRadius: 999, border: `1.5px solid ${filter === f ? '#2074e8' : '#e2e8f4'}`, background: filter === f ? '#eff8ff' : 'white', color: filter === f ? '#2074e8' : '#64748b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                            {f}
                        </button>
                    ))}
                </div>
                {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>}
                {!loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {filtered.map((apt) => {
                            const Icon = statusIcons[apt.status] || Clock;
                            return (
                                <div key={apt._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.1rem 1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 12, background: '#eff8ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontWeight: 800, color: '#2074e8', lineHeight: 1, fontSize: '1.1rem' }}>{new Date(apt.scheduledDate).getDate()}</span>
                                        <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase' }}>{new Date(apt.scheduledDate).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <p style={{ fontWeight: 700, color: '#1a2540', fontSize: '0.95rem' }}>{apt.title}</p>
                                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.15rem' }}>
                                            {apt.patient?.name} • {new Date(apt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        {apt.notes && <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '0.15rem' }}>{apt.notes}</p>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span className={`badge ${statusColors[apt.status]}`} style={{ textTransform: 'capitalize', fontSize: '0.78rem' }}>{apt.status}</span>
                                        {apt.status === 'scheduled' && (
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <button onClick={() => updateStatus(apt._id, 'completed')} className="btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}>Complete</button>
                                                <button onClick={() => updateStatus(apt._id, 'missed')} className="btn-danger" style={{ fontSize: '0.78rem' }}>Missed</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                <Calendar size={48} strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
                                <p>No appointments found.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
