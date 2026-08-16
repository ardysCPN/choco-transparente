import React, { useState } from 'react';
import { ItemInventario } from '../../types/inventario.types';
import { CentroAcopio } from '../../types/territorial.types';
import {
  Search,
  Package,
  AlertCircle,
  CheckCircle,
  Building2,
  PackagePlus,
  PackageMinus,
  FileSpreadsheet,
} from 'lucide-react';

interface InventarioTableProps {
  items: ItemInventario[];
  centros: CentroAcopio[];
  isLoading: boolean;
  onOpenEntrada: () => void;
  onOpenSalida: () => void;
  onOpenReporte: () => void;
}

export const InventarioTable: React.FC<InventarioTableProps> = ({
  items,
  centros,
  isLoading,
  onOpenEntrada,
  onOpenSalida,
  onOpenReporte,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCentro, setFilterCentro] = useState<string>('TODOS');
  const [filterStock, setFilterStock] = useState<string>('TODOS');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.tipoAyuda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.centroAcopio &&
        item.centroAcopio.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCentro =
      filterCentro === 'TODOS' || String(item.centroAcopioId) === filterCentro;

    const cantidad = Number(item.cantidadActual);
    let matchesStock = true;
    if (filterStock === 'CRITICO') matchesStock = cantidad <= 50;
    if (filterStock === 'OPTIMO') matchesStock = cantidad > 200;

    return matchesSearch && matchesCentro && matchesStock;
  });

  const getTipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
      KIT_ALIMENTOS: 'Kits de Alimentos',
      KIT_ASEO: 'Kits de Aseo Familiar',
      KIT_COCINA: 'Kits de Cocina',
      FRAZADAS_COLCHONETAS: 'Frazadas y Colchonetas',
      AGUA_POTABLE: 'Agua Potable',
      MEDICAMENTOS_PRIMEROS_AUXILIOS: 'Medicamentos y Botiquines',
      HERRAMIENTAS_REPARACION: 'Herramientas y Tejas',
      CARPAS_REFUGIO: 'Carpas de Refugio',
    };
    return map[tipo] || tipo;
  };

  return (
    <div className="space-y-4">
      {/* Barra de Búsqueda y Acciones Rápidas */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tipo de ayuda o centro de acopio..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCentro}
            onChange={(e) => setFilterCentro(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos los Centros</option>
            {centros.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos los Niveles</option>
            <option value="CRITICO">⚠️ Stock Bajo (&le; 50)</option>
            <option value="OPTIMO">✅ Stock Óptimo (&gt; 200)</option>
          </select>

          <button
            onClick={onOpenReporte}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
            title="Ver / Exportar Reporte"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Reporte</span>
          </button>

          <button
            onClick={onOpenSalida}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <PackageMinus className="w-4 h-4" />
            <span>Salida</span>
          </button>

          <button
            onClick={onOpenEntrada}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Entrada</span>
          </button>
        </div>
      </div>

      {/* Tabla de Inventarios */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Existencias y Stock en Bodegas de Acopio
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredItems.length} registros encontrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Centro de Acopio</th>
                <th className="px-6 py-3.5">Tipo de Ayuda Humanitaria</th>
                <th className="px-6 py-3.5 text-center">Cantidad Disponible</th>
                <th className="px-6 py-3.5 text-center">Peso Total (Kg)</th>
                <th className="px-6 py-3.5">Nivel de Stock</th>
                <th className="px-6 py-3.5 text-right">Última Actualización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Consultando inventario en centros de acopio...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No se registran existencias con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const cantidad = Number(item.cantidadActual);
                  const isCritico = cantidad <= 50;
                  const isOptimo = cantidad > 200;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {item.centroAcopio?.nombre || `Centro #${item.centroAcopioId}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-medium">
                          {getTipoLabel(item.tipoAyuda)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-sm text-slate-900">
                        {cantidad.toLocaleString()} {item.unidadMedida}s
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-600">
                        {Number(item.pesoActual).toLocaleString()} Kg
                      </td>
                      <td className="px-6 py-4">
                        {isCritico ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> Stock Bajo
                          </span>
                        ) : isOptimo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Abastecido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Moderado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 font-mono text-[11px]">
                        {item.fechaActualizacion
                          ? new Date(item.fechaActualizacion).toLocaleString()
                          : 'Hoy'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
