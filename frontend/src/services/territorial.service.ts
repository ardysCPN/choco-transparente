import { apiClient } from './api/client';
import {
  Municipio,
  CrearMunicipioInput,
  Afectacion,
  CrearAfectacionInput,
  CentroAcopio,
  CrearCentroAcopioInput,
  AuditarCentroAcopioInput,
} from '../types/territorial.types';
import { RespuestaAPI } from '../types/api.types';

export const territorialService = {
  // --- Municipios ---
  listarMunicipios: async (): Promise<RespuestaAPI<Municipio[]>> => {
    const response = await apiClient.get<RespuestaAPI<Municipio[]>>('/municipios');
    return response.data;
  },

  obtenerMunicipio: async (id: number): Promise<RespuestaAPI<Municipio>> => {
    const response = await apiClient.get<RespuestaAPI<Municipio>>(`/municipios/${id}`);
    return response.data;
  },

  crearMunicipio: async (datos: CrearMunicipioInput): Promise<RespuestaAPI<Municipio>> => {
    const response = await apiClient.post<RespuestaAPI<Municipio>>('/municipios', datos);
    return response.data;
  },

  actualizarMunicipio: async (
    id: number,
    datos: Partial<CrearMunicipioInput>
  ): Promise<RespuestaAPI<Municipio>> => {
    const response = await apiClient.put<RespuestaAPI<Municipio>>(`/municipios/${id}`, datos);
    return response.data;
  },

  // --- Afectaciones ---
  listarAfectaciones: async (): Promise<RespuestaAPI<Afectacion[]>> => {
    const response = await apiClient.get<RespuestaAPI<Afectacion[]>>('/afectaciones');
    return response.data;
  },

  obtenerAfectacion: async (id: string | number): Promise<RespuestaAPI<Afectacion>> => {
    const response = await apiClient.get<RespuestaAPI<Afectacion>>(`/afectaciones/${id}`);
    return response.data;
  },

  crearAfectacion: async (datos: CrearAfectacionInput): Promise<RespuestaAPI<Afectacion>> => {
    const response = await apiClient.post<RespuestaAPI<Afectacion>>('/afectaciones', datos);
    return response.data;
  },

  actualizarAfectacion: async (
    id: string | number,
    datos: Partial<CrearAfectacionInput>
  ): Promise<RespuestaAPI<Afectacion>> => {
    const response = await apiClient.put<RespuestaAPI<Afectacion>>(`/afectaciones/${id}`, datos);
    return response.data;
  },

  // --- Centros de Acopio ---
  listarCentrosAcopio: async (): Promise<RespuestaAPI<CentroAcopio[]>> => {
    const response = await apiClient.get<RespuestaAPI<CentroAcopio[]>>('/centros-acopio');
    return response.data;
  },

  obtenerCentroAcopio: async (id: string | number): Promise<RespuestaAPI<CentroAcopio>> => {
    const response = await apiClient.get<RespuestaAPI<CentroAcopio>>(`/centros-acopio/${id}`);
    return response.data;
  },

  crearCentroAcopio: async (
    datos: CrearCentroAcopioInput
  ): Promise<RespuestaAPI<CentroAcopio>> => {
    const response = await apiClient.post<RespuestaAPI<CentroAcopio>>('/centros-acopio', datos);
    return response.data;
  },

  actualizarCentroAcopio: async (
    id: string | number,
    datos: Partial<CrearCentroAcopioInput>
  ): Promise<RespuestaAPI<CentroAcopio>> => {
    const response = await apiClient.put<RespuestaAPI<CentroAcopio>>(`/centros-acopio/${id}`, datos);
    return response.data;
  },

  auditarCentroAcopio: async (
    id: string | number,
    datos: AuditarCentroAcopioInput
  ): Promise<RespuestaAPI<any>> => {
    const response = await apiClient.post<RespuestaAPI<any>>(
      `/centros-acopio/${id}/auditar`,
      datos
    );
    return response.data;
  },
};
