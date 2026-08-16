import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus, Edit, Loader2, Save, MapPin } from 'lucide-react';
import { Beneficiario, CrearBeneficiarioInput } from '../../types/beneficiario.types';
import { Municipio } from '../../types/territorial.types';
import { beneficiarioService } from '../../services/beneficiario.service';
import toast from 'react-hot-toast';

interface BeneficiarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  municipios: Municipio[];
  beneficiario?: Beneficiario | null;
}

export const BeneficiarioModal: React.FC<BeneficiarioModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  municipios,
  beneficiario,
}) => {
  const isEditing = !!beneficiario;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CrearBeneficiarioInput>({
    defaultValues: {
      codigoFamilia: '',
      municipioId: municipios[0]?.id || 1,
      barrio: '',
      direccion: '',
      latitud: undefined,
      longitud: undefined,
      cantidadPersonas: 4,
      contacto: '',
      estado: 'ACTIVO',
    },
  });

  useEffect(() => {
    if (beneficiario) {
      reset({
        codigoFamilia: beneficiario.codigoFamilia,
        municipioId: beneficiario.municipioId,
        barrio: beneficiario.barrio || '',
        direccion: beneficiario.direccion || '',
        latitud: beneficiario.latitud || undefined,
        longitud: beneficiario.longitud || undefined,
        cantidadPersonas: beneficiario.cantidadPersonas,
        contacto: beneficiario.contacto || '',
        estado: beneficiario.estado,
      });
    } else {
      reset({
        codigoFamilia: `FAM-CHO-${String(Date.now()).slice(-6)}`,
        municipioId: municipios[0]?.id || 1,
        barrio: '',
        direccion: '',
        cantidadPersonas: 4,
        contacto: '',
        estado: 'ACTIVO',
      });
    }
  }, [beneficiario, municipios, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CrearBeneficiarioInput) => {
    try {
      const payload = {
        ...data,
        municipioId: Number(data.municipioId),
        cantidadPersonas: Number(data.cantidadPersonas),
        latitud: data.latitud ? Number(data.latitud) : undefined,
        longitud: data.longitud ? Number(data.longitud) : undefined,
      };

      if (isEditing && beneficiario) {
        await beneficiarioService.actualizar(beneficiario.id, payload);
        toast.success('Beneficiario actualizado correctamente');
      } else {
        await beneficiarioService.crear(payload);
        toast.success('¡Familia beneficiaria registrada exitosamente!');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al guardar beneficiario');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
              {isEditing ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isEditing ? 'Editar Familia Beneficiaria' : 'Registrar Nueva Familia Beneficiaria'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? `Actualizando: ${beneficiario?.codigoFamilia}`
                  : 'Registro oficial de familias afectadas del Chocó'}
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
                Código de Familia *
              </label>
              <input
                type="text"
                placeholder="FAM-CHO-XXXXX"
                {...register('codigoFamilia', { required: 'El código es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-mono"
              />
              {errors.codigoFamilia && (
                <p className="text-xs text-rose-500 mt-1">{errors.codigoFamilia.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Municipio *
              </label>
              <select
                {...register('municipioId', { required: 'Seleccione un municipio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
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
                Barrio / Comunidad
              </label>
              <input
                type="text"
                placeholder="Ej. Comunidad Wounaan, Sector Rivera"
                {...register('barrio')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Dirección
              </label>
              <input
                type="text"
                placeholder="Ej. Calle Principal, Vereda El Silencio"
                {...register('direccion')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Personas en la Familia *
              </label>
              <input
                type="number"
                min="1"
                max="30"
                placeholder="4"
                {...register('cantidadPersonas', {
                  required: 'La cantidad de personas es obligatoria',
                  min: { value: 1, message: 'Debe ser al menos 1' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
              {errors.cantidadPersonas && (
                <p className="text-xs text-rose-500 mt-1">{errors.cantidadPersonas.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                placeholder="Ej. 321 456 7890"
                {...register('contacto')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-violet-500" /> Latitud
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ej. 5.6947"
                {...register('latitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-violet-500" /> Longitud
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ej. -76.6611"
                {...register('longitud')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Estado del Registro
              </label>
              <select
                {...register('estado')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
              >
                <option value="ACTIVO">Activo (Elegible para ayudas)</option>
                <option value="PENDIENTE">Pendiente (En verificación de campo)</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
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
                <Save className="w-4 h-4" />
              )}
              {isEditing ? 'Guardar Cambios' : 'Registrar Familia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
