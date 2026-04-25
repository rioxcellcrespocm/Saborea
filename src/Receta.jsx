// Importa hooks de React para usar contexto y estado
import { useContext, useState } from "react"

// Importa el contexto global (para acceder al token)
import Contexto from "./Contexto"

// Importa los modales para editar y borrar recetas
import ModalEditar from "./ModalEditar"
import ModalBorrar from "./ModalBorrar"

// Componente que representa una receta individual
function Receta({ _id, titulo, descripcion, ingredientes, pasos, borrarReceta, actualizarReceta }) {

  // Obtiene el token desde el contexto (necesario para peticiones protegidas)
  let { token } = useContext(Contexto)

  // Estado para controlar si se muestra el modal de edición
  let [editando, setEditando] = useState(false)

  // Estado para controlar si se muestra el modal de borrado
  let [borrando, setBorrando] = useState(false)

  return (
    <>
      {/* TARJETA DE LA RECETA */}
      <div className="card receta-card">

        {/* Título */}
        <div className="card-header">
          {titulo}
        </div>

        {/* Contenido */}
        <div className="card-body">

          {/* Descripción */}
          <p>{descripcion}</p>

          {/* Lista de ingredientes */}
          <b>Ingredientes:</b>
          <ul>
            {ingredientes?.map((i,index)=>(
              <li key={index}>{i}</li>
            ))}
          </ul>

          {/* Lista de pasos */}
          <b>Pasos:</b>
          <ol>
            {pasos?.map((p,index)=>(
              <li key={index}>
                {p.texto} ({p.tiempo} {p.unidad})
              </li>
            ))}
          </ol>

        </div>

        {/* BOTONES */}
        <div className="card-footer">

          {/* Botón editar */}
          <button
            className="btn"
            title="Editar receta"
            onClick={()=>setEditando(true)}
          >
            Editar
          </button>

          {/* Botón borrar */}
          <button
            className="btn-danger"
            title="Eliminar receta"
            onClick={()=>setBorrando(true)}
          >
            Borrar
          </button>

        </div>

      </div>

      {/* MODAL EDITAR */}
      {editando && (
        <ModalEditar
          receta={{ _id, titulo, descripcion, ingredientes, pasos }}
          setEditando={setEditando}
          actualizarReceta={actualizarReceta}
          token={token}
        />
      )}

      {/* MODAL BORRAR */}
      {borrando && (
        <ModalBorrar
          id={_id}
          setBorrando={setBorrando}
          borrarReceta={borrarReceta}
          token={token}
        />
      )}
    </>
  )
}

// Exporta el componente
export default Receta