import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Package,
  Search,
  Filter,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { Donacion, EstadoDonacion } from '../../types/financiero.types';
import { Municipio } from '../../types/territorial.types';

interface DonacionesListProps {
  donaciones: Donacion[];
  municipios: Municipio[];
  onNewDonacion: () => void;
  onUpdateEstado: (donacion: Donacion, nuevoEstado: EstadoDonacion) => Promise<void>;
}

export const DonacionesList: React.FC<DonacionesListProps> = ({
  donaciones,
  municipios,
  onNewDonacion,
  onUpdateEstado,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('todos');
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const filteredDonaciones = useMemo(() => {
    return donaciones.filter((d) => {
      const matchSearch =
        d.donante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.descripcion && d.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.dinero?.referencia && d.dinero.referencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.especie?.tipoAyuda && d.especie.tipoAyuda.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTipo = selectedTipo === 'todos' || d.tipo === selectedTipo;
      const matchEstado = selectedEstado === 'todos' || d.estado === selectedEstado;
      const matchMunicipio =
        selectedMunicipio === 'todos' || (d.municipioId && d.municipioId.toString() === selectedMunicipio);

      return matchSearch && matchTipo && matchEstado && matchMunicipio;
    });
  }, [donaciones, searchTerm, selectedTipo, selectedEstado, selectedMunicipio]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleStatusChange = async (donacion: Donacion, nuevoEstado: EstadoDonacion) => {
    if (donacion.estado === nuevoEstado) return;
    setUpdatingId(donacion.id);
    try {
      await onUpdateEstado(donacion, nuevoEstado);
    } finally {
      setUpdatingId(null);
    }
  };

  const getEstadoBadge = (estado: EstadoDonacion) => {
    switch (estado) {
      case 'RECIBIDO':
        return {
          label: 'Recibido / Verificado',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'PENDIENTE':
        return {
          label: 'Pendiente de Conciliación',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: Clock,
        };
      case 'RECHAZADO':
        return {
          label: 'Rechazado',
          color: 'text-rose-700 bg-rose-50 border-rose-200',
          icon: XCircle,
        };
      default:
        return {
          label: estado,
          color: 'text-slate-700 bg-slate-50 border-slate-200',
          icon: Clock,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por donante, referencia, tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="DINERO">💵 Donaciones en Dinero</option>
              <option value="ESPECIE">📦 Donaciones en Especie</option>
            </select>

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
              <option value="RECIBIDO">🟢 Recibidos / Verificados</option>
              <option value="PENDIENTE">🟡 Pendientes</option>
              <option value="RECHAZADO">🔴 Rechazados</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onNewDonacion}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Registrar Donación
          </button>
        </div>
      </div>

      {/* Listado de Donaciones */}
      {filteredDonaciones.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No se encontraron donaciones</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No hay registros de donaciones con los filtros seleccionados.
          </p>
          <button
            onClick={onNewDonacion}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Registrar Primera Donación
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Donante / Aporte</th>
                  <th className="px-4 py-3.5">Tipo</th>
                  <th className="px-4 py-3.5">Detalle / Cuantía</th>
                  <th className="px-4 py-3.5">Destino / Ref</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-4 py-3.5 text-right">Verificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonaciones.map((donacion) => {
                  const badge = getEstadoBadge(donacion.estado);
                  const isDinero = donacion.tipo === 'DINERO';
                  const BadgeIcon = badge.icon;
                  const monto = Number(donacion.monto) || Number(donacion.dinero?.monto) || 0;

                  return (
                    <tr key={donacion.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{donacion.donante}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {donacion.fecha
                            ? new Date(donacion.fecha).toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Reciente'}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {isDinero ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <DollarSign className="w-3 h-3" /> Dinero
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Package className="w-3 h-3" /> Especie
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {isDinero ? (
                          <div>
                            <div className="text-sm font-black text-emerald-800">
                              {formatCOP(monto)}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Ref: {donacion.dinero?.referencia || 'N/A'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-purple-900">
                              {donacion.especie?.cantidad} {donacion.especie?.unidadMedida}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {donacion.especie?.tipoAyuda} {donacion.especie?.peso ? `(${donacion.especie.peso} kg)` : ''}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800">
                          {donacion.municipio?.nombre || 'Fondo Departamental'}
                        </div>
                        {isDinero && donacion.dinero?.cuentaDestino && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {donacion.dinero.cuentaDestino}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.color}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            disabled={updatingId === donacion.id || donacion.estado === 'RECIBIDO'}
                            onClick={() => handleStatusChange(donacion, 'RECIBIDO')}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                            title="Marcar como Recibido y Conciliado"
                          >
                            Verificar
                          </button>
                          <button
                            disabled={updatingId === donacion.id || donacion.estado === 'RECHAZADO'}
                            onClick={() => handleStatusChange(donacion, 'RECHAZADO')}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 disabled:opacity-40"
                            title="Rechazar donación"
                          >
                            Rechazar
                          </button>
                        </div>
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
