import React from 'react';
import {
  Home,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Percent,
  Activity,
  Flame,
  Building,
} from 'lucide-react';
import { Albergue, Denuncia } from '../../types/albergue-denuncia.types';

interface AlberguesDashboardProps {
  albergues: Albergue[];
  denuncias: Denuncia[];
}

export const AlberguesDashboard: React.FC<AlberguesDashboardProps> = ({
  albergues,
  denuncias,
}) => {
  const totalAlbergues = albergues.length;
  const capacidadTotal = albergues.reduce((acc, a) => acc + (a.capacidad || 0), 0);
  const ocupacionTotal = albergues.reduce((acc, a) => acc + (a.ocupacion || 0), 0);
  const cuposDisponibles = Math.max(0, capacidadTotal - ocupacionTotal);
  const porcentajeOcupacion =
    capacidadTotal > 0 ? Math.round((ocupacionTotal / capacidadTotal) * 100) : 0;

  const disponiblesCount = albergues.filter((a) => {
    if (a.estado === 'CERRADO' || a.estado === 'LLENO') return false;
    const pct = a.capacidad > 0 ? (a.ocupacion / a.capacidad) * 100 : 0;
    return pct < 70;
  }).length;

  const casiLlenosCount = albergues.filter((a) => {
    if (a.estado === 'CERRADO' || a.estado === 'LLENO') return false;
    const pct = a.capacidad > 0 ? (a.ocupacion / a.capacidad) * 100 : 0;
    return pct >= 70 && pct < 100;
  }).length;

  const llenosCount = albergues.filter(
    (a) => a.estado === 'LLENO' || (a.capacidad > 0 && a.ocupacion >= a.capacidad)
  ).length;

  const cerradosCount = albergues.filter((a) => a.estado === 'CERRADO').length;

  // Estadísticas de denuncias
  const totalDenuncias = denuncias.length;
  const denunciasRecibidas = denuncias.filter((d) => d.estado === 'RECIBIDA').length;
  const denunciasEnRevision = denuncias.filter((d) => d.estado === 'EN_REVISION').length;
  const denunciasInvestigacion = denuncias.filter((d) => d.estado === 'INVESTIGACION').length;
  const denunciasResueltas = denuncias.filter((d) => d.estado === 'RESUELTA').length;
  const denunciasDescartadas = denuncias.filter((d) => d.estado === 'DESCARTADA').length;

  return (
    <div className="space-y-6">
      {/* Alerta de Capacidad Crítica si aplica */}
      {porcentajeOcupacion >= 85 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-rose-500/5 border border-rose-200 text-rose-800">
          <Flame className="w-5 h-5 text-rose-600 flex-shrink-0 animate-bounce" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">¡Alerta de Saturación Departamental!</span> La capacidad de
            los albergues en el Chocó supera el <span className="font-extrabold">{porcentajeOcupacion}%</span>.
            Se recomienda habilitar centros de contingencia adicionales.
          </div>
        </div>
      )}

      {/* Grid de Métricas Principales de Albergues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Albergues Activos
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalAlbergues}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {totalAlbergues - cerradosCount} operativos
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {disponiblesCount} disponibles · {casiLlenosCount} alta demanda
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Personas Albergadas
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {ocupacionTotal.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              de {capacidadTotal.toLocaleString()} cupos
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {cuposDisponibles.toLocaleString()} plazas disponibles en el departamento
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tasa de Ocupación
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                porcentajeOcupacion >= 85
                  ? 'bg-rose-50 text-rose-600'
                  : porcentajeOcupacion >= 70
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-teal-50 text-teal-600'
              }`}
            >
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {porcentajeOcupacion}%
            </span>
            <span
              className={`text-xs font-semibold ${
                porcentajeOcupacion >= 85
                  ? 'text-rose-600'
                  : porcentajeOcupacion >= 70
                  ? 'text-amber-600'
                  : 'text-teal-600'
              }`}
            >
              {porcentajeOcupacion >= 85
                ? 'Saturado'
                : porcentajeOcupacion >= 70
                ? 'Elevado'
                : 'Estable'}
            </span>
          </div>
          {/* Barra de progreso */}
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                porcentajeOcupacion >= 85
                  ? 'bg-rose-500'
                  : porcentajeOcupacion >= 70
                  ? 'bg-amber-500'
                  : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, porcentajeOcupacion)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Denuncias Ciudadanas
            </span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalDenuncias}</span>
            <span className="text-xs font-semibold text-violet-600">
              {denunciasResueltas} atendidas
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {denunciasRecibidas + denunciasEnRevision + denunciasInvestigacion} en investigación
          </p>
        </div>
      </div>

      {/* Sección Doble: Estado de Albergues y Resumen de Veeduría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose de Albergues por Estado de Capacidad */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Distribución de Capacidad de Albergues
            </h3>
            <span className="text-xs font-semibold text-slate-500">Semáforo de Disponibilidad</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Albergues Disponibles (&lt; 70% ocupación)
                </span>
                <span className="font-bold text-slate-900">{disponiblesCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAlbergues > 0 ? (disponiblesCount / totalAlbergues) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Albergues Casi Llenos (70% - 99% ocupación)
                </span>
                <span className="font-bold text-slate-900">{casiLlenosCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAlbergues > 0 ? (casiLlenosCount / totalAlbergues) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Albergues Llenos / Saturados (100% o marcado Lleno)
                </span>
                <span className="font-bold text-slate-900">{llenosCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAlbergues > 0 ? (llenosCount / totalAlbergues) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Albergues Inactivos / Cerrados
                </span>
                <span className="font-bold text-slate-900">{cerradosCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAlbergues > 0 ? (cerradosCount / totalAlbergues) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desglose de Veeduría y Denuncias */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-600" />
              Estado del Canal de Veeduría y Denuncias
            </h3>
            <span className="text-xs font-semibold text-slate-500">Transparencia y Control</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-blue-100 text-blue-700 mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{denunciasRecibidas}</div>
              <div className="text-[11px] font-medium text-slate-600">Recibidas</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-amber-100 text-amber-700 mb-2">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{denunciasEnRevision}</div>
              <div className="text-[11px] font-medium text-slate-600">En Revisión</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-purple-100 text-purple-700 mb-2">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{denunciasInvestigacion}</div>
              <div className="text-[11px] font-medium text-slate-600">Investigación</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-emerald-100 text-emerald-700 mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{denunciasResueltas}</div>
              <div className="text-[11px] font-medium text-slate-600">Resueltas</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-slate-200 text-slate-700 mb-2">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{denunciasDescartadas}</div>
              <div className="text-[11px] font-medium text-slate-600">Descartadas</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 text-center flex flex-col justify-center">
              <div className="text-2xl font-black text-emerald-700">
                {totalDenuncias > 0
                  ? `${Math.round((denunciasResueltas / totalDenuncias) * 100)}%`
                  : '100%'}
              </div>
              <div className="text-[11px] font-semibold text-emerald-800">Tasa de Resolución</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
