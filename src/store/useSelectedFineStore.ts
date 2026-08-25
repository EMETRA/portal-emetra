import { create } from "zustand";
import { Fine } from "@/types/fines";

interface SelectedFinesStore {
    selected: Fine[];
    toggle: (fine: Fine) => void;
    addOne: (fine: Fine) => void;
    clear: () => void;
    isSelected: (id: string) => boolean;
    total: () => number;
}

export const useSelectedFinesStore = create<SelectedFinesStore>((set, get) => ({
    selected: [],

    toggle: (fine) =>
        set((s) => ({
        selected: s.selected.find((f) => f.id === fine.id)
            ? s.selected.filter((f) => f.id !== fine.id)
            : [...s.selected, fine],
        })),

    addOne: (fine) =>
        set((s) => ({
        selected: s.selected.find((f) => f.id === fine.id)
            ? s.selected
            : [...s.selected, fine],
        })),

    clear: () => set({ selected: [] }),

    isSelected: (id) => get().selected.some((f) => f.id === id),

    total: () => get().selected.reduce((sum, f) => sum + f.amount, 0),
    }));