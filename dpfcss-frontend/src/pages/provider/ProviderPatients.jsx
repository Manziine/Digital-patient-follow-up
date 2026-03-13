import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Phone, Mail } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProviderPatients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/providers/patients').then((r) => setPatients(r.data))
            .catch(() => toast.error('Failed to load patients'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = patients.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2540' }}>My Patients</h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>All patients assigned to you</p>
                </div>

                <div style={{ position: 'relative', maxWidth: 400, marginBottom: '1.5rem' }}>
                    <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>}

                {!loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {filtered.map((p) => (
                            <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #dbeefe, #ccfbf1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2074e8', fontSize: '1.1rem', flexShrink: 0 }}>
                                        {p.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#1a2540', fontSize: '0.95rem' }}>{p.name}</p>
                                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Active</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                                        <Mail size={12} /> {p.email}
                                    </div>
                                    {p.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                                            <Phone size={12} /> {p.phone}
                                        </div>
                                    )}
                                    {p.gender && <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'capitalize' }}>⚤ {p.gender}</span>}
                                </div>
                            </motion.div>
                        ))}
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                <Users size={48} strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
                                <p>No patients found.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
