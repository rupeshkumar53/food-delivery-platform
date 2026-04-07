import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:9091",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["X-User-Id"] = localStorage.getItem("userId") || "1";
    }
    return config;
});

export default API;