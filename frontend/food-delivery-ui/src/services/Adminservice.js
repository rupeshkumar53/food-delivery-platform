import API from './api';

// ─── BASE ────────────────────────────────────────────
// All calls go to admin-service via API Gateway :9091
// Admin-service is at :9098 internally
// ─────────────────────────────────────────────────────

// ─── STATS ───────────────────────────────────────────

export const getAdminStats = async () => {
    const response = await API.get('/api/admin/stats');
    return response.data;
};

// ─── USERS ───────────────────────────────────────────

export const getAllUsers = async () => {
    const response = await API.get('/api/admin/users');
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await API.delete(
        `/api/admin/users/${id}`);
    return response.data;
};

export const updateUserRole = async (id, newRole) => {
    const response = await API.put(
        `/api/admin/users/${id}/role`,
        { role: newRole }
    );
    return response.data;
};

// ─── RESTAURANTS ─────────────────────────────────────

export const getAllRestaurants = async () => {
    const response = await API.get(
        '/api/admin/restaurants');
    return response.data;
};

export const deleteRestaurant = async (id) => {
    const response = await API.delete(
        `/api/admin/restaurants/${id}`);
    return response.data;
};

export const toggleRestaurant = async (id) => {
    const response = await API.put(
        `/api/admin/restaurants/${id}/toggle`);
    return response.data;
};

// ─── DELIVERY PARTNERS ───────────────────────────────

export const getAllDeliveryPartners = async () => {
    const response = await API.get(
        '/api/admin/delivery-partners');
    return response.data;
};

export const deleteDeliveryPartner = async (id) => {
    const response = await API.delete(
        `/api/admin/delivery-partners/${id}`);
    return response.data;
};

export const toggleDeliveryPartner = async (id) => {
    const response = await API.put(
        `/api/admin/delivery-partners/${id}/toggle`);
    return response.data;
};

// ─── ORDERS ──────────────────────────────────────────

export const getAllOrders = async () => {
    const response = await API.get(
        '/api/admin/orders');
    return response.data;
};

export const deleteOrder = async (id) => {
    const response = await API.delete(
        `/api/admin/orders/${id}`);
    return response.data;
};

// ─── AUDIT LOGS ──────────────────────────────────────

export const getAdminLogs = async () => {
    const response = await API.get(
        '/api/admin/logs');
    return response.data;
};