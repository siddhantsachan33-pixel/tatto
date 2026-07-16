import { execSync } from 'child_process';

const renderPat = 'rnd_N5ewqe6wVxLL7viisRemi8Bvxxy2';
const serviceId = 'srv-d9bnt88qmsqc7399sokg';
const backendUrl = 'https://tatto-backend-4axz.onrender.com';
const apiUrl = `${backendUrl}/api`;

async function trigger() {
  const headers = {
    'Authorization': `Bearer ${renderPat}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    // 0. Update products and styles automatically
    console.log('\n[0/4] Scraping inkup.co.in products and patching CSS...');
    execSync('node update_all_products.js', { stdio: 'inherit', cwd: process.cwd() });

    // 1. Trigger a fresh build on Render so it runs the updated server code (clears and seeds new Shiva/tattoo products)
    console.log('\n[1/4] Triggering MERN backend deployment on Render...');
    const deployRes = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
      method: 'POST',
      headers
    });
    if (deployRes.ok) {
      const deployData = await deployRes.json();
      console.log(`✅ Success! Render build triggered. ID: ${deployData.id}`);
    } else {
      console.error(`❌ Failed to trigger Render build: ${deployRes.status} - ${await deployRes.text()}`);
    }

    // 2. Build local frontend using Vite, baking in the correct backend URL
    console.log('\n[3/4] Building local frontend with correct backend URL...');
    execSync('npx vite build', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        VITE_API_BASE: apiUrl
      }
    });
    console.log('✅ Local build complete!');

    // 3. Deploy the built dist folder to Cloudflare Pages via Wrangler
    console.log('\n[4/4] Deploying built folder to Cloudflare Pages...');
    execSync('npx wrangler pages deploy dist --project-name=tatto', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        CLOUDFLARE_API_TOKEN: '' // Clear global token to force local session usage
      }
    });
    console.log('\n===================================================');
    console.log('🎉 SUCCESS! Backend rebuild triggered & frontend deployed!');
    console.log(`🌐 Frontend Website: https://tatto-9hq.pages.dev`);
    console.log(`🌐 Backend API: ${apiUrl}`);
    console.log('===================================================');

  } catch (err) {
    console.error('Error during execution:', err.message);
  }
}

trigger();
