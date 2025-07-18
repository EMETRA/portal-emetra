import { Field, Form } from "./forms";
import { Transport } from "./transport";
/**
 * Interfaz para gestión de un medio de transporte
 * @param id Identificador del medio de transporte
 * @param nombre Nombre del medio de transporte
 * @param transporte Objeto de tipo Transport que representa el medio de transporte
 */
interface Management {
  id: number;
  nombre: string;
  transporte: Transport;
  formularios: Form[];
}

interface InstanceForm {
  id: number;
  formulario: Form;
  campos: InstanceField[];
}
interface InstanceField {
  campo: Field;
  id: number;
  valor: string | number | boolean | null;
}

interface Procedure {
  fecha_creacion: string;
  id: number;
  gestion: Management;
  formularios: InstanceForm[];
}

interface SaveField {
  valor: string | number | null;
}

export type { Management, Procedure, SaveField, InstanceField };
