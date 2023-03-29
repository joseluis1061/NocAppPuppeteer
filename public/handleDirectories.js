const fs = require('fs');

function createDirectotyOutput(dirDownload){
  if (fs.existsSync(dirDownload)){
    console.log('El directorio existe')
  }else{
    fs.mkdir(dirDownload, (error)=>{
      if(error){
        console.log('Error 00_Inputs', error);
      }
      console.log('00_Inputs Success');
    })
  }
}
module.exports = { createDirectotyOutput : createDirectotyOutput };