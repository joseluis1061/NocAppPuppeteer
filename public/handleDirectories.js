const fs = require('fs');

function createDirectotyOutput(dirDownload){
  /**
  * Crea una carpeta con el nombre especificado al final de la ruta.
  * 00_Inputs es el valor necesario
  **/
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

function changeNameFile(name_file, dirDownload){
  /**
  * Elimina los digitos de descarga de un nuevo documento de scraping
  dejando el archivo mas reciente para procesar los datos.
  * name_file: <string>Nombre del archivo estandar o deseado
  * dirDownload: <string> Ruta del archivo
  **/
  if (name_file) {
    let file_list = fs.readdirSync(dirDownload).filter(file => {
      return file.startsWith(name_file);
    });

    // Eliminar los archivos antiguos
    if(file_list.length > 1){
      for (var i = 0; i < file_list.length-1; i++) {
        let file1 = file_list[i];
        let file2 = file_list[i+1];
  
        const stats1 = fs.statSync(dirDownload+"/"+file1);
        const stats2 = fs.statSync(dirDownload+"/"+file2);
  
        const file_t1 = stats1.mtime;
        const file_t2 = stats2.mtime;
  
        if(file_t1>=file_t2){
          fs.unlinkSync( dirDownload+"/"+file2)
        }
        else if(file_t1<file_t2){
          fs.unlinkSync( dirDownload+"/"+file1)
        }
      }
    }

    // Cambiar el nombre del archivo
    file_list = fs.readdirSync(dirDownload).filter(file => {
      return file.startsWith(name_file);
    });

    if (file_list.length === 1){
      fs.renameSync(dirDownload+file_list[0], dirDownload+name_file+".xlsx");
      return console.log('Cambio de nombre hecho')
    }
    else{
      console.log('Falla en renombrar los archivos')
    }
  }
}

module.exports = { 
  createDirectotyOutput: createDirectotyOutput,
  changeNameFile: changeNameFile
};