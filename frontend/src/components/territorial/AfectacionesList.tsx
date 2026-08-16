import React, { useState } from 'react';
import { Afectacion, Municipio } from '../../types/territorial.types';
import { Search, Plus, MapPin, Calendar, Edit2, ShieldAlert } from 'lucide-react';
import { AfectacionModal } from './AfectacionModal';

interface AfectacionesListProps {
  afectaciones: Afectacion[];
  municipios: Municipio[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const AfectacionesList: React.FC<AfectacionesListProps> = ({
  afectaciones,
  municipios,
  isLoading,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeveridad, setFilterSeveridad] = useState<string>('TODAS');
  const [filterMunicipio, setFilterMunicipio] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAfectacion, setEditingAfectacion] = useState<Afectacion | null>(null);

  const filtered = afectaciones.filter((a) => {
    const matchesSearch =
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.municipio && a.municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeveridad = filterSeveridad === 'TODAS' || a.severidad === filterSeveridad;
    const matchesMunicipio =
      filterMunicipio === 'TODOS' || String(a.municipioId) === filterMunicipio;

    return matchesSearch && matchesSeveridad && matchesMunicipio;
  });

  const handleEdit = (a: Afectacion) => {
    setEditingAfectacion(a);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAfectacion(null);
    setIsModalOpen(true);
  };

  const getSeveridadBadge = (severidad: string) => {
    switch (severidad) {
      case 'CRITICA':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'ALTA':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIA':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por afectación, causa o municipio..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterMunicipio}
            onChange={(e) => setFilterMunicipio(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos los Municipios</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          <select
            value={filterSeveridad}
            onChange={(e) => setFilterSeveridad(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODAS">Todas las Severidades</option>
            <option value="CRITICA">Crítica</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Emergencia</span>
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas de Afectaciones */}
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
          Cargando afectaciones territoriales...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
          <p>No se encontraron afectaciones con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((afectacion) => (
            <div
              key={afectacion.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {afectacion.tipo}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSeveridadBadge(
                      afectacion.severidad
                    )}`}
                  >
                    {afectacion.severidad}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {afectacion.nombre}
                  </h4>
                  {afectacion.municipio && (
                    <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {afectacion.municipio.nombre}
                    </p>
                  )}
                </div>

                {afectacion.descripcion && (
                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-xl">
                    {afectacion.descripcion}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(afectacion.fechaInicio).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                    {afectacion.estado}
                  </span>
                  <button
                    onClick={() => handleEdit(afectacion)}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Editar afectación"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AfectacionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
        municipios={municipios}
        afectacionToEdit={editingAfectacion}
      />
    </div>
  );
};
