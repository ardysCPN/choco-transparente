import type { Response } from 'express';
import type { RespuestaApi } from '../tipos/respuesta.js';

export function responderExito<T>(res: Response, mensaje: string, datos?: T) {
  const respuesta: RespuestaApi<T> = {
    exito: true,
    mensaje,
    datos
  };

  return res.status(200).json(respuesta);
}

export function responderError(
  res: Response,
  mensaje: string,
  codigo: string,
  estadoHttp = 400
) {
  return res.status(estadoHttp).json({
    exito: false,
    mensaje,
    codigo
  });
}
