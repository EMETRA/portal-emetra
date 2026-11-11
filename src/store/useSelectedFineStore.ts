import { create } from "zustand";
import { Fine } from "@/types/fines";
import { sumarQuetzales } from "@/lib/casillero/montos";
import { esCobroPagable } from "@/lib/casillero/obligations";

interface SelectedFinesStore {
    selected: Fine[];
    toggle: (fine: Fine) => void;
    addOne: (fine: Fine) => void;
    clear: () => void;
    isSelected: (id: string) => boolean;
    total: () => number;
    /**
     * Actualiza la selección con los cobros recién consultados: quita los que ya no vienen
     * o dejaron de ser pagables, y toma el monto nuevo de los que siguen.
     */
    sync: (fresh: Fine[]) => void;
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

    // Se suma en centavos para no arrastrar errores de decimales.
    total: () => sumarQuetzales(get().selected.map((f) => f.amount)),

    sync: (fresh) => {
        const { selected } = get();
        if (selected.length === 0) return;
        const porId = new Map(fresh.map((f) => [f.id, f]));
        const siguen = selected
            .map((f) => porId.get(f.id))
            .filter((f): f is Fine => f !== undefined && esCobroPagable(f));
        const cambio =
            siguen.length !== selected.length ||
            siguen.some((f, i) => f.amount !== selected[i].amount);
        if (cambio) set({ selected: siguen });
    },
    }));
