import { apiClient } from './api/client';
import { DashboardPublicoData } from '../types/reporte-dashboard.types';
import {
  ApiResponse,
  MunicipioPublico,
  CentroAcopioPublico,
  AlberguePublico,
  AfectacionPublica,
  InventarioConsolidadoItem,
  DirectorioMunicipio,
  SolicitudAyudaPublicaPayload,
  ProponerCentroAcopioPayload,
  DonacionPublicaPayload,
  VoluntariadoPublicoPayload,
  TransportePublicoPayload,
  DenunciaPublicaPayload,
  VinculacionCentroPayload,
} from '../types/publico.types';

export const publicoService = {
  // Consultas
  async getDashboard(): Promise<DashboardPublicoData> {
    const { data } = await apiClient.get<ApiResponse<DashboardPublicoData>>('/publico/dashboard');
    return data.datos;
  },

  async getMunicipios(): Promise<MunicipioPublico[]> {
    const { data } = await apiClient.get<ApiResponse<MunicipioPublico[]>>('/publico/municipios');
    return data.datos;
  },

  async getMunicipio(id: number): Promise<any> {
    const { data } = await apiClient.get<ApiResponse<any>>(`/publico/municipios/${id}`);
    return data.datos;
  },

  async getCentrosAcopio(): Promise<CentroAcopioPublico[]> {
    const { data } = await apiClient.get<ApiResponse<CentroAcopioPublico[]>>('/publico/centros-acopio');
    return data.datos;
  },

  async getCentroAcopio(id: string | number): Promise<CentroAcopioPublico> {
    const { data } = await apiClient.get<ApiResponse<CentroAcopioPublico>>(`/publico/centros-acopio/${id}`);
    return data.datos;
  },

  async getInventario(): Promise<InventarioConsolidadoItem[]> {
    const { data } = await apiClient.get<ApiResponse<InventarioConsolidadoItem[]>>('/publico/inventario');
    return data.datos;
  },

  async getAlbergues(): Promise<AlberguePublico[]> {
    const { data } = await apiClient.get<ApiResponse<AlberguePublico[]>>('/publico/albergues');
    return data.datos;
  },

  async getAfectaciones(): Promise<AfectacionPublica[]> {
    const { data } = await apiClient.get<ApiResponse<AfectacionPublica[]>>('/publico/afectaciones');
    return data.datos;
  },

  async getContactos(): Promise<DirectorioMunicipio[]> {
    const { data } = await apiClient.get<ApiResponse<DirectorioMunicipio[]>>('/publico/contactos');
    return data.datos;
  },

  // Formularios de Participación
  async registrarSolicitudAyuda(payload: SolicitudAyudaPublicaPayload): Promise<{ radicado: string; solicitudId: number; mensaje: string }> {
    const { data } = await apiClient.post<ApiResponse<{ radicado: string; solicitudId: number; mensaje: string }>>('/publico/solicitudes-ayuda', payload);
    return data.datos;
  },

  async proponerCentroAcopio(payload: ProponerCentroAcopioPayload): Promise<{ id: number; estado: string; mensaje: string }> {
    const { data } = await apiClient.post<ApiResponse<{ id: number; estado: string; mensaje: string }>>('/publico/centros-acopio', payload);
    return data.datos;
  },

  async registrarDonacion(payload: DonacionPublicaPayload): Promise<{ id: number; estado: string; mensaje: string }> {
    const { data } = await apiClient.post<ApiResponse<{ id: number; estado: string; mensaje: string }>>('/publico/donaciones', payload);
    return data.datos;
  },

  async registrarVoluntario(payload: VoluntariadoPublicoPayload): Promise<{ registrado: boolean; mensaje: string }> {
    const { data } = await apiClient.post<ApiResponse<{ registrado: boolean; mensaje: string }>>('/publico/voluntarios', payload);
    return data.datos;
  },

  async registrarTransporte(payload: TransportePublicoPayload): Promise<{ registrado: boolean; mensaje: string }> {
    const { data } = await apiClient.post<ApiResponse<{ registrado: boolean; mensaje: string }>>('/publico/transportadores', payload);
    return data.datos;
  },

  async registrarDenuncia(payload: DenunciaPublicaPayload): Promise<{ radicado: string; denunciaId: number; estado: string; mensaje: string }> {
    const { data } = await apiClient.post<ApiResponse<{ radicado: string; denunciaId: number; estado: string; mensaje: string }>>('/publico/denuncias', payload);
    return data.datos;
  },

  async vincularACentro(payload: VinculacionCentroPayload): Promise<{ vinculado: boolean; mensaje: string }> {
    const { data } = await apiClient.post<ApiResponse<{ vinculado: boolean; mensaje: string }>>('/publico/vinculaciones-centro', payload);
    return data.datos;
  },
};
