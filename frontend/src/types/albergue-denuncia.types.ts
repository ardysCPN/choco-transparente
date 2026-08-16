import { Municipio } from './territorial.types';

export type EstadoAlbergue = 'DISPONIBLE' | 'LLENO' | 'CERRADO';

export interface Albergue {
  id: string | number;
  municipioId: number;
  municipio?: Municipio;
  nombre: string;
  direccion: string;
  latitud?: number | null;
  longitud?: number | null;
  capacidad: number;
  ocupacion: number;
  responsable: string;
  telefono: string;
  servicios?: string | null;
  estado: EstadoAlbergue;
  fechaActualizacion?: string;
}

export interface CrearAlbergueInput {
  municipioId: number;
  nombre: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  capacidad: number;
  ocupacion?: number;
  responsable: string;
  telefono: string;
  servicios?: string;
  estado?: EstadoAlbergue;
}

export interface ActualizarAlbergueInput {
  municipioId?: number;
  nombre?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  capacidad?: number;
  ocupacion?: number;
  responsable?: string;
  telefono?: string;
  servicios?: string;
  estado?: EstadoAlbergue;
}

export type EstadoDenuncia =
  | 'RECIBIDA'
  | 'EN_REVISION'
  | 'INVESTIGACION'
  | 'RESUELTA'
  | 'DESCARTADA';

export type TipoDenuncia =
  | 'DESVIO_AYUDAS'
  | 'COBRO_INDEBIDO'
  | 'EXCLUSION_DISCRIMINATORIA'
  | 'ENTREGA_INCOMPLETA'
  | 'PROSELITISMO_POLITICO'
  | 'MAL_ESTADO_ALBERGUE'
  | 'OTRO';

export interface Denuncia {
  id: string | number;
  tipo: TipoDenuncia | string;
  descripcion: string;
  municipioId: number;
  municipio?: Municipio;
  barrio?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  evidencia?: string | null;
  fecha?: string;
  estado: EstadoDenuncia;
  respuesta?: string | null;
  atendidoPor?: string | number | null;
  identificadorOffline?: string | null;
}

export interface CrearDenunciaInput {
  tipo: TipoDenuncia | string;
  descripcion: string;
  municipioId: number;
  barrio?: string;
  latitud?: number;
  longitud?: number;
  evidencia?: string;
  estado?: EstadoDenuncia;
  respuesta?: string;
  identificadorOffline?: string;
}

export interface ActualizarDenunciaInput {
  tipo?: string;
  descripcion?: string;
  municipioId?: number;
  barrio?: string;
  latitud?: number;
  longitud?: number;
  evidencia?: string;
  estado?: EstadoDenuncia;
  respuesta?: string;
}
