import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    getAllUsers,
    getAllRestaurants,
    getAllDeliveryPartners,
    getAllOrders,
    getAdminStats,
    getAdminLogs,
    deleteUser,
    deleteRestaurant,
    deleteDeliveryPartner,
    deleteOrder,
    updateUserRole,
    toggleRestaurant,
    toggleDeliveryPartner
} from '../services/Adminservice';

// ─────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────

const TABS = [
    { id: 'overview',    label: '📊 Overview' },
    { id: 'users',       label: '👤 Users' },
    { id: 'restaurants', label: '🍽️ Restaurants' },
    { id: 'delivery',    label: '🛵 Delivery' },
    { id: 'orders',      label: '📦 Orders' },
    { id: 'logs',        label: '📋 Logs' },
];

const STATUS_COLORS = {
    PLACED:    '#f59e0b',
    CONFIRMED: '#3b82f6',
    PREPARING: '#8b5cf6',
    PICKED_UP: '#06b6d4',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
};

const ROLE_COLORS = {
    CUSTOMER:   '#3b82f6',
    RESTAURANT: '#f59e0b',
    DELIVERY:   '#10b981',
    ADMIN:      '#ff4500',
};

// ─────────────────────────────────────────────────────
//  SMALL COMPONENTS
// ─────────────────────────────────────────────────────

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div style={{
            ...S.toast,
            backgroundColor:
                type === 'success'
                ? '#10b981' : '#ef4444'
        }}>
            {type === 'success' ? '✅' : '❌'}{' '}
            {message}
        </div>
    );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div style={S.modalOverlay}>
            <div style={S.modal}>
                <div style={S.modalIcon}>⚠️</div>
                <h3 style={S.modalTitle}>
                    Sure karo?
                </h3>
                <p style={S.modalMsg}>{message}</p>
                <div style={S.modalBtns}>
                    <button
                        onClick={onCancel}
                        style={S.cancelBtn}>
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={S.confirmBtn}>
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value,
        sub, color }) {
    return (
        <div style={{
            ...S.statCard,
            borderTop: `3px solid ${color}`
        }}>
            <div style={{
                ...S.statIcon,
                background: color + '22'
            }}>
                {icon}
            </div>
            <div>
                <p style={{
                    ...S.statValue, color }}>
                    {value ?? '—'}
                </p>
                <p style={S.statLabel}>
                    {title}
                </p>
                {sub && (
                    <p style={S.statSub}>{sub}</p>
                )}
            </div>
        </div>
    );
}

function Badge({ label, color }) {
    return (
        <span style={{
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: color + '22',
            color: color,
            border: `1px solid ${color}44`,
            whiteSpace: 'nowrap'
        }}>
            {label}
        </span>
    );
}

