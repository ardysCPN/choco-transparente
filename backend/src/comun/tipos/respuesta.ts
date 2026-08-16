export type RespuestaApi<T> = {
  exito: boolean;
  mensaje: string;
  datos?: T;
  codigo?: string;
};
