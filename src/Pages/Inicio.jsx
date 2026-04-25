import { useContext, useState } from "react"
import { Navigate, Link } from "react-router-dom"
import Contexto from "../Contexto"

function Inicio(){

  const { token, setToken } = useContext(Contexto)
  const [menuOpen, setMenuOpen] = useState(false)

  const usuario = localStorage.getItem("usuario")

  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    setToken(null)
  }

  if(!token) return <Navigate to="/login" />

  return (
    <div>

      {/* HEADER */}
      <div className="header">

        <div className="header-left">
          <img src="/logo.png" className="logo-img" />
          <span className="logo-text">Saborea</span>
        </div>

        <div className="welcome">
          Bienvenido, <b>{usuario}</b>
        </div>

        {/* HAMBURGUESA */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* MENU */}
        <div className={`menu ${menuOpen ? "active" : ""}`}>
          <Link to="/">Inicio</Link>
          <Link to="/recetas">Recetas</Link>
          <Link to="/exportar">Exportar</Link>

          {/* 🔥 logout móvil */}
          <button className="btn-logout mobile-only" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        {/* 🔥 logout desktop */}
        <div className="header-right desktop-only">
          <button className="btn-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

      </div>

      {/* HERO */}
      <div className="inicio-hero">

        <img src="/fondo.png" className="hero-bg" />
        <div className="hero-overlay"></div>

        <img src="/chef.png" className="chef-img" />

        <img src="/pasta.png" className="plato plato1" />
        <img src="/postre.png" className="plato plato2" />
        <img src="/hamburguesa.png" className="plato plato3" />

        <div className="hero-content">
          <h1>Bienvenido a Saborea</h1>
          <p>gestiona tus recetas fácilmente</p>

          <Link to="/recetas" className="btn hero-btn">
            Gestionar recetas
          </Link>
        </div>

      </div>

    </div>
  )
}

export default Inicio