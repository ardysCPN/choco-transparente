import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const mun = await prisma.municipio.findMany({ select: { id: true, nombre: true, latitud: true, longitud: true } });
  console.log('MUNICIPIOS:', mun.length, mun.slice(0, 5));

  const centros = await prisma.centroAcopio.findMany({ select: { id: true, nombre: true, latitud: true, longitud: true, estado: true } });
  console.log('CENTROS:', centros.length, centros);

  const albergues = await prisma.albergue.findMany({ select: { id: true, nombre: true, latitud: true, longitud: true } });
  console.log('ALBERGUES:', albergues.length, albergues);

  const afectaciones = await prisma.afectacion.findMany({ select: { id: true, tipo: true, latitud: true, longitud: true, estado: true } });
  console.log('AFECTACIONES:', afectaciones.length, afectaciones);

  await prisma.$disconnect();
}
run();
