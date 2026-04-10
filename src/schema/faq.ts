import * as yup from "yup";

/**
 * **Enumeración de los tipos de preguntas frecuentes que pueden existir**
 */
export enum FAQ_Type {
  PILOTOS = "Pilotos",
  TAXIS = "Taxis",
  BUSES = "Buses",
  FLETES = "Fletes",
  SERVICIO_A_DOMICILIO = "Servicio a Domicilio",
  PUBLICIDAD_MOVIL = "Publicidad Móvil",
}

/**
 * **Interfaz para preguntas frecuentes**
 * @param id Identificador de la pregunta frecuente
 * @param tipo Tipo de pregunta frecuente
 * @param enLanding Indica si la pregunta frecuente debe mostrarse en el landing
 * @param pregunta Pregunta frecuente
 * @param respuesta Respuesta a la pregunta frecuente
 */
export interface FAQ {
  id: number;
  tipo: FAQ_Type;
  enLanding: boolean;
  pregunta: string;
  respuesta: string;
}

/**
 * **Interfaz para la petición de creación de preguntas frecuentes**
 * @param tipo Tipo de pregunta frecuente
 * @param enLanding Indica si la pregunta frecuente debe mostrarse en el landing
 * @param pregunta Pregunta frecuente
 * @param respuesta Respuesta a la pregunta frecuente
 */
export interface CreateFAQRequest {
  tipo: FAQ_Type;
  enLanding: boolean;
  pregunta: string;
  respuesta: string;
}

/**
 * **Esquema de validación para la creación de preguntas frecuentes**
 */
export const CreateFAQSchema = yup.object({
  /**
   * @todo Validar que el tipo sea uno de los valores de FAQ_Type
   */
  tipo: yup.string().required("Por favor, seleccione un tipo"),
  enLanding: yup
    .boolean()
    .required("Por favor, seleccione si se mostrará en el landing page"),
  pregunta: yup.string().required("Por favor, ingrese la pregunta"),
  respuesta: yup.string().required("Por favor, ingrese la respuesta"),
});

/**
 * **Interfaz para la petición de actualización de preguntas frecuentes**
 * @param tipo Tipo de pregunta frecuente
 * @param enLanding Indica si la pregunta frecuente debe mostrarse en el landing
 * @param pregunta Pregunta frecuente
 * @param respuesta Respuesta a la pregunta frecuente
 */
export type UpdateFAQRequest = Partial<CreateFAQRequest>;

// export type { UpdateFAQRequest, CreateFAQRequest, FAQ };
// export { CreateFAQSchema };
