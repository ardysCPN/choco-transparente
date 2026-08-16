import { Router } from 'express';
import { CrearAfectacionSchema, ActualizarAfectacionSchema } from '../dto/afectacion.dto.js';
import { AfectacionServicio } from '../servicio/afectacion.servicio.js';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new AfectacionServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarAfectaciones();
    return responderExito(res, 'Afectaciones consultadas correctamente', datos);
  } catch (error) {
    return responderError(res, 'Error al consultar afectaciones', 'ERROR_AFECTACIONES', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerAfectacion(BigInt(req.params.id));
    return responderExito(res, 'Afectación consultada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar afectación';
    return responderError(res, mensaje, 'ERROR_AFECTACION', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearAfectacionSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearAfectacion(resultado.data);
    return responderExito(res, 'Afectación creada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear afectación';
    return responderError(res, mensaje, 'ERROR_CREAR_AFECTACION', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarAfectacionSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarAfectacion(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Afectación actualizada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar afectación';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_AFECTACION', 400);
  }
});

export default router;
