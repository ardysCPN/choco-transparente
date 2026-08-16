import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, HeartHandshake } from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { MunicipioPublico, VoluntariadoPublicoPayload } from '../../types/publico.types';
import toast from 'react-hot-toast';

export const PortalVoluntariadoPage: React.FC = () => {
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exito, setExito] = useState(false);

  const [formData, setFormData] = useState<VoluntariadoPublicoPayload>({
    nombre: '',
    municipioId: 1,
    telefono: '',
    correo: '',
    tipoApoyo: 'LOGISTICA_KITS',
    disponibilidad: 'FIN_DE_SEMANA',
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
    if (!formData.nombre || !formData.telefono || !formData.correo) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicoService.registrarVoluntario(formData);
      setExito(true);
      toast.success('¡Registro de voluntariado completado con éxito!');
    } catch (err) {
      toast.error('Error al registrar voluntariado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
          <span>Red Departamental de Voluntarios</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Inscripción de Voluntarios por el Chocó
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Súmate con tus manos y tu tiempo para apoyar la recepción de ayudas, armado de paquetes, atención en albergues y brigadas humanitarias.
        </p>
      </div>

      {exito ? (
        <div className="bg-white border border-emerald-300 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            ¡Bienvenido a la Red de Voluntarios!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Hemos recibido tus datos correctamente. El coordinador del centro de acopio de tu municipio te contactará cuando se organice la próxima brigada.
          </p>
          <button
            onClick={() => setExito(false)}
            className="mt-4 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
          >
            Inscribir a otra persona
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                placeholder="Nombre y apellidos"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Municipio de Residencia *</label>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Disponibilidad de Tiempo *</label>
                <select
                  value={formData.disponibilidad}
                  onChange={(e) => setFormData({ ...formData, disponibilidad: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="TIEMPO_COMPLETO">Tiempo Completo</option>
                  <option value="MEDIO_TIEMPO">Medio Tiempo</option>
                  <option value="FIN_DE_SEMANA">Fines de Semana</option>
                  <option value="NOCHES">Horario Nocturno</option>
                  <option value="BAJO_LLAMADO">Bajo Convocatoria Puntual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipo de Apoyo que puedes brindar *</label>
              <select
                value={formData.tipoApoyo}
                onChange={(e) => setFormData({ ...formData, tipoApoyo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="LOGISTICA_KITS">Clasificación y Armado de Paquetes de Ayuda</option>
                <option value="CARGA_DESCARGA">Carga, Descarga y Manejo de Bodega</option>
                <option value="COCINA_COMUNITARIA">Cocina y Alimentación Comunitaria</option>
                <option value="ATENCION_ALBERGUES">Atención y Cuidado en Albergues</option>
                <option value="PRIMEROS_AUXILIOS">Primeros Auxilios y Salud Básica</option>
                <option value="CENSO_TERRENO">Censo y Registro de Familias en Terreno</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Experiencia / Observaciones</label>
              <textarea
                rows={2}
                placeholder="Indica si tienes experiencia previa en voluntariado, primeros auxilios o destrezas específicas"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-xs flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>{isSubmitting ? 'Inscribiendo...' : 'Confirmar Inscripción como Voluntario'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortalVoluntariadoPage;
