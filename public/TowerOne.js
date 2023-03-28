const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const urlTowerOne = "http://190.145.9.251:5011/";
const urlImplementacion = "http://190.145.9.251:5011/implementation";
const userTowerOne = "m.roman@toweronewireless.com";
const passTowerOne = "Zz-Qy0Q8";

const dirDownload = path.join(__dirname, './/00_Inputs//');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function createDirectotyOutput(){
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

function changeNameFile(name_file){
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

const scrapingTowerOne = async () => {
  createDirectotyOutput()
  console.log("dirDownload", dirDownload);

  //Opciones de navegación
  const browser = await puppeteer.launch({
    headless: false,  // devtools por defecto es false, si es true no abre el navegador
    slowMo: 0,        // Para hacer la carga mas lenta de una web y evitar ser detectados
    devtools: false,  // Para que se abran las herramientas del navegador
    args: [
        '--ignore-certificate-errors',        
        '--start-maximized',
        //'--start-fullscreen'
    ],
  });

  
  //Inicio de la navegación
  const page = await browser.newPage();


// Descarga a un path especifico
      
  const client = await page.target().createCDPSession();
  await client .send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: dirDownload,
  });

  //await page._client().send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: dirDownload, });

  try{
    await page.setViewport({ width: 0, height: 0});
    await page.goto(urlTowerOne, {waitUntil:'networkidle0'}); // Ir a la pagina y esperar a que este completamente cargada
    await timeout(3000)
  }catch{
    await browser.close();
  }
  timeout(5000);


  // Logeo
  try{
    let userName = await page.waitForXPath("//input[@name='email']");
    userName.type(userTowerOne);
    await timeout(1000);
    let pass = await page.waitForXPath("//input[@name='password']");
    pass.type(passTowerOne);
    await timeout(1000);
    let button = await page.waitForXPath("//form//button[@type='submit'][@class='btn btn-info']");
    button.click({button:'left', delay:500});
    await timeout(5000);
  }catch{
    console.log("Falla logeo")
    await browser.close();
  }

  // Cambio a la pagina de Implementación

  try{
    await page.goto(urlImplementacion, {waitUntil:'networkidle0'}) 
    timeout(2000);
    // await page.screenshot({path: 'NuevaUrlTowerOne.jpg'}); // Captura de la pantalla

  }catch{
    console.log("Falla cambio de ventana");
    await browser.close();
  }

  // Click al botón de descarga
  try{
    const exportData = "//body//button[@type='button'][@class='btn-sm pull-right mx-2 btn btn-success']"
    let btnExportData = await page.waitForXPath(exportData, {visible: true});
    timeout(2000);
    btnExportData.click();
  }
  catch{
    console.log('Falla en el botón de descarga');
    await browser.close();
  }

  // Iniciar download
  try{
    // Método dinamico para esperar que se descargue el elemento
    const file_list_old =  fs.readdirSync(dirDownload).filter(file => {
      return file.startsWith('Sitios_Implementacion_TowerTrack');
    });
    const modal = '//*[@id="exportarModal"]/div[1]/div/div/div[2]/button';
    const btn_modal = await page.waitForXPath(modal, {visible: true});
    timeout(2000);
    btn_modal.click();

    let file_list_new = fs.readdirSync(dirDownload).filter(file => {
      return file.startsWith('Sitios_Implementacion_TowerTrack');
    });
    timeout(5000);

    do {
      timeout(2000);
      file_list_new = fs.readdirSync(dirDownload).filter(file => {
        return file.startsWith('Sitios_Implementacion_TowerTrack');
      });
    } while (file_list_new.length === file_list_old.length);
    
  }
  catch{
    console.log('Falla botón OK');
    await browser.close();
  }
  await page.waitForTimeout(15000);

  // Eliminar las copias y renombrar a un solo archivo
  changeNameFile('Sitios_Implementacion_TowerTrack');
  await page.waitForTimeout(5000);
  // Cerrar el Browser y el programa
  await browser.close();
};
module.exports = { scrapingTowerOne:scrapingTowerOne };
