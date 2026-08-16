import { Router, Request, Response } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import {
  CrearDonacionDineroSchema,
  CrearDonacionEspecieSchema,
  ActualizarDonacionSchema
} from '../dto/donacion.dto.js';
import { DonacionServicio } from '../servicio/donacion.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new DonacionServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarDonaciones();
    return responderExito(res, 'Donaciones consultadas correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar donaciones';
    return responderError(res, mensaje, 'ERROR_DONACIONES', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerDonacion(BigInt(req.params.id));
    return responderExito(res, 'Donación consultada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar donación';
    return responderError(res, mensaje, 'ERROR_DONACION', 400);
  }
});

router.post('/dinero', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearDonacionDineroSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearDonacionDinero(resultado.data);
    return responderExito(res, 'Donación en dinero registrada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar donación';
    return responderError(res, mensaje, 'ERROR_CREAR_DONACION', 400);
  }
});

router.post('/especie', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearDonacionEspecieSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearDonacionEspecie(resultado.data);
    return responderExito(res, 'Donación en especie registrada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar donación';
    return responderError(res, mensaje, 'ERROR_CREAR_DONACION', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarDonacionSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarEstadoDonacion(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Donación actualizada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar donación';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_DONACION', 400);
  }
});

export default router;
