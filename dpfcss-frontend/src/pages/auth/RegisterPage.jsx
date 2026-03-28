import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ROLES = [
    { key:'patient',  label:'Patient',  desc:'Seek care & follow-ups' },
    { key:'provider', label:'Provider', desc:'Manage your patients'    },
    { key:'admin',    label:'Admin',    desc:'Platform management'     },
];

export default function RegisterPage() {
    const navigate = useNavigate();
    const login    = useAuthStore((s) => s.login);
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'patient', phone: '',
        specialization: '', hospital: '', nationalId: '', gender: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''));
            const { data } = await api.post('/auth/register', payload);
            login(data.user, data.token);
            toast.success('Account created successfully.');
            if (data.user.role === 'patient')       navigate('/patient');
            else if (data.user.role === 'provider') navigate('/provider');
            else                                     navigate('/admin');
        } catch (err) {
            let msg = 'Registration failed. Server may be unreachable.';
            if (err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err.response?.data?.errors?.[0]?.msg) {
                msg = err.response.data.errors[0].msg;
            } else if (err.message) {
                msg = `Registration failed: ${err.message}`;
            }
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
            <style>{`
                @media (max-width: 900px) {
                    .login-container { flex-direction: column !important; }
                    .login-left, .login-right { padding: 2.5rem 1.5rem !important; }
                    .login-left { flex: 0 0 auto !important; min-height: 25vh; }
                }
            `}</style>
            
            <div className="login-left" style={{ flex: '1', backgroundColor: 'var(--color-primary)', padding: '4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--color-bg)' }}>
                <div>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-bg)', fontWeight: '600', letterSpacing: '0.05em', fontSize: '1.25rem' }}>DPFCSS.</Link>
                </div>
                <div style={{ maxWidth: '600px', marginTop: '2rem', marginBottom: '2rem' }}>
                    <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: 'var(--color-bg)', marginBottom: '1.5rem' }}>
                        Join the<br />architecture<br />of care.
                    </h1>
                    <p style={{ fontSize: '1.15rem', opacity: 0.85, maxWidth: '420px', lineHeight: 1.6, color: 'var(--color-bg)' }}>
                        Request access to our clinical ecosystem and experience a new standard of digital oversight.
                    </p>
                </div>
                <div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.02em' }}>© {new Date().getFullYear()} DPFCSS. Swiss precision architecture.</p>
                </div>
            </div>

            <div className="login-right" style={{ flex: '1', backgroundColor: 'var(--color-bg)', padding: '4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <h2 className="editorial-heading" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create Profile</h2>
                    <p className="text-muted" style={{ marginBottom: '2.5rem', fontSize: '1rem' }}>Enter your details to register.</p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {ROLES.map((r) => {
                            const isActive = form.role === r.key;
                            return (
                                <button
                                    key={r.key} type="button"
                                    onClick={() => setForm((f) => ({ ...f, role: r.key }))}
                                    style={{
                                        padding: '0.75rem 0.5rem', flex: 1, cursor: 'pointer', transition: 'all var(--transition-fast)',
                                        border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-primary)'}`,
                                        backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                                        color: isActive ? 'var(--color-bg)' : 'var(--color-primary)',
                                    }}
                                >
                                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{r.label}</div>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <label>Full Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Phone</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label>Email Address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Password</label>
                            <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
                        </div>

                        {form.role === 'provider' && (
                            <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid var(--color-border)', backgroundColor: 'transparent' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Specialization</label>
                                    <select name="specialization" value={form.specialization} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        <option>General Medicine</option>
                                        <option>Pediatrics</option>
                                        <option>Maternity</option>
                                        <option>Surgery</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Hospital</label>
                                    <input name="hospital" value={form.hospital} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {form.role === 'patient' && (
                            <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid var(--color-border)', backgroundColor: 'transparent' }}>
                                <div style={{ flex: 1 }}>
                                    <label>National ID</label>
                                    <input name="nationalId" value={form.nationalId} onChange={handleChange} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Gender</label>
                                    <select name="gender" value={form.gender} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: '600', textDecoration: 'none' }}>Sign In Instead</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
