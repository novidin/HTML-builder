const fs = require('fs');
const path = require('path');
const srcFolder = path.join(__dirname, 'styles/');
const dstFolder = path.join(__dirname, 'project-dist/');

async function mergeCss(src, dst) {
  const writeStream = fs.createWriteStream(dst + 'bundle.css');
  let files = await fs.promises.readdir(src, { withFileTypes: true });
  for (const file of files) {
    if (!file.isDirectory() && path.extname(file.name) === '.css') {
      const readStream = fs.createReadStream(src + file.name);
      readStream.pipe(writeStream, { end: false });
    }
  }
  writeStream.end;
}

mergeCss(srcFolder, dstFolder);