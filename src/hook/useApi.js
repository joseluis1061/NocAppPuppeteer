import React, { useState } from 'react';
import axios from 'axios';

const useApi = () => {
  const [data, setData] = useState([]);

  const postData = async (data) =>{
    //const urlApi = 'https://app.iotlatamhome.com/api/v1/integrations/http/a46b8ef6-283c-9402-e390-a8d6de5bdaea';
    const urlApi ='http://127.0.0.1:8000/import_excel/';  
    console.log('Método POST');
    //Ver los datos antes de enviar
    console.log("***********INICIO**************");
    console.log("Tipo de datos = ", +typeof(data))
    const dataJson = {'jsonExcel': data}
    console.log(dataJson)
    console.log("*************fin***************");


    try{
      await axios.post(urlApi, data);
        // {
        //   'Name':'Prueba IOT',
        //   'Data': 'Excel NOC',
        //   'Place': 'Ingeniero de soporte y desarrollo'
        // }
        //);
    }catch(err){
      console.log(err)
    }

  };

  return {
    data, 
    postData
  }
  
}

export default useApi