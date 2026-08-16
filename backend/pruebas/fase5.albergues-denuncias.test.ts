import { describe, it, expect } from 'vitest';
import { MunicipioServicio } from '../src/municipios/servicio/municipio.servicio.js';
import { AlbergueServicio } from '../src/albergues/servicio/albergue.servicio.js';
import { DenunciaServicio } from '../src/denuncias/servicio/denuncia.servicio.js';

function codigoUnico() {
  return String((Date.now() % 9000) + 1000);
}

describe('Fase 5: albergues y denuncias', () => {
  it('debe crear un albergue en un municipio', async () => {
    const municipioServicio = new MunicipioServicio();
    const municipio = await municipioServicio.crearMunicipio({
      departamentoId: 27,
      codigoDane: `270${codigoUnico()}`,
      nombre: 'Nuquí',
      latitud: 5.7,
      longitud: -77.3,
      estado: true
    });

    const servicio = new AlbergueServicio();
    const albergue = await servicio.crearAlbergue({
      municipioId: municipio.id,
      nombre: 'Albergue barrio la cruz',
      direccion: 'Calle 13 #4-20',
      latitud: 5.71,
      longitud: -77.29,
      capacidad: 40,
      ocupacion: 12,
      responsable: 'Lina Gómez',
      telefono: '3001234567',
      servicios: 'Agua, alimentación, cuna',
      estado: 'DISPONIBLE'
    });

    expect(albergue.nombre).toContain('Albergue');
  });

  it('debe crear una denuncia y cambiar su estado', async () => {
    const municipioServicio = new MunicipioServicio();
    const municipio = await municipioServicio.crearMunicipio({
      departamentoId: 27,
      codigoDane: `270${codigoUnico()}`,
      nombre: 'Bahía Solano',
      latitud: 6.2,
      longitud: -77.4,
      estado: true
    });

    const servicio = new DenunciaServicio();
    const denuncia = await servicio.crearDenuncia({
      tipo: 'ASALTOS',
      descripcion: 'Se reporta agresión verbal en barrio la Esperanza',
      municipioId: municipio.id,
      barrio: 'La Esperanza',
      latitud: 6.21,
      longitud: -77.41,
      evidencia: 'https://example.com/evidencia-denuncia.jpg',
      estado: 'RECIBIDA'
    });

    const actualizada = await servicio.actualizarDenuncia(denuncia.id, {
      estado: 'EN_REVISION',
      respuesta: 'Se gestionará con Policía y coordinación local'
    });

    expect(actualizada.estado).toBe('EN_REVISION');
    expect(actualizada.respuesta).toContain('Se gestionará');
  });
});
