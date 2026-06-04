const https = require('https');
const fs = require('fs');
const path = require('path');

const repo = 'MateuszRozek2003/rozekinvest-website';
const branch = 'main';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Handle redirects (like 301, 302)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Close current file and follow redirect
        file.close();
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded', dest);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

https.get(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`, {
  headers: { 'User-Agent': 'Node.js' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    const tree = JSON.parse(data).tree;
    if (!tree) {
      console.error(data);
      return;
    }
    const promises = [];
    for (const item of tree) {
      if (item.type === 'blob') {
        if (item.path === 'src/data/images.ts' || item.path === 'src/components/Navbar.tsx' || item.path.startsWith('public/')) {
          const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${item.path}`;
          promises.push(downloadFile(rawUrl, item.path).catch(e => console.error(e)));
        }
      }
    }
    await Promise.all(promises);
    console.log('All files downloaded');
  });
}).on('error', err => console.error(err));
