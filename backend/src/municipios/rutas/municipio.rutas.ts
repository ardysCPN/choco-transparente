import { Router } from 'express';
import { CrearMunicipioSchema, ActualizarMunicipioSchema } from '../dto/municipio.dto.js';
import { MunicipioServicio } from '../servicio/municipio.servicio.js';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new MunicipioServicio();

router.use(autenticarToken);

router.get('/', requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const datos = await servicio.listarMunicipios();
    return responderExito(res, 'Municipios consultados correctamente', datos);
  } catch (error) {
    return responderError(res, 'Error al consultar municipios', 'ERROR_MUNICIPIOS', 500);
  }
});

router.get('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const datos = await servicio.obtenerMunicipio(Number(req.params.id));
    return responderExito(res, 'Municipio consultado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al consultar municipio';
    return responderError(res, mensaje, 'ERROR_MUNICIPIO', 400);
  }
});

router.post('/', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = CrearMunicipioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearMunicipio(resultado.data);
    return responderExito(res, 'Municipio creado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear municipio';
    return responderError(res, mensaje, 'ERROR_CREAR_MUNICIPIO', 400);
  }
});

router.put('/:id', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const resultado = ActualizarMunicipioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.actualizarMunicipio(Number(req.params.id), resultado.data);
    return responderExito(res, 'Municipio actualizado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar municipio';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_MUNICIPIO', 400);
  }
});

export default router;
