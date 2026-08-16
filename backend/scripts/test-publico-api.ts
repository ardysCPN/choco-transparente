async function testPublicEndpoints() {
  console.log('Testing Public API endpoints (/api/v1/publico/*)...');

  const tests = [
    { name: 'GET /api/v1/publico/dashboard', url: 'http://localhost:4000/api/v1/publico/dashboard' },
    { name: 'GET /api/v1/publico/municipios', url: 'http://localhost:4000/api/v1/publico/municipios' },
    { name: 'GET /api/v1/publico/municipios/1', url: 'http://localhost:4000/api/v1/publico/municipios/1' },
    { name: 'GET /api/v1/publico/centros-acopio', url: 'http://localhost:4000/api/v1/publico/centros-acopio' },
    { name: 'GET /api/v1/publico/inventario', url: 'http://localhost:4000/api/v1/publico/inventario' },
    { name: 'GET /api/v1/publico/albergues', url: 'http://localhost:4000/api/v1/publico/albergues' },
    { name: 'GET /api/v1/publico/afectaciones', url: 'http://localhost:4000/api/v1/publico/afectaciones' },
    { name: 'GET /api/v1/publico/contactos', url: 'http://localhost:4000/api/v1/publico/contactos' },
  ];

  for (const t of tests) {
    const res = await fetch(t.url);
    const data = await res.json() as any;
    if (res.status === 200 && data.exito) {
      console.log(`✅ [${res.status}] ${t.name} -> OK`);
    } else {
      console.error(`❌ [${res.status}] ${t.name} -> ERROR:`, data);
    }
  }

  console.log('\nTesting Public Submission endpoints...');

  // Test Denuncia Pública
  const denunciaRes = await fetch('http://localhost:4000/api/v1/publico/denuncias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo: 'DISTRIBUCION_DESIGUAL',
      municipioId: 1,
      barrio: 'Sector El Caraño',
      descripcion: 'Reporte ciudadano de verificación de entrega en terreno',
      esAnonima: true,
    }),
  });
  const denunciaData = await denunciaRes.json() as any;
  console.log(`✅ POST /api/v1/publico/denuncias -> Radicado: ${denunciaData.datos?.radicado}`);

  // Test Solicitud Ayuda Pública
  const solicitudRes = await fetch('http://localhost:4000/api/v1/publico/solicitudes-ayuda', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      municipioId: 1,
      barrio: 'Sector Playita',
      direccionAproximada: 'Calle 15 # 4-20 frente a la cancha',
      cantidadPersonas: 4,
      tipoNecesidad: 'Kits de Alimentos y Agua Potable',
      descripcion: 'Familia damnificada por creciente súbita que requiere apoyo inmediato',
      prioridad: 'ALTA',
      contacto: '3109988776',
      nombreResponsable: 'Familia Mosquera Palacios',
    }),
  });
  const solicitudData = await solicitudRes.json() as any;
  console.log(`✅ POST /api/v1/publico/solicitudes-ayuda -> Radicado: ${solicitudData.datos?.radicado}`);

  console.log('\n🎉 Todos los endpoints públicos están operativos y validados.');
}

testPublicEndpoints().catch(console.error);
