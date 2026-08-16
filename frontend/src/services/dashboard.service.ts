import { apiClient } from './api/client';
import {
  DashboardAdministrativoData,
  DashboardPublicoData,
  EstadisticasInventarioData,
  EstadisticasEntregasData,
} from '../types/reporte-dashboard.types';
import { ApiResponse } from '../types/api.types';

export const dashboardService = {
  getDashboardAdministrativo: async (): Promise<DashboardAdministrativoData> => {
    const response = await apiClient.get<ApiResponse<DashboardAdministrativoData>>(
      '/dashboards/administrativo'
    );
    return response.data.datos as DashboardAdministrativoData;
  },

  getDashboardPublico: async (): Promise<DashboardPublicoData> => {
    const response = await apiClient.get<ApiResponse<DashboardPublicoData>>(
      '/dashboards/publico'
    );
    return response.data.datos as DashboardPublicoData;
  },

  getEstadisticasInventario: async (): Promise<EstadisticasInventarioData> => {
    const response = await apiClient.get<ApiResponse<EstadisticasInventarioData>>(
      '/dashboards/inventario'
    );
    return response.data.datos as EstadisticasInventarioData;
  },

  getEstadisticasEntregas: async (municipioId?: number): Promise<EstadisticasEntregasData> => {
    const url = municipioId
      ? `/dashboards/entregas/${municipioId}`
      : '/dashboards/entregas';
    const response = await apiClient.get<ApiResponse<EstadisticasEntregasData>>(url);
    return response.data.datos as EstadisticasEntregasData;
  },
};
