import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { CrearEntregaAyudaSchema, ActualizarEntregaAyudaSchema } from '../dto/entrega-ayuda.dto.js';
import { EntregaAyudaServicio } from '../servicio/entrega-ayuda.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new EntregaAyudaServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarEntregas();
    return responderExito(res, 'Entregas consultadas correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar entregas';
    return responderError(res, mensaje, 'ERROR_ENTREGAS', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerEntrega(BigInt(req.params.id));
    return responderExito(res, 'Entrega consultada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar entrega';
    return responderError(res, mensaje, 'ERROR_ENTREGA', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearEntregaAyudaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearEntrega(resultado.data);
    return responderExito(res, 'Entrega registrada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar entrega';
    return responderError(res, mensaje, 'ERROR_CREAR_ENTREGA', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarEntregaAyudaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarEntrega(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Entrega actualizada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar entrega';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_ENTREGA', 400);
  }
});

export default router;
