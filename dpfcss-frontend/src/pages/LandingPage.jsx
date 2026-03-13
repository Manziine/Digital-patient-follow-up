import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Shield, Bell, MessageCircle, ArrowRight, CheckCircle, Globe } from 'lucide-react';

const features = [
    { icon: Bell, title: 'Smart Reminders', desc: 'Automated appointment and medication reminders tailored for patients.', color: 'bg-blue-50 text-blue-600' },
    { icon: MessageCircle, title: 'Direct Messaging', desc: 'Secure, real-time communication between patients and healthcare providers.', color: 'bg-teal-50 text-teal-600' },
    { icon: Shield, title: 'Secure & Private', desc: 'Patient data encrypted and protected under healthcare privacy standards.', color: 'bg-purple-50 text-purple-600' },
    { icon: Globe, title: 'Low-Bandwidth Ready', desc: 'Optimized for use in areas with limited internet connectivity.', color: 'bg-green-50 text-green-600' },
];

const stats = [
    { label: 'Patients Monitored', value: '10,000+' },
    { label: 'Healthcare Providers', value: '500+' },
    { label: 'Follow-ups Completed', value: '95%' },
    { label: 'Districts Covered', value: '30' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function LandingPage() {
    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid #e2e8f4', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 64 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2074e8, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={18} color="white" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a2540' }}>DPFCSS</span>
                    </div>
                    <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <a href="#features" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Features</a>
                        <a href="#about" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>About</a>
                        <Link to="/login" style={{ color: '#2074e8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Sign In</Link>
                        <Link to="/register" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>Get Started</Link>
                    </nav>
                </div>
            </header>

            {/* Hero section */}
            <section style={{ background: 'linear-gradient(160deg, #eff8ff 0%, #f0fdfa 50%, #f8faff 100%)', padding: '5rem 1.5rem 4rem' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <span className="badge badge-blue" style={{ marginBottom: '1.5rem', display: 'inline-flex', gap: 6, padding: '0.35rem 1rem' }}>
                            <CheckCircle size={13} /> Built for Rwanda's Healthcare System
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#1a2540', lineHeight: 1.15, marginBottom: '1.25rem' }}
                    >
                        Digital Patient Follow-Up<br />
                        <span style={{ background: 'linear-gradient(135deg, #2074e8, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            & Care Support System
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                        style={{ fontSize: '1.1rem', color: '#475569', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.75 }}
                    >
                        Connecting patients with healthcare providers for better follow-up care,
                        medication adherence, and health education — designed for low-bandwidth environments.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem', borderRadius: '0.75rem' }}>
                            Start for Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.8rem 2rem', borderRadius: '0.75rem' }}>
                            Sign In to Dashboard
                        </Link>
                    </motion.div>
                </div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
                    style={{ maxWidth: 900, margin: '3.5rem auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}
                >
                    {stats.map((s) => (
                        <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2074e8', lineHeight: 1 }}>{s.value}</p>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Features */}
            <section id="features" style={{ padding: '5rem 1.5rem', background: 'white' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a2540', marginBottom: '0.75rem' }}>
                            Everything You Need for Better Care
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>A complete digital health platform for patients, providers, and administrators.</p>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        {features.map((f, i) => (
                            <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card" style={{ borderRadius: '1rem' }}>
                                <div className={`stat-icon ${f.color}`} style={{ width: 48, height: 48, borderRadius: 12, marginBottom: '1rem' }}>
                                    <f.icon size={22} />
                                </div>
                                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1a2540' }}>{f.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roles section */}
            <section id="about" style={{ padding: '5rem 1.5rem', background: '#f8faff' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a2540', marginBottom: '0.75rem' }}>Built for Every Role</h2>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { role: 'Patients', color: '#14b8a6', bg: '#f0fdfa', items: ['View upcoming appointments', 'Track medication adherence', 'Receive health education', 'Chat with your provider'] },
                            { role: 'Healthcare Providers', color: '#2074e8', bg: '#eff8ff', items: ['Manage patient follow-ups', 'Schedule appointments', 'Monitor adherence', 'Send health reminders'] },
                            { role: 'Administrators', color: '#7c3aed', bg: '#f5f3ff', items: ['Manage all users', 'View system analytics', 'Publish health content', 'Monitor platform activity'] },
                        ].map((r, i) => (
                            <motion.div key={r.role} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                                style={{ background: r.bg, borderRadius: '1rem', padding: '2rem', border: `1px solid ${r.color}22` }}>
                                <h3 style={{ fontWeight: 700, color: r.color, marginBottom: '1rem', fontSize: '1.1rem' }}>
                                    {r.role}
                                </h3>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {r.items.map((item) => (
                                        <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1a2540', fontSize: '0.9rem' }}>
                                            <CheckCircle size={14} color={r.color} style={{ flexShrink: 0 }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #1a4288, #2074e8, #0d9488)', textAlign: 'center' }}>
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
                        Ready to Improve Patient Care?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1rem' }}>
                        Join thousands of healthcare providers using DPFCSS in Rwanda.
                    </p>
                    <Link to="/register" style={{ background: 'white', color: '#2074e8', padding: '0.85rem 2.5rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        Create Free Account <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1a2540', color: '#94a3b8', textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '0.75rem' }}>
                    <Heart size={16} color="#14b8a6" />
                    <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>DPFCSS</span>
                </div>
                <p style={{ fontSize: '0.85rem' }}>© 2026 Digital Patient Follow-Up & Care Support System. Built for Rwanda.</p>
            </footer>
        </div>
    );
}
