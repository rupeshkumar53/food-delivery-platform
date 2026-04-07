import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

// ✅ Admin secret key — sirf tum jante ho
const ADMIN_SECRET = 'RupeshsahhFOODDelivery@ADMIN2026';

function Register() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        country: '',
        role: 'CUSTOMER',
        adminSecret: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSecret, setShowSecret] =
        useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Error clear on change
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // ✅ ADMIN secret key check
        if (formData.role === 'ADMIN') {
            if (!formData.adminSecret) {
                setError(
                    'Admin secret key required!');
                return;
            }
            if (formData.adminSecret !==
                    ADMIN_SECRET) {
                setError(
                    '❌ Invalid admin secret key!');
                return;
            }
        }

        setLoading(true);
        try {
            // adminSecret backend ko nahi bhejo
            const {
                adminSecret,
                ...dataToSend
            } = formData;

            const data = await register(dataToSend);
            handleLogin(data);

            // Role ke hisaab se redirect
            if (data.role === 'ADMIN') {
                navigate('/admin');
            } else if (data.role === 'RESTAURANT') {
                navigate('/add-restaurant');
            } else if (data.role === 'DELIVERY') {
                navigate('/delivery-register');
            } else {
                navigate('/home');
            }
        } catch (err) {
            const msg = err?.response?.data?.message
                || err?.message
                || 'Registration failed!';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'CUSTOMER':   return '🛒';
            case 'RESTAURANT': return '🍽️';
            case 'DELIVERY':   return '🛵';
            case 'ADMIN':      return '👑';
            default:           return '👤';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'CUSTOMER':   return '#3b82f6';
            case 'RESTAURANT': return '#f59e0b';
            case 'DELIVERY':   return '#10b981';
            case 'ADMIN':      return '#ff4500';
            default:           return '#888';
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                {/* Header */}
                <div style={styles.header}>
                    <div style={{
                        ...styles.roleIconBig,
                        backgroundColor:
                            getRoleColor(formData.role)
                            + '22',
                        border: `2px solid ${
                            getRoleColor(formData.role)
                        }44`
                    }}>
                        {getRoleIcon(formData.role)}
                    </div>
                    <h2 style={styles.title}>
                        Join FoodDelivery!
                    </h2>
                    <p style={styles.subtitle}>
                        Create your account
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={styles.errorBox}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Row 1: Name + Phone */}
                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Rupesh Kumar"
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9999999999"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={styles.group}>
                        <label style={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="rupesh@gmail.com"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.group}>
                        <label style={styles.label}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Row 2: City + Country */}
                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}>
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Noida"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="India"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Role Selector */}
                    <div style={styles.group}>
                        <label style={styles.label}>
                            Register As
                        </label>
                        <div style={styles.roleGrid}>
                            {[
                                {
                                    value: 'CUSTOMER',
                                    label: 'Customer',
                                    icon: '🛒',
                                    desc: 'Order food'
                                },
                                {
                                    value: 'RESTAURANT',
                                    label: 'Restaurant',
                                    icon: '🍽️',
                                    desc: 'Sell food'
                                },
                                {
                                    value: 'DELIVERY',
                                    label: 'Delivery',
                                    icon: '🛵',
                                    desc: 'Deliver orders'
                                },
                                {
                                    value: 'ADMIN',
                                    label: 'Admin',
                                    icon: '👑',
                                    desc: 'Manage platform'
                                }
                            ].map(role => (
                                <div
                                    key={role.value}
                                    onClick={() =>
                                        handleChange({
                                            target: {
                                                name: 'role',
                                                value: role.value
                                            }
                                        })}
                                    style={{
                                        ...styles.roleCard,
                                        borderColor:
                                            formData.role ===
                                            role.value
                                            ? getRoleColor(
                                                role.value)
                                            : '#e5e5e5',
                                        backgroundColor:
                                            formData.role ===
                                            role.value
                                            ? getRoleColor(
                                                role.value)
                                              + '12'
                                            : 'white'
                                    }}>
                                    <span style={
                                        styles.roleEmoji}>
                                        {role.icon}
                                    </span>
                                    <span style={{
                                        ...styles.roleLabel,
                                        color:
                                            formData.role ===
                                            role.value
                                            ? getRoleColor(
                                                role.value)
                                            : '#333',
                                        fontWeight:
                                            formData.role ===
                                            role.value
                                            ? 'bold'
                                            : 'normal'
                                    }}>
                                        {role.label}
                                    </span>
                                    <span style={
                                        styles.roleDesc}>
                                        {role.desc}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Admin Secret Key — sirf ADMIN role pe show */}
                    {formData.role === 'ADMIN' && (
                        <div style={{
                            ...styles.group,
                            ...styles.secretBox
                        }}>
                            <label style={{
                                ...styles.label,
                                color: '#ff4500'
                            }}>
                                🔐 Admin Secret Key
                            </label>
                            <p style={styles.secretHint}>
                                Platform admin se secret
                                key lo. Bina key ke ADMIN
                                account nahi banega.
                            </p>
                            <div style={
                                styles.secretInputWrap}>
                                <input
                                    type={showSecret
                                        ? 'text'
                                        : 'password'}
                                    name="adminSecret"
                                    value={
                                        formData.adminSecret}
                                    onChange={handleChange}
                                    placeholder="Secret key yahan paste karo"
                                    style={{
                                        ...styles.input,
                                        borderColor:
                                            formData.adminSecret &&
                                            formData.adminSecret
                                            !== ADMIN_SECRET
                                            ? '#ef4444'
                                            : formData.adminSecret
                                            === ADMIN_SECRET
                                            ? '#10b981'
                                            : '#e5e5e5'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSecret(
                                            !showSecret)}
                                    style={
                                        styles.eyeBtn}>
                                    {showSecret
                                        ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {/* Live validation feedback */}
                            {formData.adminSecret && (
                                <p style={{
                                    fontSize: '12px',
                                    marginTop: '6px',
                                    color:
                                        formData.adminSecret
                                        === ADMIN_SECRET
                                        ? '#10b981'
                                        : '#ef4444'
                                }}>
                                    {formData.adminSecret
                                     === ADMIN_SECRET
                                        ? '✅ Valid key!'
                                        : '❌ Invalid key'}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            backgroundColor:
                                loading
                                ? '#aaa'
                                : getRoleColor(
                                    formData.role),
                            cursor: loading
                                ? 'not-allowed'
                                : 'pointer'
                        }}>
                        {loading
                            ? '⏳ Registering...'
                            : `${getRoleIcon(formData.role)} Register as ${formData.role}`}
                    </button>

                </form>

                {/* Login Link */}
                <p style={styles.loginText}>
                    Already have account?{' '}
                    <Link
                        to="/login"
                        style={styles.loginLink}>
                        Login here
                    </Link>
                </p>

            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────────────

const styles = {
    page: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '90vh',
        backgroundColor: '#f7f8fa',
        padding: '30px 20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '36px',
        borderRadius: '18px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '520px',
        maxWidth: '100%'
    },

    // Header
    header: {
        textAlign: 'center',
        marginBottom: '24px'
    },
    roleIconBig: {
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        margin: '0 auto 12px',
        transition: 'all 0.2s'
    },
    title: {
        color: '#1a1a1a',
        fontSize: '22px',
        fontWeight: 'bold',
        margin: '0 0 4px'
    },
    subtitle: {
        color: '#888',
        fontSize: '14px',
        margin: 0
    },

    // Error
    errorBox: {
        backgroundColor: '#fff0f0',
        border: '1px solid #ffcccc',
        color: '#e53935',
        padding: '12px 16px',
        borderRadius: '10px',
        marginBottom: '16px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
    },

    // Form
    row: {
        display: 'flex',
        gap: '12px'
    },
    group: {
        flex: 1,
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        color: '#444',
        fontWeight: 'bold',
        fontSize: '13px'
    },
    input: {
        width: '100%',
        padding: '11px 14px',
        borderRadius: '10px',
        border: '1.5px solid #e5e5e5',
        fontSize: '14px',
        color: '#333',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.2s'
    },

    // Role Selector Grid
    roleGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '8px'
    },
    roleCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '12px 8px',
        borderRadius: '12px',
        border: '2px solid',
        cursor: 'pointer',
        transition: 'all 0.15s',
        userSelect: 'none'
    },
    roleEmoji: {
        fontSize: '22px'
    },
    roleLabel: {
        fontSize: '12px',
        transition: 'color 0.15s'
    },
    roleDesc: {
        fontSize: '10px',
        color: '#aaa',
        textAlign: 'center'
    },

    // Admin Secret
    secretBox: {
        backgroundColor: '#fff8f6',
        border: '1.5px dashed #ff4500',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px'
    },
    secretHint: {
        fontSize: '12px',
        color: '#888',
        margin: '0 0 10px',
        lineHeight: '1.5'
    },
    secretInputWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    eyeBtn: {
        position: 'absolute',
        right: '10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '4px'
    },

    // Submit
    submitBtn: {
        width: '100%',
        padding: '13px',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: 'bold',
        marginTop: '4px',
        transition: 'background-color 0.2s'
    },

    // Login link
    loginText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#888',
        fontSize: '14px'
    },
    loginLink: {
        color: '#ff4500',
        fontWeight: 'bold',
        textDecoration: 'none'
    }
};

export default Register;