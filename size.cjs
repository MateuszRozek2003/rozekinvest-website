const http = require('http');
http.get('http://rozekinvest.pt/logo-black-new.png', res => {
  let size = 0;
  res.on('data', chunk => size += chunk.length);
  res.on('end', () => console.log('File size:', size));
});
