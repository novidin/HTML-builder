const fs = require('fs');
const path = require('path');
const readline = require('readline');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Hello, please, enter text:\n'
});

rl.prompt();

rl.on('line', (input) => {
  input === 'exit' ? rl.close() : writeStream.write(`${input}\n`);
});

rl.on('close', () => {
  console.log('BUY!');
});