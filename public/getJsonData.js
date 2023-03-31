const fs = require('fs');

const getJsonData = (pathData, win) =>{
  console.log("Ruta electron funcion get = ", pathData)
  //fs.readFile(pathData, (err, data) => {
  fs.readFile("../raddII.json", (err, data) => {
    if (err) throw err;
  
    const jsonData = JSON.parse(data);
    win.webContents.send('setDataJsonApi', jsonData);

    return jsonData
  });
}
module.exports = { getJsonData:getJsonData };
