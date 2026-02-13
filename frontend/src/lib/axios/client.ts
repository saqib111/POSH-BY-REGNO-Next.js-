/** @format */

import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + "/api",
    withCredentials: true,
    headers: { Accept: "application/json" },
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
});

// ✅ Force X-XSRF-TOKEN header from cookie (fixes many mismatch cases)
api.interceptors.request.use((config) => {
    if (typeof document !== "undefined") {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        if (match?.[1]) {
            config.headers = config.headers ?? {};
            config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match[1]);
        }
    }
    return config;
});

export default api;
