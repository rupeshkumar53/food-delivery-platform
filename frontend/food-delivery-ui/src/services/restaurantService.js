import API from "./api";

// export const getRestaurants = async (city) => {
//     const response = await API.get(`/api/restaurants?city=${city}`);
//     console.log("RAW DATA:", response.data); // ← yeh add karo
//     return (response.data || []).map(r => ({
//         ...r,
//         isOpen: r.is_open ?? r.isOpen ?? false
//     }));
// };
export const getRestaurants = async (city) => {
    const response = await API.get(`/api/restaurants?city=${city}`);
    console.log("FIRST ITEM FULL:", JSON.stringify(response.data[0]));
    return (response.data || []).map(r => ({
        ...r,
        isOpen: r.is_open ?? r.isOpen ?? r.open ?? r.status ?? false
    }));
};
export const getRestaurantById = async (id) => {
    const response = await API.get(`/api/restaurants/${id}`);
    return response.data;
};

export const createRestaurant = async (data) => {
    const response = await API.post("/api/restaurants/create", data);
    return response.data;
};

export const getMenu = async (restaurantId) => {
    const response = await API.get(`/api/menu/${restaurantId}`);
    return response.data;
};

export const addMenuItem = async (data) => {
    const response = await API.post("/api/menu/add", data);
    return response.data;
};