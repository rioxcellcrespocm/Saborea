function ModalBorrar({ id, setBorrando, borrarReceta, token }){

  return (
    <div className="modal-overlay" style={{ pointerEvents: "all" }}>

      <div className="modal-box">

        <h3>¿Eliminar receta?</h3>

        <div className="modal-actions">

          <button
            className="btn-danger"
            title="Eliminar receta definitivamente"
            onClick={()=>{
              fetch("http://localhost:3000/recetas/"+id,{
                method:"DELETE",
                headers:{
                  "Authorization":"Bearer "+token
                }
              }).then(()=>{
                borrarReceta(id)
                setBorrando(false)
              })
            }}
          >
            Eliminar
          </button>

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

export default ModalBorrar