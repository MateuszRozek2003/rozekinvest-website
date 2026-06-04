const https = require('https');

https.get('https://api.github.com/repos/MateuszRozek2003/rozekinvest-website', {
  headers: { 'User-Agent': 'Node.js' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', err => console.error(err));
