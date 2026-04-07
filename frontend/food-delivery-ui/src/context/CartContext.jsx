import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);

    const addToCart = (item, restId) => {
        if (restaurantId && restaurantId !== parseInt(restId)) {
            alert("Ek restaurant se hi order karo!");
            return;
        }
        setRestaurantId(parseInt(restId));
        setCartItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => {
            const exists = prev.find(i => i.id === itemId);
            if (exists && exists.quantity > 1) return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
            const updated = prev.filter(i => i.id !== itemId);
            if (updated.length === 0) setRestaurantId(null);
            return updated;
        });
    };

    const clearCart = () => { setCartItems([]); setRestaurantId(null); };

    const getTotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, restaurantId, addToCart, removeFromCart, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);