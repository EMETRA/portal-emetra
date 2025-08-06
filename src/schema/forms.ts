interface Form {
  id: number;
  nombre: string;
  campos: Field[];
}

interface Field {
  id: number;
  nombre: string;
  tipo:
    | "text"
    | "number"
    | "email"
    | "password"
    | "checkbox"
    | "radio"
    | "date"
    | "file"
    | "textarea"
    | "select";

  _requerido: number;
  orden: number;
  expresionRegular?: string;
}

export type { Form, Field };
