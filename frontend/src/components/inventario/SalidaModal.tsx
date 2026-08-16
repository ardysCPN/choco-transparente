import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, PackageMinus, Loader2, Send } from 'lucide-react';
import { CentroAcopio, Municipio } from '../../types/territorial.types';
import { RegistrarSalidaInput, ItemInventario } from '../../types/inventario.types';
import { useAuthStore } from '../../store/authStore';
import { inventarioService } from '../../services/inventario.service';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';

interface SalidaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  centros: CentroAcopio[];
  municipios: Municipio[];
}

export const SalidaModal: React.FC<SalidaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  centros,
  municipios,
}) => {
  const usuario = useAuthStore((state) => state.usuario);
  const [selectedCentroId, setSelectedCentroId] = useState<string>(
    centros[0]?.id ? String(centros[0].id) : '1'
  );
  const [centroInventario, setCentroInventario] = useState<ItemInventario[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>('KIT_ALIMENTOS');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrarSalidaInput>({
    defaultValues: {
      centroAcopioId: centros[0]?.id ? String(centros[0].id) : '1',
      tipoAyuda: 'KIT_ALIMENTOS',
      cantidad: 20,
      peso: 300,
      municipioId: municipios[0]?.id || 1,
      barrio: 'Comunidad Indígena / Ribereña',
      fotoEntrega: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
      usuarioId: usuario?.id ? String(usuario.id) : '1',
    },
  });

  // Cargar inventario del centro seleccionado para conocer existencias
  useEffect(() => {
    if (selectedCentroId) {
      inventarioService
        .listarPorCentro(selectedCentroId)
        .then((res) => {
          if (res.exito && res.datos) {
            setCentroInventario(res.datos);
          }
        })
        .catch(() => {});
    }
  }, [selectedCentroId]);

  if (!isOpen) return null;

  const currentStockItem = centroInventario.find((i) => i.tipoAyuda === selectedTipo);
  const stockDisponible = currentStockItem ? Number(currentStockItem.cantidadActual) : 0;

  const onSubmit = async (data: RegistrarSalidaInput) => {
    if (stockDisponible > 0 && Number(data.cantidad) > stockDisponible) {
      toast.error(`Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles.`);
      return;
    }

    try {
      const payload: RegistrarSalidaInput = {
        ...data,
        centroAcopioId: String(data.centroAcopioId),
        municipioId: Number(data.municipioId),
        cantidad: Number(data.cantidad),
        peso: data.peso ? Number(data.peso) : undefined,
        usuarioId: usuario?.id ? String(usuario.id) : '1',
      };

      await inventarioService.registrarSalida(payload);
      toast.success('¡Despacho de ayudas registrado correctamente!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      handleApiError(error, 'Error al registrar salida de inventario');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <PackageMinus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Registrar Despacho / Salida de Ayudas</h3>
              <p className="text-xs text-slate-400">
                Distribución a comunidades afectadas con evidencia
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
                Centro de Acopio Origen *
              </label>
              <select
                {...register('centroAcopioId', { required: 'Seleccione un centro' })}
                value={selectedCentroId}
                onChange={(e) => {
                  setSelectedCentroId(e.target.value);
                  setValue('centroAcopioId', e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
              >
                {centros.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} ({c.municipio?.nombre || 'Chocó'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Tipo de Ayuda a Despachar *
              </label>
              <select
                {...register('tipoAyuda', { required: 'Seleccione el tipo de ayuda' })}
                value={selectedTipo}
                onChange={(e) => {
                  setSelectedTipo(e.target.value);
                  setValue('tipoAyuda', e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
              >
                <option value="KIT_ALIMENTOS">Kits de Alimentos (No perecederos)</option>
                <option value="KIT_ASEO">Kits de Aseo Familiar</option>
                <option value="KIT_COCINA">Kits de Cocina y Menaje</option>
                <option value="FRAZADAS_COLCHONETAS">Frazadas / Colchonetas / Sábanas</option>
                <option value="AGUA_POTABLE">Agua Potable (Garrafas / Bidones)</option>
                <option value="MEDICAMENTOS_PRIMEROS_AUXILIOS">Medicamentos y Primeros Auxilios</option>
                <option value="HERRAMIENTAS_REPARACION">Herramientas y Tejas</option>
                <option value="CARPAS_REFUGIO">Carpas y Refugio</option>
              </select>

              {/* Indicador reactivo de existencias */}
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Stock disponible:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {stockDisponible} unidades
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Cantidad a Despachar *
              </label>
              <input
                type="number"
                min="1"
                placeholder="Ej. 50"
                {...register('cantidad', {
                  required: 'La cantidad es obligatoria',
                  min: { value: 1, message: 'Debe ser al menos 1' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              {errors.cantidad && (
                <p className="text-xs text-rose-500 mt-1">{errors.cantidad.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Municipio Destino *
              </label>
              <select
                {...register('municipioId', { required: 'Seleccione el municipio destino' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
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
                Barrio / Vereda / Comunidad
              </label>
              <input
                type="text"
                placeholder="Ej. Comunidad Wounaan, Sector Boca de Nemota"
                {...register('barrio')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                URL Foto de Entrega / Despacho (Evidencia Obligatoria) *
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/foto-entrega.jpg"
                {...register('fotoEntrega', { required: 'La evidencia fotográfica es obligatoria' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              {errors.fotoEntrega && (
                <p className="text-xs text-rose-500 mt-1">{errors.fotoEntrega.message}</p>
              )}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-900/20 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Registrar Despacho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
