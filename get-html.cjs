const http = require('http');
http.get('http://rozekinvest.pt/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
