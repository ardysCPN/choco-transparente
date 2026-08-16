import { apiClient } from './api/client';
import {
  FiltroReporteQuery,
  ReporteDonacionesResponse,
  ReporteGastosResponse,
  ReporteBeneficiariosResponse,
  ReporteAfectacionesResponse,
  ReporteInventarioResponse,
} from '../types/reporte-dashboard.types';
import { ApiResponse } from '../types/api.types';

export const reporteService = {
  getReporteDonaciones: async (
    filtros?: FiltroReporteQuery
  ): Promise<ReporteDonacionesResponse> => {
    const response = await apiClient.get<ApiResponse<ReporteDonacionesResponse>>(
      '/reportes/donaciones',
      { params: filtros }
    );
    return response.data.datos as ReporteDonacionesResponse;
  },

  getReporteGastos: async (
    filtros?: FiltroReporteQuery
  ): Promise<ReporteGastosResponse> => {
    const response = await apiClient.get<ApiResponse<ReporteGastosResponse>>(
      '/reportes/gastos',
      { params: filtros }
    );
    return response.data.datos as ReporteGastosResponse;
  },

  getReporteBeneficiarios: async (
    filtros?: FiltroReporteQuery
  ): Promise<ReporteBeneficiariosResponse> => {
    const response = await apiClient.get<ApiResponse<ReporteBeneficiariosResponse>>(
      '/reportes/beneficiarios',
      { params: filtros }
    );
    return response.data.datos as ReporteBeneficiariosResponse;
  },

  getReporteAfectaciones: async (
    filtros?: FiltroReporteQuery
  ): Promise<ReporteAfectacionesResponse> => {
    const response = await apiClient.get<ApiResponse<ReporteAfectacionesResponse>>(
      '/reportes/afectaciones',
      { params: filtros }
    );
    return response.data.datos as ReporteAfectacionesResponse;
  },

  getReporteInventario: async (): Promise<ReporteInventarioResponse> => {
    const response = await apiClient.get<ApiResponse<ReporteInventarioResponse>>(
      '/reportes/inventario'
    );
    return response.data.datos as ReporteInventarioResponse;
  },

  exportarReporte: async (
    filtros: FiltroReporteQuery,
    formato: 'JSON' | 'CSV' = 'JSON'
  ): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/reportes/exportar', {
      filtros,
      formato,
    });
    return response.data.datos;
  },
};
