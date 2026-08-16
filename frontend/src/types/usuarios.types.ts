export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  permisos?: {
    permiso: {
      id: number;
      codigo: string;
      nombre: string;
      descripcion: string;
    };
  }[];
}

export interface Usuario {
  id: string | number;
  rolId: number;
  rol: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  municipioId?: number | null;
  municipio?: {
    id: number;
    nombre: string;
    codigoDane?: string;
  } | null;
  organizacionId?: string | number | null;
  organizacion?: {
    id: string | number;
    nombre: string;
    tipo?: string;
  } | null;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  correo: string;
  telefono?: string | null;
  cargo?: string | null;
  activo: boolean;
  ultimoAcceso?: string | null;
  fechaCreacion?: string;
}

export interface CrearUsuarioInput {
  rolId: number;
  municipioId?: number | null;
  organizacionId?: number | null;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  cargo?: string;
}

export interface ActualizarUsuarioInput {
  rolId?: number;
  municipioId?: number | null;
  organizacionId?: number | null;
  nombre?: string;
  apellido?: string;
  tipoDocumento?: string;
  documento?: string;
  correo?: string;
  contrasena?: string;
  telefono?: string;
  cargo?: string;
}
