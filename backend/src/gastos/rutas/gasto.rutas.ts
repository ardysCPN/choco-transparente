import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { CrearGastoSchema, ActualizarGastoSchema, AprobarGastoSchema } from '../dto/gasto.dto.js';
import { GastoServicio } from '../servicio/gasto.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new GastoServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarGastos();
    return responderExito(res, 'Gastos consultados correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar gastos';
    return responderError(res, mensaje, 'ERROR_GASTOS', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerGasto(BigInt(req.params.id));
    return responderExito(res, 'Gasto consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar gasto';
    return responderError(res, mensaje, 'ERROR_GASTO', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const usuarioId = req.usuario?.id ?? 1n;
    const resultado = CrearGastoSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearGasto(resultado.data, usuarioId);
    return responderExito(res, 'Gasto creado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear gasto';
    return responderError(res, mensaje, 'ERROR_CREAR_GASTO', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarGastoSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarGasto(BigInt(req.params.id), resultado.data);
    return responderExito(res, 'Gasto actualizado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar gasto';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_GASTO', 400);
  }
});

router.post('/:id/aprobar', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const usuarioId = req.usuario?.id ?? 1n;
    const resultado = AprobarGastoSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.aprobarGasto(BigInt(req.params.id), resultado.data.accion, usuarioId);
    return responderExito(res, `Gasto ${resultado.data.accion.toLowerCase()}do correctamente`, datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al procesar gasto';
    return responderError(res, mensaje, 'ERROR_APROBAR_GASTO', 400);
  }
});

router.get('/organizacion/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.listarPorOrganizacion(BigInt(req.params.id));
    return responderExito(res, 'Gastos de la organización consultados correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar gastos';
    return responderError(res, mensaje, 'ERROR_GASTOS', 500);
  }
});

export default router;
