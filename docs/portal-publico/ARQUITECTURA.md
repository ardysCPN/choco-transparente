# Arquitectura Técnica — Portal Público v1.0

## 1. Visión General del Sistema

El Portal Público de Chocó Transparente sigue el principio fundamental de **cero duplicación**:
- **Backend Único:** Monolito modular existente en Node.js + Express + TypeScript.
- **Base de Datos Única:** PostgreSQL + PostGIS existente.
- **Frontend SPA / PWA:** React + Vite + TypeScript con TailwindCSS y Leaflet.

```text
┌────────────────────────────────────────────────────────────────┐
│                   Ciudadanos y Donantes                        │
└───────────────────────────────┬────────────────────────────────┘
                                │ HTTPS / PWA
                                ▼
┌────────────────────────────────────────────────────────────────┐
│               Frontend Portal Público (React + Vite)           │
│  - Dashboard Público         - Fichas Municipales (31)         │
│  - Mapa Leaflet + OSM        - Formularios de Participación    │
│  - Caja Transparente         - Service Worker Offline          │
└───────────────────────────────┬────────────────────────────────┘
                                │ REST API JSON
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                Capa Pública Backend (/api/v1/publico/*)        │
│  - Sin JWT para lectura segura                                 │
│  - Validación Zod en capturas                                  │
│  - Zero-Leakage de datos sensibles                             │
└───────────────────────────────┬────────────────────────────────┘
                                │ Prisma ORM
                                ▼
┌────────────────────────────────────────────────────────────────┐
│           PostgreSQL + PostGIS (choco_transparente)            │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes de Frontend

- **`PortalLayout.tsx`:** Contenedor principal con barra de estado superior, barra de navegación adaptable, accesos de emergencia y pie de página con líneas 24/7.
- **`PortalInicioPage.tsx`:** Dashboard ejecutivo con semáforo departamental, KPIs en vivo y cuadrícula de acceso a los 31 municipios.
- **`PortalMapaPage.tsx`:** Mapa interactivo con capas independientes para centros de acopio, albergues, afectaciones y municipios.
- **`publico.service.ts`:** Servicio cliente centralizado que interactúa con `/api/v1/publico/*`.
