async function getImages() {
  try {
    const res = await fetch('https://inkup.co.in/');
    const html = await res.text();
    
    // Find all image URLs on the page (matching Shopify CDN formats)
    const regex = /"(https:\/\/cdn\.shopify\.com\/s\/files\/[^"]+?\.(?:jpg|png|webp|jpeg)[^"]*?)"/gi;
    let match;
    const urls = new Set();
    while ((match = regex.exec(html)) !== null) {
      // Clean up the URL (remove Shopify image resizing filters if any)
      let cleanUrl = match[1].replace(/\\/g, '');
      urls.add(cleanUrl);
    }
    
    console.log('\n=== REAL INKUP.CO.IN TATTOO IMAGE URLs ===');
    Array.from(urls).slice(0, 25).forEach((url, i) => {
      console.log(`[Image ${i + 1}]: ${url}`);
    });
    console.log('==========================================');
  } catch (err) {
    console.error('Error fetching images:', err.message);
  }
}

getImages();
