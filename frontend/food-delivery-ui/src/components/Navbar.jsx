import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
export default function Navbar() {
    const { isLoggedIn, name, role, handleLogout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const onLogout = () => {
        handleLogout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        ...S.link,
        color: isActive(path) ? '#ff4500' : 'rgba(255,255,255,0.85)',
        background: isActive(path) ? 'rgba(255,69,0,0.12)' : 'transparent',
        borderBottom: isActive(path) ? '2px solid #ff4500' : '2px solid transparent',
    });

    return (
        <nav style={S.nav}>
            {/* Logo */}
            <div style={S.logo} onClick={() => navigate('/home')}>
                <span style={S.logoIcon}>🍕</span>
                <span style={S.logoText}>FoodDelivery</span>
            </div>

            {/* Links */}
            <div style={S.links}>
                {isLoggedIn ? (
                    <>
                        {/* Welcome chip */}
                        <div style={S.welcomeChip}>
                            <span style={S.welcomeAvatar}>
                                {role === 'ADMIN' ? '👑' : role === 'RESTAURANT' ? '🍽️' : role === 'DELIVERY' ? '🛵' : '👤'}
                            </span>
                            <span style={S.welcomeName}>{name}</span>
                        </div>

                        <Link to="/home" style={linkStyle('/home')}>Home</Link>

                        {/* CUSTOMER links */}
                        {role === 'CUSTOMER' && (
                            <>
                                <Link to="/my-orders" style={linkStyle('/my-orders')}>My Orders</Link>
                                <Link to="/cart" style={S.cartBtn}>
                                    🛒 <span style={S.cartCount}>{cartItems.length}</span>
                                </Link>
                            </>
                        )}

                        {/* RESTAURANT links */}
                        {role === 'RESTAURANT' && (
                            <>
                                <Link to="/add-restaurant" style={linkStyle('/add-restaurant')}>+ Restaurant</Link>
                                <Link to="/restaurant-dashboard" style={linkStyle('/restaurant-dashboard')}>📋 Orders</Link>
                            </>
                        )}

                        {/* DELIVERY links */}
                        {role === 'DELIVERY' && (
                            <>
                                <Link to="/delivery-register" style={linkStyle('/delivery-register')}>🛵 My Profile</Link>
                                <Link to="/delivery-dashboard" style={linkStyle('/delivery-dashboard')}>📦 My Orders</Link>
                            </>
                        )}

                        {/* ADMIN links */}
                        {role === 'ADMIN' && (
                            <Link to="/admin" style={{
                                ...linkStyle('/admin'),
                                color: isActive('/admin') ? '#8b5cf6' : '#c4b5fd',
                                background: isActive('/admin') ? 'rgba(139,92,246,0.15)' : 'transparent',
                                borderBottom: isActive('/admin') ? '2px solid #8b5cf6' : '2px solid transparent',
                            }}>
                                👑 Admin Panel
                            </Link>
                        )}

                        <button onClick={onLogout} style={S.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={S.link}>Login</Link>
                        <Link to="/register" style={S.registerBtn}>Register 🚀</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const S = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 28px',
        height: '64px',
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    logo: {
        display: 'flex', alignItems: 'center', gap: '10px',
        cursor: 'pointer',
    },
    logoIcon: { fontSize: '26px' },
    logoText: {
        fontSize: '20px', fontWeight: '800', color: '#ff4500',
        letterSpacing: '-0.02em', fontFamily: "'Segoe UI', sans-serif",
    },
    links: {
        display: 'flex', alignItems: 'center', gap: '4px',
    },
    link: {
        color: 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        padding: '6px 12px',
        borderRadius: '8px',
        transition: 'all 0.15s',
        fontFamily: "'Segoe UI', sans-serif",
    },
    welcomeChip: {
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '5px 14px 5px 8px',
        marginRight: '4px',
    },
    welcomeAvatar: { fontSize: '18px' },
    welcomeName: { color: '#e2e8f0', fontSize: '13px', fontWeight: '700' },
    cartBtn: {
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'rgba(255,69,0,0.15)', border: '1px solid rgba(255,69,0,0.3)',
        color: '#ff4500', padding: '7px 16px', borderRadius: '20px',
        textDecoration: 'none', fontWeight: '800', fontSize: '14px',
    },
    cartCount: {
        background: '#ff4500', color: 'white', borderRadius: '50%',
        width: '20px', height: '20px', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800',
    },
    logoutBtn: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'rgba(255,255,255,0.7)',
        padding: '7px 16px', borderRadius: '20px',
        fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginLeft: '4px',
    },
    registerBtn: {
        background: 'linear-gradient(135deg, #ff4500, #ff6b35)',
        color: 'white', padding: '8px 18px', borderRadius: '20px',
        textDecoration: 'none', fontWeight: '700', fontSize: '14px',
        boxShadow: '0 4px 12px rgba(255,69,0,0.3)',
    },
};