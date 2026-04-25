// Importa la función para crear un contexto global en React
import { createContext } from "react";

// Crea el contexto que se usará para compartir datos (como el token)
// entre distintos componentes sin necesidad de pasarlos por props
const Contexto = createContext();

// Exporta el contexto para poder usarlo en toda la aplicación
export default Contexto;