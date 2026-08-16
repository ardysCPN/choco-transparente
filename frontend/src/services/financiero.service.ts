import { apiClient } from './api/client';
import {
  Donacion,
  CrearDonacionDineroInput,
  CrearDonacionEspecieInput,
  ActualizarDonacionInput,
  Gasto,
  CrearGastoInput,
  ActualizarGastoInput,
  AprobarGastoInput,
  FiltroReporteFinanciero,
} from '../types/financiero.types';
import { ApiResponse } from '../types/api.types';

export const donacionesService = {
  listarDonaciones: async (): Promise<Donacion[]> => {
    const response = await apiClient.get<ApiResponse<Donacion[]>>('/donaciones');
    return response.data.datos || [];
  },

  obtenerDonacion: async (id: string | number): Promise<Donacion> => {
    const response = await apiClient.get<ApiResponse<Donacion>>(`/donaciones/${id}`);
    return response.data.datos as Donacion;
  },

  crearDonacionDinero: async (datos: CrearDonacionDineroInput): Promise<Donacion> => {
    const response = await apiClient.post<ApiResponse<Donacion>>('/donaciones/dinero', datos);
    return response.data.datos as Donacion;
  },

  crearDonacionEspecie: async (datos: CrearDonacionEspecieInput): Promise<Donacion> => {
    const response = await apiClient.post<ApiResponse<Donacion>>('/donaciones/especie', datos);
    return response.data.datos as Donacion;
  },

  actualizarEstadoDonacion: async (
    id: string | number,
    datos: ActualizarDonacionInput
  ): Promise<Donacion> => {
    const response = await apiClient.put<ApiResponse<Donacion>>(`/donaciones/${id}`, datos);
    return response.data.datos as Donacion;
  },
};

export const gastosService = {
  listarGastos: async (): Promise<Gasto[]> => {
    const response = await apiClient.get<ApiResponse<Gasto[]>>('/gastos');
    return response.data.datos || [];
  },

  obtenerGasto: async (id: string | number): Promise<Gasto> => {
    const response = await apiClient.get<ApiResponse<Gasto>>(`/gastos/${id}`);
    return response.data.datos as Gasto;
  },

  crearGasto: async (datos: CrearGastoInput): Promise<Gasto> => {
    const response = await apiClient.post<ApiResponse<Gasto>>('/gastos', datos);
    return response.data.datos as Gasto;
  },

  actualizarGasto: async (id: string | number, datos: ActualizarGastoInput): Promise<Gasto> => {
    const response = await apiClient.put<ApiResponse<Gasto>>(`/gastos/${id}`, datos);
    return response.data.datos as Gasto;
  },

  aprobarGasto: async (id: string | number, datos: AprobarGastoInput): Promise<Gasto> => {
    const response = await apiClient.post<ApiResponse<Gasto>>(`/gastos/${id}/aprobar`, datos);
    return response.data.datos as Gasto;
  },

  listarPorOrganizacion: async (organizacionId: string | number): Promise<Gasto[]> => {
    const response = await apiClient.get<ApiResponse<Gasto[]>>(
      `/gastos/organizacion/${organizacionId}`
    );
    return response.data.datos || [];
  },
};

export const financieroReportesService = {
  reporteDonaciones: async (filtros?: FiltroReporteFinanciero): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/reportes/donaciones', {
      params: filtros,
    });
    return response.data.datos;
  },

  reporteGastos: async (filtros?: FiltroReporteFinanciero): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/reportes/gastos', {
      params: filtros,
    });
    return response.data.datos;
  },

  exportarReporte: async (
    filtros: FiltroReporteFinanciero,
    formato: 'JSON' | 'CSV' = 'JSON'
  ): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/reportes/exportar', {
      filtros,
      formato,
    });
    return response.data.datos;
  },
};
