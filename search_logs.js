import fs from 'fs';
import path from 'path';

const logFile = 'C:\\Users\\shubh\\.gemini\\antigravity-ide\\brain\\aace0c9a-3c88-4fc7-8269-9fa8e832da2a\\.system_generated\\logs\\transcript.jsonl';

function search() {
  if (!fs.existsSync(logFile)) {
    console.error('Log file does not exist at:', logFile);
    return;
  }

  const content = fs.readFileSync(logFile, 'utf8');
  const lines = content.split('\n');
  console.log(`Searching ${lines.length} lines of log history...`);
  
  let found = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Search for cloudflare tokens or api calls
    if (line.includes('cfToken') || line.includes('cfut_') || line.includes('api.cloudflare.com')) {
      console.log(`\n--- Line ${i + 1} ---`);
      // Find the substring around the match to keep output readable
      const idx = line.indexOf('cfToken') !== -1 ? line.indexOf('cfToken') : line.indexOf('cfut_');
      const start = Math.max(0, idx - 100);
      const end = Math.min(line.length, idx + 100);
      console.log(line.substring(start, end));
      found++;
    }
  }
  console.log(`\nSearch completed. Found ${found} matches.`);
}

search();
