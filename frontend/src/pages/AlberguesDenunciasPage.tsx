import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  ShieldAlert,
  BarChart3,
  RefreshCw,
  Plus,
  Sparkles,
} from 'lucide-react';
import { alberguesService, denunciasService } from '../services/albergues-denuncias.service';
import { territorialService } from '../services/territorial.service';
import {
  Albergue,
  Denuncia,
  CrearAlbergueInput,
  ActualizarAlbergueInput,
  CrearDenunciaInput,
  ActualizarDenunciaInput,
} from '../types/albergue-denuncia.types';
import { Municipio } from '../types/territorial.types';
import { AlberguesDashboard } from '../components/albergues-denuncias/AlberguesDashboard';
import { AlberguesList } from '../components/albergues-denuncias/AlberguesList';
import { AlbergueModal } from '../components/albergues-denuncias/AlbergueModal';
import { DenunciasList } from '../components/albergues-denuncias/DenunciasList';
import { DenunciaModal } from '../components/albergues-denuncias/DenunciaModal';
import { DenunciaDetalleModal } from '../components/albergues-denuncias/DenunciaDetalleModal';
import toast from 'react-hot-toast';

type TabActiva = 'dashboard' | 'albergues' | 'denuncias';

export const AlberguesDenunciasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabActiva>('dashboard');
  const [albergues, setAlbergues] = useState<Albergue[]>([]);
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados de Modales
  const [isAlbergueModalOpen, setIsAlbergueModalOpen] = useState(false);
  const [editingAlbergue, setEditingAlbergue] = useState<Albergue | null>(null);

  const [isDenunciaModalOpen, setIsDenunciaModalOpen] = useState(false);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [alberguesData, denunciasData, municipiosRes] = await Promise.all([
        alberguesService.getAlbergues().catch(() => []),
        denunciasService.getDenuncias().catch(() => []),
        territorialService.listarMunicipios().catch(() => ({ datos: [] })),
      ]);

      setAlbergues(alberguesData);
      setDenuncias(denunciasData);
      setMunicipios(municipiosRes.datos || []);
    } catch (error) {
      toast.error('Error al sincronizar datos de albergues y denuncias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Manejadores de Albergues
  const handleGuardarAlbergue = async (
    data: CrearAlbergueInput | ActualizarAlbergueInput
  ) => {
    try {
      if (editingAlbergue) {
        await alberguesService.actualizarAlbergue(editingAlbergue.id, data);
        toast.success('Albergue actualizado correctamente');
      } else {
        await alberguesService.crearAlbergue(data as CrearAlbergueInput);
        toast.success('Albergue registrado correctamente');
      }
      setIsAlbergueModalOpen(false);
      setEditingAlbergue(null);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al guardar la información del albergue');
    }
  };

  const handleUpdateOccupancy = async (albergue: Albergue, newOccupancy: number) => {
    try {
      let nuevoEstado = albergue.estado;
      if (newOccupancy >= albergue.capacidad) {
        nuevoEstado = 'LLENO';
      } else if (albergue.estado === 'LLENO' && newOccupancy < albergue.capacidad) {
        nuevoEstado = 'DISPONIBLE';
      }

      await alberguesService.actualizarAlbergue(albergue.id, {
        ocupacion: newOccupancy,
        estado: nuevoEstado,
      });

      setAlbergues((prev) =>
        prev.map((a) =>
          a.id === albergue.id ? { ...a, ocupacion: newOccupancy, estado: nuevoEstado } : a
        )
      );
      toast.success(`Ocupación actualizada: ${newOccupancy} personas`);
    } catch (error) {
      toast.error('Error al actualizar ocupación');
    }
  };

  // Manejadores de Denuncias
  const handleCrearDenuncia = async (data: CrearDenunciaInput) => {
    try {
      await denunciasService.crearDenuncia(data);
      toast.success('Denuncia radicada con éxito en el canal de veeduría');
      setIsDenunciaModalOpen(false);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al radicar la denuncia');
    }
  };

  const handleUpdateDenuncia = async (
    id: string | number,
    data: ActualizarDenunciaInput
  ) => {
    await denunciasService.actualizarDenuncia(id, data);
    await cargarDatos();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo con Banner Premium */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-rose-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Albergues Temporales y Control Social
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Albergues Temporales y Veeduría Ciudadana
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitoreo en tiempo real de la capacidad de albergues y refugios, junto con el canal
              de denuncias, auditoría comunitaria y resolución de irregularidades en el Chocó.
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
              onClick={() => {
                setEditingAlbergue(null);
                setIsAlbergueModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nuevo Albergue
            </button>
            <button
              onClick={() => setIsDenunciaModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/30 transition-all hover:scale-105 active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" />
              Radicar Denuncia
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
          Dashboard y Capacidad
        </button>

        <button
          onClick={() => setActiveTab('albergues')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'albergues'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4 text-teal-600" />
          Albergues Temporales
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-800 font-extrabold">
            {albergues.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('denuncias')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'denuncias'
              ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          Canal de Denuncias y Veeduría
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-extrabold">
            {denuncias.length}
          </span>
        </button>
      </div>

      {/* Contenido Dinámico de la Pestaña */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Cargando Albergues y Veeduría...</h3>
            <p className="text-xs text-slate-500 mt-1">
              Consultando la red de refugios y alertas territoriales del Chocó
            </p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <AlberguesDashboard albergues={albergues} denuncias={denuncias} />
          )}

          {activeTab === 'albergues' && (
            <AlberguesList
              albergues={albergues}
              municipios={municipios}
              onNewAlbergue={() => {
                setEditingAlbergue(null);
                setIsAlbergueModalOpen(true);
              }}
              onEditAlbergue={(albergue) => {
                setEditingAlbergue(albergue);
                setIsAlbergueModalOpen(true);
              }}
              onUpdateOccupancy={handleUpdateOccupancy}
            />
          )}

          {activeTab === 'denuncias' && (
            <DenunciasList
              denuncias={denuncias}
              municipios={municipios}
              onNewDenuncia={() => setIsDenunciaModalOpen(true)}
              onViewDenuncia={(denuncia) => setSelectedDenuncia(denuncia)}
            />
          )}
        </>
      )}

      {/* Modales */}
      <AlbergueModal
        isOpen={isAlbergueModalOpen}
        onClose={() => {
          setIsAlbergueModalOpen(false);
          setEditingAlbergue(null);
        }}
        onSubmit={handleGuardarAlbergue}
        albergue={editingAlbergue}
        municipios={municipios}
      />

      <DenunciaModal
        isOpen={isDenunciaModalOpen}
        onClose={() => setIsDenunciaModalOpen(false)}
        onSubmit={handleCrearDenuncia}
        municipios={municipios}
      />

      <DenunciaDetalleModal
        isOpen={!!selectedDenuncia}
        onClose={() => setSelectedDenuncia(null)}
        denuncia={selectedDenuncia}
        onUpdateDenuncia={handleUpdateDenuncia}
      />
    </div>
  );
};

export default AlberguesDenunciasPage;
