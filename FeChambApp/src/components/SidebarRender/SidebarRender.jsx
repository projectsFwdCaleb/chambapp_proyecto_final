import React, { useState, useEffect } from 'react'
// import Dropdown from 'react-bootstrap/Dropdown';
import ServicesCategoria from '../../Services/ServicesCategoria';
import { useNavigate, Link } from "react-router-dom";
import "../SidebarRender/SidebarRender.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faHeart, faInbox, faComment, faUser, faGear, faFilter, faArrowAltCircleRight, faChartBar} from '@fortawesome/free-solid-svg-icons'
import ServicesLogin from '../../Services/ServicesLogin';

function SidebarRender() {
  const [categorias, setCategorias] = useState([])
  const [user, setUser] = useState(null)
  // Estado para controlar si el submenú de Categorías está abierto o cerrado
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false) 
  const navigate = useNavigate()



  useEffect(() => {
    fetchUser()
    getCategories()
  }, [])

  const getCategories = async () => {
        const data = await ServicesCategoria.getCategoria()
        setCategorias(Array.isArray(data) ? data : data.results || data.data || [])
    }

  const fetchUser = async () => {
        const data = await ServicesLogin.getUserSession();
        setUser(data);
      }

  // Función para alternar el estado del submenú de categorías
  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen); 
  }

  const grupo = user?.grupos[0] // El primer grupo del usuario

  // Define una función para manejar la navegación o acciones de la categoría
  const handleCategoryClick = (categoriaId) => {
    console.log(`Navegando a: ${categoriaId}`);
    navigate(`/categoria/${categoriaId}`);
  }

  const handleExploreClick = () => {
    navigate('/')
  }

  const handleFavoriteClick = () => {
    navigate('/favoritos')
  }

  const handleRequestClick = () => {
    navigate('/Solicitudes')
  }

  const handleUsersClick = () => {
    navigate('/Administrador/usuarios')
  }
  
  const handleModeratorReviewClick = () => {
    navigate('/Administrador/resenhas')
  }

  const handleDemandClick = () => {
    navigate('/Administrador/solicitudes')
  }

  const handleModeratorCategoryClick = () => {
    navigate('/Administrador/categorias')
  }

  const handleModeratorServicesClick = () => {
    navigate('/Administrador/servicios')
  }

  const handleAboutButton = () => {
    navigate('/acerca-de')
  }
  
  const handleAdminClick = () => {
    navigate('/Administrador')
  }

  return (
    <div className='sidebar-container text-white'>

        <div className='logo-section'>
            <Link to="/">
            <img src="/logo.png" alt="ChambApp" />
            </Link> 
        </div>

        {/* Opciones de Navegación principales*/}

         <>
        {grupo === "admin" ? (

            <div className='navOptions'>
            <ul className='nav-list'>
                <li className='nav-item'>
                <button className='nav-link'>
                <h3 onClick={handleAdminClick}><FontAwesomeIcon icon={faChartBar} />Inicio</h3>
                </button>
                </li>
                
                <li className='nav-item'>
                <button className='nav-link' onClick={handleUsersClick}>
                    <h3><FontAwesomeIcon icon={faUser} /> Usuarios</h3>
                </button>
                </li>

                <li className='nav-item'>
                <button className='nav-link' onClick={handleModeratorReviewClick}>
                    <h3><FontAwesomeIcon icon={faComment} /> Reseñas</h3>
                </button>
                </li>

                <li className='nav-item'>
                <button className='nav-link' onClick={handleDemandClick}>
                    <h3><FontAwesomeIcon icon={faInbox} /> Solicitudes</h3>
                </button>
                </li>

                <li className='nav-item'>
                <button className='nav-link' onClick={handleModeratorCategoryClick}>
                    <h3><FontAwesomeIcon icon={faFilter} /> Categorias</h3>
                </button>
                </li>

                <li className='nav-item'>
                <button className='nav-link' onClick={handleModeratorServicesClick}>
                    <h3><FontAwesomeIcon icon={faArrowAltCircleRight} /> Servicios</h3>
                </button>
                </li>
            </ul>
            </div>

            ) : (

            <>
            <div className='navOptions'>
                <ul className='nav-list'>
                <li className='nav-item'>
                    <button className='nav-link' onClick={handleExploreClick}>
                    <h3><FontAwesomeIcon icon={faEye} /> Explorar</h3>
                    </button>
                </li>

                <li className='nav-item'>
                    <button className='nav-link' onClick={handleFavoriteClick}>
                    <h3><FontAwesomeIcon icon={faHeart} /> Favoritos</h3>
                    </button>
                </li>

                <li className='nav-item'>
                    <button className='nav-link' onClick={handleRequestClick}>
                    <h3><FontAwesomeIcon icon={faInbox} /> Solicitudes</h3>
                    </button>
                </li>
                </ul>
            </div>

            {/* Submenú Categorías */}
            <div className='categories-menu-container'>
                <ul className='nav-list'>
                <li className='nav-item drop-down-parent'>
                    <button 
                    className={`dropdown-toggle-btn ${isCategoriesOpen ? 'is-open' : ''}`}
                    onClick={toggleCategories}
                    >
                    <span>Categorías</span>
                    <i className="arrow-icon">{isCategoriesOpen ? '▲' : '▼'}</i>
                    </button>

                    <div className={`submenu-wrapper ${isCategoriesOpen ? 'show' : ''}`}>
                    <ul className='submenu-list'>
                        {categorias.map(categoria => (
                        <li key={categoria.id} className="submenu-item">
                            <button 
                            className='submenu-link'
                            onClick={() => handleCategoryClick(categoria.id)}
                            >
                            {categoria.nombre}
                            </button>
                        </li>
                        ))}
                    </ul>
                    </div>

                </li>
                </ul>
            </div>
            </>

        )}
        </>
        

        
        
        {/* Sección del menú general*/}
        <div className='generalMenu'>
            <h3 className='text-muted'> General</h3>
            <button><FontAwesomeIcon icon={faGear} />Ajustes</button>
            <button onClick={() => handleAboutButton()}>Sobre nosotros</button>
        </div>
    </div>
  )
}

export default SidebarRender;