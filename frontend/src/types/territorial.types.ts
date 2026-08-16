export type TipoAfectacion =
  | 'INUNDACION'
  | 'DESLIZAMIENTO'
  | 'VENDAVAL'
  | 'INCENDIO'
  | 'DESPLAZAMIENTO'
  | 'OTRO';

export type SeveridadAfectacion = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type EstadoAfectacion = 'ACTIVA' | 'EN_ATENCION' | 'CONTROLADA' | 'CERRADA';

export type EstadoCentroAcopio =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'APROBADO'
  | 'RECHAZADO'
  | 'SUSPENDIDO'
  | 'CERRADO';

export type DecisionAuditoria = 'APROBADO' | 'RECHAZADO' | 'OBSERVADO';

export interface Municipio {
  id: number;
  departamentoId: number;
  codigoDane: string;
  nombre: string;
  latitud?: number | null;
  longitud?: number | null;
  estado: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  _count?: {
    afectaciones?: number;
    centrosAcopio?: number;
    beneficiarios?: number;
  };
}

export interface CrearMunicipioInput {
  departamentoId: number;
  codigoDane: string;
  nombre: string;
  latitud?: number;
  longitud?: number;
  estado?: boolean;
}

export interface Afectacion {
  id: string | number;
  municipioId: number;
  municipio?: {
    id: number;
    nombre: string;
    codigoDane?: string;
  };
  nombre: string;
  descripcion?: string | null;
  tipo: TipoAfectacion;
  severidad: SeveridadAfectacion;
  estado: EstadoAfectacion;
  latitud?: number | null;
  longitud?: number | null;
  direccion?: string | null;
  fechaInicio: string;
  fechaRegistro?: string;
  creadoPor: string | number;
  creador?: {
    id: string | number;
    nombre: string;
    apellido: string;
    correo?: string;
  };
}

export interface CrearAfectacionInput {
  municipioId: number;
  nombre: string;
  descripcion?: string;
  tipo: TipoAfectacion;
  severidad?: SeveridadAfectacion;
  estado?: EstadoAfectacion;
  latitud?: number;
  longitud?: number;
  direccion?: string;
  fechaInicio: string;
  creadoPor: string | number;
}

export interface CentroAcopio {
  id: string | number;
  municipioId: number;
  municipio?: {
    id: number;
    nombre: string;
    codigoDane?: string;
  };
  organizacionId: string | number;
  organizacion?: {
    id: string | number;
    nombre: string;
    tipo?: string;
  };
  nombre: string;
  direccion: string;
  barrio?: string | null;
  responsable: string;
  telefono: string;
  latitud?: number | null;
  longitud?: number | null;
  fotoFachada?: string | null;
  estado: EstadoCentroAcopio;
  fechaSolicitud?: string;
  fechaAprobacion?: string | null;
  aprobadoPor?: string | number | null;
  auditorias?: AuditoriaCentro[];
}

export interface AuditoriaCentro {
  id: string | number;
  centroAcopioId: string | number;
  auditorId: string | number;
  decision: DecisionAuditoria;
  comentario: string;
  fotoEvidencia: string;
  latitud?: number | null;
  longitud?: number | null;
  fecha?: string;
  auditor?: {
    id: string | number;
    nombre: string;
    apellido: string;
  };
}

export interface CrearCentroAcopioInput {
  municipioId: number;
  organizacionId: string | number;
  nombre: string;
  direccion: string;
  barrio?: string;
  responsable: string;
  telefono: string;
  latitud?: number;
  longitud?: number;
  fotoFachada?: string;
  estado?: EstadoCentroAcopio;
}

export interface AuditarCentroAcopioInput {
  decision: DecisionAuditoria;
  comentario: string;
  fotoEvidencia: string;
  latitud?: number;
  longitud?: number;
  auditorId: string | number;
}
