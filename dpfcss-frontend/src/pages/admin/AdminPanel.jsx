import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, FileText, Plus, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';

function Overview() {
    const [data, setData] = useState(null);
    useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data)); }, []);
    if (!data) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>;
    const chartData = data.appointmentStats.map((s) => ({
        name: `${s._id.month}/${s._id.year}`,
        Total: s.count, Completed: s.completed, Missed: s.missed,
    }));
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Users', value: data.stats.totalUsers, color: '#eff8ff', iconColor: '#2074e8' },
                    { label: 'Patients', value: data.stats.totalPatients, color: '#f0fdfa', iconColor: '#0d9488' },
                    { label: 'Providers', value: data.stats.totalProviders, color: '#f5f3ff', iconColor: '#7c3aed' },
                    { label: 'Appointments', value: data.stats.totalAppointments, color: '#fef9c3', iconColor: '#a16207' },
                    { label: 'Messages', value: data.stats.totalMessages, color: '#fef2f2', iconColor: '#ef4444' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1a2540' }}>{s.value}</p>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.label}</p>
                    </motion.div>
                ))}
            </div>
            <div className="card">
                <h2 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Appointment Trends (Last 6 Months)</h2>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="Total" fill="#3693f3" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Completed" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Recent Users</h2>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                        <tbody>
                            {data.recentUsers.map((u) => (
                                <tr key={u._id}>
                                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                                    <td style={{ color: '#64748b' }}>{u.email}</td>
                                    <td><span className={`badge ${u.role === 'patient' ? 'badge-green' : u.role === 'provider' ? 'badge-blue' : 'badge-yellow'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        } catch { toast.error('Failed to update user.'); }
    };

    const del = async (id) => {
        if (!confirm('Delete this user permanently?')) return;
        try { await api.delete(`/admin/users/${id}`); toast.success('User deleted'); load(); }
        catch { toast.error('Failed to delete user.'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="input" style={{ paddingLeft: '2.2rem' }} placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="input" style={{ maxWidth: 150 }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="">All roles</option>
                    <option value="patient">Patient</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                </select>
                <span style={{ alignSelf: 'center', color: '#64748b', fontSize: '0.85rem', flexShrink: 0 }}>{total} users</span>
            </div>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{u.email}</td>
                                    <td><span className={`badge ${u.role === 'patient' ? 'badge-green' : u.role === 'provider' ? 'badge-blue' : 'badge-yellow'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                                    <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => toggle(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.isActive ? '#ef4444' : '#22c55e' }}>
                                                {u.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button onClick={() => del(u._id)} className="btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
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
            toast.success('Health content published!');
            setShowForm(false); setForm({ title: '', body: '', category: 'general' }); load();
        } catch { toast.error('Failed to publish.'); } finally { setSaving(false); }
    };

    const del = async (id) => {
        try { await api.delete(`/admin/health-content/${id}`); toast.success('Deleted'); load(); }
        catch { toast.error('Failed.'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Health Education Content</h2>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> Add Content</button>
            </div>
            {showForm && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <form onSubmit={create} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input className="input" placeholder="Article title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                        <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                            {['general', 'nutrition', 'medication', 'hygiene', 'mental_health', 'malaria'].map((c) => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.replace('_', ' ')}</option>)}
                        </select>
                        <textarea className="input" rows={4} placeholder="Article body..." value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} required style={{ resize: 'vertical' }} />
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Publishing...' : 'Publish'}</button>
                        </div>
                    </form>
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {content.map((c) => (
                    <div key={c._id} className="card" style={{ position: 'relative' }}>
                        <span className="badge badge-blue" style={{ marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'capitalize' }}>{c.category?.replace('_', ' ')}</span>
                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a2540', marginBottom: '0.5rem' }}>{c.title}</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>{c.body?.substring(0, 100)}...</p>
                        <button onClick={() => del(c._id)} className="btn-danger" style={{ marginTop: '1rem', padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>
                            <Trash2 size={13} /> Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const adminSubLinks = [
    { to: '/admin', icon: Activity, label: 'Overview' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/content', icon: FileText, label: 'Content' },
];

export default function AdminPanel() {
    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2540', marginBottom: '1.5rem' }}>Admin Panel</h1>
                {/* Sub-tab nav */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f4', paddingBottom: '0.75rem' }}>
                    {adminSubLinks.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} end={to === '/admin'}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem',
                                borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
                                background: isActive ? '#eff8ff' : 'transparent',
                                color: isActive ? '#2074e8' : '#64748b',
                                transition: 'all 0.2s',
                            })}>
                            <Icon size={15} /> {label}
                        </NavLink>
                    ))}
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
