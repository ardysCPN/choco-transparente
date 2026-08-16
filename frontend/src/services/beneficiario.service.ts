import { apiClient } from './api/client';
import {
  Beneficiario,
  CrearBeneficiarioInput,
  SolicitudAyuda,
  CrearSolicitudInput,
  EntregaAyuda,
  CrearEntregaInput,
} from '../types/beneficiario.types';
import { RespuestaAPI } from '../types/api.types';

export const beneficiarioService = {
  // ─── Beneficiarios ───────────────────────────
  listar: async (): Promise<RespuestaAPI<Beneficiario[]>> => {
    const res = await apiClient.get<RespuestaAPI<Beneficiario[]>>('/beneficiarios');
    return res.data;
  },

  obtener: async (id: number | string): Promise<RespuestaAPI<Beneficiario>> => {
    const res = await apiClient.get<RespuestaAPI<Beneficiario>>(`/beneficiarios/${id}`);
    return res.data;
  },

  crear: async (datos: CrearBeneficiarioInput): Promise<RespuestaAPI<Beneficiario>> => {
    const res = await apiClient.post<RespuestaAPI<Beneficiario>>('/beneficiarios', datos);
    return res.data;
  },

  actualizar: async (
    id: number | string,
    datos: Partial<CrearBeneficiarioInput>
  ): Promise<RespuestaAPI<Beneficiario>> => {
    const res = await apiClient.put<RespuestaAPI<Beneficiario>>(`/beneficiarios/${id}`, datos);
    return res.data;
  },

  // ─── Solicitudes de Ayuda ────────────────────
  listarSolicitudes: async (): Promise<RespuestaAPI<SolicitudAyuda[]>> => {
    const res = await apiClient.get<RespuestaAPI<SolicitudAyuda[]>>('/solicitudes-ayuda');
    return res.data;
  },

  crearSolicitud: async (datos: CrearSolicitudInput): Promise<RespuestaAPI<SolicitudAyuda>> => {
    const res = await apiClient.post<RespuestaAPI<SolicitudAyuda>>('/solicitudes-ayuda', datos);
    return res.data;
  },

  actualizarSolicitud: async (
    id: number | string,
    datos: Partial<CrearSolicitudInput>
  ): Promise<RespuestaAPI<SolicitudAyuda>> => {
    const res = await apiClient.put<RespuestaAPI<SolicitudAyuda>>(`/solicitudes-ayuda/${id}`, datos);
    return res.data;
  },

  // ─── Entregas de Ayuda ───────────────────────
  listarEntregas: async (): Promise<RespuestaAPI<EntregaAyuda[]>> => {
    const res = await apiClient.get<RespuestaAPI<EntregaAyuda[]>>('/entregas-ayuda');
    return res.data;
  },

  crearEntrega: async (datos: CrearEntregaInput): Promise<RespuestaAPI<EntregaAyuda>> => {
    const res = await apiClient.post<RespuestaAPI<EntregaAyuda>>('/entregas-ayuda', datos);
    return res.data;
  },

  actualizarEntrega: async (
    id: number | string,
    datos: Partial<CrearEntregaInput>
  ): Promise<RespuestaAPI<EntregaAyuda>> => {
    const res = await apiClient.put<RespuestaAPI<EntregaAyuda>>(`/entregas-ayuda/${id}`, datos);
    return res.data;
  },

  // ─── Reportes ────────────────────────────────
  reporteBeneficiarios: async (): Promise<RespuestaAPI<any>> => {
    const res = await apiClient.get<RespuestaAPI<any>>('/reportes/beneficiarios');
    return res.data;
  },

  // ─── Dashboard Stats ─────────────────────────
  estadisticasEntregas: async (): Promise<RespuestaAPI<any>> => {
    const res = await apiClient.get<RespuestaAPI<any>>('/dashboards/entregas');
    return res.data;
  },
};
