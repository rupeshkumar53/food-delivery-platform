import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById, getMenu } from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function RestaurantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role } = useAuth();
    const { addToCart, removeFromCart, cartItems } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [catFilter, setCatFilter] = useState("ALL");

    useEffect(() => { loadData(); }, [id]);

    const loadData = async () => {
        try {
            const [resto, menu] = await Promise.all([getRestaurantById(id), getMenu(id)]);
            setRestaurant(resto);
            setMenuItems(menu || []);
        } catch { console.log("Error"); }
        finally { setLoading(false); }
    };

    const getCartCount = (itemId) => {
        const item = cartItems.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    };

    const categories = ["ALL", ...new Set(menuItems.map(m => m.category).filter(Boolean))];
    const filtered = catFilter === "ALL" ? menuItems : menuItems.filter(m => m.category === catFilter);

    if (loading) return (
        <div style={{ minHeight:"100vh", background:"#0f172a", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:"40px", height:"40px", border:"3px solid rgba(255,69,0,0.2)", borderTopColor:"#ff4500", borderRadius:"50%" }} />
        </div>
    );

    return (
        <div style={S.page}>
            <div style={S.header}>
                <button onClick={() => navigate(-1)} style={S.backBtn}>Back</button>
                <h2 style={S.headerTitle}>{restaurant?.name || "Restaurant"}</h2>
                {role === "CUSTOMER" && (
                    <button onClick={() => navigate("/cart")} style={S.cartBtn}>Cart ({cartItems.length})</button>
                )}
                {role === "RESTAURANT" && (
                    <button onClick={() => navigate(`/add-menu/${id}`)} style={S.addBtn}>+ Add Item</button>
                )}
            </div>
            <div style={S.content}>
                {restaurant && (
                    <div style={S.infoBar}>
                        <span style={S.infoPill}>{restaurant.cuisineType}</span>
                        <span style={S.infoPill}>Rating: {restaurant.rating || "4.0"}</span>
                        <span style={S.infoPill}>{restaurant.avgDeliveryTime} min</span>
                        <span style={S.infoPill}>{restaurant.city}</span>
                        <span style={{ ...S.infoPill, color: restaurant.isOpen ? "#10b981" : "#ef4444" }}>
                            {restaurant.isOpen ? "Open" : "Closed"}
                        </span>
                    </div>
                )}
                {categories.length > 1 && (
                    <div style={S.filterRow}>
                        {categories.map(c => (
                            <button key={c} onClick={() => setCatFilter(c)} style={{
                                ...S.filterBtn,
                                background: catFilter === c ? "#ff4500" : "rgba(255,255,255,0.06)",
                                color: catFilter === c ? "white" : "#94a3b8",
                                border: catFilter === c ? "none" : "1px solid rgba(255,255,255,0.1)",
                            }}>{c}</button>
                        ))}
                    </div>
                )}
                <h3 style={S.menuTitle}>Menu ({filtered.length} items)</h3>
                {filtered.length === 0 && (
                    <div style={S.emptyBox}>
                        <p style={{ color:"#64748b" }}>Koi menu item nahi hai</p>
                        {role === "RESTAURANT" && (
                            <button onClick={() => navigate(`/add-menu/${id}`)} style={S.primaryBtn}>+ Add Menu Items</button>
                        )}
                    </div>
                )}
                <div style={S.menuGrid}>
                    {filtered.map(item => {
                        const count = getCartCount(item.id);
                        return (
                            <div key={item.id} style={S.menuCard}>
                                <div style={S.menuImg}>
                                    <span style={{ fontSize:"40px" }}>{item.isVeg ? "🥗" : "🍗"}</span>
                                    <span style={{ ...S.vegTag, background: item.isVeg ? "rgba(16,185,129,0.8)" : "rgba(239,68,68,0.8)" }}>
                                        {item.isVeg ? "Veg" : "Non-Veg"}
                                    </span>
                                </div>
                                <div style={S.menuBody}>
                                    <h4 style={S.itemName}>{item.name}</h4>
                                    {item.description && <p style={S.itemDesc}>{item.description}</p>}
                                    <p style={S.itemCat}>{item.category}</p>
                                    <div style={S.itemFooter}>
                                        <span style={S.price}>Rs.{item.price}</span>
                                        {role === "CUSTOMER" && (
                                            count > 0 ? (
                                                <div style={S.qtyControl}>
                                                    <button style={S.qtyBtn} onClick={() => removeFromCart(item.id)}>-</button>
                                                    <span style={S.qtyNum}>{count}</span>
                                                    <button style={S.qtyBtn} onClick={() => addToCart(item, parseInt(id))}>+</button>
                                                </div>
                                            ) : (
                                                <button style={S.addCartBtn} onClick={() => addToCart(item, parseInt(id))}>+ Add</button>
                                            )
                                        )}
                                        {role === "RESTAURANT" && (
                                            <span style={{ color: item.isAvailable ? "#10b981" : "#ef4444", fontSize:"13px", fontWeight:"700" }}>
                                                {item.isAvailable ? "Available" : "Unavailable"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const S = {
    page: { minHeight:"100vh", background:"#0f172a", fontFamily:"'Segoe UI', sans-serif" },
    header: { background:"linear-gradient(90deg,#1a0800,#2d1200)", borderBottom:"1px solid rgba(255,69,0,0.2)", padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" },
    backBtn: { background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#e2e8f0", padding:"8px 16px", borderRadius:"10px", cursor:"pointer", fontWeight:"600" },
    headerTitle: { color:"#f1f5f9", fontSize:"20px", fontWeight:"800", margin:0 },
    cartBtn: { background:"rgba(255,69,0,0.15)", border:"1px solid rgba(255,69,0,0.3)", color:"#ff4500", padding:"8px 16px", borderRadius:"10px", cursor:"pointer", fontWeight:"700" },
    addBtn: { background:"linear-gradient(135deg,#ff4500,#ff6b35)", color:"white", border:"none", padding:"8px 16px", borderRadius:"10px", cursor:"pointer", fontWeight:"700" },
    content: { maxWidth:"1100px", margin:"0 auto", padding:"28px 24px" },
    infoBar: { display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"24px" },
    infoPill: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"6px 14px", borderRadius:"20px", fontSize:"13px", fontWeight:"600" },
    filterRow: { display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"20px" },
    filterBtn: { padding:"6px 14px", borderRadius:"20px", cursor:"pointer", fontSize:"13px", fontWeight:"600" },
    menuTitle: { color:"#f1f5f9", fontSize:"20px", fontWeight:"800", margin:"0 0 20px" },
    emptyBox: { textAlign:"center", padding:"60px", color:"#64748b" },
    primaryBtn: { background:"linear-gradient(135deg,#ff4500,#ff6b35)", color:"white", border:"none", padding:"12px 24px", borderRadius:"10px", cursor:"pointer", fontWeight:"700", marginTop:"16px" },
    menuGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"16px" },
    menuCard: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", overflow:"hidden" },
    menuImg: { height:"110px", background:"linear-gradient(135deg,#1e293b,#0f172a)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" },
    vegTag: { position:"absolute", top:"8px", left:"8px", color:"white", padding:"2px 8px", borderRadius:"20px", fontSize:"11px", fontWeight:"700" },
    menuBody: { padding:"14px" },
    itemName: { color:"#f1f5f9", fontSize:"15px", fontWeight:"700", margin:"0 0 6px" },
    itemDesc: { color:"#64748b", fontSize:"12px", margin:"0 0 6px", lineHeight:"1.4" },
    itemCat: { color:"#475569", fontSize:"11px", margin:"0 0 12px" },
    itemFooter: { display:"flex", justifyContent:"space-between", alignItems:"center" },
    price: { color:"#ff4500", fontSize:"18px", fontWeight:"800" },
    addCartBtn: { background:"linear-gradient(135deg,#ff4500,#ff6b35)", color:"white", border:"none", padding:"8px 16px", borderRadius:"20px", cursor:"pointer", fontWeight:"700", fontSize:"13px" },
    qtyControl: { display:"flex", alignItems:"center", gap:"8px" },
    qtyBtn: { width:"30px", height:"30px", background:"rgba(255,69,0,0.15)", border:"1px solid rgba(255,69,0,0.3)", color:"#ff4500", borderRadius:"50%", cursor:"pointer", fontSize:"16px", fontWeight:"700" },
    qtyNum: { color:"#f1f5f9", fontWeight:"800", fontSize:"15px", minWidth:"20px", textAlign:"center" },
};