export type TipoAyuda =
  | 'KIT_ALIMENTOS'
  | 'KIT_ASEO'
  | 'KIT_COCINA'
  | 'FRAZADAS_COLCHONETAS'
  | 'AGUA_POTABLE'
  | 'MEDICAMENTOS_PRIMEROS_AUXILIOS'
  | 'HERRAMIENTAS_REPARACION'
  | 'CARPAS_REFUGIO'
  | string;

export interface ItemInventario {
  id: string | number;
  centroAcopioId: string | number;
  municipioId: number;
  tipoAyuda: TipoAyuda;
  unidadMedida: string;
  cantidadActual: number;
  pesoActual: number;
  fechaActualizacion?: string;
  centroAcopio?: {
    id: string | number;
    nombre: string;
    municipioId: number;
    municipio?: {
      id: number;
      nombre: string;
    };
  };
}

export interface EntradaInventario {
  id: string | number;
  centroAcopioId: string | number;
  centroAcopio?: {
    id: string | number;
    nombre: string;
  };
  loteId?: string | number | null;
  tipoAyuda: TipoAyuda;
  cantidad: number;
  peso?: number | null;
  origen: string;
  numeroDocumento?: string | null;
  fotoCamion?: string | null;
  usuarioId: string | number;
  fechaIngreso?: string;
}

export interface SalidaInventario {
  id: string | number;
  centroAcopioId: string | number;
  centroAcopio?: {
    id: string | number;
    nombre: string;
  };
  loteId?: string | number | null;
  tipoAyuda: TipoAyuda;
  cantidad: number;
  peso?: number | null;
  municipioId: number;
  municipio?: {
    id: number;
    nombre: string;
  };
  barrio?: string | null;
  fotoEntrega: string;
  usuarioId: string | number;
  beneficiarioId?: string | number | null;
  fechaSalida?: string;
}

export interface RegistrarEntradaInput {
  centroAcopioId: string | number;
  tipoAyuda: string;
  cantidad: number;
  peso?: number;
  origen: string;
  numeroDocumento?: string;
  fotoCamion?: string;
  usuarioId: string | number;
  loteId?: string | number;
  identificadorOffline?: string;
}

export interface RegistrarSalidaInput {
  centroAcopioId: string | number;
  tipoAyuda: string;
  cantidad: number;
  peso?: number;
  municipioId: number;
  barrio?: string;
  fotoEntrega: string;
  usuarioId: string | number;
  beneficiarioId?: string | number;
  loteId?: string | number;
  identificadorOffline?: string;
}

export interface EstadisticasInventarioData {
  inventario_total: Record<string, { cantidad: number; peso: number }>;
  centros_activos: number;
  timestamp: string;
}

export interface ReporteInventarioData {
  totalItems: number;
  totalKits: number;
  totalKilos: number;
  inventarios: ItemInventario[];
}
