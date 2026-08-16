import React from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertTriangle, Loader2, Save } from 'lucide-react';
import { Afectacion, CrearAfectacionInput, Municipio } from '../../types/territorial.types';
import { useAuthStore } from '../../store/authStore';
import { territorialService } from '../../services/territorial.service';
import toast from 'react-hot-toast';

interface AfectacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  municipios: Municipio[];
  afectacionToEdit?: Afectacion | null;
}

export const AfectacionModal: React.FC<AfectacionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  municipios,
  afectacionToEdit,
}) => {
  const usuario = useAuthStore((state) => state.usuario);
  const isEditing = !!afectacionToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CrearAfectacionInput>({
    values: afectacionToEdit
      ? {
          municipioId: afectacionToEdit.municipioId,
          nombre: afectacionToEdit.nombre,
          descripcion: afectacionToEdit.descripcion || '',
          tipo: afectacionToEdit.tipo,
          severidad: afectacionToEdit.severidad,
          estado: afectacionToEdit.estado,
          latitud: afectacionToEdit.latitud || undefined,
          longitud: afectacionToEdit.longitud || undefined,
          direccion: afectacionToEdit.direccion || '',
          fechaInicio: afectacionToEdit.fechaInicio.split('T')[0],
          creadoPor: afectacionToEdit.creadoPor,
        }
      : {
          municipioId: (municipios[0]?.id || 1),
          nombre: '',
          descripcion: '',
          tipo: 'INUNDACION',
          severidad: 'MEDIA',
          estado: 'ACTIVA',
          fechaInicio: new Date().toISOString().split('T')[0],
          creadoPor: usuario?.id ? String(usuario.id) : '1',
        },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CrearAfectacionInput) => {
    try {
      const payload: CrearAfectacionInput = {
        ...data,
        municipioId: Number(data.municipioId),
        latitud: data.latitud ? Number(data.latitud) : undefined,
        longitud: data.longitud ? Number(data.longitud) : undefined,
        creadoPor: usuario?.id ? String(usuario.id) : '1',
      };

      if (isEditing && afectacionToEdit) {
        await territorialService.actualizarAfectacion(afectacionToEdit.id, payload);
        toast.success('Afectación actualizada correctamente');
      } else {
        await territorialService.crearAfectacion(payload);
        toast.success('Emergencia/Afectación registrada exitosamente');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al guardar afectación');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isEditing ? 'Editar Afectación' : 'Registrar Nueva Afectación'}
              </h3>
              <p className="text-xs text-slate-400">
                Gestión de Emergencias y Desastres Departamental
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
                Título de la Afectación / Evento *
              </label>
              <input
                type="text"
                placeholder="Ej. Desbordamiento del Río Atrato en Barrio El Silencio"
                {...register('nombre', { required: 'El título es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.nombre && (
                <p className="text-xs text-rose-500 mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Municipio Afectado *
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
                Tipo de Evento *
              </label>
              <select
                {...register('tipo', { required: 'El tipo es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="INUNDACION">Inundación / Creciente Súbita</option>
                <option value="DESLIZAMIENTO">Deslizamiento de Tierra</option>
                <option value="VENDAVAL">Vendaval / Tormenta</option>
                <option value="INCENDIO">Incendio Estructural o Forestal</option>
                <option value="DESPLAZAMIENTO">Desplazamiento Forzado</option>
                <option value="OTRO">Otro Evento</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nivel de Severidad *
              </label>
              <select
                {...register('severidad')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="BAJA">Baja - Afectación Menor</option>
                <option value="MEDIA">Media - Requiere Asistencia Local</option>
                <option value="ALTA">Alta - Damnificados y Daño Estructural</option>
                <option value="CRITICA">Crítica - Emergencia Departamental</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Estado Operativo *
              </label>
              <select
                {...register('estado')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="ACTIVA">Activa</option>
                <option value="EN_ATENCION">En Atención</option>
                <option value="CONTROLADA">Controlada</option>
                <option value="CERRADA">Cerrada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Fecha del Suceso *
              </label>
              <input
                type="date"
                {...register('fechaInicio', { required: 'La fecha es obligatoria' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Dirección / Corregimiento / Vereda
              </label>
              <input
                type="text"
                placeholder="Ej. Margen izquierda, Corregimiento Beté"
                {...register('direccion')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
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
                Descripción Detallada y Necesidades Preliminares
              </label>
              <textarea
                rows={3}
                placeholder="Describa familias afectadas estimadas, vías incomunicadas, necesidades de kits de aseo, frazadas o alimentos..."
                {...register('descripcion')}
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
              {isEditing ? 'Guardar Cambios' : 'Registrar Afectación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
