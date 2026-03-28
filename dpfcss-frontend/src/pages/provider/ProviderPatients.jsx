import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProviderPatients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/providers/patients').then((r) => setPatients(r.data))
            .catch(() => toast.error('Failed to load roster'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = patients.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Sidebar />
            <main className="page-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem', marginBottom: '4rem' }}>
                    <div>
                        <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 5vw, 4rem)' }}>Patient Roster.</h1>
                    </div>
                    <div>
                        <input 
                            placeholder="Query by name or identity..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            style={{ 
                                padding: '0.5rem 0', 
                                width: '300px', 
                                border: 'none', 
                                borderBottom: '1px solid var(--color-border)', 
                                backgroundColor: 'transparent', 
                                outline: 'none' 
                            }} 
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>
                ) : (
                    <div>
                        {filtered.length === 0 ? (
                            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>No patients located.</p>
                        ) : (
                            <div style={{ borderTop: '1px solid var(--color-primary)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <th style={{ textAlign: 'left', padding: '1.5rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Name</th>
                                            <th style={{ textAlign: 'left', padding: '1.5rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Identity (Email)</th>
                                            <th style={{ textAlign: 'left', padding: '1.5rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Phone</th>
                                            <th style={{ textAlign: 'left', padding: '1.5rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Gender</th>
                                            <th style={{ textAlign: 'right', padding: '1.5rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Presence</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((p) => (
                                            <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: '1.5rem 1rem', fontWeight: 600, fontSize: '1.1rem' }}>{p.name}</td>
                                                <td style={{ padding: '1.5rem 1rem', color: 'var(--color-primary)' }}>{p.email}</td>
                                                <td style={{ padding: '1.5rem 1rem' }}>{p.phone || '—'}</td>
                                                <td style={{ padding: '1.5rem 1rem', textTransform: 'capitalize' }}>{p.gender || '—'}</td>
                                                <td style={{ padding: '1.5rem 1rem', textAlign: 'right', color: 'var(--color-primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Active</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
