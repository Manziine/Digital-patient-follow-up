import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ─── Main Component ────────────────────────────────────── */
export default function LandingPage() {
    return (
        <div style={{ background: 'var(--color-bg)', color: 'var(--color-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* ── HEADER ── */}
            <header style={{
                borderBottom: '1px solid var(--color-border)',
                padding: '1.5rem 3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--color-bg)'
            }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <span className="editorial-heading" style={{ fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>DPFCSS.</span>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>Architecture of Care</span>
                </div>
                
                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/manifesto" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Manifesto</Link>
                    <Link to="/system" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System</Link>
                    <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sign In</Link>
                </nav>
            </header>

            {/* ── HERO ── */}
            <section className="grid-asymmetric" style={{ padding: '4rem 3rem 8rem', alignItems: 'center' }}>
                <div style={{ paddingRight: '2rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '30px', marginBottom: '2rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                        🇷🇼 Built for Rwanda
                    </div>
                    <h1 className="editorial-heading" style={{ fontSize: 'clamp(3.5rem, 5vw, 5.5rem)', lineHeight: 1.05, marginBottom: '2.5rem' }}>
                        Precision<br />in patient<br />continuity.
                    </h1>
                    <div style={{ paddingLeft: '2rem', borderLeft: '2px solid var(--color-accent)' }}>
                        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', maxWidth: '480px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                            A digital infrastructure replacing generic interactions with highly orchestrated, culturally-aware follow-up care for Rwanda's clinical ecosystem.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/register" className="btn-primary" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Request Access
                            </Link>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '600px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                    <img 
                        src="/hero-image-new.png" 
                        alt="Rwandan healthcare professional and patient interacting" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>
            </section>

            {/* ── CAPABILITIES ── */}
            <section style={{ padding: '0 3rem 6rem' }}>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3rem' }}>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '3rem', color: 'var(--color-accent)' }}>
                        Key Capabilities
                    </p>
                    <div className="grid-asymmetric" style={{ alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {[
                                { title: 'Asymmetric Communication', desc: 'Secure, non-intrusive messaging protocols between patient and provider.' },
                                { title: 'Medical Timelines', desc: 'Chronological health mapping replacing scattered clinical notes.' },
                                { title: 'Prescription Tracking', desc: 'Clear, readable medication adherence logging.' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <h3 className="editorial-heading" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{item.title}</h3>
                                    <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: '550px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                            <img 
                                src="/patient-phone.png" 
                                alt="Patient using the application on their phone" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MANIFESTO (Moved to /manifesto) ── */}

            {/* ── TESTIMONIALS ── */}
            <section style={{ padding: '6rem 3rem', backgroundColor: '#fff' }}>
                <div style={{ marginBottom: '4rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                    <h2 className="editorial-heading" style={{ fontSize: '3rem' }}>Clinical Perspectives.</h2>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, color: 'var(--color-primary)' }}>Voices from the field</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
                    {[
                        {
                            quote: "I would discharge a patient on Friday and have no way of knowing if they took their medication over the weekend. By Monday, some had already been readmitted. It was heartbreaking.",
                            author: "Dr. Uwimana Clarisse",
                            role: "General Practitioner, CHUK Kigali"
                        },
                        {
                            quote: "Following up with patients in rural areas was nearly impossible. They had no transport, no phone credit, and we had no system. This app changes everything for us.",
                            author: "Dr. Nkurunziza Jean Pierre",
                            role: "Cardiologist, King Faisal Hospital"
                        },
                        {
                            quote: "Mental health follow-up in Rwanda carries so much stigma. Patients would rather suffer in silence than be seen walking into a clinic. This platform gives them dignity and privacy.",
                            author: "Dr. Habimana Eric",
                            role: "Psychiatrist, Ndera Neuropsychiatric Hospital"
                        }
                    ].map((t, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            style={{ 
                                padding: '2.5rem', 
                                border: '1px solid var(--color-border)', 
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--color-bg)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%'
                            }}
                        >
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem', color: 'var(--color-primary)' }}>
                                "{t.quote}"
                            </p>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '0.25rem' }}>{t.author}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── SYSTEM (Moved to /system) ── */}

            {/* ── FOOTER ── */}
            <footer style={{ padding: '3rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} DPFCSS. Built for Rwanda's healthcare sector.</p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Privacy Protocol</span>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Terms of Access</span>
                </div>
            </footer>
        </div>
    );
}
