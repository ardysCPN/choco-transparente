export interface DashboardAdministrativoData {
  resumen: {
    totalBeneficiarios: number;
    totalDonaciones: number;
    totalGastos: number;
    totalAfectaciones: number;
    totalMonetario: number;
    totalEntregado: number;
  };
  pendientes: {
    donacionesPendientes: number;
    gastosPendientes: number;
    solicitudesActivas: number;
  };
  capacidad: {
    alberguesDisponibles: number;
  };
  timestamp?: string | Date;
}

export interface MunicipioCobertura {
  id: number;
  nombre: string;
  _count: {
    afectaciones: number;
    beneficiarios: number;
  };
}

export interface DashboardPublicoData {
  impacto: {
    personasAsistidas: number;
    zonasAfectadas: number;
    alberguesActivos: number;
  };
  resumen?: {
    total_donaciones_dinero: number;
    total_gastos_aprobados: number;
  };
  denuncias: {
    reportesPendientes: number;
  };
  cobertura_territorial: MunicipioCobertura[];
  timestamp?: string | Date;
}

export interface EstadisticasInventarioData {
  inventario_total: Record<string, { cantidad: number; peso: number }>;
  centros_activos: number;
  timestamp?: string | Date;
}

export interface EstadisticasEntregasData {
  total_entregas: number;
  cantidad_distribuida: number;
  beneficiarios_atendidos: number;
  timestamp?: string | Date;
}

export interface FiltroReporteQuery {
  fechaInicio?: string;
  fechaFin?: string;
  municipioId?: number;
  estado?: string;
  tipo?: string;
}

export interface ReporteDonacionesResponse {
  total: number;
  totalDinero: number;
  por_estado: Record<string, number>;
  por_tipo: Record<string, number>;
  donaciones: any[];
}

export interface ReporteGastosResponse {
  total: number;
  totalGastos: number;
  por_estado: Record<string, number>;
  gastos: any[];
}

export interface ReporteBeneficiariosResponse {
  total: number;
  totalPersonas: number;
  por_estado: Record<string, number>;
  beneficiarios: any[];
}

export interface ReporteAfectacionesResponse {
  total: number;
  por_severidad: Record<string, number>;
  por_estado: Record<string, number>;
  afectaciones: any[];
}

export interface ReporteInventarioResponse {
  total: number;
  totalCantidad: number;
  totalPeso: number;
  por_tipo: Record<string, number>;
  inventarios: any[];
}

export interface ColaSyncItem {
  id: string;
  tipo: 'CREATE' | 'UPDATE' | 'DELETE';
  entidad: string;
  entidadId: string;
  datos: any;
  timestamp: string;
  sincronizado: boolean;
}
