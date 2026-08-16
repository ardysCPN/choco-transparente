async function check() {
  const res = await fetch('http://localhost:4000/api/v1/publico/municipios');
  const json = await res.json();
  console.log('API JSON:', json.datos?.[0]);
  console.log('lat type:', typeof json.datos?.[0]?.latitud);
  console.log('lat value:', json.datos?.[0]?.latitud);
}
check();
