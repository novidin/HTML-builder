const fs = require('fs');
const path = require('path');
const filesFolder = path.join(__dirname, 'secret-folder/');

async function getFiles() {
  const files = await fs.promises.readdir(filesFolder, { withFileTypes: true });
  for (const file of files) {
    if(!file.isDirectory()) {
      showStats(file);
    }
  }
}

async function showStats(file) {
  const fileSize = (await fs.promises.stat(filesFolder + file.name)).size;
  const fileExt = path.extname(file.name);
  const fileName = file.name.replace(fileExt, '');
  console.log(fileName + ' - ' + fileExt.slice(1) + ' - ' + fileSize);
}

getFiles();