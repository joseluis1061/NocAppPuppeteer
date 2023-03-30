import React from 'react'
import { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import DataTable from 'react-data-table-component';
import { ModalEditSite } from '../components/ModalEditSite';
import '../styles/Sitios.css';
import axios from 'axios';

const Sitios = () => {
  const {postData} = useContext(AppContext);
  const [sitios, setSitios] = useState([]);             // Sitios cargados desde la api o desde el JSON
  const [sitio, setSitio] = useState([]);               // Selecciona un solo sitio
  const [sitiosJson, setSitioJson] = useState([]);      // Selecciona un solo sitio
  const [sitiosApi, setSitiosApi] = useState([]);       // Selecciona un solo sitio
  const [show, setShow] = useState(false);              // Control para mostrar el modal
  const [sitiosNuevo, setSitiosNuevo] = useState([]);   // Sitios nuevos
  const [alarmSite, setAlarmSite] = useState(false)     // Controla si se debe mostrar mensaje por sitio nuevo

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  // Detectar sitios nuevos en JSON
  const getDataJson= async() => {
    //const urlApi = "..//..//..//01_Output//raddII.json";  // Para leer archivos en producción
    const urlApi = "raddII.json";  //Para leer el archivo desde la carpeta public
    //console.log(await loadJsonFile('raddII.json'));
    try{
      const response = await axios.get(urlApi);
      const json = response.data;
      const data = JSON.parse(json)
      //setSitios(data);
      const sitiosNuevosFiltrados = detectedSiteNew(data)
      setSitioJson(sitiosNuevosFiltrados);
      //detectedSiteNew(data);
      //console.log(`Sitios JSON = ${sitiosJson.length} Sitios = ${sitios.length}`);
    }catch(err){
      console.log("Falla en radd.json", err);
    }
  }

  // Bajar Sitios registrados en la Api 
  const getDataApi= async() => {
    const urlApi = "https://djangonocv1.onrender.com/sitiosRadd/"
    try{
      const response = await axios.get(urlApi);
      const data = response.data
      //setSitios(data);
      setSitiosApi(data);
      //console.log(data)
      //console.log(`Sitios API = ${sitiosApi.length} Sitios = ${sitios.length}`);
    }catch(err){
      console.log(err)
    }
    //detectedSiteNew();
  }

  // Hace el primer llamado para cargar los datos
  useEffect(() => {
    const interval = setInterval(() => getDataJson(), 60000);
    getDataApi();
    return () => clearInterval(interval);
  }, []);


  useEffect(()=>{
    setSitios([...sitiosJson, ...sitiosApi]);
  },[sitiosJson, sitiosApi])

  // Averiguar donde estoy
  // const requestHandleRutaDondeEstoy= async() => {
  //   const urlApi = "https://djangonocv1.onrender.com/sitioRadII/" //Falta agregar el id 643 para pruebas
  //   try{
  //     const response = await axios.get(urlApi);
  //     const data = response.data;
  //     setSitios(data);
  //     detectedSiteNew();
  //   }catch(err){
  //     console.log(err);
  //   }
  // }
  const handleUpdateScraping= async() => {
    const rendererProcess = window.rendererProcess;
    rendererProcess.encontrarRutas();
  }



  
  // Carga la información del sitio en el modal
  const clickHandlerModal = (e, row) => {
    e.preventDefault();
    setSitio(row);
    openModal();
  }
  
  // useEffect(()=>{
  //   getDataApi();
  // },[])
  // useEffect(()=>{
  //   detectedSiteNew();
  // },[sitios])

  //  Detección de sitios nuevos
  function detectedSiteNew(data){
    console.log('')
    console.log("Datos filtrados")
    if (data){
      data.map((sitioTorre)=>{ 
        if(sitioTorre.codigo_Tower_One === '-'){
          return console.log("Sitios nuevos = ",sitioTorre.sitio)
          //return sitioTorre.sitio
        }else{
          return console.log(sitio.codigo_Tower_One)
          //return sitioTorre.codigo_Tower_One
        }
      }); 
    }

    const sitiosFiltrados = data.filter((sitioTorre)=>sitioTorre.codigo_Tower_One === '-'); 
    if (sitiosFiltrados.length > 0){
      setAlarmSite(true);
      setSitiosNuevo(sitiosFiltrados);
      return(sitiosFiltrados);
      // setSitios(sitiosPrevios =>{
      //   return [...sitiosPrevios, ...sitiosNuevo]
      // })
    }else{
      setAlarmSite(false);
    }
  };

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
      <h2>Sitios RADII</h2>

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
        search
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