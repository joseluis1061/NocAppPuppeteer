import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router-dom';
import '../styles/Layout.css'

const Layout = () => {
  const location = useLocation();
  console.log(location)
  return (
    <div className='Layout'>
      <div className='layout-container'>
        <h1>IOTLATAM</h1>
        <nav className='layout-nav'>
          <Link to="/" className='link'>
            <div className={`link-container ${location.pathname === "/"? "selected": null}`}>
              <i className="fa-solid fa-bell"></i>
              <p>Sitios RADII </p>
            </div>
          </Link>

          <Link to='/analisis' className='link'>
            <div className={`link-container ${location.pathname === "/analisis"? "selected": null}`}>
              <i className="fa-solid fa-magnifying-glass-chart"></i>
              <p>Análisis</p>
            </div>
          </Link>

          <Link to='/alarmas' className='link'>
            <div className={`link-container ${location.pathname === "/alarmas"? "selected": null}`}>
              <i className="fa-solid fa-location-dot"></i>
              <p>Alarmas</p>
            </div>
          </Link>
        </nav>
      </div>
      <div className='layout-page'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout;