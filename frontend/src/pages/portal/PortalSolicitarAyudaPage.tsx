import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  CheckCircle2,
  Copy,
  Info,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { MunicipioPublico, SolicitudAyudaPublicaPayload } from '../../types/publico.types';
import toast from 'react-hot-toast';

export const PortalSolicitarAyudaPage: React.FC = () => {
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [radicadoExitoso, setRadicadoExitoso] = useState<string | null>(null);

  const [formData, setFormData] = useState<SolicitudAyudaPublicaPayload>({
    municipioId: 1,
    nombreResponsable: '',
    barrio: '',
    direccionAproximada: '',
    cantidadPersonas: 1,
    tipoNecesidad: 'KITS_ALIMENTOS',
    descripcion: '',
    prioridad: 'MEDIA',
    contacto: '',
    evidencia: '',
  });

  useEffect(() => {
    publicoService
      .getMunicipios()
      .then((data) => setMunicipios(data || []))
      .catch((err) => console.error(err));
  }, []);

  const copiarRadicado = () => {
    if (radicadoExitoso) {
      navigator.clipboard.writeText(radicadoExitoso);
      toast.success('¡Código de radicado copiado!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreResponsable || !formData.barrio || !formData.direccionAproximada || !formData.contacto || !formData.descripcion) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await publicoService.registrarSolicitudAyuda(formData);
      setRadicadoExitoso(res.radicado);
      toast.success('¡Solicitud de auxilio radicada con éxito!');
    } catch (err: any) {
      toast.error('Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
          <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
          <span>Atención y Auxilio Humanitario Directo</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Solicitud de Ayuda Humanitaria
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Si tu hogar o comunidad fue afectada por inundaciones, deslizamientos o emergencias en el Chocó, registra aquí tu solicitud para que los equipos de socorro y el CDGRD puedan priorizar la entrega de kits de alimentos, agua y albergue.
        </p>
      </div>

      {radicadoExitoso ? (
        <div className="bg-white border border-rose-300 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-700 border border-rose-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">
              ¡Solicitud Radicada Exitosamente!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Guarda este número de radicado familiar. Puedes presentarlo ante tu líder comunal, corregidor o Alcaldía para consultar el turno de entrega.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl max-w-md mx-auto flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Código de Radicado Familiar</span>
              <span className="font-mono text-xl font-black text-rose-700">{radicadoExitoso}</span>
            </div>
            <button
              onClick={copiarRadicado}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition"
              title="Copiar Radicado"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              setRadicadoExitoso(null);
              setFormData({
                municipioId: 1,
                nombreResponsable: '',
                barrio: '',
                direccionAproximada: '',
                cantidadPersonas: 1,
                tipoNecesidad: 'KITS_ALIMENTOS',
                descripcion: '',
                prioridad: 'MEDIA',
                contacto: '',
                evidencia: '',
              });
            }}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
          >
            Radicar otra solicitud familiar
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Responsable y Contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Jefe de Hogar / Responsable *</label>
                <input
                  type="text"
                  placeholder="Nombre y apellidos"
                  value={formData.nombreResponsable}
                  onChange={(e) => setFormData({ ...formData, nombreResponsable: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono de Contacto *</label>
                <input
                  type="tel"
                  placeholder="300 000 0000"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            </div>

            {/* Municipio y Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Municipio *</label>
                <select
                  value={formData.municipioId}
                  onChange={(e) => setFormData({ ...formData, municipioId: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Barrio / Corregimiento / Vereda *</label>
                <input
                  type="text"
                  placeholder="Sector o Vereda"
                  value={formData.barrio}
                  onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Personas en el Hogar *</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.cantidadPersonas}
                  onChange={(e) => setFormData({ ...formData, cantidadPersonas: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dirección o Referencia de Ubicación *</label>
              <input
                type="text"
                placeholder="Ej: Cerca al muelle comunal / Casa de madera con techo azul"
                value={formData.direccionAproximada}
                onChange={(e) => setFormData({ ...formData, direccionAproximada: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Necesidad Principal *</label>
                <select
                  value={formData.tipoNecesidad}
                  onChange={(e) => setFormData({ ...formData, tipoNecesidad: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="KITS_ALIMENTOS">Kits de Alimentos / Víveres</option>
                  <option value="AGUA_POTABLE">Agua Potable tratada</option>
                  <option value="KITS_ASEO">Kits de Aseo e Higiene</option>
                  <option value="COLCHONETAS_FRAZADAS">Colchonetas y Frazadas</option>
                  <option value="ALBERGUE_TEMPORAL">Cupo en Albergue / Refugio</option>
                  <option value="ATENCION_MEDICA">Atención Médica Urgente</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nivel de Urgencia / Prioridad *</label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica (Riesgo inminente)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Descripción de la Situación *</label>
              <textarea
                rows={3}
                placeholder="Indica si hay niños, adultos mayores, personas enfermas o daños estructurales en la vivienda"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Enlace a Foto o Video de Evidencia (Opcional)</label>
              <input
                type="url"
                placeholder="https://... enlace de foto o video"
                value={formData.evidencia}
                onChange={(e) => setFormData({ ...formData, evidencia: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Protección de Datos:</strong> Tus datos personales y contacto son de uso exclusivo para la coordinación de la entrega humanitaria y nunca serán expuestos en el mapa ni en las consultas públicas.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold transition shadow-xs flex items-center justify-center gap-2"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>{isSubmitting ? 'Radicando...' : 'Radicar Solicitud de Ayuda Familiar'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortalSolicitarAyudaPage;
