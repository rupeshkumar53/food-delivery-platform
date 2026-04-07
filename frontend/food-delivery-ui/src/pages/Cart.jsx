import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/orderService';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, restaurantId, removeFromCart, clearCart, getTotal } = useCart();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePlaceOrder = async () => {
        if (!address.trim()) { setError('Address daalo pehle!'); return; }
        if (cartItems.length === 0) { setError('Cart khali hai!'); return; }
        setLoading(true); setError('');
        try {
            const orderData = {
                restaurantId,
                deliveryAddress: address,
                items: cartItems.map(item => ({ menuItemId: item.id, quantity: item.quantity, price: item.price })),
                totalAmount: getTotal()
            };
            const response = await placeOrder(orderData);
            clearCart();
            navigate(`/order/${response.id || response.orderId}`);
        } catch { setError('Order place karne mein error! Try again.'); }
        finally { setLoading(false); }
    };

    if (cartItems.length === 0) return (
        <div style={S.emptyPage}>
            <div style={S.emptyCard}>
                <div style={{ fontSize: '72px', marginBottom: '16px' }}>🛒</div>
                <h2 style={S.emptyTitle}>Cart Khali Hai!</h2>
                <p style={{ color: '#64748b', marginBottom: '28px' }}>Kuch add karo pehle</p>
                <button onClick={() => navigate('/home')} style={S.primaryBtn}>🍕 Food Dhundho</button>
            </div>
        </div>
    );

    return (
        <div style={S.page}>
            <div style={S.content}>
                <h2 style={S.pageTitle}>🛒 Your Cart</h2>

                {/* Items */}
                <div style={S.card}>
                    <h3 style={S.cardTitle}>Order Items</h3>
                    {cartItems.map(item => (
                        <div key={item.id} style={S.itemRow}>
                            <div style={S.itemIcon}>🍽️</div>
                            <div style={{ flex: 1 }}>
                                <p style={S.itemName}>{item.name}</p>
                                <p style={S.itemUnit}>₹{item.price} each</p>
                            </div>
                            <span style={S.qtyBadge}>×{item.quantity}</span>
                            <span style={S.itemTotal}>₹{item.price * item.quantity}</span>
                            <button onClick={() => removeFromCart(item.id)} style={S.removeBtn}>✕</button>
                        </div>
                    ))}

                    {/* Total */}
                    <div style={S.totalRow}>
                        <span style={{ color: '#94a3b8', fontWeight: '600' }}>💰 Total Amount</span>
                        <span style={{ color: '#ff4500', fontSize: '24px', fontWeight: '800' }}>₹{getTotal()}</span>
                    </div>
                </div>

                {/* Address */}
                <div style={S.card}>
                    <h3 style={S.cardTitle}>📍 Delivery Address</h3>
                    <textarea value={address} onChange={e => setAddress(e.target.value)}
                        placeholder="Ghar ka poora address daalo..."
                        style={S.textarea} rows={3} />
                </div>

                {error && <div style={S.errorBox}>{error}</div>}

                <button onClick={handlePlaceOrder} style={S.orderBtn} disabled={loading}>
                    {loading ? '⏳ Placing Order...' : '🚀 Place Order'}
                </button>
                <button onClick={clearCart} style={S.clearBtn}>🗑️ Clear Cart</button>
            </div>
        </div>
    );
}

const S = {
    page: { minHeight: '100vh', background: '#0f172a', padding: '32px 20px', fontFamily: "'Segoe UI', sans-serif" },
    content: { maxWidth: '620px', margin: '0 auto' },
    pageTitle: { color: '#f1f5f9', fontSize: '26px', fontWeight: '800', marginBottom: '24px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '22px', marginBottom: '16px' },
    cardTitle: { color: '#94a3b8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' },
    itemRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    itemIcon: { width: '40px', height: '40px', background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 },
    itemName: { color: '#e2e8f0', fontWeight: '700', fontSize: '15px', margin: '0 0 2px' },
    itemUnit: { color: '#64748b', fontSize: '12px', margin: 0 },
    qtyBadge: { background: 'rgba(255,255,255,0.08)', color: '#94a3b8', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
    itemTotal: { color: '#ff4500', fontWeight: '700', fontSize: '15px', minWidth: '60px', textAlign: 'right' },
    removeBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '13px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,69,0,0.3)' },
    textarea: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9', fontSize: '15px', padding: '14px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '14px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center' },
    orderBtn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ff4500, #ff6b35)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,69,0,0.4)', marginBottom: '10px' },
    clearBtn: { width: '100%', padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '14px', fontSize: '15px', cursor: 'pointer' },
    emptyPage: { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" },
    emptyCard: { textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '60px 50px' },
    emptyTitle: { color: '#f1f5f9', fontSize: '24px', fontWeight: '800', margin: '0 0 8px' },
    primaryBtn: { background: 'linear-gradient(135deg, #ff4500, #ff6b35)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
};