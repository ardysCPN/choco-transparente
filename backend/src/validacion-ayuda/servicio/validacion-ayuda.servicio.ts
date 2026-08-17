import { prisma } from '../../comun/biblioteca/prisma.js';
import type { ConsultarValidacionAyudaDto, RegistrarValidacionAyudaDto } from '../dto/validacion-ayuda.dto.js';

let tablaAsegurada = false;

/**
 * Asegura de forma automática e idempotente que la tabla e índices existan en PostgreSQL
 */
export async function asegurarTablaValidacionAyuda(): Promise<void> {
  if (tablaAsegurada) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.validacion_ayuda (
        id BIGSERIAL PRIMARY KEY,
        numero_identificacion VARCHAR(50) NOT NULL,
        estado VARCHAR(20) NOT NULL DEFAULT 'RECIBIDA',
        organizacion_entregante VARCHAR(255) NOT NULL,
        fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        consentimiento_datos BOOLEAN NOT NULL DEFAULT TRUE
      );
      CREATE INDEX IF NOT EXISTS idx_validacion_ayuda_identificacion 
      ON public.validacion_ayuda (numero_identificacion);
    `);
    tablaAsegurada = true;
  } catch (error) {
    console.warn('Advertencia al verificar estructura de validacion_ayuda:', error);
  }
}

export class ValidacionAyudaServicio {
  /**
   * Consulta si una persona ya registra una ayuda humanitaria entregada
   * Devuelve ÚNICAMENTE la información mínima requerida para proteger la privacidad
   */
  async consultar(datos: ConsultarValidacionAyudaDto) {
    await asegurarTablaValidacionAyuda();
    const docSanitizado = datos.numeroIdentificacion.trim();

    try {
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
    } catch (error: any) {
      // Auto-recuperación si la tabla no existía durante la consulta
      if (error?.message?.includes('does not exist') || error?.code === 'P2021') {
        tablaAsegurada = false;
        await asegurarTablaValidacionAyuda();
        return {
          existe: false,
          numeroIdentificacion: docSanitizado,
        };
      }
      throw error;
    }
  }

  /**
   * Registra una nueva entrega de ayuda
   * Valida previamente que no exista duplicidad para la misma identificación
   */
  async registrar(datos: RegistrarValidacionAyudaDto) {
    await asegurarTablaValidacionAyuda();
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
