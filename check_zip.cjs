const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const zipPath = path.join(__dirname, 'gotowa_strona_do_ftp.zip');
if (!fs.existsSync(zipPath)) {
  console.log('Zip file does not exist at all!');
  process.exit(1);
}

const stats = fs.statSync(zipPath);
console.log('Zip File Size:', stats.size, 'bytes (' + (stats.size / 1024 / 1024).toFixed(2) + ' MB)');

try {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();
  console.log('Number of files inside ZIP:', entries.length);
  if (entries.length > 0) {
    console.log('First 5 files inside:');
    entries.slice(0, 5).forEach(e => {
      console.log(' -', e.entryName, '(', e.header.size, 'bytes)');
    });
  }
} catch (err) {
  console.error('Error reading zip:', err.message);
}
