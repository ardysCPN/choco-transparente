import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorAutenticacion, ErrorNoEncontrado } from '../../comun/errores/errores.js';
import { configuracion } from '../../configuracion/configuracion.js';

export type TokenPayload = {
    sub: string;
    correo: string;
    rol: string;
    municipioId?: number | null;
    organizacionId?: string | null;
};

export class AuthServicio {
    async iniciarSesion(correo: string, contrasena: string) {
        const usuario = await prisma.usuario.findUnique({
            where: { correo },
            include: {
                rol: true,
                municipio: true,
                organizacion: true
            }
        });

        if (!usuario || !usuario.activo) {
            throw new ErrorAutenticacion('Usuario o contraseña inválidos');
        }

        const passwordValida = await bcrypt.compare(contrasena, usuario.contrasenaHash);
        if (!passwordValida) {
            throw new ErrorAutenticacion('Usuario o contraseña inválidos');
        }

        const payload: TokenPayload = {
            sub: usuario.id.toString(),
            correo: usuario.correo,
            rol: usuario.rol.nombre,
            municipioId: usuario.municipioId,
            organizacionId: usuario.organizacionId ? usuario.organizacionId.toString() : null
        };

        const token = jwt.sign(payload, configuracion.jwtSecreto as jwt.Secret, {
            expiresIn: configuracion.jwtTiempoExpiracion as jwt.SignOptions['expiresIn']
        });

        return {
            token,
            usuario: {
                id: usuario.id.toString(),
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                rol: usuario.rol.nombre,
                municipioId: usuario.municipioId,
                organizacionId: usuario.organizacionId ? usuario.organizacionId.toString() : null
            }
        };
    }

    async obtenerPerfil(usuarioId: bigint) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                rol: true,
                municipio: true,
                organizacion: true
            }
        });

        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario no encontrado');
        }

        return {
            id: usuario.id.toString(),
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            telefono: usuario.telefono,
            documento: usuario.documento,
            activo: usuario.activo,
            rol: usuario.rol.nombre,
            municipio: usuario.municipio,
            organizacion: usuario.organizacion
                ? {
                    ...usuario.organizacion,
                    id: usuario.organizacion.id.toString() // <-- Convertido a string
                }
                : null
        };
    }
}