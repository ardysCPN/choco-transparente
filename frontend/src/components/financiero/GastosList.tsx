import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  Calendar,
  Building2,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { Gasto, EstadoGasto } from '../../types/financiero.types';

interface GastosListProps {
  gastos: Gasto[];
  onNewGasto: () => void;
  onAuditarGasto: (gasto: Gasto) => void;
}

export const GastosList: React.FC<GastosListProps> = ({
  gastos,
  onNewGasto,
  onAuditarGasto,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');

  const filteredGastos = useMemo(() => {
    return gastos.filter((g) => {
      const matchSearch =
        g.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado = selectedEstado === 'todos' || g.estado === selectedEstado;

      return matchSearch && matchEstado;
    });
  }, [gastos, searchTerm, selectedEstado]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getEstadoBadge = (estado: EstadoGasto) => {
    switch (estado) {
      case 'APROBADO':
        return {
          label: 'Aprobado y Auditado',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'BORRADOR':
        return {
          label: 'Pendiente de Auditoría',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: Clock,
        };
      case 'RECHAZADO':
        return {
          label: 'Rechazado con Reparos',
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
      {/* Filtros y Acciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por concepto, factura, proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="APROBADO">🟢 Aprobados y Auditados</option>
              <option value="BORRADOR">🟡 Pendientes de Auditoría</option>
              <option value="RECHAZADO">🔴 Rechazados</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onNewGasto}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Radicar Gasto
          </button>
        </div>
      </div>

      {/* Tabla de Gastos */}
      {filteredGastos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No se encontraron gastos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No hay facturas o gastos registrados con los filtros aplicados.
          </p>
          <button
            onClick={onNewGasto}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Radicar Primer Gasto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Factura / Fecha</th>
                  <th className="px-4 py-3.5">Concepto / Objeto</th>
                  <th className="px-4 py-3.5">Proveedor</th>
                  <th className="px-4 py-3.5">Monto ($ COP)</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-4 py-3.5 text-right">Auditoría</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGastos.map((gasto) => {
                  const badge = getEstadoBadge(gasto.estado);
                  const BadgeIcon = badge.icon;
                  const monto = Number(gasto.monto) || 0;

                  return (
                    <tr key={gasto.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-slate-900">
                          {gasto.numeroFactura}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(gasto.fecha).toLocaleDateString('es-CO')}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                          {gasto.concepto}
                        </div>
                        {gasto.soporte && (
                          <a
                            href={gasto.soporte}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-bold hover:underline mt-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Ver Factura PDF
                          </a>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {gasto.proveedor}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="text-sm font-black text-rose-700">
                          {formatCOP(monto)}
                        </div>
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
                        <button
                          onClick={() => onAuditarGasto(gasto)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Auditar
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
