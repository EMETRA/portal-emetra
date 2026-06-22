export interface Plate {
    id: string;
    type: string;
    number: string;
    remisiones: number;
}

export const PLATE_TYPES = [
    { value: "P", label: "P" },
    { value: "M", label: "M" },
    { value: "C", label: "C" },
    { value: "O", label: "O" },
];