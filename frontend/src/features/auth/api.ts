/** @format */

import api from "@/src/lib/axios/client";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function csrfCookie() {
    await api.get("/sanctum/csrf-cookie", {
        baseURL: BACKEND,
        withCredentials: true,
    });
}

export async function login(payload: { email: string; password: string }) {
    await csrfCookie();
    const res = await api.post("/login", payload);
    return res.data;
}

export async function register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}) {
    const res = await api.post("/register", payload);
    return res.data;
}

export async function me() {
    const res = await api.get("/me");
    return res.data;
}

export async function logout() {
    await csrfCookie();
    const res = await api.post("/logout");
    return res.data;
}

export async function forgotPassword(payload: { email: string }) {
    const res = await api.post("/forgot-password", payload);
    return res.data;
}

export async function verifyResetOtp(payload: { email: string; code: string }) {
    const res = await api.post("/verify-reset-otp", payload);
    return res.data;
}

export async function resetPassword(payload: {
    email: string;
    password: string;
    password_confirmation: string;
}) {
    const res = await api.post("/reset-password", payload);
    return res.data;
}
