import { create } from "zustand";
import { persist } from "zustand/middleware";

type Mode = "personal" | "empresa";

interface ModeStore {
    mode: Mode;
    setMode: (mode: Mode) => void;
}

export const useModeStore = create<ModeStore>()(
    persist(
        (set) => ({
            mode: "personal",
            setMode: (mode) => set({ mode }),
        }),
        { name: "casillero-mode" }
    )
);