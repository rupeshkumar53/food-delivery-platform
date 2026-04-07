import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../services/restaurantService';
import { getRecommendations } from '../services/aiService';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [city, setCity] = useState('Noida');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadRestaurants();
        loadAiRecommendations(); // ← isLoggedIn condition hatayi
    }, []);

    const loadRestaurants = async () => {
        setLoading(true); setError('');
        try {
            const data = await getRestaurants(city);
            setRestaurants(data || []);
        } catch {
            setError('Restaurants load nahi hue!');
        } finally {
            setLoading(false);
        }
    };

    const loadAiRecommendations = async () => {
        setAiLoading(true);
        try {
            const data = await getRecommendations({
                customerId: 1,
                pastOrders: 'Pizza, Burger, Biryani',
                city,
                timeOfDay: 'Evening',
                weather: 'Hot'
            });
            console.log("AI FULL:", JSON.stringify(data));

            // ✅ Sabhi possible response structures handle karo
            const recs =
                data?.recommendations ||
                data?.data?.recommendations ||
                data?.result?.recommendations ||
                (Array.isArray(data) ? data : []);

            setRecommendations(recs);
        } catch (err) {
            console.log('AI error:', err?.response?.status, err?.response?.data);
        } finally {
            setAiLoading(false);
        }
    };

    const cuisines = ['ALL', ...new Set(restaurants.map(r => r.cuisineType).filter(Boolean))];
    const filtered = filter === 'ALL' ? restaurants : restaurants.filter(r => r.cuisineType === filter);
    const avgDelivery = restaurants.length
        ? Math.round(restaurants.reduce((a, r) => a + (r.avgDeliveryTime || 0), 0) / restaurants.length)
        : 0;
    const minOrder = restaurants.length
        ? Math.min(...restaurants.map(r => r.minimumOrder || 0))
        : 0;

    return (
        <div style={S.page}>
            {/* ── Hero ── */}
            <div style={S.hero}>
                <div style={S.hbc1} />
                <div style={S.hbc2} />
                <div style={S.gridBg} />
                <div style={S.heroInner}>
                    <div style={S.heroLeft}>
                        <div style={S.heroPill}>
                            <div style={S.pillDot} />
                            <span style={S.pillText}>Fast Delivery · Fresh Food</span>
                        </div>
                        <h1 style={S.heroTitle}>
                            Hungry?<br />
                            <span style={{ color: '#ff4500' }}>We Got You.</span>
                        </h1>
                        <p style={S.heroSub}>
                            Best restaurants in your city,<br />
                            delivered hot and fast to your door.
                        </p>
                        <div style={S.searchBar}>
                            <span style={S.searchIcon}>📍</span>
                            <input
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="Enter your city..."
                                style={S.searchInput}
                                onKeyDown={e => e.key === 'Enter' && loadRestaurants()}
                            />
                            <button onClick={loadRestaurants} style={S.searchBtn}>Search</button>
                        </div>
                        <div style={S.heroStats}>
                            <div style={S.stat}>
                                <span style={S.statNum}>{restaurants.length}</span>
                                <span style={S.statLbl}>Restaurants</span>
                            </div>
                            <div style={S.statDivider} />
                            <div style={S.stat}>
                                <span style={S.statNum}>
                                    {avgDelivery}
                                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>min</span>
                                </span>
                                <span style={S.statLbl}>Avg Delivery</span>
                            </div>
                            <div style={S.statDivider} />
                            <div style={S.stat}>
                                <span style={S.statNum}>₹{minOrder}</span>
                                <span style={S.statLbl}>Min Order</span>
                            </div>
                        </div>
                    </div>
                    <div style={S.heroArt}>🍕</div>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={S.content}>

                {/* ── AI Picks ── */}
                {aiLoading && (
                    <div style={S.aiSection}>
                        <div style={S.aiHeader}>
                            <h2 style={S.secTitle}>🤖 AI Picks For You</h2>
                            <span style={S.aiBadge}>Loading...</span>
                        </div>
                        <div style={S.aiGrid}>
                            {[1,2,3,4].map(i => (
                                <div key={i} style={{ ...S.aiCard, opacity: 0.4 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', margin: '0 auto 10px' }} />
                                    <div style={{ height: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 6 }} />
                                    <div style={{ height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 6, width: '60%', margin: '0 auto' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!aiLoading && recommendations.length > 0 && (
                    <div style={S.aiSection}>
                        <div style={S.aiHeader}>
                            <h2 style={S.secTitle}>🤖 AI Picks For You</h2>
                            <span style={S.aiBadge}>Powered by AI</span>
                        </div>
                        <div style={S.aiGrid}>
                            {recommendations.map((item, i) => (
                                <div key={i} style={S.aiCard}>
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>
                                        {['🍕','🍜','🍛','🍔','🌮','🍣','🥗','🍝'][i % 8]}
                                    </div>
                                    <div style={S.aiName}>{item.itemName || item.name || item.item}</div>
                                    <div style={S.aiRest}>{item.restaurantName || item.restaurant}</div>
                                    <div style={S.aiPrice}>{item.estimatedPrice || item.price}</div>
                                    {item.reason && (
                                        <div style={S.aiReason}>{item.reason}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Cuisine Filters ── */}
                {cuisines.length > 1 && (
                    <div style={S.filters}>
                        {cuisines.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilter(c)}
                                style={{
                                    ...S.chip,
                                    background: filter === c ? '#ff4500' : 'transparent',
                                    color: filter === c ? '#fff' : 'rgba(255,255,255,0.55)',
                                    borderColor: filter === c ? '#ff4500' : 'rgba(255,255,255,0.1)',
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Section Header ── */}
                <div style={S.secHeader}>
                    <h2 style={S.secTitle}>🏪 Restaurants in {city}</h2>
                    <span style={S.countBadge}>{filtered.length} found</span>
                </div>

                {loading && (
                    <div style={S.loadBox}>
                        <div style={S.spinner} />
                    </div>
                )}
                {error && <div style={S.errorBox}>{error}</div>}
                {!loading && filtered.length === 0 && !error && (
                    <div style={S.emptyBox}>
                        <p style={{ fontSize: 48 }}>🔍</p>
                        <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>
                            No restaurants found in {city}
                        </p>
                    </div>
                )}

                {/* ── Restaurant Grid ── */}
                <div style={S.grid}>
                    {filtered.map(r => (
                        <div
                            key={r.id}
                            style={{
                                ...S.card,
                                opacity: r.isOpen ? 1 : 0.55,
                                cursor: r.isOpen ? 'pointer' : 'not-allowed',
                            }}
                            onClick={() => {
                                if (!r.isOpen) return alert('🚫 This restaurant is currently closed!');
                                navigate(`/restaurant/${r.id}`);
                            }}
                        >
                            <div style={S.cardImg}>
                                <span style={{ fontSize: 52, opacity: 0.7 }}>🍽️</span>
                                {!r.isOpen && (
                                    <div style={S.closedOverlay}>
                                        <span style={S.closedText}>CLOSED</span>
                                    </div>
                                )}
                                <span style={S.cuisineTag}>{r.cuisineType}</span>
                            </div>
                            <div style={S.cardBody}>
                                <div style={S.cardName}>{r.name}</div>
                                <div style={S.meta}>
                                    <span style={S.metaChip}>⭐ {r.rating || '4.0'}</span>
                                    <span style={S.metaChip}>🕐 {r.avgDeliveryTime} min</span>
                                    <span style={S.metaChip}>📍 {r.city}</span>
                                </div>
                                <div style={S.cardFooter}>
                                    <span style={S.minOrder}>Min ₹{r.minimumOrder}</span>
                                    <span style={r.isOpen ? S.statusOpen : S.statusClosed}>
                                        ● {r.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const S = {
    page: {
        minHeight: '100vh',
        background: '#080808',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    },
    hero: {
        background: '#080808',
        padding: '52px 40px 48px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    hbc1: {
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,69,0,0.12) 0%, transparent 65%)',
        top: -200, right: -100, pointerEvents: 'none',
    },
    hbc2: {
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,160,0,0.07) 0%, transparent 65%)',
        bottom: -150, left: -100, pointerEvents: 'none',
    },
    gridBg: {
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
    },
    heroInner: {
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 40, position: 'relative', zIndex: 1,
    },
    heroLeft: { maxWidth: 580 },
    heroPill: {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.25)',
        borderRadius: 100, padding: '6px 16px', marginBottom: 20,
    },
    pillDot: { width: 6, height: 6, borderRadius: '50%', background: '#ff4500' },
    pillText: {
        fontSize: 11, color: '#ff7a45', fontWeight: 600,
        letterSpacing: '.1em', textTransform: 'uppercase',
    },
    heroTitle: {
        fontFamily: "'Syne', sans-serif",
        fontSize: 52, fontWeight: 900, color: '#fff',
        lineHeight: 1.05, marginBottom: 14,
    },
    heroSub: {
        fontSize: 15, color: 'rgba(255,255,255,0.5)',
        marginBottom: 32, fontWeight: 300, lineHeight: 1.6,
    },
    searchBar: {
        display: 'flex', maxWidth: 500,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, overflow: 'hidden',
    },
    searchIcon: { display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 16 },
    searchInput: {
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        color: '#fff', fontSize: 14, padding: '14px 0',
        fontFamily: "'DM Sans', sans-serif",
    },
    searchBtn: {
        background: 'linear-gradient(135deg, #ff4500, #ff7a18)',
        color: '#fff', border: 'none', padding: '0 24px',
        fontSize: 13, fontFamily: "'Syne', sans-serif",
        fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer',
    },
    heroStats: { display: 'flex', gap: 28, marginTop: 32, alignItems: 'center' },
    stat: { display: 'flex', flexDirection: 'column' },
    statNum: {
        fontFamily: "'Syne', sans-serif",
        fontSize: 22, fontWeight: 800, color: '#fff',
    },
    statLbl: {
        fontSize: 11, color: 'rgba(255,255,255,0.35)',
        marginTop: 2, textTransform: 'uppercase', letterSpacing: '.06em',
    },
    statDivider: { width: 1, height: 36, background: 'rgba(255,255,255,0.08)' },
    heroArt: { fontSize: 120, opacity: .06, userSelect: 'none', flexShrink: 0 },
    content: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px' },
    aiSection: { marginBottom: 40 },
    aiHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
    aiBadge: {
        background: 'linear-gradient(135deg,#6d28d9,#8b5cf6)',
        color: '#fff', padding: '4px 12px', borderRadius: 100,
        fontSize: 11, fontWeight: 700,
    },
    aiGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 12,
    },
    aiCard: {
        background: '#111', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 16, textAlign: 'center',
    },
    aiName: { fontSize: 13, color: '#e2e8f0', fontWeight: 600, marginBottom: 4 },
    aiRest: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 },
    aiPrice: { fontSize: 13, color: '#ff4500', fontWeight: 700 },
    aiReason: {
        fontSize: 10, color: 'rgba(255,255,255,0.25)',
        marginTop: 6, lineHeight: 1.4,
    },
    filters: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 },
    chip: {
        padding: '8px 18px', borderRadius: 100,
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
        border: '1px solid', fontFamily: "'DM Sans', sans-serif",
        transition: 'all .15s',
    },
    secHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
    },
    secTitle: {
        fontFamily: "'Syne', sans-serif",
        fontSize: 20, fontWeight: 800, color: '#fff', margin: 0,
    },
    countBadge: {
        background: 'rgba(255,69,0,0.12)', border: '1px solid rgba(255,69,0,0.25)',
        color: '#ff7a45', padding: '4px 14px', borderRadius: 100,
        fontSize: 12, fontWeight: 700,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: 18,
    },
    card: {
        background: '#111', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, overflow: 'hidden',
        transition: 'border-color .2s, transform .2s',
    },
    cardImg: {
        height: 130, background: '#181818',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative',
    },
    closedOverlay: {
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    closedText: {
        fontFamily: "'Syne', sans-serif",
        fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '.12em',
    },
    cuisineTag: {
        position: 'absolute', bottom: 10, left: 12,
        background: 'rgba(255,69,0,0.88)', color: '#fff',
        padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
    },
    cardBody: { padding: 16 },
    cardName: {
        fontFamily: "'Syne', sans-serif",
        fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 10,
    },
    meta: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
    metaChip: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.55)',
        padding: '3px 10px', borderRadius: 100, fontSize: 11,
    },
    cardFooter: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    minOrder: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
    statusOpen: {
        background: 'rgba(16,185,129,0.12)',
        border: '1px solid rgba(16,185,129,0.25)',
        color: '#6ee7b7', padding: '3px 10px',
        borderRadius: 100, fontSize: 11, fontWeight: 700,
    },
    statusClosed: {
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid rgba(239,68,68,0.25)',
        color: '#fca5a5', padding: '3px 10px',
        borderRadius: 100, fontSize: 11, fontWeight: 700,
    },
    loadBox: { textAlign: 'center', padding: 60 },
    spinner: {
        width: 36, height: 36, margin: '0 auto',
        border: '3px solid rgba(255,69,0,0.15)',
        borderTopColor: '#ff4500', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    errorBox: {
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.25)',
        color: '#fca5a5', padding: 16, borderRadius: 14,
        textAlign: 'center', marginBottom: 20,
    },
    emptyBox: { textAlign: 'center', padding: 60 },
};