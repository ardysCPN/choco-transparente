export interface RespuestaAPI<T> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  codigo?: string;
}

export type ApiResponse<T> = RespuestaAPI<T>;

export interface ErrorAPI {
  exito: false;
  mensaje: string;
  codigo: string;
}