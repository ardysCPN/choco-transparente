import { Router } from 'express';
import { CrearUsuarioSchema, ActualizarUsuarioSchema } from '../dto/usuario.dto.js';
import { UsuarioServicio } from '../servicio/usuario.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';

const router = Router();
const servicio = new UsuarioServicio();

router.use(autenticarToken);

router.get('/', async (_req, res) => {
  try {
    const datos = await servicio.listarUsuarios();
    return responderExito(res, 'Usuarios consultados correctamente', datos);
  } catch (error) {
    return responderError(res, 'Error al consultar usuarios', 'ERROR_USUARIOS', 500);
  }
});

router.get('/perfil', async (req, res) => {
  try {
    const usuarioId = req.usuario!.id;
    const datos = await servicio.obtenerUsuarioPorId(usuarioId);
    return responderExito(res, 'Perfil obtenido correctamente', datos);
  } catch (error) {
    if (error instanceof Error) {
      return responderError(res, error.message, 'ERROR_PERFIL', 500);
    }
    return responderError(res, 'Error al consultar perfil', 'ERROR_PERFIL', 500);
  }
});

router.post('/', requerirPermiso('USUARIOS_GESTION'), async (req, res) => {
  try {
    const resultado = CrearUsuarioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const datos = await servicio.crearUsuario(resultado.data);
    return responderExito(res, 'Usuario creado correctamente', datos, );
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear usuario';
    return responderError(res, mensaje, 'ERROR_CREAR_USUARIO', 400);
  }
});

router.put('/:id', requerirPermiso('USUARIOS_GESTION'), async (req, res) => {
  try {
    const resultado = ActualizarUsuarioSchema.safeParse(req.body);
    if (!resultado.success) {
      return responderError(res, resultado.error.issues[0]?.message ?? 'Datos inválidos', 'VALIDACION', 400);
    }

    const id = BigInt(req.params.id);
    const datos = await servicio.actualizarUsuario(id, resultado.data);
    return responderExito(res, 'Usuario actualizado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar usuario';
    return responderError(res, mensaje, 'ERROR_ACTUALIZAR_USUARIO', 400);
  }
});

router.patch('/:id/estado', requerirPermiso('USUARIOS_GESTION'), async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const activo = Boolean(req.body.activo);
    const datos = await servicio.cambiarEstado(id, activo);
    return responderExito(res, 'Estado del usuario actualizado correctamente', datos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cambiar estado';
    return responderError(res, mensaje, 'ERROR_ESTADO_USUARIO', 400);
  }
});

export default router;
