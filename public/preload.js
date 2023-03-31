const { contextBridge, ipcRenderer } = require('electron');

// Inicializa los procesos de scraping repetitivos
// Envia un mensaje al backend con la fecha como dato adicional
function activateScrapingNode () {
    console.log('activateScraping ....')
    // Al ejecutar esta función enviamos un mensaje y la fecha cuando se produjo
    ipcRenderer.send('cron-scraping', Date.now());
}
// Indica al frontend que debe actualizar los sitios a renderizar
function actualizarFront (setActualizarData) {
  ipcRenderer.on('actualizar', (event, arg) => {
    console.log(`pong recibido en el frontend \n${arg}`);
    setActualizarData(true)
  })
}

function cambioDeEstado(){
  ipcRenderer.on("estado", (event, arg)=> {
    console.log("Cambio de estado cada 10 segundos = ", arg);
    //return arg;
  })
}
function encontrarRutas(){
  const mensajeReact = "Enviar señal de ping";
  ipcRenderer.send('ping', mensajeReact);
  ipcRenderer.on('pong', (event, arg)=>{
    console.log("Eventos recibidos desde NODEJS");
    console.log(arg);
  })
}

function getDataJsonElectron(nameFileJson){
  // raddII.json
  ipcRenderer.send('getDataJson', nameFileJson);
  const json = ipcRenderer.on('setDataJson', (event, arg)=>{
    return arg
  })
  console.log("ARG ==== ", json)

  return json;
}


const getDataJsonElectron2 = async (nameFileJson) => {
  // raddII.json
  const json = await ipcRenderer.invoke('getDataJson2', nameFileJson);
  // console.log("JSON preload -->", json);
  return json
}





contextBridge.exposeInMainWorld('rendererProcess', {

  activateScrapingNode: activateScrapingNode,
  actualizarFront: actualizarFront,
  cambioDeEstado: cambioDeEstado,
  encontrarRutas: encontrarRutas,
  getDataJsonElectron: getDataJsonElectron,
  getDataJsonElectron2: getDataJsonElectron2
  // we can also expose variables, not just functions
})