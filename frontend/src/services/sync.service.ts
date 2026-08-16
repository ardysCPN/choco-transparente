import { ColaSyncItem } from '../types/reporte-dashboard.types';

const STORAGE_KEY = 'choco_offline_sync_queue';

type SyncListener = (isOnline: boolean, queueCount: number) => void;

class SyncService {
  private listeners: Set<SyncListener> = new Set();
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnlineStatus = true;
        this.notifyListeners();
        this.procesarCola();
      });

      window.addEventListener('offline', () => {
        this.isOnlineStatus = false;
        this.notifyListeners();
      });
    }
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public getCola(): ColaSyncItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public registrarCambioOffline(
    tipo: 'CREATE' | 'UPDATE' | 'DELETE',
    entidad: string,
    entidadId: string,
    datos: any
  ): ColaSyncItem {
    const cola = this.getCola();
    const item: ColaSyncItem = {
      id: `${entidad}-${entidadId}-${Date.now()}`,
      tipo,
      entidad,
      entidadId,
      datos,
      timestamp: new Date().toISOString(),
      sincronizado: false,
    };

    cola.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cola));
    this.notifyListeners();
    return item;
  }

  public async procesarCola(): Promise<{ exitosos: number; fallidos: number }> {
    const cola = this.getCola();
    if (cola.length === 0) return { exitosos: 0, fallidos: 0 };

    let exitosos = 0;
    let fallidos = 0;
    const colaRestante: ColaSyncItem[] = [];

    for (const item of cola) {
      try {
        // Marcamos como sincronizado
        item.sincronizado = true;
        exitosos++;
      } catch (error) {
        fallidos++;
        colaRestante.push(item);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(colaRestante));
    this.notifyListeners();
    return { exitosos, fallidos };
  }

  public limpiarCola(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
  }

  public suscribir(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.isOnlineStatus, this.getCola().length);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const count = this.getCola().length;
    this.listeners.forEach((l) => l(this.isOnlineStatus, count));
  }
}

export const syncService = new SyncService();
