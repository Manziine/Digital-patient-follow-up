import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login(data.user, data.token);
            toast.success(`Welcome back, ${data.user.name}.`);
            if (data.user.role === 'patient') navigate('/patient');
            else if (data.user.role === 'provider') navigate('/provider');
            else navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
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
                    .login-left { flex: 0 0 auto !important; min-height: 35vh; }
                }
            `}</style>
            
            {/* Left side: Editorial Headline with Image Background */}
            <div className="login-left" style={{
                flex: '1',
                padding: '4rem 5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'var(--color-bg)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url(/login-image.png)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(27, 58, 45, 0.85)', // Deep forest green overlay
                    zIndex: 1
                }} />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-bg)', fontWeight: '600', letterSpacing: '0.05em', fontSize: '1.25rem' }}>
                        DPFCSS.
                    </Link>
                </div>
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', marginTop: '4rem', marginBottom: '4rem' }}>
                    <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: 'var(--color-bg)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Elevating<br />digital<br />patient care.
                    </h1>
                    <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '420px', lineHeight: 1.6, color: 'var(--color-bg)' }}>
                        Advanced follow-up orchestration designed with cultural precision and human focus.
                    </p>
                </div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7, letterSpacing: '0.02em' }}>© {new Date().getFullYear()} DPFCSS. Built for Rwanda.</p>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="login-right" style={{
                flex: '1',
                backgroundColor: 'var(--color-bg)',
                padding: '4rem 5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 className="editorial-heading" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Access Account</h2>
                    <p className="text-muted" style={{ marginBottom: '3.5rem', fontSize: '1rem' }}>Please enter your credentials to proceed.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                id="email" 
                                type="email" 
                                name="email" 
                                placeholder="your@email.com"
                                value={form.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input 
                                id="password" 
                                type="password" 
                                name="password" 
                                placeholder="••••••••"
                                value={form.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1.5rem', width: '100%' }}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: '600', textDecoration: 'none' }}>Request Access</Link>
                        </p>
                    </div>
                    
                    {/* Demo credentials */}
                    <div style={{ marginTop: '4rem', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '1.25rem', color: 'var(--color-text-muted)' }}>Demo Credentials</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                            <div><strong style={{ color: 'var(--color-primary)' }}>Patient</strong><br/><span className="text-muted" style={{wordBreak: 'break-all'}}>patient@demo.com<br/>Demo123</span></div>
                            <div><strong style={{ color: 'var(--color-primary)' }}>Provider</strong><br/><span className="text-muted" style={{wordBreak: 'break-all'}}>provider@demo.com<br/>Demo123</span></div>
                            <div><strong style={{ color: 'var(--color-primary)' }}>Admin</strong><br/><span className="text-muted" style={{wordBreak: 'break-all'}}>admin@demo.com<br/>Demo123</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
