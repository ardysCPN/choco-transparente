import React from 'react';
import { ItemInventario, EstadisticasInventarioData } from '../../types/inventario.types';
import {
  Package,
  Scale,
  Building2,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';

interface InventarioDashboardProps {
  items: ItemInventario[];
  estadisticas?: EstadisticasInventarioData | null;
}

export const InventarioDashboard: React.FC<InventarioDashboardProps> = ({
  items,
}) => {
  const totalKits = items.reduce((sum, i) => sum + Number(i.cantidadActual), 0);
  const totalKilos = items.reduce((sum, i) => sum + Number(i.pesoActual), 0);
  const lowStockCount = items.filter((i) => Number(i.cantidadActual) <= 50).length;

  const centrosUnicos = new Set(items.map((i) => String(i.centroAcopioId))).size;

  // Agrupado por tipo de ayuda
  const agrupadoPorTipo = items.reduce((acc, item) => {
    const key = item.tipoAyuda;
    if (!acc[key]) {
      acc[key] = { cantidad: 0, peso: 0 };
    }
    acc[key].cantidad += Number(item.cantidadActual);
    acc[key].peso += Number(item.pesoActual);
    return acc;
  }, {} as Record<string, { cantidad: number; peso: number }>);

  const getTipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
      KIT_ALIMENTOS: 'Kits de Alimentos',
      KIT_ASEO: 'Kits de Aseo Familiar',
      KIT_COCINA: 'Kits de Cocina y Menaje',
      FRAZADAS_COLCHONETAS: 'Frazadas y Colchonetas',
      AGUA_POTABLE: 'Agua Potable',
      MEDICAMENTOS_PRIMEROS_AUXILIOS: 'Medicamentos y Botiquines',
      HERRAMIENTAS_REPARACION: 'Herramientas y Tejas',
      CARPAS_REFUGIO: 'Carpas de Refugio',
    };
    return map[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      {/* 4 KPIs de Alto Nivel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Kits */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Total Ayudas en Stock
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {totalKits.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Unidades listas para despacho
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Peso Total */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Tonelaje Almacenado
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {(totalKilos / 1000).toFixed(1)} <span className="text-lg font-bold">Ton</span>
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">
              {totalKilos.toLocaleString()} Kilogramos
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Centros con Stock */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Centros con Stock
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {centrosUnicos}
            </div>
            <p className="text-[11px] text-teal-600 font-medium mt-0.5">
              Bodegas de recepción activas
            </p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Alertas de Stock Bajo */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">
              Alertas de Stock Bajo
            </span>
            <div className="text-3xl font-black text-rose-600 mt-1">
              {lowStockCount}
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">
              Lotes con &le; 50 unidades
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Desglose por Tipo de Ayuda */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Disponibilidad por Tipo de Ayuda Humanitaria
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Consolidado General Departamental
          </span>
        </div>

        {Object.keys(agrupadoPorTipo).length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No se han registrado existencias de inventario aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(agrupadoPorTipo).map(([tipo, data]) => {
              const porcentaje = totalKits > 0 ? (data.cantidad / totalKits) * 100 : 0;

              return (
                <div
                  key={tipo}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {getTipoLabel(tipo)}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {data.cantidad.toLocaleString()} Unidades
                    </span>
                  </div>

                  {/* Barra de Progreso / Proporción */}
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{porcentaje.toFixed(1)}% del stock global</span>
                      <span>{data.peso.toLocaleString()} Kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
