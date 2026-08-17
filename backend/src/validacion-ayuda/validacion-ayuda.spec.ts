import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ConsultarValidacionAyudaSchema,
  RegistrarValidacionAyudaSchema,
} from './dto/validacion-ayuda.dto.js';
import { ValidacionAyudaServicio } from './servicio/validacion-ayuda.servicio.js';

// Mock de Prisma
vi.mock('../comun/biblioteca/prisma.js', () => ({
  prisma: {
    $executeRawUnsafe: vi.fn().mockResolvedValue(1),
    validacionAyuda: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from '../comun/biblioteca/prisma.js';

describe('Módulo Validación de Ayuda Recibida (Chocó Transparente)', () => {
  let servicio: ValidacionAyudaServicio;

  beforeEach(() => {
    servicio = new ValidacionAyudaServicio();
    vi.clearAllMocks();
  });

  describe('1. Validaciones de Entrada (Zod Schemas)', () => {
    it('debe validar que la identificación no esté vacía', () => {
      const resultado = ConsultarValidacionAyudaSchema.safeParse({
        numeroIdentificacion: '   ',
      });
      expect(resultado.success).toBe(false);
    });

    it('debe validar que la identificación tenga al menos 3 caracteres', () => {
      const resultado = ConsultarValidacionAyudaSchema.safeParse({
        numeroIdentificacion: '12',
      });
      expect(resultado.success).toBe(false);
    });

    it('debe aceptar identificaciones válidas alfanuméricas', () => {
      const resultado = ConsultarValidacionAyudaSchema.safeParse({
        numeroIdentificacion: '1077489230',
      });
      expect(resultado.success).toBe(true);
    });

    it('debe rechazar registro sin nombre de organización entregante', () => {
      const resultado = RegistrarValidacionAyudaSchema.safeParse({
        numeroIdentificacion: '1077489230',
        organizacionEntregante: ' ',
        consentimientoDatos: true,
      });
      expect(resultado.success).toBe(false);
    });

    it('debe exigir consentimiento informado obligatorio (consentimientoDatos = true)', () => {
      const resultado = RegistrarValidacionAyudaSchema.safeParse({
        numeroIdentificacion: '1077489230',
        organizacionEntregante: 'Cruz Roja Chocó',
        consentimientoDatos: false,
      });
      expect(resultado.success).toBe(false);
    });

    it('debe aprobar registro cuando todos los campos son válidos', () => {
      const resultado = RegistrarValidacionAyudaSchema.safeParse({
        numeroIdentificacion: '1077489230',
        organizacionEntregante: 'Cruz Roja Seccional Chocó',
        consentimientoDatos: true,
      });
      expect(resultado.success).toBe(true);
    });
  });

  describe('2. Servicio: Consultar Identificación', () => {
    it('Caso 1: Retorna existe = false cuando la identificación no tiene registros', async () => {
      (prisma as any).validacionAyuda.findFirst.mockResolvedValue(null);

      const res = await servicio.consultar({ numeroIdentificacion: '9999999999' });

      expect(res.existe).toBe(false);
      expect(res.numeroIdentificacion).toBe('9999999999');
    });

    it('Caso 2: Retorna existe = true con datos mínimos cuando ya tiene registro previo', async () => {
      const mockFecha = new Date('2026-08-16T14:30:00Z');
      (prisma as any).validacionAyuda.findFirst.mockResolvedValue({
        id: 1n,
        numeroIdentificacion: '1077489230',
        estado: 'RECIBIDA',
        organizacionEntregante: 'Cruz Roja Chocó',
        fechaRegistro: mockFecha,
        consentimientoDatos: true,
      });

      const res = await servicio.consultar({ numeroIdentificacion: '1077489230' });

      expect(res.existe).toBe(true);
      expect(res.estado).toBe('RECIBIDA');
      expect(res.organizacionEntregante).toBe('Cruz Roja Chocó');
      expect(res.fechaRegistro).toEqual(mockFecha);
      // Validar que NO exponga IDs internos ni datos innecesarios
      expect((res as any).id).toBeUndefined();
    });
  });

  describe('3. Servicio: Registrar Ayuda y Prevención de Duplicados', () => {
    it('Caso 3: Registra exitosamente una nueva ayuda cuando no existe previamente', async () => {
      (prisma as any).validacionAyuda.findFirst.mockResolvedValue(null);
      const mockFecha = new Date('2026-08-17T10:00:00Z');
      (prisma as any).validacionAyuda.create.mockResolvedValue({
        id: 2n,
        numeroIdentificacion: '1077489230',
        estado: 'RECIBIDA',
        organizacionEntregante: 'Defensa Civil Colombiana - Quibdó',
        fechaRegistro: mockFecha,
        consentimientoDatos: true,
      });

      const res = await servicio.registrar({
        numeroIdentificacion: '1077489230',
        organizacionEntregante: 'Defensa Civil Colombiana - Quibdó',
        consentimientoDatos: true,
      });

      expect(res.yaRegistrado).toBe(false);
      expect(res.estado).toBe('RECIBIDA');
      expect(res.mensaje).toBe('Ayuda registrada correctamente.');
      expect((prisma as any).validacionAyuda.create).toHaveBeenCalledTimes(1);
    });

    it('Caso 4: Detecta duplicado y NO crea un nuevo registro si la persona ya recibió ayuda', async () => {
      const mockFechaPrevia = new Date('2026-08-15T09:00:00Z');
      (prisma as any).validacionAyuda.findFirst.mockResolvedValue({
        id: 1n,
        numeroIdentificacion: '1077489230',
        estado: 'RECIBIDA',
        organizacionEntregante: 'Gobernación del Chocó',
        fechaRegistro: mockFechaPrevia,
        consentimientoDatos: true,
      });

      const res = await servicio.registrar({
        numeroIdentificacion: '1077489230',
        organizacionEntregante: 'Otra Fundación',
        consentimientoDatos: true,
      });

      expect(res.yaRegistrado).toBe(true);
      expect(res.estado).toBe('RECIBIDA');
      expect(res.organizacionEntregante).toBe('Gobernación del Chocó');
      expect(res.mensaje).toBe('Esta persona ya registra una ayuda recibida.');
      // Validar que NUNCA llamó a create (cero duplicados)
      expect((prisma as any).validacionAyuda.create).not.toHaveBeenCalled();
    });
  });
});
