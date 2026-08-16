export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
  codigo?: string;
}

export interface MunicipioPublico {
  id: number;
  codigoDane: string;
  nombre: string;
  latitud: number | string | null;
  longitud: number | string | null;
  nivelAlerta: 'VERDE' | 'AMARILLO' | 'ROJO';
  afectacionesActivas: number;
  centrosAprobados: number;
  alberguesDisponibles: number;
}

export interface CentroAcopioPublico {
  id: string | number;
  nombre: string;
  direccion: string;
  barrio?: string;
  telefono?: string;
  responsable?: string;
  latitud?: number | string | null;
  longitud?: number | string | null;
  fotoFachada?: string | null;
  estado: string;
  fechaAprobacion?: string;
  municipio?: {
    id: number;
    nombre: string;
    codigoDane: string;
  };
  inventarios?: Array<{
    tipoAyuda: string;
    cantidadActual: number;
    pesoActual: number;
    unidadMedida: string;
    fechaActualizacion: string;
  }>;
}

export interface AlberguePublico {
  id: number;
  nombre: string;
  direccion: string;
  capacidad: number;
  ocupacion: number;
  servicios: string;
  estado: 'DISPONIBLE' | 'CASI_LLENO' | 'LLENO' | 'CERRADO';
  latitud?: number | string | null;
  longitud?: number | string | null;
  municipio?: {
    id: number;
    nombre: string;
  };
}

export interface AfectacionPublica {
  id: string | number;
  nombre: string;
  descripcion?: string;
  tipo: string;
  severidad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  estado: 'ACTIVA' | 'EN_ATENCION' | 'CONTROLADA' | 'CERRADA';
  direccion?: string;
  latitud?: number | string | null;
  longitud?: number | string | null;
  fechaInicio: string;
  municipio?: {
    id: number;
    nombre: string;
  };
}

export interface InventarioConsolidadoItem {
  tipoAyuda: string;
  totalUnidades: number;
  totalPesoKg: number;
}

export interface DirectorioMunicipio {
  municipioId: number;
  municipio: string;
  codigoDane: string;
  contactos: Array<{
    entidad: string;
    tipo: string;
    telefono: string;
    correo: string;
    direccion: string;
    horario: string;
  }>;
}

export interface SolicitudAyudaPublicaPayload {
  municipioId: number;
  barrio: string;
  direccionAproximada: string;
  cantidadPersonas: number;
  tipoNecesidad: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  contacto: string;
  nombreResponsable: string;
  evidencia?: string;
  latitud?: number;
  longitud?: number;
}

export interface ProponerCentroAcopioPayload {
  municipioId: number;
  nombre: string;
  barrio: string;
  direccion: string;
  responsable: string;
  telefono: string;
  correo?: string;
  fotoFachada?: string;
  latitud?: number;
  longitud?: number;
}

export interface DonacionPublicaPayload {
  tipo: 'DINERO' | 'ESPECIE';
  donante: string;
  correo?: string;
  telefono: string;
  municipioId?: number;
  descripcion?: string;
  monto?: number;
  referenciaTransferencia?: string;
  tipoAyuda?: string;
  cantidad?: number;
  unidadMedida?: string;
  requiereTransporte?: boolean;
}

export interface VoluntariadoPublicoPayload {
  nombre: string;
  municipioId: number;
  telefono: string;
  correo: string;
  tipoApoyo: string;
  disponibilidad: string;
  observaciones?: string;
}

export interface TransportePublicoPayload {
  nombrePropietario: string;
  municipioId: number;
  telefono: string;
  tipoVehiculo: string;
  capacidadCargaKg: number;
  zonasCobertura: string;
  disponibilidad: string;
  observaciones?: string;
}

export interface DenunciaPublicaPayload {
  tipo: string;
  municipioId: number;
  barrio: string;
  descripcion: string;
  evidencia?: string;
  denuncianteNombre?: string;
  denuncianteContacto?: string;
  esAnonima: boolean;
  latitud?: number;
  longitud?: number;
}

export interface VinculacionCentroPayload {
  centroAcopioId: number;
  nombre: string;
  telefono: string;
  correo: string;
  actividad: string;
  mensaje?: string;
}
