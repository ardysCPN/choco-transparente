import { describe, it, expect } from 'vitest';
import { MunicipioServicio } from '../src/municipios/servicio/municipio.servicio.js';
import { AfectacionServicio } from '../src/afectaciones/servicio/afectacion.servicio.js';
import { BeneficiarioServicio } from '../src/beneficiarios/servicio/beneficiario.servicio.js';
import { SolicitudAyudaServicio } from '../src/solicitudes-ayuda/servicio/solicitud-ayuda.servicio.js';
import { EntregaAyudaServicio } from '../src/entregas-ayuda/servicio/entrega-ayuda.servicio.js';

function codigoUnico(prefijo: string) {
  const sufijo = String((Date.now() % 9000) + 1000).padStart(4, '0');
  return `${prefijo}${sufijo}`;
}

describe('Fase 4: beneficiarios, solicitudes y entregas', () => {
  it('debe crear un beneficiario y registrar una solicitud', async () => {
    const municipioServicio = new MunicipioServicio();
    const municipio = await municipioServicio.crearMunicipio({
      departamentoId: 27,
      codigoDane: codigoUnico('2704'),
      nombre: 'Lloró',
      latitud: 5.2,
      longitud: -76.7,
      estado: true
    });

    const afectacionServicio = new AfectacionServicio();
    const afectacion = await afectacionServicio.crearAfectacion({
      municipioId: municipio.id,
      nombre: 'Deslizamiento por lluvia',
      descripcion: 'Afectación en la zona urbana',
      tipo: 'DESLIZAMIENTO',
      severidad: 'ALTA',
      estado: 'ACTIVA',
      latitud: 5.1,
      longitud: -76.8,
      direccion: 'Urbanización central',
      fechaInicio: '2026-08-10',
      creadoPor: 1n
    });

    const beneficiarioServicio = new BeneficiarioServicio();
    const beneficiario = await beneficiarioServicio.crearBeneficiario({
      codigoFamilia: codigoUnico('FAM'),
      municipioId: municipio.id,
      barrio: 'Centro',
      direccion: 'Calle 7 #8-10',
      latitud: 5.2,
      longitud: -76.7,
      cantidadPersonas: 4,
      contacto: '3001112233',
      estado: 'ACTIVO'
    });

    const solicitudServicio = new SolicitudAyudaServicio();
    const solicitud = await solicitudServicio.crearSolicitud({
      beneficiarioId: beneficiario.id,
      afectacionId: afectacion.id,
      tipoNecesidad: 'ALIMENTO',
      prioridad: 'ALTA',
      descripcion: 'Necesidad de alimentos para 4 personas',
      cantidadSolicitada: 10,
      evidencia: 'https://example.com/evidencia.jpg',
      estado: 'PENDIENTE'
    });

    expect(solicitud.beneficiarioId).toBe(beneficiario.id);
    expect(solicitud.tipoNecesidad).toBe('ALIMENTO');
  });

  it('debe registrar una entrega con evidencia', async () => {
    const municipioServicio = new MunicipioServicio();
    const municipio = await municipioServicio.crearMunicipio({
      departamentoId: 27,
      codigoDane: '27250',
      nombre: 'Istmina',
      latitud: 5.3,
      longitud: -76.5,
      estado: true
    });

    const afectacionServicio = new AfectacionServicio();
    const afectacion = await afectacionServicio.crearAfectacion({
      municipioId: municipio.id,
      nombre: 'Inundación parcial',
      descripcion: 'Calle principal inundada',
      tipo: 'INUNDACION',
      severidad: 'MEDIA',
      estado: 'ACTIVA',
      latitud: 5.3,
      longitud: -76.5,
      direccion: 'Vereda la playa',
      fechaInicio: '2026-08-11',
      creadoPor: 1n
    });

    const beneficiarioServicio = new BeneficiarioServicio();
    const beneficiario = await beneficiarioServicio.crearBeneficiario({
      codigoFamilia: codigoUnico('FAM2'),
      municipioId: municipio.id,
      barrio: 'Los Pinos',
      direccion: 'Carrera 4 #5-6',
      latitud: 5.26,
      longitud: -76.52,
      cantidadPersonas: 3,
      contacto: '3009988777',
      estado: 'ACTIVO'
    });

    const solicitudServicio = new SolicitudAyudaServicio();
    const solicitud = await solicitudServicio.crearSolicitud({
      beneficiarioId: beneficiario.id,
      afectacionId: afectacion.id,
      tipoNecesidad: 'HIGIENE',
      prioridad: 'MEDIA',
      descripcion: 'Necesidad de kits de higiene',
      cantidadSolicitada: 5,
      evidencia: 'https://example.com/higiene.jpg',
      estado: 'PENDIENTE'
    });

    const entregaServicio = new EntregaAyudaServicio();
    const entrega = await entregaServicio.crearEntrega({
      solicitudId: solicitud.id,
      beneficiarioId: beneficiario.id,
      cantidad: 5,
      responsableEntrega: 1n,
      evidencia: 'https://example.com/entrega.jpg',
      latitud: 5.3,
      longitud: -76.5,
      observaciones: 'Entrega completada con ayuda de logística'
    });

    expect(entrega.beneficiarioId).toBe(beneficiario.id);
    expect(entrega.cantidad.toString()).toBe('5');
  });
});
