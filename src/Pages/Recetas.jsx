import { useState, useEffect, useContext } from "react"
import { Navigate, Link } from "react-router-dom"
import Contexto from "../Contexto"
import Formulario from "../Formulario"
import Receta from "../Receta"

function Recetas() {

  const { token, setToken } = useContext(Contexto)

  const [recetas, setRecetas] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [menuOpen, setMenuOpen] = useState(false) // 🔥 NUEVO

  const usuario = localStorage.getItem("usuario")

  useEffect(() => {

    if (!token) return

    fetch("http://localhost:3000/recetas", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setRecetas(data))

  }, [token])

  function crearReceta(receta) {
    setRecetas([...recetas, receta])
  }

  function borrarReceta(id) {
    setRecetas(recetas.filter(r => r._id !== id))
  }

  function actualizarReceta(id, nueva) {
    setRecetas(
      recetas.map(r => r._id === id ? { ...r, ...nueva } : r)
    )
  }

  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    setToken(null)
  }

  if (!token) return <Navigate to="/login" />

  const recetasFiltradas = recetas.filter(r =>
    (r?.titulo || "").toLowerCase().includes((busqueda || "").toLowerCase())
  )

  return (
    <div>

      <div className="header">

        {/* LOGO */}
        <div className="header-left">
          <img src="/logo.png" className="logo-img" />
          <span className="logo-text">Saborea</span>
        </div>

        {/* BIENVENIDO */}
        <div className="welcome">
          Bienvenido, <b>{usuario}</b>
        </div>

        {/* 🔥 HAMBURGUESA */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* 🔥 MENU */}
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
          <button
            className="btn-logout"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>

      </div>

      <div className="buscador">
        <input
          placeholder="Buscar receta..."
          value={busqueda}
          onChange={(e)=>setBusqueda(e.target.value)}
        />
      </div>

      <div className="main">

        <div className="sidebar">
          <div className="card">
            <h3>Agregar receta</h3>
            <Formulario crearReceta={crearReceta} />
          </div>
        </div>

        <div className="content">
          {recetasFiltradas.map(r => (
            <Receta
              key={r._id}
              {...r}
              borrarReceta={borrarReceta}
              actualizarReceta={actualizarReceta}
            />
          ))}
        </div>

      </div>

    </div>
  )
}

export default Recetas