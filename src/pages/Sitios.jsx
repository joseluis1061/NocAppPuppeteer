import React from 'react'
import { useState, useContext, useEffect, useMemo } from 'react';
import AppContext from '../context/AppContext';
import DataTable from 'react-data-table-component';
import { ModalEditSite } from '../components/ModalEditSite';
import '../styles/Sitios.css';
import axios from 'axios';
const rendererProcess = window.rendererProcess;

const Sitios = () => {
  const {postData} = useContext(AppContext);
  const [sitios, setSitios] = useState([]);             // Sitios cargados desde la api o desde el JSON
  const [sitio, setSitio] = useState([]);               // Selecciona un solo sitio
  const [sitiosJson, setSitioJson] = useState([]);      // Selecciona un solo sitio
  const [sitiosApi, setSitiosApi] = useState([]);       // Selecciona un solo sitio
  const [show, setShow] = useState(false);              // Control para mostrar el modal
  const [sitiosNuevo, setSitiosNuevo] = useState([]);   // Sitios nuevos
  const [sitiosJsonNode, setSitiosJsonNode] = useState([]);   // Auxiliar leer datos desde NodeJS
  const [alarmSite, setAlarmSite] = useState(false)     // Controla si se debe mostrar mensaje por sitio nuevo
  const [pending, setPending] = React.useState(true);   // Carga pendiente de datos

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  // Función para formatear la fecha
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Detectar sitios nuevos en JSON
  const getDataJson= async() => {
    try{
      const json = await rendererProcess.getDataJsonElectron("raddII.json");
      const data = JSON.parse(json);

      // Cambiar la fecha de formato timestamp a time
      const updatedObjectsArray = data.map(obj => {
        // Si la clave 'date' es un timestamp, la actualizamos
        if (typeof obj.fecha_integracion_RADII === 'number' && obj.fecha_integracion_RADII.toString().length === 13) {
          return Object.assign({}, obj, { fecha_integracion_RADII: formatDate(obj.fecha_integracion_RADII)});
        }
        // Si no, devolvemos el objeto original sin cambios 
        return obj;
      });

      // Detectar sitios nuevos
      const sitiosNuevosFiltrados = detectedSiteNew(updatedObjectsArray);
      setSitioJson(sitiosNuevosFiltrados);
      setPending(false);
    }catch(err){
      console.log("Falla en radd.json", err);
    }
  }

  // Bajar Sitios registrados en la Api 
  const getDataApi= async() => {
    const urlApi = "https://djangonocv1.onrender.com/sitiosRadd/"
    try{
      const response = await axios.get(urlApi);
      const data = response.data;

      // Cambiar la fecha de formato timestamp a time
      const updatedObjectsArray = data.map(obj => {
        // Si la clave 'date' es un timestamp, la actualizamos
        if (typeof obj.fecha_integracion_RADII === 'number' && obj.fecha_integracion_RADII.toString().length === 13) {
          return Object.assign({}, obj, { fecha_integracion_RADII: formatDate(obj.fecha_integracion_RADII)});
        }
        // Si no, devolvemos el objeto original sin cambios 
        return obj;
      });

      setSitiosApi(updatedObjectsArray);
      setPending(false);
    }catch(err){
      console.log(err)
    }
  }

  // Iniciar la actualización de datos cada minuto
  useEffect(() => {
    const interval = setInterval(() => getDataJson(), 60000);
    getDataApi();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getDataJson();
  }, []);

  // Actualizar los datos si se detectan sitios nuevos
  useEffect(()=>{
    setSitios([...sitiosJson, ...sitiosApi]);
  },[sitiosJson, sitiosApi])

  
  const handleUpdateScraping= async() => {
    rendererProcess.actualizarTodoElSistema();
  }

  // Carga la información del sitio en el modal
  const clickHandlerModal = (e, row) => {
    e.preventDefault();
    setSitio(row);
    openModal();
  }
  
  //  Detección de sitios nuevos
  function detectedSiteNew(data){
    // if (data && sitios){
    // Eliminar para evitar el re render
    //   const sitiosFiltrados = data.filter((sitioTorre)=> (sitioTorre.codigo_Tower_One === '-' )); 
    //   if (sitiosFiltrados.length > 0){
    //     setAlarmSite(true);
    //     setSitiosNuevo(sitiosFiltrados);
    //     return(sitiosFiltrados);
    //   }else{
    //     setAlarmSite(false);
    //   }
    // }
    console.log(sitios)
    if (data){
      const sitiosFiltrados = data.filter((sitioTorre)=>sitioTorre.codigo_Tower_One === '-'); 
      if (sitiosFiltrados.length > 0){
        setAlarmSite(true);
        setSitiosNuevo(sitiosFiltrados);
        return(sitiosFiltrados);
      }else{
        setAlarmSite(false);
      }
    }
  };
  
  // Descargar CSV
  //const actionsMemo = console.log("Download") //React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);
  // Columnas para pintar similar a un excel
  const columnas = [     
    {
      name: 'Sitio',
      selector: row => row.sitio,
      sortable: true,
      button: true,
      center: true,
      cell:(row) => <button onClick={(e)=>clickHandlerModal(e, row)} className={row.codigo_Tower_One==='-'? 'red':'green'}>
        {row.sitio}  
      </button>,
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'Código Tower One',
      selector: row => row.codigo_Tower_One,
      sortable: true,
      center: true,
      editable: true,
      allowOverflow: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Acciones TX en falla',
      selector: row => row.acciones_TX_en_falla,
      sortable: true,
      allowOverflow: true,
      wrap: true,
      center: true,
      grow:2,
    },
    {
      name: 'Proveedor TX',
      selector: row => row.proveedor_TX,
      sortable: true,
      allowOverflow: true,
      wrap: true,
      center: true,
      grow:1,
    },
    {
      name: 'cabecera TX SAT' ,
      selector: row => row.cabecera_TX_SAT ,
      center: true,
      sortable: true,
      allowOverflow: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Cabecera TX EXT',
      selector: row => row.cabecera_TX_EXT,
      center: true,
      sortable: true,
      allowOverflow: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Ruta TX',
      selector: row => row.ruta_TX,
      sortable: true,
      allowOverflow: true,
      wrap: true,
      center: true,
      grow:1,
    },
    {
      name: 'Última milla',
      selector: row => row.ultima_milla,
      center: true,
      sortable: true,
      allowOverflow: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Contacto proveedor TX nivel 1',
      selector: row => row.contacto_proveedor_TX_nivel_1,
      allowOverflow: true,
      sortable: true,
      center: true,
      wrap: true,
      grow:2,
    },
    {
      name: 'Coordenadas',
      selector: row => row.coordenadas,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Municipio',
      selector: row => row.municipio,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Departamento',
      selector: row => row.departamento,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Fecha integracion RADII',
      selector: row => row.fecha_integracion_RADII,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Orion Web LTE',
      selector: row => row.orion_Web_LTE,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Orion Web SAT',
      selector: row => row.orion_Web_SAT,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
  ]

  const dobleClickUpdateHandler = (row, event) => { clickHandlerModal(event, row); };
  return (
    <section className='Sitios'>
      {/* <h2>Sitios RADII</h2> */}

      {alarmSite? <div className='newSiteDetected'>
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p>
          Sitios nuevos detectados
          {/* {sitiosNuevo.map(sitio => sitio.sitio)} */}
        </p>
        </div>: ''}

      <ModalEditSite 
        closeModal = {closeModal}
        show = {show} 
        sitio = {sitio}
      />

      <DataTable
        title="Sitios Radd II"
        columns = {columnas}
        data = {sitios}
        responsive = {true}
        striped = {true}
        highlightOnHover = {true}
        pointerOnHover = {true}
        pagination
        bordered
        persistTableHead = {true}
        onRowDoubleClicked = {dobleClickUpdateHandler}
        selectableRows = {true}
        selectableRowsHighlight = {true}
        progressPending={pending}
        search
        dense
        
        //actions={actionsMemo}               // Descargar archivo
        // fixedHeader                      //Scroll en la ventana
        // fixedHeaderScrollHeight="300px"
      />
      
      <nav className='sitios-menu'>
        <div className='campo-download'>          

          {<button className='btn btn-datos-sitio' onClick={()=>handleUpdateScraping()}>
              {/* Actualizar Datos de sitio */}
              Actualizar Sitios
          </button>}
          {/* <button className='btn btn-datos-tower'>
            Actualizar Tower Track
          </button> */}
        </div>

        <div className='campo-download'>
          {/* <button onClick = {() =>window.open("http://127.0.0.1:8000/download/")}className='btn'>  */}
          <button onClick = {() =>window.open("https://djangonocv1.onrender.com/download/")}className='btn'> 
            <i className="fa-solid fa-download"></i>
            Descargar informe 
          </button>
        </div>
      </nav>
    </section>
  )
}
export default Sitios