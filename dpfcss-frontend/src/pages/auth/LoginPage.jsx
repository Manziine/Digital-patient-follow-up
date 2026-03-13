import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login(data.user, data.token);
            toast.success(`Welcome back, ${data.user.name}!`);
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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #eff8ff 0%, #f0fdfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 440 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #2074e8, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={20} color="white" />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1a2540' }}>DPFCSS</span>
                        </div>
                    </Link>
                </div>

                <div className="card" style={{ padding: '2.5rem' }}>
                    <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#1a2540', marginBottom: '0.4rem' }}>Welcome back</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Sign in to your DPFCSS account
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '0.4rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    className="input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    type="email" name="email" placeholder="your@email.com"
                                    value={form.email} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '0.4rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    className="input"
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                    type={showPw ? 'text' : 'password'} name="password" placeholder="••••••••"
                                    value={form.password} onChange={handleChange} required
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit" disabled={loading}
                            className="btn-primary"
                            whileTap={{ scale: 0.98 }}
                            style={{ justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f4' }}>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#2074e8', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
                        </p>
                    </div>
                </div>

                {/* Demo credentials */}
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: '0.75rem', border: '1px solid #dbeefe', fontSize: '0.8rem', color: '#475569', backdropFilter: 'blur(8px)' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.4rem', color: '#1a4288' }}>🧪 Demo credentials</p>
                    <p>Patient: patient@demo.com / demo123</p>
                    <p>Provider: provider@demo.com / demo123</p>
                    <p>Admin: admin@demo.com / demo123</p>
                </div>
            </motion.div>
        </div>
    );
}
