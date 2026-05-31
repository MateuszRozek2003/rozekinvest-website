const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const zipPath = path.join(__dirname, 'gotowa_strona_do_ftp.zip');
const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
  console.error('Error: dist/ folder does not exist. Call npm run build first!');
  process.exit(1);
}

// Ensure old file is deleted before zipping to avoid permission or append errors
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

console.log('Zipping dist/ folder to gotowa_strona_do_ftp.zip synchronously using adm-zip...');

try {
  const zip = new AdmZip();
  // Adds all files inside dist/ directly at the root of the ZIP file
  zip.addLocalFolder(distPath);
  zip.writeZip(zipPath);

  const stats = fs.statSync(zipPath);
  console.log(`Successfully zipped dist/ to gotowa_strona_do_ftp.zip using adm-zip!`);
  console.log(`Zip File Size: ${stats.size} bytes (${(stats.size / 1024).toFixed(2)} KB)`);
} catch (err) {
  console.error('Error during zip creation:', err.message);
  process.exit(1);
}
