type Cell = {
    title: string;
    note?: string;
};

type HowTableProps = {
    columns: string[];
    rows: Cell[][];
    rowColors?: string[];
    className?: string;
};

export type { HowTableProps, Cell };