import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "../services/restaurantService";

export default function AddRestaurant() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [locationLoaded, setLocationLoaded] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        cuisineType: "",
        address: "",
        city: "",
        latitude: "",
        longitude: "",
        avgDeliveryTime: "",
        minimumOrder: ""
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }));
                    setLocationLoaded(true);
                },
                () => setError("Location access required. Please enable it and reload.")
            );
        }
    }, []);

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.latitude || !formData.longitude) {
            setError("Location not ready!");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await createRestaurant({
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                avgDeliveryTime: parseInt(formData.avgDeliveryTime),
                minimumOrder: parseFloat(formData.minimumOrder)
            });
            setSuccess("Restaurant added successfully!");
            setTimeout(() => navigate("/home"), 2000);
        } catch {
            setError("Failed! Check your details.");
        } finally {
            setLoading(false);
        }
    };

    const CUISINES = ["Italian", "Indian", "Chinese", "Fast Food", "South Indian", "North Indian", "Desserts"];

    return (
        <div style={S.page}>
            <div style={S.orb1} />
            <div style={S.orb2} />
            <div style={S.gridLines} />

            <div style={S.card}>
                {/* ── Header ── */}
                <div style={S.cardTop}>
                    <div style={S.circle1} />
                    <div style={S.circle2} />
                    <div style={S.tag}>
                        <span style={S.tagDot} />
                        Restaurant Partner
                    </div>
                    <h1 style={S.title}>Add Your<br />Restaurant</h1>
                    <p style={S.subtitle}>Fill in the details and go live in minutes</p>
                    <div style={S.stepDots}>
                        <div style={{ ...S.dot, ...S.dotActive }} />
                        <div style={S.dot} />
                        <div style={S.dot} />
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={S.cardBody}>
                    {error && (
                        <div style={S.errorBox}>
                            <span>⚠</span> {error}
                        </div>
                    )}
                    {success && (
                        <div style={S.successBox}>
                            <span>✓</span> {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={S.sectionLabel}>Basic Info</div>

                        <div style={S.twoCol}>
                            <Field
                                label="Restaurant Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Spice Garden"
                            />
                            {/* ── Cuisine Select ── */}
                            <div style={{ flex: 1, marginBottom: 16 }}>
                                <label style={S.label}>Cuisine Type</label>
                                <div style={{ position: "relative" }}>
                                    <div style={S.selectArrow} />
                                    <select
                                        name="cuisineType"
                                        value={formData.cuisineType}
                                        onChange={handleChange}
                                        style={S.select}
                                        required
                                    >
                                        <option value="">Select cuisine</option>
                                        {CUISINES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <Field
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street address"
                        />

                        <div style={S.twoCol}>
                            <Field
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Mumbai"
                            />
                            <Field
                                label="Avg Delivery Time (min)"
                                name="avgDeliveryTime"
                                type="number"
                                value={formData.avgDeliveryTime}
                                onChange={handleChange}
                                placeholder="30"
                            />
                        </div>

                        <div style={S.divider} />
                        <div style={S.sectionLabel}>Order & Location</div>

                        <div style={S.twoCol}>
                            <Field
                                label="Minimum Order (₹)"
                                name="minimumOrder"
                                type="number"
                                value={formData.minimumOrder}
                                onChange={handleChange}
                                placeholder="199"
                            />
                            {/* ── Location Status ── */}
                            <div style={{ flex: 1, marginBottom: 16 }}>
                                <label style={S.label}>Location Status</label>
                                <div style={S.locStatus}>
                                    <div style={{
                                        ...S.locDot,
                                        background: locationLoaded ? "#22c55e" : "#eab308"
                                    }} />
                                    <span style={{
                                        fontSize: 13,
                                        color: locationLoaded ? "#86efac" : "#fde047"
                                    }}>
                                        {locationLoaded ? "Location ready" : "Fetching..."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Coordinates Box ── */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={S.label}>Detected Coordinates</label>
                            <div style={S.coordsBox}>
                                <div style={S.pinIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6120">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>
                                        {locationLoaded
                                            ? `${parseFloat(formData.latitude).toFixed(5)}, ${parseFloat(formData.longitude).toFixed(5)}`
                                            : "—"}
                                    </div>
                                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                                        {locationLoaded ? "GPS lock acquired" : "Waiting for GPS..."}
                                    </div>
                                </div>
                                <div style={locationLoaded ? S.badgeLive : S.badgePending}>
                                    {locationLoaded ? "Live" : "Pending"}
                                </div>
                            </div>
                        </div>

                        <div style={S.btnRow}>
                            <button type="button" onClick={() => navigate(-1)} style={S.backBtn}>
                                ← Back
                            </button>
                            <button
                                type="submit"
                                style={{
                                    ...S.submitBtn,
                                    opacity: loading || !locationLoaded ? 0.5 : 1,
                                    cursor: loading || !locationLoaded ? "not-allowed" : "pointer"
                                }}
                                disabled={loading || !locationLoaded}
                            >
                                {loading ? "Adding..." : "Add Restaurant"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Field({ label, name, type = "text", value, onChange, placeholder }) {
    return (
        <div style={{ flex: 1, marginBottom: 16 }}>
            <label style={S.label}>{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={S.input}
                required
            />
        </div>
    );
}

const S = {
    page: {
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "48px 20px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden"
    },
    orb1: {
        position: "fixed", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,100,30,0.18) 0%, transparent 70%)",
        top: -120, right: -100, pointerEvents: "none", zIndex: 0
    },
    orb2: {
        position: "fixed", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,200,50,0.10) 0%, transparent 70%)",
        bottom: 0, left: -80, pointerEvents: "none", zIndex: 0
    },
    gridLines: {
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
    },
    card: {
        width: "100%", maxWidth: 660,
        background: "rgba(18,18,18,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28, overflow: "hidden",
        position: "relative", zIndex: 1
    },
    cardTop: {
        background: "linear-gradient(135deg, #ff4500 0%, #ff8c00 100%)",
        padding: "36px 42px 28px",
        position: "relative", overflow: "hidden"
    },
    circle1: {
        position: "absolute", top: -40, right: -40,
        width: 180, height: 180, borderRadius: "50%",
        background: "rgba(255,255,255,0.08)"
    },
    circle2: {
        position: "absolute", bottom: -60, right: 40,
        width: 130, height: 130, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)"
    },
    tag: {
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 100, padding: "5px 14px",
        fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.9)",
        letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16
    },
    tagDot: {
        width: 7, height: 7, borderRadius: "50%",
        background: "#fff", display: "inline-block"
    },
    title: {
        fontFamily: "'Syne', 'Segoe UI', sans-serif",
        fontSize: 32, fontWeight: 800,
        color: "#fff", lineHeight: 1.1, margin: 0
    },
    subtitle: {
        fontSize: 14, color: "rgba(255,255,255,0.75)",
        marginTop: 8, fontWeight: 300
    },
    stepDots: { display: "flex", gap: 6, marginTop: 20 },
    dot: {
        width: 28, height: 4, borderRadius: 2,
        background: "rgba(255,255,255,0.3)"
    },
    dotActive: { width: 40, background: "#fff" },
    cardBody: { padding: "36px 42px" },
    sectionLabel: {
        fontSize: 10, fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)", marginBottom: 16
    },
    divider: {
        height: 1, background: "rgba(255,255,255,0.06)",
        margin: "8px 0 20px"
    },
    label: {
        display: "block", fontSize: 11, fontWeight: 500,
        letterSpacing: "0.06em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)", marginBottom: 8
    },
    input: {
        width: "90%",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12, color: "#f1f5f9",
        fontSize: 14, padding: "13px 15px", outline: "none",
        fontFamily: "'DM Sans', sans-serif"
    },
    /* ✅ Fixed select — dark background, no white popup */
    select: {
        width: "100%",
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12, color: "#f1f5f9",
        fontSize: 14, padding: "13px 38px 13px 15px",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer"
    },
    /* ✅ Custom dropdown arrow */
    selectArrow: {
        position: "absolute", right: 14, top: "50%",
        transform: "translateY(-50%)",
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "6px solid rgba(255,255,255,0.4)",
        pointerEvents: "none", zIndex: 1
    },
    twoCol: { display: "flex", gap: 14, flexWrap: "wrap" },
    locStatus: {
        display: "flex", alignItems: "center", gap: 8,
        padding: "13px 15px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, height: 25
    },
    locDot: {
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0
    },
    coordsBox: {
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "13px 15px"
    },
    pinIcon: {
        width: 34, height: 34, borderRadius: 8,
        background: "rgba(255,100,30,0.2)",
        display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0
    },
    badgeLive: {
        fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
        fontWeight: 60, padding: "4px 10px", borderRadius: 100,
        background: "rgba(34,197,94,0.15)",
        border: "1px solid rgba(34,197,94,0.25)",
        color: "#86efac"
    },
    badgePending: {
        fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
        fontWeight: 600, padding: "4px 10px", borderRadius: 100,
        background: "rgba(234,179,8,0.15)",
        border: "1px solid rgba(234,179,8,0.25)",
        color: "#fde047"
    },
    errorBox: {
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px", borderRadius: 12, marginBottom: 20,
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.25)",
        color: "#fca5a5", fontSize: 13
    },
    successBox: {
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px", borderRadius: 12, marginBottom: 20,
        background: "rgba(34,197,94,0.12)",
        border: "1px solid rgba(34,197,94,0.25)",
        color: "#86efac", fontSize: 13
    },
    btnRow: { display: "flex", gap: 12, marginTop: 8 },
    backBtn: {
        flex: 1, padding: 15, background: "transparent",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14, color: "rgba(255,255,255,0.45)",
        fontSize: 14, cursor: "pointer", fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif"
    },
    submitBtn: {
        flex: 2, padding: 15,
        background: "linear-gradient(135deg, #ff4500, #ff8c00)",
        border: "none", borderRadius: 14,
        color: "#fff", fontSize: 15,
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700, letterSpacing: "0.04em"
    }
};