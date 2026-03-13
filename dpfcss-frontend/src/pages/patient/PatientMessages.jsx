import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, MessageCircle } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

function MessagingPage() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const bottomRef = useRef(null);
    let pollInterval = useRef(null);

    useEffect(() => {
        api.get('/messages/conversations').then((r) => setConversations(r.data));
    }, []);

    useEffect(() => {
        if (!selected) return;
        const load = () =>
            api.get(`/messages/${selected.partner._id}`).then((r) => setMessages(r.data));
        load();
        pollInterval.current = setInterval(load, 5000); // poll every 5s (low-bandwidth friendly)
        return () => clearInterval(pollInterval.current);
    }, [selected]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selected) return;
        setSending(true);
        try {
            const { data } = await api.post(`/messages/${selected.partner._id}`, { content: input.trim() });
            setMessages((prev) => [...prev, data]);
            setInput('');
        } catch { toast.error('Failed to send message.'); }
        finally { setSending(false); }
    };

    const filtered = conversations.filter((c) =>
        c.partner.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Sidebar />
            <main className="page-content" style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ margin: '1.5rem 2rem 0', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <MessageCircle size={20} color="#2074e8" />
                    <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1a2540' }}>Messages</h1>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', margin: '0 2rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f4', overflow: 'hidden', background: 'white', minHeight: 0 }}>
                    {/* Sidebar conversation list */}
                    <div style={{ borderRight: '1px solid #e2e8f4', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f4' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input className="input" style={{ paddingLeft: '2.1rem', padding: '0.55rem 0.75rem 0.55rem 2.1rem', fontSize: '0.85rem' }}
                                    placeholder="Search chats..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {filtered.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                    No conversations yet
                                </div>
                            )}
                            {filtered.map((conv) => (
                                <div key={conv.partner._id}
                                    onClick={() => setSelected(conv)}
                                    style={{
                                        padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'center',
                                        borderBottom: '1px solid #f1f5f9',
                                        background: selected?.partner._id === conv.partner._id ? '#f0f7ff' : 'transparent',
                                        transition: 'background 0.15s',
                                    }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #dbeefe, #ccfbf1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2074e8', flexShrink: 0, fontSize: '0.9rem' }}>
                                        {conv.partner.name?.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a2540' }}>{conv.partner.name}</p>
                                            {conv.unreadCount > 0 && (
                                                <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>{conv.unreadCount}</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
                                            {conv.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat window */}
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        {!selected ? (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
                                <MessageCircle size={48} strokeWidth={1} />
                                <p style={{ fontSize: '1rem' }}>Select a conversation to start messaging</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat header */}
                                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f4', display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'white' }}>
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #dbeefe, #ccfbf1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2074e8', fontSize: '0.9rem' }}>
                                        {selected.partner.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a2540' }}>{selected.partner.name}</p>
                                        <p style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'capitalize' }}>
                                            {selected.partner.role}{selected.partner.specialization ? ` • ${selected.partner.specialization}` : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                    {messages.map((msg, i) => {
                                        const isSent = msg.sender === user?.id || msg.sender?._id === user?.id || msg.sender?.toString() === user?.id;
                                        return (
                                            <motion.div key={msg._id || i}
                                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                                style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                                                <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>
                                                    {msg.content}
                                                </div>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={sendMessage} style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f4', display: 'flex', gap: '0.75rem', background: 'white' }}>
                                    <input className="input" style={{ flex: 1 }}
                                        placeholder="Type a message..." value={input}
                                        onChange={(e) => setInput(e.target.value)} />
                                    <button type="submit" className="btn-primary" disabled={sending || !input.trim()}
                                        style={{ padding: '0.625rem 1.25rem', flexShrink: 0 }}>
                                        <Send size={16} />
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

export default MessagingPage;
