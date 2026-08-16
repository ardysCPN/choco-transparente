import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Truck, Loader2, Send, Camera } from 'lucide-react';
import { Beneficiario, CrearEntregaInput } from '../../types/beneficiario.types';
import { useAuthStore } from '../../store/authStore';
import { beneficiarioService } from '../../services/beneficiario.service';
import toast from 'react-hot-toast';

interface EntregaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  beneficiarios: Beneficiario[];
}

export const EntregaModal: React.FC<EntregaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  beneficiarios,
}) => {
  const usuario = useAuthStore((state) => state.usuario);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CrearEntregaInput>({
    defaultValues: {
      beneficiarioId: beneficiarios[0]?.id || '',
      cantidad: 5,
      responsableEntrega: usuario?.id || 1,
      evidencia: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
      latitud: 5.6947,
      longitud: -76.6611,
      observaciones: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CrearEntregaInput) => {
    try {
      const payload: CrearEntregaInput = {
        ...data,
        beneficiarioId: Number(data.beneficiarioId),
        cantidad: Number(data.cantidad),
        responsableEntrega: usuario?.id ? Number(usuario.id) : 1,
        latitud: data.latitud ? Number(data.latitud) : undefined,
        longitud: data.longitud ? Number(data.longitud) : undefined,
      };

      await beneficiarioService.crearEntrega(payload);
      toast.success('¡Entrega de ayuda registrada con evidencia fotográfica!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al registrar la entrega');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Registrar Entrega de Ayuda Humanitaria</h3>
              <p className="text-xs text-slate-400">
                Con evidencia fotográfica y georreferenciación obligatoria
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Familia Beneficiaria *
              </label>
              <select
                {...register('beneficiarioId', { required: 'Seleccione la familia' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                {beneficiarios
                  .filter((b) => b.estado === 'ACTIVO')
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.codigoFamilia} — {b.municipio?.nombre || 'Chocó'} ({b.cantidadPersonas}{' '}
                      personas)
                    </option>
                  ))}
              </select>
              {errors.beneficiarioId && (
                <p className="text-xs text-rose-500 mt-1">{errors.beneficiarioId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Cantidad de Kits / Unidades *
              </label>
              <input
                type="number"
                min="1"
                placeholder="5"
                {...register('cantidad', {
                  required: 'La cantidad es obligatoria',
                  min: { value: 1, message: 'Mínimo 1' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.cantidad && (
                <p className="text-xs text-rose-500 mt-1">{errors.cantidad.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Latitud (GPS)
              </label>
              <input
                type="number"
                step="any"
                placeholder="5.6947"
                {...register('latitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Longitud (GPS)
              </label>
              <input
                type="number"
                step="any"
                placeholder="-76.6611"
                {...register('longitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-teal-600" />
                URL de Evidencia Fotográfica (Obligatoria) *
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/foto-entrega.jpg"
                {...register('evidencia', {
                  required: 'La evidencia fotográfica es obligatoria para transparencia',
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.evidencia && (
                <p className="text-xs text-rose-500 mt-1">{errors.evidencia.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Observaciones
              </label>
              <textarea
                rows={3}
                placeholder="Entrega realizada en la comunidad ribereña, se verificó identidad del jefe de hogar..."
                {...register('observaciones')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-900/20 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Registrar Entrega con Evidencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
