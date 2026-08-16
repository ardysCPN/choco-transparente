async function testHttpAprobar() {
  console.log('1. Iniciando sesión como superadmin...');
  const loginRes = await fetch('http://localhost:4000/api/v1/autenticacion/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'fase1@test.local', contrasena: 'Admin12345' }),
  });

  console.log('Login status:', loginRes.status);
  const loginData = await loginRes.json() as any;
  console.log('Login response:', loginData);
  const token = loginData.datos.token;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  console.log('\n2. Creando gasto borrador...');
  const gastoRes = await fetch('http://localhost:4000/api/v1/gastos', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      organizacionId: 1,
      concepto: 'Flete fluvial de kits de emergencia Quibdó a Bojayá',
      monto: 3200000,
      proveedor: 'Transportes Atrato S.A.S. - NIT 900123456-1',
      numeroFactura: `FE-ATR-${Date.now() % 10000}`,
      fecha: '2026-08-16',
      soporte: 'https://ejemplo.com/factura.pdf',
    }),
  });

  const gastoData = await gastoRes.json() as any;
  console.log('Gasto creado:', gastoData);
  const gastoId = gastoData.datos.id;

  console.log(`\n3. Enviando POST /api/v1/gastos/${gastoId}/aprobar...`);
  const aprobarRes = await fetch(`http://localhost:4000/api/v1/gastos/${gastoId}/aprobar`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accion: 'APROBAR',
      observaciones: 'Factura verificada y aprobada por auditoría',
    }),
  });

  const aprobarData = await aprobarRes.json() as any;
  console.log('\n--- RESPUESTA DEL SERVIDOR ---');
  console.log(JSON.stringify(aprobarData, null, 2));

  if (aprobarData.exito) {
    console.log('\n✅ EL ENDPOINT RESPONDIÓ EXITOSAMENTE: GASTO APROBADO');
  } else {
    console.error('\n❌ ERROR:', aprobarData);
  }
}

testHttpAprobar().catch(console.error);
