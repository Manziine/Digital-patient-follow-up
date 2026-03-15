import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Heart, Shield, Bell, MessageCircle, ArrowRight,
    CheckCircle, Activity, Users, Clock, Zap, Globe, Lock
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────── */
const features = [
    { icon: Bell,          title: 'Smart Reminders',     desc: 'Automated appointment & medication reminders tailored for every patient.', accent: '#0ea5e9'  },
    { icon: MessageCircle, title: 'Secure Messaging',    desc: 'Real-time encrypted communication between patients and providers.',       accent: '#06d6a0'  },
    { icon: Shield,        title: 'Privacy First',       desc: 'Patient data encrypted and protected under healthcare privacy standards.', accent: '#a855f7'  },
    { icon: Globe,         title: 'Low-Bandwidth Ready', desc: 'Optimized for Rwanda\'s networks — fast even on 2G/3G connections.',       accent: '#22d3ee'  },
    { icon: Activity,      title: 'Vitals Tracking',     desc: 'Monitor patient health trends with live data visualizations.',            accent: '#ec4899'  },
    { icon: Zap,           title: 'Instant Notifications',desc: 'Push alerts ensure nothing falls through the cracks.',                  accent: '#fbbf24'  },
];

const stats = [
    { value: '10,000+', label: 'Patients Monitored',   accent: '#0ea5e9'  },
    { value: '500+',    label: 'Healthcare Providers', accent: '#06d6a0'  },
    { value: '95%',     label: 'Follow-ups Completed', accent: '#a855f7'  },
    { value: '30',      label: 'Districts Covered',    accent: '#22d3ee'  },
];

const roles = [
    {
        role: 'Patients', accent: '#06d6a0',
        items: ['View upcoming appointments', 'Track medication adherence', 'Receive health education', 'Chat with your provider'],
    },
    {
        role: 'Healthcare Providers', accent: '#0ea5e9',
        items: ['Manage patient follow-ups', 'Schedule appointments', 'Monitor adherence trends', 'Send health reminders'],
    },
    {
        role: 'Administrators', accent: '#a855f7',
        items: ['Manage all system users', 'View platform analytics', 'Publish health content', 'Monitor all activity'],
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ─── Heartbeat SVG ─────────────────────────────────────── */
function HeartbeatLine({ color = '#0ea5e9', style = {} }) {
    return (
        <svg viewBox="0 0 300 60" style={{ overflow: 'visible', ...style }}>
            <polyline
                points="0,30 40,30 55,10 70,50 85,30 120,30 135,5 150,55 165,30 210,30 225,15 240,45 255,30 300,30"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    filter: `drop-shadow(0 0 6px ${color})`,
                    strokeDasharray: 350,
                    strokeDashoffset: 350,
                    animation: 'draw-line 2.5s ease forwards',
                }}
            />
        </svg>
    );
}

/* ─── Floating Particle ─────────────────────────────────── */
function Particle({ x, y, size, color, delay }) {
    return (
        <div style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: size, height: size, borderRadius: '50%',
            background: color,
            filter: `blur(${size / 2}px)`,
            opacity: 0.35,
            animation: `float ${3 + delay}s ease-in-out ${delay}s infinite`,
            pointerEvents: 'none',
        }} />
    );
}

