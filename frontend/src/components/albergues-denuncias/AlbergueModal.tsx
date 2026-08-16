import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  MapPin,
  Building,
  Phone,
  User,
  Users,
  Navigation,
  Loader2,
  Check,
  CheckCircle2,
} from 'lucide-react';
import {
  Albergue,
  CrearAlbergueInput,
  ActualizarAlbergueInput,
  EstadoAlbergue,
} from '../../types/albergue-denuncia.types';
import { Municipio } from '../../types/territorial.types';
import toast from 'react-hot-toast';

interface AlbergueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearAlbergueInput | ActualizarAlbergueInput) => Promise<void>;
  albergue?: Albergue | null;
  municipios: Municipio[];
}

interface FormData {
  municipioId: number;
  nombre: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  capacidad: number;
  ocupacion: number;
  responsable: string;
  telefono: string;
  estado: EstadoAlbergue;
}

const SERVICIOS_COMUNES = [
  'Agua Potable',
  'Energía Eléctrica',
  'Cocina Comunitaria',
  'Atención Médica Primaria',
  'Baterías Sanitarias',
  'Área Infantil / Ludoteca',
  'Conectividad / Internet',
  'Kits de Aseo y Frazadas',
  'Seguridad y Vigilancia',
  'Apoyo Psicosocial',
];

export const AlbergueModal: React.FC<AlbergueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  albergue,
  municipios,
}) => {
  const isEditing = !!albergue;
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      municipioId: municipios[0]?.id || 1,
      nombre: '',
      direccion: '',
      capacidad: 50,
      ocupacion: 0,
      responsable: '',
      telefono: '',
      estado: 'DISPONIBLE',
    },
  });

  useEffect(() => {
    if (albergue) {
      setValue('municipioId', albergue.municipioId);
      setValue('nombre', albergue.nombre);
      setValue('direccion', albergue.direccion);
      setValue('latitud', albergue.latitud ? Number(albergue.latitud) : undefined);
      setValue('longitud', albergue.longitud ? Number(albergue.longitud) : undefined);
      setValue('capacidad', albergue.capacidad);
      setValue('ocupacion', albergue.ocupacion || 0);
      setValue('responsable', albergue.responsable);
      setValue('telefono', albergue.telefono);
      setValue('estado', albergue.estado);

      if (albergue.servicios) {
        const splitServicios = albergue.servicios
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        setServiciosSeleccionados(splitServicios);
      } else {
        setServiciosSeleccionados([]);
      }
    } else {
      reset({
        municipioId: municipios[0]?.id || 1,
        nombre: '',
        direccion: '',
        latitud: undefined,
        longitud: undefined,
        capacidad: 50,
        ocupacion: 0,
        responsable: '',
        telefono: '',
        estado: 'DISPONIBLE',
      });
      setServiciosSeleccionados(['Agua Potable', 'Energía Eléctrica', 'Baterías Sanitarias']);
    }
  }, [albergue, setValue, reset, municipios]);

  const toggleServicio = (servicio: string) => {
    setServiciosSeleccionados((prev) =>
      prev.includes(servicio) ? prev.filter((s) => s !== servicio) : [...prev, servicio]
    );
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitud', Number(position.coords.latitude.toFixed(6)));
        setValue('longitud', Number(position.coords.longitude.toFixed(6)));
        setIsGettingLocation(false);
        toast.success('Coordenadas GPS capturadas con éxito');
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error(`Error al obtener ubicación: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onFormSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      municipioId: Number(data.municipioId),
      capacidad: Number(data.capacidad),
      ocupacion: Number(data.ocupacion || 0),
      latitud: data.latitud ? Number(data.latitud) : undefined,
      longitud: data.longitud ? Number(data.longitud) : undefined,
      servicios: serviciosSeleccionados.join(', '),
    };

    await onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Editar Albergue Temporal' : 'Registrar Nuevo Albergue Temporal'}
              </h2>
              <p className="text-xs text-emerald-200">
                Gestión de capacidad, servicios y atención humanitaria
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

        {/* Formulario */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre del Albergue */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nombre del Albergue o Centro de Refugio *
              </label>
              <input
                type="text"
                placeholder="Ej. Albergue Polideportivo El Caraño"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.nombre && (
                <p className="text-xs text-rose-500 mt-1">{errors.nombre.message}</p>
              )}
            </div>

            {/* Municipio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Municipio del Chocó *
              </label>
              <select
                {...register('municipioId', { required: 'Seleccione un municipio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {municipios.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} (DANE {m.codigoDane})
                  </option>
                ))}
              </select>
            </div>

            {/* Estado Operativo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Estado Operativo *
              </label>
              <select
                {...register('estado', { required: 'Seleccione el estado' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium"
              >
                <option value="DISPONIBLE">🟢 DISPONIBLE (Abierto al público)</option>
                <option value="LLENO">🔴 LLENO (Capacidad máxima copada)</option>
                <option value="CERRADO">⚪ CERRADO (Inactivo temporalmente)</option>
              </select>
            </div>

            {/* Dirección */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Dirección / Ubicación Física *
              </label>
              <input
                type="text"
                placeholder="Ej. Carrera 1ra No. 24-50, Barrio Kennedy"
                {...register('direccion', { required: 'La dirección es obligatoria' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.direccion && (
                <p className="text-xs text-rose-500 mt-1">{errors.direccion.message}</p>
              )}
            </div>

            {/* Capacidad Máxima */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Capacidad Máxima (Personas) *
              </label>
              <input
                type="number"
                min="1"
                placeholder="Ej. 120"
                {...register('capacidad', {
                  required: 'Capacidad requerida',
                  min: { value: 1, message: 'Mínimo 1 persona' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.capacidad && (
                <p className="text-xs text-rose-500 mt-1">{errors.capacidad.message}</p>
              )}
            </div>

            {/* Ocupación Actual */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Ocupación Actual (Personas)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ej. 45"
                {...register('ocupacion', {
                  min: { value: 0, message: 'No puede ser negativo' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Nombre del Coordinador / Responsable *
              </label>
              <input
                type="text"
                placeholder="Ej. Carlos Mario Córdoba"
                {...register('responsable', { required: 'Responsable obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.responsable && (
                <p className="text-xs text-rose-500 mt-1">{errors.responsable.message}</p>
              )}
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Teléfono de Emergencia / Contacto *
              </label>
              <input
                type="tel"
                placeholder="Ej. 312 456 7890"
                {...register('telefono', { required: 'Teléfono obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.telefono && (
                <p className="text-xs text-rose-500 mt-1">{errors.telefono.message}</p>
              )}
            </div>

            {/* Geolocalización GPS */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Georreferenciación GPS
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  Capturar GPS Actual
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="5.6947"
                    {...register('latitud')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="-76.6611"
                    {...register('longitud')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Servicios Disponibles (Tags Interactivos) */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Servicios e Infraestructura Disponible en el Albergue
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICIOS_COMUNES.map((servicio) => {
                  const isSelected = serviciosSeleccionados.includes(servicio);
                  return (
                    <button
                      key={servicio}
                      type="button"
                      onClick={() => toggleServicio(servicio)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20 ring-2 ring-emerald-600 ring-offset-1'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      )}
                      {servicio}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
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
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isEditing ? 'Guardar Cambios' : 'Crear Albergue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
