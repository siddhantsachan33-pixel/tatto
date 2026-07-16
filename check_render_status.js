async function check() {
  const renderPat = 'rnd_N5ewqe6wVxLL7viisRemi8Bvxxy2';
  const headers = {
    'Authorization': `Bearer ${renderPat}`,
    'Accept': 'application/json'
  };

  try {
    const res = await fetch('https://api.render.com/v1/services?limit=100', { headers });
    const services = await res.json();
    const service = services.find(s => s.service.name === 'tatto-backend');
    if (!service) {
      console.log('Could not find tatto-backend service.');
      return;
    }
    console.log('\n=== tatto-backend Status ===');
    console.log(`- Service ID: ${service.service.id}`);
    console.log(`- Status: ${service.service.status}`);
    console.log(`- URL: ${service.service.url}`);
    console.log(`- Suspended: ${service.service.suspended}`);
    console.log(`- Last Updated: ${service.service.updatedAt}`);
    
    // Check active builds
    const buildRes = await fetch(`https://api.render.com/v1/services/${service.service.id}/builds?limit=5`, { headers });
    if (buildRes.ok) {
      const builds = await buildRes.json();
      console.log('\n=== Recent Builds ===');
      builds.forEach((b, i) => {
        console.log(`[Build ${i+1}] ID: ${b.build.id}, Status: ${b.build.status}, Triggered: ${b.build.createdAt}`);
      });
    }
  } catch (err) {
    console.error('Error checking Render status:', err.message);
  }
}

check();
