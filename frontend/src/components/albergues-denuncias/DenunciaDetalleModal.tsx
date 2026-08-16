import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  MapPin,
  Calendar,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  MessageSquare,
  Loader2,
  FileCheck,
} from 'lucide-react';
import {
  Denuncia,
  EstadoDenuncia,
  ActualizarDenunciaInput,
} from '../../types/albergue-denuncia.types';
import toast from 'react-hot-toast';

interface DenunciaDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  denuncia: Denuncia | null;
  onUpdateDenuncia: (id: string | number, data: ActualizarDenunciaInput) => Promise<void>;
}

const ESTADOS_TIMELINE: {
  estado: EstadoDenuncia;
  titulo: string;
  descripcion: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}[] = [
  {
    estado: 'RECIBIDA',
    titulo: '1. Denuncia Radicada',
    descripcion: 'Alerta registrada en el sistema de transparencia',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  {
    estado: 'EN_REVISION',
    titulo: '2. En Revisión',
    descripcion: 'Evaluación técnica por auditores y veedores',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
  },
  {
    estado: 'INVESTIGACION',
    titulo: '3. En Investigación',
    descripcion: 'Verificación en campo y recolección de pruebas',
    icon: ShieldAlert,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
  },
  {
    estado: 'RESUELTA',
    titulo: '4. Caso Resuelto',
    descripcion: 'Medidas correctivas aplicadas y respuesta oficial emitida',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
  },
];

export const DenunciaDetalleModal: React.FC<DenunciaDetalleModalProps> = ({
  isOpen,
  onClose,
  denuncia,
  onUpdateDenuncia,
}) => {
  if (!isOpen || !denuncia) return null;

  const [nuevoEstado, setNuevoEstado] = useState<EstadoDenuncia>(denuncia.estado);
  const [respuesta, setRespuesta] = useState<string>(denuncia.respuesta || '');
  const [isSaving, setIsSaving] = useState(false);

  const getStepIndex = (estado: EstadoDenuncia) => {
    switch (estado) {
      case 'RECIBIDA':
        return 0;
      case 'EN_REVISION':
        return 1;
      case 'INVESTIGACION':
        return 2;
      case 'RESUELTA':
        return 3;
      case 'DESCARTADA':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(denuncia.estado);

  const handleGuardarResolucion = async () => {
    setIsSaving(true);
    try {
      await onUpdateDenuncia(denuncia.id, {
        estado: nuevoEstado,
        respuesta: respuesta.trim() || undefined,
      });
      toast.success('Estado y respuesta de la denuncia actualizados con éxito');
      onClose();
    } catch (error) {
      toast.error('Error al actualizar el caso de denuncia');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-indigo-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Expediente de Denuncia #{denuncia.id.toString()}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                  {denuncia.tipo.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Municipio: {denuncia.municipio?.nombre || 'Chocó'} · {denuncia.barrio || 'Sector no especificado'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Timeline Interactivo de Estados */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Línea de Tiempo y Seguimiento del Caso
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
              {ESTADOS_TIMELINE.map((item, index) => {
                const isPassed = index <= currentStep;
                const isCurrent = index === currentStep;
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.estado}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-white border-indigo-500 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`p-1 rounded-lg ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-indigo-900' : isPassed ? 'text-emerald-900' : 'text-slate-500'
                        }`}
                      >
                        {item.titulo}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {item.descripcion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Información del Hecho y Descripción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Descripción Radicada
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                  {denuncia.descripcion}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Fecha Registro
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">
                    {denuncia.fecha
                      ? new Date(denuncia.fecha).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Fecha reciente'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Ubicación
                  </div>
                  <div className="font-semibold text-slate-800 mt-1 truncate">
                    {denuncia.municipio?.nombre}, {denuncia.barrio || 'Cabecera'}
                  </div>
                </div>
              </div>
            </div>

            {/* Evidencia Fotográfica */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                Evidencia Adjunta
              </h4>

              {denuncia.evidencia ? (
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group relative">
                  <img
                    src={denuncia.evidencia}
                    alt="Evidencia fotográfica"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <a
                      href={denuncia.evidencia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold hover:bg-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Abrir Evidencia Original
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-4 bg-slate-50 text-slate-400">
                  <Camera className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No se adjuntó soporte fotográfico directo</p>
                  <p className="text-[10px] text-slate-400">
                    El ciudadano no cargó URL de evidencia en la radicación.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de Resolución Institucional */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Resolución y Respuesta Institucional
              </h3>
              <span className="text-[11px] text-indigo-600 font-semibold">
                Control y Auditoría Oficial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Actualizar Estado del Caso
                </label>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value as EstadoDenuncia)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="RECIBIDA">🔵 RECIBIDA (Pendiente de trámite)</option>
                  <option value="EN_REVISION">🟡 EN REVISIÓN (Evaluación técnica)</option>
                  <option value="INVESTIGACION">🟣 EN INVESTIGACIÓN (Comisión en campo)</option>
                  <option value="RESUELTA">🟢 RESUELTA (Medidas tomadas)</option>
                  <option value="DESCARTADA">⚪ DESCARTADA (Sin mérito o inconsistente)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Acción Recomendada
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-white border border-indigo-200 text-xs text-slate-600">
                  {nuevoEstado === 'RESUELTA'
                    ? '✅ El caso quedará cerrado y auditado.'
                    : nuevoEstado === 'INVESTIGACION'
                    ? '🔍 Se remitirá alerta a los veedores en municipio.'
                    : '⏳ Caso en gestión ordinaria.'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                Respuesta Oficial / Dictamen de Auditoría
              </label>
              <textarea
                rows={3}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escriba el resultado de la verificación, medidas correctivas adoptadas o motivos de la decisión institucional..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleGuardarResolucion}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-900/20 disabled:opacity-50 transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Guardar Decisión y Respuesta
          </button>
        </div>
      </div>
    </div>
  );
};
