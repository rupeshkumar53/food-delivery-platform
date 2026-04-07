import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const STEPS = [
    { status: 'PLACED',    icon: '📋', label: 'Order Placed',  color: '#f59e0b' },
    { status: 'CONFIRMED', icon: '✅', label: 'Confirmed',      color: '#3b82f6' },
    { status: 'PREPARING', icon: '👨‍🍳', label: 'Preparing',    color: '#8b5cf6' },
    { status: 'PICKED_UP', icon: '🛵', label: 'On the Way',    color: '#06b6d4' },
    { status: 'DELIVERED', icon: '🎉', label: 'Delivered',      color: '#10b981' },
];

export default function OrderTracking() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [partner, setPartner] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrder();
        const interval = setInterval(loadOrder, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const loadOrder = async () => {
        try {
            const res = await API.get(`/api/orders/${id}`);
            setOrder(res.data);
            if (res.data.deliveryPartnerId) loadPartner(res.data.deliveryPartnerId);
            if (res.data.restaurantId) loadRestaurant(res.data.restaurantId);
        } catch { console.log('Error'); }
        finally { setLoading(false); }
    };

    const loadPartner = async (pid) => {
        try { const r = await API.get(`/api/delivery/partner/${pid}`); setPartner(r.data); } catch {}
    };
    const loadRestaurant = async (rid) => {
        try { const r = await API.get(`/api/restaurants/${rid}`); setRestaurant(r.data); } catch {}
    };

    const currentStep = STEPS.findIndex(s => s.status === order?.status);

    if (loading) return (
        <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={S.spinner} />
        </div>
    );

    if (!order) return (
        <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ color:'#64748b', fontSize:'18px' }}>Order not found!</p>
        </div>
    );

    return (
        <div style={S.page}>
            <div style={S.container}>
                <h2 style={S.title}>Track Order #{order.id}</h2>

                <div style={S.stepsCard}>
                    {STEPS.map((step, i) => {
                        const done = i <= currentStep;
                        const active = i === currentStep;
                        return (
                            <div key={step.status} style={S.stepRow}>
                                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                                    <div style={{ ...S.stepCircle, background: done ? step.color : 'rgba(255,255,255,0.08)', border: `2px solid ${done ? step.color : 'rgba(255,255,255,0.1)'}`, transform: active ? 'scale(1.15)' : 'scale(1)' }}>
                                        {step.icon}
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div style={{ ...S.stepLine, background: i < currentStep ? step.color : 'rgba(255,255,255,0.08)' }} />
                                    )}
                                </div>
                                <div style={{ paddingTop:'6px' }}>
                                    <p style={{ ...S.stepLabel, color: done ? '#f1f5f9' : '#475569', fontWeight: active ? '800' : '600' }}>
                                        {step.label} {active && <span style={{ color: step.color }}>← Now</span>}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {order.items && order.items.length > 0 && (
                    <div style={S.card}>
                        <h3 style={S.cardLabel}>Order Items</h3>
                        {order.items.map((item, i) => (
                            <div key={i} style={S.itemRow}>
                                <span style={{ color:'#ff4500' }}>▸</span>
                                <span style={S.itemName}>{item.itemName || item.name || 'Item'}</span>
                                <span style={S.itemQty}>x{item.quantity || 1}</span>
                                <span style={S.itemPrice}>Rs.{(item.unitPrice || item.price || 0) * (item.quantity || 1)}</span>
                            </div>
                        ))}
                        <div style={S.totalRow}>
                            <span style={{ color:'#94a3b8' }}>Total</span>
                            <span style={{ color:'#ff4500', fontWeight:'800', fontSize:'20px' }}>Rs.{order.totalAmount}</span>
                        </div>
                    </div>
                )}

                {restaurant && (
                    <div style={{ ...S.card, borderLeft:'3px solid #f59e0b' }}>
                        <h3 style={S.cardLabel}>Restaurant</h3>
                        <p style={S.infoName}>{restaurant.name}</p>
                        {restaurant.address && <p style={S.infoDetail}>{restaurant.address}</p>}
                    </div>
                )}

                <div style={{ ...S.card, borderLeft:'3px solid #3b82f6' }}>
                    <h3 style={S.cardLabel}>Delivery Address</h3>
                    <p style={S.infoDetail}>{order.deliveryAddress}</p>
                </div>

                {partner && (
                    <div style={{ ...S.card, borderLeft:'3px solid #10b981' }}>
                        <h3 style={S.cardLabel}>Delivery Partner</h3>
                        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                            <div style={S.partnerAvatar}>🧑</div>
                            <div>
                                <p style={S.infoName}>{partner.name}</p>
                                <p style={S.infoDetail}>{partner.phone}</p>
                                <p style={S.infoDetail}>{partner.vehicleType} | Rating: {partner.rating}</p>
                            </div>
                        </div>
                    </div>
                )}

                <p style={{ color:'#475569', fontSize:'12px', textAlign:'center', marginTop:'16px' }}>Auto refreshing every 5s...</p>

                {order.status === 'DELIVERED' && (
                    <div style={S.deliveredBox}>Order Delivered! Enjoy your food!</div>
                )}
                {order.status === 'CANCELLED' && (
                    <div style={S.cancelledBox}>Order Cancelled</div>
                )}
            </div>
        </div>
    );
}

const S = {
    page: { minHeight:'100vh', background:'#0f172a', padding:'32px 20px', fontFamily:"'Segoe UI', sans-serif" },
    container: { maxWidth:'540px', margin:'0 auto' },
    title: { color:'#f1f5f9', fontSize:'24px', fontWeight:'800', marginBottom:'24px', textAlign:'center' },
    spinner: { width:'44px', height:'44px', border:'3px solid rgba(255,69,0,0.2)', borderTopColor:'#ff4500', borderRadius:'50%' },
    stepsCard: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px', padding:'24px', marginBottom:'16px' },
    stepRow: { display:'flex', gap:'16px', alignItems:'flex-start' },
    stepCircle: { width:'44px', height:'44px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 },
    stepLine: { width:'2px', height:'24px', margin:'4px auto' },
    stepLabel: { fontSize:'15px', margin:'0 0 20px' },
    card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'18px', marginBottom:'14px' },
    cardLabel: { color:'#94a3b8', fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 14px' },
    itemRow: { display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' },
    itemName: { flex:2, color:'#e2e8f0', fontWeight:'600', fontSize:'14px' },
    itemQty: { color:'#64748b', fontSize:'13px' },
    itemPrice: { color:'#ff4500', fontWeight:'700', fontSize:'14px' },
    totalRow: { display:'flex', justifyContent:'space-between', marginTop:'12px', paddingTop:'12px', borderTop:'1px solid rgba(255,69,0,0.3)' },
    infoName: { color:'#f1f5f9', fontWeight:'700', fontSize:'16px', margin:'0 0 6px' },
    infoDetail: { color:'#94a3b8', fontSize:'13px', margin:'0 0 4px' },
    partnerAvatar: { width:'54px', height:'54px', background:'rgba(16,185,129,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', flexShrink:0 },
    deliveredBox: { background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', padding:'16px', borderRadius:'14px', textAlign:'center', fontWeight:'700', fontSize:'16px', marginTop:'16px' },
    cancelledBox: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', padding:'16px', borderRadius:'14px', textAlign:'center', fontWeight:'700', marginTop:'16px' },
};