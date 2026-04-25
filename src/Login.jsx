// Importa hooks de React para manejar estado y contexto
import { useState, useContext } from "react"

// Importa el contexto global donde se guarda el token
import Contexto from "./Contexto"

// Hook de react-router para navegar entre páginas
import { useNavigate } from "react-router-dom"

function Login(){

  // Obtiene la función para actualizar el token global (login global)
  let { setToken } = useContext(Contexto)

  // Estados para inputs del formulario
  let [usuario,setUsuario] = useState("")
  let [password,setPassword] = useState("")

  // Estado para mostrar mensajes de error en pantalla
  let [error,setError] = useState("")

  // Hook para redirigir después del login
  const navigate = useNavigate()

  // Función que se ejecuta al hacer clic en "Login"
  function handleLogin(){

    // Petición al backend para autenticar usuario
    fetch("https://backend-762w.onrender.com/login",{
      method:"POST", // método POST para enviar datos
      headers:{ "Content-Type":"application/json" }, // indicamos que enviamos JSON
      body:JSON.stringify({ usuario, password }) // enviamos usuario y contraseña
    })
    .then(async res => {

      // Si la respuesta NO es correcta (ej: 401, 403)
      if (!res.ok) {
        const text = await res.text() // leemos respuesta como texto (evita error JSON)
        throw new Error("Usuario o contraseña incorrecta") // lanzamos error controlado
      }

      // Convertimos la respuesta a JSON
      const data = await res.json()

      // Si no viene token, también es error de credenciales
      if(!data.token){
        throw new Error("Usuario o contraseña incorrecta")
      }

      return data
    })
    .then(data => {

      // Limpiamos mensaje de error si todo fue bien
      setError("")

      // Guardamos el token en localStorage (persistencia de sesión)
      localStorage.setItem("token", data.token)

      // Guardamos el usuario para usarlo en la app
      localStorage.setItem("usuario", usuario)

      // Actualizamos el token en el contexto global
      setToken(data.token)

      // Redirigimos a la página principal
      navigate("/", { replace: true })
    })
    .catch(err => {
      // Mostramos el error en pantalla
      setError(err.message)
    })
  }

  return (
    <div className="login-container">

      <div className="card login-card">

        {/* Logo de la app */}
        <img src="/logo.png" style={{width:"70px"}} />

        {/* Título */}
        <h2>Saborea</h2>

        {/* Input de usuario */}
        <input
          placeholder="Usuario"
          value={usuario}
          onChange={e=>{
            setUsuario(e.target.value) // actualiza estado usuario
            setError("") // limpia error al escribir
          }}
        />

        {/* Input de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e=>{
            setPassword(e.target.value) // actualiza contraseña
            setError("") // limpia error al escribir
          }}
        />

        {/* Botón de login */}
        <button className="btn" onClick={handleLogin}>
          Login
        </button>

        {/* Mensaje de error si existe */}
        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

      </div>
    </div>
  )
}

// Exporta el componente
export default Login