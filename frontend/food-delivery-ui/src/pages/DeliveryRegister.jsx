import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerPartner } from "../services/deliveryService";
import { motion } from "framer-motion";

const VEHICLES = [
    { value: "BIKE", icon: "🏍️", label: "Bike" },
    { value: "SCOOTER", icon: "🛵", label: "Scooter" },
    { value: "CYCLE", icon: "🚲", label: "Cycle" },
];

export default function DeliveryRegister() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [locationLoaded, setLocationLoaded] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        vehicleType: "BIKE",
        latitude: "",
        longitude: ""
    });

    // 📍 Get Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;

                    setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng
                    }));

                    setLocationLoaded(true);
                },
                () => setError("Enable location access!")
            );
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.latitude || !formData.longitude) {
            setError("Location not ready!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await registerPartner(formData);
            setSuccess("Registered Successfully 🚀");
            setTimeout(() => navigate("/home"), 2000);
        } catch {
            setError("Registration Failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={S.page}>
            <motion.div
                style={S.card}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={S.cardHeader}>
                    <span style={{ fontSize: 50 }}>🛵</span>
                    <h2 style={S.title}>Delivery Register</h2>
                    <p style={S.subtitle}>Start earning today</p>
                </div>

                {error && <div style={S.errorBox}>{error}</div>}
                {success && <div style={S.successBox}>{success}</div>}

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div style={S.field}>
                        <label style={S.label}>Name</label>
                        <div style={S.inputWrap}>
                            <span>👤</span>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={S.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div style={S.field}>
                        <label style={S.label}>Phone</label>
                        <div style={S.inputWrap}>
                            <span>📞</span>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={S.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Vehicle */}
                    <div style={S.field}>
                        <label style={S.label}>Vehicle</label>
                        <div style={S.vehicleRow}>
                            {VEHICLES.map(v => (
                                <motion.div
                                    key={v.value}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setFormData({ ...formData, vehicleType: v.value })
                                    }
                                    style={{
                                        ...S.vehicleCard,
                                        border:
                                            formData.vehicleType === v.value
                                                ? "2px solid #ff4500"
                                                : "2px solid transparent"
                                    }}
                                >
                                    <span>{v.icon}</span>
                                    <span>{v.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div style={S.field}>
                        <label style={S.label}>Location</label>
                        <div style={S.inputWrap}>
                            <span>📍</span>
                            <input
                                value={
                                    locationLoaded
                                        ? `${formData.latitude}, ${formData.longitude}`
                                        : "Fetching location..."
                                }
                                readOnly
                                style={S.input}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <motion.button
                        type="submit"
                        style={S.btn}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading || !locationLoaded}
                    >
                        {loading ? "Registering..." : "Register Now"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

const S = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020617,#0f172a,#1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins"
    },
    card: {
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        padding: 40,
        borderRadius: 25,
        width: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
    },
    title: { color: "#fff", textAlign: "center" },
    subtitle: { color: "#aaa", textAlign: "center" },
    cardHeader: { textAlign: "center", marginBottom: 20 },
    field: { marginBottom: 18 },
    label: { color: "#ccc", fontSize: 13 },
    inputWrap: {
        display: "flex",
        gap: 10,
        background: "rgba(255,255,255,0.08)",
        padding: "10px 14px",
        borderRadius: 12
    },
    input: {
        flex: 1,
        background: "transparent",
        border: "none",
        outline: "none",
        color: "#fff"
    },
    vehicleRow: { display: "flex", gap: 10 },
    vehicleCard: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        textAlign: "center",
        cursor: "pointer",
        background: "rgba(255,255,255,0.05)"
    },
    btn: {
        width: "100%",
        padding: 14,
        borderRadius: 12,
        border: "none",
        background: "linear-gradient(135deg,#ff4500,#ff7a18)",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer"
    },
    errorBox: { color: "red", marginBottom: 10 },
    successBox: { color: "lightgreen", marginBottom: 10 }
};