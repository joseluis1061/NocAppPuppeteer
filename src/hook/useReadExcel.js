import React from 'react'

const useReadExcel = () => {
  
  const fileHandler = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    const data = await file.arrayBuffer();
    //const workbook = XLSX.read(data);
    const workbook = XLSX.readFile(data, { sheetRows:7 });//Para seleccionar solo 5 filas

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, //Toma la fila 1 como los titulos
      defval: "",
    }); //Con esto puedo segmentar las columnas del JSON
    setColumns(jsonData[0]);
    console.log(`jsonData ${typeof(jsonData)}`);
    console.log('Tipo jsonData'+typeof(jsonData));   
    console.log(jsonData);   
    setJsonTable(jsonData)
    postData(jsonData)
  }




  return (
    <div>useReadExcel</div>
  )
}

export default useReadExcel