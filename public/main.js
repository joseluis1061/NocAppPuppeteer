const path = require('path');
const fs = require('fs');
const handleDirectories = require('./handleDirectories');
/*** Cambiar a bridge ***/
const cron = require("node-cron");
const {shell} = require('electron');
const U20220 = require('./U2020');
const TowerOne = require('./TowerOne');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

let win;
let dirOutputsFilter = "";
isDev
  ? dirOutputsFilter = path.join(__dirname, './/01_Output//')
  : dirOutputsFilter = path.join(__dirname, '..', '..', '01_Output//');

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    //fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      //enableRemoteModule: true,
      //nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
    },

  });

  // win.loadURL(
  //   isDev
  //   ?url.format({
  //     pathname: path.join(__dirname, 'index.html')
  //   })
  //   : `file://${path.join(__dirname, '../build/index.html')}`
   
  // );

  win.loadURL(
    isDev
      ? 'http://localhost:3000/'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'right' }); //{ mode: "undocked" }
  }
  //Remove menu
  //Menu.setApplicationMenu(null);
}

app.whenReady().then(() =>{
  createWindow();
  win.maximize();
  win.show();
  //handleDirectories.createDirectotyOutput(dirOutputsFilter);
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/******************************************/
/******** Evento desde el backend ********/

//Si desde el backend detecto un evento ping en el front
const { spawn } = require('child_process');

/***** Filtered ********/
let directory = __dirname;
let pathExecutableFiltered = "";
isDev
  ? pathExecutableFiltered = path.join(__dirname, "\\EjecutableFiltered\\dist\\filterDataSite.exe")
  : pathExecutableFiltered = path.join(__dirname, "..", "..", "\\EjecutableFiltered\\dist\\filterDataSite.exe");
  
let dataPython = {}
function filteredData() {
  const child = spawn(`"${pathExecutableFiltered}"`, { shell: true });
  child.stdout.on('data', (data) => {
    console.log(`Stdout: ${data}`)
  })
  // Podemos obtener el error standar después de ejecutar el comando
  child.stderr.on('data', (data) => {
    console.log(`Stdout: ${data}`)
  })
  // O el error general, si no se puede ejecutar el comando.
  child.on('error', (error) =>{
    console.log(`Error: ${error.message}`)
  })
  // Debemos dar el cierre al proceso
  child.on('exit', (code, signal) => {
    // Si el proceso se termina mediante un código
    if(code) console.log(`Proccess exit with code ${code}`)
    // Si el proceso se termina mediante una señal
    if(signal) console.log(`Proccess killed with signal ${signal}`)
    console.log('Done Filtered')
  })
}

// Procesos cada 7 minutos
cron.schedule("*/7 * * * *", () => {
  console.log('Every 7 min... ', new Date())
  async function ejecutarU2020(){
    await U20220.scrapingU2020();
    filteredData();
    handleDirectories.changeNameFile('AlarmasU2020_Tower', dirOutputsFilter);
  }
  ejecutarU2020();
});

// 0 */1 * * * Cada 1 hora
cron.schedule("0 */1 * * *", () => {
  console.log('Every 1 hour... ', new Date())
  async function ejecutarTowerOne(){
    await TowerOne.scrapingTowerOne();;
    filteredData();
    handleDirectories.changeNameFile('AlarmasU2020_Tower', dirOutputsFilter);
  }
  ejecutarTowerOne();
});

// Activar todo el proceso
ipcMain.on('ping', (event, arg) => {
  async function ejecutarTodoScraping() {
    await U20220.scrapingU2020();
    await TowerOne.scrapingTowerOne();
    filteredData();
    handleDirectories.changeNameFile('AlarmasU2020_Tower', dirOutputsFilter);
  }
  ejecutarTodoScraping()
});

/* Lectura y envio de archivos JSON** */
let jsonDirectories = ".//public//";
isDev
  ? jsonDirectories = ".//public//"
  : jsonDirectories = path.join(__dirname, "..", "..", "\\01_Output\\");

ipcMain.handle('getDataJson', async  (event, arg) => {
  const leerArchivo = path => fs.readFileSync(path, 'utf8');
  const data = leerArchivo(jsonDirectories+arg);
  const dataJson = JSON.parse(data);
  return dataJson;
});