import React, { useState } from 'react';
import {
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  PlusCircle,
} from 'lucide-react';
import { SolicitudAyuda } from '../../types/beneficiario.types';

interface SolicitudesListProps {
  solicitudes: SolicitudAyuda[];
  isLoading: boolean;
  onCrear: () => void;
  onActualizar: (s: SolicitudAyuda) => void;
}

export const SolicitudesList: React.FC<SolicitudesListProps> = ({
  solicitudes,
  isLoading,
  onCrear,
  onActualizar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('TODAS');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');

  const filtered = solicitudes.filter((s) => {
    const matchSearch =
      s.tipoNecesidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.beneficiario?.codigoFamilia &&
        s.beneficiario.codigoFamilia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.descripcion && s.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchPrioridad = filterPrioridad === 'TODAS' || s.prioridad === filterPrioridad;
    const matchEstado = filterEstado === 'TODOS' || s.estado === filterEstado;

    return matchSearch && matchPrioridad && matchEstado;
  });

  const prioridadBadge = (p: string) => {
    switch (p) {
      case 'URGENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> Urgente
          </span>
        );
      case 'ALTA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <ArrowUpRight className="w-3 h-3" /> Alta
          </span>
        );
      case 'MEDIA':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Media
          </span>
        );
      case 'BAJA':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Baja
          </span>
        );
      default:
        return null;
    }
  };

  const estadoBadge = (e: string) => {
    switch (e) {
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
      case 'APROBADA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Aprobada
          </span>
        );
      case 'RECHAZADA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rechazada
          </span>
        );
      case 'ATENDIDA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle className="w-3 h-3" /> Atendida
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tipo de necesidad, familia, descripción..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterPrioridad}
            onChange={(e) => setFilterPrioridad(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="TODAS">Todas las prioridades</option>
            <option value="URGENTE">🔴 Urgente</option>
            <option value="ALTA">🟠 Alta</option>
            <option value="MEDIA">🟡 Media</option>
            <option value="BAJA">🔵 Baja</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADA">Aprobada</option>
            <option value="ATENDIDA">Atendida</option>
            <option value="RECHAZADA">Rechazada</option>
          </select>

          <button
            onClick={onCrear}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Solicitudes de Ayuda Humanitaria
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filtered.length} solicitudes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Familia</th>
                <th className="px-5 py-3.5">Tipo de Necesidad</th>
                <th className="px-5 py-3.5 text-center">Cantidad</th>
                <th className="px-5 py-3.5">Prioridad</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Cargando solicitudes de ayuda...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => onActualizar(s)}
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {s.beneficiario?.codigoFamilia || `#${s.beneficiarioId}`}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {s.tipoNecesidad}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-900">
                      {Number(s.cantidadSolicitada).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">{prioridadBadge(s.prioridad)}</td>
                    <td className="px-5 py-3.5">{estadoBadge(s.estado)}</td>
                    <td className="px-5 py-3.5 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(s.fechaSolicitud).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
