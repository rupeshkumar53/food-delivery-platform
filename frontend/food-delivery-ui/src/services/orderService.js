import API from "./api";

export const placeOrder = async (orderData) => {
    const response = await API.post("/api/orders/place", orderData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await API.get("/api/orders/my-orders");
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await API.get(`/api/orders/${orderId}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await API.put(`/api/orders/${orderId}/cancel`);
    return response.data;
};