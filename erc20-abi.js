const fs = require('fs');
const abiJSON = fs.readFileSync('./erc20-abi.json');

function getABI() {
  return JSON.parse(abiJSON);
}

module.exports = getABI;
