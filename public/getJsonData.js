const fs = require('fs');

const getJsonData = (pathData) =>{
  fs.readFile(pathData, (err, data) => {
    if (err) throw err;
  
    const jsonData = JSON.parse(data);
    return jsonData
  });
}
module.exports = { getJsonData:getJsonData };
