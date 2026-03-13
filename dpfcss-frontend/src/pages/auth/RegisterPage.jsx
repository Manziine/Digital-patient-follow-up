import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'patient', phone: '',
        specialization: '', hospital: '', nationalId: '', gender: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', form);
            login(data.user, data.token);
            toast.success('Account created successfully!');
            if (data.user.role === 'patient') navigate('/patient');
            else if (data.user.role === 'provider') navigate('/provider');
            else navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #eff8ff 0%, #f0fdfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 480 }}>

                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #2074e8, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={18} color="white" />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1a2540' }}>DPFCSS</span>
                        </div>
                    </Link>
                </div>

                <div className="card" style={{ padding: '2.5rem' }}>
                    <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1a2540', marginBottom: '0.4rem' }}>Create your account</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Join the DPFCSS healthcare platform</p>

                    {/* Role selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.75rem' }}>
                        {['patient', 'provider', 'admin'].map((r) => (
                            <button key={r} type="button" onClick={() => setForm((f) => ({ ...f, role: r }))}
                                style={{
                                    padding: '0.6rem', borderRadius: '0.625rem', border: `2px solid ${form.role === r ? '#2074e8' : '#e2e8f4'}`,
                                    background: form.role === r ? '#eff8ff' : 'white', color: form.role === r ? '#2074e8' : '#64748b',
                                    fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
                                }}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>Full Name *</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input className="input" style={{ paddingLeft: '2.2rem', padding: '0.6rem 0.75rem 0.6rem 2.2rem' }}
                                        type="text" name="name" placeholder="Jean Paul" value={form.name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>Phone</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input className="input" style={{ paddingLeft: '2.2rem', padding: '0.6rem 0.75rem 0.6rem 2.2rem' }}
                                        type="tel" name="phone" placeholder="+250 7XX XXX XXX" value={form.phone} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>Email Address *</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input className="input" style={{ paddingLeft: '2.2rem' }}
                                    type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>Password *</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input className="input" style={{ paddingLeft: '2.2rem' }}
                                    type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
                            </div>
                        </div>

                        {/* Role-specific fields */}
                        {form.role === 'provider' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#eff8ff', borderRadius: '0.75rem', border: '1px solid #dbeefe' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>Specialization</label>
                                    <select className="input" name="specialization" value={form.specialization} onChange={handleChange}
                                        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
                                        <option value="">Select...</option>
                                        <option>General Medicine</option>
                                        <option>Pediatrics</option>
                                        <option>Maternity</option>
                                        <option>Surgery</option>
                                        <option>Nursing</option>
                                        <option>Mental Health</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>Hospital / Clinic</label>
                                    <input className="input" style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
                                        name="hospital" placeholder="CHUK, Kacyiru..." value={form.hospital} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {form.role === 'patient' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#f0fdfa', borderRadius: '0.75rem', border: '1px solid #ccfbf1' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>National ID</label>
                                    <input className="input" style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
                                        name="nationalId" placeholder="1 1999..." value={form.nationalId} onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem' }}>Gender</label>
                                    <select className="input" name="gender" value={form.gender} onChange={handleChange}
                                        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <motion.button type="submit" disabled={loading} className="btn-primary" whileTap={{ scale: 0.98 }}
                            style={{ justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Creating account...' : <>Create Account <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#2074e8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
