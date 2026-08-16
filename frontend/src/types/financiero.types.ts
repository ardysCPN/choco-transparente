import { Municipio } from './territorial.types';

export type EstadoDonacion = 'PENDIENTE' | 'RECIBIDO' | 'RECHAZADO';
export type TipoDonacion = 'DINERO' | 'ESPECIE';
export type EstadoGasto = 'BORRADOR' | 'APROBADO' | 'RECHAZADO';

export interface Organizacion {
  id: string | number;
  nombre: string;
  tipo?: string;
  identificacion?: string;
  responsable?: string;
  telefono?: string;
  correo?: string;
  estado?: string;
}

export interface DonacionDinero {
  donacionId?: string | number;
  cuentaDestino: string;
  referencia: string;
  monto: number;
  soporteArchivo?: string;
}

export interface DonacionEspecie {
  donacionId?: string | number;
  tipoAyuda: string;
  cantidad: number;
  peso?: number | null;
  unidadMedida: string;
}

export interface Donacion {
  id: string | number;
  organizacionId?: string | number | null;
  tipo: TipoDonacion;
  donante: string;
  monto?: number | null;
  descripcion?: string | null;
  municipioId?: number | null;
  fecha?: string;
  estado: EstadoDonacion;
  organizacion?: Organizacion | null;
  municipio?: Municipio | null;
  dinero?: DonacionDinero | null;
  especie?: DonacionEspecie | null;
}

export interface CrearDonacionDineroInput {
  donante: string;
  monto: number;
  cuentaDestino: string;
  referencia: string;
  municipioId?: number;
  organizacionId?: number;
  descripcion?: string;
}

export interface CrearDonacionEspecieInput {
  donante: string;
  tipoAyuda: string;
  cantidad: number;
  peso?: number;
  unidadMedida: string;
  municipioId?: number;
  organizacionId?: number;
  descripcion?: string;
}

export interface ActualizarDonacionInput {
  estado?: EstadoDonacion;
}

export interface Gasto {
  id: string | number;
  organizacionId: string | number;
  concepto: string;
  monto: number;
  proveedor: string;
  numeroFactura: string;
  fecha: string;
  soporte: string;
  estado: EstadoGasto;
  creadoPor?: string | number;
  aprobadoPor?: string | number | null;
  organizacion?: Organizacion | null;
}

export interface CrearGastoInput {
  organizacionId: number;
  concepto: string;
  monto: number;
  proveedor: string;
  numeroFactura: string;
  fecha: string;
  soporte: string;
}

export interface ActualizarGastoInput {
  concepto?: string;
  monto?: number;
  proveedor?: string;
  numeroFactura?: string;
  soporte?: string;
}

export interface AprobarGastoInput {
  accion: 'APROBAR' | 'RECHAZAR';
  observaciones?: string;
}

export interface FiltroReporteFinanciero {
  fechaInicio?: string;
  fechaFin?: string;
  municipioId?: number;
  tipo?: string;
}
