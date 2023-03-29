const path = require('path');
const fs = require('fs');
const handleDirectories = require('./handleDirectories');
const {execSync} = require('child_process');
/*** Cambiar a bridge ***/
const cron = require("node-cron");
const {shell} = require('electron');
const U20220 = require('./U2020');
const TowerOne = require('./TowerOne');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

let win;
const dirOutputsFilter = path.join(__dirname, './/01_Output//');



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

  win.loadURL(
    isDev
      ? 'http://localhost:3000/'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' }); //{ mode: "undocked" }
  }
  //Remove menu
  //Menu.setApplicationMenu(null);
}

app.whenReady().then(() =>{
  createWindow();
  win.maximize();
  win.show();
  handleDirectories.createDirectotyOutput(dirOutputsFilter);
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
let executableFiltered = "aset\\EjecutableFiltered\\dist\\filterDataSite.exe";

function filteredData() {
  //const child = spawn('start',[__dirname+executableFiltered+'filterDataSite.exe'], 'with space', { shell: true })
  const child = spawn(`"${directory}\\${executableFiltered}"`, { shell: true });
  // // Los datos de salida se obtienen en un evento deseamos los datos data
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


// Rutina donde diablos estoy y que hay en el paquete
ipcMain.on('ping', (event, arg) => {
  //console.log(arg);
  const rutaActual = path.join(__dirname);
  const file_list = fs.readdirSync(rutaActual);

  const asetFile = fs.readdirSync(rutaActual).filter(file => {
    return file.startsWith('aset');
  });
  // const aset = [];
  // if(asetFile){
  //   aset = fs.readdirSync(path.join(__dirname, '.', '\\aset\\'));
  // }
  // console.log(aset)
  // console.log("file_list NODE ", file_list);

  let  rutaTotal = `"${directory}\\${executableFiltered}"`
  event.sender.send('pong', {
    "rutaActual": rutaActual,
    "file_list": file_list,
    "rutaTotal": rutaTotal
    // "aset": aset.length > 0 ? aset : "No file aset" 
  })
  //path.join(__dirname, './executableFiltered/filterDataSite.exe')
  //console.log(__dirname, '\\executableFiltered\\filterDataSite.exe')
  console.log("rutaTotal ", rutaTotal)
  async function ejecutarTodoScraping() {
    await U20220.scrapingU2020();
    await TowerOne.scrapingTowerOne();
    filteredData();
    handleDirectories.changeNameFile('AlarmasU2020_Tower', dirOutputsFilter);
  }
  ejecutarTodoScraping()
})