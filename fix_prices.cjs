const fs = require('fs');
const file = 'src/data/translations.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/140 euro\./g, '140 €.');
content = content.replace(/140 euros\./g, '140 €.');
content = content.replace(/140 euros /g, '140 € ');
content = content.replace(/140 Euro\./g, '140 €.');
content = content.replace(/79 EUR/g, '79 €');

fs.writeFileSync(file, content);
console.log('done');
