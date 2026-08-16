import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Search, Building } from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { DirectorioMunicipio } from '../../types/publico.types';

export const PortalContactosPage: React.FC = () => {
  const [directorio, setDirectorio] = useState<DirectorioMunicipio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const cargar = async () => {
    setIsLoading(true);
    try {
      const data = await publicoService.getContactos();
      setDirectorio(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtrados = directorio.filter((d) =>
    d.municipio.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.codigoDane.includes(busqueda)
  );

  return (
    <div className="space-y-8 w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-2">
            <Phone className="w-3.5 h-3.5 text-cyan-700" />
            <span>Líneas y Organismos de Socorro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Directorio Institucional de Emergencias
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Teléfonos oficiales, correos y sedes de Alcaldías, Bomberos, Defensa Civil, Cruz Roja y Policía en los 31 municipios.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por municipio..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Líneas Nacionales de Atención Inmediata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 font-black text-lg flex items-center justify-center shrink-0">
            123
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Policía Nacional</div>
            <div className="text-[11px] text-slate-500">Línea Única Nacional</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center shrink-0">
            119
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Bomberos</div>
            <div className="text-[11px] text-slate-500">Rescate e Inundación</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 font-black text-lg flex items-center justify-center shrink-0">
            144
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Defensa Civil</div>
            <div className="text-[11px] text-slate-500">Atención Fluvial</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black text-lg flex items-center justify-center shrink-0">
            132
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Cruz Roja</div>
            <div className="text-[11px] text-slate-500">Primeros Auxilios</div>
          </div>
        </div>
      </div>

      {/* Grid de Contactos por Municipio */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-sm font-medium">
          Cargando directorio telefónico institucional...
        </div>
      ) : filtrados.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-slate-600 font-medium">No se encontraron registros para ese municipio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((m) => (
            <div
              key={m.municipioId}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900">{m.municipio}</h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                  DANE: {m.codigoDane}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {m.contactos.map((c, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{c.entidad}</span>
                    </div>
                    {c.telefono && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-mono font-bold text-slate-800">{c.telefono}</span>
                      </div>
                    )}
                    {c.correo && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{c.correo}</span>
                      </div>
                    )}
                    {c.direccion && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{c.direccion}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalContactosPage;
