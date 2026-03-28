import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SystemPage() {
    return (
        <div style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '1.5rem 3rem', borderBottom: '1px solid rgba(242, 237, 228, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                        <span className="editorial-heading" style={{ fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--color-bg)' }}>DPFCSS.</span>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(242, 237, 228, 0.6)', fontWeight: 600 }}>Architecture of Care</span>
                    </div>
                </Link>
                <Link to="/" className="btn-ghost" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-bg)' }}>Home</Link>
            </header>

            <main style={{ flex: 1, padding: '8rem 3rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(242, 237, 228, 0.2)', paddingBottom: '2rem', marginBottom: '4rem' }}>
                        <h2 className="editorial-heading" style={{ fontSize: '3rem', color: 'var(--color-bg)' }}>How DPFCSS Works.</h2>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, color: 'var(--color-bg)' }}>The operational cadence of continuous care.</p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                        {/* Block 1 */}
                        <div>
                            <h3 className="editorial-heading" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '2rem' }}>Step-by-step for Patients</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                {[
                                    { title: 'Daily Check-ins', text: 'Quick, emoji-based symptom reporting that takes less than 30 seconds to complete daily.' },
                                    { title: 'Medication Logging', text: 'Clear visuals ensuring patients log their precise dosage without confusion.' },
                                    { title: 'Direct Messaging', text: 'Private, secure chat interface linking directly to their assigned medical provider.' }
                                ].map((step, i) => (
                                    <div key={i} style={{ borderLeft: '1px solid rgba(242, 237, 228, 0.3)', paddingLeft: '1.5rem' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-bg)', marginBottom: '0.75rem' }}>{step.title}</h4>
                                        <p style={{ fontSize: '0.95rem', color: 'rgba(242, 237, 228, 0.8)', lineHeight: 1.5 }}>{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Block 2 */}
                        <div>
                            <h3 className="editorial-heading" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '2rem' }}>Features for Doctors</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                {[
                                    { title: 'Patient Rosters', text: 'At-a-glance lists showing stability metrics across the entire assigned patient cohort.' },
                                    { title: 'Red-flag Alerts', text: 'Visual indicators immediately highlighting patients who report critical symptoms or miss doses.' },
                                    { title: 'Appointment Management', text: 'Streamlined scheduling to convert digital triage into in-person visits when necessary.' }
                                ].map((step, i) => (
                                    <div key={i} style={{ borderLeft: '1px solid rgba(242, 237, 228, 0.3)', paddingLeft: '1.5rem' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-bg)', marginBottom: '0.75rem' }}>{step.title}</h4>
                                        <p style={{ fontSize: '0.95rem', color: 'rgba(242, 237, 228, 0.8)', lineHeight: 1.5 }}>{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Block 3 */}
                        <div>
                            <h3 className="editorial-heading" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '2rem' }}>Technology Stack</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                {[
                                    { title: 'Secure Cloud Storage', text: 'Encrypted database protocols ensuring personal health information is permanently protected.' },
                                    { title: 'Real-time Sync', text: 'Instantaneous data transmission between patient submissions and the provider dashboard.' },
                                    { title: 'Asymmetrical Design', text: 'Tailored UX separating the clinical density required by doctors from the simplicity needed by patients.' }
                                ].map((step, i) => (
                                    <div key={i} style={{ borderLeft: '1px solid rgba(242, 237, 228, 0.3)', paddingLeft: '1.5rem' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-bg)', marginBottom: '0.75rem' }}>{step.title}</h4>
                                        <p style={{ fontSize: '0.95rem', color: 'rgba(242, 237, 228, 0.8)', lineHeight: 1.5 }}>{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
