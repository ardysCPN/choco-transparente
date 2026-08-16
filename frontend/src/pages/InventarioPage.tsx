import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Sparkles,
  PackagePlus,
  PackageMinus,
  BarChart3,
  ListFilter,
  FileSpreadsheet,
} from 'lucide-react';
import { inventarioService } from '../services/inventario.service';
import { territorialService } from '../services/territorial.service';
import { ItemInventario, EstadisticasInventarioData } from '../types/inventario.types';
import { CentroAcopio, Municipio } from '../types/territorial.types';
import { InventarioDashboard } from '../components/inventario/InventarioDashboard';
import { InventarioTable } from '../components/inventario/InventarioTable';
import { EntradaModal } from '../components/inventario/EntradaModal';
import { SalidaModal } from '../components/inventario/SalidaModal';
import { ReporteInventarioModal } from '../components/inventario/ReporteInventarioModal';
import toast from 'react-hot-toast';

export const InventarioPage = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tabla'>('dashboard');

  const [items, setItems] = useState<ItemInventario[]>([]);
  const [centros, setCentros] = useState<CentroAcopio[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasInventarioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEntradaOpen, setIsEntradaOpen] = useState(false);
  const [isSalidaOpen, setIsSalidaOpen] = useState(false);
  const [isReporteOpen, setIsReporteOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Obtener centros y municipios
      const [resCentros, resMunicipios, resStats] = await Promise.allSettled([
        territorialService.listarCentrosAcopio(),
        territorialService.listarMunicipios(),
        inventarioService.obtenerEstadisticas(),
      ]);

      let centrosList: CentroAcopio[] = [];
      if (resCentros.status === 'fulfilled' && resCentros.value.exito && resCentros.value.datos) {
        centrosList = resCentros.value.datos;
        setCentros(centrosList);
      }

      if (resMunicipios.status === 'fulfilled' && resMunicipios.value.exito && resMunicipios.value.datos) {
        setMunicipios(resMunicipios.value.datos);
      }

      if (resStats.status === 'fulfilled' && resStats.value.exito && resStats.value.datos) {
        setEstadisticas(resStats.value.datos);
      }

      // 2. Obtener inventario de todos los centros
      const inventariosPorCentro = await Promise.allSettled(
        centrosList.map((c) => inventarioService.listarPorCentro(c.id))
      );

      const itemsConsolidados: ItemInventario[] = [];
      inventariosPorCentro.forEach((res, index) => {
        if (res.status === 'fulfilled' && res.value.exito && res.value.datos) {
          const centroInfo = centrosList[index];
          res.value.datos.forEach((item) => {
            itemsConsolidados.push({
              ...item,
              centroAcopio: centroInfo,
            });
          });
        }
      });

      setItems(itemsConsolidados);
    } catch {
      toast.error('Error al sincronizar inventarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header del Módulo de Inventario */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Inventario y Cadena de Suministro
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Control de Inventario y Ayudas Humanitarias
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Trazabilidad en tiempo real de remesas recibidas, stock disponible en bodegas y despachos con georreferenciación.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsReporteOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Reporte</span>
          </button>

          <button
            onClick={() => setIsSalidaOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <PackageMinus className="w-4 h-4" />
            <span>Despacho</span>
          </button>

          <button
            onClick={() => setIsEntradaOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Nueva Entrada</span>
          </button>

          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Recargar inventario"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs de Navegación del Módulo */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-sm overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'dashboard'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard & Analítica de Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('tabla')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'tabla'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Detalle de Existencias ({items.length})</span>
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'dashboard' && (
          <InventarioDashboard items={items} estadisticas={estadisticas} />
        )}

        {activeTab === 'tabla' && (
          <InventarioTable
            items={items}
            centros={centros}
            isLoading={isLoading}
            onOpenEntrada={() => setIsEntradaOpen(true)}
            onOpenSalida={() => setIsSalidaOpen(true)}
            onOpenReporte={() => setIsReporteOpen(true)}
          />
        )}
      </div>

      {/* Modales de Gestión */}
      <EntradaModal
        isOpen={isEntradaOpen}
        onClose={() => setIsEntradaOpen(false)}
        onSuccess={fetchData}
        centros={centros}
      />

      <SalidaModal
        isOpen={isSalidaOpen}
        onClose={() => setIsSalidaOpen(false)}
        onSuccess={fetchData}
        centros={centros}
        municipios={municipios}
      />

      <ReporteInventarioModal
        isOpen={isReporteOpen}
        onClose={() => setIsReporteOpen(false)}
        items={items}
      />
    </div>
  );
};

export default InventarioPage;
