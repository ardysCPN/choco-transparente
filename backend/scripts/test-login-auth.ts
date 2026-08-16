async function test() {
  const res = await fetch('http://localhost:4000/api/v1/autenticacion/iniciar-sesion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'test@chocotransparente.gov.co', contrasena: 'TestChoco2026!' })
  });
  const data = await res.json();
  console.log('STATUS:', res.status);
  console.log('EXITO:', data.exito);
  console.log('USUARIO:', data.datos?.usuario);
  console.log('TOKEN EXISTS:', !!data.datos?.token);
}
test();
