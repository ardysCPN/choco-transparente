import { Municipio } from './territorial.types';

// ──────────────────────────────────────────────
// BENEFICIARIOS
// ──────────────────────────────────────────────
export interface Beneficiario {
  id: number | string;
  codigoFamilia: string;
  municipioId: number;
  municipio?: Municipio;
  barrio?: string | null;
  direccion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  cantidadPersonas: number;
  contacto?: string | null;
  estado: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
  fechaRegistro: string;
}

export interface CrearBeneficiarioInput {
  codigoFamilia: string;
  municipioId: number;
  barrio?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  cantidadPersonas: number;
  contacto?: string;
  estado?: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
}

// ──────────────────────────────────────────────
// SOLICITUDES DE AYUDA
// ──────────────────────────────────────────────
export interface SolicitudAyuda {
  id: number | string;
  beneficiarioId: number | string;
  beneficiario?: Beneficiario;
  afectacionId: number | string;
  afectacion?: {
    id: number | string;
    tipoEmergencia: string;
    descripcion: string;
    severidad: string;
    municipio?: Municipio;
  };
  tipoNecesidad: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  descripcion?: string | null;
  cantidadSolicitada: number;
  evidencia?: string | null;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'ATENDIDA';
  fechaSolicitud: string;
}

export interface CrearSolicitudInput {
  beneficiarioId: number | string;
  afectacionId: number | string;
  tipoNecesidad: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  descripcion?: string;
  cantidadSolicitada: number;
  evidencia?: string;
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'ATENDIDA';
}

// ──────────────────────────────────────────────
// ENTREGAS DE AYUDA
// ──────────────────────────────────────────────
export interface EntregaAyuda {
  id: number | string;
  solicitudId?: number | string | null;
  solicitud?: SolicitudAyuda | null;
  beneficiarioId: number | string;
  beneficiario?: Beneficiario;
  loteId?: number | string | null;
  cantidad: number;
  responsableEntrega: number | string;
  evidencia: string;
  latitud?: number | null;
  longitud?: number | null;
  observaciones?: string | null;
  fecha: string;
}

export interface CrearEntregaInput {
  solicitudId?: number | string;
  beneficiarioId: number | string;
  loteId?: number | string;
  cantidad: number;
  responsableEntrega: number | string;
  evidencia: string;
  latitud?: number;
  longitud?: number;
  observaciones?: string;
}

// ──────────────────────────────────────────────
// ESTADÍSTICAS / DASHBOARD
// ──────────────────────────────────────────────
export interface EstadisticasBeneficiarios {
  totalFamilias: number;
  totalPersonas: number;
  solicitudesPendientes: number;
  totalEntregas: number;
  cantidadDistribuida: number;
  porEstado: Record<string, number>;
}
