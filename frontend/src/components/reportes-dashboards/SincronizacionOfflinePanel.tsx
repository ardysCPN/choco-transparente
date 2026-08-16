import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CheckCircle2,
  Trash2,
  PlusCircle,
  Clock,
  Shield,
} from 'lucide-react';
import { syncService } from '../../services/sync.service';
import { ColaSyncItem } from '../../types/reporte-dashboard.types';
import toast from 'react-hot-toast';

export const SincronizacionOfflinePanel: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(syncService.isOnline());
  const [cola, setCola] = useState<ColaSyncItem[]>(syncService.getCola());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = syncService.suscribir((online) => {
      setIsOnline(online);
      setCola(syncService.getCola());
    });
    return unsub;
  }, []);

  const handleSincronizar = async () => {
    setIsSyncing(true);
    try {
      const { exitosos, fallidos } = await syncService.procesarCola();
      setCola(syncService.getCola());
      if (exitosos > 0) {
        toast.success(`Sincronización completada: ${exitosos} cambios subidos`);
      } else if (cola.length === 0) {
        toast.success('Todos los datos ya se encuentran sincronizados');
      }
      if (fallidos > 0) {
        toast.error(`${fallidos} registros no pudieron sincronizarse`);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSimularRegistroOffline = () => {
    syncService.registrarCambioOffline(
      'CREATE',
      'Beneficiario',
      `FAM-${Math.floor(1000 + Math.random() * 9000)}`,
      {
        codigoFamilia: `FAM-CH-${Math.floor(1000 + Math.random() * 9000)}`,
        cantidadPersonas: 4,
        municipioId: 1,
        observacion: 'Censo capturado sin internet en selva del Atrato',
      }
    );
    setCola(syncService.getCola());
    toast.success('Registro guardado en cola local (IndexedDB/Offline)');
  };

  const handleLimpiarCola = () => {
    syncService.limpiarCola();
    setCola([]);
    toast.success('Cola de sincronización local limpiada');
  };

  return (
    <div className="space-y-6">
      {/* Estado de Conectividad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estado de Red
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-xl font-extrabold text-slate-900">
                {isOnline ? 'En Línea (Online)' : 'Desconectado (Offline)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isOnline
                ? 'Conexión activa con el servidor central de la Gobernación'
                : 'Operando con almacenamiento local cifrado'}
            </p>
          </div>
          <div
            className={`p-3 rounded-2xl ${
              isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cola de Sincronización
            </span>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">
              {cola.length} pendientes
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Mutaciones locales en espera de confirmación
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sincronización Automática
            </span>
            <div className="mt-1 text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Idempotente y Resiliente
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Sincroniza cuando se recupera conectividad
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleSincronizar}
              disabled={isSyncing}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/20 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
            </button>
          </div>
        </div>
      </div>

      {/* Controles de Pruebas de Campo Offline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Cola de Operaciones Locales Pendientes
            </h3>
            <p className="text-xs text-slate-500">
              Registros guardados en campo por brigadistas sin señal para envío posterior
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimularRegistroOffline}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Simular Captura en Campo
            </button>

            {cola.length > 0 && (
              <button
                onClick={handleLimpiarCola}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar Cola
              </button>
            )}
          </div>
        </div>

        {/* Lista de Items en Cola */}
        {cola.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Todos los datos están sincronizados
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No hay operaciones pendientes en el dispositivo local. Todo coincide con el servidor central.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">ID Local / Operación</th>
                  <th className="px-4 py-3">Entidad</th>
                  <th className="px-4 py-3">Detalle de Datos</th>
                  <th className="px-4 py-3">Fecha Captura</th>
                  <th className="px-4 py-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cola.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-slate-900">{item.id}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 mt-0.5">
                        {item.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.entidad}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                      {JSON.stringify(item.datos)}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString('es-CO')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
