// Importa useState para manejar el estado del formulario
import { useState } from "react"

// Componente que permite crear una nueva receta
function Formulario({ crearReceta }) {

  // Estados básicos de la receta
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")

  // Estados para ingredientes
  const [ingrediente, setIngrediente] = useState("")
  const [ingredientes, setIngredientes] = useState([])

  // Estados para pasos
  const [paso, setPaso] = useState("")
  const [tiempo, setTiempo] = useState(0)
  const [unidad, setUnidad] = useState("min")
  const [pasos, setPasos] = useState([])

  // Estado para drag & drop de ingredientes
  const [dragIng, setDragIng] = useState(null)

  // Reordenar ingredientes al soltar
  function dropIngrediente(index){
    if(dragIng === null) return
    let copia = [...ingredientes]
    let item = copia[dragIng]
    copia.splice(dragIng,1)
    copia.splice(index,0,item)
    setIngredientes(copia)
    setDragIng(null)
  }

  // Estado para drag & drop de pasos
  const [dragPaso, setDragPaso] = useState(null)

  // Reordenar pasos al soltar
  function dropPaso(index){
    if(dragPaso === null) return
    let copia = [...pasos]
    let item = copia[dragPaso]
    copia.splice(dragPaso,1)
    copia.splice(index,0,item)
    setPasos(copia)
    setDragPaso(null)
  }

  // Añade un ingrediente a la lista
  function agregarIngrediente() {
    if (!ingrediente.trim()) return
    setIngredientes([...ingredientes, ingrediente])
    setIngrediente("")
  }

  // Añade un paso a la receta
  function agregarPaso() {
    if (!paso.trim()) return
    setPasos([...pasos, { texto: paso, tiempo, unidad }])
    setPaso("")
    setTiempo(0)
  }

  // Envía la receta al backend
  function handleSubmit() {
    // Validaciones básicas
    if (!titulo.trim()) return
    if (ingredientes.length === 0) return
    if (pasos.length === 0) return

    // Petición POST al backend
    fetch("https://backend-762w.onrender.com/recetas", {
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

      // Crea la receta localmente para actualizar la UI
      const nueva = {
        _id: data._id || Date.now(),
        titulo,
        descripcion,
        ingredientes,
        pasos
      }

      // Llama a la función del padre para añadirla al estado global
      crearReceta(nueva)

      // Resetea el formulario
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

      {/* Input título */}
      <input
        placeholder="titulo"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
      />

      {/* Input descripción */}
      <input
        placeholder="descripcion"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
      />

      {/* Input ingrediente */}
      <input
        placeholder="ingrediente"
        value={ingrediente}
        onChange={e => setIngrediente(e.target.value)}
      />

      {/* Botón añadir ingrediente */}
      <button title="Agregar ingrediente" onClick={agregarIngrediente}>
        Agregar ingrediente
      </button>

      {/* Lista de ingredientes */}
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
      </div>

      {/* Input paso */}
      <input
        placeholder="paso"
        value={paso}
        onChange={e => setPaso(e.target.value)}
      />

      {/* Tiempo + unidad */}
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

      {/* Botón añadir paso */}
      <button title="Agregar paso" onClick={agregarPaso}>
        Agregar paso
      </button>

      {/* Lista de pasos */}
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
      </div>

      {/* Botón crear receta */}
      <button title="Crear receta" onClick={handleSubmit}>
        Crear receta
      </button>

    </div>
  )
}

// Exporta el componente
export default Formulario