// Importa hooks de React para usar contexto y estado
import { useContext, useState } from "react"

// Importa herramientas de navegación
import { Navigate, Link } from "react-router-dom"

// Importa el contexto global (para acceder al token)
import Contexto from "../Contexto"

function Inicio(){

  // Obtiene el token y la función para actualizarlo
  const { token, setToken } = useContext(Contexto)

  // Estado para controlar si el menú hamburguesa está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false)

  // Obtiene el nombre del usuario desde localStorage
  const usuario = localStorage.getItem("usuario")

  // Función para cerrar sesión
  function logout(){
    // Elimina los datos del usuario del almacenamiento local
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")

    // Limpia el token del contexto global
    setToken(null)
  }

  // Si no hay token, redirige automáticamente al login
  if(!token) return <Navigate to="/login" />

  return (
    <div>

      {/* HEADER */}
      <div className="header">

        {/* Logo */}
        <div className="header-left">
          <img src="/logo.png" className="logo-img" />
          <span className="logo-text">Saborea</span>
        </div>

        {/* Mensaje de bienvenida con el usuario */}
        <div className="welcome">
          Bienvenido, <b>{usuario}</b>
        </div>

        {/* Botón de menú hamburguesa (para móvil) */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* Menú de navegación */}
        <div className={`menu ${menuOpen ? "active" : ""}`}>
          <Link to="/">Inicio</Link>
          <Link to="/recetas">Recetas</Link>
          <Link to="/exportar">Exportar</Link>

          {/* Botón de logout en versión móvil */}
          <button className="btn-logout mobile-only" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        {/* Botón de logout en versión escritorio */}
        <div className="header-right desktop-only">
          <button className="btn-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

      </div>

      {/* HERO (pantalla principal visual) */}
      <div className="inicio-hero">

        {/* Imagen de fondo */}
        <img src="/fondo.png" className="hero-bg" />

        {/* Capa oscura encima del fondo */}
        <div className="hero-overlay"></div>

        {/* Imagen del chef */}
        <img src="/chef.png" className="chef-img" />

        {/* Elementos decorativos (platos) */}
        <img src="/pasta.png" className="plato plato1" />
        <img src="/postre.png" className="plato plato2" />
        <img src="/hamburguesa.png" className="plato plato3" />

        {/* Contenido principal */}
        <div className="hero-content">
          <h1>Bienvenido a Saborea</h1>
          <p>gestiona tus recetas fácilmente</p>

          {/* Botón que lleva a la sección de recetas */}
          <Link to="/recetas" className="btn hero-btn">
            Gestionar recetas
          </Link>
        </div>

      </div>

    </div>
  )
}

// Exporta el componente
export default Inicio