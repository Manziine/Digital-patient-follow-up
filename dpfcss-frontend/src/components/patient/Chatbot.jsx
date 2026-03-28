import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Muraho! Hello! I am your Rwandan health assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Priority: OpenAI if key exists, otherwise DialoGPT or fallback mock
            let botReply = "I understand. Please consult your doctor for medical advice. (Fallback response)";
            
            const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
            if (openAiKey) {
                const res = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openAiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: "You are a friendly Rwandan health assistant that helps patients understand their condition, reminds them about medication, and answers basic health questions. Always recommend seeing a doctor for serious concerns. Keep responses concise and warm." },
                            ...messages.map(m => ({ role: m.isBot ? "assistant" : "user", content: m.text })),
                            { role: "user", content: input }
                        ]
                    })
                });
                const data = await res.json();
                botReply = data.choices[0].message.content;
            } else {
                // DialoGPT free API fallback (can be slow or timeout, so we add a timeout)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                try {
                    const res = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ inputs: input }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    const data = await res.json();
                    if (data && data.generated_text) botReply = data.generated_text;
                    if (Array.isArray(data) && data[0]?.generated_text) botReply = data[0].generated_text;
                } catch (err) {
                    botReply = "I am a bit overloaded right now, but please remember to take your medication and rest well. Contact your doctor if you feel unwell.";
                }
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm having trouble connecting right now, but your doctor is always there for you.", isBot: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '80px',
                            right: '20px',
                            width: '350px',
                            height: '500px',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            zIndex: 100,
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Bot size={24} />
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Health Assistant</h3>
                                    <p style={{ fontSize: '0.7rem', margin: 0, opacity: 0.8 }}>Always here for you</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f9f9f9' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.isBot ? 'row' : 'row-reverse', gap: '0.5rem', alignItems: 'flex-end' }}>
                                    {msg.isBot ? (
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <Bot size={16} />
                                        </div>
                                    ) : (
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <User size={16} />
                                        </div>
                                    )}
                                    <div style={{
                                        maxWidth: '75%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        backgroundColor: msg.isBot ? '#fff' : 'var(--color-accent)',
                                        color: msg.isBot ? 'var(--color-primary)' : '#fff',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.4,
                                        borderBottomLeftRadius: msg.isBot ? '0px' : '12px',
                                        borderBottomRightRadius: msg.isBot ? '12px' : '0px',
                                        border: msg.isBot ? '1px solid var(--color-border)' : 'none'
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <Bot size={16} />
                                    </div>
                                    <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', backgroundColor: '#fff', color: 'var(--color-primary)', borderBottomLeftRadius: '0px', border: '1px solid var(--color-border)' }}>
                                        <span className="dot-typing" style={{ letterSpacing: '2px', fontSize: '1.2rem' }}>...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} style={{ padding: '1rem', backgroundColor: '#fff', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: '20px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                            <button type="submit" disabled={!input.trim() || isTyping} style={{
                                width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!input.trim() || isTyping) ? 0.5 : 1
                            }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-accent)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 99,
                    transition: 'transform 0.2s',
                    transform: isOpen ? 'scale(0.9)' : 'scale(1)'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>
        </>
    );
}
