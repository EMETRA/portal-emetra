// store/useSessionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionStore {
    sessionToken: string | null;
    expiresAt: string | null;
    setSession: (token: string, expiresAt: string) => void;
    clearSession: () => void;
    isAuthenticated: () => boolean;
}

export const useSessionStore = create<SessionStore>()(
    persist(
        (set, get) => ({
        sessionToken: null,
        expiresAt: null,

        setSession: (token, expiresAt) =>
            set({ sessionToken: token, expiresAt }),

        clearSession: () =>
            set({ sessionToken: null, expiresAt: null }),

        isAuthenticated: () => {
            const { sessionToken, expiresAt } = get();
            if (!sessionToken || !expiresAt) return false;
            return new Date(expiresAt) > new Date();
        },
        }),
        { name: "casillero-session" }
    )
);