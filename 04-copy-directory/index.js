const fs = require('fs');
const path = require('path');
const srcFolder = path.join(__dirname, 'files/');
const dstFolder = path.join(__dirname, 'files-copy/');

async function copyDir(src, dst) {
  await fs.promises.rm(dst, { recursive: true, force: true });
  await fs.promises.mkdir(dst, { recursive: true });
  let files = await fs.promises.readdir(src, { withFileTypes: true });
  for (const file of files) {
    if (!file.isDirectory()) {
      const readStream = fs.createReadStream(src + file.name);
      const writeStream = fs.createWriteStream(dst + file.name);
      readStream.pipe(writeStream);
    } else {
      copyDir(src + file.name + '/', dst + file.name + '/');
    }
  }
}

copyDir(srcFolder, dstFolder);
