import { describe, it, expect } from 'vitest';
import { prisma } from '../src/comun/biblioteca/prisma.js';
import { MunicipioServicio } from '../src/municipios/servicio/municipio.servicio.js';
import { AfectacionServicio } from '../src/afectaciones/servicio/afectacion.servicio.js';
import { CentroAcopioServicio } from '../src/centros-acopio/servicio/centro-acopio.servicio.js';

function generarCodigoDaneMunicipio() {
  return `270${String(Date.now() % 900000 + 100000).slice(0, 5)}`;
}

describe('Fase 2: gestión territorial y centros de acopio', () => {
  it('debe crear un municipio', async () => {
    const servicio = new MunicipioServicio();
    const municipio = await servicio.crearMunicipio({
      departamentoId: 27,
      codigoDane: generarCodigoDaneMunicipio(),
      nombre: 'Bajo Baudó',
      latitud: 4.95,
      longitud: -77.36,
      estado: true
    });

    expect(municipio.nombre.toUpperCase()).toContain('BAJO BAUDÓ');
  });

  it('debe crear una afectación asociada a un municipio', async () => {
    const servicio = new MunicipioServicio();
    const municipio = await servicio.crearMunicipio({
      departamentoId: 27,
      codigoDane: generarCodigoDaneMunicipio(),
      nombre: 'Medio Baudó',
      latitud: 5.1,
      longitud: -77.2,
      estado: true
    });

    const afectacionServicio = new AfectacionServicio();
    const afectacion = await afectacionServicio.crearAfectacion({
      municipioId: municipio.id,
      nombre: 'Inundación centro poblado',
      descripcion: 'Evento por lluvias intensas',
      tipo: 'INUNDACION',
      severidad: 'ALTA',
      estado: 'ACTIVA',
      latitud: 5.7,
      longitud: -76.6,
      direccion: 'Barrio centro',
      fechaInicio: '2026-08-01',
      creadoPor: 1n
    });

    expect(afectacion.nombre).toContain('Inundación');
  });

  it('debe crear un centro de acopio y permitir auditoría', async () => {
    const municipioServicio = new MunicipioServicio();
    const municipio = await municipioServicio.crearMunicipio({
      departamentoId: 27,
      codigoDane: generarCodigoDaneMunicipio(),
      nombre: 'Alto Baudó',
      latitud: 5.4,
      longitud: -76.9,
      estado: true
    });

    const servicio = new CentroAcopioServicio();
    const centro = await servicio.crearCentro({
      municipioId: municipio.id,
      organizacionId: 1n,
      nombre: 'Almacén de ayuda - Quibdó',
      direccion: 'Calle 10 #2-15',
      barrio: 'Centro',
      responsable: 'Coordinador de logística',
      telefono: '3000000001',
      latitud: 5.69,
      longitud: -76.66,
      fotoFachada: 'https://example.com/fachada.jpg',
      estado: 'PENDIENTE'
    });

    const auditado = await servicio.auditarCentro(centro.id, {
      decision: 'APROBADO',
      comentario: 'Centro validado con evidencia fotográfica',
      fotoEvidencia: 'https://example.com/auditoria.jpg',
      latitud: 5.69,
      longitud: -76.66,
      auditorId: 1n
    });

    expect(auditado.estado).toBe('APROBADO');
  });

  it('debe listar municipios activos', async () => {
    const servicio = new MunicipioServicio();
    const lista = await servicio.listarMunicipios();

    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);
  });
});
