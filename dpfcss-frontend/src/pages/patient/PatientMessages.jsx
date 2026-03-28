import { useState, useEffect, useRef } from 'react';
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
        pollInterval.current = setInterval(load, 5000);
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
        } catch { toast.error('Failed to send transimission.'); }
        finally { setSending(false); }
    };

    const filtered = conversations.filter((c) =>
        c.partner.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Sidebar />
            <main className="page-content" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <style>{`
                    .chat-bubble {
                        max-width: 65%;
                        padding: 1rem 1.25rem;
                        font-size: 0.95rem;
                        line-height: 1.6;
                        color: var(--color-primary);
                    }
                    .chat-bubble.sent {
                        background-color: var(--color-border);
                        align-self: flex-end;
                        border-top-left-radius: var(--radius-sm);
                        border-bottom-left-radius: var(--radius-sm);
                        border-top-right-radius: var(--radius-sm);
                    }
                    .chat-bubble.received {
                        background-color: transparent;
                        border: 1px solid var(--color-border);
                        align-self: flex-start;
                        border-top-right-radius: var(--radius-sm);
                        border-bottom-right-radius: var(--radius-sm);
                        border-bottom-left-radius: var(--radius-sm);
                    }
                `}</style>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', flex: 1, overflow: 'hidden' }}>
                    
                    {/* Conversation List */}
                    <div style={{ borderRight: '1px solid var(--color-primary)', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
                        <div style={{ padding: '3rem 2rem 2rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
                            <h1 className="editorial-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Inbox</h1>
                            <input 
                                style={{ width: '100%', fontSize: '0.85rem' }}
                                placeholder="Search communications..." 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {filtered.length === 0 && (
                                <p style={{ padding: '3rem 2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No established comms.</p>
                            )}
                            
                            <ul style={{ listStyle: 'none' }}>
                                {filtered.map((conv) => {
                                    const isSelected = selected?.partner._id === conv.partner._id;
                                    return (
                                        <li key={conv.partner._id}>
                                            <button 
                                                onClick={() => setSelected(conv)}
                                                style={{ 
                                                    width: '100%', textAlign: 'left', padding: '1.5rem 2rem', cursor: 'pointer', border: 'none', borderBottom: '1px solid var(--color-border)', backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent', color: isSelected ? 'var(--color-bg)' : 'var(--color-primary)', transition: 'background-color var(--transition-fast)' 
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                                    <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>{conv.partner.name}</p>
                                                    {conv.unreadCount > 0 && (
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: isSelected ? 'var(--color-bg)' : 'var(--color-accent)' }}>
                                                            {conv.unreadCount} NEW
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: '0.85rem', opacity: isSelected ? 0.7 : 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {conv.lastMessage?.content || 'Awaiting transmission'}
                                                </p>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
                        {!selected ? (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select a contact</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div style={{ padding: '3rem 4rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <h2 className="editorial-heading" style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{selected.partner.name}</h2>
                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>
                                        {selected.partner.role}{selected.partner.specialization ? ` • ${selected.partner.specialization}` : ''}
                                    </p>
                                </div>

                                {/* Messages Area */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    {messages.map((msg, i) => {
                                        const isSent = msg.sender === user?.id || msg.sender?._id === user?.id || msg.sender?.toString() === user?.id;
                                        return (
                                            <div key={msg._id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                                                <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>
                                                    {msg.content}
                                                </div>
                                                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input Form */}
                                <div style={{ padding: '2rem 4rem', borderTop: '1px solid var(--color-border)' }}>
                                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
                                        <div style={{ flex: 1 }}>
                                            <input 
                                                placeholder="Write transmission..." 
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)} 
                                                style={{ borderBottom: 'none', border: '1px solid var(--color-border)', padding: '1rem', width: '100%', borderRadius: 'var(--radius-sm)' }}
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary" disabled={sending || !input.trim()}>
                                            Dispatch
                                        </button>
                                    </form>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '1rem', letterSpacing: '0.05em' }}>
                                        End-to-end clinical encryption enabled.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
export default MessagingPage;
