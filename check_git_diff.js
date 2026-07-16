import { execSync } from 'child_process';
import fs from 'fs';

try {
  const diff = execSync('git diff src/data/products.js', { encoding: 'utf8' });
  console.log('--- GIT DIFF PRODUCTS.JS ---');
  console.log(diff);
  fs.writeFileSync('git_diff.txt', diff, 'utf8');
} catch (e) {
  // If git is not initialized or fails, let's try git log or other ways
  console.error('Git diff failed:', e.message);
}
