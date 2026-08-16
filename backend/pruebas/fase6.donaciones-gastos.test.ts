import { describe, it, expect } from 'vitest';
import { OrganizacionServicio } from '../src/organizaciones/servicio/organizacion.servicio.js';
import { DonacionServicio } from '../src/donaciones/servicio/donacion.servicio.js';
import { GastoServicio } from '../src/gastos/servicio/gasto.servicio.js';
import { prisma } from '../src/comun/biblioteca/prisma.js';

describe('Fase 6: donaciones, gastos y caja transparente', () => {
  it('debe crear una donación en dinero y cambiar su estado', async () => {
    const servicio = new DonacionServicio();
    
    const donacion = await servicio.crearDonacionDinero({
      donante: 'Fundación XYZ',
      monto: 5000000,
      cuentaDestino: 'CC 12345678901',
      referencia: 'REF-2026-001',
      municipioId: 1
    });

    expect(donacion.tipo).toBe('DINERO');
    expect(donacion.donante).toContain('Fundación');
    expect(Number(donacion.dinero?.monto)).toBe(5000000);

    const actualizada = await servicio.actualizarEstadoDonacion(donacion.id, {
      estado: 'RECIBIDO'
    });

    expect(actualizada.estado).toBe('RECIBIDO');
  });

  it('debe crear una donación en especie', async () => {
    const servicio = new DonacionServicio();
    
    const donacion = await servicio.crearDonacionEspecie({
      donante: 'Almacén Regional',
      tipoAyuda: 'ALIMENTOS',
      cantidad: 100,
      peso: 500,
      unidadMedida: 'KG',
      municipioId: 1
    });

    expect(donacion.tipo).toBe('ESPECIE');
    expect(donacion.especie?.tipoAyuda).toBe('ALIMENTOS');
    expect(Number(donacion.especie?.cantidad)).toBe(100);
  });

  it('debe crear un gasto y aprobarlo', async () => {
    // Crear una organización primero
    const org = await prisma.organizacion.create({
      data: {
        nombre: `Org Test ${Date.now()}`,
        tipo: 'ONG',
        identificacion: `ID-${Date.now()}`,
        responsable: 'Director Gasto'
      }
    });

    const servicio = new GastoServicio();
    const usuarioId = BigInt(1);

    const gasto = await servicio.crearGasto(
      {
        organizacionId: Number(org.id),
        concepto: 'Transporte de ayuda humanitaria',
        monto: 2500000,
        proveedor: 'Transportes Rápido',
        numeroFactura: 'FAC-2026-001',
        fecha: new Date().toISOString().split('T')[0],
        soporte: 'https://example.com/factura.pdf'
      },
      usuarioId
    );

    expect(gasto.concepto).toContain('Transporte');
    expect(gasto.estado).toBe('BORRADOR');

    const aprobado = await servicio.aprobarGasto(gasto.id, 'APROBAR', usuarioId);
    expect(aprobado.estado).toBe('APROBADO');
  });

  it('debe listar donaciones y gastos por organización', async () => {
    const servicioD = new DonacionServicio();
    const servicioG = new GastoServicio();

    const donaciones = await servicioD.listarDonaciones();
    expect(Array.isArray(donaciones)).toBe(true);

    const gastos = await servicioG.listarGastos();
    expect(Array.isArray(gastos)).toBe(true);
  });
});
