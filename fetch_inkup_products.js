async function fetchProducts() {
  try {
    const res = await fetch('https://inkup.co.in/products.json?limit=50');
    if (!res.ok) {
      console.error('Failed to fetch products.json from Shopify store:', res.status);
      return;
    }
    const data = await res.json();
    console.log(`\nFound ${data.products.length} products on inkup.co.in!`);
    
    const formattedProducts = data.products.map((p, i) => {
      // Find images
      const images = p.images.map(img => img.src);
      // Clean tags or details
      return {
        index: i + 1,
        title: p.title,
        handle: p.handle,
        tags: p.tags,
        images: images.slice(0, 2),
        price: p.variants?.[0]?.price || '99'
      };
    });

    console.log('\n=== INKUP PRODUCTS EXTRACTED ===');
    formattedProducts.slice(0, 15).forEach(p => {
      console.log(`\nProduct ${p.index}: ${p.title}`);
      console.log(`- Price: INR ${p.price}`);
      console.log(`- Tags: ${p.tags.join(', ')}`);
      console.log(`- Image 1: ${p.images[0]}`);
      console.log(`- Image 2: ${p.images[1] || 'None'}`);
    });
    console.log('=================================');
  } catch (err) {
    console.error('Error fetching Shopify products:', err.message);
  }
}

fetchProducts();
