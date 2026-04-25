// Importa hooks de React para manejar estado y contexto
import { useState, useContext } from "react"

// Importa el contexto global donde se guarda el token
import Contexto from "./Contexto"

// Hook de react-router para navegar entre páginas
import { useNavigate } from "react-router-dom"

function Login(){

  // Obtiene la función para actualizar el token global
  let { setToken } = useContext(Contexto)

  // Estados para guardar lo que el usuario escribe en los inputs
  let [usuario,setUsuario] = useState("")
  let [password,setPassword] = useState("")

  // Hook para redirigir a otra ruta
  const navigate = useNavigate()

  // Función que se ejecuta al hacer login
  function handleLogin(){

    // Petición al backend para autenticar usuario
    fetch("https://backend-762w.onrender.com/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {

      // Si no hay token, las credenciales son incorrectas
      if(!data.token){
        alert("Credenciales incorrectas")
        return
      }

      // Guarda el token en localStorage para mantener sesión
      localStorage.setItem("token", data.token)

      // Guarda el nombre del usuario (para mostrarlo en la app)
      localStorage.setItem("usuario", usuario)

      // Actualiza el token en el contexto global
      setToken(data.token)

      // Redirige a la página principal después del login
      navigate("/", { replace: true })
    })
  }

  return (
    <div className="login-container">

      <div className="card login-card">

        {/* Logo de la aplicación */}
        <img src="/logo.png" style={{width:"70px"}} />

        {/* Título */}
        <h2>Saborea</h2>

        {/* Input para el usuario */}
        <input
          placeholder="Usuario"
          value={usuario}
          onChange={e=>setUsuario(e.target.value)}
        />

        {/* Input para la contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        {/* Botón que ejecuta el login */}
        <button className="btn" onClick={handleLogin}>
          Login
        </button>

      </div>
    </div>
  )
}

// Exporta el componente para usarlo en las rutas
export default Login