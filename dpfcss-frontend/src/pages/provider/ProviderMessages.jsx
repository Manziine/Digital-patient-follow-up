import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Search, User } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProviderMessages() {
    const { user } = useAuthStore();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const bottomRef = useRef(null);
    const pollRef = useRef(null);

    useEffect(() => {
        api.get('/providers/patients')
            .then(r => setPatients(r.data))
            .catch(() => toast.error('Could not load patients'));
    }, []);

    const loadMessages = async (patientId, silent = false) => {
        if (!silent) setLoadingMsgs(true);
        try {
            const { data } = await api.get(`/messages/${patientId}`);
            setMessages(data);
        } catch {
            if (!silent) toast.error('Could not load messages');
        } finally {
            setLoadingMsgs(false);
        }
    };

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setMessages([]);
        clearInterval(pollRef.current);
        loadMessages(patient._id);
        pollRef.current = setInterval(() => loadMessages(patient._id, true), 5000);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => () => clearInterval(pollRef.current), []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPatient) return;
        setSending(true);
        try {
            await api.post(`/messages/${selectedPatient._id}`, { content: newMessage.trim() });
            setNewMessage('');
            await loadMessages(selectedPatient._id, true);
        } catch {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const filtered = patients.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.includes(search)
    );

    const formatTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div>
            <Sidebar />
            <main className="page-content" style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f4', background: '#fff' }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a2540', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageSquare size={22} color="#2074e8" /> Patient Messages
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                        Message your assigned patients directly
                    </p>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Patient list */}
                    <div style={{ width: 280, borderRight: '1px solid #e2e8f4', display: 'flex', flexDirection: 'column', background: '#f8faff', flexShrink: 0 }}>
                        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #e2e8f4' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={15} style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search patients..."
                                    style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', border: '1px solid #e2e8f4', borderRadius: 8, fontSize: '0.85rem', background: '#fff', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {filtered.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                    No patients found
                                </div>
                            )}
                            {filtered.map(patient => (
                                <div
                                    key={patient._id}
                                    onClick={() => selectPatient(patient)}
                                    style={{
                                        padding: '0.875rem 1rem',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #e9eef6',
                                        background: selectedPatient?._id === patient._id ? '#eff8ff' : 'transparent',
                                        borderLeft: selectedPatient?._id === patient._id ? '3px solid #2074e8' : '3px solid transparent',
                                        transition: 'all 0.15s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                    }}
                                >
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #dbeefe, #a5f3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0369a1', fontSize: '0.9rem', flexShrink: 0 }}>
                                        {patient.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a2540', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{patient.phone || patient.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>
                        {!selectedPatient ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <MessageSquare size={48} strokeWidth={1.2} color="#cbd5e1" />
                                <p style={{ marginTop: '1rem', fontWeight: 600, color: '#64748b' }}>Select a patient to start messaging</p>
                                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Choose from your patient list on the left</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat header */}
                                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f4', display: 'flex', alignItems: 'center', gap: '0.875rem', background: '#fafbff' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #dbeefe, #a5f3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0369a1' }}>
                                        {selectedPatient.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a2540' }}>{selectedPatient.name}</p>
                                        <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Patient • {selectedPatient.phone || selectedPatient.email}</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {loadingMsgs && (
                                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', fontSize: '0.85rem' }}>Loading messages...</div>
                                    )}
                                    {!loadingMsgs && messages.length === 0 && (
                                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                            <User size={36} strokeWidth={1.2} color="#cbd5e1" style={{ marginBottom: 8 }} />
                                            <p style={{ fontSize: '0.88rem' }}>No messages yet. Start the conversation!</p>
                                        </div>
                                    )}
                                    {messages.map((msg, i) => {
                                        const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
                                        const showDate = i === 0 || formatDate(messages[i - 1]?.createdAt) !== formatDate(msg.createdAt);
                                        return (
                                            <div key={msg._id}>
                                                {showDate && (
                                                    <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                                                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: '#f1f5f9', padding: '0.2rem 0.75rem', borderRadius: 20 }}>
                                                            {formatDate(msg.createdAt)}
                                                        </span>
                                                    </div>
                                                )}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}
                                                >
                                                    <div style={{
                                                        maxWidth: '65%',
                                                        padding: '0.65rem 1rem',
                                                        borderRadius: isMe ? '1.2rem 1.2rem 0.3rem 1.2rem' : '1.2rem 1.2rem 1.2rem 0.3rem',
                                                        background: isMe ? 'linear-gradient(135deg, #2074e8, #1a5dbf)' : '#f1f5f9',
                                                        color: isMe ? '#fff' : '#1a2540',
                                                        fontSize: '0.88rem',
                                                        lineHeight: 1.5,
                                                        boxShadow: isMe ? '0 2px 8px rgba(32,116,232,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                                                    }}>
                                                        <p>{msg.content}</p>
                                                        <p style={{ fontSize: '0.65rem', opacity: 0.65, marginTop: '0.25rem', textAlign: 'right' }}>{formatTime(msg.createdAt)}</p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Send form */}
                                <form onSubmit={sendMessage} style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f4', display: 'flex', gap: '0.75rem', background: '#fafbff' }}>
                                    <input
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder={`Message ${selectedPatient.name}...`}
                                        disabled={sending}
                                        style={{ flex: 1, padding: '0.7rem 1rem', border: '1.5px solid #e2e8f4', borderRadius: 12, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                                        onFocus={e => e.target.style.borderColor = '#2074e8'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f4'}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        style={{
                                            padding: '0.7rem 1.1rem',
                                            background: sending || !newMessage.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #2074e8, #1a5dbf)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 12,
                                            cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <Send size={16} />
                                        {sending ? 'Sending...' : 'Send'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
