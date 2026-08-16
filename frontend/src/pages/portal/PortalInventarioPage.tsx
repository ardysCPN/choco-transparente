import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, TrendingUp } from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { InventarioConsolidadoItem } from '../../types/publico.types';

export const PortalInventarioPage: React.FC = () => {
  const [inventario, setInventario] = useState<InventarioConsolidadoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cargar = async () => {
    setIsLoading(true);
    try {
      const data = await publicoService.getInventario();
      setInventario(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const totalUnidades = inventario.reduce((acc, i) => acc + (i.totalUnidades || 0), 0);
  const totalPeso = inventario.reduce((acc, i) => acc + (i.totalPesoKg || 0), 0);

  return (
    <div className="space-y-6 w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Package className="w-3.5 h-3.5 text-emerald-700" />
            <span>Stock Humanitario Departamental</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventario Público Consolidado
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Existencias disponibles en tiempo real por categoría en todos los centros de acopio autorizados del Chocó.
          </p>
        </div>

        <button
          onClick={cargar}
          disabled={isLoading}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center gap-2 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
          <span>Actualizar Stock</span>
        </button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Unidades en Bodega</div>
          <div className="text-4xl font-black text-slate-900">
            {totalUnidades.toLocaleString('es-CO')}
          </div>
          <div className="text-xs text-slate-600 font-medium">Kits de alimentos, agua potable, aseo y pertrechos</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Peso Total Estimado</div>
          <div className="text-4xl font-black text-sky-700">
            {totalPeso.toLocaleString('es-CO')} <span className="text-xl font-bold text-slate-600">Kg</span>
          </div>
          <div className="text-xs text-slate-600 font-medium">Capacidad de carga y despacho logístico humanitario</div>
        </div>
      </div>

      {/* Grid de Rubros de Inventario */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-sm font-medium">
          Consolidando existencias de los centros de acopio...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inventario.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-3xl p-6 space-y-3 shadow-xs hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.tipoAyuda}</div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {(item.totalUnidades || 0).toLocaleString('es-CO')}
                </div>
              </div>
              {item.totalPesoKg > 0 && (
                <div className="text-xs text-emerald-800 font-bold pt-3 border-t border-slate-100 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.totalPesoKg.toLocaleString('es-CO')} Kg disponibles</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalInventarioPage;
