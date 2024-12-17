const fs = require('fs').promises;
const path = require('path');

const PATH_MANAGERS = path.join(__dirname, '../managers.json');

async function writeManagersFile(content) {
  try {
    await fs.writeFile(PATH_MANAGERS, JSON.stringify(content, null, 2));
  } catch (error) {
    console.log(error);
  }
}

async function readManagersFile() {
  try {
    const data = await fs.readFile(PATH_MANAGERS, { encoding: 'utf8' });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  writeManagersFile,
  readManagersFile,
};
