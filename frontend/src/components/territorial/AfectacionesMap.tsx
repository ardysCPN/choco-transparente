import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Afectacion, Municipio, CentroAcopio } from '../../types/territorial.types';
import { MapPin, Calendar, Layers } from 'lucide-react';

interface AfectacionesMapProps {
  afectaciones: Afectacion[];
  municipios?: Municipio[];
  centros?: CentroAcopio[];
  onSelectAfectacion?: (afectacion: Afectacion) => void;
}

// Fix para default icons en Leaflet con bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Componente para auto-centrar y forzar el refresco de dimensiones de Leaflet
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Helper universal y robusto para parsear coordenadas (soporta Decimal, string, number y fallback a municipio)
const parseCoords = (
  lat?: any,
  lng?: any,
  fallbackLat?: any,
  fallbackLng?: any
): [number, number] | null => {
  const pLat = parseFloat(String(lat ?? ''));
  const pLng = parseFloat(String(lng ?? ''));
  if (!isNaN(pLat) && !isNaN(pLng) && pLat !== 0 && pLng !== 0) {
    return [pLat, pLng];
  }

  const fLat = parseFloat(String(fallbackLat ?? ''));
  const fLng = parseFloat(String(fallbackLng ?? ''));
  if (!isNaN(fLat) && !isNaN(fLng) && fLat !== 0 && fLng !== 0) {
    return [fLat, fLng];
  }

  return null;
};

// Función creadora de iconos SVG de severidad para Afectaciones
const createSeverityIcon = (severidad: string) => {
  const colors: Record<string, string> = {
    CRITICA: '#dc2626', // Red 600
    ALTA: '#ea580c',     // Orange 600
    MEDIA: '#d97706',    // Amber 600
    BAJA: '#2563eb',     // Blue 600
  };

  const color = colors[severidad] || '#dc2626';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
        font-size: 14px;
        transform: translate(-50%, -50%);
      ">
        ⚠️
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

// Icono para Centros de Acopio
const createCentroIcon = () => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: #059669;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: 2.5px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        transform: translate(-50%, -50%);
      ">
        📦
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export const AfectacionesMap: React.FC<AfectacionesMapProps> = ({
  afectaciones,
  municipios = [],
  centros = [],
}) => {
  const [filterSeveridad, setFilterSeveridad] = useState<string>('TODAS');
  const [selectedMunicipioId, setSelectedMunicipioId] = useState<string>('TODOS');
  const [showCentros, setShowCentros] = useState<boolean>(true);

  const defaultCenter: [number, number] = [5.694722, -76.661111]; // Quibdó, Chocó
  const [center, setCenter] = useState<[number, number]>(defaultCenter);

  // Filtrado de afectaciones
  const filteredAfectaciones = afectaciones.filter((a) => {
    if (filterSeveridad !== 'TODAS' && a.severidad !== filterSeveridad) return false;
    if (selectedMunicipioId !== 'TODOS' && String(a.municipioId) !== selectedMunicipioId) return false;
    return true;
  });

  // Centrar mapa al cambiar de municipio seleccionado
  const handleMunicipioChange = (muniId: string) => {
    setSelectedMunicipioId(muniId);
    if (muniId === 'TODOS') {
      setCenter(defaultCenter);
      return;
    }
    const muni = municipios.find((m) => String(m.id) === muniId);
    if (muni) {
      const coords = parseCoords(muni.latitud, muni.longitud);
      if (coords) setCenter(coords);
    }
  };

  // Contadores rápidos
  const totalCriticas = afectaciones.filter((a) => a.severidad === 'CRITICA').length;
  const totalAltas = afectaciones.filter((a) => a.severidad === 'ALTA').length;
  const totalMedias = afectaciones.filter((a) => a.severidad === 'MEDIA').length;
  const totalBajas = afectaciones.filter((a) => a.severidad === 'BAJA').length;

  return (
    <div className="space-y-4">
      {/* Barra de Controles, Filtros y Leyenda */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Visor Geográfico de Afectaciones en el Chocó
              </h3>
              <p className="text-xs text-slate-500">
                Visualizando <span className="font-bold text-emerald-700">{filteredAfectaciones.length}</span> afectaciones georreferenciadas
              </p>
            </div>
          </div>

          {/* Selector de Municipio para Enfoque Rápido */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedMunicipioId}
              onChange={(e) => handleMunicipioChange(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="TODOS">📍 Todo el Departamento ({municipios.length} Municipios)</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de Severidad y Capas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterSeveridad('TODAS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterSeveridad === 'TODAS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({afectaciones.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeveridad('CRITICA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterSeveridad === 'CRITICA'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Crítica ({totalCriticas})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeveridad('ALTA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterSeveridad === 'ALTA'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              Alta ({totalAltas})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeveridad('MEDIA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterSeveridad === 'MEDIA'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Media ({totalMedias})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeveridad('BAJA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterSeveridad === 'BAJA'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Baja ({totalBajas})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={showCentros}
                onChange={(e) => setShowCentros(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>📦 Ver Centros de Acopio ({centros.length})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Contenedor del Mapa Georreferenciado */}
      <div className="h-[560px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-300 shadow-xl relative z-10 bg-slate-100">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapController center={center} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores de Afectaciones */}
          {filteredAfectaciones.map((afectacion) => {
            const muni = municipios.find((m) => m.id === afectacion.municipioId);
            const coords = parseCoords(
              afectacion.latitud,
              afectacion.longitud,
              muni?.latitud,
              muni?.longitud
            );

            if (!coords) return null;

            return (
              <Marker
                key={`afec-${afectacion.id}`}
                position={coords}
                icon={createSeverityIcon(afectacion.severidad)}
              >
                <Popup className="custom-popup">
                  <div className="p-1 space-y-2 min-w-[240px] max-w-[280px]">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {afectacion.tipo}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          afectacion.severidad === 'CRITICA'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : afectacion.severidad === 'ALTA'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : afectacion.severidad === 'MEDIA'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {afectacion.severidad}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {afectacion.nombre}
                    </h4>

                    {afectacion.municipio && (
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Municipio: <strong className="text-slate-900">{afectacion.municipio.nombre}</strong></span>
                      </p>
                    )}

                    {afectacion.direccion && (
                      <p className="text-[11px] text-slate-500 truncate">
                        📍 {afectacion.direccion}
                      </p>
                    )}

                    {afectacion.descripcion && (
                      <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg line-clamp-3 border border-slate-100 leading-relaxed">
                        {afectacion.descripcion}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {afectacion.fechaInicio ? new Date(afectacion.fechaInicio).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {afectacion.estado}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Marcadores de Centros de Acopio */}
          {showCentros &&
            centros.map((centro) => {
              const muni = municipios.find((m) => m.id === centro.municipioId);
              const coords = parseCoords(
                centro.latitud,
                centro.longitud,
                muni?.latitud,
                muni?.longitud
              );

              if (!coords) return null;

              return (
                <Marker
                  key={`centro-${centro.id}`}
                  position={coords}
                  icon={createCentroIcon()}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 space-y-2 min-w-[220px]">
                      <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-1">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          📦 Centro de Acopio
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                          {centro.estado}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{centro.nombre}</h4>
                      {centro.municipio && (
                        <p className="text-[11px] text-slate-600">
                          Municipio: <strong>{centro.municipio.nombre}</strong>
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500">📍 {centro.direccion}</p>
                      {centro.telefono && (
                        <p className="text-[11px] text-slate-600">📞 {centro.telefono}</p>
                      )}
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
