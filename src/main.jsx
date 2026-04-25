import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Contexto from './Contexto'
import Inicio from './Pages/Inicio'
import Recetas from './Pages/Recetas'
import Exportar from './Pages/Exportar'
import Login from './Login'

function Root(){

  const [token, setToken] = useState(() => localStorage.getItem("token"))

  return (
    <Contexto.Provider value={{ token, setToken }}>
      <RouterProvider router={router} />
    </Contexto.Provider>
  )
}

const router = createBrowserRouter([
  { path: "/", element: <Inicio /> },
  { path: "/recetas", element: <Recetas /> },
  { path: "/exportar", element: <Exportar /> },
  { path: "/login", element: <Login /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)