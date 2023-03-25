const path = require('path');

const puppeteer = require('puppeteer');
const URL2020 = "https://10.28.144.135:31943/unisso/login.action?service=%2Funisess%2Fv1%2Fauth%3Fservice%3D%252Fossfacewebsite%252Findex.html%2523Access%252FfmAlarmView&decision=1";
const alarmLog = "https://10.28.144.135:31943/ossfacewebsite/index.html#Access/fmAlarmLog";
const USERU2020 = "dchocuec";
const CONTRASENIAU2020 = "IOTlatam2023COL**";

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const scrapingU2020 = async () => {
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
  
    const major = await frameAlarmas.waitForSelector('xpath/' + majorXpath, {visible: true});
    await timeout(3000);
    await major.click();
  
    const minor = await frameAlarmas.waitForSelector('xpath/' + minorXpath, {visible: true});
    await timeout(3000);
    await minor.click();
  
    const warning = await frameAlarmas.waitForSelector('xpath/' + warningXpath, {visible: true});
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
    const btn_xlsx = await await frameAlarmas.waitForSelector('xpath/' + xlsxXpat, {visible: true});
    await timeout(3000);
    btn_xlsx.click();
  }catch{
    console.log("Falla en opciones de tipo de documento");
    await browser.close();
  }

  // Descarga y espera del documento
  try{
    const ok2 = '//*[@id="dialog_panel"]/div[@class="eui_Dialog_ButtonArea"]/button[@id="confirmBtn"]'
    const btn_ok2 = await await frameAlarmas.waitForSelector('xpath/' + ok2, {visible: true});
    await timeout(3000);
    btn_ok2.click();
    await timeout(25000);
  }catch{
    console.log("Falla en secuencia de descarga del documento");
    await browser.close();
  }

  //await page.waitForTimeout(5000);    // Función deprecada para dar tiempos de espera
  await browser.close();
};
//scrapingU2020();
module.exports = { scrapingU2020:scrapingU2020 };