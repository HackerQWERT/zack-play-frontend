"use client";
import { create } from "zustand";
import { AuthService } from "@/api/services/AuthService";
import { OpenAPI } from "@/api/core/OpenAPI";
import type { LoginRequest } from "@/api/models/LoginRequest";
import type { LoginResponse } from "@/api/models/LoginResponse";
import type { AuthenticatedUser } from "@/api/models/AuthenticatedUser";

interface AuthStoreState {
    usernameOrEmail: string;
    password: string;
    rememberMe: boolean;
    loading: boolean;
    error?: string;
    user?: AuthenticatedUser;
    accessToken?: string;

    setUsernameOrEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setRememberMe: (value: boolean) => void;
    login: () => Promise<void>;
    logout: () => void;
    setError: (error?: string) => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
    loading: false,
    error: undefined,
    user: undefined,
    accessToken: (() => {
        // 初始化时从localStorage获取token并设置到OpenAPI
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                OpenAPI.TOKEN = token;
            }
            return token || undefined;
        }
        return undefined;
    })(),

    setUsernameOrEmail: (value) => set({ usernameOrEmail: value }),
    setPassword: (value) => set({ password: value }),
    setRememberMe: (value) => set({ rememberMe: value }),
    setError: (error) => set({ error }),

    login: async () => {
        const { usernameOrEmail, password, rememberMe } = get();
        set({ loading: true, error: undefined });

        const loginRequest: LoginRequest = {
            usernameOrEmail,
            password,
            rememberMe,
        };

        try {
            const response: LoginResponse = await AuthService.postApiAuthLogin(loginRequest);
            localStorage.setItem("accessToken", response.accessToken || "");
            // 设置OpenAPI token以便后续请求自动携带
            OpenAPI.TOKEN = response.accessToken;
            set({
                user: response.user,
                accessToken: response.accessToken,
                loading: false,
            });
        } catch (err: any) {
            set({ error: err.message || "登录失败", loading: false });
        }
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        // 清除OpenAPI token
        OpenAPI.TOKEN = undefined;
        set({
            user: undefined,
            accessToken: undefined,
            usernameOrEmail: "",
            password: "",
            rememberMe: false,
            error: undefined,
        });
    },
}));