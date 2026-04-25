// Importa StrictMode para detectar posibles problemas en desarrollo
// y useState para manejar el estado del token
import { StrictMode, useState } from 'react'

// Función para renderizar la app en el DOM
import { createRoot } from 'react-dom/client'

// Estilos globales
import './index.css'

// Importa herramientas de react-router para manejar rutas
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Contexto global donde se guarda el token
import Contexto from './Contexto'

// Importación de páginas
import Inicio from './Pages/Inicio'
import Recetas from './Pages/Recetas'
import Exportar from './Pages/Exportar'

// Componente de login
import Login from './Login'

// Componente raíz de la aplicación
function Root(){

  // Estado global del token
  // Se inicializa leyendo el token guardado en localStorage (si existe)
  const [token, setToken] = useState(() => localStorage.getItem("token"))

  return (
    // Proveedor de contexto para que toda la app tenga acceso al token
    <Contexto.Provider value={{ token, setToken }}>
      
      {/* Router que maneja las rutas de la aplicación */}
      <RouterProvider router={router} />

    </Contexto.Provider>
  )
}

// Definición de rutas de la aplicación
const router = createBrowserRouter([
  { path: "/", element: <Inicio /> },       // Página principal
  { path: "/recetas", element: <Recetas /> }, // Página de gestión de recetas
  { path: "/exportar", element: <Exportar /> }, // Página de exportación
  { path: "/login", element: <Login /> }   // Página de login
])

// Renderiza la aplicación en el elemento con id "root" del index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)