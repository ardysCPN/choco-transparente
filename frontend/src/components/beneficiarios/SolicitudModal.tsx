import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, FileText, Loader2, Send } from 'lucide-react';
import { Beneficiario, CrearSolicitudInput, SolicitudAyuda } from '../../types/beneficiario.types';
import { Afectacion } from '../../types/territorial.types';
import { beneficiarioService } from '../../services/beneficiario.service';
import toast from 'react-hot-toast';

interface SolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  beneficiarios: Beneficiario[];
  afectaciones: Afectacion[];
  solicitud?: SolicitudAyuda | null;
}

export const SolicitudModal: React.FC<SolicitudModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  beneficiarios,
  afectaciones,
  solicitud,
}) => {
  const isEditing = !!solicitud;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CrearSolicitudInput>({
    defaultValues: {
      beneficiarioId: '',
      afectacionId: '',
      tipoNecesidad: 'KIT_ALIMENTOS',
      prioridad: 'MEDIA',
      descripcion: '',
      cantidadSolicitada: 5,
      evidencia: '',
      estado: 'PENDIENTE',
    },
  });

  useEffect(() => {
    if (solicitud) {
      reset({
        beneficiarioId: solicitud.beneficiarioId,
        afectacionId: solicitud.afectacionId,
        tipoNecesidad: solicitud.tipoNecesidad,
        prioridad: solicitud.prioridad,
        descripcion: solicitud.descripcion || '',
        cantidadSolicitada: Number(solicitud.cantidadSolicitada),
        evidencia: solicitud.evidencia || '',
        estado: solicitud.estado,
      });
    } else {
      reset({
        beneficiarioId: beneficiarios[0]?.id || '',
        afectacionId: afectaciones[0]?.id || '',
        tipoNecesidad: 'KIT_ALIMENTOS',
        prioridad: 'MEDIA',
        descripcion: '',
        cantidadSolicitada: 5,
        evidencia: '',
        estado: 'PENDIENTE',
      });
    }
  }, [solicitud, beneficiarios, afectaciones, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CrearSolicitudInput) => {
    try {
      const payload = {
        ...data,
        beneficiarioId: Number(data.beneficiarioId),
        afectacionId: Number(data.afectacionId),
        cantidadSolicitada: Number(data.cantidadSolicitada),
      };

      if (isEditing && solicitud) {
        await beneficiarioService.actualizarSolicitud(solicitud.id, payload);
        toast.success('Solicitud actualizada correctamente');
      } else {
        await beneficiarioService.crearSolicitud(payload);
        toast.success('¡Solicitud de ayuda creada exitosamente!');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al procesar la solicitud');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isEditing ? 'Actualizar Solicitud de Ayuda' : 'Nueva Solicitud de Ayuda'}
              </h3>
              <p className="text-xs text-slate-400">
                Vincular necesidad humanitaria con familia y afectación
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Familia Beneficiaria *
              </label>
              <select
                {...register('beneficiarioId', { required: 'Seleccione la familia' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
              >
                {beneficiarios.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.codigoFamilia} — {b.municipio?.nombre || 'Chocó'} ({b.cantidadPersonas} personas)
                  </option>
                ))}
              </select>
              {errors.beneficiarioId && (
                <p className="text-xs text-rose-500 mt-1">{errors.beneficiarioId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Afectación / Emergencia *
              </label>
              <select
                {...register('afectacionId', { required: 'Seleccione la afectación' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
              >
                {afectaciones.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre || a.tipo} — {a.municipio?.nombre || ''} ({a.severidad})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Tipo de Necesidad *
              </label>
              <select
                {...register('tipoNecesidad', { required: 'Seleccione el tipo' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
              >
                <option value="KIT_ALIMENTOS">Kits de Alimentos</option>
                <option value="KIT_ASEO">Kits de Aseo Familiar</option>
                <option value="KIT_COCINA">Kits de Cocina y Menaje</option>
                <option value="FRAZADAS_COLCHONETAS">Frazadas y Colchonetas</option>
                <option value="AGUA_POTABLE">Agua Potable</option>
                <option value="MEDICAMENTOS">Medicamentos y Primeros Auxilios</option>
                <option value="HERRAMIENTAS">Herramientas de Reparación</option>
                <option value="CARPAS">Carpas y Refugio Temporal</option>
                <option value="TRANSPORTE">Transporte y Evacuación</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Prioridad
              </label>
              <select
                {...register('prioridad')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
              >
                <option value="BAJA">🔵 Baja</option>
                <option value="MEDIA">🟡 Media</option>
                <option value="ALTA">🟠 Alta</option>
                <option value="URGENTE">🔴 Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Cantidad Solicitada *
              </label>
              <input
                type="number"
                min="1"
                placeholder="5"
                {...register('cantidadSolicitada', {
                  required: 'La cantidad es obligatoria',
                  min: { value: 1, message: 'Mínimo 1' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
              {errors.cantidadSolicitada && (
                <p className="text-xs text-rose-500 mt-1">{errors.cantidadSolicitada.message}</p>
              )}
            </div>

            {isEditing && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Estado de la Solicitud
                </label>
                <select
                  {...register('estado')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="APROBADA">Aprobada</option>
                  <option value="ATENDIDA">Atendida</option>
                  <option value="RECHAZADA">Rechazada</option>
                </select>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Descripción / Justificación
              </label>
              <textarea
                rows={3}
                placeholder="Describa la situación de necesidad: familias damnificadas por inundación requieren kits de emergencia..."
                {...register('descripcion')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                URL de Evidencia Fotográfica
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/evidencia.jpg"
                {...register('evidencia')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md shadow-violet-900/20 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isEditing ? 'Actualizar Solicitud' : 'Crear Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
