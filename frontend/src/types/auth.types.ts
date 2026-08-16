export type RolNombre =
  | 'SUPERADMIN'
  | 'ADMIN_MUNICIPAL'
  | 'COORDINADOR'
  | 'AUDITOR'
  | 'VEEDOR'
  | 'ORGANIZACION'
  | 'PUBLICO'
  | string;

export interface Usuario {
  id: string | number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolNombre;
  telefono?: string | null;
  documento?: string | null;
  activo?: boolean;
  municipioId?: number | null;
  municipio?: {
    id: number;
    nombre: string;
    codigoDane?: string;
  } | null;
  organizacionId?: string | null;
  organizacion?: {
    id: string;
    nombre: string;
    tipo?: string;
  } | null;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponseData {
  token: string;
  usuario: Usuario;
}

export interface TokenPayload {
  sub: string;
  correo: string;
  rol: RolNombre;
  municipioId?: number | null;
  organizacionId?: string | null;
  iat?: number;
  exp?: number;
}
