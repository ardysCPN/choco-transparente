import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Afectacion } from '../../types/territorial.types';
import { MapPin, Calendar, Layers } from 'lucide-react';

interface AfectacionesMapProps {
  afectaciones: Afectacion[];
  onSelectAfectacion?: (afectacion: Afectacion) => void;
}

// Fix para default icons en Leaflet con bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Función creadora de iconos SVG coloreados según severidad
const createSeverityIcon = (severidad: string) => {
  const colors: Record<string, string> = {
    CRITICA: '#dc2626', // Red 600
    ALTA: '#ea580c',     // Orange 600
    MEDIA: '#d97706',    // Amber 600
    BAJA: '#2563eb',     // Blue 600
  };

  const color = colors[severidad] || '#059669';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        !
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export const AfectacionesMap: React.FC<AfectacionesMapProps> = ({ afectaciones }) => {
  const [filterSeveridad, setFilterSeveridad] = useState<string>('TODAS');

  const defaultCenter: [number, number] = [5.694722, -76.661111]; // Quibdó, Chocó

  const filteredAfectaciones = afectaciones.filter((a) => {
    if (filterSeveridad === 'TODAS') return true;
    return a.severidad === filterSeveridad;
  });

  return (
    <div className="space-y-4">
      {/* Barra de Controles y Leyenda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Visor Geográfico de Afectaciones en el Chocó
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Crítica
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 ml-1"></span> Alta
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 ml-1"></span> Media
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ml-1"></span> Baja
          </div>

          <select
            value={filterSeveridad}
            onChange={(e) => setFilterSeveridad(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODAS">Todas las Severidades</option>
            <option value="CRITICA">Solo Críticas</option>
            <option value="ALTA">Solo Altas</option>
            <option value="MEDIA">Solo Medias</option>
            <option value="BAJA">Solo Bajas</option>
          </select>
        </div>
      </div>

      {/* Contenedor del Mapa */}
      <div className="h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative z-10 bg-slate-100">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredAfectaciones.map((afectacion) => {
            const lat = Number(afectacion.latitud);
            const lng = Number(afectacion.longitud);

            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={afectacion.id}
                position={[lat, lng]}
                icon={createSeverityIcon(afectacion.severidad)}
              >
                <Popup className="custom-popup">
                  <div className="p-1 space-y-2 min-w-[220px]">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {afectacion.tipo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          afectacion.severidad === 'CRITICA'
                            ? 'bg-rose-100 text-rose-700'
                            : afectacion.severidad === 'ALTA'
                            ? 'bg-orange-100 text-orange-700'
                            : afectacion.severidad === 'MEDIA'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
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
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        Municipio: <span className="font-semibold">{afectacion.municipio.nombre}</span>
                      </p>
                    )}

                    {afectacion.direccion && (
                      <p className="text-[11px] text-slate-500 truncate">
                        {afectacion.direccion}
                      </p>
                    )}

                    {afectacion.descripcion && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg line-clamp-2">
                        {afectacion.descripcion}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(afectacion.fechaInicio).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-emerald-600">
                        Estado: {afectacion.estado}
                      </span>
                    </div>
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
