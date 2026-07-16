async function check() {
  const renderPat = 'rnd_N5ewqe6wVxLL7viisRemi8Bvxxy2';
  const serviceId = 'srv-d9bnt88qmsqc7399sokg';
  const headers = {
    'Authorization': `Bearer ${renderPat}`,
    'Accept': 'application/json'
  };

  try {
    const res = await fetch(`https://api.render.com/v1/services/${serviceId}`, { headers });
    const s = await res.json();
    console.log('\n=== Render Service Full Details ===');
    console.log(JSON.stringify(s, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
