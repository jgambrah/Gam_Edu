const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/LENOVO/OneDrive - Kwame Nkrumah Uni. of Sci. and Tech/Desktop/GAM Med (2)/GAM Edu/src/app/dashboard/dashboard-client.tsx';
const query = process.argv[2] || 'studentSubTab';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let matchCount = 0;
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(query.toLowerCase())) {
      matchCount++;
      if (matchCount <= 100) {
        console.log(`${idx + 1}: ${line.trim()}`);
      }
    }
  });
  console.log(`\nFound ${matchCount} matches for "${query}".`);
} catch (e) {
  console.error(e);
}
