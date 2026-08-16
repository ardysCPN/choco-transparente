import type { NextFunction, Request, Response } from 'express';
import jwt, { type Secret } from 'jsonwebtoken';
import { configuracion } from '../../configuracion/configuracion.js';
import { ErrorNoAutorizado, ErrorAutenticacion } from '../../comun/errores/errores.js';
import { prisma } from '../../comun/biblioteca/prisma.js';

export type UsuarioAutenticado = {
  id: bigint;
  correo: string;
  rol: string;
  municipioId?: number | null;
  organizacionId?: bigint | null;
};

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export function autenticarToken(req: Request, _res: Response, next: NextFunction) {
  const cabecera = req.headers.authorization;

  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    throw new ErrorAutenticacion('Token no enviado o formato inválido');
  }

  const token = cabecera.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, configuracion.jwtSecreto as Secret) as {
      sub: string;
      correo: string;
      rol: string;
      municipioId?: number | null;
      organizacionId?: bigint | null;
    };

    req.usuario = {
      id: BigInt(payload.sub),
      correo: payload.correo,
      rol: payload.rol,
      municipioId: payload.municipioId ?? null,
      organizacionId: payload.organizacionId ?? null
    } as UsuarioAutenticado;

    next();
  } catch {
    throw new ErrorAutenticacion('Token inválido o expirado');
  }
}

export function requerirPermiso(permisoCodigo: string) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    if (!req.usuario) {
      throw new ErrorAutenticacion('Debe autenticarse para acceder');
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      include: {
        rol: {
          include: {
            permisos: {
              include: {
                permiso: true
              }
            }
          }
        }
      }
    });

    if (!usuario) {
      throw new ErrorNoAutorizado('Usuario no encontrado');
    }

    const permisos = usuario.rol.permisos.map((rolPermiso: any) => rolPermiso.permiso.codigo);

    if (usuario.rol.nombre === 'SUPERADMIN' || permisos.includes(permisoCodigo)) {
      next();
      return;
    }

    throw new ErrorNoAutorizado('No tiene permisos para realizar esta operación');
  };
}
