import { prisma } from '../../comun/biblioteca/prisma.js';

export interface CambioOffline {
  id: string;
  tipo: 'CREATE' | 'UPDATE' | 'DELETE';
  entidad: string;
  entidadId: string;
  datos: any;
  timestamp: Date;
  sincronizado: boolean;
}

export class SincronizacionServicio {
  private cambios: Map<string, CambioOffline> = new Map();

  async registrarCambio(
    tipo: 'CREATE' | 'UPDATE' | 'DELETE',
    entidad: string,
    entidadId: string,
    datos: any
  ): Promise<CambioOffline> {
    const id = `${entidad}-${entidadId}-${Date.now()}`;
    const cambio: CambioOffline = {
      id,
      tipo,
      entidad,
      entidadId,
      datos,
      timestamp: new Date(),
      sincronizado: false
    };

    this.cambios.set(id, cambio);
    return cambio;
  }

  async sincronizar(): Promise<{ exitosos: number; errores: number }> {
    let exitosos = 0;
    let errores = 0;

    for (const [_id, cambio] of this.cambios) {
      if (!cambio.sincronizado) {
        try {
          await this.aplicarCambio(cambio);
          cambio.sincronizado = true;
          exitosos++;
        } catch (error) {
          console.error(`Error sincronizando ${cambio.id}:`, error);
          errores++;
        }
      }
    }

    return { exitosos, errores };
  }

  private async aplicarCambio(cambio: CambioOffline): Promise<void> {
    switch (cambio.tipo) {
      case 'CREATE':
        await this.crearRegistro(cambio);
        break;
      case 'UPDATE':
        await this.actualizarRegistro(cambio);
        break;
      case 'DELETE':
        await this.eliminarRegistro(cambio);
        break;
    }
  }

  private async crearRegistro(cambio: CambioOffline): Promise<void> {
    // Implementación simplificada
    console.log(`Creando ${cambio.entidad} con ID ${cambio.entidadId}`);
  }

  private async actualizarRegistro(cambio: CambioOffline): Promise<void> {
    // Implementación simplificada
    console.log(`Actualizando ${cambio.entidad} con ID ${cambio.entidadId}`);
  }

  private async eliminarRegistro(cambio: CambioOffline): Promise<void> {
    // Implementación simplificada
    console.log(`Eliminando ${cambio.entidad} con ID ${cambio.entidadId}`);
  }

  async obtenerCambiosPendientes(): Promise<CambioOffline[]> {
    return Array.from(this.cambios.values()).filter(c => !c.sincronizado);
  }

  async limpiarSincronizados(): Promise<void> {
    for (const [id, cambio] of this.cambios) {
      if (cambio.sincronizado) {
        this.cambios.delete(id);
      }
    }
  }

  async resolverConflicto(
    cambioLocal: CambioOffline,
    cambioRemoto: any
  ): Promise<CambioOffline> {
    // Estrategia: la versión más reciente gana
    if (cambioLocal.timestamp > cambioRemoto.timestamp) {
      return cambioLocal;
    } else {
      return {
        ...cambioLocal,
        datos: cambioRemoto,
        timestamp: cambioRemoto.timestamp
      };
    }
  }
}
