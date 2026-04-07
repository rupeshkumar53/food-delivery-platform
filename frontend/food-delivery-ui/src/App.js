import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import Cart from './pages/Cart.jsx';
import MyOrders from './pages/MyOrders.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import AddRestaurant from './pages/AddRestaurant.jsx';
import AddMenuItem from './pages/AddMenuItem.jsx';
import DeliveryRegister from './pages/DeliveryRegister.jsx';
import RestaurantDashboard from './pages/RestaurantDashboard.jsx';
import DeliveryDashboard from './pages/DeliveryDashboard.jsx';
import AdminDashboard from './pages/Admindashboard.jsx';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                        <Route path="/order/:id" element={<OrderTracking />} />
                        <Route path="/add-restaurant" element={<AddRestaurant />} />
                        <Route path="/add-menu/:restaurantId" element={<AddMenuItem />} />
                        <Route path="/delivery-register" element={<DeliveryRegister />} />
                        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
                        <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />

                        {/* ✅ NEW: Admin Route */}
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;