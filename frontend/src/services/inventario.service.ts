import { apiClient } from './api/client';
import {
  ItemInventario,
  RegistrarEntradaInput,
  RegistrarSalidaInput,
  EntradaInventario,
  SalidaInventario,
  EstadisticasInventarioData,
} from '../types/inventario.types';
import { RespuestaAPI } from '../types/api.types';

export const inventarioService = {
  /**
   * Listar inventario de un centro de acopio específico
   */
  listarPorCentro: async (centroAcopioId: string | number): Promise<RespuestaAPI<ItemInventario[]>> => {
    const response = await apiClient.get<RespuestaAPI<ItemInventario[]>>(
      `/inventario/centro/${centroAcopioId}`
    );
    return response.data;
  },

  /**
   * Registrar ingreso de donaciones / remesas al inventario
   */
  registrarEntrada: async (
    datos: RegistrarEntradaInput
  ): Promise<RespuestaAPI<EntradaInventario>> => {
    const response = await apiClient.post<RespuestaAPI<EntradaInventario>>(
      '/inventario/entradas',
      datos
    );
    return response.data;
  },

  /**
   * Registrar despacho o entrega de ayudas desde el inventario
   */
  registrarSalida: async (
    datos: RegistrarSalidaInput
  ): Promise<RespuestaAPI<SalidaInventario>> => {
    const response = await apiClient.post<RespuestaAPI<SalidaInventario>>(
      '/inventario/salidas',
      datos
    );
    return response.data;
  },

  /**
   * Obtener estadísticas consolidadas de inventario
   */
  obtenerEstadisticas: async (): Promise<RespuestaAPI<EstadisticasInventarioData>> => {
    const response = await apiClient.get<RespuestaAPI<EstadisticasInventarioData>>(
      '/dashboards/inventario'
    );
    return response.data;
  },

  /**
   * Obtener reporte completo de inventario departamental
   */
  obtenerReporte: async (): Promise<RespuestaAPI<any>> => {
    const response = await apiClient.get<RespuestaAPI<any>>('/reportes/inventario');
    return response.data;
  },
};
