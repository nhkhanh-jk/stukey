import api from "../lib/api";

const authService = {
    login: (email, password) => api.post("/auth/login", {email, password}),
    register: (payload) => api.post("/auth/register", payload),
    logout: () => api.post("/auth/logout"),
    me: () => api.get("/auth/me"),
    updateProfile: (payload) => api.put("/auth/profile", payload),
    changePassword: (payload) => api.put("/auth/password", payload),
    deleteAccount: () => api.delete("/auth/account"),
};

export default authService;