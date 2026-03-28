import { useState, useEffect } from 'react';
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
            const demoPatients = p.data?.length > 1 ? p.data : [
                { _id: 'p1', name: 'Uwase Aline', phone: '+250 788 123 456', status: 'Needs Attention' },
                { _id: 'p2', name: 'Mukasa Jean', phone: '+250 788 234 567', status: 'Stable' },
                { _id: 'p3', name: 'Ndayisaba Pierre', phone: '+250 788 345 678', status: 'Critical' },
                { _id: 'p4', name: 'Iribagiza Chantal', phone: '+250 788 456 789', status: 'Stable' },
                { _id: 'p5', name: 'Gatera Emmanuel', phone: '+250 788 567 890', status: 'Stable' }
            ];

            const today = new Date();
            const demoAppointments = d.data.upcomingAppointments?.length ? d.data.upcomingAppointments : [
                { _id: 'a1', title: 'Hypertension Follow-up', scheduledDate: new Date(today.setHours(9,0,0,0)).toISOString(), patient: { name: 'Mukasa Jean', phone: '+250 788 234 567' } },
                { _id: 'a2', title: 'Diabetes Review', scheduledDate: new Date(today.setHours(11,30,0,0)).toISOString(), patient: { name: 'Uwase Aline', phone: '+250 788 123 456' } },
                { _id: 'a3', title: 'Post-Op Infection Check', scheduledDate: new Date(today.setHours(14,0,0,0)).toISOString(), patient: { name: 'Ndayisaba Pierre', phone: '+250 788 345 678' } }
            ];

            setData({ ...d.data, upcomingAppointments: demoAppointments, patients: demoPatients });
            setPatients(demoPatients);
        }).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false));
    }, []);

    const scheduleAppt = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/providers/appointments', aptForm);
            toast.success('Appointment scheduled.');
            setShowModal(false);
            const { data: fresh } = await api.get('/providers/dashboard');
            setData(fresh);
        } catch { toast.error('Failed to schedule.'); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div>
                <Sidebar />
                <main className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner" />
                </main>
            </div>
        );
    }

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <style>{`
                    .dashboard-grid {
                        display: grid;
                        grid-template-columns: 1fr 380px;
                        gap: 5rem;
                        align-items: start;
                    }
                    @media (max-width: 1100px) {
                        .dashboard-grid { grid-template-columns: 1fr; gap: 4rem; }
                    }
                `}</style>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                            {user?.specialization && `${user.specialization} • `}{user?.hospital}
                        </p>
                        <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            Provider<br />Overview.
                            {user?.avatar && <img src={user.avatar} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)', marginTop: 'auto' }} />}
                        </h1>
                    </div>
                    <button className="btn-primary" onClick={() => setShowModal(true)} style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                        + Schedule
                    </button>
                </div>

                <div className="dashboard-grid">
                    {/* Left Column */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-primary)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                            <h2 className="editorial-heading" style={{ fontSize: '2rem' }}>Upcoming Register</h2>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>{data?.upcomingAppointments?.length || 0} PENDING</span>
                        </div>

                        {data?.upcomingAppointments?.length === 0 ? (
                            <p className="text-muted">No appointments scheduled.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {data?.upcomingAppointments?.map((apt) => (
                                    <div key={apt._id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'baseline' }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <span style={{ display: 'block', fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', lineHeight: 1 }}>
                                                {new Date(apt.scheduledDate).getDate()}
                                            </span>
                                            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.2rem', fontWeight: 600 }}>
                                                {new Date(apt.scheduledDate).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                                            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{apt.title}</p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{apt.patient?.name} • {apt.patient?.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Missed block (if any) */}
                        {data?.missedAppointments?.length > 0 && (
                            <div style={{ marginTop: '4rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-accent)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                                    <h2 className="editorial-heading" style={{ fontSize: '2rem', color: 'var(--color-accent)' }}>Missed Follow-ups</h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {data.missedAppointments.map((apt) => (
                                        <div key={apt._id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '1rem' }}>{apt.title}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{apt.patient?.name} • {new Date(apt.scheduledDate).toLocaleDateString()}</p>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Missed</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-primary)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                            <h2 className="editorial-heading" style={{ fontSize: '1.5rem' }}>Patient Roster</h2>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>{data?.patients?.length || 0} ENROLLED</span>
                        </div>

                        {data?.patients?.length === 0 ? (
                            <p className="text-muted">No patients assigned yet.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {data.patients.slice(0, 8).map((p) => {
                                    let badge;
                                    switch (p.status) {
                                        case 'Needs Attention': badge = <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef08a', color: '#854d0e', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Needs Attention</span>; break;
                                        case 'Critical': badge = <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#fecaca', color: '#991b1b', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Critical</span>; break;
                                        default: badge = <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Stable</span>; break;
                                    }
                                    return (
                                        <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.phone || 'No phone listed'}</p>
                                            </div>
                                            {badge}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Scheduling Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(27, 58, 45, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }}>
                        <div style={{ backgroundColor: 'var(--color-bg)', padding: '3rem 4rem', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                                <h2 className="editorial-heading" style={{ fontSize: '2rem' }}>Schedule Slot</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Close</button>
                            </div>
                            
                            <form onSubmit={scheduleAppt} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label>Patient</label>
                                    <select value={aptForm.patientId} onChange={(e) => setAptForm((f) => ({ ...f, patientId: e.target.value }))} required>
                                        <option value="">Select patient...</option>
                                        {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Title</label>
                                    <input placeholder="e.g. Post-surgery review" value={aptForm.title} onChange={(e) => setAptForm((f) => ({ ...f, title: e.target.value }))} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <label>Category</label>
                                        <select value={aptForm.type} onChange={(e) => setAptForm((f) => ({ ...f, type: e.target.value }))}>
                                            <option value="follow-up">Follow-up</option>
                                            <option value="consultation">Consultation</option>
                                            <option value="checkup">Checkup</option>
                                            <option value="emergency">Emergency</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Date & Time</label>
                                        <input type="datetime-local" value={aptForm.scheduledDate} onChange={(e) => setAptForm((f) => ({ ...f, scheduledDate: e.target.value }))} required />
                                    </div>
                                </div>
                                <div>
                                    <label>Clinical Notes</label>
                                    <textarea rows={3} placeholder="Optional directives..." value={aptForm.notes} onChange={(e) => setAptForm((f) => ({ ...f, notes: e.target.value }))} />
                                </div>
                                <div style={{ marginTop: '1.5rem' }}>
                                    <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Registering...' : 'Confirm Schedule'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
