import React, { useState } from 'react';
import {
  Search,
  Users,
  MapPin,
  Phone,
  ChevronRight,
  UserPlus,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Beneficiario } from '../../types/beneficiario.types';

interface BeneficiariosListProps {
  beneficiarios: Beneficiario[];
  isLoading: boolean;
  onCrear: () => void;
  onEditar: (b: Beneficiario) => void;
}

export const BeneficiariosList: React.FC<BeneficiariosListProps> = ({
  beneficiarios,
  isLoading,
  onCrear,
  onEditar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');

  const filtered = beneficiarios.filter((b) => {
    const matchSearch =
      b.codigoFamilia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.barrio && b.barrio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.contacto && b.contacto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.municipio?.nombre && b.municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchEstado = filterEstado === 'TODOS' || b.estado === filterEstado;

    return matchSearch && matchEstado;
  });

  const totalPersonas = filtered.reduce((s, b) => s + (b.cantidadPersonas || 0), 0);

  const estadoBadge = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Activo
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
      case 'INACTIVO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <AlertCircle className="w-3 h-3" /> Inactivo
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código de familia, municipio, contacto..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ACTIVO">✅ Activos</option>
            <option value="PENDIENTE">⏳ Pendientes</option>
            <option value="INACTIVO">🔒 Inactivos</option>
          </select>

          <button
            onClick={onCrear}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Familia</span>
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500">
        <span>{filtered.length} familias registradas</span>
        <span className="font-semibold text-violet-700">
          {totalPersonas.toLocaleString()} personas beneficiarias
        </span>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Código Familia</th>
                <th className="px-5 py-3.5">Municipio</th>
                <th className="px-5 py-3.5">Barrio / Comunidad</th>
                <th className="px-5 py-3.5 text-center">Personas</th>
                <th className="px-5 py-3.5">Contacto</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Fecha Registro</th>
                <th className="px-5 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Cargando familias beneficiarias...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No se encontraron beneficiarios con esos criterios.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                        {b.codigoFamilia}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                        {b.municipio?.nombre || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-[180px] truncate">
                      {b.barrio || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-50 text-violet-700 font-bold text-xs">
                        <Users className="w-3 h-3" />
                        {b.cantidadPersonas}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {b.contacto ? (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {b.contacto}
                        </span>
                      ) : (
                        <span className="text-slate-300">Sin contacto</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">{estadoBadge(b.estado)}</td>
                    <td className="px-5 py-3.5 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(b.fechaRegistro).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => onEditar(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-violet-50 text-slate-600 hover:text-violet-700 text-[11px] font-semibold transition-colors"
                        title="Editar beneficiario"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <ChevronRight className="w-3 h-3" />
                      </button>
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
