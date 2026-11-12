// store/useSessionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCasilleroProfileStore } from "./useCasilleroProfileStore";

/**
 * Estado de la sesión de casillero en el navegador. El token NO se guarda aquí: vive en
 * la cookie httpOnly que maneja el BFF (src/lib/casillero/session.ts). Aquí solo queda
 * el vencimiento, para saber en la UI si la sesión sigue vigente.
 */
interface SessionStore {
    expiresAt: string | null;
    setSession: (expiresAt: string | null) => void;
    clearSession: () => void;
    isAuthenticated: () => boolean;
}

export const useSessionStore = create<SessionStore>()(
    persist(
        (set, get) => ({
        expiresAt: null,

        setSession: (expiresAt) => {
            useCasilleroProfileStore.getState().clear();
            set({ expiresAt });
        },

        clearSession: () => {
            useCasilleroProfileStore.getState().clear();
            set({ expiresAt: null });
        },

        isAuthenticated: () => {
            const { expiresAt } = get();
            if (!expiresAt) return false;
            return new Date(expiresAt) > new Date();
        },
        }),
        {
            name: "casillero-session",
            // v1: se quitó `sessionToken`. La migración borra el token que haya quedado
            // guardado en el navegador por la versión anterior.
            version: 1,
            migrate: (persisted) => ({
                expiresAt: (persisted as { expiresAt?: string | null } | null)?.expiresAt ?? null,
            }) as SessionStore,
        }
    )
);
