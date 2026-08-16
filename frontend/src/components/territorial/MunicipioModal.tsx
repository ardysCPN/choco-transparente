import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Building, Loader2, Save } from 'lucide-react';
import { Municipio, CrearMunicipioInput } from '../../types/territorial.types';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import { territorialService } from '../../services/territorial.service';

interface MunicipioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  municipioToEdit?: Municipio | null;
}

export const MunicipioModal: React.FC<MunicipioModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  municipioToEdit,
}) => {
  const isEditing = !!municipioToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CrearMunicipioInput>({
    values: municipioToEdit
      ? {
          departamentoId: municipioToEdit.departamentoId || 27,
          codigoDane: municipioToEdit.codigoDane,
          nombre: municipioToEdit.nombre,
          latitud: municipioToEdit.latitud || undefined,
          longitud: municipioToEdit.longitud || undefined,
          estado: municipioToEdit.estado ?? true,
        }
      : {
          departamentoId: 27, // Chocó
          codigoDane: '',
          nombre: '',
          estado: true,
        },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CrearMunicipioInput) => {
    try {
      const payload: CrearMunicipioInput = {
        ...data,
        departamentoId: Number(data.departamentoId) || 27,
        latitud: data.latitud ? Number(data.latitud) : undefined,
        longitud: data.longitud ? Number(data.longitud) : undefined,
      };

      if (isEditing && municipioToEdit) {
        await territorialService.actualizarMunicipio(municipioToEdit.id, payload);
        toast.success('Municipio actualizado exitosamente');
      } else {
        await territorialService.crearMunicipio(payload);
        toast.success('Municipio registrado exitosamente');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      handleApiError(error, 'Error al guardar municipio');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isEditing ? 'Editar Municipio' : 'Nuevo Municipio'}
              </h3>
              <p className="text-xs text-slate-400">
                Departamento del Chocó (Código DANE 27)
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nombre del Municipio *
              </label>
              <input
                type="text"
                placeholder="Ej. QUIBDÓ, ISTMINA"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase"
              />
              {errors.nombre && (
                <p className="text-xs text-rose-500 mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Código DANE *
              </label>
              <input
                type="text"
                placeholder="Ej. 27001"
                {...register('codigoDane', {
                  required: 'El código DANE es obligatorio',
                  minLength: { value: 4, message: 'Mínimo 4 caracteres' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.codigoDane && (
                <p className="text-xs text-rose-500 mt-1">{errors.codigoDane.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Latitud
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ej. 5.694722"
                {...register('latitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Longitud
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ej. -76.661111"
                {...register('longitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="estado"
              type="checkbox"
              {...register('estado')}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="estado" className="text-sm font-medium text-slate-700">
              Municipio activo en el sistema
            </label>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditing ? 'Guardar Cambios' : 'Registrar Municipio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
