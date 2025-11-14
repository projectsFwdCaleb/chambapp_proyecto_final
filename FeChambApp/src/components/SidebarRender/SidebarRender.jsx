import React, { useState, useEffect } from 'react'
// import Dropdown from 'react-bootstrap/Dropdown';
import ServicesCategoria from '../../Services/ServicesCategoria';
import { useNavigate } from "react-router-dom";
import "../SidebarRender/SidebarRender.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faHeart, faInbox  } from '@fortawesome/free-solid-svg-icons'


function SidebarRender() {
  const [categorias, setCategorias] = useState([])
  // Estado para controlar si el submenú de Categorías está abierto o cerrado
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false) 
  const navigate = useNavigate()

  useEffect(() => {
    const getCategories = async () => {
        const data = await ServicesCategoria.getCategoria()
        setCategorias(Array.isArray(data) ? data : data.results || data.data || [])
    }
    getCategories()
  }, [])

  // Función para alternar el estado del submenú de categorías
  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen); 
  }

  // Define una función para manejar la navegación o acciones de la categoría
  const handleCategoryClick = (categoriaNombre) => {
    console.log(`Navegando a: ${categoriaNombre}`);
    // navigate(`/categorias/${categoriaNombre}`);
  }

  return (
    <div className='sidebar-container text-white'>

        <div className='logo-section'>
            <img src="/logo.png" alt="ChambApp" />
        </div>

        {/* Opciones de Navegación principales*/}
        <div className='navOptions'>
            <ul className='nav-list'>
                <li className='nav-item'>
                    <button className='nav-link'>
                        <h3><FontAwesomeIcon icon={faEye} /> Explorar</h3>
                    </button>
                </li>
                
                <li className='nav-item'>
                    <button className='nav-link'>
                        
                        <h3><FontAwesomeIcon icon={faHeart} /> Favoritos</h3>
                    </button>
                </li>

                <li className='nav-item'>
                    <button className='nav-link'>
                        <h3><FontAwesomeIcon icon={faInbox} /> Solicitudes</h3>
                    </button>
                </li>
            </ul>
        </div>

        {/* Submenú de Categorías*/}
        <div className='categories-menu-container'>
            <ul className='nav-list'>
                <li className='nav-item drop-down-parent'>
                    {/* Botón para alternar la visibilidad del submenú */}
                    <button 
                        className={`dropdown-toggle-btn ${isCategoriesOpen ? 'is-open' : ''}`}
                        onClick={toggleCategories}>
                        <span>Categorias</span>
                        <i className='arrow-icon'>{isCategoriesOpen ? '▲' : '▼'}</i>
                    </button>

                    {/* Contenedor del Submenú: CSS Grid/Transición */}
                    <div className={`submenu-wrapper ${isCategoriesOpen ? 'show' : ''}`}>
                        <ul className='submenu-list'>
                            {categorias.map((categoria) => (
                                <li 
                                    key={categoria.id || categoria.nombre} // Es crucial usar una key
                                    className='submenu-item'>
                                    <button 
                                        className='submenu-link'
                                        onClick={() => handleCategoryClick(categoria.nombre)}>
                                        {categoria.nombre}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        
        {/* Sección del menú general*/}
        <div className='generalMenu'>
            <h3 className='text-muted'>General</h3>
            <button>Ajustes</button>
            <button>Cerrar sessión</button>
        </div>
    </div>
  )
}

export default SidebarRender;