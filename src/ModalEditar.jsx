import { useState } from "react"

function ModalEditar({ receta, setEditando, actualizarReceta, token }) {

  let [titulo,setTitulo]=useState(receta.titulo)
  let [descripcion,setDescripcion]=useState(receta.descripcion)
  let [ingredientes,setIngredientes]=useState(receta.ingredientes || [])
  let [pasos,setPasos]=useState(receta.pasos || [])

  let [nuevoIng,setNuevoIng]=useState("")
  let [nuevoPaso,setNuevoPaso]=useState("")
  let [nuevoTiempo,setNuevoTiempo]=useState(0)
  let [nuevoUnidad,setNuevoUnidad]=useState("min")

  const [dragIng,setDragIng]=useState(null)

  function dropIng(index){
    if(dragIng===null) return
    let copia=[...ingredientes]
    let item=copia[dragIng]
    copia.splice(dragIng,1)
    copia.splice(index,0,item)
    setIngredientes(copia)
    setDragIng(null)
  }

  const [dragPaso,setDragPaso]=useState(null)

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

        <h3>Editar receta</h3>

        <input value={titulo} onChange={e=>setTitulo(e.target.value)} />
        <input value={descripcion} onChange={e=>setDescripcion(e.target.value)} />

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
            <input
              value={ing}
              onChange={e=>{
                let copia=[...ingredientes]
                copia[i]=e.target.value
                setIngredientes(copia)
              }}
            />

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

            <input
              value={p.texto}
              onChange={e=>{
                let copia=[...pasos]
                copia[i].texto=e.target.value
                setPasos(copia)
              }}
            />

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

        <div className="modal-actions">

          <button
            className="btn"
            title="Guardar cambios"
            onClick={()=>{
              fetch("http://localhost:3000/recetas/"+receta._id,{
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
                actualizarReceta(receta._id,{
                  titulo,
                  descripcion,
                  ingredientes,
                  pasos
                })
                setEditando(false)
              })
            }}
          >
            Guardar
          </button>

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

export default ModalEditar