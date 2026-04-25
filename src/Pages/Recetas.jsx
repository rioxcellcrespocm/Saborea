// Importa hooks de React para manejar estado, efectos y contexto
import { useState, useEffect, useContext } from "react"

// Importa herramientas de navegación
import { Navigate, Link } from "react-router-dom"

// Importa el contexto global (token)
import Contexto from "../Contexto"

// Importa componentes hijos
import Formulario from "../Formulario"
import Receta from "../Receta"

function Recetas() {

  // Obtiene el token y la función para actualizarlo
  const { token, setToken } = useContext(Contexto)

  // Estado para guardar las recetas
  const [recetas, setRecetas] = useState([])

  // Estado para el buscador
  const [busqueda, setBusqueda] = useState("")

  // Estado para controlar el menú hamburguesa
  const [menuOpen, setMenuOpen] = useState(false)

  // Obtiene el nombre del usuario desde localStorage
  const usuario = localStorage.getItem("usuario")

  // useEffect que se ejecuta cuando cambia el token
  useEffect(() => {

    // Si no hay token, no hace la petición
    if (!token) return

    // Petición al backend para obtener las recetas del usuario
    fetch("https://backend-762w.onrender.com/recetas", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setRecetas(data))

  }, [token])

  // Añade una nueva receta al estado
  function crearReceta(receta) {
    setRecetas([...recetas, receta])
  }

  // Elimina una receta del estado
  function borrarReceta(id) {
    setRecetas(recetas.filter(r => r._id !== id))
  }

  // Actualiza una receta en el estado
  function actualizarReceta(id, nueva) {
    setRecetas(
      recetas.map(r => r._id === id ? { ...r, ...nueva } : r)
    )
  }

  // Cierra sesión eliminando datos del usuario
  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    setToken(null)
  }

  // Si no hay token, redirige al login
  if (!token) return <Navigate to="/login" />

  // Filtra las recetas según el texto de búsqueda
  const recetasFiltradas = recetas.filter(r =>
    (r?.titulo || "").toLowerCase().includes((busqueda || "").toLowerCase())
  )

  return (
    <div>

      {/* HEADER */}
      <div className="header">

        {/* Logo */}
        <div className="header-left">
          <img src="/logo.png" className="logo-img" />
          <span className="logo-text">Saborea</span>
        </div>

        {/* Bienvenida */}
        <div className="welcome">
          Bienvenido, <b>{usuario}</b>
        </div>

        {/* Menú hamburguesa */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* Menú navegación */}
        <div className={`menu ${menuOpen ? "active" : ""}`}>
          <Link to="/">Inicio</Link>
          <Link to="/recetas">Recetas</Link>
          <Link to="/exportar">Exportar</Link>

          {/* Logout móvil */}
          <button className="btn-logout mobile-only" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        {/* Logout escritorio */}
        <div className="header-right desktop-only">
          <button
            className="btn-logout"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>

      </div>

      {/* BUSCADOR */}
      <div className="buscador">
        <input
          placeholder="Buscar receta..."
          value={busqueda}
          onChange={(e)=>setBusqueda(e.target.value)}
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main">

        {/* FORMULARIO */}
        <div className="sidebar">
          <div className="card">
            <h3>Agregar receta</h3>

            {/* Componente formulario que crea recetas */}
            <Formulario crearReceta={crearReceta} />
          </div>
        </div>

        {/* LISTADO DE RECETAS */}
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

// Exporta el componente
export default Recetas