export const FINE_CATEGORIES = [
    { value: "transito", label: "Tránsito" },
    { value: "administrativo", label: "Administrativo" },
    { value: "cepo", label: "Cepo" },
    { value: "convenio", label: "Convenio" },
    { value: "tasas", label: "Tasas" },
] as const;

export type FineCategory = (typeof FINE_CATEGORIES)[number]["value"];

export interface Fine {
    id: string;
    code: string;
    category: FineCategory;
    amount: number;
    description: string;
    location: string;
    date: string;
}