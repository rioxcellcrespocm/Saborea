import { useState, useContext } from "react"
import Contexto from "./Contexto"
import { useNavigate } from "react-router-dom"

function Login(){

  let { setToken } = useContext(Contexto)

  let [usuario,setUsuario] = useState("")
  let [password,setPassword] = useState("")

  const navigate = useNavigate()

  function handleLogin(){

    fetch("http://localhost:3000/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {

      if(!data.token){
        alert("Credenciales incorrectas")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", usuario)

      setToken(data.token)

      // 🔥 AQUÍ ESTABA EL ERROR
      navigate("/", { replace: true })
    })
  }

  return (
    <div className="login-container">

      <div className="card login-card">

        <img src="/logo.png" style={{width:"70px"}} />
        <h2>Saborea</h2>

        <input
          placeholder="Usuario"
          value={usuario}
          onChange={e=>setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <button className="btn" onClick={handleLogin}>
          Login
        </button>

      </div>
    </div>
  )
}

export default Login