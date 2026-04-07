import React, { useState, useEffect } from 'react';
import API from '../services/api';

// ✅ PLACED aur CONFIRMED add kiye
const STATUS_CFG = {
    PLACED:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: '📋' },
    CONFIRMED: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '✅' },
    PREPARING: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '👨‍🍳' },
    PICKED_UP: { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',  icon: '🛵' },
    DELIVERED: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🎉' },
};

export default function DeliveryDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [restaurantsMap, setRestaurantsMap] = useState({});
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        loadOrders();
        const interval = setInterval(() => {
            loadOrders();
            setLastRefresh(new Date());
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const partnerId = localStorage.getItem('userId');
            const response = await API.get('/api/orders/delivery-orders', {
                headers: { 'X-User-Id': partnerId }
            });
            const fetchedOrders = response.data || [];
            setOrders(fetchedOrders);

            const restaurantIds = [...new Set(
                fetchedOrders
                    .filter(o => o.restaurantId)
                    .map(o => o.restaurantId)
            )];
            loadRestaurantDetails(restaurantIds);
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadRestaurantDetails = async (restaurantIds) => {
        const map = {};
        await Promise.all(restaurantIds.map(async (id) => {
            try {
                const res = await API.get(`/api/restaurants/${id}`);
                map[id] = res.data;
            } catch (e) {
                console.log(`Restaurant ${id} error:`, e);
            }
        }));
        setRestaurantsMap(prev => ({ ...prev, ...map }));
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const partnerId = localStorage.getItem('userId');
            await API.put(
                `/api/orders/${orderId}/status?status=${newStatus}`,
                {},
                { headers: { 'X-User-Id': partnerId } }
            );
            loadOrders();
        } catch (err) {
            alert('Update failed! Try again.');
        }
    };

    const myName = localStorage.getItem('name') || 'Delivery Partner';

    // Stats
    const activeCount = orders.filter(o =>
        ['PLACED', 'CONFIRMED', 'PREPARING', 'PICKED_UP'].includes(o.status)
    ).length;
    const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.header}>
                <div style={S.headerLeft}>
                    <div style={S.avatar}>🛵</div>
                    <div>
                        <h1 style={S.title}>Delivery Dashboard</h1>
                        <p style={S.subtitle}>Welcome, {myName}</p>
                    </div>
                </div>
                <div style={S.statsRow}>
                    <div style={S.statBox}>
                        <span style={S.statNum}>{orders.length}</span>
                        <span style={S.statLabel}>Total</span>
                    </div>
                    <div style={S.statBox}>
                        <span style={{ ...S.statNum, color: '#06b6d4' }}>
                            {activeCount}
                        </span>
                        <span style={S.statLabel}>Active</span>
                    </div>
                    <div style={S.statBox}>
                        <span style={{ ...S.statNum, color: '#10b981' }}>
                            {deliveredCount}
                        </span>
                        <span style={S.statLabel}>Done</span>
                    </div>
                </div>
            </div>

            {/* Refresh Bar */}
            <div style={S.refreshBar}>
                <span style={{ color: loading ? '#f59e0b' : '#10b981', fontSize: '12px' }}>
                    {loading
                        ? '🔄 Refreshing...'
                        : `✅ Last updated: ${lastRefresh.toLocaleTimeString('en-IN')}`}
                </span>
                <span style={{ color: '#475569', fontSize: '11px' }}>
                    Auto-refresh every 10s
                </span>
            </div>

            {/* Orders */}
            <div style={S.orderList}>
                {orders.length === 0 && !loading && (
                    <div style={S.emptyBox}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>😴</div>
                        <h3 style={{ color: '#e2e8f0', margin: '0 0 8px' }}>
                            No orders assigned
                        </h3>
                        <p style={{ color: '#475569' }}>
                            New orders will appear here automatically
                        </p>
                    </div>
                )}

                {orders.map(order => {
                    const cfg = STATUS_CFG[order.status] || STATUS_CFG.PLACED;
                    const restaurant = order.restaurantId
                        ? restaurantsMap[order.restaurantId]
                        : null;

                    return (
                        <div key={order.id} style={S.card}>
                            <div style={{ ...S.cardStripe, background: cfg.color }} />

                            {/* Order Header */}
                            <div style={S.cardHeader}>
                                <div>
                                    <h3 style={S.orderId}>Order #{order.id}</h3>
                                    {order.placedAt && (
                                        <span style={S.orderTime}>
                                            🕐 {new Date(order.placedAt).toLocaleTimeString('en-IN', {
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    )}
                                </div>
                                <div style={{
                                    ...S.statusBadge,
                                    color: cfg.color,
                                    background: cfg.bg
                                }}>
                                    {cfg.icon} {order.status}
                                </div>
                            </div>

                            {/* Customer */}
                            <div style={S.detailCard('#3b82f6')}>
                                <div style={S.detailIconBox('#3b82f6')}>👤</div>
                                <div style={{ flex: 1 }}>
                                    <p style={S.detailLabel('#3b82f6')}>Customer</p>
                                    <p style={S.detailName}>
                                        {order.customerName || 'Customer'}
                                    </p>
                                    {order.customerPhone && (
                                        <p style={S.detailInfo}>
                                            📞 {order.customerPhone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Restaurant */}
                            <div style={S.detailCard('#f59e0b')}>
                                <div style={S.detailIconBox('#f59e0b')}>🍽️</div>
                                <div style={{ flex: 1 }}>
                                    <p style={S.detailLabel('#f59e0b')}>Pick Up From</p>
                                    <p style={S.detailName}>
                                        {restaurant?.name ||
                                            `Restaurant #${order.restaurantId}`}
                                    </p>
                                    {restaurant?.address && (
                                        <p style={S.detailInfo}>
                                            📍 {restaurant.address}
                                        </p>
                                    )}
                                    {restaurant?.phone && (
                                        <p style={S.detailInfo}>
                                            📞 {restaurant.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div style={S.infoRow}>
                                <span style={S.infoChip}>
                                    📍 {order.deliveryAddress || 'N/A'}
                                </span>
                            </div>
                            <div style={S.infoRow}>
                                <span style={S.amountBadge}>
                                    💰 ₹{order.totalAmount}
                                </span>
                            </div>

                            {/* Items */}
                            {order.items && order.items.length > 0 && (
                                <div style={S.itemsBox}>
                                    {order.items.map((item, i) => (
                                        <span key={i} style={S.itemTag}>
                                            {item.itemName || item.name || 'Item'} ×{item.quantity}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* ✅ Action Buttons — PLACED/CONFIRMED/PREPARING/PICKED_UP sab handle */}
                            <div style={S.btnRow}>
                                {(order.status === 'PLACED' ||
                                  order.status === 'CONFIRMED') && (
                                    <div style={S.waitingMsg}>
                                        ⏳ Waiting for restaurant to prepare...
                                    </div>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button
                                        style={S.pickupBtn}
                                        onClick={() =>
                                            updateStatus(order.id, 'PICKED_UP')
                                        }
                                    >
                                        🛵 Mark Picked Up
                                    </button>
                                )}
                                {order.status === 'PICKED_UP' && (
                                    <button
                                        style={S.deliverBtn}
                                        onClick={() =>
                                            updateStatus(order.id, 'DELIVERED')
                                        }
                                    >
                                        ✅ Mark Delivered
                                    </button>
                                )}
                                {order.status === 'DELIVERED' && (
                                    <div style={S.doneMsg}>
                                        🎉 Successfully Delivered!
                                    </div>
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
        background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
        padding: '28px 20px',
        fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
        maxWidth: '820px', margin: '0 auto 16px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    avatar: {
        width: '56px', height: '56px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #ff4500, #ff6b35)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '28px',
    },
    title: { color: '#f1f5f9', fontSize: '24px', fontWeight: '800', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '14px', margin: '4px 0 0' },
    statsRow: { display: 'flex', gap: '12px' },
    statBox: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px', padding: '12px 20px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
    },
    statNum: { color: '#ff4500', fontSize: '24px', fontWeight: '800', lineHeight: 1 },
    statLabel: {
        color: '#64748b', fontSize: '11px', marginTop: '4px',
        textTransform: 'uppercase', letterSpacing: '0.05em',
    },
    refreshBar: {
        maxWidth: '820px', margin: '0 auto 20px',
        display: 'flex', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px', padding: '8px 16px',
    },
    orderList: {
        maxWidth: '820px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', gap: '16px',
    },
    emptyBox: {
        textAlign: 'center', padding: '60px 40px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px dashed rgba(255,255,255,0.1)',
        borderRadius: '20px',
    },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', overflow: 'hidden',
    },
    cardStripe: { height: '3px' },
    cardHeader: {
        padding: '18px 22px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    orderId: { color: '#f1f5f9', fontSize: '20px', fontWeight: '800', margin: '0 0 4px' },
    orderTime: { color: '#64748b', fontSize: '12px' },
    statusBadge: {
        padding: '5px 14px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700',
    },
    detailCard: (color) => ({
        margin: '0 22px 10px',
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        border: `1px solid ${color}25`,
        borderLeft: `3px solid ${color}`,
        borderRadius: '12px', padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
    }),
    detailIconBox: (color) => ({
        width: '38px', height: '38px', borderRadius: '50%',
        background: `${color}20`, border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', flexShrink: 0,
    }),
    detailLabel: (color) => ({
        fontSize: '10px', color: color, fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px',
    }),
    detailName: { fontWeight: '700', color: '#f1f5f9', fontSize: '14px', margin: '0 0 3px' },
    detailInfo: { color: '#94a3b8', fontSize: '12px', margin: '0 0 2px' },
    infoRow: {
        padding: '4px 22px',
        display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
    },
    infoChip: {
        color: '#94a3b8', fontSize: '13px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '8px', padding: '6px 12px',
    },
    amountBadge: {
        background: 'rgba(255,69,0,0.15)',
        border: '1px solid rgba(255,69,0,0.3)',
        color: '#ff4500', padding: '5px 14px',
        borderRadius: '20px', fontSize: '14px', fontWeight: '700',
    },
    itemsBox: {
        padding: '8px 22px 4px',
        display: 'flex', flexWrap: 'wrap', gap: '6px',
    },
    itemTag: {
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#cbd5e1', padding: '3px 10px',
        borderRadius: '20px', fontSize: '12px',
    },
    btnRow: { padding: '14px 22px 20px', display: 'flex', gap: '10px' },
    waitingMsg: {
        flex: 1, padding: '12px', textAlign: 'center',
        background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '12px', fontWeight: '700', fontSize: '14px',
    },
    pickupBtn: {
        flex: 1, padding: '12px',
        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    },
    deliverBtn: {
        flex: 1, padding: '12px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    },
    doneMsg: {
        flex: 1, padding: '12px', textAlign: 'center',
        background: 'rgba(16,185,129,0.1)', color: '#10b981',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '12px', fontWeight: '700',
    },
};