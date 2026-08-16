import React, { useState } from 'react';
import { Municipio } from '../../types/territorial.types';
import { Search, Plus, Edit2, MapPin, CheckCircle, XCircle, Building } from 'lucide-react';
import { MunicipioModal } from './MunicipioModal';

interface MunicipiosListProps {
  municipios: Municipio[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const MunicipiosList: React.FC<MunicipiosListProps> = ({
  municipios,
  isLoading,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMunicipio, setEditingMunicipio] = useState<Municipio | null>(null);

  const filteredMunicipios = municipios.filter((m) => {
    const matchesSearch =
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.codigoDane.includes(searchTerm);

    if (filterActive === 'ACTIVOS') return matchesSearch && m.estado;
    if (filterActive === 'INACTIVOS') return matchesSearch && !m.estado;
    return matchesSearch;
  });

  const handleEdit = (m: Municipio) => {
    setEditingMunicipio(m);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingMunicipio(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Barra superior de herramientas y filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre de municipio o código DANE..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ACTIVOS">Solo Activos</option>
            <option value="INACTIVOS">Solo Inactivos</option>
          </select>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Municipio</span>
          </button>
        </div>
      </div>

      {/* Tabla de Municipios */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Municipios del Departamento del Chocó
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredMunicipios.length} de {municipios.length} municipios
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Código DANE</th>
                <th className="px-6 py-3.5">Nombre del Municipio</th>
                <th className="px-6 py-3.5">Coordenadas</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    Cargando municipios del departamento...
                  </td>
                </tr>
              ) : filteredMunicipios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No se encontraron municipios coincidentes.
                  </td>
                </tr>
              ) : (
                filteredMunicipios.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {m.codigoDane}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {m.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {m.latitud && m.longitud ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {Number(m.latitud).toFixed(4)}, {Number(m.longitud).toFixed(4)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          Sin georreferencia
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {m.estado ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(m)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Editar Municipio"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MunicipioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
        municipioToEdit={editingMunicipio}
      />
    </div>
  );
};