/* ─── Dashboard Preview Card ────────────────────────────── */
function DashboardPreview() {
    const vitals = [
        { label: 'Heart Rate',   value: '72 bpm',  color: '#ec4899', icon: '♥' },
        { label: 'Blood Press.', value: '120/80',  color: '#0ea5e9', icon: '⊕' },
        { label: 'O₂ Saturation',value: '98%',     color: '#06d6a0', icon: '◎' },
        { label: 'Temperature',  value: '36.6°C',  color: '#fbbf24', icon: '◈' },
    ];
    return (
        <div style={{
            background: 'rgba(8,15,40,0.92)',
            border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 0 60px rgba(14,165,233,0.15), 0 25px 80px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)',
            maxWidth: 380,
            width: '100%',
        }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.25rem' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#0ea5e9,#06d6a0)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Activity size={16} color="white" />
                </div>
                <div>
                    <p style={{ fontWeight:700, fontSize:'0.9rem', color:'#f0f6ff' }}>Patient Monitor</p>
                    <p style={{ fontSize:'0.72rem', color:'#06d6a0' }}>● Live Data</p>
                </div>
                <div style={{ marginLeft:'auto', fontSize:'0.75rem', color:'#8ba8d4' }}>Jean Murenzi</div>
            </div>

            {/* ECG line */}
            <div style={{ marginBottom:'1.25rem', padding:'0.75rem', background:'rgba(14,165,233,0.06)', borderRadius:'0.75rem', border:'1px solid rgba(14,165,233,0.15)' }}>
                <HeartbeatLine color="#0ea5e9" style={{ width:'100%', height:50 }} />
            </div>

            {/* Vitals grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                {vitals.map((v) => (
                    <div key={v.label} style={{ background:`rgba(${v.color === '#ec4899' ? '236,72,153' : v.color === '#0ea5e9' ? '14,165,233' : v.color === '#06d6a0' ? '6,214,160' : '251,191,36'},0.08)`, border:`1px solid ${v.color}33`, borderRadius:'0.625rem', padding:'0.75rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                            <span style={{ color:v.color, fontSize:'1rem' }}>{v.icon}</span>
                            <span style={{ fontSize:'0.7rem', color:'#8ba8d4' }}>{v.label}</span>
                        </div>
                        <p style={{ fontWeight:800, fontSize:'1.1rem', color:v.color }}>{v.value}</p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ marginTop:'1rem', paddingTop:'0.875rem', borderTop:'1px solid rgba(14,165,233,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.75rem', color:'#8ba8d4' }}>Next follow-up in</span>
                <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#0ea5e9' }}>2 days</span>
            </div>
        </div>
    );
}

/* ─── Main Component ────────────────────────────────────── */
export default function LandingPage() {
    return (
        <div style={{ fontFamily: 'Inter, sans-serif', background: 'var(--bg-void)', color: 'var(--text-primary)' }}>
            <style>{`
                @keyframes draw-line { to { stroke-dashoffset: 0; } }
                @keyframes float {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(-12px); }
                }
                @keyframes scan {
                    0%   { transform: translateY(-100%); opacity:0; }
                    10%  { opacity: 0.12; }
                    90%  { opacity: 0.12; }
                    100% { transform: translateY(800%); opacity:0; }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .gradient-text {
                    background: linear-gradient(135deg, #0ea5e9, #06d6a0, #a855f7);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s linear infinite;
                }
                .glow-btn:hover {
                    box-shadow: 0 0 30px rgba(14,165,233,0.6), 0 4px 20px rgba(14,165,233,0.3) !important;
                    transform: translateY(-2px) !important;
                }
                .feature-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(14,165,233,0.4) !important;
                }
                .nav-link:hover { color: #0ea5e9 !important; }
            `}</style>

            {/* ── HEADER ── */}
            <header style={{
                background: 'rgba(5,8,16,0.85)',
                borderBottom: '1px solid rgba(14,165,233,0.15)',
                position: 'sticky', top: 0, zIndex: 50,
                backdropFilter: 'blur(20px)',
            }}>
                <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem', display:'flex', alignItems:'center', height:68 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                        <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#0ea5e9,#06d6a0)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px rgba(14,165,233,0.5)' }}>
                            <Heart size={18} color="white" />
                        </div>
                        <span style={{ fontWeight:800, fontSize:'1.15rem', color:'#f0f6ff', letterSpacing:'0.02em' }}>DPFCSS</span>
                        <span style={{ fontSize:'0.65rem', fontWeight:600, background:'rgba(14,165,233,0.15)', border:'1px solid rgba(14,165,233,0.3)', color:'#0ea5e9', padding:'2px 8px', borderRadius:999, marginLeft:4 }}>HEALTH-TECH</span>
                    </div>
                    <nav style={{ display:'flex', gap:'1.5rem', alignItems:'center' }}>
                        <a href="#features" className="nav-link" style={{ color:'#8ba8d4', textDecoration:'none', fontSize:'0.88rem', fontWeight:500, transition:'color 0.2s' }}>Features</a>
                        <a href="#about"    className="nav-link" style={{ color:'#8ba8d4', textDecoration:'none', fontSize:'0.88rem', fontWeight:500, transition:'color 0.2s' }}>About</a>
                        <Link to="/login"    className="nav-link" style={{ color:'#0ea5e9',  textDecoration:'none', fontSize:'0.88rem', fontWeight:600, transition:'color 0.2s' }}>Sign In</Link>
                        <Link to="/register" className="btn-primary glow-btn" style={{ fontSize:'0.85rem', padding:'0.5rem 1.3rem', transition:'all 0.3s' }}>Get Started</Link>
                    </nav>
                </div>
            </header>

            {/* ── HERO ── */}
            <section style={{ position:'relative', padding:'6rem 1.5rem 5rem', overflow:'hidden', minHeight:'90vh', display:'flex', alignItems:'center' }}>

                {/* Background image */}
                <div style={{ position:'absolute', inset:0, backgroundImage:'url(/hero-bg.png)', backgroundSize:'cover', backgroundPosition:'center', opacity:0.35 }} />

                {/* Gradient overlay */}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(5,8,16,0.85) 0%, rgba(5,15,40,0.7) 50%, rgba(5,8,16,0.9) 100%)' }} />

                {/* Scan line */}
                <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
                    <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)', animation:'scan 6s ease-in-out infinite' }} />
                </div>

                {/* Particles */}
                <Particle x={10} y={20} size={120} color="rgba(14,165,233,0.3)"  delay={0} />
                <Particle x={80} y={10} size={80}  color="rgba(168,85,247,0.25)" delay={1} />
                <Particle x={90} y={70} size={150} color="rgba(6,214,160,0.2)"   delay={2} />
                <Particle x={5}  y={75} size={60}  color="rgba(34,211,238,0.2)"  delay={0.5} />

                {/* Grid pattern */}
                <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)', backgroundSize:'50px 50px', pointerEvents:'none' }} />

                <div style={{ maxWidth:1100, margin:'0 auto', width:'100%', position:'relative', zIndex:2, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>

                    {/* Left text */}
                    <div>
                        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(6,214,160,0.1)', border:'1px solid rgba(6,214,160,0.3)', color:'#06d6a0', padding:'0.35rem 1rem', borderRadius:999, fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'1.5rem' }}>
                                <CheckCircle size={12} /> Built for Rwanda's Healthcare System
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.7 }}
                            style={{ fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1.5rem', color:'#f0f6ff' }}
                        >
                            Digital Patient<br />
                            <span className="gradient-text">Follow-Up &amp;</span><br />
                            Care Support
                        </motion.h1>

                        <motion.p
                            initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.6 }}
                            style={{ fontSize:'1.05rem', color:'#8ba8d4', maxWidth:500, lineHeight:1.8, marginBottom:'2.5rem' }}
                        >
                            Connecting patients with healthcare providers for better follow-up care,
                            medication adherence, and health education — designed for low-bandwidth environments in Rwanda.
                        </motion.p>

                        <motion.div
                            initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.6 }}
                            style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'2.5rem' }}
                        >
                            <Link to="/register" className="btn-primary glow-btn" style={{ fontSize:'1rem', padding:'0.85rem 2rem', transition:'all 0.3s' }}>
                                Start for Free <ArrowRight size={18} />
                            </Link>
                            <Link to="/login" className="btn-secondary" style={{ fontSize:'1rem', padding:'0.85rem 2rem' }}>
                                Sign In to Dashboard
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
                            style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}
                        >
                            {[
                                { icon: Shield, text: 'HIPAA Compliant' },
                                { icon: Lock,   text: 'End-to-End Encrypted' },
                                { icon: Zap,    text: '99.9% Uptime' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.78rem', color:'#4a6285' }}>
                                    <Icon size={13} color="#0ea5e9" /> {text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Dashboard preview */}
                    <motion.div
                        initial={{ opacity:0, x:40, scale:0.95 }} animate={{ opacity:1, x:0, scale:1 }} transition={{ delay:0.4, duration:0.8 }}
                        className="floating"
                        style={{ display:'flex', justifyContent:'center' }}
                    >
                        <DashboardPreview />
                    </motion.div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section style={{ background:'rgba(8,13,26,0.9)', borderTop:'1px solid rgba(14,165,233,0.1)', borderBottom:'1px solid rgba(14,165,233,0.1)', padding:'2.5rem 1.5rem' }}>
                <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1rem' }}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay: i*0.1 }}
                            style={{ textAlign:'center', padding:'1.5rem', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'1rem', backdropFilter:'blur(16px)' }}
                        >
                            <p style={{ fontSize:'2.2rem', fontWeight:900, color:s.accent, lineHeight:1, marginBottom:'0.35rem', filter:`drop-shadow(0 0 10px ${s.accent}60)` }}>{s.value}</p>
                            <p style={{ fontSize:'0.8rem', color:'#8ba8d4', fontWeight:500 }}>{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" style={{ padding:'6rem 1.5rem', background:'var(--bg-void)' }}>
                <div style={{ maxWidth:1100, margin:'0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:'3.5rem' }}>
                        <span style={{ display:'inline-block', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#0ea5e9', marginBottom:'0.75rem' }}>Platform Features</span>
                        <h2 className="section-title" style={{ marginBottom:'0.75rem' }}>Everything You Need<br /><span className="gradient-text">for Better Care</span></h2>
                        <p className="section-sub" style={{ maxWidth:580, margin:'0 auto' }}>A complete digital health platform for patients, providers, and administrators — built for real clinical workflows.</p>
                    </motion.div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.25rem' }}>
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.08 }}
                                className="feature-card"
                                style={{
                                    background:'var(--bg-card)', border:'1px solid var(--border)',
                                    borderRadius:'1.25rem', padding:'1.75rem',
                                    backdropFilter:'blur(16px)', transition:'all 0.3s',
                                    cursor:'default',
                                }}
                            >
                                <div style={{ width:50, height:50, borderRadius:14, background:`${f.accent}18`, border:`1px solid ${f.accent}33`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem' }}>
                                    <f.icon size={22} color={f.accent} />
                                </div>
                                <h3 style={{ fontWeight:700, marginBottom:'0.5rem', color:'var(--text-primary)', fontSize:'1rem' }}>{f.title}</h3>
                                <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem', lineHeight:1.65 }}>{f.desc}</p>
                                <div style={{ marginTop:'1.25rem', height:2, background:`linear-gradient(90deg, ${f.accent}60, transparent)`, borderRadius:2 }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ROLES ── */}
            <section id="about" style={{ padding:'6rem 1.5rem', background:'rgba(7,12,28,0.95)' }}>
                <div style={{ maxWidth:1100, margin:'0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:'3.5rem' }}>
                        <span style={{ display:'inline-block', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#06d6a0', marginBottom:'0.75rem' }}>Access Roles</span>
                        <h2 className="section-title">Built for <span className="gradient-text">Every Role</span></h2>
                    </motion.div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.5rem' }}>
                        {roles.map((r, i) => (
                            <motion.div
                                key={r.role}
                                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.12 }}
                                style={{ background:'var(--bg-card)', border:`1px solid ${r.accent}30`, borderRadius:'1.25rem', padding:'2rem', backdropFilter:'blur(16px)', position:'relative', overflow:'hidden' }}
                            >
                                {/* Glow corner */}
                                <div style={{ position:'absolute', top:-30, right:-30, width:100, height:100, background:r.accent, borderRadius:'50%', opacity:0.06, filter:'blur(20px)' }} />
                                <h3 style={{ fontWeight:800, color:r.accent, marginBottom:'1.25rem', fontSize:'1.1rem' }}>{r.role}</h3>
                                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                                    {r.items.map((item) => (
                                        <li key={item} style={{ display:'flex', alignItems:'center', gap:'0.6rem', color:'var(--text-secondary)', fontSize:'0.9rem' }}>
                                            <CheckCircle size={14} color={r.accent} style={{ flexShrink:0 }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding:'6rem 1.5rem', position:'relative', overflow:'hidden', textAlign:'center' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(168,85,247,0.06) 50%, rgba(6,214,160,0.06) 100%)' }} />
                <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 50% 50%, rgba(14,165,233,0.1) 0%, transparent 60%)' }} />
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)' }} />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)' }} />
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ position:'relative', zIndex:2 }}>
                    <span style={{ display:'inline-block', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#a855f7', marginBottom:'1rem' }}>Ready to start?</span>
                    <h2 style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900, color:'var(--text-primary)', marginBottom:'1rem' }}>
                        Improve Patient Care<br /><span className="gradient-text">Starting Today</span>
                    </h2>
                    <p style={{ color:'var(--text-secondary)', marginBottom:'2.5rem', fontSize:'1rem', maxWidth:500, margin:'0 auto 2.5rem' }}>
                        Join thousands of healthcare providers using DPFCSS across Rwanda.
                    </p>
                    <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                        <Link to="/register" className="btn-primary glow-btn" style={{ fontSize:'1rem', padding:'0.9rem 2.5rem', transition:'all 0.3s' }}>
                            Create Free Account <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn-secondary" style={{ fontSize:'1rem', padding:'0.9rem 2.5rem' }}>
                            Sign In
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background:'rgba(3,5,12,0.97)', borderTop:'1px solid rgba(14,165,233,0.12)', padding:'2.5rem 1.5rem', textAlign:'center' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:'0.75rem' }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#0ea5e9,#06d6a0)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Heart size={15} color="white" />
                    </div>
                    <span style={{ fontWeight:800, color:'var(--text-primary)', fontSize:'1rem' }}>DPFCSS</span>
                </div>
                <p style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>© 2026 Digital Patient Follow-Up &amp; Care Support System. Built for Rwanda.</p>
            </footer>
        </div>
    );
}
