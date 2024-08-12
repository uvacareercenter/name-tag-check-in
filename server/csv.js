const fs = require('fs');
const csv = require('csv-parser');

const get = async (filePath) => {
  const data = [];
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject(new Error('File path is undefined'));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = { get };
