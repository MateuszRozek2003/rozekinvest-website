const fs = require('fs');
let fileContent = fs.readFileSync('src/data/translations.ts', 'utf8');

const nautilusPrices = {
  low: { from: 545, to: 556 },
  midlow: { from: 605, to: 660 },
  midhigh: { from: 655, to: 756 },
  holiday: { from: 950, to: 1000 },
  high: { from: 950, to: 1000 }
};

const valefuradoPrices = {
  low: 612,
  midlow: 726,
  midhigh: 832,
  holiday: 1100,
  high: 1100
};

// First, we need to restructure `seasons:` to `seasonsNautilus:` and `seasonsValeFurado:`

function replacePrices() {
  const lines = fileContent.split('\n');
  const newLines = [];
  
  let inSeasons = false;
  let currentSeasonsBlock = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('seasons: {')) {
      inSeasons = true;
      currentSeasonsBlock = [];
      continue;
    }
    
    if (inSeasons) {
      if (line.match(/^\s*\},/)) {
        inSeasons = false;
        
        // build seasonsNautilus
        newLines.push('      seasonsNautilus: {');
        for (let j = 0; j < currentSeasonsBlock.length; j++) {
            let l = currentSeasonsBlock[j];
            l = l.replace('545', '556').replace('605', '660').replace('655', '756').replace('950', '1000').replace('950', '1000');
            newLines.push(l);
        }
        newLines.push('      },');
        
        // build seasonsValeFurado
        newLines.push('      seasonsValeFurado: {');
        for (let j = 0; j < currentSeasonsBlock.length; j++) {
            let l = currentSeasonsBlock[j];
            l = l.replace('545', '612').replace('605', '726').replace('655', '832').replace('950', '1100').replace('950', '1100');
            newLines.push(l);
        }
        newLines.push('      },');
        
        continue;
      } else {
        currentSeasonsBlock.push(line);
      }
    } else {
      newLines.push(line);
    }
  }
  
  fs.writeFileSync('src/data/translations.ts', newLines.join('\n'));
}

replacePrices();

