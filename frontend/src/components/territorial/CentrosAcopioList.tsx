import React, { useState } from 'react';
import { CentroAcopio, Municipio } from '../../types/territorial.types';
import { Search, Plus, MapPin, Phone, User, Building2, CheckCircle2, ShieldCheck, Edit2 } from 'lucide-react';
import { CentroAcopioModal } from './CentroAcopioModal';
import { AuditarCentroModal } from './AuditarCentroModal';
import { useAuthStore } from '../../store/authStore';

interface CentrosAcopioListProps {
  centros: CentroAcopio[];
  municipios: Municipio[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const CentrosAcopioList: React.FC<CentrosAcopioListProps> = ({
  centros,
  municipios,
  isLoading,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [filterMunicipio, setFilterMunicipio] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [editingCentro, setEditingCentro] = useState<CentroAcopio | null>(null);
  const [auditingCentro, setAuditingCentro] = useState<CentroAcopio | null>(null);

  const usuario = useAuthStore((state) => state.usuario);
  const hasRole = useAuthStore((state) => state.hasRole);
  const canAudit = usuario && hasRole(['SUPERADMIN', 'AUDITOR']);

  const filtered = centros.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.municipio && c.municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEstado = filterEstado === 'TODOS' || c.estado === filterEstado;
    const matchesMunicipio =
      filterMunicipio === 'TODOS' || String(c.municipioId) === filterMunicipio;

    return matchesSearch && matchesEstado && matchesMunicipio;
  });

  const handleEdit = (c: CentroAcopio) => {
    setEditingCentro(c);
    setIsModalOpen(true);
  };

  const handleAudit = (c: CentroAcopio) => {
    setAuditingCentro(c);
    setIsAuditModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCentro(null);
    setIsModalOpen(true);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDIENTE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'EN_REVISION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'RECHAZADO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
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
            placeholder="Buscar centro de acopio por nombre, dirección o encargado..."
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
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="APROBADO">Aprobados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="RECHAZADO">Rechazados</option>
          </select>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Solicitar Centro</span>
          </button>
        </div>
      </div>

      {/* Grid de Centros de Acopio */}
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
          Cargando centros de acopio...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
          <p>No se encontraron centros de acopio con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((centro) => (
            <div
              key={centro.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {centro.municipio?.nombre || 'Chocó'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getEstadoBadge(
                      centro.estado
                    )}`}
                  >
                    {centro.estado}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {centro.nombre}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {centro.direccion} {centro.barrio ? `(${centro.barrio})` : ''}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Responsable: <strong className="text-slate-800">{centro.responsable}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tel: <strong className="text-slate-800">{centro.telefono}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  {centro.fechaAprobacion && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Auditado
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {canAudit && (
                    <button
                      onClick={() => handleAudit(centro)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition-colors"
                      title="Auditar / Dictamen Técnico"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Auditar
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(centro)}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Editar datos del centro"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CentroAcopioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
        municipios={municipios}
        centroToEdit={editingCentro}
      />

      <AuditarCentroModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSuccess={onRefresh}
        centro={auditingCentro}
      />
    </div>
  );
};
