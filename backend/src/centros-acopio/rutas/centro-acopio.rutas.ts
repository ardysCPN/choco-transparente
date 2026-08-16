import { Router } from 'express';
import { CrearCentroAcopioSchema, ActualizarCentroAcopioSchema, AuditarCentroAcopioSchema } from '../dto/centro-acopio.dto.js';
import { CentroAcopioServicio } from '../servicio/centro-acopio.servicio.js';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new CentroAcopioServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarCentros();
    return responderExito(res, 'Centros de acopio consultados correctamente', datos);
  } catch (error) {
    return responderError(res, 'Error al consultar centros', 'ERROR_CENTROS', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerCentro(BigInt(req.params.id));
    return responderExito(res, 'Centro consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar centro';
    return responderError(res, mensaje, 'ERROR_CENTRO', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearCentroAcopioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearCentro(resultado.data);
    return responderExito(res, 'Centro de acopio creado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear centro';
    return responderError(res, mensaje, 'ERROR_CREAR_CENTRO', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarCentroAcopioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarCentro(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Centro actualizado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar centro';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_CENTRO', 400);
  }
});

router.post('/:id/auditar', requerirPermiso('CENTROS_AUDITAR'), async (req, res) => {
  try {
    const resultado = AuditarCentroAcopioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.auditarCentro(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Centro auditado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al auditar centro';
    return responderError(res, mensaje, 'ERROR_AUDITAR_CENTRO', 400);
  }
});

export default router;
