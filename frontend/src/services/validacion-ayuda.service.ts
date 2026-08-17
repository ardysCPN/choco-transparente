import { apiClient } from './api/client';
import { ApiResponse } from '../types/publico.types';
import {
  ResultadoConsultaAyuda,
  RegistrarAyudaPayload,
  ResultadoRegistroAyuda,
} from '../types/validacion-ayuda.types';

export const validacionAyudaService = {
  /**
   * Consulta pública si una identificación ya registra una ayuda humanitaria
   */
  async consultar(numeroIdentificacion: string): Promise<ApiResponse<ResultadoConsultaAyuda>> {
    const { data } = await apiClient.post<ApiResponse<ResultadoConsultaAyuda>>(
      '/validacion-ayuda/consultar',
      {
        numeroIdentificacion: numeroIdentificacion.trim(),
      }
    );
    return data;
  },

  /**
   * Registra una nueva entrega de ayuda con consentimiento
   */
  async registrar(payload: RegistrarAyudaPayload): Promise<ApiResponse<ResultadoRegistroAyuda>> {
    const { data } = await apiClient.post<ApiResponse<ResultadoRegistroAyuda>>(
      '/validacion-ayuda/registrar',
      {
        numeroIdentificacion: payload.numeroIdentificacion.trim(),
        organizacionEntregante: payload.organizacionEntregante.trim(),
        consentimientoDatos: payload.consentimientoDatos,
      }
    );
    return data;
  },
};
