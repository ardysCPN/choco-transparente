import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Anchor } from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { MunicipioPublico, TransportePublicoPayload } from '../../types/publico.types';
import toast from 'react-hot-toast';

export const PortalTransportePage: React.FC = () => {
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exito, setExito] = useState(false);

  const [formData, setFormData] = useState<TransportePublicoPayload>({
    nombrePropietario: '',
    municipioId: 1,
    telefono: '',
    tipoVehiculo: 'LANCHA_RAPIDA',
    capacidadCargaKg: 500,
    zonasCobertura: 'Río Atrato y afluentes',
    disponibilidad: 'INMEDIATA',
    observaciones: '',
  });

  useEffect(() => {
    publicoService
      .getMunicipios()
      .then((m) => setMunicipios(m || []))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombrePropietario || !formData.telefono || !formData.zonasCobertura) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicoService.registrarTransporte(formData);
      setExito(true);
      toast.success('¡Transporte registrado en la red logística!');
    } catch (err) {
      toast.error('Error al registrar vehículo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
          <Anchor className="w-3.5 h-3.5 text-indigo-700" />
          <span>Red de Transporte Fluvial y Terrestre</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Registro de Apoyo en Transporte
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Pon a disposición tu embarcación, panga o vehículo para transportar suministros de emergencia hacia corregimientos y comunidades ribereñas.
        </p>
      </div>

      {exito ? (
        <div className="bg-white border border-emerald-300 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            ¡Transporte Registrado con Éxito!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Hemos integrado tu medio de transporte a la red de despacho humanitario del Chocó. La mesa logística del CDGRD te contactará para coordinar rutas.
          </p>
          <button
            onClick={() => setExito(false)}
            className="mt-4 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
          >
            Registrar otro vehículo
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre del Propietario / Conductor *</label>
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombrePropietario}
                onChange={(e) => setFormData({ ...formData, nombrePropietario: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="300 000 0000"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Municipio Base *</label>
                <select
                  value={formData.municipioId}
                  onChange={(e) => setFormData({ ...formData, municipioId: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Medio de Transporte *</label>
                <select
                  value={formData.tipoVehiculo}
                  onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="LANCHA_RAPIDA">Lancha Rápida (Fluvial)</option>
                  <option value="BOTE_MOTOR">Bote con Motor Fuera de Borda</option>
                  <option value="CANOA_PANGA">Panga / Bongo de Carga</option>
                  <option value="CAMIONETA_4X4">Camioneta 4x4 (Terrestre)</option>
                  <option value="CAMION_CARGA">Camión de Carga</option>
                  <option value="MOTO_CARGA">Motocarro / Moto</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacidad Estimada (Kg) *</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={formData.capacidadCargaKg}
                  onChange={(e) => setFormData({ ...formData, capacidadCargaKg: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rutas / Zonas de Cobertura *</label>
              <input
                type="text"
                placeholder="Ej: Cuenca del Río San Juan, Quibdó - Medio Atrato, etc."
                value={formData.zonasCobertura}
                onChange={(e) => setFormData({ ...formData, zonasCobertura: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Disponibilidad *</label>
              <select
                value={formData.disponibilidad}
                onChange={(e) => setFormData({ ...formData, disponibilidad: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="INMEDIATA">Disponibilidad Inmediata 24/7</option>
                <option value="FINES_SEMANA">Fines de Semana</option>
                <option value="DIURNA">Solo Jornada Diurna</option>
                <option value="PROGRAMADA">Previa Coordinación</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Observaciones / Detalles del Motor</label>
              <textarea
                rows={2}
                placeholder="Detalles sobre potencia del motor (HP), calado o requisitos de combustible"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold transition shadow-xs flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando...' : 'Vincular Medio de Transporte'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortalTransportePage;
