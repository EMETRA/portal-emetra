import { User } from "./auth";

interface Course {
  id: number;
  nombre: string;
  descripcion: string;
}

enum CourseStatus {
  INSCRITO = "Inscrito",
}

interface Enrollment {
  id: number;
  fecha_inscripcion: string;
  fecha_culminacion: string;
  estado: CourseStatus;
  calificacion?: number;
  usuario: User;
  curso: Course;
}

export type { Course, Enrollment };
