import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

/* ── Small ECG decorative line ── */
function EcgDecor({ color = '#0ea5e9' }) {
    return (
        <svg viewBox="0 0 200 40" style={{ width: 160, height: 30, opacity: 0.5 }}>
            <polyline
                points="0,20 30,20 40,8 50,32 60,20 90,20 100,4 110,36 120,20 160,20 170,12 180,28 190,20 200,20"
                fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
        </svg>
    );
}

export default function LoginPage() {
    const navigate  = useNavigate();
    const login     = useAuthStore((s) => s.login);
    const [form, setForm]     = useState({ email: '', password: '' });
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
            if (data.user.role === 'patient')  navigate('/patient');
            else if (data.user.role === 'provider') navigate('/provider');
            else navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-void)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative', overflow: 'hidden',
        }}>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .gradient-text {
                    background: linear-gradient(135deg,#0ea5e9,#06d6a0,#a855f7);
                    background-size: 200% auto;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text; animation: shimmer 4s linear infinite;
                }
                @keyframes float {
                    0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}
                }
            `}</style>

            {/* Background glow blobs */}
            <div style={{ position:'absolute', top:'10%', left:'5%',  width:300, height:300, background:'rgba(14,165,233,0.12)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'10%', right:'5%', width:250, height:250, background:'rgba(168,85,247,0.1)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />

            {/* Grid */}
            <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)', backgroundSize:'50px 50px', pointerEvents:'none' }} />

            <motion.div
                initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                style={{ width:'100%', maxWidth:460, position:'relative', zIndex:2 }}
            >
                {/* Logo */}
                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <Link to="/" style={{ textDecoration:'none', display:'inline-flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                        <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#0ea5e9,#06d6a0)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 30px rgba(14,165,233,0.5)', animation:'float 3s ease-in-out infinite' }}>
                            <Heart size={24} color="white" />
                        </div>
                        <span style={{ fontWeight:900, fontSize:'1.4rem', color:'var(--text-primary)', letterSpacing:'0.04em' }}>DPFCSS</span>
                    </Link>
                </div>

                {/* Card */}
                <div style={{ background:'rgba(8,15,40,0.85)', border:'1px solid rgba(14,165,233,0.25)', borderRadius:'1.5rem', padding:'2.5rem', backdropFilter:'blur(24px)', boxShadow:'0 0 60px rgba(14,165,233,0.08), 0 25px 60px rgba(0,0,0,0.5)' }}>

                    <div style={{ marginBottom:'2rem' }}>
                        <h1 style={{ fontWeight:900, fontSize:'1.8rem', color:'var(--text-primary)', marginBottom:'0.3rem' }}>Welcome back</h1>
                        <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Sign in to your <span className="gradient-text">DPFCSS</span> account</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                        {/* Email */}
                        <div>
                            <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'0.4rem', letterSpacing:'0.04em', textTransform:'uppercase' }}>Email Address</label>
                            <div style={{ position:'relative' }}>
                                <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                <input
                                    className="input"
                                    style={{ paddingLeft:'2.5rem' }}
                                    type="email" name="email" placeholder="your@email.com"
                                    value={form.email} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'0.4rem', letterSpacing:'0.04em', textTransform:'uppercase' }}>Password</label>
                            <div style={{ position:'relative' }}>
                                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                <input
                                    className="input"
                                    style={{ paddingLeft:'2.5rem', paddingRight:'2.8rem' }}
                                    type={showPw ? 'text' : 'password'} name="password" placeholder="••••••••"
                                    value={form.password} onChange={handleChange} required
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', transition:'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color='var(--accent-blue)'}
                                    onMouseLeave={e => e.target.style.color='var(--text-muted)'}
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit" disabled={loading}
                            className="btn-primary"
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            style={{ justifyContent:'center', padding:'0.95rem', fontSize:'1rem', opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop:'0.25rem', boxShadow:'0 0 25px rgba(14,165,233,0.4)' }}
                        >
                            {loading
                                ? <><span style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Signing in...</>
                                : <> Sign In <ArrowRight size={18} /> </>
                            }
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'1.5rem 0' }}>
                        <div style={{ flex:1, height:1, background:'var(--border)' }} />
                        <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>or</span>
                        <div style={{ flex:1, height:1, background:'var(--border)' }} />
                    </div>

                    <p style={{ textAlign:'center', fontSize:'0.9rem', color:'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color:'var(--accent-blue)', fontWeight:700, textDecoration:'none' }}>Create account</Link>
                    </p>
                </div>

                {/* Demo credentials */}
                <div style={{ marginTop:'1.5rem', padding:'1.1rem 1.25rem', background:'rgba(14,165,233,0.07)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:'1rem', backdropFilter:'blur(12px)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:'0.5rem' }}>
                        <Activity size={13} color="#0ea5e9" />
                        <p style={{ fontWeight:700, fontSize:'0.78rem', color:'var(--accent-blue)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Demo Credentials</p>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem' }}>
                        {[
                            { label:'Patient',  email:'patient@demo.com',  pass:'demo123' },
                            { label:'Provider', email:'provider@demo.com', pass:'demo123' },
                            { label:'Admin',    email:'admin@demo.com',    pass:'demo123' },
                        ].map((d) => (
                            <div key={d.label} style={{ background:'rgba(14,165,233,0.05)', borderRadius:'0.5rem', padding:'0.5rem 0.6rem' }}>
                                <p style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--accent-teal)', marginBottom:2 }}>{d.label}</p>
                                <p style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{d.email}</p>
                                <p style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{d.pass}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
