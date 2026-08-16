import { useState, useEffect } from 'react';
import {
  MapPin,
  AlertTriangle,
  Building,
  Building2,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { territorialService } from '../services/territorial.service';
import { Municipio, Afectacion, CentroAcopio } from '../types/territorial.types';
import { MunicipiosList } from '../components/territorial/MunicipiosList';
import { AfectacionesMap } from '../components/territorial/AfectacionesMap';
import { AfectacionesList } from '../components/territorial/AfectacionesList';
import { CentrosAcopioList } from '../components/territorial/CentrosAcopioList';
import toast from 'react-hot-toast';

export const TerritorialPage = () => {
  const [activeTab, setActiveTab] = useState<'mapa' | 'afectaciones' | 'municipios' | 'centros'>('mapa');

  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [afectaciones, setAfectaciones] = useState<Afectacion[]>([]);
  const [centros, setCentros] = useState<CentroAcopio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resMuni, resAfec, resCentros] = await Promise.allSettled([
        territorialService.listarMunicipios(),
        territorialService.listarAfectaciones(),
        territorialService.listarCentrosAcopio(),
      ]);

      if (resMuni.status === 'fulfilled' && resMuni.value.exito && resMuni.value.datos) {
        setMunicipios(resMuni.value.datos);
      }
      if (resAfec.status === 'fulfilled' && resAfec.value.exito && resAfec.value.datos) {
        setAfectaciones(resAfec.value.datos);
      }
      if (resCentros.status === 'fulfilled' && resCentros.value.exito && resCentros.value.datos) {
        setCentros(resCentros.value.datos);
      }
    } catch {
      toast.error('Error al sincronizar datos territoriales');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalCriticas = afectaciones.filter((a) => a.severidad === 'CRITICA' || a.severidad === 'ALTA').length;
  const centrosAprobados = centros.filter((c) => c.estado === 'APROBADO').length;

  return (
    <div className="space-y-6">
      {/* Header del Módulo Territorial */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Gestión Territorial Departamental
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Módulo Territorial y Afectaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitoreo en tiempo real de los 31 municipios del Chocó, reporte de emergencias y red de centros de acopio.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="relative z-10 self-start md:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 hover:border-emerald-500 transition-all shadow-md shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* KPI Cards Territoriales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Municipios Cobertura</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{municipios.length} / 31</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% Departamento del Chocó
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Afectaciones Registradas</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{afectaciones.length}</div>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              {totalCriticas} de alta / crítica severidad
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Centros de Acopio</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{centros.length}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {centrosAprobados} auditados y operativos
            </p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs de Navegación del Módulo */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-sm overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('mapa')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'mapa'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Mapa de Emergencias (GIS)</span>
        </button>

        <button
          onClick={() => setActiveTab('afectaciones')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'afectaciones'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Afectaciones ({afectaciones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('municipios')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'municipios'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Municipios ({municipios.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('centros')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'centros'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Centros de Acopio ({centros.length})</span>
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'mapa' && (
          <AfectacionesMap
            afectaciones={afectaciones}
            municipios={municipios}
            centros={centros}
          />
        )}

        {activeTab === 'afectaciones' && (
          <AfectacionesList
            afectaciones={afectaciones}
            municipios={municipios}
            isLoading={isLoading}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'municipios' && (
          <MunicipiosList
            municipios={municipios}
            isLoading={isLoading}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'centros' && (
          <CentrosAcopioList
            centros={centros}
            municipios={municipios}
            isLoading={isLoading}
            onRefresh={fetchData}
          />
        )}
      </div>
    </div>
  );
};

export default TerritorialPage;
