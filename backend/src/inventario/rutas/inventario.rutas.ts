import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { RegistrarEntradaSchema, RegistrarSalidaSchema } from '../dto/inventario.dto.js';
import { InventarioServicio } from '../servicio/inventario.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new InventarioServicio();

router.use(autenticarToken);

router.get('/centro/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.listarInventarioPorCentro(BigInt(req.params.id));
    return responderExito(res, 'Inventario consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar inventario';
    return responderError(res, mensaje, 'ERROR_INVENTARIO', 400);
  }
});

router.post('/entradas', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = RegistrarEntradaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.registrarEntrada(resultado.data);
    return responderExito(res, 'Entrada registrada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar entrada';
    return responderError(res, mensaje, 'ERROR_ENTRADA_INVENTARIO', 400);
  }
});

router.post('/salidas', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = RegistrarSalidaSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.registrarSalida(resultado.data);
    return responderExito(res, 'Salida registrada correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar salida';
    return responderError(res, mensaje, 'ERROR_SALIDA_INVENTARIO', 400);
  }
});

export default router;