function SearchBar({ value, onChange,
        placeholder }) {
    return (
        <div style={S.searchWrap}>
            <span>🔍</span>
            <input
                value={value}
                onChange={e =>
                    onChange(e.target.value)}
                placeholder={placeholder}
                style={S.searchInput}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    style={S.clearBtn}>
                    ✕
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────

export default function AdminDashboard() {

    const [tab, setTab] =
        useState('overview');
    const [loading, setLoading] =
        useState(true);
    const [toast, setToast] =
        useState(null);
    const [confirm, setConfirm] =
        useState(null);
    const [search, setSearch] =
        useState('');
    const [roleFilter, setRoleFilter] =
        useState('ALL');

    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] =
        useState([]);
    const [partners, setPartners] = useState([]);
    const [orders, setOrders] = useState([]);
    const [logs, setLogs] = useState([]);

    // ── Helpers ────────────────────────────────

    const showToast = useCallback(
        (message, type = 'success') => {
            setToast({ message, type });
        }, []);

    const askDelete = (type, id, name) =>
        setConfirm({ type, id, name });

    // ── Load all data ──────────────────────────

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [
                statsRes,
                usersRes,
                restRes,
                partRes,
                ordersRes,
                logsRes
            ] = await Promise.allSettled([
                getAdminStats(),
                getAllUsers(),
                getAllRestaurants(),
                getAllDeliveryPartners(),
                getAllOrders(),
                getAdminLogs(),
            ]);

            if (statsRes.status === 'fulfilled')
                setStats(statsRes.value || {});
            if (usersRes.status === 'fulfilled')
                setUsers(usersRes.value || []);
            if (restRes.status === 'fulfilled')
                setRestaurants(restRes.value || []);
            if (partRes.status === 'fulfilled')
                setPartners(partRes.value || []);
            if (ordersRes.status === 'fulfilled')
                setOrders(ordersRes.value || []);
            if (logsRes.status === 'fulfilled')
                setLogs(logsRes.value || []);

        } catch (err) {
            showToast('Data load failed!', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { loadAll(); }, [loadAll]);

    // ── Tab change: reset search ───────────────

    const handleTabChange = (id) => {
        setTab(id);
        setSearch('');
        setRoleFilter('ALL');
    };

    // ── Delete handler ─────────────────────────

    const handleDeleteConfirm = async () => {
        if (!confirm) return;
        const { type, id } = confirm;
        setConfirm(null);
        try {
            if (type === 'user')
                await deleteUser(id);
            else if (type === 'restaurant')
                await deleteRestaurant(id);
            else if (type === 'partner')
                await deleteDeliveryPartner(id);
            else if (type === 'order')
                await deleteOrder(id);

            showToast('Deleted successfully! ✅');
            loadAll();
        } catch (err) {
            showToast(
                'Delete failed! Try again.',
                'error');
        }
    };

    // ── Role update ────────────────────────────

    const handleRoleChange = async (
            userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            showToast(
                `Role updated to ${newRole}!`);
            loadAll();
        } catch (err) {
            showToast(
                'Role update failed!', 'error');
        }
    };

    // ── Restaurant toggle ──────────────────────

    const handleToggleRestaurant = async (id) => {
        try {
            await toggleRestaurant(id);
            showToast('Restaurant status updated!');
            loadAll();
        } catch (err) {
            showToast('Toggle failed!', 'error');
        }
    };

    // ── Partner toggle ─────────────────────────

    const handleTogglePartner = async (id) => {
        try {
            await toggleDeliveryPartner(id);
            showToast('Partner status updated!');
            loadAll();
        } catch (err) {
            showToast('Toggle failed!', 'error');
        }
    };

    // ── Filtered lists ─────────────────────────

    const filteredUsers = users.filter(u => {
        const matchSearch = !search ||
            (u.name || '').toLowerCase()
                .includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase()
                .includes(search.toLowerCase());
        const matchRole =
            roleFilter === 'ALL' ||
            u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const filteredRestaurants =
        restaurants.filter(r =>
            !search ||
            (r.name || '').toLowerCase()
                .includes(search.toLowerCase()) ||
            (r.city || '').toLowerCase()
                .includes(search.toLowerCase())
        );

    const filteredPartners =
        partners.filter(p =>
            !search ||
            (p.name || '').toLowerCase()
                .includes(search.toLowerCase()) ||
            (p.phone || '')
                .includes(search)
        );

    const filteredOrders =
        orders.filter(o =>
            !search ||
            String(o.id).includes(search) ||
            (o.deliveryAddress || '')
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    // ── Loading screen ─────────────────────────

    if (loading) return (
        <div style={S.loadingWrap}>
            <div style={S.spinner} />
            <p style={S.loadingText}>
                Admin data load ho raha hai...
            </p>
        </div>
    );

    // ─────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────

    return (
        <div style={S.page}>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Confirm Modal */}
            {confirm && (
                <ConfirmModal
                    message={`"${confirm.name}" ko permanently delete karna chahte ho?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() =>
                        setConfirm(null)}
                />
            )}

            {/* ── Header ─────────────────────── */}
            <div style={S.header}>
                <div style={S.headerLeft}>
                    <div style={S.crown}>👑</div>
                    <div>
                        <h1 style={S.title}>
                            Admin Dashboard
                        </h1>
                        <p style={S.subtitle}>
                            Complete platform control
                        </p>
                    </div>
                </div>
                <button
                    onClick={loadAll}
                    style={S.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {/* ── Tabs ───────────────────────── */}
            <div style={S.tabBar}>
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() =>
                            handleTabChange(t.id)}
                        style={{
                            ...S.tabBtn,
                            backgroundColor:
                                tab === t.id
                                ? '#ff4500'
                                : 'transparent',
                            color: tab === t.id
                                ? 'white'
                                : '#888',
                            borderColor:
                                tab === t.id
                                ? '#ff4500'
                                : '#eee'
                        }}>
                        {t.label}
                        {t.id !== 'overview' &&
                         t.id !== 'logs' && (
                            <span style={{
                                ...S.tabCount,
                                backgroundColor:
                                    tab === t.id
                                    ? 'rgba(255,255,255,0.25)'
                                    : '#f0f0f0',
                                color:
                                    tab === t.id
                                    ? 'white'
                                    : '#888'
                            }}>
                                {t.id === 'users'
                                    ? users.length
                                : t.id === 'restaurants'
                                    ? restaurants.length
                                : t.id === 'delivery'
                                    ? partners.length
                                : orders.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Search + Filter ─────────────── */}
            {tab !== 'overview' &&
             tab !== 'logs' && (
                <div style={S.filterRow}>
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder={
                            tab === 'users'
                                ? 'Name ya email...'
                            : tab === 'restaurants'
                                ? 'Restaurant ya city...'
                            : tab === 'delivery'
                                ? 'Partner ya phone...'
                            : 'Order ID ya address...'
                        }
                    />
                    {tab === 'users' && (
                        <div style={S.roleFilters}>
                            {['ALL', 'CUSTOMER',
                              'RESTAURANT',
                              'DELIVERY',
                              'ADMIN'].map(r => (
                                <button
                                    key={r}
                                    onClick={() =>
                                        setRoleFilter(r)}
                                    style={{
                                        ...S.roleBtn,
                                        backgroundColor:
                                            roleFilter === r
                                            ? '#ff4500'
                                            : '#f5f5f5',
                                        color:
                                            roleFilter === r
                                            ? 'white'
                                            : '#555'
                                    }}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ════════════════════════════════════
                OVERVIEW TAB
            ════════════════════════════════════ */}
            {tab === 'overview' && (
                <div>
                    {/* Stats Grid */}
                    <div style={S.statsGrid}>
                        <StatCard
                            icon="👤"
                            title="Total Users"
                            value={stats.totalUsers ?? users.length}
                            sub={`${users.filter(u => u.role === 'CUSTOMER').length} customers`}
                            color="#3b82f6"
                        />
                        <StatCard
                            icon="🍽️"
                            title="Restaurants"
                            value={stats.totalRestaurants ?? restaurants.length}
                            sub={`${stats.openRestaurants ?? restaurants.filter(r => r.isOpen).length} open`}
                            color="#f59e0b"
                        />
                        <StatCard
                            icon="🛵"
                            title="Delivery Partners"
                            value={stats.totalDeliveryPartners ?? partners.length}
                            sub={`${stats.availablePartners ?? partners.filter(p => p.isAvailable).length} available`}
                            color="#10b981"
                        />
                        <StatCard
                            icon="📦"
                            title="Total Orders"
                            value={stats.totalOrders ?? orders.length}
                            sub={`${stats.activeOrders ?? orders.filter(o => ['PLACED','CONFIRMED','PREPARING','PICKED_UP'].includes(o.status)).length} active`}
                            color="#8b5cf6"
                        />
                        <StatCard
                            icon="💰"
                            title="Revenue"
                            value={`₹${Math.round(stats.totalRevenue ?? orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + (o.totalAmount || 0), 0))}`}
                            sub="Delivered orders"
                            color="#ff4500"
                        />
                        <StatCard
                            icon="🔥"
                            title="Active Orders"
                            value={stats.activeOrders ?? orders.filter(o => ['PLACED','CONFIRMED','PREPARING','PICKED_UP'].includes(o.status)).length}
                            sub="In progress"
                            color="#06b6d4"
                        />
                    </div>

                    {/* Order Status Breakdown */}
                    <div style={S.card}>
                        <h2 style={S.cardTitle}>
                            📊 Order Status Breakdown
                        </h2>
                        <div style={S.statusGrid}>
                            {Object.entries(
                                STATUS_COLORS
                            ).map(([status, color]) => {
                                const count =
                                    orders.filter(
                                        o => o.status ===
                                        status).length;
                                const pct =
                                    orders.length > 0
                                    ? Math.round(
                                        count /
                                        orders.length *
                                        100)
                                    : 0;
                                return (
                                    <div
                                        key={status}
                                        style={S.statusBox}>
                                        <div style={
                                            S.statusTop}>
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#888',
                                                fontWeight: 'bold'
                                            }}>
                                                {status}
                                            </span>
                                            <span style={{
                                                fontSize: '22px',
                                                fontWeight: 'bold',
                                                color
                                            }}>
                                                {count}
                                            </span>
                                        </div>
                                        <div style={
                                            S.progressBg}>
                                            <div style={{
                                                height: '100%',
                                                borderRadius: '2px',
                                                width: `${Math.max(pct, 2)}%`,
                                                backgroundColor: color,
                                                transition: 'width 0.5s'
                                            }} />
                                        </div>
                                        <span style={{
                                            fontSize: '11px',
                                            color: '#aaa'
                                        }}>
                                            {pct}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Orders + Users by Role */}
                    <div style={S.twoCol}>
                        <div style={S.card}>
                            <h3 style={S.cardTitle}>
                                👤 Users by Role
                            </h3>
                            {['CUSTOMER',
                              'RESTAURANT',
                              'DELIVERY',
                              'ADMIN'].map(role => (
                                <div
                                    key={role}
                                    style={S.miniRow}>
                                    <Badge
                                        label={role}
                                        color={
                                            ROLE_COLORS[role]
                                        }
                                    />
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: ROLE_COLORS[role]
                                    }}>
                                        {users.filter(
                                            u => u.role ===
                                            role).length}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={S.card}>
                            <h3 style={S.cardTitle}>
                                📦 Recent Orders
                            </h3>
                            {orders.slice(0, 6)
                                .map(o => (
                                <div
                                    key={o.id}
                                    style={S.miniRow}>
                                    <span style={{
                                        color: '#555',
                                        fontSize: '13px'
                                    }}>
                                        #{o.id} —{' '}
                                        {(o.deliveryAddress ||
                                          '').substring(0, 20)}
                                        ...
                                    </span>
                                    <Badge
                                        label={o.status}
                                        color={
                                            STATUS_COLORS[
                                                o.status
                                            ] || '#888'
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════
                USERS TAB
            ════════════════════════════════════ */}
            {tab === 'users' && (
                <div style={S.card}>
                    <h2 style={S.cardTitle}>
                        👤 All Users ({filteredUsers.length})
                    </h2>

                    {filteredUsers.length === 0 ? (
                        <div style={S.empty}>
                            Koi user nahi mila
                        </div>
                    ) : (
                        <div style={S.tableWrap}>
                            {/* Table Header */}
                            <div style={{
                                ...S.tableRow,
                                backgroundColor: '#f9f9f9',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                color: '#888'
                            }}>
                                <span style={{flex: 0.3}}>
                                    #
                                </span>
                                <span style={{flex: 2}}>
                                    Name / Email
                                </span>
                                <span style={{flex: 1.5}}>
                                    Phone / City
                                </span>
                                <span style={{flex: 1}}>
                                    Role
                                </span>
                                <span style={{
                                    flex: 1,
                                    textAlign: 'right'
                                }}>
                                    Action
                                </span>
                            </div>

                            {/* Table Rows */}
                            {filteredUsers.map(
                                (user, i) => (
                                <div
                                    key={user.id || i}
                                    style={S.tableRow}>
                                    <span style={{
                                        flex: 0.3,
                                        color: '#aaa',
                                        fontSize: '12px'
                                    }}>
                                        {i + 1}
                                    </span>

                                    <div style={{flex: 2}}>
                                        <p style={S.rowName}>
                                            {user.name || 'N/A'}
                                        </p>
                                        <p style={S.rowSub}>
                                            {user.email || '—'}
                                        </p>
                                    </div>

                                    <div style={{flex: 1.5}}>
                                        <p style={S.rowInfo}>
                                            {user.phone || '—'}
                                        </p>
                                        <p style={S.rowSub}>
                                            {user.city || '—'}
                                        </p>
                                    </div>

                                    <div style={{flex: 1}}>
                                        <select
                                            value={
                                                user.role ||
                                                'CUSTOMER'
                                            }
                                            onChange={e =>
                                                handleRoleChange(
                                                    user.id,
                                                    e.target.value
                                                )}
                                            style={{
                                                ...S.roleSelect,
                                                color: ROLE_COLORS[
                                                    user.role
                                                ] || '#333',
                                                borderColor:
                                                    (ROLE_COLORS[
                                                        user.role
                                                    ] || '#ddd') + '88'
                                            }}>
                                            {['CUSTOMER',
                                              'RESTAURANT',
                                              'DELIVERY',
                                              'ADMIN'
                                            ].map(r => (
                                                <option
                                                    key={r}
                                                    value={r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{
                                        flex: 1,
                                        textAlign: 'right'
                                    }}>
                                        <button
                                            onClick={() =>
                                                askDelete(
                                                    'user',
                                                    user.id,
                                                    user.name ||
                                                    user.email
                                                )}
                                            style={S.deleteBtn}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ════════════════════════════════════
                RESTAURANTS TAB
            ════════════════════════════════════ */}
            {tab === 'restaurants' && (
                <div style={S.card}>
                    <h2 style={S.cardTitle}>
                        🍽️ All Restaurants ({filteredRestaurants.length})
                    </h2>

                    {filteredRestaurants.length === 0 ? (
                        <div style={S.empty}>
                            Koi restaurant nahi mila
                        </div>
                    ) : (
                        <div style={S.tableWrap}>
                            <div style={{
                                ...S.tableRow,
                                backgroundColor: '#f9f9f9',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                color: '#888'
                            }}>
                                <span style={{flex: 0.3}}>
                                    #
                                </span>
                                <span style={{flex: 2}}>
                                    Name / Cuisine
                                </span>
                                <span style={{flex: 1.5}}>
                                    City / Time
                                </span>
                                <span style={{flex: 1}}>
                                    Min Order
                                </span>
                                <span style={{flex: 1}}>
                                    Status
                                </span>
                                <span style={{
                                    flex: 1.2,
                                    textAlign: 'right'
                                }}>
                                    Actions
                                </span>
                            </div>

                            {filteredRestaurants.map(
                                (r, i) => (
                                <div
                                    key={r.id || i}
                                    style={S.tableRow}>
                                    <span style={{
                                        flex: 0.3,
                                        color: '#aaa',
                                        fontSize: '12px'
                                    }}>
                                        {i + 1}
                                    </span>

                                    <div style={{flex: 2}}>
                                        <p style={S.rowName}>
                                            {r.name}
                                        </p>
                                        <p style={S.rowSub}>
                                            {r.cuisineType}
                                        </p>
                                    </div>

                                    <div style={{flex: 1.5}}>
                                        <p style={S.rowInfo}>
                                            {r.city || '—'}
                                        </p>
                                        <p style={S.rowSub}>
                                            ⏱ {r.avgDeliveryTime} min
                                        </p>
                                    </div>

                                    <span style={{
                                        flex: 1,
                                        color: '#ff4500',
                                        fontWeight: 'bold'
                                    }}>
                                        ₹{r.minimumOrder}
                                    </span>

                                    <div style={{flex: 1}}>
                                        <button
                                            onClick={() =>
                                                handleToggleRestaurant(
                                                    r.id)}
                                            style={{
                                                ...S.toggleBtn,
                                                backgroundColor:
                                                    r.isOpen
                                                    ? '#e8f5e9'
                                                    : '#ffebee',
                                                color:
                                                    r.isOpen
                                                    ? '#2e7d32'
                                                    : '#c62828',
                                                borderColor:
                                                    r.isOpen
                                                    ? '#a5d6a7'
                                                    : '#ef9a9a'
                                            }}>
                                            {r.isOpen
                                                ? '✅ Open'
                                                : '❌ Closed'}
                                        </button>
                                    </div>

                                    <div style={{
                                        flex: 1.2,
                                        textAlign: 'right'
                                    }}>
                                        <button
                                            onClick={() =>
                                                askDelete(
                                                    'restaurant',
                                                    r.id,
                                                    r.name
                                                )}
                                            style={S.deleteBtn}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ════════════════════════════════════
                DELIVERY TAB
            ════════════════════════════════════ */}
            {tab === 'delivery' && (
                <div style={S.card}>
                    <h2 style={S.cardTitle}>
                        🛵 Delivery Partners ({filteredPartners.length})
                    </h2>

                    {filteredPartners.length === 0 ? (
                        <div style={S.empty}>
                            Koi partner nahi mila
                        </div>
                    ) : (
                        <div style={S.tableWrap}>
                            <div style={{
                                ...S.tableRow,
                                backgroundColor: '#f9f9f9',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                color: '#888'
                            }}>
                                <span style={{flex: 0.3}}>
                                    #
                                </span>
                                <span style={{flex: 2}}>
                                    Name / Phone
                                </span>
                                <span style={{flex: 1}}>
                                    Vehicle
                                </span>
                                <span style={{flex: 1}}>
                                    Rating
                                </span>
                                <span style={{flex: 1}}>
                                    Status
                                </span>
                                <span style={{
                                    flex: 1,
                                    textAlign: 'right'
                                }}>
                                    Action
                                </span>
                            </div>

                            {filteredPartners.map(
                                (p, i) => (
                                <div
                                    key={p.id || i}
                                    style={S.tableRow}>
                                    <span style={{
                                        flex: 0.3,
                                        color: '#aaa',
                                        fontSize: '12px'
                                    }}>
                                        {i + 1}
                                    </span>

                                    <div style={{flex: 2}}>
                                        <p style={S.rowName}>
                                            {p.name}
                                        </p>
                                        <p style={S.rowSub}>
                                            📞 {p.phone || '—'}
                                        </p>
                                    </div>

                                    <div style={{flex: 1}}>
                                        <p style={S.rowInfo}>
                                            {p.vehicleType === 'BIKE'
                                                ? '🏍️'
                                            : p.vehicleType === 'SCOOTER'
                                                ? '🛵'
                                                : '🚲'}{' '}
                                            {p.vehicleType}
                                        </p>
                                    </div>

                                    <div style={{flex: 1}}>
                                        <p style={{
                                            ...S.rowInfo,
                                            color: '#f59e0b'
                                        }}>
                                            ⭐ {p.rating || 'N/A'}
                                        </p>
                                        <p style={S.rowSub}>
                                            {p.totalDeliveries || 0} deliveries
                                        </p>
                                    </div>

                                    <div style={{flex: 1}}>
                                        <button
                                            onClick={() =>
                                                handleTogglePartner(
                                                    p.id)}
                                            style={{
                                                ...S.toggleBtn,
                                                backgroundColor:
                                                    p.isAvailable
                                                    ? '#e8f5e9'
                                                    : '#ffebee',
                                                color:
                                                    p.isAvailable
                                                    ? '#2e7d32'
                                                    : '#c62828',
                                                borderColor:
                                                    p.isAvailable
                                                    ? '#a5d6a7'
                                                    : '#ef9a9a'
                                            }}>
                                            {p.isAvailable
                                                ? '✅ Available'
                                                : '❌ Busy'}
                                        </button>
                                    </div>

                                    <div style={{
                                        flex: 1,
                                        textAlign: 'right'
                                    }}>
                                        <button
                                            onClick={() =>
                                                askDelete(
                                                    'partner',
                                                    p.id,
                                                    p.name
                                                )}
                                            style={S.deleteBtn}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ════════════════════════════════════
                ORDERS TAB
            ════════════════════════════════════ */}
            {tab === 'orders' && (
                <div style={S.card}>
                    <h2 style={S.cardTitle}>
                        📦 All Orders ({filteredOrders.length})
                    </h2>

                    {/* Status summary chips */}
                    <div style={S.chipRow}>
                        {Object.entries(STATUS_COLORS)
                            .map(([status, color]) => {
                            const count = orders.filter(
                                o => o.status === status
                            ).length;
                            if (count === 0) return null;
                            return (
                                <Badge
                                    key={status}
                                    label={`${status}: ${count}`}
                                    color={color}
                                />
                            );
                        })}
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div style={S.empty}>
                            Koi order nahi mila
                        </div>
                    ) : (
                        <div style={S.tableWrap}>
                            <div style={{
                                ...S.tableRow,
                                backgroundColor: '#f9f9f9',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                color: '#888'
                            }}>
                                <span style={{flex: 0.5}}>
                                    ID
                                </span>
                                <span style={{flex: 1.5}}>
                                    Customer
                                </span>
                                <span style={{flex: 2}}>
                                    Address
                                </span>
                                <span style={{flex: 0.8}}>
                                    Amount
                                </span>
                                <span style={{flex: 1}}>
                                    Status
                                </span>
                                <span style={{flex: 1}}>
                                    Date
                                </span>
                                <span style={{
                                    flex: 0.6,
                                    textAlign: 'right'
                                }}>
                                    Del
                                </span>
                            </div>

                            {filteredOrders.map(
                                (o, i) => (
                                <div
                                    key={o.id || i}
                                    style={S.tableRow}>
                                    <span style={{
                                        flex: 0.5,
                                        fontWeight: 'bold',
                                        color: STATUS_COLORS[
                                            o.status
                                        ] || '#333',
                                        fontSize: '13px'
                                    }}>
                                        #{o.id}
                                    </span>

                                    <div style={{flex: 1.5}}>
                                        <p style={S.rowName}>
                                            Customer #{o.customerId}
                                        </p>
                                        {o.deliveryPartnerId && (
                                            <p style={S.rowSub}>
                                                🛵 Partner #{o.deliveryPartnerId}
                                            </p>
                                        )}
                                    </div>

                                    <p style={{
                                        flex: 2,
                                        fontSize: '12px',
                                        color: '#666',
                                        paddingRight: '8px'
                                    }}>
                                        {(o.deliveryAddress || '—')
                                            .substring(0, 35)}
                                        {(o.deliveryAddress || '')
                                            .length > 35
                                            ? '...' : ''}
                                    </p>

                                    <span style={{
                                        flex: 0.8,
                                        fontWeight: 'bold',
                                        color: '#ff4500'
                                    }}>
                                        ₹{o.totalAmount}
                                    </span>

                                    <div style={{flex: 1}}>
                                        <Badge
                                            label={o.status}
                                            color={
                                                STATUS_COLORS[
                                                    o.status
                                                ] || '#888'
                                            }
                                        />
                                    </div>

                                    <p style={{
                                        flex: 1,
                                        fontSize: '12px',
                                        color: '#aaa'
                                    }}>
                                        {o.placedAt
                                            ? new Date(o.placedAt)
                                                .toLocaleDateString(
                                                    'en-IN')
                                            : '—'}
                                    </p>

                                    <div style={{
                                        flex: 0.6,
                                        textAlign: 'right'
                                    }}>
                                        <button
                                            onClick={() =>
                                                askDelete(
                                                    'order',
                                                    o.id,
                                                    `Order #${o.id}`
                                                )}
                                            style={{
                                                ...S.deleteBtn,
                                                padding: '6px 10px'
                                            }}>
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ════════════════════════════════════
                LOGS TAB
            ════════════════════════════════════ */}
            {tab === 'logs' && (
                <div style={S.card}>
                    <h2 style={S.cardTitle}>
                        📋 Admin Audit Logs
                    </h2>

                    {logs.length === 0 ? (
                        <div style={S.empty}>
                            Abhi koi log nahi hai
                        </div>
                    ) : (
                        <div style={S.tableWrap}>
                            {logs.map((log, i) => (
                                <div
                                    key={log.id || i}
                                    style={{
                                        ...S.tableRow,
                                        borderLeft:
                                            '3px solid #ff4500'
                                    }}>
                                    <div style={{flex: 2}}>
                                        <p style={S.rowName}>
                                            {log.action}
                                        </p>
                                        <p style={S.rowSub}>
                                            By: {log.performedBy}
                                        </p>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <Badge
                                            label={log.targetType}
                                            color="#8b5cf6"
                                        />
                                    </div>
                                    <p style={{
                                        flex: 2,
                                        fontSize: '13px',
                                        color: '#666'
                                    }}>
                                        {log.details}
                                    </p>
                                    <p style={{
                                        flex: 1,
                                        fontSize: '12px',
                                        color: '#aaa',
                                        textAlign: 'right'
                                    }}>
                                        {log.createdAt
                                            ? new Date(log.createdAt)
                                                .toLocaleString('en-IN')
                                            : '—'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

// ─────────────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────────────

const S = {
    page: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 20px 48px',
        fontFamily: 'sans-serif',
        backgroundColor: '#f7f8fa',
        minHeight: '100vh'
    },

    // Loading
    loadingWrap: {
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    spinner: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid #ffe0d0',
        borderTopColor: '#ff4500',
        animation: 'spin 0.8s linear infinite'
    },
    loadingText: {
        color: '#888',
        marginTop: '14px',
        fontSize: '14px'
    },

    // Header
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
    },
    crown: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: '#ff4500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px'
    },
    title: {
        color: '#1a1a1a',
        fontSize: '24px',
        fontWeight: 'bold',
        margin: 0
    },
    subtitle: {
        color: '#888',
        fontSize: '13px',
        margin: '3px 0 0'
    },
    refreshBtn: {
        backgroundColor: 'white',
        border: '1px solid #ff4500',
        color: '#ff4500',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },

    // Tabs
    tabBar: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px'
    },
    tabBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '9px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 'bold',
        border: '1px solid',
        transition: 'all 0.15s'
    },
    tabCount: {
        padding: '2px 7px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: 'bold'
    },

    // Search + Filter
    filterRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '16px'
    },
    searchWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: '10px',
        padding: '10px 14px'
    },
    searchInput: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        color: '#333',
        backgroundColor: 'transparent'
    },
    clearBtn: {
        background: '#f0f0f0',
        border: 'none',
        color: '#888',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '11px'
    },
    roleFilters: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
    },
    roleBtn: {
        padding: '5px 12px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 'bold'
    },

    // Stats
    statsGrid: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '18px'
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: '14px',
        padding: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    statIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        flexShrink: 0
    },
    statValue: {
        fontSize: '26px',
        fontWeight: 'bold',
        lineHeight: 1,
        margin: '0 0 3px'
    },
    statLabel: {
        color: '#888',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        margin: 0
    },
    statSub: {
        color: '#aaa',
        fontSize: '11px',
        margin: '2px 0 0'
    },

    // Card
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '22px',
        marginBottom: '18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    cardTitle: {
        color: '#1a1a1a',
        fontSize: '17px',
        fontWeight: 'bold',
        margin: '0 0 16px'
    },

    // Overview extras
    statusGrid: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px'
    },
    statusBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        padding: '12px'
    },
    statusTop: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px'
    },
    progressBg: {
        height: '4px',
        backgroundColor: '#eee',
        borderRadius: '2px',
        marginBottom: '4px'
    },
    twoCol: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    miniRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #f5f5f5'
    },
    chipRow: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '14px'
    },

    // Table
    tableWrap: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    tableRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #f0f0f0'
    },
    rowName: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#222',
        margin: '0 0 2px'
    },
    rowSub: {
        fontSize: '12px',
        color: '#aaa',
        margin: 0
    },
    rowInfo: {
        fontSize: '13px',
        color: '#666',
        margin: '0 0 2px'
    },

    // Controls
    roleSelect: {
        backgroundColor: 'white',
        border: '1px solid',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        outline: 'none'
    },
    deleteBtn: {
        backgroundColor: '#fff0f0',
        border: '1px solid #ffcccc',
        color: '#e53935',
        padding: '7px 14px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    toggleBtn: {
        padding: '5px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 'bold',
        border: '1px solid'
    },

    // Toast
    toast: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        color: 'white',
        padding: '13px 20px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
    },

    // Modal
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '18px',
        padding: '32px',
        width: '360px',
        maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    },
    modalIcon: {
        textAlign: 'center',
        fontSize: '44px',
        marginBottom: '14px'
    },
    modalTitle: {
        color: '#1a1a1a',
        textAlign: 'center',
        margin: '0 0 8px',
        fontSize: '18px'
    },
    modalMsg: {
        color: '#666',
        textAlign: 'center',
        margin: '0 0 22px',
        fontSize: '14px'
    },
    modalBtns: {
        display: 'flex',
        gap: '10px'
    },
    cancelBtn: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        color: '#666',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    confirmBtn: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#e53935',
        border: 'none',
        color: 'white',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },

    // Empty
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#aaa',
        fontSize: '16px',
        border: '1px dashed #e0e0e0',
        borderRadius: '12px'
    }
};