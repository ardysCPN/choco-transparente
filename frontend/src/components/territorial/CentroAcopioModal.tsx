import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, Loader2, Save } from 'lucide-react';
import { CentroAcopio, CrearCentroAcopioInput, Municipio } from '../../types/territorial.types';
import { territorialService } from '../../services/territorial.service';
import toast from 'react-hot-toast';

interface CentroAcopioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  municipios: Municipio[];
  centroToEdit?: CentroAcopio | null;
}

export const CentroAcopioModal: React.FC<CentroAcopioModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  municipios,
  centroToEdit,
}) => {
  const isEditing = !!centroToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CrearCentroAcopioInput>({
    values: centroToEdit
      ? {
          municipioId: centroToEdit.municipioId,
          organizacionId: centroToEdit.organizacionId || '1',
          nombre: centroToEdit.nombre,
          direccion: centroToEdit.direccion,
          barrio: centroToEdit.barrio || '',
          responsable: centroToEdit.responsable,
          telefono: centroToEdit.telefono,
          latitud: centroToEdit.latitud || undefined,
          longitud: centroToEdit.longitud || undefined,
          fotoFachada: centroToEdit.fotoFachada || '',
          estado: centroToEdit.estado,
        }
      : {
          municipioId: (municipios[0]?.id || 1),
          organizacionId: '1',
          nombre: '',
          direccion: '',
          barrio: '',
          responsable: '',
          telefono: '',
          estado: 'PENDIENTE',
        },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CrearCentroAcopioInput) => {
    try {
      const payload: CrearCentroAcopioInput = {
        ...data,
        municipioId: Number(data.municipioId),
        organizacionId: String(data.organizacionId || '1'),
        latitud: data.latitud ? Number(data.latitud) : undefined,
        longitud: data.longitud ? Number(data.longitud) : undefined,
      };

      if (isEditing && centroToEdit) {
        await territorialService.actualizarCentroAcopio(centroToEdit.id, payload);
        toast.success('Centro de acopio actualizado correctamente');
      } else {
        await territorialService.crearCentroAcopio(payload);
        toast.success('Solicitud de Centro de Acopio radicada con éxito');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al procesar centro de acopio');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isEditing ? 'Editar Centro de Acopio' : 'Solicitar / Registrar Centro de Acopio'}
              </h3>
              <p className="text-xs text-slate-400">
                Puntos de recepción, almacenamiento y despacho humanitario
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
                Nombre del Centro de Acopio / Bodega *
              </label>
              <input
                type="text"
                placeholder="Ej. Centro de Acopio Principal Quibdó - Coliseo El Jardín"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.nombre && (
                <p className="text-xs text-rose-500 mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Municipio de Ubicación *
              </label>
              <select
                {...register('municipioId', { required: 'El municipio es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {municipios.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} ({m.codigoDane})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Barrio / Sector
              </label>
              <input
                type="text"
                placeholder="Ej. Barrio Kennedy, Sector La Alameda"
                {...register('barrio')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Dirección Completa *
              </label>
              <input
                type="text"
                placeholder="Ej. Carrera 4 # 24-50, frente al parque principal"
                {...register('direccion', { required: 'La dirección es obligatoria' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.direccion && (
                <p className="text-xs text-rose-500 mt-1">{errors.direccion.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Responsable / Encargado *
              </label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez Córdoba"
                {...register('responsable', { required: 'El responsable es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.responsable && (
                <p className="text-xs text-rose-500 mt-1">{errors.responsable.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                placeholder="Ej. 3101234567"
                {...register('telefono', { required: 'El teléfono es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.telefono && (
                <p className="text-xs text-rose-500 mt-1">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Latitud (GPS)
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ej. 5.6947"
                {...register('latitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Longitud (GPS)
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ej. -76.6611"
                {...register('longitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                URL Foto Fachada / Evidencia Inicial
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/foto-fachada.jpg"
                {...register('fotoFachada')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditing ? 'Guardar Cambios' : 'Radicar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
