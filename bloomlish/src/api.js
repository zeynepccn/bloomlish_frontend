import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            // ✅ JSON gönderirken Content-Type setle
            config.headers["Content-Type"] = "application/json";
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
            console.warn("Auth error:", err.response.status);
            // örn: window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;
