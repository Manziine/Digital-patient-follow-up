import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ManifestoPage() {
    return (
        <div style={{ background: 'var(--color-bg)', color: 'var(--color-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '1.5rem 3rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                        <span className="editorial-heading" style={{ fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>DPFCSS.</span>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>Architecture of Care</span>
                    </div>
                </Link>
                <Link to="/" className="btn-ghost" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Home</Link>
            </header>
            
            <main style={{ flex: 1, padding: '6rem 3rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid-asymmetric">
                    <div style={{ paddingRight: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-accent)' }}>
                            Our Promise to Rwanda
                        </p>
                        <h2 className="editorial-heading" style={{ fontSize: '3.5rem', marginBottom: '2.5rem', lineHeight: 1.1 }}>Building a clinical infrastructure that understands our context.</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>The Problem</h3>
                                <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                                    Across Rwanda, thousands of patients are lost to follow-up post-discharge simply due to the geographic distance from their primary care facilities and the prohibitive transportation costs. Early warning signs turn into emergencies in silence.
                                </p>
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '0.75rem' }}>The Stigma</h3>
                                <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                                    For patients dealing with mental health conditions or infectious chronic diseases, the social stigma of frequent hospital visits is a barrier to care. They overwhelmingly prefer, and need, secure, private, asynchronous communication.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Our Values</h3>
                            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>The principles guiding the Architecture of Care.</p>
                        </div>
                        
                        <div className="grid-editorial" style={{ gap: '1.5rem' }}>
                            {[
                                { title: 'Accessible Excellence', desc: 'World-class continuous care should not be a premium service.' },
                                { title: 'Clinical Precision', desc: 'Removing guesswork from patient tracking and prescriptive adherence.' },
                                { title: 'Cultural Empathy', desc: 'Software built with a profound understanding of the Rwandan social fabric.' },
                                { title: 'Data Sovereignty', desc: 'Uncompromising privacy and security protocols protecting patient records.' }
                            ].map(val =>(
                                <div key={val.title} style={{ gridColumn: 'span 6', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>{val.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
