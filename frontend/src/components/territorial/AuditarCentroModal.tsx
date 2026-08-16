import React from 'react';
import { useForm } from 'react-hook-form';
import { X, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { CentroAcopio, AuditarCentroAcopioInput } from '../../types/territorial.types';
import { useAuthStore } from '../../store/authStore';
import { territorialService } from '../../services/territorial.service';
import toast from 'react-hot-toast';

interface AuditarCentroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  centro: CentroAcopio | null;
}

export const AuditarCentroModal: React.FC<AuditarCentroModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  centro,
}) => {
  const usuario = useAuthStore((state) => state.usuario);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuditarCentroAcopioInput>({
    defaultValues: {
      decision: 'APROBADO',
      comentario: '',
      fotoEvidencia: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      auditorId: usuario?.id ? String(usuario.id) : '1',
    },
  });

  if (!isOpen || !centro) return null;

  const onSubmit = async (data: AuditarCentroAcopioInput) => {
    try {
      const payload: AuditarCentroAcopioInput = {
        ...data,
        auditorId: usuario?.id ? String(usuario.id) : '1',
      };

      await territorialService.auditarCentroAcopio(centro.id, payload);
      toast.success(`Centro de acopio auditado: ${data.decision}`);
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al auditar centro de acopio');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Auditoría Técnica de Centro</h3>
              <p className="text-xs text-slate-400">{centro.nombre}</p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Decisión de Auditoría *
            </label>
            <select
              {...register('decision', { required: 'La decisión es obligatoria' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="APROBADO">Aprobar Centro (Habilitado para acopio)</option>
              <option value="OBSERVADO">Observado (Requiere adecuaciones menores)</option>
              <option value="RECHAZADO">Rechazado (No cumple condiciones de seguridad)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Concepto Técnico / Comentario *
            </label>
            <textarea
              rows={3}
              placeholder="Describa el estado de ventilación, seguridad perimetral, estanterías, acceso de camiones..."
              {...register('comentario', {
                required: 'El concepto técnico es obligatorio',
                minLength: { value: 5, message: 'Mínimo 5 caracteres' },
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.comentario && (
              <p className="text-xs text-rose-500 mt-1">{errors.comentario.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              URL Evidencia Fotográfica de Inspección *
            </label>
            <input
              type="url"
              placeholder="https://ejemplo.com/inspeccion.jpg"
              {...register('fotoEvidencia', { required: 'La evidencia es obligatoria' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.fotoEvidencia && (
              <p className="text-xs text-rose-500 mt-1">{errors.fotoEvidencia.message}</p>
            )}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-900/20 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Emitir Dictamen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
