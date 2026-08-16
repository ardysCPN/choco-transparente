import { Router, type Request, type Response } from 'express';
import { LoginSchema } from '../dto/login.dto.js';
import { AuthServicio } from '../servicio/auth.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';
import { ErrorAplicacion } from '../../comun/errores/errores.js';

const router = Router();
const servicio = new AuthServicio();

const handlerLogin = async (req: Request, res: Response) => {
    try {
        const resultadoValidacion = LoginSchema.safeParse(req.body);

        if (!resultadoValidacion.success) {
            return responderError(
                res,
                resultadoValidacion.error.issues[0]?.message ?? 'Datos de entrada inválidos',
                'VALIDACION',
                400
            );
        }

        const { correo, contrasena } = resultadoValidacion.data;
        const datos = await servicio.iniciarSesion(correo, contrasena);
        return responderExito(res, 'Inicio de sesión correcto', datos);
    } catch (error) {
        if (error instanceof ErrorAplicacion) {
            return responderError(res, error.message, error.codigo, error.estadoHttp);
        }

        return responderError(res, 'Error interno del servidor', 'ERROR_INTERNO', 500);
    }
};

router.post('/iniciar-sesion', handlerLogin);
router.post('/login', handlerLogin);

export default router;
