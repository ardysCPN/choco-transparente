async function checkAll() {
  const c = await (await fetch('http://localhost:4000/api/v1/publico/centros-acopio')).json();
  console.log('Centro sample:', c.datos?.[0]);
  console.log('Centro lat type:', typeof c.datos?.[0]?.latitud);

  const alb = await (await fetch('http://localhost:4000/api/v1/publico/albergues')).json();
  console.log('Albergue sample:', alb.datos?.[0]);
  console.log('Albergue lat type:', typeof alb.datos?.[0]?.latitud);

  const af = await (await fetch('http://localhost:4000/api/v1/publico/afectaciones')).json();
  console.log('Afectacion sample:', af.datos?.[0]);
  console.log('Afectacion lat type:', typeof af.datos?.[0]?.latitud);
}
checkAll();
