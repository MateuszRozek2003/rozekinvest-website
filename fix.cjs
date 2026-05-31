const fs = require('fs');
const files = ['Emotional', 'Apartments', 'Pricing', 'Amenities', 'Location', 'Rules', 'TargetAudience', 'Gallery', '../components/Footer', '../components/Navbar'].map(f => 'src/sections/'+f+'.tsx');
files.forEach(f => {
  if(!fs.existsSync(f)) return;
  let data = fs.readFileSync(f, 'utf8');
  data = data.replace(/py-24/g, 'py-16 lg:py-24').replace(/mb-16/g, 'mb-10 lg:mb-16');
  fs.writeFileSync(f, data);
});
console.log('done');
