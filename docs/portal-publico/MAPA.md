# Especificación Técnica del Mapa Interactivo — Portal Público

## 1. Stack Geográfico

- **Biblioteca:** Leaflet 1.9.4 (`react-leaflet`)
- **Proveedor de Mapas Base:** OpenStreetMap (OSM) — Libre de costos de API y de uso abierto
- **Centro Geográfico Predeterminado:** `[5.694722, -76.661111]` (Quibdó, Chocó)
- **Nivel de Zoom Inicial:** `8` (Vista completa departamental)

---

## 2. Capas Georreferenciadas

| Capa | Icono / Color | Datos Mostrados |
|---|---|---|
| **Centros de Acopio** | Círculo Azul (`#0284c7`) | Nombre, dirección pública, municipio y teléfono |
| **Albergues Temporales**| Círculo Índigo (`#6366f1`)| Capacidad, ocupación actual y servicios |
| **Afectaciones Activas**| Círculo Rosa/Rojo (`#e11d48`)| Tipo de emergencia, severidad y descripción |
| **Municipios** | Círculo Verde (`#059669`)| Código DANE, total de afectaciones y centros |

---

## 3. Controles de Usuario

- Zoom interactivo con scroll y botones táctiles.
- Toggles independientes en la barra superior para activar o desactivar capas según el interés del ciudadano.
- Popups informativos responsive adaptados para visualización en teléfonos móviles.
