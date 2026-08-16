import { apiClient } from './api/client';
import {
  Albergue,
  CrearAlbergueInput,
  ActualizarAlbergueInput,
  Denuncia,
  CrearDenunciaInput,
  ActualizarDenunciaInput,
} from '../types/albergue-denuncia.types';
import { ApiResponse } from '../types/api.types';

export const alberguesService = {
  getAlbergues: async (): Promise<Albergue[]> => {
    const response = await apiClient.get<ApiResponse<Albergue[]>>('/albergues');
    return response.data.datos || [];
  },

  getAlbergue: async (id: string | number): Promise<Albergue> => {
    const response = await apiClient.get<ApiResponse<Albergue>>(`/albergues/${id}`);
    return response.data.datos as Albergue;
  },

  crearAlbergue: async (datos: CrearAlbergueInput): Promise<Albergue> => {
    const response = await apiClient.post<ApiResponse<Albergue>>('/albergues', datos);
    return response.data.datos as Albergue;
  },

  actualizarAlbergue: async (
    id: string | number,
    datos: ActualizarAlbergueInput
  ): Promise<Albergue> => {
    const response = await apiClient.put<ApiResponse<Albergue>>(`/albergues/${id}`, datos);
    return response.data.datos as Albergue;
  },
};

export const denunciasService = {
  getDenuncias: async (): Promise<Denuncia[]> => {
    const response = await apiClient.get<ApiResponse<Denuncia[]>>('/denuncias');
    return response.data.datos || [];
  },

  getDenuncia: async (id: string | number): Promise<Denuncia> => {
    const response = await apiClient.get<ApiResponse<Denuncia>>(`/denuncias/${id}`);
    return response.data.datos as Denuncia;
  },

  crearDenuncia: async (datos: CrearDenunciaInput): Promise<Denuncia> => {
    const response = await apiClient.post<ApiResponse<Denuncia>>('/denuncias', datos);
    return response.data.datos as Denuncia;
  },

  actualizarDenuncia: async (
    id: string | number,
    datos: ActualizarDenunciaInput
  ): Promise<Denuncia> => {
    const response = await apiClient.put<ApiResponse<Denuncia>>(`/denuncias/${id}`, datos);
    return response.data.datos as Denuncia;
  },
};
