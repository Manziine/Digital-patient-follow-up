import { Link } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #eff8ff, #f0fdfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <div>
                <div style={{ fontSize: '6rem', fontWeight: 900, color: '#dbeefe', lineHeight: 1, marginBottom: '1.5rem' }}>404</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2074e8, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Heart size={17} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1a2540' }}>DPFCSS</span>
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a2540', marginBottom: '0.75rem' }}>Page not found</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="btn-primary" style={{ display: 'inline-flex', gap: 8, textDecoration: 'none' }}>
                    <Home size={16} /> Back to Home
                </Link>
            </div>
        </div>
    );
}
