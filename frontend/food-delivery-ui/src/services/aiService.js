import API from "./api";

export const getRecommendations = async (data) => {
    const response = await API.post("/api/ai/recommendations", data);
    return response.data;
};