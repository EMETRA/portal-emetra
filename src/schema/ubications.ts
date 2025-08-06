/**
 * **Interface para los días y horas de atención de una ubicación**
 * @param dias Días de atención de la ubicación
 * @param horas Horas de atención de la ubicación
 */
interface ScheduleItem {
  dias: string;
  horas: string;
}

/**
 * **Interface para las ubicaciones municipales**
 * @param id Identificador de la ubicación
 * @param nombre Nombre de la ubicación
 * @param enLanding Indica si la ubicación se muestra en la landing
 * @param direccion Dirección de la ubicación
 * @param horario Horario de atención de la ubicación
 * @param latitud Latitud de la ubicación
 * @param longitud Longitud de la ubicación
 */
interface Ubication {
  id: number;
  nombre: string;
  enLanding: boolean;
  direccion: string;
  horario: ScheduleItem[];
  latitud: number;
  longitud: number;
}

/**
 * **Interface para crear una ubicación municipal**
 * @param nombre Nombre de la ubicación
 * @param enLanding Indica si la ubicación se muestra en la landing
 * @param direccion Dirección de la ubicación
 * @param horario Horario de atención de la ubicación
 * @param latitud Latitud de la ubicación
 * @param longitud Longitud de la ubicación
 */
interface CreateUbicationDto {
  nombre: string;
  direccion: string;
  horario: string;
  latitud: number;
  longitud: number;
  enLanding: boolean;
}

/**
 * **Interface para actualizar las ubicaciones municipales**
 */
type UpdateUbicationDto = Partial<CreateUbicationDto>;

export type { Ubication, ScheduleItem, CreateUbicationDto, UpdateUbicationDto };
