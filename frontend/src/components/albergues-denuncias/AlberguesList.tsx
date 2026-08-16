import React, { useState, useMemo } from 'react';
import {
  Home,
  MapPin,
  Phone,
  User,
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  LayoutGrid,
  List,
  ExternalLink,
} from 'lucide-react';
import { Albergue } from '../../types/albergue-denuncia.types';
import { Municipio } from '../../types/territorial.types';

interface AlberguesListProps {
  albergues: Albergue[];
  municipios: Municipio[];
  onNewAlbergue: () => void;
  onEditAlbergue: (albergue: Albergue) => void;
  onUpdateOccupancy: (albergue: Albergue, newOccupancy: number) => Promise<void>;
}

export const AlberguesList: React.FC<AlberguesListProps> = ({
  albergues,
  municipios,
  onNewAlbergue,
  onEditAlbergue,
  onUpdateOccupancy,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const filteredAlbergues = useMemo(() => {
    return albergues.filter((albergue) => {
      const matchSearch =
        albergue.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        albergue.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        albergue.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        albergue.municipio?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMunicipio =
        selectedMunicipio === 'todos' ||
        albergue.municipioId.toString() === selectedMunicipio;

      const matchEstado =
        selectedEstado === 'todos' || albergue.estado === selectedEstado;

      return matchSearch && matchMunicipio && matchEstado;
    });
  }, [albergues, searchTerm, selectedMunicipio, selectedEstado]);

  const handleQuickOccupancy = async (
    albergue: Albergue,
    delta: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const newOccupancy = Math.max(0, Math.min(albergue.capacidad, (albergue.ocupacion || 0) + delta));
    if (newOccupancy === albergue.ocupacion) return;

    setUpdatingId(albergue.id);
    try {
      await onUpdateOccupancy(albergue, newOccupancy);
    } finally {
      setUpdatingId(null);
    }
  };

  const getCapacityStatus = (albergue: Albergue) => {
    if (albergue.estado === 'CERRADO') {
      return {
        label: 'Cerrado',
        color: 'text-slate-600 bg-slate-100 border-slate-200',
        barColor: 'bg-slate-400',
        badge: '⚪ Inactivo',
      };
    }
    if (albergue.estado === 'LLENO' || (albergue.capacidad > 0 && albergue.ocupacion >= albergue.capacidad)) {
      return {
        label: 'Saturado / Lleno',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        barColor: 'bg-rose-500',
        badge: '🔴 Lleno',
      };
    }
    const pct = albergue.capacidad > 0 ? (albergue.ocupacion / albergue.capacidad) * 100 : 0;
    if (pct >= 70) {
      return {
        label: 'Alta Demanda',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        badge: '🟡 Casi Lleno',
      };
    }
    return {
      label: 'Disponible',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-500',
      badge: '🟢 Disponible',
    };
  };

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda, Filtros y Acciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedMunicipio}
              onChange={(e) => setSelectedMunicipio(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos">Todos los Municipios</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>

            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="DISPONIBLE">🟢 Disponibles</option>
              <option value="LLENO">🔴 Llenos</option>
              <option value="CERRADO">⚪ Cerrados</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          {/* Selector de vista */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vista en Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vista en Tabla"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNewAlbergue}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Nuevo Albergue
          </button>
        </div>
      </div>

      {/* Mensaje de Sin Resultados */}
      {filteredAlbergues.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Home className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No se encontraron albergues</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No hay albergues que coincidan con los criterios de búsqueda o filtros seleccionados.
          </p>
          <button
            onClick={onNewAlbergue}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Registrar Primer Albergue
          </button>
        </div>
      )}

      {/* Modo GRID de Tarjetas */}
      {viewMode === 'grid' && filteredAlbergues.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlbergues.map((albergue) => {
            const status = getCapacityStatus(albergue);
            const porcentaje =
              albergue.capacidad > 0
                ? Math.round(((albergue.ocupacion || 0) / albergue.capacidad) * 100)
                : 0;
            const cuposLibres = Math.max(0, albergue.capacidad - (albergue.ocupacion || 0));

            return (
              <div
                key={albergue.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Encabezado de la Tarjeta */}
                  <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {albergue.municipio?.nombre || 'Municipio Chocó'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {albergue.nombre}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.color}`}
                      >
                        {status.badge}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{albergue.direccion}</span>
                    </div>
                  </div>

                  {/* Métricas de Ocupación con Semáforo */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between mb-1.5 text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-emerald-600" />
                          Ocupación: {albergue.ocupacion || 0} / {albergue.capacidad} personas
                        </span>
                        <span className="font-extrabold text-slate-900">{porcentaje}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
                          style={{ width: `${Math.min(100, porcentaje)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>{cuposLibres} cupos disponibles</span>
                        <span>Capacidad: {albergue.capacidad}</span>
                      </div>
                    </div>

                    {/* Ajuste rápido de personas albergadas */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[11px] font-semibold text-slate-600">
                        Ajuste Rápido (+/-):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={updatingId === albergue.id || (albergue.ocupacion || 0) <= 0}
                          onClick={(e) => handleQuickOccupancy(albergue, -5, e)}
                          className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold shadow-xs disabled:opacity-40"
                          title="Restar 5 personas"
                        >
                          -5
                        </button>
                        <button
                          disabled={updatingId === albergue.id || (albergue.ocupacion || 0) <= 0}
                          onClick={(e) => handleQuickOccupancy(albergue, -1, e)}
                          className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold shadow-xs disabled:opacity-40"
                          title="Restar 1 persona"
                        >
                          -1
                        </button>
                        <span className="text-xs font-extrabold text-slate-800 px-1">
                          {albergue.ocupacion || 0}
                        </span>
                        <button
                          disabled={
                            updatingId === albergue.id ||
                            (albergue.ocupacion || 0) >= albergue.capacidad
                          }
                          onClick={(e) => handleQuickOccupancy(albergue, 1, e)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold shadow-xs disabled:opacity-40"
                          title="Sumar 1 persona"
                        >
                          +1
                        </button>
                        <button
                          disabled={
                            updatingId === albergue.id ||
                            (albergue.ocupacion || 0) >= albergue.capacidad
                          }
                          onClick={(e) => handleQuickOccupancy(albergue, 5, e)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold shadow-xs disabled:opacity-40"
                          title="Sumar 5 personas"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    {/* Información del Responsable y Contacto */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium truncate">{albergue.responsable}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a
                          href={`tel:${albergue.telefono}`}
                          className="text-emerald-700 hover:underline font-semibold"
                        >
                          {albergue.telefono}
                        </a>
                      </div>
                    </div>

                    {/* Servicios Disponibles */}
                    {albergue.servicios && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Servicios Habilitados:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {albergue.servicios.split(',').map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                            >
                              {srv.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer de Acciones de la Tarjeta */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  {albergue.latitud && albergue.longitud ? (
                    <a
                      href={`https://www.google.com/maps?q=${albergue.latitud},${albergue.longitud}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ver en Mapa
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Sin GPS</span>
                  )}

                  <button
                    onClick={() => onEditAlbergue(albergue)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modo TABLA */}
      {viewMode === 'table' && filteredAlbergues.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Albergue / Ubicación</th>
                  <th className="px-4 py-3.5">Municipio</th>
                  <th className="px-4 py-3.5">Capacidad / Ocupación</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-4 py-3.5">Responsable</th>
                  <th className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlbergues.map((albergue) => {
                  const status = getCapacityStatus(albergue);
                  const pct =
                    albergue.capacidad > 0
                      ? Math.round(((albergue.ocupacion || 0) / albergue.capacidad) * 100)
                      : 0;

                  return (
                    <tr key={albergue.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{albergue.nombre}</div>
                        <div className="text-[11px] text-slate-400">{albergue.direccion}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                          {albergue.municipio?.nombre || 'Chocó'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${status.barColor}`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900">
                            {albergue.ocupacion || 0} / {albergue.capacidad} ({pct}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}
                        >
                          {status.badge}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800">{albergue.responsable}</div>
                        <div className="text-[11px] text-emerald-700 font-semibold">
                          {albergue.telefono}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => onEditAlbergue(albergue)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
