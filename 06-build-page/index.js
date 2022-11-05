const fs = require('fs');
const path = require('path');
const dst = path.join(__dirname, 'project-dist/');

async function buildHtml() {
  const templateFile = path.join(__dirname, 'template.html');
  const readStream = fs.createReadStream(templateFile, 'utf-8');
  const writeStream = fs.createWriteStream(dst + 'index.html');
  for await (const chunk of readStream) {
    writeStream.write(await insertComponents(chunk));
  }
}

async function insertComponents(tempChunk) {
  const tempTags = tempChunk.match(/{{[^{}]+}}/g);
  const src = path.join(__dirname, 'components/');
  for (const tempTag of tempTags) {
    const readStream = fs.createReadStream(src + tempTag.slice(2, -2) + '.html', 'utf-8');
    for await (const chunk of readStream) {
      tempChunk = tempChunk.replace(`${tempTag}`, chunk);
    }
  }
  return tempChunk;
}

async function copyDir(src, dst) {
  await fs.promises.rm(dst, { recursive: true, force: true });
  await fs.promises.mkdir(dst, { recursive: true });
  const files = await fs.promises.readdir(src, { withFileTypes: true });
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

async function mergeCss(src, dst) {
  const writeStream = fs.createWriteStream(dst + 'style.css');
  const files = await fs.promises.readdir(src, { withFileTypes: true });
  for (const file of files) {
    if (!file.isDirectory() && path.extname(file.name) === '.css') {
      const readStream = fs.createReadStream(src + file.name);
      readStream.pipe(writeStream, { end: false });
    }
  }
  writeStream.end;
}

async function createBuild() {
  await fs.promises.rm(dst, { recursive: true, force: true });
  await fs.promises.mkdir(dst, { recursive: true });
  buildHtml();
  copyDir(path.join(__dirname, 'assets/'), dst + 'assets/');
  mergeCss(path.join(__dirname, 'styles/'), dst);
}

createBuild();



