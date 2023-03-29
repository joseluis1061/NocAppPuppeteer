const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const handleDirectories = require('./handleDirectories');

//const puppeteerCore = require('puppeteer-core');
const URL2020 = "https://10.28.144.135:31943/unisso/login.action?service=%2Funisess%2Fv1%2Fauth%3Fservice%3D%252Fossfacewebsite%252Findex.html%2523Access%252FfmAlarmView&decision=1";
const alarmLog = "https://10.28.144.135:31943/ossfacewebsite/index.html#Access/fmAlarmLog";
const USERU2020 = "dchocuec";
const CONTRASENIAU2020 = "IOTlatamPop2023**";

const dirDownload = path.join(__dirname, './/00_Inputs//');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const scrapingU2020 = async () => {
  // Crea el directorio de salida del archivo
  handleDirectories.createDirectotyOutput(dirDownload);
  //Opciones de navegación
  const browser = await puppeteer.launch({
    //executablePath:'C:\Program Files\Google\Chrome\Application\chrome.exe', //Permite usar el navegador para hacer el lunch
    headless: false,                    // Opción para ocultar la ventana del navegador
    slowMo: 0,                          // Opción para cargar lentamente la ventana
    devtools: false,                    // Opción para abrir las herramientas del navegador
    args: [
        '--ignore-certificate-errors',        
        '--start-maximized',
        //'--start-fullscreen'
        '--disable-gpu',                // Deshabilitar la aceleración por hardware
        '--disable-dev-shm-usage',      // Deshabilitar el uso de la memoria compartida /dev/shm
        '--disable-setuid-sandbox',     // Deshabilitar el uso de un sandbox para el usuario
        '--no-sandbox',                  // Deshabilitar el sandbox del sistema operativo

        /*
        '--remote-debugging-port=9222',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
        */
    ],
  });

  //Inicio de la navegación
  const page = await browser.newPage();

  // Descarga a un path especifico
  const client = await page.target().createCDPSession();
  await client .send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: dirDownload,
    windowState: 'minimized'
  });

  //////////////////
  /*
  const browser = await puppeteerCore.connect({
    browserURL: 'http://localhost:4468',
    headless: true,                    // Opción para ocultar la ventana del navegador
    slowMo: 0,                          // Opción para cargar lentamente la ventana
    devtools: false,                    // Opción para abrir las herramientas del navegador
    args: [
        '--ignore-certificate-errors',        
        '--start-maximized',
        //'--start-fullscreen'
        '--disable-gpu',                // Deshabilitar la aceleración por hardware
        '--disable-dev-shm-usage',      // Deshabilitar el uso de la memoria compartida /dev/shm
        '--disable-setuid-sandbox',     // Deshabilitar el uso de un sandbox para el usuario
        '--no-sandbox'                  // Deshabilitar el sandbox del sistema operativo
    ],
  });

  const pages = await browser.pages();
  console.log(pages)
  const page = pages[0];
  */
  ////////////////


  try{
    await page.setViewport({ width: 0, height: 0});
    await page.goto(URL2020, {waitUntil:'networkidle0'}); // Ir a la pagina y esperar a que este completamente cargada
    await timeout(3000);
  }catch{
    await browser.close();
  }

  // Logeo
  try{
    let userName = await page.waitForXPath('//*[@id="username"]');
    userName.type(USERU2020);
    await timeout(1000);
    let pass = await page.waitForXPath('//*[@id="value"]');
    pass.type(CONTRASENIAU2020);
    await timeout(1000);
    let button = await page.waitForXPath('//*[@id="submitDataverify"]');
    button.click({button:'left', delay:500});
    await timeout(5000);
  }catch{
    await browser.close();
  }

  // Cambio a la pagina de alarmas
  try{
    await page.goto(alarmLog, {waitUntil:'networkidle0'}) 

  }catch{
    console.log("Falla cambio de ventana");
    await browser.close();
  }

  // Identificar iframe y cambio de ambito de manipulación 
  let iframe = await page.waitForXPath('//*[@id="fmAlarmLog"]', {visible: true});
  // Me úbico dentro de sus componentes
  const frameAlarmas = await iframe.contentFrame();

  // Abre el menu de filtros
  try{
    const filterXpath = '/html/body/div[2]/div/div/div[1]/div/div[2]/span[1]';
    const filter = await frameAlarmas.waitForSelector('xpath/' + filterXpath, {visible: true});
    await filter.click();
  }catch{
    console.log("Falla en menu de filtros");
    await browser.close();
  }

  // Selecciona los tipos de alarmas
  try{
    const majorXpath = '//*[@id="fm_btn_alarmMajor"]/span'; //*[@id="fm_btn_alarmMajor"]
    const minorXpath = '//*[@id="fm_btn_alarmMinor"]';
    const warningXpath = '//*[@id="fm_btn_alarmWarning"]';
    const okXpath = '//*[@id="fm_btn_filter"]';
  
    const major = await frameAlarmas.waitForSelector('xpath/' + majorXpath);
    await timeout(3000);
    await major.click();
  
    const minor = await frameAlarmas.waitForSelector('xpath/' + minorXpath);
    await timeout(3000);
    await minor.click();
  
    const warning = await frameAlarmas.waitForSelector('xpath/' + warningXpath);
    await timeout(3000);
    await warning.click();
  
    const ok = await frameAlarmas.waitForSelector('xpath/' + okXpath);
    await timeout(3000);
    await ok.click();
  }catch{
    console.log("Falla en selección de filtros");
    await browser.close();
  }

  // Botón selección para exportar
  try{
    const btnExport = '//*[@id="exportBtn"]/button'
    const btnAll = '//*[@id="allExport"]'
    const btn_export = await frameAlarmas.waitForSelector('xpath/' + btnExport);
    await timeout(3000);
    btn_export.click();
    const btn_all = await frameAlarmas.waitForSelector('xpath/' + btnAll);
    await timeout(3000);
    btn_all.click();
  }catch{
    console.log("Falla en menu de exportar");
    await browser.close();
  }

  // Seleccion tipo de documento
  try{
    const containerXpat = '//*[@id="dialog_panel"]';
    const container_select = await frameAlarmas.waitForSelector('xpath/' + containerXpat, {visible: true});
    const xlsxXpat = '//*[@id="dialog_panel"]/div[@class="eui_Dialog_PanelContent"]/div[@class="eui_radio_group "]//div[@class="eui_radio_container "]//div[@id="eui_radio_group_10001_radio_1"]/div//span[@class="eui_radio_span "]';
    const btn_xlsx = await frameAlarmas.waitForSelector('xpath/' + xlsxXpat, {visible: true});
    await timeout(3000);
    btn_xlsx.click();
  }catch{
    console.log("Falla en opciones de tipo de documento");
    await browser.close();
  }

  // Descarga y espera del documento
  try{
    // Método dinamico para esperar que se descargue el elemento
    const file_list_old =  fs.readdirSync(dirDownload).filter(file => {
      return file.startsWith('AlarmLogs');
    });
    const ok2 = '//*[@id="dialog_panel"]/div[@class="eui_Dialog_ButtonArea"]/button[@id="confirmBtn"]'
    const btn_ok2 = await frameAlarmas.waitForSelector('xpath/' + ok2, {visible: true});
    await timeout(3000);
    try{
      await btn_ok2.evaluate(btn_ok2=> btn_ok2.click());
    }catch{
      console.log("Falla btn_ok2");
      await browser.close();
    }
    //btn_ok2.click();
    let file_list_new = fs.readdirSync(dirDownload).filter(file => {
      return file.startsWith('AlarmLogs');
    });
    timeout(5000);

    do {
      timeout(15000);
      file_list_new = fs.readdirSync(dirDownload).filter(file => {
        return file.startsWith('AlarmLogs');
      });
    } while (file_list_new.length === file_list_old.length);
    
    await timeout(5000);
  }catch{
    console.log("Falla en secuencia de descarga del documento");
    await browser.close();
  }

  // Eliminar las copias y renombrar a un solo archivo
  handleDirectories.changeNameFile('AlarmLogs', dirDownload);

  // Cierre del navegador
  await page.waitForTimeout(2000);    // Función deprecada para dar tiempos de espera
  await browser.close();
  
  return "success U2020"
};
module.exports = { scrapingU2020:scrapingU2020 };