import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const STATUS_CONFIG = {
    PLACED:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: '📋', label: 'Order Placed' },
    CONFIRMED: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '✅', label: 'Confirmed' },
    PREPARING: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '👨‍🍳', label: 'Preparing' },
    PICKED_UP: { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',  icon: '🛵', label: 'On the Way' },
    DELIVERED: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🎉', label: 'Delivered' },
    CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  icon: '❌', label: 'Cancelled' },
};

function InfoChip({ icon, text, color = '#94a3b8' }) {
    if (!text) return null;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color,
        }}>
            {icon} {text}
        </span>
    );
}

function DetailCard({ icon, title, name, phone, email, extra, accentColor }) {
    if (!name) return null;
    return (
        <div style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
            border: `1px solid ${accentColor}33`,
            borderLeft: `3px solid ${accentColor}`,
            borderRadius: '12px', padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
        }}>
            <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: `${accentColor}22`, border: `1px solid ${accentColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
            }}>{icon}</div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', color: accentColor, fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                    {title}
                </p>
                <p style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '15px', margin: '0 0 4px' }}>
                    {name}
                </p>
                {phone && <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 2px' }}>📞 {phone}</p>}
                {email && <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 2px' }}>✉️ {email}</p>}
                {extra && <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{extra}</p>}
            </div>
        </div>
    );
}

export default function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [partnersMap, setPartnersMap] = useState({});
    const [restaurantsMap, setRestaurantsMap] = useState({});

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const res = await API.get('/api/orders/my-orders', {
                headers: { 'X-User-Id': userId }
            });
            const fetchedOrders = res.data || [];
            setOrders(fetchedOrders);

            // Delivery partners load
            const partnerIds = [...new Set(
                fetchedOrders.filter(o => o.deliveryPartnerId).map(o => o.deliveryPartnerId)
            )];
            loadPartnerDetails(partnerIds);

            // Restaurants load
            const restaurantIds = [...new Set(
                fetchedOrders.filter(o => o.restaurantId).map(o => o.restaurantId)
            )];
            loadRestaurantDetails(restaurantIds);
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadPartnerDetails = async (partnerIds) => {
        const map = {};
        await Promise.all(partnerIds.map(async (id) => {
            try {
                const res = await API.get(`/api/delivery/partner/${id}`);
                map[id] = res.data;
            } catch (e) { console.log(`Partner ${id} error:`, e); }
        }));
        setPartnersMap(map);
    };

    const loadRestaurantDetails = async (restaurantIds) => {
        const map = {};
        await Promise.all(restaurantIds.map(async (id) => {
            try {
                const res = await API.get(`/api/restaurants/${id}`);
                map[id] = res.data;
            } catch (e) { console.log(`Restaurant ${id} error:`, e); }
        }));
        setRestaurantsMap(map);
    };

    if (loading) return (
        <div style={S.loadingWrap}>
            <div style={S.spinner} />
            <p style={{ color: '#94a3b8', marginTop: '16px' }}>Loading your orders...</p>
        </div>
    );

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.header}>
                <div>
                    <h1 style={S.pageTitle}>📦 My Orders</h1>
                    <p style={S.pageSubtitle}>Your complete order history</p>
                </div>
                <div style={S.badge}>{orders.length} Orders</div>
            </div>

            {orders.length === 0 && (
                <div style={S.emptyBox}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
                    <h3 style={{ color: '#f1f5f9', marginBottom: '8px' }}>Koi order nahi hai!</h3>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>Pehla order karo abhi</p>
                    <button onClick={() => navigate('/home')} style={S.primaryBtn}>🍕 Food Dhundho</button>
                </div>
            )}

            <div style={S.orderList}>
                {orders.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PLACED;
                    const partner = order.deliveryPartnerId ? partnersMap[order.deliveryPartnerId] : null;
                    const restaurant = order.restaurantId ? restaurantsMap[order.restaurantId] : null;

                    return (
                        <div key={order.id} style={S.card}>
                            {/* Card Top Accent */}
                            <div style={{ ...S.cardAccent, background: cfg.color }} />

                            {/* Order Header */}
                            <div style={S.cardHeader}>
                                <div>
                                    <h3 style={S.orderId}>Order #{order.id}</h3>
                                    <p style={S.orderDate}>
                                        🕐 {order.placedAt
                                            ? new Date(order.placedAt).toLocaleString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            }) : 'N/A'}
                                    </p>
                                </div>
                                <div style={{ ...S.statusBadge, color: cfg.color, background: cfg.bg }}>
                                    {cfg.icon} {order.status}
                                </div>
                            </div>

                            {/* Items */}
                            <div style={S.itemsBox}>
                                {order.items && order.items.length > 0 ? order.items.map((item, i) => (
                                    <div key={i} style={S.itemRow}>
                                        <span style={S.dot}>▸</span>
                                        <span style={S.itemName}>
                                            {item.itemName || item.menuItemName || item.name || 'Item'}
                                        </span>
                                        <span style={S.itemQty}>×{item.quantity || 1}</span>
                                        <span style={S.itemPrice}>
                                            ₹{(item.unitPrice || item.price || 0) * (item.quantity || 1)}
                                        </span>
                                    </div>
                                )) : (
                                    <p style={{ color: '#64748b', fontSize: '13px' }}>Items not available</p>
                                )}

                                <div style={S.totalRow}>
                                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>💰 Total Amount</span>
                                    <span style={{ color: '#ff4500', fontWeight: '800', fontSize: '20px' }}>
                                        ₹{order.totalAmount}
                                    </span>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            {order.deliveryAddress && (
                                <div style={S.addressRow}>
                                    <span style={{ fontSize: '16px' }}>📍</span>
                                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                        {order.deliveryAddress}
                                    </span>
                                </div>
                            )}

                            {/* ✅ THREE DETAIL CARDS */}
                            <div style={S.detailsGrid}>
                                {/* Customer (logged-in user) */}
                                <DetailCard
                                    icon="👤"
                                    title="Customer"
                                    name={order.customerName || localStorage.getItem('name') || 'You'}
                                    phone={order.customerPhone}
                                    email={order.customerEmail}
                                    accentColor="#3b82f6"
                                />

                                {/* Restaurant */}
                                <DetailCard
                                    icon="🍽️"
                                    title="Restaurant"
                                    name={restaurant?.name || order.restaurantName || `Restaurant #${order.restaurantId}`}
                                    phone={restaurant?.phone}
                                    email={restaurant?.email}
                                    extra={restaurant?.address || restaurant?.city}
                                    accentColor="#f59e0b"
                                />

                                {/* Delivery Partner */}
                                {partner && (
                                    <DetailCard
                                        icon="🛵"
                                        title="Delivery Partner"
                                        name={partner.name}
                                        phone={partner.phone}
                                        extra={`${partner.vehicleType || 'BIKE'} • ⭐ ${partner.rating || 'N/A'} • ${partner.totalDeliveries || 0} deliveries`}
                                        accentColor="#10b981"
                                    />
                                )}
                                {!partner && order.deliveryPartnerId && (
                                    <DetailCard
                                        icon="🛵"
                                        title="Delivery Partner"
                                        name="Assigning partner..."
                                        accentColor="#10b981"
                                    />
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div style={S.btnRow}>
                                {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                                    <button onClick={() => navigate(`/order/${order.id}`)} style={S.trackBtn}>
                                        🛵 Track Order
                                    </button>
                                )}
                                {order.status === 'DELIVERED' && (
                                    <>
                                        <div style={S.deliveredBadge}>🎉 Successfully Delivered!</div>
                                        <button onClick={() => navigate('/home')} style={S.reorderBtn}>
                                            🔄 Order Again
                                        </button>
                                    </>
                                )}
                                {order.status === 'CANCELLED' && (
                                    <div style={S.cancelledBadge}>❌ Order Cancelled</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const S = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '32px 20px',
        fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
        maxWidth: '760px', margin: '0 auto 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    },
    pageTitle: { color: '#f1f5f9', fontSize: '28px', fontWeight: '800', margin: 0 },
    pageSubtitle: { color: '#64748b', fontSize: '14px', margin: '4px 0 0' },
    badge: {
        background: 'rgba(255,69,0,0.15)', border: '1px solid rgba(255,69,0,0.3)',
        color: '#ff4500', padding: '6px 16px', borderRadius: '20px',
        fontSize: '13px', fontWeight: '700',
    },
    loadingWrap: {
        minHeight: '100vh', background: '#0f172a',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    },
    spinner: {
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid rgba(255,69,0,0.2)', borderTopColor: '#ff4500',
        animation: 'spin 0.8s linear infinite',
    },
    emptyBox: {
        maxWidth: '760px', margin: '60px auto', textAlign: 'center',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', padding: '60px 40px',
    },
    orderList: { maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', overflow: 'hidden', position: 'relative',
    },
    cardAccent: { height: '3px', width: '100%' },
    cardHeader: {
        padding: '20px 24px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    },
    orderId: { color: '#f1f5f9', fontSize: '20px', fontWeight: '800', margin: 0 },
    orderDate: { color: '#64748b', fontSize: '12px', margin: '4px 0 0' },
    statusBadge: {
        padding: '6px 14px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
    },
    itemsBox: {
        margin: '16px 24px 0',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '14px 16px',
    },
    itemRow: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    dot: { color: '#ff4500', fontSize: '12px' },
    itemName: { flex: 2, color: '#e2e8f0', fontWeight: '600', fontSize: '14px' },
    itemQty: { color: '#64748b', fontSize: '13px' },
    itemPrice: { color: '#ff4500', fontWeight: '700', fontSize: '14px' },
    totalRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '12px', paddingTop: '12px',
        borderTop: '1px solid rgba(255,69,0,0.3)',
    },
    addressRow: {
        display: 'flex', alignItems: 'flex-start', gap: '8px',
        padding: '12px 24px', color: '#94a3b8', fontSize: '13px',
    },
    detailsGrid: {
        display: 'flex', flexDirection: 'column', gap: '10px',
        padding: '0 24px 20px',
    },
    btnRow: { padding: '0 24px 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
    trackBtn: {
        flex: 1, padding: '12px',
        background: 'linear-gradient(135deg, #ff4500, #ff6b35)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    },
    reorderBtn: {
        flex: 1, padding: '12px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    },
    deliveredBadge: {
        background: 'rgba(16,185,129,0.1)', color: '#10b981',
        border: '1px solid rgba(16,185,129,0.3)',
        padding: '12px', borderRadius: '12px', textAlign: 'center',
        fontWeight: '700', flex: 1,
    },
    cancelledBadge: {
        background: 'rgba(239,68,68,0.1)', color: '#ef4444',
        border: '1px solid rgba(239,68,68,0.3)',
        padding: '12px', borderRadius: '12px', textAlign: 'center',
        fontWeight: '700', flex: 1,
    },
    primaryBtn: {
        background: 'linear-gradient(135deg, #ff4500, #ff6b35)',
        color: 'white', border: 'none', padding: '14px 32px',
        borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    },
};