import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import { AuthServicio } from '../src/autenticacion/servicio/auth.servicio.js';
import { prisma } from '../src/comun/biblioteca/prisma.js';

async function crearUsuarioPrueba() {
  const passwordHash = await bcrypt.hash('Admin12345', 10);

  return prisma.usuario.upsert({
    where: { correo: 'fase1@test.local' },
    update: {},
    create: {
      nombre: 'Usuario',
      apellido: 'Prueba',
      correo: 'fase1@test.local',
      documento: '1234567890',
      telefono: '3000000000',
      contrasenaHash: passwordHash,
      rolId: 1,
      municipioId: 1,
      organizacionId: 1
    }
  });
}

describe('Fase 1: autenticación y permisos', () => {
  it('debe iniciar sesión con credenciales válidas', async () => {
    await crearUsuarioPrueba();

    const servicio = new AuthServicio();
    const resultado = await servicio.iniciarSesion('fase1@test.local', 'Admin12345');

    expect(resultado).toHaveProperty('token');
    expect(resultado.usuario.correo).toBe('fase1@test.local');
  });

  it('debe rechazar credenciales inválidas', async () => {
    const servicio = new AuthServicio();

    await expect(servicio.iniciarSesion('fase1@test.local', 'pass-incorrecta')).rejects.toThrow();
  });

  it('debe devolver el perfil del usuario autenticado', async () => {
    const usuario = await crearUsuarioPrueba();
    const servicio = new AuthServicio();
    const perfil = await servicio.obtenerPerfil(usuario.id);

    expect(perfil.correo).toBe('fase1@test.local');
    expect(perfil.rol).toBeTruthy();
  });
});
