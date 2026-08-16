import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Lock,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { MunicipioPublico, DenunciaPublicaPayload } from '../../types/publico.types';
import toast from 'react-hot-toast';

export const PortalDenunciarPage: React.FC = () => {
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [radicado, setRadicado] = useState<string | null>(null);

  const [formData, setFormData] = useState<DenunciaPublicaPayload>({
    tipo: 'DISTRIBUCION_DESIGUAL',
    municipioId: 1,
    barrio: '',
    descripcion: '',
    evidencia: '',
    denuncianteNombre: '',
    denuncianteContacto: '',
    esAnonima: true,
  });

  useEffect(() => {
    publicoService
      .getMunicipios()
      .then((m) => setMunicipios(m || []))
      .catch((err) => console.error(err));
  }, []);

  const copiarRadicado = () => {
    if (radicado) {
      navigator.clipboard.writeText(radicado);
      toast.success('¡Código de radicado copiado al portapapeles!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.barrio || !formData.descripcion) {
      toast.error('Por favor complete la ubicación y descripción');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await publicoService.registrarDenuncia(formData);
      setRadicado(res.radicado);
      toast.success('¡Reporte ciudadano recibido correctamente!');
    } catch (err) {
      toast.error('Error al registrar la denuncia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
          <span>Canal de Veeduría y Control Social Oficial</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reporte Ciudadano de Irregularidades
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Si observas acaparamiento, proselitismo político con las ayudas, cobros indebidos o desvío de insumos, repórtalo de forma segura.
        </p>
      </div>

      {radicado ? (
        <div className="bg-white border border-amber-300 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">
              Denuncia Radicada Exitosamente
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Guarda tu código de radicado único para consultar el estado de la investigación con la Mesa de Control y Veeduría Departamental.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl max-w-md mx-auto flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Número de Radicado</span>
              <span className="font-mono text-xl font-black text-amber-900">{radicado}</span>
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
              setRadicado(null);
              setFormData({
                tipo: 'DISTRIBUCION_DESIGUAL',
                municipioId: 1,
                barrio: '',
                descripcion: '',
                evidencia: '',
                denuncianteNombre: '',
                denuncianteContacto: '',
                esAnonima: true,
              });
            }}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
          >
            Radicar otro reporte
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Selector Anónimo */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold text-amber-950 block text-xs">Modo 100% Anónimo Activado</span>
                  <span className="text-[11px] text-amber-800">
                    No registraremos tu nombre, teléfono ni datos de identidad.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.esAnonima}
                onChange={(e) => setFormData({ ...formData, esAnonima: e.target.checked })}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipo de Irregularidad *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="DISTRIBUCION_DESIGUAL">Distribución desigual / Favorecimiento</option>
                <option value="COBRO_AYUDAS">Cobro de dinero por paquetes o kits</option>
                <option value="USO_POLITICO">Uso político o proselitismo con las ayudas</option>
                <option value="DESVIO_KITS">Acaparamiento o desvío de insumos</option>
                <option value="MAL_ESTADO">Alimentos o insumos en mal estado / vencidos</option>
                <option value="OTRO">Otra irregularidad</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Municipio de los Hechos *</label>
                <select
                  value={formData.municipioId}
                  onChange={(e) => setFormData({ ...formData, municipioId: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Barrio, Vereda o Lugar *</label>
                <input
                  type="text"
                  placeholder="Sector exacto"
                  value={formData.barrio}
                  onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Descripción Detallada de los Hechos *</label>
              <textarea
                rows={4}
                placeholder="Indica qué ocurrió, cuándo, quiénes están involucrados y cualquier detalle relevante"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Enlace a Evidencia (Opcional)</label>
              <input
                type="url"
                placeholder="https://drive.google.com/... o enlace de fotos/videos"
                value={formData.evidencia}
                onChange={(e) => setFormData({ ...formData, evidencia: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {!formData.esAnonima && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tu Nombre</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={formData.denuncianteNombre}
                    onChange={(e) => setFormData({ ...formData, denuncianteNombre: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tu Teléfono</label>
                  <input
                    type="tel"
                    placeholder="Opcional"
                    value={formData.denuncianteContacto}
                    onChange={(e) => setFormData({ ...formData, denuncianteContacto: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-xs flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSubmitting ? 'Enviando...' : 'Radicar Denuncia Ciudadana'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortalDenunciarPage;
