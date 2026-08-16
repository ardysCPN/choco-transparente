import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  Receipt,
  Scale,
  RefreshCw,
  Plus,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import {
  donacionesService,
  gastosService,
  financieroReportesService,
} from '../services/financiero.service';
import { territorialService } from '../services/territorial.service';
import {
  Donacion,
  Gasto,
  CrearDonacionDineroInput,
  CrearDonacionEspecieInput,
  EstadoDonacion,
  CrearGastoInput,
  AprobarGastoInput,
} from '../types/financiero.types';
import { Municipio } from '../types/territorial.types';
import { CajaTransparenteDashboard } from '../components/financiero/CajaTransparenteDashboard';
import { DonacionesList } from '../components/financiero/DonacionesList';
import { DonacionModal } from '../components/financiero/DonacionModal';
import { GastosList } from '../components/financiero/GastosList';
import { GastoModal } from '../components/financiero/GastoModal';
import { GastoAprobacionModal } from '../components/financiero/GastoAprobacionModal';
import toast from 'react-hot-toast';

type TabActiva = 'caja' | 'donaciones' | 'gastos';

export const FinancieroPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabActiva>('caja');
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Modales
  const [isDonacionModalOpen, setIsDonacionModalOpen] = useState(false);
  const [isGastoModalOpen, setIsGastoModalOpen] = useState(false);
  const [selectedGastoParaAuditar, setSelectedGastoParaAuditar] = useState<Gasto | null>(null);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [donacionesData, gastosData, municipiosRes] = await Promise.all([
        donacionesService.listarDonaciones().catch(() => []),
        gastosService.listarGastos().catch(() => []),
        territorialService.listarMunicipios().catch(() => ({ datos: [] })),
      ]);

      setDonaciones(donacionesData);
      setGastos(gastosData);
      setMunicipios(municipiosRes.datos || []);
    } catch (error) {
      toast.error('Error al sincronizar datos financieros');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Manejadores de Donaciones
  const handleCrearDonacionDinero = async (data: CrearDonacionDineroInput) => {
    try {
      await donacionesService.crearDonacionDinero(data);
      toast.success('Donación en dinero registrada en Caja Transparente');
      setIsDonacionModalOpen(false);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al registrar donación en dinero');
    }
  };

  const handleCrearDonacionEspecie = async (data: CrearDonacionEspecieInput) => {
    try {
      await donacionesService.crearDonacionEspecie(data);
      toast.success('Donación en especie registrada exitosamente');
      setIsDonacionModalOpen(false);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al registrar donación en especie');
    }
  };

  const handleUpdateEstadoDonacion = async (
    donacion: Donacion,
    nuevoEstado: EstadoDonacion
  ) => {
    try {
      await donacionesService.actualizarEstadoDonacion(donacion.id, { estado: nuevoEstado });
      toast.success(`Donación actualizada a estado: ${nuevoEstado}`);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al actualizar estado de la donación');
    }
  };

  // Manejadores de Gastos
  const handleCrearGasto = async (data: CrearGastoInput) => {
    try {
      await gastosService.crearGasto(data);
      toast.success('Gasto y factura radicados en borrador para auditoría');
      setIsGastoModalOpen(false);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al radicar gasto');
    }
  };

  const handleAprobarGasto = async (id: string | number, data: AprobarGastoInput) => {
    try {
      await gastosService.aprobarGasto(id, data);
      toast.success(`Gasto ${data.accion === 'APROBAR' ? 'aprobado' : 'rechazado'} con éxito`);
      setSelectedGastoParaAuditar(null);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al emitir dictamen de auditoría del gasto');
    }
  };

  // Exportar reporte financiero
  const handleExportarReporte = async (formato: 'JSON' | 'CSV') => {
    setIsExporting(true);
    try {
      const data = await financieroReportesService.exportarReporte({}, formato);
      if (formato === 'CSV') {
        const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data)], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_caja_transparente_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `balance_caja_transparente_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success(`Reporte financiero exportado en formato ${formato}`);
    } catch (error) {
      toast.error('Error al exportar reporte financiero');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal de la Fase 6 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Transparencia Financiera y Donaciones
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Donaciones, Gastos y Caja Transparente
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Control público en tiempo real de aportes monetarios y en especie, facturación
              electrónica auditada y trazabilidad de cada recurso destinado a la emergencia en el Chocó.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={cargarDatos}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sincronizar
            </button>
            <button
              onClick={() => handleExportarReporte('CSV')}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all active:scale-95 disabled:opacity-50"
              title="Exportar archivo CSV de Caja"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              Exportar CSV
            </button>
            <button
              onClick={() => setIsDonacionModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nueva Donación
            </button>
            <button
              onClick={() => setIsGastoModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/30 transition-all hover:scale-105 active:scale-95"
            >
              <Receipt className="w-4 h-4" />
              Radicar Gasto
            </button>
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 w-fit max-w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab('caja')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'caja'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-600" />
          Caja Transparente y Balance
        </button>

        <button
          onClick={() => setActiveTab('donaciones')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'donaciones'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4 text-teal-600" />
          Donaciones Recibidas
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-800 font-extrabold">
            {donaciones.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gastos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gastos'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-rose-600" />
          Gastos y Facturación Auditada
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-extrabold">
            {gastos.length}
          </span>
        </button>
      </div>

      {/* Contenido Dinámico */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Cargando Caja Transparente...</h3>
            <p className="text-xs text-slate-500 mt-1">
              Consultando registros contables, donaciones y facturación auditada
            </p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'caja' && (
            <CajaTransparenteDashboard donaciones={donaciones} gastos={gastos} />
          )}

          {activeTab === 'donaciones' && (
            <DonacionesList
              donaciones={donaciones}
              municipios={municipios}
              onNewDonacion={() => setIsDonacionModalOpen(true)}
              onUpdateEstado={handleUpdateEstadoDonacion}
            />
          )}

          {activeTab === 'gastos' && (
            <GastosList
              gastos={gastos}
              onNewGasto={() => setIsGastoModalOpen(true)}
              onAuditarGasto={(gasto) => setSelectedGastoParaAuditar(gasto)}
            />
          )}
        </>
      )}

      {/* Modales */}
      <DonacionModal
        isOpen={isDonacionModalOpen}
        onClose={() => setIsDonacionModalOpen(false)}
        onSubmitDinero={handleCrearDonacionDinero}
        onSubmitEspecie={handleCrearDonacionEspecie}
        municipios={municipios}
      />

      <GastoModal
        isOpen={isGastoModalOpen}
        onClose={() => setIsGastoModalOpen(false)}
        onSubmit={handleCrearGasto}
      />

      <GastoAprobacionModal
        isOpen={!!selectedGastoParaAuditar}
        onClose={() => setSelectedGastoParaAuditar(null)}
        gasto={selectedGastoParaAuditar}
        onAprobar={handleAprobarGasto}
      />
    </div>
  );
};

export default FinancieroPage;
