import { prisma } from '../../comun/biblioteca/prisma.js';
import type { ConsultarValidacionAyudaDto, RegistrarValidacionAyudaDto } from '../dto/validacion-ayuda.dto.js';

export class ValidacionAyudaServicio {
  /**
   * Consulta si una persona ya registra una ayuda humanitaria entregada
   * Devuelve ÚNICAMENTE la información mínima requerida para proteger la privacidad
   */
  async consultar(datos: ConsultarValidacionAyudaDto) {
    const docSanitizado = datos.numeroIdentificacion.trim();

    const registro = await (prisma as any).validacionAyuda.findFirst({
      where: {
        numeroIdentificacion: docSanitizado,
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });

    if (registro) {
      return {
        existe: true,
        estado: registro.estado,
        fechaRegistro: registro.fechaRegistro,
        organizacionEntregante: registro.organizacionEntregante,
      };
    }

    return {
      existe: false,
      numeroIdentificacion: docSanitizado,
    };
  }

  /**
   * Registra una nueva entrega de ayuda
   * Valida previamente que no exista duplicidad para la misma identificación
   */
  async registrar(datos: RegistrarValidacionAyudaDto) {
    const docSanitizado = datos.numeroIdentificacion.trim();
    const orgSanitizada = datos.organizacionEntregante.trim();

    // 1. Verificación estricta de duplicados
    const existente = await (prisma as any).validacionAyuda.findFirst({
      where: {
        numeroIdentificacion: docSanitizado,
        estado: 'RECIBIDA',
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });

    if (existente) {
      return {
        yaRegistrado: true,
        estado: existente.estado,
        fechaRegistro: existente.fechaRegistro,
        organizacionEntregante: existente.organizacionEntregante,
        mensaje: 'Esta persona ya registra una ayuda recibida.',
      };
    }

    // 2. Creación del nuevo registro
    const nuevo = await (prisma as any).validacionAyuda.create({
      data: {
        numeroIdentificacion: docSanitizado,
        organizacionEntregante: orgSanitizada,
        estado: 'RECIBIDA',
        consentimientoDatos: Boolean(datos.consentimientoDatos),
        fechaRegistro: new Date(),
      },
    });

    return {
      yaRegistrado: false,
      estado: nuevo.estado,
      fechaRegistro: nuevo.fechaRegistro,
      organizacionEntregante: nuevo.organizacionEntregante,
      mensaje: 'Ayuda registrada correctamente.',
    };
  }
}
