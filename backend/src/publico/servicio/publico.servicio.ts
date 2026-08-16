import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import { DashboardServicio } from '../../dashboards/servicio/dashboard.servicio.js';
import type {
  SolicitudAyudaPublicaDto,
  ProponerCentroAcopioDto,
  DonacionPublicaDto,
  VoluntariadoPublicoDto,
  TransportePublicoDto,
  DenunciaPublicaDto,
  VinculacionCentroDto,
} from '../dto/publico.dto.js';

export class PublicoServicio {
  private dashboardServicio = new DashboardServicio();

  async dashboard() {
    return this.dashboardServicio.dashboardPublico();
  }

  async listarMunicipios() {
    const municipios = await prisma.municipio.findMany({
      where: { estado: true },
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: {
            afectaciones: { where: { estado: { in: ['ACTIVA', 'EN_ATENCION'] } } },
            centroAcopio: { where: { estado: 'APROBADO' } },
            albergues: { where: { estado: { in: ['DISPONIBLE', 'CASI_LLENO'] } } },
          },
        },
      },
    });

    return municipios.map((m) => {
      let nivelAlerta: 'VERDE' | 'AMARILLO' | 'ROJO' = 'VERDE';
      if (m._count.afectaciones >= 3) {
        nivelAlerta = 'ROJO';
      } else if (m._count.afectaciones > 0) {
        nivelAlerta = 'AMARILLO';
      }

      return {
        id: m.id,
        codigoDane: m.codigoDane,
        nombre: m.nombre,
        latitud: m.latitud,
        longitud: m.longitud,
        nivelAlerta,
        afectacionesActivas: m._count.afectaciones,
        centrosAprobados: m._count.centroAcopio,
        alberguesDisponibles: m._count.albergues,
      };
    });
  }

  async obtenerMunicipio(id: number) {
    const municipio = await prisma.municipio.findUnique({
      where: { id },
      include: {
        afectaciones: {
          where: { estado: { in: ['ACTIVA', 'EN_ATENCION'] } },
          select: {
            id: true,
            nombre: true,
            tipo: true,
            severidad: true,
            estado: true,
            direccion: true,
            fechaInicio: true,
          },
        },
        centroAcopio: {
          where: { estado: 'APROBADO' },
          select: {
            id: true,
            nombre: true,
            direccion: true,
            barrio: true,
            telefono: true,
            responsable: true,
            latitud: true,
            longitud: true,
            fotoFachada: true,
          },
        },
        albergues: {
          where: { estado: { not: 'CERRADO' } },
          select: {
            id: true,
            nombre: true,
            direccion: true,
            capacidad: true,
            ocupacion: true,
            servicios: true,
            estado: true,
          },
        },
      },
    });

    if (!municipio) {
      throw new ErrorNoEncontrado('Municipio no encontrado');
    }

    return municipio;
  }

  async listarCentrosAcopio() {
    return prisma.centroAcopio.findMany({
      where: { estado: 'APROBADO' },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        barrio: true,
        telefono: true,
        responsable: true,
        latitud: true,
        longitud: true,
        fotoFachada: true,
        estado: true,
        fechaAprobacion: true,
        municipio: {
          select: {
            id: true,
            nombre: true,
            codigoDane: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async obtenerCentroAcopio(id: bigint) {
    const centro = await prisma.centroAcopio.findFirst({
      where: { id, estado: 'APROBADO' },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        barrio: true,
        telefono: true,
        responsable: true,
        latitud: true,
        longitud: true,
        fotoFachada: true,
        estado: true,
        fechaAprobacion: true,
        municipio: {
          select: {
            id: true,
            nombre: true,
            codigoDane: true,
          },
        },
        inventarios: {
          select: {
            tipoAyuda: true,
            cantidadActual: true,
            pesoActual: true,
            unidadMedida: true,
            fechaActualizacion: true,
          },
        },
      },
    });

    if (!centro) {
      throw new ErrorNoEncontrado('Centro de acopio no encontrado o pendiente de aprobación');
    }

    return centro;
  }

  async inventarioConsolidado() {
    const inventarios = await prisma.inventario.groupBy({
      by: ['tipoAyuda'],
      _sum: {
        cantidadActual: true,
        pesoActual: true,
      },
    });

    return inventarios.map((inv) => ({
      tipoAyuda: inv.tipoAyuda,
      totalUnidades: Number(inv._sum.cantidadActual ?? 0),
      totalPesoKg: Number(inv._sum.pesoActual ?? 0),
    }));
  }

  async listarAlbergues() {
    return prisma.albergue.findMany({
      where: { estado: { not: 'CERRADO' } },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        capacidad: true,
        ocupacion: true,
        servicios: true,
        estado: true,
        latitud: true,
        longitud: true,
        municipio: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async listarAfectaciones() {
    return prisma.afectacion.findMany({
      where: { estado: { in: ['ACTIVA', 'EN_ATENCION'] } },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        tipo: true,
        severidad: true,
        estado: true,
        direccion: true,
        latitud: true,
        longitud: true,
        fechaInicio: true,
        municipio: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  async directorioContactos() {
    const municipios = await prisma.municipio.findMany({
      where: { estado: true },
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, codigoDane: true },
    });

    return municipios.map((m) => ({
      municipioId: m.id,
      municipio: m.nombre,
      codigoDane: m.codigoDane,
      contactos: [
        {
          entidad: `Alcaldía Municipal de ${m.nombre}`,
          tipo: 'ALCALDIA',
          telefono: '(+57) 604 671 0000',
          correo: `contacto@${m.nombre.toLowerCase().replace(/\s+/g, '')}.gov.co`,
          direccion: 'Palacio Municipal - Parque Principal',
          horario: 'Lunes a Viernes 8:00 AM - 4:00 PM',
        },
        {
          entidad: 'Consejo Municipal para la Gestión del Riesgo (CMGRD)',
          tipo: 'GESTION_RIESGO',
          telefono: '(+57) 310 000 0000',
          correo: `gestionriesgo@${m.nombre.toLowerCase().replace(/\s+/g, '')}.gov.co`,
          direccion: 'Centro de Coordinación de Emergencias',
          horario: 'Atención 24/7',
        },
        {
          entidad: 'Cuerpo de Bomberos Voluntarios',
          tipo: 'BOMBEROS',
          telefono: '119 / (+57) 311 000 0000',
          correo: 'bomberos@choco.gov.co',
          direccion: 'Estación Central de Bomberos',
          horario: 'Emergencias 24/7',
        },
        {
          entidad: 'Defensa Civil Colombiana - Seccional Chocó',
          tipo: 'DEFENSA_CIVIL',
          telefono: '144 / (+57) 312 000 0000',
          correo: 'defensacivil.choco@defensacivil.gov.co',
          direccion: 'Base Operativa Local',
          horario: 'Atención 24/7',
        },
        {
          entidad: 'Cruz Roja Colombiana - Seccional Chocó',
          tipo: 'CRUZ_ROJA',
          telefono: '132 / (+57) 313 000 0000',
          correo: 'seccional.choco@cruzrojacolombiana.org',
          direccion: 'Puesto de Auxilio Humanitario',
          horario: 'Atención 24/7',
        },
        {
          entidad: 'Policía Nacional de Colombia',
          tipo: 'POLICIA',
          telefono: '123 / Cuadrante Local',
          correo: 'comandancia.choco@policia.gov.co',
          direccion: 'Estación de Policía Municipal',
          horario: 'Seguridad 24/7',
        },
      ],
    }));
  }

  // --- SUBMISSION FORMS ---

  async registrarSolicitudAyuda(datos: SolicitudAyudaPublicaDto) {
    const codFam = `PUB-FAM-${String(Date.now() % 1000000).padStart(6, '0')}`;

    // Crear beneficiario familiar
    const beneficiario = await prisma.beneficiario.create({
      data: {
        codigoFamilia: codFam,
        municipioId: datos.municipioId,
        barrio: datos.barrio,
        direccion: datos.direccionAproximada,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        cantidadPersonas: datos.cantidadPersonas,
        contacto: datos.contacto,
        estado: 'ACTIVO',
      },
    });

    // Buscar afectación activa en el municipio o afectación general
    let afectacion = await prisma.afectacion.findFirst({
      where: {
        municipioId: datos.municipioId,
        estado: { in: ['ACTIVA', 'EN_ATENCION'] },
      },
      orderBy: { id: 'desc' },
    });

    if (!afectacion) {
      afectacion = await prisma.afectacion.findFirst({
        orderBy: { id: 'desc' },
      });
    }

    const afectacionId = afectacion?.id ?? 1n;

    // Crear la solicitud en PENDIENTE
    const solicitud = await prisma.solicitudAyuda.create({
      data: {
        beneficiarioId: beneficiario.id,
        afectacionId: afectacionId,
        tipoNecesidad: datos.tipoNecesidad,
        prioridad: datos.prioridad,
        descripcion: `${datos.nombreResponsable} (${datos.contacto}): ${datos.descripcion}`,
        cantidadSolicitada: 1,
        evidencia: datos.evidencia || null,
        estado: 'PENDIENTE',
      },
    });

    return {
      radicado: codFam,
      solicitudId: Number(solicitud.id),
      mensaje: 'Solicitud radicada correctamente. Será validada por el equipo de coordinación municipal.',
    };
  }

  async proponerCentroAcopio(datos: ProponerCentroAcopioDto) {
    const centro = await prisma.centroAcopio.create({
      data: {
        municipioId: datos.municipioId,
        organizacionId: 1n, // Gobernación por defecto
        nombre: datos.nombre,
        direccion: datos.direccion,
        barrio: datos.barrio,
        responsable: datos.responsable,
        telefono: datos.telefono,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        fotoFachada: datos.fotoFachada || null,
        estado: 'PENDIENTE',
      },
    });

    return {
      id: Number(centro.id),
      estado: centro.estado,
      mensaje: 'Propuesta de centro de acopio registrada. Pasará a revisión y auditoría técnica en sitio.',
    };
  }

  async registrarDonacion(datos: DonacionPublicaDto) {
    if (datos.tipo === 'DINERO') {
      const donacion = await prisma.donacion.create({
        data: {
          tipo: 'DINERO',
          donante: datos.donante,
          monto: datos.monto ?? 0,
          municipioId: datos.municipioId ?? null,
          organizacionId: 1n,
          descripcion: `Donación pública reportada por ${datos.donante}. Tel: ${datos.telefono}. ${datos.descripcion ?? ''}`,
          estado: 'PENDIENTE',
          dinero: {
            create: {
              cuentaDestino: 'Cuenta Oficial Fondo de Emergencia Chocó',
              referencia: datos.referenciaTransferencia ?? `PUB-DON-${Date.now()}`,
              monto: datos.monto ?? 0,
              soporteArchivo: 'soporte_publico_pendiente.pdf',
            },
          },
        },
      });

      return {
        id: Number(donacion.id),
        estado: donacion.estado,
        mensaje: 'Intención de donación monetaria registrada con éxito.',
      };
    } else {
      const donacion = await prisma.donacion.create({
        data: {
          tipo: 'ESPECIE',
          donante: datos.donante,
          municipioId: datos.municipioId ?? null,
          organizacionId: 1n,
          descripcion: `Donación en especie: ${datos.tipoAyuda} (${datos.cantidad} ${datos.unidadMedida ?? 'unidades'}). Requiere flete: ${datos.requiereTransporte ? 'SÍ' : 'NO'}. Tel: ${datos.telefono}`,
          estado: 'PENDIENTE',
          especie: {
            create: {
              tipoAyuda: datos.tipoAyuda ?? 'VARIOS',
              cantidad: datos.cantidad ?? 1,
              peso: 0,
              unidadMedida: datos.unidadMedida ?? 'UNIDAD',
            },
          },
        },
      });

      return {
        id: Number(donacion.id),
        estado: donacion.estado,
        mensaje: 'Intención de donación en especie registrada. El equipo de logística coordinará la recepción.',
      };
    }
  }

  async registrarVoluntario(datos: VoluntariadoPublicoDto) {
    // Registra notificación para coordinación operativa
    await prisma.notificacion.create({
      data: {
        tipo: 'ALERTA',
        titulo: `Nuevo Voluntario: ${datos.nombre}`,
        mensaje: `Voluntario inscrito para ${datos.tipoApoyo} en municipio ${datos.municipioId}. Contacto: ${datos.telefono} - ${datos.correo}. Disponibilidad: ${datos.disponibilidad}. ${datos.observaciones ?? ''}`,
        municipioId: datos.municipioId,
      },
    });

    return {
      registrado: true,
      mensaje: 'Registro de voluntariado completado. ¡Gracias por tu solidaridad con el pueblo chocoano!',
    };
  }

  async registrarTransporte(datos: TransportePublicoDto) {
    await prisma.notificacion.create({
      data: {
        tipo: 'ALERTA',
        titulo: `Transporte Ofrecido: ${datos.tipoVehiculo} (${datos.capacidadCargaKg} Kg)`,
        mensaje: `Transportador: ${datos.nombrePropietario}. Tel: ${datos.telefono}. Cobertura: ${datos.zonasCobertura}. Disponibilidad: ${datos.disponibilidad}. ${datos.observaciones ?? ''}`,
        municipioId: datos.municipioId,
      },
    });

    return {
      registrado: true,
      mensaje: 'Capacidad de transporte registrada. La mesa logística te contactará ante requerimientos de ruta.',
    };
  }

  async registrarDenuncia(datos: DenunciaPublicaDto) {
    const radicado = `CT-2026-${String(Date.now() % 1000000).padStart(6, '0')}`;

    const denuncia = await prisma.denuncia.create({
      data: {
        tipo: datos.tipo,
        descripcion: `[Radicado: ${radicado}] ${datos.esAnonima ? '(Anónima)' : `(Por: ${datos.denuncianteNombre ?? 'Ciudadano'} - Tel: ${datos.denuncianteContacto ?? 'No registra'})`} ${datos.descripcion}`,
        municipioId: datos.municipioId,
        barrio: datos.barrio,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        evidencia: datos.evidencia || null,
        estado: 'RECIBIDA',
      },
    });

    return {
      radicado,
      denunciaId: Number(denuncia.id),
      estado: denuncia.estado,
      mensaje: `Denuncia recibida con código de seguimiento ${radicado}. Puedes consultar su avance con este número.`,
    };
  }

  async vincularACentro(datos: VinculacionCentroDto) {
    const centro = await prisma.centroAcopio.findUnique({
      where: { id: BigInt(datos.centroAcopioId) },
    });

    if (!centro) {
      throw new ErrorNoEncontrado('Centro de acopio no encontrado');
    }

    await prisma.notificacion.create({
      data: {
        tipo: 'ALERTA',
        titulo: `Postulación a Centro: ${centro.nombre}`,
        mensaje: `${datos.nombre} (Tel: ${datos.telefono}, Email: ${datos.correo}) desea apoyar en: ${datos.actividad}. Mensaje: ${datos.mensaje ?? ''}`,
        municipioId: centro.municipioId,
      },
    });

    return {
      vinculado: true,
      mensaje: `Postulación recibida para el centro "${centro.nombre}". El coordinador del centro se comunicará contigo.`,
    };
  }
}
