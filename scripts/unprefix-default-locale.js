const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const englishDir = path.join(outDir, 'en');

const copyFile = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};

const copyTree = (from, to) => {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyTree(source, target);
    } else {
      copyFile(source, target);
    }
  }
};

copyFile(path.join(outDir, 'en.html'), path.join(outDir, 'index.html'));

const englishPayload = path.join(outDir, 'en.txt');
if (fs.existsSync(englishPayload)) {
  copyFile(englishPayload, path.join(outDir, 'index.txt'));
}

copyTree(englishDir, outDir);

console.log('English pages copied to unprefixed paths');
