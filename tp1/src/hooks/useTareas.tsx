import { useShallow } from "zustand/shallow"
import { tareaStore } from "../store/tareaStore"
import { editarTarea, eliminarTareaPorID, getAllTareas, postNuevaTarea  } from "../http/tareas"
import { ITarea } from "../types/ITarea"
import Swal from "sweetalert2"


export const useTareas = () => {

    const {
        tareas, 
        setArrayTareas, 
        agregarNuevaTarea, 
        eliminarUnaTarea, 
        editarUnaTarea
    } = tareaStore(useShallow((state) => ({
        tareas: state.tareas,
        setArrayTareas: state.setArrayTareas,
        agregarNuevaTarea: state.agregarNuevaTarea,
        eliminarUnaTarea: state.eliminarUnaTarea,
        editarUnaTarea: state.editarUnaTarea
    }))
)

    const getTareas = async() => {
            const data = await getAllTareas()
            if(data)setArrayTareas(data)  
        }

        const crearTarea = async (nuevaTarea:ITarea) => {
            agregarNuevaTarea(nuevaTarea)
           try {
            await postNuevaTarea(nuevaTarea)
            Swal.fire("Tarea creada", "La tarea fue creada con exito", "success")
           } catch (error) {
            eliminarUnaTarea(nuevaTarea.id!)
            console.log("Algo salio mal al crear la tarea")
           }
        }

        const putTareaEditar = async (tareaEditada:ITarea) => {
            const estadoPrevio = tareas.find((el) => el.id === tareaEditada.id)
            editarUnaTarea(tareaEditada)
            try {
                await editarTarea(tareaEditada)
                Swal.fire("Tarea editada", "La tarea fue editada con exito", "success")
            } catch (error) {
                if (estadoPrevio)
                editarUnaTarea(estadoPrevio)
                console.log("Algo salio mal al editar la tarea")
                
            }
        }

        const eliminarTarea = async (idTarea:string) => {
            const estadoPrevio = tareas.find((el) => el.id === idTarea)
            const confirm = await Swal.fire({
                title: "¿Estas seguro de eliminar la tarea?",
                text: "No podras revertir esta accion",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar"
            })
            if (!confirm.isConfirmed) return;
            eliminarUnaTarea(idTarea)
            try {
                await eliminarTareaPorID(idTarea)
                Swal.fire("Tarea eliminada", "La tarea fue eliminada con exito", "success")
            } catch (error) {
                if (estadoPrevio) agregarNuevaTarea(estadoPrevio)
                console.log("Algo salio mal al eliminar la tarea")
            }
        }

  return {
    getTareas,
    crearTarea,
    putTareaEditar,
    eliminarTarea,
    tareas,
  }
    

}
