import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  FileText,
  RefreshCw,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import { territorialService } from '../services/territorial.service';
import {
  DashboardAdministrativoData,
  DashboardPublicoData,
} from '../types/reporte-dashboard.types';
import { Municipio } from '../types/territorial.types';
import { DashboardConsolidado } from '../components/reportes-dashboards/DashboardConsolidado';
import { GeneradorReportes } from '../components/reportes-dashboards/GeneradorReportes';
import { SincronizacionOfflinePanel } from '../components/reportes-dashboards/SincronizacionOfflinePanel';
import toast from 'react-hot-toast';

type TabActiva = 'dashboard' | 'reportes' | 'sync';

export const ReportesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabActiva>('dashboard');
  const [adminData, setAdminData] = useState<DashboardAdministrativoData | null>(null);
  const [publicData, setPublicData] = useState<DashboardPublicoData | null>(null);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [adminRes, publicRes, municipiosRes] = await Promise.all([
        dashboardService.getDashboardAdministrativo().catch(() => null),
        dashboardService.getDashboardPublico().catch(() => null),
        territorialService.listarMunicipios().catch(() => ({ datos: [] })),
      ]);

      setAdminData(adminRes);
      setPublicData(publicRes);
      setMunicipios(municipiosRes.datos || []);
    } catch (error) {
      toast.error('Error al cargar datos del módulo de reportes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return (
    <div className="space-y-6">
      {/* Banner Principal */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Inteligencia Territorial y Reportes
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reportes, Dashboards y Sincronización Offline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidación departamental de KPIs de transparencia, generación multi-formato de
              reportes oficiales y sincronización resiliente para brigadas en zonas remotas del Chocó.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={cargarDatos}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sincronizar Métricas
            </button>
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 w-fit max-w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          Dashboard Ejecutivo y Cobertura
        </button>

        <button
          onClick={() => setActiveTab('reportes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reportes'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          Generador de Reportes y Exportación
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sync'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wifi className="w-4 h-4 text-purple-600" />
          Sincronización Offline y Resiliencia
        </button>
      </div>

      {/* Contenido Dinámico */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Cargando Inteligencia Territorial...</h3>
            <p className="text-xs text-slate-500 mt-1">
              Calculando indicadores y consolidando reportes departamentales
            </p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <DashboardConsolidado adminData={adminData} publicData={publicData} />
          )}

          {activeTab === 'reportes' && <GeneradorReportes municipios={municipios} />}

          {activeTab === 'sync' && <SincronizacionOfflinePanel />}
        </>
      )}
    </div>
  );
};

export default ReportesPage;
