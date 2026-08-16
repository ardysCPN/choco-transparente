import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  RefreshCw,
  Info,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import {
  MunicipioPublico,
  CentroAcopioPublico,
  AlberguePublico,
  AfectacionPublica,
} from '../../types/publico.types';

// Fix para icons en Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Helper universal para parsear coordenadas (soporta number, string decimal y null)
const parseCoords = (lat?: number | string | null, lng?: number | string | null): [number, number] | null => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return null;
  const numLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
  const numLng = typeof lng === 'number' ? lng : parseFloat(String(lng));
  if (isNaN(numLat) || isNaN(numLng)) return null;
  return [numLat, numLng];
};

// Componente para redibujar y centrar en Leaflet
const MapController: React.FC<{ selectedCoords?: [number, number] | null }> = ({ selectedCoords }) => {
  const map = useMap();

  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    const t3 = setTimeout(() => map.invalidateSize(), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [map]);

  useEffect(() => {
    if (selectedCoords && selectedCoords[0] && selectedCoords[1]) {
      map.flyTo(selectedCoords, 12, { animate: true, duration: 1.2 });
    }
  }, [selectedCoords, map]);

  return null;
};

// Creador de iconos personalizados
const createMarkerIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-portal-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const PortalMapaPage: React.FC = () => {
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [centros, setCentros] = useState<CentroAcopioPublico[]>([]);
  const [albergues, setAlbergues] = useState<AlberguePublico[]>([]);
  const [afectaciones, setAfectaciones] = useState<AfectacionPublica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  // Estados de capas
  const [verCentros, setVerCentros] = useState(true);
  const [verAlbergues, setVerAlbergues] = useState(true);
  const [verAfectaciones, setVerAfectaciones] = useState(true);
  const [verMunicipios, setVerMunicipios] = useState(true);

  const defaultCenter: [number, number] = [5.694722, -76.661111]; // Quibdó

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [munRes, cenRes, albRes, afeRes] = await Promise.all([
        publicoService.getMunicipios(),
        publicoService.getCentrosAcopio(),
        publicoService.getAlbergues(),
        publicoService.getAfectaciones(),
      ]);
      setMunicipios(munRes || []);
      setCentros(cenRes || []);
      setAlbergues(albRes || []);
      setAfectaciones(afeRes || []);
    } catch (err) {
      console.error('Error al cargar capas del mapa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    if (!id) {
      setSelectedCoords(defaultCenter);
      return;
    }
    const mun = municipios.find((m) => m.id === id);
    if (mun) {
      const coords = parseCoords(mun.latitud, mun.longitud);
      if (coords) setSelectedCoords(coords);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header del Mapa en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Georreferenciación Departamental Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mapa Interactivo de Emergencia y Recursos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Visualización georreferenciada en tiempo real de centros de acopio autorizados, albergues, emergencias y los 31 municipios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            onChange={handleMunicipioChange}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">🗺️ Centrar en un municipio...</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} (Alerta {m.nivelAlerta})
              </option>
            ))}
          </select>

          <button
            onClick={cargarDatos}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            title="Refrescar capas"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Barra de Filtros de Capas */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setVerMunicipios(!verMunicipios)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verMunicipios
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>31 Municipios ({municipios.length})</span>
          </button>

          <button
            onClick={() => setVerCentros(!verCentros)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verCentros
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-300"></span>
            <span>Centros de Acopio ({centros.length})</span>
          </button>

          <button
            onClick={() => setVerAlbergues(!verAlbergues)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verAlbergues
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-300"></span>
            <span>Albergues ({albergues.length})</span>
          </button>

          <button
            onClick={() => setVerAfectaciones(!verAfectaciones)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
              verAfectaciones
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-300"></span>
            <span>Afectaciones ({afectaciones.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Haz clic en un marcador para desplegar los datos públicos</span>
        </div>
      </div>

      {/* Contenedor del Mapa Principal */}
      <div className="h-[620px] w-full rounded-3xl overflow-hidden border border-slate-300 shadow-md relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          style={{ height: '100%', width: '100%', backgroundColor: '#e2e8f0' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController selectedCoords={selectedCoords} />

          {/* Capa 1: 31 Municipios Oficiales */}
          {verMunicipios &&
            municipios.map((mun) => {
              const coords = parseCoords(mun.latitud, mun.longitud);
              if (!coords) return null;
              const pinColor =
                mun.nivelAlerta === 'ROJO'
                  ? '#e11d48'
                  : mun.nivelAlerta === 'AMARILLO'
                  ? '#d97706'
                  : '#059669';
              return (
                <Marker
                  key={`mun-${mun.id}`}
                  position={coords}
                  icon={createMarkerIcon(pinColor, '🏛️')}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                          mun.nivelAlerta === 'ROJO'
                            ? 'bg-rose-600'
                            : mun.nivelAlerta === 'AMARILLO'
                            ? 'bg-amber-600'
                            : 'bg-emerald-600'
                        }`}
                      >
                        Municipio Oficial • Alerta {mun.nivelAlerta}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1">{mun.nombre}</h4>
                      <p className="text-xs text-slate-600">Código DANE: {mun.codigoDane}</p>
                      <div className="text-xs text-slate-700 font-semibold space-y-0.5 pt-1 border-t border-slate-200">
                        <p>⚠️ Afectaciones activas: {mun.afectacionesActivas}</p>
                        <p>🏠 Centros de acopio: {mun.centrosAprobados}</p>
                        <p>🛏️ Albergues disponibles: {mun.alberguesDisponibles}</p>
                      </div>
                      <Link
                        to={`/municipios/${mun.id}`}
                        className="mt-2 block text-center text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-1.5 rounded-lg transition"
                      >
                        Ver Ficha del Municipio →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Capa 2: Centros de Acopio */}
          {verCentros &&
            centros.map((centro) => {
              const coords = parseCoords(centro.latitud, centro.longitud);
              if (!coords) return null;
              return (
                <Marker
                  key={`cen-${centro.id}`}
                  position={coords}
                  icon={createMarkerIcon('#0284c7', '🏠')}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        Centro de Acopio Autorizado
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{centro.nombre}</h4>
                      <p className="text-xs text-slate-600">{centro.direccion}</p>
                      <p className="text-xs font-bold text-slate-700">
                        Municipio: {centro.municipio?.nombre}
                      </p>
                      {centro.telefono && (
                        <p className="text-xs text-slate-500">Teléfono: {centro.telefono}</p>
                      )}
                      <Link
                        to={`/centros-acopio/${centro.id}`}
                        className="mt-2 block text-center text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 py-1.5 rounded-lg transition"
                      >
                        Consultar Detalle y Stock →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Capa 3: Albergues */}
          {verAlbergues &&
            albergues.map((albergue) => {
              const coords = parseCoords(albergue.latitud, albergue.longitud);
              if (!coords) return null;
              return (
                <Marker
                  key={`alb-${albergue.id}`}
                  position={coords}
                  icon={createMarkerIcon('#4f46e5', '🛏️')}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        Albergue Oficial
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{albergue.nombre}</h4>
                      <p className="text-xs text-slate-600">{albergue.municipio?.nombre}</p>
                      <div className="text-xs font-bold text-slate-700 pt-1">
                        Capacidad: {albergue.capacidad} personas
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          albergue.estado === 'DISPONIBLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Estado: {albergue.estado}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Capa 4: Afectaciones */}
          {verAfectaciones &&
            afectaciones.map((afectacion) => {
              const coords = parseCoords(afectacion.latitud, afectacion.longitud);
              if (!coords) return null;
              return (
                <Marker
                  key={`afe-${afectacion.id}`}
                  position={coords}
                  icon={createMarkerIcon('#e11d48', '⚠️')}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-slate-900">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Emergencia / Afectación
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{afectacion.tipo}</h4>
                      <p className="text-xs text-slate-600">{afectacion.municipio?.nombre}</p>
                      <p className="text-xs text-slate-700">{afectacion.descripcion}</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Severidad: {afectacion.severidad}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default PortalMapaPage;
