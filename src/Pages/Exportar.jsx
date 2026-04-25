// Importa hooks de React
import { useContext, useEffect, useState } from "react"

// Importa navegación
import { Navigate, Link } from "react-router-dom"

// Contexto global (token)
import Contexto from "../Contexto"

// Librería para generar PDFs
import jsPDF from "jspdf"

function Exportar(){

  // Token y setter desde el contexto
  const { token, setToken } = useContext(Contexto)

  // Estado de recetas
  const [recetas, setRecetas] = useState([])

  // Estado menú hamburguesa
  const [menuOpen, setMenuOpen] = useState(false)

  // Usuario desde localStorage
  const usuario = localStorage.getItem("usuario")

  // Carga recetas del backend
  useEffect(() => {

    if(!token) return

    fetch("https://backend-762w.onrender.com/recetas",{
      headers:{
        Authorization: "Bearer " + token
      }
    })
    .then(res => res.json())
    .then(data => setRecetas(data))

  }, [token])

  // Logout
  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    setToken(null)
  }

  // Protección de ruta
  if(!token) return <Navigate to="/login" />

  // Función para generar PDF
  async function descargarPDF(){

    const pdf = new jsPDF()
    let y = 20

    // Cargar logo
    const img = new Image()
    img.src = "/logo.png"

    await new Promise((resolve) => {
      img.onload = resolve
    })

    // Añadir logo
    pdf.addImage(img, "PNG", 85, y, 40, 40)

    y += 50

    // Título
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(18)
    pdf.text("Recetario Saborea", 105, y, { align: "center" })

    y += 15

    // Recorrer recetas
    recetas.forEach((r, index) => {

      // Título receta
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(14)
      pdf.text(`${index + 1}. ${r.titulo}`, 10, y)

      y += 6

      // Descripción
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)

      const descripcion = pdf.splitTextToSize(
        `Descripción: ${r.descripcion}`,
        180
      )

      pdf.text(descripcion, 10, y)

      y += descripcion.length * 5 + 4

      const startY = y

      // Ingredientes (columna izquierda)
      pdf.setFont("helvetica", "bold")
      pdf.text("Ingredientes:", 10, startY)

      pdf.setFont("helvetica", "normal")

      let yLeft = startY + 5

      r.ingredientes?.forEach((ing) => {
        const linea = pdf.splitTextToSize(`- ${ing}`, 80)
        pdf.text(linea, 12, yLeft)
        yLeft += linea.length * 5
      })

      // Pasos (columna derecha)
      pdf.setFont("helvetica", "bold")
      pdf.text("Pasos:", 110, startY)

      pdf.setFont("helvetica", "normal")

      let yRight = startY + 5

      r.pasos?.forEach((p, i) => {
        const textoPaso = pdf.splitTextToSize(
          `${i + 1}. ${p.texto}`,
          80
        )

        pdf.text(textoPaso, 110, yRight)
        yRight += textoPaso.length * 5
      })

      // Ajustar altura
      y = Math.max(yLeft, yRight) + 10

      // Línea separadora
      pdf.setDrawColor(180)
      pdf.line(10, y - 5, 200, y - 5)

      // Nueva página si se llena
      if (y > 260) {
        pdf.addPage()
        y = 20
      }

    })

    // Guardar PDF
    pdf.save("recetas.pdf")
  }

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

        {/* MENÚ HAMBURGUESA */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* MENÚ */}
        <div className={`menu ${menuOpen ? "active" : ""}`}>
          <Link to="/">Inicio</Link>
          <Link to="/recetas">Recetas</Link>
          <Link to="/exportar">Exportar</Link>

          <button className="btn-logout mobile-only" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        {/* LOGOUT DESKTOP */}
        <div className="header-right desktop-only">
          <button className="btn-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

      </div>

      {/* CONTENIDO */}
      <div className="exportar-container">

        <h1 className="exportar-title">Exportar recetas</h1>

        {/* Botón generar PDF */}
        <button className="btn" onClick={descargarPDF}>
          Descargar PDF
        </button>

      </div>

    </div>
  )
}

export default Exportar