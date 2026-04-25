import { useContext, useState } from "react"
import Contexto from "./Contexto"
import ModalEditar from "./ModalEditar"
import ModalBorrar from "./ModalBorrar"

function Receta({ _id, titulo, descripcion, ingredientes, pasos, borrarReceta, actualizarReceta }) {

  let { token } = useContext(Contexto)

  let [editando, setEditando] = useState(false)
  let [borrando, setBorrando] = useState(false)

  return (
    <>
      <div className="card receta-card">

        <div className="card-header">
          {titulo}
        </div>

        <div className="card-body">

          <p>{descripcion}</p>

          <b>Ingredientes:</b>
          <ul>
            {ingredientes?.map((i,index)=>(
              <li key={index}>{i}</li>
            ))}
          </ul>

          <b>Pasos:</b>
          <ol>
            {pasos?.map((p,index)=>(
              <li key={index}>
                {p.texto} ({p.tiempo} {p.unidad})
              </li>
            ))}
          </ol>

        </div>

        <div className="card-footer">
          <button
            className="btn"
            title="Editar receta"
            onClick={()=>setEditando(true)}
          >
            Editar
          </button>

          <button
            className="btn-danger"
            title="Eliminar receta"
            onClick={()=>setBorrando(true)}
          >
            Borrar
          </button>
        </div>

      </div>

      {editando && (
        <ModalEditar
          receta={{ _id, titulo, descripcion, ingredientes, pasos }}
          setEditando={setEditando}
          actualizarReceta={actualizarReceta}
          token={token}
        />
      )}

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

export default Receta