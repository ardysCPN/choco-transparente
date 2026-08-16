import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Phone,
  Search,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { CentroAcopioPublico, MunicipioPublico } from '../../types/publico.types';
import toast from 'react-hot-toast';

export const PortalCentrosAcopioPage: React.FC = () => {
  const [centros, setCentros] = useState<CentroAcopioPublico[]>([]);
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalProponer, setModalProponer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulario proponer centro
  const [formPropuesta, setFormPropuesta] = useState({
    municipioId: 1,
    nombre: '',
    barrio: '',
    direccion: '',
    responsable: '',
    telefono: '',
    correo: '',
    fotoFachada: '',
  });

  const cargar = async () => {
    setIsLoading(true);
    try {
      const [cenData, munData] = await Promise.all([
        publicoService.getCentrosAcopio(),
        publicoService.getMunicipios(),
      ]);
      setCentros(cenData || []);
      setMunicipios(munData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleProponerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPropuesta.nombre || !formPropuesta.direccion || !formPropuesta.responsable || !formPropuesta.telefono) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicoService.proponerCentroAcopio(formPropuesta);
      toast.success('¡Propuesta de centro de acopio radicada para auditoría!');
      setModalProponer(false);
      setFormPropuesta({
        municipioId: 1,
        nombre: '',
        barrio: '',
        direccion: '',
        responsable: '',
        telefono: '',
        correo: '',
        fotoFachada: '',
      });
    } catch (err) {
      toast.error('Error al enviar la propuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtrados = centros.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.municipio?.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200 mb-2">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>Puntos de Acopio Auditados y Autorizados</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Centros de Acopio Humanitarios
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Espacios comunitarios e institucionales auditados para la recepción, custodia y despacho de donaciones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setModalProponer(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Proponer Nuevo Centro</span>
          </button>

          <button
            onClick={cargar}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            title="Refrescar centros"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, barrio o municipio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold hidden sm:inline">
          {filtrados.length} centros autorizados
        </span>
      </div>

      {/* Grid de Centros */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-sm font-medium">
          Cargando centros de acopio autorizados...
        </div>
      ) : filtrados.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Building className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-medium">No se encontraron centros de acopio con ese criterio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((centro) => (
            <div
              key={centro.id}
              className="bg-white border border-slate-200/90 hover:border-sky-500/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-600" />
                    <span>Autorizado</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {centro.municipio?.nombre}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  {centro.nombre}
                </h3>

                <p className="text-xs text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{centro.direccion} {centro.barrio ? `(${centro.barrio})` : ''}</span>
                </p>

                {centro.telefono && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{centro.telefono}</span>
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/centros-acopio/${centro.id}`}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>Ver Stock y Vinculación</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Proponer Nuevo Centro */}
      {modalProponer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                <span>Proponer Centro de Acopio</span>
              </h3>
              <button
                onClick={() => setModalProponer(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProponerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Municipio *</label>
                <select
                  value={formPropuesta.municipioId}
                  onChange={(e) => setFormPropuesta({ ...formPropuesta, municipioId: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Espacio / Centro *</label>
                <input
                  type="text"
                  placeholder="Ej: Casa Comunal Barrio El Silencio"
                  value={formPropuesta.nombre}
                  onChange={(e) => setFormPropuesta({ ...formPropuesta, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barrio / Sector *</label>
                  <input
                    type="text"
                    placeholder="Barrio o Vereda"
                    value={formPropuesta.barrio}
                    onChange={(e) => setFormPropuesta({ ...formPropuesta, barrio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dirección Aproximada *</label>
                  <input
                    type="text"
                    placeholder="Calle, Carrera o Referencia"
                    value={formPropuesta.direccion}
                    onChange={(e) => setFormPropuesta({ ...formPropuesta, direccion: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre del Responsable *</label>
                  <input
                    type="text"
                    placeholder="Líder comunitario"
                    value={formPropuesta.responsable}
                    onChange={(e) => setFormPropuesta({ ...formPropuesta, responsable: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono Institucional *</label>
                  <input
                    type="tel"
                    placeholder="300 000 0000"
                    value={formPropuesta.telefono}
                    onChange={(e) => setFormPropuesta({ ...formPropuesta, telefono: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalProponer(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-xs flex items-center gap-2"
                >
                  {isSubmitting ? 'Enviando...' : 'Radicar Propuesta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalCentrosAcopioPage;
