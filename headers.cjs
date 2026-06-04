const http = require('http');
http.get('http://rozekinvest.pt/logo-black-new.png', res => {
  console.log(res.headers);
});
