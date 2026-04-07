import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const data = await login(formData);
            handleLogin(data);
            // Role based redirect
            if (data.role === 'ADMIN') navigate('/admin');
            else if (data.role === 'RESTAURANT') navigate('/restaurant-dashboard');
            else if (data.role === 'DELIVERY') navigate('/delivery-dashboard');
            else navigate('/home');
        } catch { setError('Invalid email or password!'); }
        finally { setLoading(false); }
    };

    return (
        <div style={S.page}>
            <div style={S.card}>
                <div style={S.logoBox}>
                    <span style={S.logoEmoji}>🍕</span>
                </div>
                <h2 style={S.title}>Welcome Back!</h2>
                <p style={S.subtitle}>Login to order food</p>

                {error && <div style={S.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={S.inputGroup}>
                        <label style={S.label}>Email</label>
                        <div style={S.inputWrap}>
                            <span style={S.inputIcon}>✉️</span>
                            <input type="email" name="email" value={formData.email}
                                onChange={handleChange} placeholder="rupesh@gmail.com"
                                style={S.input} required />
                        </div>
                    </div>
                    <div style={S.inputGroup}>
                        <label style={S.label}>Password</label>
                        <div style={S.inputWrap}>
                            <span style={S.inputIcon}>🔒</span>
                            <input type="password" name="password" value={formData.password}
                                onChange={handleChange} placeholder="••••••••"
                                style={S.input} required />
                        </div>
                    </div>
                    <button type="submit" style={S.btn} disabled={loading}>
                        {loading ? '⏳ Logging in...' : '🚀 Login'}
                    </button>
                </form>

                <p style={S.bottomText}>
                    New user?{' '}
                    <Link to="/register" style={S.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
}

const S = {
    page: { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '44px 40px', width: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' },
    logoBox: { textAlign: 'center', marginBottom: '20px' },
    logoEmoji: { fontSize: '52px' },
    title: { color: '#f1f5f9', fontSize: '26px', fontWeight: '800', textAlign: 'center', margin: '0 0 6px' },
    subtitle: { color: '#64748b', textAlign: 'center', marginBottom: '28px' },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px', borderRadius: '10px', marginBottom: '18px', textAlign: 'center', fontSize: '14px' },
    inputGroup: { marginBottom: '18px' },
    label: { display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.04em' },
    inputWrap: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0 16px' },
    inputIcon: { fontSize: '16px', flexShrink: 0 },
    input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: '15px', padding: '14px 0' },
    btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ff4500, #ff6b35)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,69,0,0.4)', marginTop: '8px' },
    bottomText: { textAlign: 'center', color: '#64748b', marginTop: '24px', fontSize: '14px' },
    link: { color: '#ff4500', fontWeight: '700', textDecoration: 'none' },
};