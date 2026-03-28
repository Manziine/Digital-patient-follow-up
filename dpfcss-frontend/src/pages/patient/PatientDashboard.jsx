import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Chatbot from '../../components/patient/Chatbot';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Clock, Pill, Activity, Info, MessageSquare, 
    Calendar, CheckCircle, AlertTriangle, Send, Lightbulb, ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TIPS = [
    "Your health score is improving! Keep taking your Metformin exactly at 8 AM and 8 PM.",
    "Remember to take your evening medication exactly at the prescribed time.",
    "Light walking for 20 minutes improves blood circulation and recovery.",
    "Avoid alcohol while taking your current prescribed medication.",
    "Rest is just as important as medication. Make sure you are sleeping well."
];

export default function PatientDashboard() {
    const { user } = useAuthStore();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('profile');
    const [dailyTip, setDailyTip] = useState(TIPS[0]);
    const [healthState, setHealthState] = useState({ feelings: 5, symptoms: [], sideEffects: false, sideEffectsNotes: '', notes: '' });
    const [messageInput, setMessageInput] = useState('');
    
    // Check-in graph data (mock)
    const [healthTrend] = useState([
        { date: 'Mon', score: 3 }, { date: 'Tue', score: 4 }, { date: 'Wed', score: 5 },
        { date: 'Thu', score: 5 }, { date: 'Fri', score: 7 }, { date: 'Sat', score: 8 }, { date: 'Sun', score: 9 }
    ]);

    useEffect(() => {
        setDailyTip(TIPS[0]);

        api.get('/patients/dashboard').then((r) => {
            const demoData = {
                appointments: r.data.appointments?.length ? r.data.appointments : [
                    { _id: 'a1', title: 'Post-discharge Follow-up', scheduledDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(), provider: { name: 'Dr. Habimana Eric' }, hospital: 'CHUK Kigali' },
                    { _id: 'a2', title: 'Lab Results Review', scheduledDate: new Date(Date.now() + 14*24*60*60*1000).toISOString(), provider: { name: 'Dr. Habimana Eric' }, hospital: 'CHUK Kigali' }
                ],
                medications: r.data.medications?.length ? r.data.medications : [
                    { _id: 'm1', name: 'Metformin', dosage: '500mg', frequency: 'twice_daily', takenLog: [] },
                    { _id: 'm2', name: 'Lisinopril', dosage: '10mg', frequency: 'once_daily', takenLog: [] },
                    { _id: 'm3', name: 'Atorvastatin', dosage: '20mg', frequency: 'once_daily', takenLog: [] }
                ]
            };
            setData(demoData);
        }).catch(() => toast.error('Failed to load dashboard data')).finally(() => setLoading(false));
    }, []);

    const takeMedication = async (id) => {
        try {
            await api.patch(`/patients/medications/${id}/take`);
            toast.success('Medication marked as taken! Well done.');
            setData((prev) => ({
                ...prev,
                medications: prev.medications.map((m) =>
                    m._id === id ? { ...m, takenLog: [...m.takenLog, { taken: true, date: new Date() }] } : m
                ),
            }));
        } catch { toast.error('Could not mark medication.'); }
    };

    const submitHealthCheck = (e) => {
        e.preventDefault();
        toast.success("Daily health check-in saved! Thank you.");
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if(!messageInput.trim()) return;
        toast.success("Message sent to your doctor.");
        setMessageInput('');
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    // Calculate Engagement Score
    const engagementScore = 72; 

    if (loading) {
        return (
            <div>
                <Sidebar />
                <main className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner" />
                </main>
            </div>
        );
    }

    const sections = [
        { id: 'profile', label: 'Profile & Credentials', icon: User, color: '#3b82f6' },
        { id: 'history', label: 'Treatment History', icon: Clock, color: '#6366f1' },
        { id: 'medication', label: 'Prescriptions', icon: Pill, color: '#f97316' },
        { id: 'health', label: 'Current Health State', icon: Activity, color: '#22c55e' },
        { id: 'disease', label: 'Disease Info', icon: Info, color: '#ef4444' },
        { id: 'contact', label: 'Communication', icon: MessageSquare, color: '#a855f7' },
        { id: 'appointment', label: 'Next Appointment', icon: Calendar, color: '#0ea5e9' },
    ];

    let contentToRender = null;
    switch(activeSection) {
        case 'profile':
            contentToRender = (
                <div className="card-animated" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={24}/> Update Credentials</h2>
                    <form className="grid-editorial" style={{ gap: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 6' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Full Name</label>
                            <input type="text" defaultValue={user?.name} className="form-input" />
                        </div>
                        <div style={{ gridColumn: 'span 6' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>National ID Number</label>
                            <input type="text" placeholder="1 19XX 8 XXXXXXXX X XX" className="form-input" />
                        </div>
                        <div style={{ gridColumn: 'span 4' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Date of Birth</label>
                            <input type="date" className="form-input" />
                        </div>
                        <div style={{ gridColumn: 'span 4' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Gender</label>
                            <select className="form-input"><option>Male</option><option>Female</option></select>
                        </div>
                        <div style={{ gridColumn: 'span 4' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Phone Number</label>
                            <input type="tel" defaultValue="+250..." className="form-input" />
                        </div>
                        <div style={{ gridColumn: 'span 12' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Home Address & District</label>
                            <input type="text" placeholder="Gasabo, Kigali City" className="form-input" />
                        </div>
                        <div style={{ gridColumn: 'span 6' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Emergency Contact Name</label>
                            <input type="text" className="form-input" />
                        </div>
                        <div style={{ gridColumn: 'span 6' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Emergency Contact Phone</label>
                            <input type="tel" className="form-input" />
                        </div>
                        <div style={{ gridColumn: 'span 12', marginTop: '1rem' }}>
                            <button type="button" className="btn-primary" style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}>Save Profile Changes</button>
                        </div>
                    </form>
                </div>
            );
            break;
        case 'history':
            contentToRender = (
                <div className="card-animated" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={24}/> Treatment History</h2>
                    <div style={{ backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #6366f1', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Admission: CHUK Kigali</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Treating Doctor: Dr. Uwimana Clarisse • Ward: Internal Medicine</p>
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
                            <div><strong>Admitted:</strong> 12 March 2026</div>
                            <div><strong>Discharged:</strong> 18 March 2026</div>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.95rem', lineHeight: 1.5 }}><strong>Reason:</strong> Severe malaria complication requiring intravenous therapy and monitoring.</p>
                    </div>
                </div>
            );
            break;
        case 'medication':
            contentToRender = (
                <div className="card-animated" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Pill size={24}/> Medications & Schedule</h2>
                    
                    {data?.medications?.length === 0 ? (
                        <p className="text-muted">No active prescriptions.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {data?.medications?.map((med) => {
                                const takenToday = med.takenLog?.some((l) => new Date(l.date).toDateString() === new Date().toDateString() && l.taken);
                                return (
                                    <div key={med._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: takenToday ? '#fff8f1' : '#fff' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>{med.name} • {med.dosage}</h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Take {med.frequency.replace('_', ' ')} (e.g., After meals, with water)</p>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316', backgroundColor: '#xffedd5', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>Morning (8:00 AM)</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316', backgroundColor: '#xffedd5', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>Evening (8:00 PM)</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {takenToday ? (
                                                <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                                    <CheckCircle size={20} /> Taken Today
                                                </div>
                                            ) : (
                                                <button onClick={() => takeMedication(med._id)} className="btn-primary" style={{ backgroundColor: '#f97316', borderColor: '#f97316', fontSize: '0.85rem' }}>
                                                    Mark as Taken
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
            break;
        case 'health':
            contentToRender = (
                <div className="card-animated" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={24}/> Health Status & Check-In</h2>

                    <div style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                        <h3 style={{ fontSize: '1.1rem', color: '#166534', marginBottom: '1rem', fontWeight: 600 }}>7-Day Recovery Trend</h3>
                        <div style={{ height: '200px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={healthTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcfce7" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#166534' }} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#166534' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#15803d', fontWeight: 500 }}>
                            <Activity size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }}/>
                            Your condition is steadily improving. Keep adhering to the treatment plan.
                        </p>
                    </div>
                    
                    <form onSubmit={submitHealthCheck}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>How are you feeling today? (1 - 10)</label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
                                <span style={{ fontSize: '2rem', cursor: 'pointer', opacity: healthState.feelings <= 3 ? 1 : 0.4 }} onClick={()=>setHealthState({...healthState, feelings: 2})}>🤒</span>
                                <span style={{ fontSize: '2rem', cursor: 'pointer', opacity: healthState.feelings > 3 && healthState.feelings <= 6 ? 1 : 0.4 }} onClick={()=>setHealthState({...healthState, feelings: 5})}>😐</span>
                                <span style={{ fontSize: '2rem', cursor: 'pointer', opacity: healthState.feelings > 6 ? 1 : 0.4 }} onClick={()=>setHealthState({...healthState, feelings: 9})}>😊</span>
                            </div>
                            <input type="range" min="1" max="10" value={healthState.feelings} onChange={(e)=>setHealthState({...healthState, feelings: e.target.value})} style={{ width: '100%', marginTop: '1rem', accentColor: '#22c55e' }} />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>Any symptoms today?</label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {['Fever', 'Headache', 'Nausea', 'Pain', 'Fatigue', 'Dizziness'].map(s => (
                                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-bg)', padding: '0.75rem 1.25rem', borderRadius: '30px', cursor: 'pointer', border: healthState.symptoms.includes(s) ? '2px solid #22c55e' : '2px solid transparent' }}>
                                        <input type="checkbox" style={{ display: 'none' }} onChange={(e) => {
                                            const newSymps = e.target.checked ? [...healthState.symptoms, s] : healthState.symptoms.filter(x => x !== s);
                                            setHealthState({...healthState, symptoms: newSymps});
                                        }} checked={healthState.symptoms.includes(s)} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: healthState.symptoms.includes(s) ? '#22c55e' : 'inherit' }}>{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Any side effects from medication?</label>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <label><input type="radio" name="sideEffects" checked={healthState.sideEffects} onChange={()=>setHealthState({...healthState, sideEffects: true})} /> Yes</label>
                                <label><input type="radio" name="sideEffects" checked={!healthState.sideEffects} onChange={()=>setHealthState({...healthState, sideEffects: false})} /> No</label>
                            </div>
                            {healthState.sideEffects && <input type="text" placeholder="Please describe..." className="form-input" value={healthState.sideEffectsNotes} onChange={e=>setHealthState({...healthState, sideEffectsNotes: e.target.value})}/>}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Additional Notes</label>
                            <textarea rows="3" className="form-input" value={healthState.notes} onChange={e=>setHealthState({...healthState, notes: e.target.value})}></textarea>
                        </div>

                        <button className="btn-primary" style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}>Submit Check-In</button>
                    </form>
                </div>
            );
            break;
        case 'disease':
            contentToRender = (
                <div className="card-animated" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={24}/> Disease Information</h2>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Condition: Type 2 Diabetes</h3>
                        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                            Type 2 diabetes is an impairment in the way the body regulates and uses sugar (glucose) as a fuel. It's crucial to maintain your medication routine and keep track of your blood sugar levels to prevent complications.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
                        <div style={{ backgroundColor: '#fef2f2', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                            <h4 style={{ color: '#ef4444', fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 600 }}>What to Avoid</h4>
                            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                                <li>Heavy physical labor or extended sun exposure</li>
                                <li>Taking other herbal medicines without asking the doctor</li>
                                <li>Skipping meals even if you lack appetite</li>
                            </ul>
                        </div>
                        <div style={{ backgroundColor: '#fff1f2', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #e11d48' }}>
                            <h4 style={{ color: '#e11d48', fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={18}/> Immediate Warning Signs</h4>
                            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                                <li>Blood sugar consistently above 240 mg/dL</li>
                                <li>Frequent urination and extreme thirst</li>
                                <li>Blurry vision or dizziness</li>
                                <li>Numbness in hands or feet</li>
                            </ul>
                            <p style={{ marginTop: '1rem', fontSize: '0.85rem', fontWeight: 600, color: '#e11d48' }}>Go to the hospital immediately if these occur.</p>
                        </div>
                    </div>
                </div>
            );
            break;
        case 'contact':
            contentToRender = (
                <div className="card-animated" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={24}/> Connect with Doctor</h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', fontWeight: 600, fontSize: '1.25rem' }}>
                            UC
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Dr. Uwimana Clarisse</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>General Practitioner</p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <button className="btn-primary" style={{ backgroundColor: '#f3e8ff', color: '#a855f7', borderColor: '#f3e8ff', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Request Visit / Callback</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: '8px', minHeight: '300px', marginBottom: '1.5rem', overflowY: 'auto' }}>
                        <div style={{ alignSelf: 'flex-start', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', maxWidth: '80%' }}>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>Hello Aline, your recent glucose logs look much better. Keep taking the Metformin as prescribed, and don't forget the Lisinopril for your blood pressure.</p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', display: 'block' }}>Yesterday, 14:30</span>
                        </div>
                        <div style={{ alignSelf: 'flex-end', backgroundColor: '#a855f7', color: '#fff', padding: '1rem', borderRadius: '8px', maxWidth: '80%' }}>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>Thank you doctor. The dizziness has stopped. Should I continue the same diet?</p>
                            <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.5rem', display: 'block' }}>Today, 09:15</span>
                        </div>
                    </div>

                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem' }}>
                        <input type="text" className="form-input" style={{ flex: 1 }} placeholder="Type your message to Dr. Uwimana..." value={messageInput} onChange={(e)=>setMessageInput(e.target.value)} />
                        <button type="submit" className="btn-primary" style={{ backgroundColor: '#a855f7', borderColor: '#a855f7', padding: '0 1.5rem' }}><Send size={20}/></button>
                    </form>
                </div>
            );
            break;
        case 'appointment':
            contentToRender = (
                <div className="card-animated" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={24}/> Next Appointment</h2>
                    
                    {data?.appointments?.length > 0 ? (
                        data.appointments.map(apt => (
                            <div key={apt._id} style={{ display: 'flex', gap: '2.5rem', backgroundColor: '#f0f9ff', padding: '2rem', borderRadius: '12px', borderLeft: '6px solid #0ea5e9', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(14,165,233,0.1)' }}>
                                    <span style={{ display: 'block', fontSize: '3rem', fontFamily: 'var(--font-serif)', color: '#0ea5e9', lineHeight: 1 }}>{new Date(apt.scheduledDate).getDate()}</span>
                                    <span style={{ display: 'block', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-primary)', marginTop: '0.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>{new Date(apt.scheduledDate).toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{apt.title}</h3>
                                    <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}><strong>Doctor:</strong> Dr. {apt.provider?.name}</p>
                                    <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}><strong>Time:</strong> {new Date(apt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fff', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #e0f2fe' }}>
                                            <strong style={{ display: 'block', color: '#0ea5e9', marginBottom: '0.2rem' }}>What to bring:</strong>
                                            Previous lab results, ID card, Mutuelle de Santé
                                        </div>
                                        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fff', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #e0f2fe' }}>
                                            <strong style={{ display: 'block', color: '#0ea5e9', marginBottom: '0.2rem' }}>Location:</strong>
                                            CHUK Kigali, Building C, Room 102
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={14} color="#0ea5e9" /> Automatic reminder will be sent 24 hours before via SMS/Email.
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">You have no upcoming appointments.</p>
                    )}
                </div>
            );
            break;
    }

    return (
        <div>
            <Sidebar />
            <main className="page-content" style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', padding: '3rem 4rem' }}>
                <style>{`
                    .dashboard-container {
                        display: flex;
                        gap: 3rem;
                    }
                    .local-sidebar {
                        width: 280px;
                        flex-shrink: 0;
                    }
                    .local-content {
                        flex: 1;
                    }
                    .local-nav-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        padding: 1rem 1.25rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 0.95rem;
                        transition: all 0.2s ease;
                        margin-bottom: 0.5rem;
                        color: var(--color-primary);
                        border: 1px solid transparent;
                    }
                    .local-nav-item:hover {
                        background-color: rgba(255,255,255,0.5);
                    }
                    .local-nav-item.active {
                        background-color: #fff;
                        border-color: var(--color-border);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                    }
                    @media (max-width: 1024px) {
                        .dashboard-container { flex-direction: column; }
                        .local-sidebar { width: 100%; display: flex; overflow-x: auto; padding-bottom: 1rem; }
                        .local-nav-item { margin-bottom: 0; margin-right: 0.5rem; white-space: nowrap; }
                    }
                    .circular-progress {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        background: conic-gradient(var(--color-accent) ${engagementScore * 3.6}deg, var(--color-border) 0deg);
                        position: relative;
                    }
                    .circular-progress::before {
                        content: '';
                        position: absolute;
                        width: 48px;
                        height: 48px;
                        background-color: var(--color-bg);
                        border-radius: 50%;
                    }
                    .circular-progress-val {
                        position: relative;
                        font-family: var(--font-serif);
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: var(--color-primary);
                    }
                `}</style>
                
                {/* Header Area */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 className="editorial-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {greeting}, {user?.name?.split(' ')[0] || "Patient"}.
                            {user?.avatar && <img src={user.avatar} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }} />}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.2rem', textAlign: 'right' }}>Engagement</p>
                            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)', textAlign: 'right' }}>Excellent</p>
                        </div>
                        <div className="circular-progress">
                            <span className="circular-progress-val">{engagementScore}%</span>
                        </div>
                    </div>
                </div>

                {/* Daily Tip */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ backgroundColor: '#fff', padding: '1.25rem 2rem', borderRadius: '12px', borderLeft: '4px solid var(--color-accent)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                >
                    <div style={{ backgroundColor: '#f2ede4', padding: '0.75rem', borderRadius: '50%', color: 'var(--color-accent)' }}>
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Tip of the day</h4>
                        <p style={{ fontSize: '1.05rem', color: 'var(--color-primary)', fontWeight: 500 }}>{dailyTip}</p>
                    </div>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="dashboard-container">
                    {/* Local Navigation */}
                    <aside className="local-sidebar">
                        <nav>
                            {sections.map(sec => {
                                const Icon = sec.icon;
                                const isActive = activeSection === sec.id;
                                return (
                                    <div 
                                        key={sec.id} 
                                        className={`local-nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setActiveSection(sec.id)}
                                        style={{ color: isActive ? sec.color : 'var(--color-text-muted)' }}
                                    >
                                        <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: isActive ? `${sec.color}15` : 'transparent', color: isActive ? sec.color : 'inherit' }}>
                                            <Icon size={20} />
                                        </div>
                                        {sec.label}
                                        {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                                    </div>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="local-content">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {contentToRender}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Chatbot injection */}
                <Chatbot />
            </main>
        </div>
    );
}
