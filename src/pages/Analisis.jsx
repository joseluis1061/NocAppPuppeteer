import React from 'react';
import { useState, useEffect, useContext } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import '../styles/Analisis.css';

//Columnas de la tabla

const columnas = [     
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
    name: 'Minutos indisponibilidad total',
    selector: row => row.minutos_indisponibilidad_total,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  },
  {
    name: 'Total alarmas',
    selector: row => row.total_alarmas,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  },
  {
    name: 'Alarmas > 15 [min]',
    selector: row => row.alarmas_mayor_15_min,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  },
  {
    name: 'Alarmas > 30 [min]',
    selector: row => row.alarmas_mayor_30_min,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  },
  {
    name: 'Alarmas > 60 [min]',
    selector: row => row.alarmas_mayor_60_min,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  },
  {
    name: 'Alarmas > 120 [min]',
    selector: row => row.alarmas_mayor_120_min,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  },
  {
    name: 'ALERTAS',
    selector: row => row.alertas,
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
    name: 'Ruta TX',
    selector: row => row.ruta_TX,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  },
  {
    name: 'Última milla',
    selector: row => row.ultima_milla,
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
    name: 'Fecha integración RADII',
    selector: row => row.fecha_integración_RADII,
    sortable: true,
    allowOverflow: true,
    center: true,
    wrap: true,
    grow:1,
  }
]


const Analisis = () => {
  const [analisis, setAnalisis] = useState([]);

  // Actualizar la tablero con JSON
  const getDataJson= async() => {
    //const urlApi = "..//..//..//01_Output//AnalisisAlarmas.json";  // Para leer archivos en producción
    const urlApi = "AnalisisAlarmas.json"; //Para leer el archivo desde la carpeta public
    //console.log(await loadJsonFile('raddII.json'));
    try{
      const response = await axios.get(urlApi);
      const json = response.data;
      const data = JSON.parse(json)
      setAnalisis(data)
      //detectedSiteNew();
      //console.log('Alarmas json');
      //console.log(typeof(data));
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    console.log('Actulizar data 1')
    getDataJson()
    //setActualizarData(false)
    console.log('Actulizar data 2')

  },[])

  return (
    <section className='Analisis'>
      <h2>Análisis Alarmas</h2> 
      <DataTable
        columns = {columnas}
        data = {analisis}
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
      {/* <form action="" >
        <fieldset>
        <legend>Elegir el intervalo de tiempo</legend>
          <fieldset className='campo'>
            <label htmlFor="">Inicio</label>
            <input type="date" />
          </fieldset>
          <fieldset className='campo'>
            <label htmlFor="">Fin</label>
            <input type="date" />
          </fieldset>
          <button className='btn btn-enviar'>Enviar</button>
        </fieldset>
      </form> */}
    </section>
  )
}

export default Analisis