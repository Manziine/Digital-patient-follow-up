import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, Mail, Lock, Phone, ArrowRight, Briefcase, Building } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ROLES = [
    { key:'patient',  label:'Patient',  color:'#06d6a0', desc:'Seek care & follow-ups' },
    { key:'provider', label:'Provider', color:'#0ea5e9', desc:'Manage your patients'    },
    { key:'admin',    label:'Admin',    color:'#a855f7', desc:'Platform management'     },
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
            // Build clean payload — remove empty strings to avoid validation issues
            const payload = Object.fromEntries(
                Object.entries(form).filter(([, v]) => v !== '')
            );
            const { data } = await api.post('/auth/register', payload);
            login(data.user, data.token);
            toast.success('Account created successfully!');
            if (data.user.role === 'patient')       navigate('/patient');
            else if (data.user.role === 'provider') navigate('/provider');
            else                                     navigate('/admin');
        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.[0]?.msg
                || 'Registration failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const activeRole = ROLES.find((r) => r.key === form.role);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-void)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative', overflow: 'hidden',
        }}>
            <style>{`
                @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
                .gradient-text{background:linear-gradient(135deg,#0ea5e9,#06d6a0,#a855f7);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
                @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
                @keyframes spin{to{transform:rotate(360deg)}}
                .role-btn{transition:all 0.25s ease !important;}
                .role-btn:hover{transform:translateY(-2px);}
            `}</style>

            {/* Glow blobs */}
            <div style={{ position:'absolute', top:'5%',  left:'3%',  width:320, height:320, background:'rgba(6,214,160,0.1)',  borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'5%', right:'3%', width:280, height:280, background:'rgba(14,165,233,0.1)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:'40%',  right:'10%',width:200, height:200, background:'rgba(168,85,247,0.08)',borderRadius:'50%', filter:'blur(60px)', pointerEvents:'none' }} />

            {/* Grid */}
            <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)', backgroundSize:'50px 50px', pointerEvents:'none' }} />

            <motion.div
                initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                style={{ width:'100%', maxWidth:520, position:'relative', zIndex:2 }}
            >
                {/* Logo */}
                <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
                    <Link to="/" style={{ textDecoration:'none', display:'inline-flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                        <div style={{ width:50, height:50, borderRadius:14, background:'linear-gradient(135deg,#0ea5e9,#06d6a0)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 30px rgba(14,165,233,0.5)', animation:'float 3s ease-in-out infinite' }}>
                            <Heart size={22} color="white" />
                        </div>
                        <span style={{ fontWeight:900, fontSize:'1.3rem', color:'var(--text-primary)', letterSpacing:'0.04em' }}>DPFCSS</span>
                    </Link>
                </div>

                {/* Card */}
                <div style={{ background:'rgba(8,15,40,0.88)', border:'1px solid rgba(14,165,233,0.22)', borderRadius:'1.5rem', padding:'2.25rem', backdropFilter:'blur(24px)', boxShadow:'0 0 60px rgba(14,165,233,0.08), 0 25px 60px rgba(0,0,0,0.5)' }}>

                    <div style={{ marginBottom:'1.75rem' }}>
                        <h1 style={{ fontWeight:900, fontSize:'1.65rem', color:'var(--text-primary)', marginBottom:'0.3rem' }}>Create your account</h1>
                        <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>Join the <span className="gradient-text">DPFCSS</span> healthcare platform</p>
                    </div>

                    {/* Role selector */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.6rem', marginBottom:'1.75rem' }}>
                        {ROLES.map((r) => {
                            const isActive = form.role === r.key;
                            return (
                                <button
                                    key={r.key} type="button"
                                    className="role-btn"
                                    onClick={() => setForm((f) => ({ ...f, role: r.key }))}
                                    style={{
                                        padding: '0.75rem 0.5rem',
                                        borderRadius: '0.875rem',
                                        border: `1.5px solid ${isActive ? r.color : 'rgba(14,165,233,0.18)'}`,
                                        background: isActive ? `${r.color}18` : 'rgba(10,18,40,0.5)',
                                        color: isActive ? r.color : 'var(--text-muted)',
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                        boxShadow: isActive ? `0 0 16px ${r.color}40` : 'none',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{r.label}</div>
                                    <div style={{ fontSize:'0.65rem', opacity:0.75 }}>{r.desc}</div>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                        {/* Name + Phone */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem' }}>
                            <div>
                                <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Full Name *</label>
                                <div style={{ position:'relative' }}>
                                    <User size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                    <input className="input" style={{ paddingLeft:'2.2rem' }}
                                        type="text" name="name" placeholder="Jean Paul" value={form.name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Phone</label>
                                <div style={{ position:'relative' }}>
                                    <Phone size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                    <input className="input" style={{ paddingLeft:'2.2rem' }}
                                        type="tel" name="phone" placeholder="+250 7XX XXX XXX" value={form.phone} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Email Address *</label>
                            <div style={{ position:'relative' }}>
                                <Mail size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                <input className="input" style={{ paddingLeft:'2.2rem' }}
                                    type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Password *</label>
                            <div style={{ position:'relative' }}>
                                <Lock size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                <input className="input" style={{ paddingLeft:'2.2rem' }}
                                    type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
                            </div>
                        </div>

                        {/* Provider-specific fields */}
                        {form.role === 'provider' && (
                            <motion.div
                                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                                style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', padding:'1rem', background:'rgba(14,165,233,0.07)', borderRadius:'0.875rem', border:'1px solid rgba(14,165,233,0.2)' }}
                            >
                                <div>
                                    <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--accent-blue)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Specialization</label>
                                    <div style={{ position:'relative' }}>
                                        <Briefcase size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                        <select className="input" name="specialization" value={form.specialization} onChange={handleChange} style={{ paddingLeft:'2.2rem' }}>
                                            <option value="">Select...</option>
                                            <option>General Medicine</option>
                                            <option>Pediatrics</option>
                                            <option>Maternity</option>
                                            <option>Surgery</option>
                                            <option>Nursing</option>
                                            <option>Mental Health</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--accent-blue)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Hospital / Clinic</label>
                                    <div style={{ position:'relative' }}>
                                        <Building size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                                        <input className="input" style={{ paddingLeft:'2.2rem' }}
                                            name="hospital" placeholder="CHUK, Kacyiru..." value={form.hospital} onChange={handleChange} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Patient-specific fields */}
                        {form.role === 'patient' && (
                            <motion.div
                                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                                style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', padding:'1rem', background:'rgba(6,214,160,0.07)', borderRadius:'0.875rem', border:'1px solid rgba(6,214,160,0.2)' }}
                            >
                                <div>
                                    <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--accent-teal)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>National ID</label>
                                    <input className="input"
                                        name="nationalId" placeholder="1 1999..." value={form.nationalId} onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ display:'block', fontWeight:600, fontSize:'0.75rem', color:'var(--accent-teal)', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Gender</label>
                                    <select className="input" name="gender" value={form.gender} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit" disabled={loading}
                            className="btn-primary"
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            style={{
                                justifyContent:'center', padding:'0.95rem', fontSize:'1rem',
                                opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop:'0.5rem',
                                background: `linear-gradient(135deg, ${activeRole?.color ?? '#0ea5e9'}, #06b6d4)`,
                                boxShadow: `0 0 25px ${activeRole?.color ?? '#0ea5e9'}60`,
                            }}
                        >
                            {loading
                                ? <><span style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Creating account...</>
                                : <> Create Account <ArrowRight size={18} /> </>
                            }
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'1.5rem 0' }}>
                        <div style={{ flex:1, height:1, background:'var(--border)' }} />
                        <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>already have an account?</span>
                        <div style={{ flex:1, height:1, background:'var(--border)' }} />
                    </div>

                    <Link to="/login" className="btn-secondary" style={{ width:'100%', justifyContent:'center', padding:'0.75rem', fontSize:'0.9rem' }}>
                        Sign In Instead
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
