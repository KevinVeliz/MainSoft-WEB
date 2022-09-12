import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfiguration";
import swal from "sweetalert";

 const getCargos = async (setTodosCargos) => {
    let cargosTmp = [];
    const docRefCargos = query(collection(db, "Cargos/"));
    const docSnap = await getDocs(docRefCargos);

    docSnap.forEach((doc) => {
      cargosTmp.push(doc.data());
    });

    setTodosCargos(cargosTmp);
  };

  const eliminarCargos = async (variableCargo) => {
    await deleteDoc(doc(db, "Cargos/" + variableCargo));
    
    swal({
      text: "Cargo eliminado correctamente.",
      icon: "info",
      button: "Aceptar",
    });
  };

  const actualizarCargo = async (id, nuevoCargo) => {
    await updateDoc(doc(db, "Cargos/" + id), {
      id: nuevoCargo,
    });

    swal({
      text: "Cargo actualizado.",
      icon: "success",
      button: "Aceptar",
    });

   
  };

  const nuevoCargo = async (idCargo, valorCargo)=>{
    await setDoc(doc(db, "Cargos/" + idCargo), {
        referencia: idCargo,
        id: valorCargo,
      });
  
  }


  export  {getCargos,eliminarCargos,actualizarCargo,nuevoCargo};