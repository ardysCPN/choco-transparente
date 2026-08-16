import { apiClient } from './api/client';
import { LoginRequest, LoginResponseData, Usuario } from '../types/auth.types';
import { RespuestaAPI } from '../types/api.types';

export const authService = {
  /**
   * Iniciar sesión en el sistema
   */
  login: async (datos: LoginRequest): Promise<RespuestaAPI<LoginResponseData>> => {
    const response = await apiClient.post<RespuestaAPI<LoginResponseData>>(
      '/autenticacion/iniciar-sesion',
      datos
    );
    return response.data;
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  getPerfil: async (): Promise<RespuestaAPI<Usuario>> => {
    const response = await apiClient.get<RespuestaAPI<Usuario>>('/usuarios/perfil');
    return response.data;
  },

  /**
   * Cerrar sesión limpiando cliente
   */
  logout: () => {
    // Si el backend tuviera endpoint de invalidación de token, se llamaría aquí
  },
};
