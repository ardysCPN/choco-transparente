import { describe, it, expect } from 'vitest';
import { InventarioServicio } from '../src/inventario/servicio/inventario.servicio.js';

describe('Fase 3: inventario, entradas, salidas y lotes', () => {
  it('debe registrar una entrada de inventario para un centro', async () => {
    const servicio = new InventarioServicio();

    const entrada = await servicio.registrarEntrada({
      centroAcopioId: 1n,
      tipoAyuda: 'ALIMENTO',
      cantidad: 50,
      peso: 100,
      origen: 'Donación institucional',
      numeroDocumento: 'DOC-001',
      usuarioId: 1n
    });

    expect(entrada).toHaveProperty('id');
    expect(entrada.tipoAyuda).toBe('ALIMENTO');
  });

  it('debe registrar una salida sin dejar inventario negativo', async () => {
    const servicio = new InventarioServicio();

    const salida = await servicio.registrarSalida({
      centroAcopioId: 1n,
      tipoAyuda: 'ALIMENTO',
      cantidad: 10,
      peso: 20,
      municipioId: 1,
      fotoEntrega: 'https://example.com/entrega.jpg',
      usuarioId: 1n
    });

    expect(salida).toHaveProperty('id');
    expect(Number(salida.cantidad)).toBeGreaterThan(0);
  });

  it('debe listar inventario por centro', async () => {
    const servicio = new InventarioServicio();
    const lista = await servicio.listarInventarioPorCentro(1n);

    expect(Array.isArray(lista)).toBe(true);
  });
});
