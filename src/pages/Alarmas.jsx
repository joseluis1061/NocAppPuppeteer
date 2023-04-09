import React, {useState, useEffect, useContext} from 'react';
import AppContext from '../context/AppContext';
import DataTable from 'react-data-table-component';
import '../styles/Alarmas.css';
const rendererProcess = window.rendererProcess;


const Alarmas = () => {
  const {postData} = useContext(AppContext);
  const [fileName, setFileName] = useState(null);
  const [columns, setColumns] = useState([]);
  const [jsonTable, setJsonTable] = useState([]);
  const [alarmas, setAlarmas] = useState([]);

  // Función para formatear la fecha
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

 
  // Actualizar la tablero con JSON
  const getDataJson= async() => {
    try{
      const json = await rendererProcess.getDataJsonElectron("LogAlarmasRADII.json");
      const data = JSON.parse(json);

      // Array con los nombres de las claves a actualizar
      const keysToUpdate = ['fecha_integracion_RADII', 'final', 'inicio'];

      // Array con objetos actualizados
      const updatedObjectsArray = data.map(obj => {
        const newObj = Object.assign({}, obj);
        // Recorremos las claves a actualizar del objeto
        for (const key of keysToUpdate) {
          // Si la clave es una fecha en formato timestamp, la actualizamos
          if (newObj.hasOwnProperty(key) && typeof newObj[key] === 'number' && newObj[key].toString().length === 13) {
            newObj[key] = formatDate(newObj[key]);
          }
        }
        return newObj;
      });

      setAlarmas(updatedObjectsArray);
    }catch(err){
      console.log("Falla en radd.json", err);
    }

  }

  useEffect(()=>{
    getDataJson();
  },[])

  useEffect(() => {
    const interval = setInterval(() => getDataJson(), 60000);
    return () => clearInterval(interval);
  }, []);

  // Estructura para crear las columnas leidas
  const columnas = [     
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Sitio',
      selector: row => row.sitio,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Inicio',
      selector: row => row.inicio,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Final',
      selector: row => row.final,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      //name: 'Duraci\\u00f3n [minutos]',
      name: 'Duración [minutos]',
      selector: row => row.duracion_minutos,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      // name: 'Clasificaci\\u00f3n alarmas',
      name: 'Clasificación alarmas',
      selector: row => row.clasificacion_alarmas,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Acciones TX en falla',
      selector: row => row.acciones_TX_en_falla,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Proveedor TX',
      selector: row => row.proveedor_TX,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Cabecera TX (SAT)',
      selector: row => row.cabecera_TX_SAT,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Cabecera TX (EXT)',
      selector: row => row.cabecera_TX_EXT,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      // name: 'Ruta TX',
      name: 'Ruta TX',
      selector: row => row.ruta_TX,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
    {
      name: 'Contacto proveedor TX (nivel 1)',
      selector: row => row.contacto_proveedor_TX_nivel_1,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
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
      // name: 'Fecha integraci\\u00f3n RADII',
      name: 'Fecha integración RADII',
      selector: row => row.fecha_integracion_RADII,
      sortable: true,
      allowOverflow: true,
      center: true,
      wrap: true,
      grow:1,
    },
  ]
  return (
    <section className='Alarmas'>
      <h2>Log de Alarmas U2020</h2>
      {
        fileName && <p>{fileName}</p> 
      }
      <DataTable
        columns = {columnas}
        data = {alarmas}
        responsive = {true}
        striped = {true}
        highlightOnHover = {true}
        pointerOnHover = {true}
        pagination
        bordered
        persistTableHead = {true}
        //onRowDoubleClicked = {dobleClickUpdateHandler}
        selectableRows = {true}
        selectableRowsHighlight = {true}
      />
      
      <nav className='alarmas-menu'>
        <button className='btn'>
          Subir Log U2020
        </button>
        <button className='btn'>
          Descargar Log
        </button>
      </nav>

    </section>
  )
}

export default Alarmas;