import React from 'react';
import {
  Users,
  HeartHandshake,
  Truck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Beneficiario, SolicitudAyuda, EntregaAyuda } from '../../types/beneficiario.types';

interface BeneficiariosDashboardProps {
  beneficiarios: Beneficiario[];
  solicitudes: SolicitudAyuda[];
  entregas: EntregaAyuda[];
}

export const BeneficiariosDashboard: React.FC<BeneficiariosDashboardProps> = ({
  beneficiarios,
  solicitudes,
  entregas,
}) => {
  const totalFamilias = beneficiarios.length;
  const totalPersonas = beneficiarios.reduce((s, b) => s + (b.cantidadPersonas || 0), 0);
  const familiasActivas = beneficiarios.filter((b) => b.estado === 'ACTIVO').length;

  const solicitudesPendientes = solicitudes.filter((s) => s.estado === 'PENDIENTE').length;
  const solicitudesUrgentes = solicitudes.filter((s) => s.prioridad === 'URGENTE').length;
  const solicitudesAtendidas = solicitudes.filter((s) => s.estado === 'ATENDIDA').length;

  const totalEntregas = entregas.length;
  const totalKitsEntregados = entregas.reduce((s, e) => s + Number(e.cantidad), 0);

  // Agrupación por municipio
  const porMunicipio = beneficiarios.reduce((acc, b) => {
    const mun = b.municipio?.nombre || 'Sin municipio';
    if (!acc[mun]) acc[mun] = { familias: 0, personas: 0 };
    acc[mun].familias += 1;
    acc[mun].personas += b.cantidadPersonas || 0;
    return acc;
  }, {} as Record<string, { familias: number; personas: number }>);

  const municipiosSorted = Object.entries(porMunicipio).sort(
    (a, b) => b[1].personas - a[1].personas
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Familias Registradas
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {totalFamilias.toLocaleString()}
            </div>
            <p className="text-[11px] text-violet-600 font-medium mt-0.5">
              {familiasActivas} activas · {totalPersonas.toLocaleString()} personas
            </p>
          </div>
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Solicitudes Activas
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {solicitudes.length}
            </div>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              {solicitudesPendientes} pendientes · {solicitudesUrgentes} urgentes
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Entregas Realizadas
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {totalEntregas.toLocaleString()}
            </div>
            <p className="text-[11px] text-teal-600 font-medium mt-0.5">
              {totalKitsEntregados.toLocaleString()} kits distribuidos
            </p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Tasa de Atención
            </span>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              {solicitudes.length > 0
                ? ((solicitudesAtendidas / solicitudes.length) * 100).toFixed(0)
                : 0}
              %
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {solicitudesAtendidas} solicitudes atendidas
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Dos columnas: Cobertura por Municipio + Solicitudes Urgentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cobertura Territorial */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-600" />
              Cobertura por Municipio
            </h3>
            <span className="text-xs text-slate-400">
              {municipiosSorted.length} municipios con beneficiarios
            </span>
          </div>

          {municipiosSorted.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Sin datos de cobertura territorial.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {municipiosSorted.map(([mun, data]) => {
                const porcentaje =
                  totalPersonas > 0 ? (data.personas / totalPersonas) * 100 : 0;

                return (
                  <div key={mun} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{mun}</span>
                      <span className="text-slate-500">
                        {data.familias} familias · {data.personas} personas
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Solicitudes Recientes / Urgentes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Solicitudes que Requieren Atención
            </h3>
            <span className="text-xs text-slate-400">
              Urgentes y pendientes
            </span>
          </div>

          {solicitudes.filter((s) => s.estado === 'PENDIENTE').length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <CheckCircle className="w-8 h-8 mb-2 text-emerald-400" />
              <p className="text-xs font-medium">
                ¡Todas las solicitudes han sido atendidas!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {solicitudes
                .filter((s) => s.estado === 'PENDIENTE')
                .sort((a, b) => {
                  const prioridadOrden = { URGENTE: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
                  return (
                    (prioridadOrden[a.prioridad] ?? 4) - (prioridadOrden[b.prioridad] ?? 4)
                  );
                })
                .slice(0, 10)
                .map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border transition-colors ${
                      s.prioridad === 'URGENTE'
                        ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                        : s.prioridad === 'ALTA'
                        ? 'bg-orange-50/50 border-orange-200 hover:bg-orange-50'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {s.beneficiario?.codigoFamilia || `#${s.beneficiarioId}`}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.prioridad === 'URGENTE'
                            ? 'bg-rose-100 text-rose-700'
                            : s.prioridad === 'ALTA'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {s.prioridad}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      {s.tipoNecesidad} — {Number(s.cantidadSolicitada)} unidades
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(s.fechaSolicitud).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
