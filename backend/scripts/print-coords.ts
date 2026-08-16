import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const mun = await prisma.municipio.findMany({ select: { id: true, nombre: true, latitud: true, longitud: true } });
  for (const m of mun) {
    console.log(`ID: ${m.id} | ${m.nombre} | lat: ${m.latitud} (${typeof m.latitud}) | lng: ${m.longitud} (${typeof m.longitud})`);
  }
  await prisma.$disconnect();
}
run();
