async function check() {
  const renderPat = 'rnd_N5ewqe6wVxLL7viisRemi8Bvxxy2';
  const headers = {
    'Authorization': `Bearer ${renderPat}`,
    'Accept': 'application/json'
  };

  try {
    const res = await fetch('https://api.render.com/v1/services?limit=100', { headers });
    const services = await res.json();
    console.log('\n=== RENDER SERVICES ===');
    services.forEach(s => {
      console.log(`- Name: ${s.service.name}`);
      console.log(`  ID: ${s.service.id}`);
      console.log(`  URL: ${s.service.url}`);
      console.log(`  Status: ${s.service.status}`);
      console.log('----------------------');
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
