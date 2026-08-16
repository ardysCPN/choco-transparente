import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearBeneficiarioDto, ActualizarBeneficiarioDto } from '../dto/beneficiario.dto.js';

export class BeneficiarioServicio {
  async listarBeneficiarios() {
    return prisma.beneficiario.findMany({
      include: { municipio: true },
      orderBy: { fechaRegistro: 'desc' }
    });
  }

  async crearBeneficiario(datos: CrearBeneficiarioDto) {
    return prisma.beneficiario.create({
      data: {
        codigoFamilia: datos.codigoFamilia,
        municipioId: datos.municipioId,
        barrio: datos.barrio ?? null,
        direccion: datos.direccion ?? null,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        cantidadPersonas: datos.cantidadPersonas,
        contacto: datos.contacto ?? null,
        estado: datos.estado ?? 'ACTIVO'
      },
      include: { municipio: true }
    });
  }

  async obtenerBeneficiario(id: bigint) {
    const beneficiario = await prisma.beneficiario.findUnique({
      where: { id },
      include: { municipio: true }
    });

    if (!beneficiario) {
      throw new ErrorNoEncontrado('Beneficiario no encontrado');
    }

    return beneficiario;
  }

  async actualizarBeneficiario(id: bigint, datos: ActualizarBeneficiarioDto) {
    const beneficiario = await prisma.beneficiario.findUnique({ where: { id } });
    if (!beneficiario) {
      throw new ErrorNoEncontrado('Beneficiario no encontrado');
    }

    return prisma.beneficiario.update({
      where: { id },
      data: {
        ...datos,
        latitud: datos.latitud ?? beneficiario.latitud,
        longitud: datos.longitud ?? beneficiario.longitud
      },
      include: { municipio: true }
    });
  }
}
