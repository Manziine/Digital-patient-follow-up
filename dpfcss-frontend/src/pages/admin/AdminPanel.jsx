import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Routes, Route, NavLink } from 'react-router-dom';

function Overview() {
    const [data, setData] = useState(null);
    useEffect(() => { 
        api.get('/admin/dashboard').then((r) => {
            const demoData = {
                stats: {
                    totalUsers: 48,
                    totalPatients: 35,
                    totalProviders: 8,
                    totalAppointments: 142,
                    totalMessages: 89,
                },
                registrationsPerDay: [
                    { name: 'Mon', count: 0 },
                    { name: 'Tue', count: 1 },
                    { name: 'Wed', count: 2 },
                    { name: 'Thu', count: 0 },
                    { name: 'Fri', count: 1 },
                    { name: 'Sat', count: 2 },
                    { name: 'Sun', count: 0 }
                ],
                recentActivity: [
                    { _id: 1, message: "Dr. Uwimana registered 2 new patients", time: "2 hours ago", type: "provider" },
                    { _id: 2, message: "System backup completed successfully", time: "5 hours ago", type: "system" },
                    { _id: 3, message: "Patient Uwase Aline updated medication log", time: "1 day ago", type: "patient" },
                    { _id: 4, message: "Dr. Habimana completed 4 telemedicine slots", time: "1 day ago", type: "provider" }
                ]
            };
            setData(demoData);
        }); 
    }, []);
    if (!data) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2rem', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                {[
                    { label: 'Total Users', value: data.stats.totalUsers },
                    { label: 'Patients', value: data.stats.totalPatients },
                    { label: 'Providers', value: data.stats.totalProviders },
                    { label: 'Appointments', value: data.stats.totalAppointments },
                    { label: 'Messages', value: data.stats.totalMessages },
                ].map((s) => (
                    <div key={s.label}>
                        <p style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>{s.value}</p>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
                <div>
                    <h2 className="editorial-heading" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Registrations (Past 7 Days)</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>New registrations this week: <strong>6</strong></p>
                    <div style={{ padding: '2rem', border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.registrationsPerDay}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'rgba(27, 58, 45, 0.05)' }} contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 0, textTransform: 'uppercase', fontSize: '0.7rem' }} />
                                <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    <h2 className="editorial-heading" style={{ fontSize: '1.5rem', marginBottom: '2.5rem' }}>Recent Activity Feed</h2>
                    <div style={{ borderTop: '1px solid var(--color-primary)', display: 'flex', flexDirection: 'column' }}>
                        {data.recentActivity.map(act => (
                            <div key={act._id} style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>{act.message}</p>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>{act.type}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{act.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
}

function UsersPanel() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        api.get(`/admin/users?search=${search}&role=${roleFilter}&limit=20`)
            .then((r) => { setUsers(r.data.users); setTotal(r.data.total); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [search, roleFilter]);

    const toggle = async (u) => {
        try {
            await api.patch(`/admin/users/${u._id}`, { isActive: !u.isActive });
            toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`);
            load();
        } catch { toast.error('Failed request.'); }
    };

    const del = async (id) => {
        if (!confirm('Permanent deletion confirmed?')) return;
        try { await api.delete(`/admin/users/${id}`); toast.success('Deleted'); load(); }
        catch { toast.error('Failed to delete.'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'baseline', marginBottom: '2rem' }}>
                <input placeholder="Search directory..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '0.5rem 0', width: '300px', border: 'none', borderBottom: '1px solid var(--color-border)', backgroundColor: 'transparent', outline: 'none' }} />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '0.5rem 0', border: 'none', borderBottom: '1px solid var(--color-border)', backgroundColor: 'transparent', outline: 'none', minWidth: '150px' }}>
                    <option value="">All Roles</option>
                    <option value="patient">Patient</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                </select>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>{total} Directory Results</span>
            </div>

            {loading ? <div style={{ display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div> : (
                <div style={{ borderTop: '1px solid var(--color-primary)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</th>
                                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clearance</th>
                                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                                    <td style={{ padding: '1rem' }}><span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{u.role}</span></td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: u.isActive ? 'var(--color-primary)' : 'var(--color-accent)' }}>
                                            {u.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button onClick={() => toggle(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: 600, marginRight: '1rem', color: u.isActive ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                                            {u.isActive ? 'Revoke' : 'Restore'}
                                        </button>
                                        <button onClick={() => del(u._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--color-accent)' }}>
                                            Purge
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function ContentPanel() {
    const [content, setContent] = useState([]);
    const [form, setForm] = useState({ title: '', body: '', category: 'general' });
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const load = () => api.get('/admin/health-content').then((r) => setContent(r.data));
    useEffect(() => { load(); }, []);

    const create = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            await api.post('/admin/health-content', form);
            toast.success('Published.');
            setShowForm(false); setForm({ title: '', body: '', category: 'general' }); load();
        } catch { toast.error('Failed to publish.'); } finally { setSaving(false); }
    };

    const del = async (id) => {
        try { await api.delete(`/admin/health-content/${id}`); toast.success('Deleted'); load(); }
        catch { toast.error('Failed.'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                <h2 className="editorial-heading" style={{ fontSize: '1.5rem' }}>Global Publications</h2>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    + Draft Publication
                </button>
            </div>

            {showForm && (
                <div style={{ padding: '2rem', border: '1px solid var(--color-border)', marginBottom: '3rem' }}>
                    <form onSubmit={create} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <label>Headline</label>
                            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                        </div>
                        <div>
                            <label>Classification</label>
                            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                                {['general', 'nutrition', 'medication', 'hygiene', 'mental_health', 'malaria'].map((c) => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Content Body</label>
                            <textarea rows={6} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} required />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Discard</button>
                            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Publishing...' : 'Publish to Feed'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '3rem' }}>
                {content.map((c) => (
                    <div key={c._id} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{c.category?.replace('_', ' ')}</span>
                        <h3 className="editorial-heading" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{c.title}</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '800px' }}>{c.body}</p>
                        <button onClick={() => del(c._id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--color-accent)' }}>
                            Retract
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

import useAuthStore from '../../store/authStore';

const adminSubLinks = [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/users', label: 'Directory' },
    { to: '/admin/content', label: 'Publications' },
];

export default function AdminPanel() {
    const { user } = useAuthStore();
    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                        <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', margin: 0 }}>System<br/>Administration.</h1>
                        {user?.avatar && <img src={user.avatar} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }} />}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        {adminSubLinks.map(({ to, label }) => (
                            <NavLink key={to} to={to} end={to === '/admin'}
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    position: 'relative',
                                    paddingBottom: '0.5rem'
                                })}>
                                {({ isActive }) => (
                                    <>
                                        {label}
                                        {isActive && (
                                            <span style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '2px', backgroundColor: 'var(--color-primary)' }} />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <Routes>
                    <Route index element={<Overview />} />
                    <Route path="users" element={<UsersPanel />} />
                    <Route path="content" element={<ContentPanel />} />
                </Routes>
            </main>
        </div>
    );
}
