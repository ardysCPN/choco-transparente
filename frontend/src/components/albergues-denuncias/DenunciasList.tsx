import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Eye,
  Camera,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Denuncia, EstadoDenuncia } from '../../types/albergue-denuncia.types';
import { Municipio } from '../../types/territorial.types';

interface DenunciasListProps {
  denuncias: Denuncia[];
  municipios: Municipio[];
  onNewDenuncia: () => void;
  onViewDenuncia: (denuncia: Denuncia) => void;
}

export const DenunciasList: React.FC<DenunciasListProps> = ({
  denuncias,
  municipios,
  onNewDenuncia,
  onViewDenuncia,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('todos');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');

  const filteredDenuncias = useMemo(() => {
    return denuncias.filter((d) => {
      const matchSearch =
        d.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.barrio && d.barrio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.municipio?.nombre && d.municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchMunicipio =
        selectedMunicipio === 'todos' || d.municipioId.toString() === selectedMunicipio;

      const matchTipo = selectedTipo === 'todos' || d.tipo === selectedTipo;

      const matchEstado = selectedEstado === 'todos' || d.estado === selectedEstado;

      return matchSearch && matchMunicipio && matchTipo && matchEstado;
    });
  }, [denuncias, searchTerm, selectedMunicipio, selectedTipo, selectedEstado]);

  const getEstadoBadge = (estado: EstadoDenuncia) => {
    switch (estado) {
      case 'RECIBIDA':
        return {
          label: 'Recibida',
          color: 'text-blue-700 bg-blue-50 border-blue-200',
          icon: Clock,
        };
      case 'EN_REVISION':
        return {
          label: 'En Revisión',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: AlertTriangle,
        };
      case 'INVESTIGACION':
        return {
          label: 'Investigación',
          color: 'text-purple-700 bg-purple-50 border-purple-200',
          icon: ShieldAlert,
        };
      case 'RESUELTA':
        return {
          label: 'Resuelta',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'DESCARTADA':
        return {
          label: 'Descartada',
          color: 'text-slate-600 bg-slate-100 border-slate-200',
          icon: AlertTriangle,
        };
      default:
        return {
          label: estado,
          color: 'text-slate-700 bg-slate-50 border-slate-200',
          icon: Clock,
        };
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'DESVIO_AYUDAS':
        return { label: 'Desvío de Ayudas', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'COBRO_INDEBIDO':
        return { label: 'Cobro Indebido', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'EXCLUSION_DISCRIMINATORIA':
        return { label: 'Exclusión / Discriminación', color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'ENTREGA_INCOMPLETA':
        return { label: 'Entrega Incompleta', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 'PROSELITISMO_POLITICO':
        return { label: 'Proselitismo Político', color: 'text-red-700 bg-red-50 border-red-200' };
      case 'MAL_ESTADO_ALBERGUE':
        return { label: 'Mal Estado de Albergue', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
      default:
        return { label: tipo.replace(/_/g, ' '), color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Acciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar denuncias, barrio, motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedMunicipio}
              onChange={(e) => setSelectedMunicipio(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="todos">Todos los Municipios</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>

            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="DESVIO_AYUDAS">Desvío de Ayudas</option>
              <option value="COBRO_INDEBIDO">Cobro Indebido</option>
              <option value="EXCLUSION_DISCRIMINATORIA">Exclusión / Discriminación</option>
              <option value="ENTREGA_INCOMPLETA">Entrega Incompleta</option>
              <option value="PROSELITISMO_POLITICO">Proselitismo Político</option>
              <option value="MAL_ESTADO_ALBERGUE">Mal Estado Albergue</option>
              <option value="OTRO">Otro</option>
            </select>

            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="RECIBIDA">🔵 Recibidas</option>
              <option value="EN_REVISION">🟡 En Revisión</option>
              <option value="INVESTIGACION">🟣 En Investigación</option>
              <option value="RESUELTA">🟢 Resueltas</option>
              <option value="DESCARTADA">⚪ Descartadas</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onNewDenuncia}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Radicar Denuncia
          </button>
        </div>
      </div>

      {/* Lista de Denuncias */}
      {filteredDenuncias.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No se encontraron denuncias</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No hay denuncias que coincidan con los filtros aplicados o no se han radicado alertas en este criterio.
          </p>
          <button
            onClick={onNewDenuncia}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Radicar Nueva Denuncia Ciudadana
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDenuncias.map((denuncia) => {
            const badge = getEstadoBadge(denuncia.estado);
            const tipoInfo = getTipoLabel(denuncia.tipo);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={denuncia.id}
                onClick={() => onViewDenuncia(denuncia)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tipoInfo.color}`}
                      >
                        {tipoInfo.label}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {denuncia.municipio?.nombre || 'Chocó'}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.color}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed">
                    {denuncia.descripcion}
                  </p>

                  {denuncia.respuesta && (
                    <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="line-clamp-2">
                        <span className="font-bold">Respuesta Oficial: </span>
                        {denuncia.respuesta}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {denuncia.fecha
                        ? new Date(denuncia.fecha).toLocaleDateString('es-CO', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Reciente'}
                    </span>
                    {denuncia.barrio && (
                      <span className="flex items-center gap-1 truncate max-w-[120px]">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {denuncia.barrio}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {denuncia.evidencia && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                        <Camera className="w-3 h-3" /> Con Evidencia
                      </span>
                    )}
                    <span className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Ver Caso
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
