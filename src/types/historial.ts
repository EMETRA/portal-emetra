export type RecordType = "recibo" | "solvencia";
export type RecordStatus = "activa" | "inactiva";

export interface HistoryRecord {
    id: string;
    type: RecordType;
    code: string;
    date: string;
    amount: number;
    status?: RecordStatus;  
}