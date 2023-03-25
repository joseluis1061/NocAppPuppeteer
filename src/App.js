import './App.css';
import Layout from './Layout/Layout';
import { HashRouter, Routes, Route } from "react-router-dom";
import Alarmas from './pages/Alarmas';
import Analisis from './pages/Analisis';
import Sitios from './pages/Sitios';
import AppContext from './context/AppContext';
import { useState, useEffect } from 'react';
import useApi from './hook/useApi';
//const { ipcRenderer } = window.require('electron');


function App() {
  const api = useApi();
  // ****** Peticiones a NODE JS ******
  return (
    <AppContext.Provider value={api}>    
      <HashRouter>
        <Routes>
          <Route path='/' element={ <Layout/> }>
            <Route index element={ <Sitios/> }/>
            <Route path='/analisis' element={ <Analisis/> }/>
            <Route path='/alarmas' element={ <Alarmas/> }/>
          </Route>
        </Routes>    
      </HashRouter>
    </AppContext.Provider>
  );
}

export default App;
