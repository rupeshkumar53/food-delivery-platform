import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addMenuItem } from "../services/restaurantService";

const CATEGORIES = ["Starters", "Main Course", "Desserts", "Drinks", "Breads", "Biryani", "Pizza"];

export default function AddMenuItem() {
    const navigate = useNavigate();
    const { restaurantId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({ name:"", description:"", price:"", category:"", isVeg:true, imageUrl:"" });

    const handleChange = e => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            await addMenuItem({ ...formData, restaurantId: parseInt(restaurantId), price: parseFloat(formData.price) });
            setSuccess("Menu item added!");
            setFormData({ name:"", description:"", price:"", category:"", isVeg:true, imageUrl:"" });
        } catch { setError("Failed! Try again."); }
        finally { setLoading(false); }
    };

    return (
        <div style={S.page}>
            <div style={S.card}>
                <div style={S.cardHeader}>
                    <span style={{ fontSize:"32px" }}>🍕</span>
                    <h2 style={S.title}>Add Menu Item</h2>
                    <p style={S.subtitle}>Restaurant ID: {restaurantId}</p>
                </div>
                {error && <div style={S.errorBox}>{error}</div>}
                {success && <div style={S.successBox}>{success}</div>}
                <form onSubmit={handleSubmit}>
                    <Field label="Item Name" name="name" value={formData.name} onChange={handleChange} placeholder="Margherita Pizza" />
                    <div style={{ marginBottom:"16px" }}>
                        <label style={S.label}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}
                            placeholder="Classic tomato and cheese pizza"
                            style={{ ...S.inputStyle, height:"80px", resize:"vertical" }} />
                    </div>
                    <div style={S.twoCol}>
                        <Field label="Price (Rs.)" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="299" />
                        <div style={{ flex:1, marginBottom:"16px" }}>
                            <label style={S.label}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} style={S.select} required>
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <Field label="Image URL (optional)" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." required={false} />
                    <div style={S.checkRow}>
                        <div style={{ ...S.vegToggle, background: formData.isVeg ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${formData.isVeg ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}` }}
                            onClick={() => setFormData({ ...formData, isVeg: !formData.isVeg })}>
                            <span style={{ fontSize:"20px" }}>{formData.isVeg ? "🟢" : "🔴"}</span>
                            <span style={{ color: formData.isVeg ? "#10b981" : "#ef4444", fontWeight:"700" }}>
                                {formData.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                            </span>
                        </div>
                    </div>
                    <div style={S.btnRow}>
                        <button type="button" onClick={() => navigate(-1)} style={S.backBtn}>Back</button>
                        <button type="submit" style={S.submitBtn} disabled={loading}>
                            {loading ? "Adding..." : "Add Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, name, type = "text", value, onChange, placeholder, required = true }) {
    return (
        <div style={{ flex:1, marginBottom:"16px" }}>
            <label style={{ display:"block", color:"#94a3b8", fontSize:"13px", fontWeight:"600", marginBottom:"8px" }}>{label}</label>
            <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", color:"#f1f5f9", fontSize:"14px", padding:"12px 14px", boxSizing:"border-box", outline:"none" }} />
        </div>
    );
}

const S = {
    page: { minHeight:"100vh", background:"#0f172a", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"40px 20px", fontFamily:"'Segoe UI', sans-serif" },
    card: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"24px", padding:"40px", width:"560px", boxShadow:"0 25px 60px rgba(0,0,0,0.5)" },
    cardHeader: { textAlign:"center", marginBottom:"28px" },
    title: { color:"#f1f5f9", fontSize:"22px", fontWeight:"800", margin:"8px 0 4px" },
    subtitle: { color:"#64748b", margin:0 },
    errorBox: { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", padding:"12px", borderRadius:"10px", marginBottom:"18px", textAlign:"center" },
    successBox: { background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", color:"#10b981", padding:"12px", borderRadius:"10px", marginBottom:"18px", textAlign:"center" },
    label: { display:"block", color:"#94a3b8", fontSize:"13px", fontWeight:"600", marginBottom:"8px" },
    inputStyle: { width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", color:"#f1f5f9", fontSize:"14px", padding:"12px 14px", boxSizing:"border-box", outline:"none" },
    select: { width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", color:"#f1f5f9", fontSize:"14px", padding:"12px 14px", outline:"none" },
    twoCol: { display:"flex", gap:"14px" },
    checkRow: { marginBottom:"20px" },
    vegToggle: { display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", borderRadius:"12px", cursor:"pointer" },
    btnRow: { display:"flex", gap:"12px" },
    backBtn: { flex:1, padding:"13px", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"#94a3b8", borderRadius:"12px", fontSize:"15px", cursor:"pointer", fontWeight:"600" },
    submitBtn: { flex:2, padding:"13px", background:"linear-gradient(135deg,#ff4500,#ff6b35)", color:"white", border:"none", borderRadius:"12px", fontSize:"15px", cursor:"pointer", fontWeight:"700" },
};