// Modal para confirmar la eliminación de una receta
function ModalBorrar({ id, setBorrando, borrarReceta, token }){

  return (
    // Fondo oscuro que cubre toda la pantalla
    <div className="modal-overlay" style={{ pointerEvents: "all" }}>

      {/* Caja del modal */}
      <div className="modal-box">

        {/* Título */}
        <h3>¿Eliminar receta?</h3>

        {/* Acciones */}
        <div className="modal-actions">

          {/* Botón para eliminar la receta */}
          <button
            className="btn-danger"
            title="Eliminar receta definitivamente"
            onClick={()=>{
              // Petición DELETE al backend
              fetch("https://backend-762w.onrender.com/recetas/"+id,{
                method:"DELETE",
                headers:{
                  "Authorization":"Bearer "+token
                }
              }).then(()=>{
                // Elimina la receta del estado en el frontend
                borrarReceta(id)

                // Cierra el modal
                setBorrando(false)
              })
            }}
          >
            Eliminar
          </button>

          {/* Botón cancelar */}
          <button
            className="btn-secondary"
            title="Cancelar acción"
            onClick={()=>setBorrando(false)}
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  )
}

// Exporta el componente
export default ModalBorrar