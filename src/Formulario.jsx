import { useState } from "react"

function Formulario({ crearReceta }) {

  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const [ingrediente, setIngrediente] = useState("")
  const [ingredientes, setIngredientes] = useState([])

  const [paso, setPaso] = useState("")
  const [tiempo, setTiempo] = useState(0)
  const [unidad, setUnidad] = useState("min")
  const [pasos, setPasos] = useState([])

  const [dragIng, setDragIng] = useState(null)

  function dropIngrediente(index){
    if(dragIng === null) return
    let copia = [...ingredientes]
    let item = copia[dragIng]
    copia.splice(dragIng,1)
    copia.splice(index,0,item)
    setIngredientes(copia)
    setDragIng(null)
  }

  const [dragPaso, setDragPaso] = useState(null)

  function dropPaso(index){
    if(dragPaso === null) return
    let copia = [...pasos]
    let item = copia[dragPaso]
    copia.splice(dragPaso,1)
    copia.splice(index,0,item)
    setPasos(copia)
    setDragPaso(null)
  }

  function agregarIngrediente() {
    if (!ingrediente.trim()) return
    setIngredientes([...ingredientes, ingrediente])
    setIngrediente("")
  }

  function agregarPaso() {
    if (!paso.trim()) return
    setPasos([...pasos, { texto: paso, tiempo, unidad }])
    setPaso("")
    setTiempo(0)
  }

  function handleSubmit() {
    if (!titulo.trim()) return
    if (ingredientes.length === 0) return
    if (pasos.length === 0) return

    fetch("http://localhost:3000/recetas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        titulo,
        descripcion,
        ingredientes,
        pasos
      })
    })
    .then(res => res.json())
    .then(data => {

      const nueva = {
        _id: data._id || Date.now(),
        titulo,
        descripcion,
        ingredientes,
        pasos
      }

      crearReceta(nueva)

      setTitulo("")
      setDescripcion("")
      setIngrediente("")
      setIngredientes([])
      setPaso("")
      setTiempo(0)
      setPasos([])
    })
  }

  return (
    <div>

      <input
        placeholder="titulo"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
      />

      <input
        placeholder="descripcion"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
      />

      <input
        placeholder="ingrediente"
        value={ingrediente}
        onChange={e => setIngrediente(e.target.value)}
      />

      <button title="Agregar ingrediente" onClick={agregarIngrediente}>
        Agregar ingrediente
      </button>

      <div style={{ marginTop: "10px", marginBottom: "15px" }}>
        {ingredientes.map((ing, i) => (
          <div
            className="input-row"
            key={i}
            draggable
            onDragStart={()=>setDragIng(i)}
            onDragOver={(e)=>e.preventDefault()}
            onDrop={()=>dropIngrediente(i)}
            style={{ cursor:"grab" }}
          >
            <span style={{ flex: 1 }}>• {ing}</span>

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
      </div>

      <input
        placeholder="paso"
        value={paso}
        onChange={e => setPaso(e.target.value)}
      />

      <div className="input-row">
        <input
          type="number"
          value={tiempo}
          onChange={e => setTiempo(e.target.value)}
        />

        <select
          value={unidad}
          onChange={e => setUnidad(e.target.value)}
        >
          <option value="seg">Seg</option>
          <option value="min">Min</option>
          <option value="hr">Hr</option>
        </select>
      </div>

      <button title="Agregar paso" onClick={agregarPaso}>
        Agregar paso
      </button>

      <div style={{ marginTop: "10px", marginBottom: "15px" }}>
        {pasos.map((p, i) => (
          <div
            className="input-row"
            key={i}
            draggable
            onDragStart={()=>setDragPaso(i)}
            onDragOver={(e)=>e.preventDefault()}
            onDrop={()=>dropPaso(i)}
            style={{ cursor:"grab" }}
          >
            <span style={{ flex: 1 }}>
              {i + 1}. {p.texto} ({p.tiempo} {p.unidad})
            </span>

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
      </div>

      <button title="Crear receta" onClick={handleSubmit}>
        Crear receta
      </button>

    </div>
  )
}

export default Formulario