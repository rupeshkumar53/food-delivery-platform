import React, { useState, useEffect } from 'react';
import API from '../services/api';

const STATUS_CFG = {
    PLACED:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: '📋' },
    CONFIRMED: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '✅' },
    PREPARING: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '👨‍🍳' },
    PICKED_UP: { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',  icon: '🛵' },
    DELIVERED: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🎉' },
    CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  icon: '❌' },
};

const FILTERS = ['ALL', 'PLACED', 'CONFIRMED', 'PREPARING', 'DELIVERED', 'CANCELLED'];

export default function RestaurantDashboard() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [partnersMap, setPartnersMap] = useState({});
    const [openOrders, setOpenOrders] = useState({}); // <-- Track open/close

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, []);

 const loadOrders = async () => {
    setLoading(true);
    try {
        const userId = localStorage.getItem('userId');
        
        const response = await API.get(
            '/api/orders/restaurant-orders', {
            headers: { 'X-User-Id': userId }
        });
        const fetchedOrders = response.data || [];
        setOrders(fetchedOrders);

        const partnerIds = [...new Set(
            fetchedOrders
                .filter(o => o.deliveryPartnerId)
                .map(o => o.deliveryPartnerId)
        )];
        loadPartnerDetails(partnerIds);
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
        setPartnersMap(prev => ({ ...prev, ...map }));
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await API.put(`/api/orders/${orderId}/status?status=${newStatus}`);
            loadOrders();
        } catch (err) {
            alert('Update failed!');
        }
    };

    const getNextStatus = (status) => ({ PLACED: 'CONFIRMED', CONFIRMED: 'PREPARING' }[status] || null);

    const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    const stats = {
        total: orders.length,
        active: orders.filter(o => ['PLACED','CONFIRMED','PREPARING'].includes(o.status)).length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        revenue: orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + (o.totalAmount || 0), 0),
    };

    const myName = localStorage.getItem('name') || 'Restaurant';

    const toggleOrder = (orderId) => {
        setOpenOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.header}>
                <div style={S.headerLeft}>
                    <div style={S.avatar}>🍽️</div>
                    <div>
                        <h1 style={S.title}>Restaurant Dashboard</h1>
                        <p style={S.subtitle}>{myName}</p>
                    </div>
                </div>
                {loading && <span style={S.refreshBadge}>🔄 Refreshing...</span>}
            </div>

            {/* Stats */}
            <div style={S.statsGrid}>
                {[ 
                    { label: 'Total Orders', value: stats.total, color: '#ff4500', icon: '📦' },
                    { label: 'Active', value: stats.active, color: '#f59e0b', icon: '🔥' },
                    { label: 'Delivered', value: stats.delivered, color: '#10b981', icon: '✅' },
                    { label: 'Revenue', value: `₹${stats.revenue}`, color: '#3b82f6', icon: '💰' },
                ].map(s => (
                    <div key={s.label} style={S.statCard}>
                        <span style={{ fontSize: '28px' }}>{s.icon}</span>
                        <span style={{ ...S.statNum, color: s.color }}>{s.value}</span>
                        <span style={S.statLabel}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div style={S.filterRow}>
                {FILTERS.map(f => {
                    const cnt = f === 'ALL' ? orders.length : orders.filter(o => o.status === f).length;
                    const isActive = filter === f;
                    return (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            ...S.filterBtn,
                            background: isActive ? (STATUS_CFG[f]?.color || '#ff4500') : 'rgba(255,255,255,0.05)',
                            color: isActive ? 'white' : '#64748b',
                            border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                            {STATUS_CFG[f]?.icon || '📦'} {f}
                            {cnt > 0 && <span style={S.filterCount(isActive)}>{cnt}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Orders */}
            <div style={S.orderList}>
                {filteredOrders.length === 0 && (
                    <div style={S.emptyBox}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                        <p style={{ color: '#64748b' }}>No orders in this category</p>
                    </div>
                )}

                {filteredOrders.map(order => {
                    const cfg = STATUS_CFG[order.status] || STATUS_CFG.PLACED;
                    const partner = order.deliveryPartnerId ? partnersMap[order.deliveryPartnerId] : null;
                    const nextStatus = getNextStatus(order.status);
                    const isOpen = openOrders[order.id] || false; // <-- open/close state

                    return (
                        <div key={order.id} style={S.card}>
                            <div style={{ ...S.cardStripe, background: cfg.color }} />

                            {/* Header clickable to toggle */}
                            <div style={S.cardHeader} onClick={() => toggleOrder(order.id)}>
                                <div>
                                    <h3 style={S.orderId}>Order #{order.id}</h3>
                                    <span style={S.orderDate}>
                                        🕐 {order.placedAt ? new Date(order.placedAt).toLocaleString('en-IN') : 'N/A'}
                                    </span>
                                </div>
                                <div style={{ ...S.statusBadge, color: cfg.color, background: cfg.bg }}>
                                    {cfg.icon} {order.status} {isOpen ? '🔽' : '▶️'}
                                </div>
                            </div>

                            {/* Expandable Details */}
                            {isOpen && (
                                <>
                                    {/* Customer, Items, Address, Partner */}
                                    <div style={S.detailCard} data-color="#3b82f6">
                                        <div style={{ ...S.iconBox, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>👤</div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ ...S.detailLabel, color: '#3b82f6' }}>Customer</p>
                                            <p style={S.detailName}>{order.customerName || 'Customer'}</p>
                                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                {order.customerPhone && <span style={S.detailInfo}>📞 {order.customerPhone}</span>}
                                                {order.customerEmail && <span style={S.detailInfo}>✉️ {order.customerEmail}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={S.itemsBox}>
                                        {order.items && order.items.map((item, i) => (
                                            <div key={i} style={S.itemRow}>
                                                <span style={{ color: '#ff4500', fontWeight: '700' }}>▸</span>
                                                <span style={S.itemName}>{item.itemName || 'Item'}</span>
                                                <span style={S.itemQty}>×{item.quantity}</span>
                                                <span style={S.itemPrice}>₹{(item.unitPrice || 0) * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div style={S.totalRow}>
                                            <span style={{ color: '#94a3b8' }}>Order Total</span>
                                            <span style={{ color: '#ff4500', fontWeight: '800', fontSize: '18px' }}>₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div style={S.addressRow}>
                                        <span>📍</span>
                                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{order.deliveryAddress || 'N/A'}</span>
                                    </div>

                                    {partner ? (
                                        <div style={{ ...S.detailCard, margin: '0 22px 12px', borderLeft: '3px solid #10b981', background: 'rgba(16,185,129,0.05)' }}>
                                            <div style={{ ...S.iconBox, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>🛵</div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ ...S.detailLabel, color: '#10b981' }}>Delivery Partner</p>
                                                <p style={S.detailName}>{partner.name}</p>
                                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                    <span style={S.detailInfo}>📞 {partner.phone}</span>
                                                    <span style={S.detailInfo}>🏍️ {partner.vehicleType}</span>
                                                    <span style={S.detailInfo}>⭐ {partner.rating || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Action Buttons */}
                                    <div style={S.btnRow}>
                                        {nextStatus && (
                                            <button style={S.confirmBtn} onClick={() => updateStatus(order.id, nextStatus)}>
                                                ✅ Mark as {nextStatus}
                                            </button>
                                        )}
                                        {order.status === 'PLACED' && (
                                            <button style={S.cancelBtn} onClick={() => updateStatus(order.id, 'CANCELLED')}>
                                                ❌ Cancel
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
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
        maxWidth: '860px', margin: '0 auto 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    avatar: {
        width: '56px', height: '56px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #ff4500, #ff6b35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
    },
    title: { color: '#f1f5f9', fontSize: '24px', fontWeight: '800', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '14px', margin: '4px 0 0' },
    refreshBadge: {
        background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
        padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
    },
    statsGrid: {
        maxWidth: '860px', margin: '0 auto 20px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
    },
    statCard: {
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '18px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    },
    statNum: { fontSize: '26px', fontWeight: '800', lineHeight: 1 },
    statLabel: { color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' },
    filterRow: {
        maxWidth: '860px', margin: '0 auto 20px',
        display: 'flex', gap: '8px', flexWrap: 'wrap',
    },
    filterBtn: {
        padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
        fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px',
    },
    filterCount: (isActive) => ({
        background: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,69,0,0.2)',
        color: isActive ? 'white' : '#ff4500',
        padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: '700',
    }),
    orderList: { maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
    emptyBox: {
        textAlign: 'center', padding: '60px',
        background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)',
        borderRadius: '20px',
    },
    card: {
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', overflow: 'hidden',
    },
    cardStripe: { height: '3px' },
    cardHeader: {
        padding: '18px 22px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    },
    orderId: { color: '#f1f5f9', fontSize: '20px', fontWeight: '800', margin: '0 0 4px' },
    orderDate: { color: '#64748b', fontSize: '12px' },
    statusBadge: { padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    detailCard: {
        margin: '0 22px 12px',
        background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)',
        borderLeft: '3px solid #3b82f6',
        borderRadius: '12px', padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
    },
    iconBox: {
        width: '38px', height: '38px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', flexShrink: 0,
    },
    detailLabel: { fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' },
    detailName: { fontWeight: '700', color: '#f1f5f9', fontSize: '14px', margin: '0 0 4px' },
    detailInfo: { color: '#94a3b8', fontSize: '12px' },
    itemsBox: {
        margin: '0 22px 12px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '12px 14px',
    },
    itemRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    itemName: { flex: 2, color: '#e2e8f0', fontWeight: '600', fontSize: '13px' },
    itemQty: { color: '#64748b', fontSize: '13px' },
    itemPrice: { color: '#ff4500', fontWeight: '700', fontSize: '13px' },
    totalRow: {
        display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px',
        borderTop: '1px solid rgba(255,69,0,0.2)',
    },
    addressRow: {
        padding: '4px 22px 12px',
        display: 'flex', gap: '8px', alignItems: 'flex-start',
    },
    partnerPending: {
        margin: '0 22px 12px',
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
        color: '#6ee7b7', padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
    },
    btnRow: { padding: '4px 22px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
    confirmBtn: {
        flex: 1, padding: '11px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    },
    cancelBtn: {
        padding: '11px 20px',
        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
        color: '#ef4444', borderRadius: '12px',
        fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    },
    preparingMsg: {
        flex: 1, padding: '11px', textAlign: 'center',
        background: 'rgba(139,92,246,0.1)', color: '#a78bfa',
        border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', fontWeight: '700',
    },
    pickedMsg: {
        flex: 1, padding: '11px', textAlign: 'center',
        background: 'rgba(6,182,212,0.1)', color: '#22d3ee',
        border: '1px solid rgba(6,182,212,0.3)', borderRadius: '12px', fontWeight: '700',
    },
    deliveredMsg: {
        flex: 1, padding: '11px', textAlign: 'center',
        background: 'rgba(16,185,129,0.1)', color: '#10b981',
        border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', fontWeight: '700',
    },
};