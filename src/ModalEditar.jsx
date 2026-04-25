// Importa useState para manejar el estado interno del modal
import { useState } from "react"

// Modal para editar una receta existente
function ModalEditar({ receta, setEditando, actualizarReceta, token }) {

  // Estados inicializados con los datos de la receta
  let [titulo,setTitulo]=useState(receta.titulo)
  let [descripcion,setDescripcion]=useState(receta.descripcion)
  let [ingredientes,setIngredientes]=useState(receta.ingredientes || [])
  let [pasos,setPasos]=useState(receta.pasos || [])

  // Estados para nuevos ingredientes y pasos
  let [nuevoIng,setNuevoIng]=useState("")
  let [nuevoPaso,setNuevoPaso]=useState("")
  let [nuevoTiempo,setNuevoTiempo]=useState(0)
  let [nuevoUnidad,setNuevoUnidad]=useState("min")

  // Drag & drop ingredientes
  const [dragIng,setDragIng]=useState(null)

  // Reordenar ingredientes
  function dropIng(index){
    if(dragIng===null) return
    let copia=[...ingredientes]
    let item=copia[dragIng]
    copia.splice(dragIng,1)
    copia.splice(index,0,item)
    setIngredientes(copia)
    setDragIng(null)
  }

  // Drag & drop pasos
  const [dragPaso,setDragPaso]=useState(null)

  // Reordenar pasos
  function dropPaso(index){
    if(dragPaso===null) return
    let copia=[...pasos]
    let item=copia[dragPaso]
    copia.splice(dragPaso,1)
    copia.splice(index,0,item)
    setPasos(copia)
    setDragPaso(null)
  }

  return (
    <div className="modal-overlay" style={{ pointerEvents: "all" }}>
      <div className="modal-box">

        {/* Título del modal */}
        <h3>Editar receta</h3>

        {/* Inputs principales */}
        <input value={titulo} onChange={e=>setTitulo(e.target.value)} />
        <input value={descripcion} onChange={e=>setDescripcion(e.target.value)} />

        {/* INGREDIENTES */}
        <b>Ingredientes</b>

        {ingredientes.map((ing,i)=>(
          <div
            className="input-row"
            key={i}
            draggable
            onDragStart={()=>setDragIng(i)}
            onDragOver={(e)=>e.preventDefault()}
            onDrop={()=>dropIng(i)}
            style={{cursor:"grab"}}
          >
            {/* Editar ingrediente */}
            <input
              value={ing}
              onChange={e=>{
                let copia=[...ingredientes]
                copia[i]=e.target.value
                setIngredientes(copia)
              }}
            />

            {/* Eliminar ingrediente */}
            <button
              title="Eliminar ingrediente"
              onClick={()=>{
                setIngredientes(ingredientes.filter((_,index)=>index!==i))
              }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Añadir nuevo ingrediente */}
        <div className="input-row">
          <input
            placeholder="nuevo ingrediente"
            value={nuevoIng}
            onChange={e=>setNuevoIng(e.target.value)}
          />
          <button
            title="Agregar ingrediente"
            onClick={()=>{
              if(!nuevoIng.trim()) return
              setIngredientes([...ingredientes,nuevoIng])
              setNuevoIng("")
            }}
          >
            +
          </button>
        </div>

        {/* PASOS */}
        <b>Pasos</b>

        {pasos.map((p,i)=>(
          <div
            className="input-row"
            key={i}
            draggable
            onDragStart={()=>setDragPaso(i)}
            onDragOver={(e)=>e.preventDefault()}
            onDrop={()=>dropPaso(i)}
            style={{cursor:"grab"}}
          >

            {/* Texto del paso */}
            <input
              value={p.texto}
              onChange={e=>{
                let copia=[...pasos]
                copia[i].texto=e.target.value
                setPasos(copia)
              }}
            />

            {/* Tiempo */}
            <input
              type="number"
              min="0"
              value={p.tiempo}
              onChange={e=>{
                let copia=[...pasos]
                copia[i].tiempo=Math.max(0,Number(e.target.value))
                setPasos(copia)
              }}
            />

            {/* Unidad */}
            <select
              value={p.unidad}
              onChange={e=>{
                let copia=[...pasos]
                copia[i].unidad=e.target.value
                setPasos(copia)
              }}
            >
              <option value="seg">Seg</option>
              <option value="min">Min</option>
              <option value="hr">Hr</option>
            </select>

            {/* Duplicar paso */}
            <button
              title="Duplicar paso"
              onClick={()=>{
                let copia=[...pasos]
                copia.splice(i+1,0,{...p})
                setPasos(copia)
              }}
            >
              ⧉
            </button>

            {/* Eliminar paso */}
            <button
              title="Eliminar paso"
              onClick={()=>{
                setPasos(pasos.filter((_,index)=>index!==i))
              }}
            >
              ×
            </button>

          </div>
        ))}

        {/* Añadir nuevo paso */}
        <div className="input-row">
          <input
            placeholder="nuevo paso"
            value={nuevoPaso}
            onChange={e=>setNuevoPaso(e.target.value)}
          />

          <input
            type="number"
            value={nuevoTiempo}
            onChange={e=>setNuevoTiempo(e.target.value)}
          />

          <select
            value={nuevoUnidad}
            onChange={e=>setNuevoUnidad(e.target.value)}
          >
            <option value="seg">Seg</option>
            <option value="min">Min</option>
            <option value="hr">Hr</option>
          </select>

          <button
            title="Agregar paso"
            onClick={()=>{
              if(!nuevoPaso.trim()) return
              setPasos([
                ...pasos,
                { texto:nuevoPaso, tiempo:nuevoTiempo, unidad:nuevoUnidad }
              ])
              setNuevoPaso("")
              setNuevoTiempo(0)
            }}
          >
            +
          </button>
        </div>

        {/* ACCIONES */}
        <div className="modal-actions">

          {/* Guardar cambios */}
          <button
            className="btn"
            title="Guardar cambios"
            onClick={()=>{
              fetch("https://backend-762w.onrender.com/recetas/"+receta._id,{
                method:"PATCH",
                headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+token
                },
                body:JSON.stringify({
                  titulo,
                  descripcion,
                  ingredientes,
                  pasos
                })
              })
              .then(()=>{
                // Actualiza la receta en el frontend
                actualizarReceta(receta._id,{
                  titulo,
                  descripcion,
                  ingredientes,
                  pasos
                })

                // Cierra el modal
                setEditando(false)
              })
            }}
          >
            Guardar
          </button>

          {/* Cancelar */}
          <button
            className="btn-secondary"
            title="Cancelar edición"
            onClick={()=>setEditando(false)}
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  )
}

// Exporta el componente
export default ModalEditar