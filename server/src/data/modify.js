import fs from 'fs';

const filePath = '/home/eusebiuu/Documents/software-engineering/web-development/frilore/server/src/data/Project.sql';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const pattern = /\[/g;
  const modifiedContent = data.replace(pattern, 'ARRAY [');

  fs.writeFile(filePath, modifiedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File modified successfully.');
  });
});