import { apiClient } from './api/client';
import { ApiResponse } from '../types/publico.types';
import { Usuario, Rol, CrearUsuarioInput, ActualizarUsuarioInput } from '../types/usuarios.types';

export const usuariosService = {
  async listarUsuarios(): Promise<ApiResponse<Usuario[]>> {
    const { data } = await apiClient.get<ApiResponse<Usuario[]>>('/usuarios');
    return data;
  },

  async obtenerPerfil(): Promise<ApiResponse<Usuario>> {
    const { data } = await apiClient.get<ApiResponse<Usuario>>('/usuarios/perfil');
    return data;
  },

  async crearUsuario(input: CrearUsuarioInput): Promise<ApiResponse<Usuario>> {
    const { data } = await apiClient.post<ApiResponse<Usuario>>('/usuarios', input);
    return data;
  },

  async actualizarUsuario(id: string | number, input: ActualizarUsuarioInput): Promise<ApiResponse<Usuario>> {
    const { data } = await apiClient.put<ApiResponse<Usuario>>(`/usuarios/${id}`, input);
    return data;
  },

  async cambiarEstado(id: string | number, activo: boolean): Promise<ApiResponse<Usuario>> {
    const { data } = await apiClient.patch<ApiResponse<Usuario>>(`/usuarios/${id}/estado`, { activo });
    return data;
  },

  async listarRoles(): Promise<ApiResponse<Rol[]>> {
    const { data } = await apiClient.get<ApiResponse<Rol[]>>('/roles');
    return data;
  },
};
