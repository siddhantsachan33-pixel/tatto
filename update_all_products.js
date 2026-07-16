import fs from 'fs';
import path from 'path';

async function main() {
  try {
    // 1. Define standard categories, faqs, and bundles directly (no Git dependencies)
    const categoriesBlock = `export const categories = [
  { id: 'all', name: 'All Tattoos', icon: '✨' },
  { id: 'minimalist', name: 'Minimalist', icon: '🌱' },
  { id: 'spiritual', name: 'Spiritual & Sacred', icon: '🔱' },
  { id: 'quotes', name: 'Quotes & Words', icon: '✍️' },
  { id: 'abstract', name: 'Abstract', icon: '🎨' }
];`;

    const faqsBlock = `export const faqs = [
  {
    q: "How long do SEEDINK semi-permanent tattoos last?",
    a: "Our tattoos last between 1 to 2 weeks (typically 10-14 days) depending on placement, skin type, and daily activity. They fade naturally as your skin regenerates."
  },
  {
    q: "Are they safe for skin?",
    a: "Absolutely! Our ink is made from organic Jagua fruit extract, which is 100% plant-based, skin-safe, non-toxic, and hypoallergenic. No needles, no chemicals."
  },
  {
    q: "How do I apply the tattoo?",
    a: "It takes under 2 minutes: peel the film, place it on clean skin, wet the backing paper thoroughly, hold for 30 seconds, then peel away. The design will appear transparent at first and fully develop into a dark blue/black color over 24-36 hours."
  },
  {
    q: "Is it waterproof?",
    a: "Yes! Once fully developed (after 24-36 hours), our tattoos are completely waterproof. You can shower, swim, and sweat normally without washing them off."
  }
];`;

    const bundlesBlock = `export const bundles = [
  {
    id: "b1",
    name: "Spiritual Power Set",
    description: "Get the complete Mahadev Trishul and Third Eye designs together.",
    price: 499,
    originalPrice: 799
  },
  {
    id: "b2",
    name: "Minimalist Starter Pack",
    description: "Three cute, everyday designs for the perfect subtle look.",
    price: 399,
    originalPrice: 599
  }
];`;

    // 2. Fetch live products from inkup.co.in
    console.log('Fetching live products from inkup.co.in...');
    const res = await fetch('https://inkup.co.in/products.json?limit=50');
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    const data = await res.json();
    const shopifyProducts = data.products;
    console.log(`Found ${shopifyProducts.length} live products on Inkup.`);

    const mappedProducts = [];
    let count = 0;
    for (const p of shopifyProducts) {
      if (count >= 9) break;
      const title = p.title;
      if (title.toLowerCase().includes('pack') && count >= 6) continue;

      let category = 'minimalist';
      const tags = p.tags.map(t => t.toLowerCase());
      if (tags.includes('spiritual') || tags.includes('vedic') || tags.includes('sanskrit') || tags.includes('devanagari')) {
        category = 'spiritual';
      } else if (tags.includes('quotes') || tags.includes('words') || tags.includes('lettering')) {
        category = 'quotes';
      } else if (tags.includes('abstract') || tags.includes('modern') || tags.includes('tribal')) {
        category = 'abstract';
      }

      const price = Math.round(parseFloat(p.variants?.[0]?.price || '299'));
      const originalPrice = Math.round(price * 1.4);

      mappedProducts.push({
        name: title,
        category: category,
        price: price,
        originalPrice: originalPrice,
        size: p.body_html?.match(/Size:<\/strong>\s*([^<]+)/)?.[1]?.trim() || '3 x 3 inches',
        description: p.body_html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || `${title} semi-permanent premium tattoo.`,
        image1: p.images?.[0]?.src || 'https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=600',
        image2: p.images?.[1]?.src || p.images?.[0]?.src || 'https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=600',
        isBestseller: count < 4,
        isNew: count % 3 === 0
      });
      count++;
    }

    // Shiva products
    const shivaProducts = [
      {
        name: "Shiva Trishul & Damru",
        category: "spiritual",
        price: 349,
        originalPrice: 499,
        size: "4 x 2 inches",
        description: "The sacred Trishul (trident) representing the three realms, combined with the Damru representing the cosmic rhythm of creation.",
        image1: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: true
      },
      {
        name: "Lord Shiva Nataraja",
        category: "spiritual",
        price: 449,
        originalPrice: 599,
        size: "3.5 x 3.5 inches",
        description: "A detailed cosmic depiction of Shiva performing the Tandava, the divine dance of destruction and recreation.",
        image1: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true
      },
      {
        name: "Mahadev Third Eye",
        category: "spiritual",
        price: 299,
        originalPrice: 399,
        size: "2 x 2.5 inches",
        description: "The eye of spiritual wisdom, destruction of evil, and higher consciousness. Minimalist geometric representation.",
        image1: "https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false
      }
    ];

    const finalProducts = [...mappedProducts, ...shivaProducts];

    // Write to src/data/products.js (Frontend fallback)
    const frontendFilePath = path.join(process.cwd(), 'src', 'data', 'products.js');
    const frontendContent = `// Automatically generated products from live store + Shiva collection
${categoriesBlock}

export const products = ${JSON.stringify(finalProducts, null, 2)};

${faqsBlock}

${bundlesBlock}
`;
    fs.writeFileSync(frontendFilePath, frontendContent, 'utf8');
    console.log(`Successfully updated frontend products data: ${frontendFilePath}`);

    // Update server/server.js (Backend DB seed)
    const backendFilePath = path.join(process.cwd(), 'server', 'server.js');
    let backendContent = fs.readFileSync(backendFilePath, 'utf8');

    const seedStartMarker = 'const seedProducts = [';
    const seedStartIndex = backendContent.indexOf(seedStartMarker);
    if (seedStartIndex !== -1) {
      const seedEndIndex = backendContent.indexOf('];', seedStartIndex);
      if (seedEndIndex !== -1) {
        const productsStr = JSON.stringify(finalProducts, null, 2);
        const newSeedBlock = `const seedProducts = ${productsStr}`;
        backendContent = backendContent.substring(0, seedStartIndex) + newSeedBlock + backendContent.substring(seedEndIndex + 2);
        fs.writeFileSync(backendFilePath, backendContent, 'utf8');
        console.log(`Successfully updated backend server.js seed data: ${backendFilePath}`);
      }
    }

    // Fix CSS text color visibility for hero-title in src/index.css
    const cssFilePath = path.join(process.cwd(), 'src', 'index.css');
    let cssContent = fs.readFileSync(cssFilePath, 'utf8');
    const titleRegex = /\.hero-title\s*\{[^}]*\}/g;
    const match = cssContent.match(titleRegex);
    if (match) {
      const oldTitleBlock = match[0];
      if (!oldTitleBlock.includes('color:')) {
        const newTitleBlock = oldTitleBlock.replace('text-shadow:', 'color: var(--color-light);\n  text-shadow:');
        cssContent = cssContent.replace(oldTitleBlock, newTitleBlock);
        fs.writeFileSync(cssFilePath, cssContent, 'utf8');
        console.log(`Successfully fixed hero-title text color in index.css!`);
      }
    }

  } catch (err) {
    console.error('Error in updater:', err.message);
  }
}

main();
