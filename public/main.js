const path = require('path');
const fs = require('fs');
const {execSync} = require('child_process');
/*** Cambiar a bridge ***/
const cron = require("node-cron");
const {shell} = require('electron');
const U20220 = require('./U2020');
//const TowerOne = require('./aset/TowerOne');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');


/*
const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // esta opción oculta la ventana principal
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL('https://ejemplo.com');
}

app.on('ready', createWindow);




*/

let win;
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

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000/'
      : `file://${path.join(__dirname, '../build/index.html')}`
      //: file://${__dirname}/../build/index.html);
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' }); //{ mode: "undocked" }
  }

  //Remove menu
  //Menu.setApplicationMenu(null);



  //Ventana U2020 Experimental*****************//
  /**
  // Crea una nueva ventana
  const winU2020 = new BrowserWindow({
    title: "U2020",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      //enableRemoteModule: true,
      //nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
      // webSecurity: true,
      allowRunningInsecureContent: true,
    },
  });

  // Carga la página que contiene el código Puppeteer
  //winU2020.loadFile('./u2020pupeter.js');
  
  const URL2020 = "https://10.28.144.135:31943/unisso/login.action?service=%2Funisess%2Fv1%2Fauth%3Fservice%3D%252Fossfacewebsite%252Findex.html%2523Access%252FfmAlarmView&decision=1";

  //winU2020.loadURL('https://10.28.144.135:31943/unisso/login.action?service=%2Funisess%2Fv1%2Fauth%3Fservice%3D%252Fossfacewebsite%252Findex.html%2523Access%252FfmAlarmView&decision=1');
  // winU2020.loadURL('https://www.google.com/');
  winU2020.loadURL(URL2020);

  // Cuando la ventana esté lista, muestra el contenido
  // winU2020.once('ready-to-show', () => {
  //   winU2020.show();
  //   winU2020.maximize();
  //   winU2020.show();
  // });
   */

}


// const url = mainWindow.webContents.getURL();
// console.log(url);

// app.commandLine.appendSwitch('remote-debugging-port', '8315')

//app.commandLine.appendSwitch('ignore-certificate-errors');      // Habilita la carga de una URL con certificado inseguro

app.whenReady().then(() =>{
  createWindow();
  win.maximize();
  win.show();

}
  
);

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
const { send } = require('process');
/***** Filtered ********/
//let executableFiltered = "\\aset\\EjecutableFiltered\\dist\\";
//let executableFiltered = "\\aset\\Filtered\\dist\\"
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
  U20220.scrapingU2020();
  filteredData();
});
// 0 */3 * * * Cada 3 horas
cron.schedule("0 */1 * * *", () => {
  console.log('Every 1 hour... ', new Date())
  //TowerOne.scrapingTowerOne();
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
  filteredData();
  U20220.scrapingU2020();
})