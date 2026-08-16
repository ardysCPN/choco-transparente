export const APP_CONFIG = {
  NOMBRE: 'Chocó Transparente',
  SUBTITULO: 'Sistema de Gestión Humanitaria y Transparencia Departamental',
  DEPARTAMENTO: 'Gobernación del Chocó',
  VERSION: '1.0.0',
};

export const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN_MUNICIPAL: 'ADMIN_MUNICIPAL',
  COORDINADOR: 'COORDINADOR',
  AUDITOR: 'AUDITOR',
  VEEDOR: 'VEEDOR',
  ORGANIZACION: 'ORGANIZACION',
  PUBLICO: 'PUBLICO',
} as const;

export const ROL_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  SUPERADMIN: { label: 'Super Administrador', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  ADMIN_MUNICIPAL: { label: 'Admin Municipal', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  COORDINADOR: { label: 'Coordinador Operativo', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  AUDITOR: { label: 'Auditor Técnico', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  VEEDOR: { label: 'Veedor Ciudadano', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  ORGANIZACION: { label: 'Org. Humanitaria', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  PUBLICO: { label: 'Público General', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
};

export interface ModuloNav {
  fase: number;
  nombre: string;
  ruta: string;
  icono: string;
  descripcion: string;
  estado: 'ACTIVO' | 'PROXIMO';
  rolesPermitidos?: string[];
}

export const MODULOS_SISTEMA: ModuloNav[] = [
  {
    fase: 1,
    nombre: 'Dashboard Principal',
    ruta: '/admin/dashboard',
    icono: 'LayoutDashboard',
    descripcion: 'Vista general y métricas del sistema',
    estado: 'ACTIVO',
  },
  {
    fase: 2,
    nombre: 'Gestión Territorial',
    ruta: '/territorial',
    icono: 'MapPin',
    descripcion: 'Municipios, Afectaciones y Centros de Acopio',
    estado: 'ACTIVO',
    rolesPermitidos: [ROLES.SUPERADMIN, ROLES.ADMIN_MUNICIPAL, ROLES.COORDINADOR],
  },
  {
    fase: 3,
    nombre: 'Inventario de Ayudas',
    ruta: '/inventario',
    icono: 'Package',
    descripcion: 'Stock, Entradas, Salidas y Trazabilidad',
    estado: 'ACTIVO',
    rolesPermitidos: [ROLES.SUPERADMIN, ROLES.ADMIN_MUNICIPAL, ROLES.COORDINADOR],
  },
  {
    fase: 4,
    nombre: 'Beneficiarios y Entregas',
    ruta: '/beneficiarios',
    icono: 'Users',
    descripcion: 'Registro de familias, solicitudes y entregas con foto',
    estado: 'ACTIVO',
    rolesPermitidos: [ROLES.SUPERADMIN, ROLES.ADMIN_MUNICIPAL, ROLES.COORDINADOR, ROLES.AUDITOR],
  },
  {
    fase: 5,
    nombre: 'Albergues y Denuncias',
    ruta: '/albergues-denuncias',
    icono: 'Home',
    descripcion: 'Capacidad de albergues y canal de denuncias ciudadanas',
    estado: 'ACTIVO',
    rolesPermitidos: [ROLES.SUPERADMIN, ROLES.ADMIN_MUNICIPAL, ROLES.COORDINADOR, ROLES.AUDITOR, ROLES.VEEDOR],
  },
  {
    fase: 6,
    nombre: 'Donaciones y Finanzas',
    ruta: '/financiero',
    icono: 'DollarSign',
    descripcion: 'Caja transparente, donaciones y gastos auditables',
    estado: 'ACTIVO',
    rolesPermitidos: [ROLES.SUPERADMIN, ROLES.ADMIN_MUNICIPAL, ROLES.COORDINADOR, ROLES.AUDITOR, ROLES.ORGANIZACION, ROLES.VEEDOR],
  },
  {
    fase: 7,
    nombre: 'Reportes y Transparencia',
    ruta: '/reportes',
    icono: 'BarChart3',
    descripcion: 'Dashboards analíticos y sincronización offline',
    estado: 'ACTIVO',
    rolesPermitidos: [ROLES.SUPERADMIN, ROLES.ADMIN_MUNICIPAL, ROLES.COORDINADOR, ROLES.AUDITOR, ROLES.VEEDOR, ROLES.ORGANIZACION],
  },
];
