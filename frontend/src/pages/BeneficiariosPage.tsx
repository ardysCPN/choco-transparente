import { useState, useEffect } from 'react';
import {
  Users,
  RefreshCw,
  Sparkles,
  UserPlus,
  FileText,
  Truck,
  BarChart3,
  ClipboardList,
  HeartHandshake,
} from 'lucide-react';
import { beneficiarioService } from '../services/beneficiario.service';
import { territorialService } from '../services/territorial.service';
import { Beneficiario, SolicitudAyuda, EntregaAyuda } from '../types/beneficiario.types';
import { Municipio, Afectacion } from '../types/territorial.types';
import { BeneficiariosDashboard } from '../components/beneficiarios/BeneficiariosDashboard';
import { BeneficiariosList } from '../components/beneficiarios/BeneficiariosList';
import { BeneficiarioModal } from '../components/beneficiarios/BeneficiarioModal';
import { SolicitudesList } from '../components/beneficiarios/SolicitudesList';
import { SolicitudModal } from '../components/beneficiarios/SolicitudModal';
import { EntregasList } from '../components/beneficiarios/EntregasList';
import { EntregaModal } from '../components/beneficiarios/EntregaModal';
import toast from 'react-hot-toast';

type TabActiva = 'dashboard' | 'familias' | 'solicitudes' | 'entregas';

export const BeneficiariosPage = () => {
  const [activeTab, setActiveTab] = useState<TabActiva>('dashboard');

  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudAyuda[]>([]);
  const [entregas, setEntregas] = useState<EntregaAyuda[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [afectaciones, setAfectaciones] = useState<Afectacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [isBeneficiarioModalOpen, setIsBeneficiarioModalOpen] = useState(false);
  const [editingBeneficiario, setEditingBeneficiario] = useState<Beneficiario | null>(null);
  const [isSolicitudModalOpen, setIsSolicitudModalOpen] = useState(false);
  const [editingSolicitud, setEditingSolicitud] = useState<SolicitudAyuda | null>(null);
  const [isEntregaModalOpen, setIsEntregaModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resBen, resSol, resEnt, resMun, resAfec] = await Promise.allSettled([
        beneficiarioService.listar(),
        beneficiarioService.listarSolicitudes(),
        beneficiarioService.listarEntregas(),
        territorialService.listarMunicipios(),
        territorialService.listarAfectaciones(),
      ]);

      if (resBen.status === 'fulfilled' && resBen.value.exito && resBen.value.datos)
        setBeneficiarios(resBen.value.datos);
      if (resSol.status === 'fulfilled' && resSol.value.exito && resSol.value.datos)
        setSolicitudes(resSol.value.datos);
      if (resEnt.status === 'fulfilled' && resEnt.value.exito && resEnt.value.datos)
        setEntregas(resEnt.value.datos);
      if (resMun.status === 'fulfilled' && resMun.value.exito && resMun.value.datos)
        setMunicipios(resMun.value.datos);
      if (resAfec.status === 'fulfilled' && resAfec.value.exito && resAfec.value.datos)
        setAfectaciones(resAfec.value.datos);
    } catch {
      toast.error('Error al sincronizar datos de beneficiarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCrearBeneficiario = () => {
    setEditingBeneficiario(null);
    setIsBeneficiarioModalOpen(true);
  };

  const handleEditarBeneficiario = (b: Beneficiario) => {
    setEditingBeneficiario(b);
    setIsBeneficiarioModalOpen(true);
  };

  const handleCrearSolicitud = () => {
    setEditingSolicitud(null);
    setIsSolicitudModalOpen(true);
  };

  const handleActualizarSolicitud = (s: SolicitudAyuda) => {
    setEditingSolicitud(s);
    setIsSolicitudModalOpen(true);
  };

  const tabs: { key: TabActiva; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      key: 'dashboard',
      label: 'Dashboard & Analítica',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      key: 'familias',
      label: `Familias Beneficiarias`,
      icon: <Users className="w-4 h-4" />,
      count: beneficiarios.length,
    },
    {
      key: 'solicitudes',
      label: 'Solicitudes de Ayuda',
      icon: <ClipboardList className="w-4 h-4" />,
      count: solicitudes.length,
    },
    {
      key: 'entregas',
      label: 'Entregas Realizadas',
      icon: <HeartHandshake className="w-4 h-4" />,
      count: entregas.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Censo de Familias y Entregas Humanitarias
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gestión de Beneficiarios y Ayuda Humanitaria
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Registro de familias afectadas, solicitudes de ayuda vinculadas a emergencias, y entregas con evidencia fotográfica obligatoria.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEntregaModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Truck className="w-4 h-4" />
            <span>Entrega</span>
          </button>

          <button
            onClick={handleCrearSolicitud}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Solicitud</span>
          </button>

          <button
            onClick={handleCrearBeneficiario}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nueva Familia</span>
          </button>

          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-sm overflow-x-auto gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === tab.key
                ? 'border-violet-600 text-violet-700 bg-violet-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'dashboard' && (
          <BeneficiariosDashboard
            beneficiarios={beneficiarios}
            solicitudes={solicitudes}
            entregas={entregas}
          />
        )}

        {activeTab === 'familias' && (
          <BeneficiariosList
            beneficiarios={beneficiarios}
            isLoading={isLoading}
            onCrear={handleCrearBeneficiario}
            onEditar={handleEditarBeneficiario}
          />
        )}

        {activeTab === 'solicitudes' && (
          <SolicitudesList
            solicitudes={solicitudes}
            isLoading={isLoading}
            onCrear={handleCrearSolicitud}
            onActualizar={handleActualizarSolicitud}
          />
        )}

        {activeTab === 'entregas' && (
          <EntregasList
            entregas={entregas}
            isLoading={isLoading}
            onCrear={() => setIsEntregaModalOpen(true)}
          />
        )}
      </div>

      {/* Modales */}
      <BeneficiarioModal
        isOpen={isBeneficiarioModalOpen}
        onClose={() => setIsBeneficiarioModalOpen(false)}
        onSuccess={fetchData}
        municipios={municipios}
        beneficiario={editingBeneficiario}
      />

      <SolicitudModal
        isOpen={isSolicitudModalOpen}
        onClose={() => setIsSolicitudModalOpen(false)}
        onSuccess={fetchData}
        beneficiarios={beneficiarios}
        afectaciones={afectaciones}
        solicitud={editingSolicitud}
      />

      <EntregaModal
        isOpen={isEntregaModalOpen}
        onClose={() => setIsEntregaModalOpen(false)}
        onSuccess={fetchData}
        beneficiarios={beneficiarios}
      />
    </div>
  );
};

export default BeneficiariosPage;
