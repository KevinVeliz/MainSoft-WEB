import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import "../../styles/Cargos.css";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfiguration";
import swal from "sweetalert";

export const Cargos = () => {
  const [cargos, setCargos] = useState();
  const [todosCargos, setTodosCargos] = useState([]);
  const [tamanioCargo, setTamaniocargo] = useState();
  const [nuevoValor, setNuevoValor] = useState();

  useEffect(() => {
    getCargos();
    //console.log(todosCargos)
    window.addEventListener("click", agregarCargos);
    return () => {
      window.removeEventListener("click", agregarCargos);
    };
  }, []);

  const navigate = useNavigate();
  const handleRetunr = () => {
    navigate("/admin");
  };

  const getCargos = async () => {
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
    getCargos();
    swal({
      text: "Cargo eliminado correctamente.",
      icon: "info",
      button: "Aceptar",
    });
  };

  const agregarCargos = async (valorCargo) => {
    let arregloTmp = [];
    for (let i = 0; i < todosCargos.length; i++) {
      let separarCargo = todosCargos[i].referencia.split("_");
      arregloTmp.push(Number(separarCargo[1]));
    }

    let num = Math.max(...arregloTmp);

    let numeroCargo = Number(num) + 1;
    let idCargo;
    if (numeroCargo > 0) {
      idCargo = "Cargo_" + numeroCargo;
    } else {
      idCargo = "Cargo_1";
    }

    await setDoc(doc(db, "Cargos/" + idCargo), {
      referencia: idCargo,
      id: valorCargo,
    });

    swal({
      text: "Cargo agregado correctamente.",
      icon: "success",
      button: "Aceptar",
    });

    setCargos("");
    getCargos();
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

    getCargos();
  };

  return (
    <div className=" w-full h-full">
      <div className="flex justify-center items-center">
        
        <div className="  first-input card-cargos h-40 
        sm:w-11/12 md:w-11/12 xl:w-6/12 lg:w-8/12
        mt-5 rounded-xl">
        <div className="px-6 py-4 flex justify-center items-center">
            <h1 className="text-white font-medium flex items-center justify-center">
              Agregar Cargos
            </h1>
          </div>
          <div className="flex justify-center items-center ">
            <input
                  value={cargos}
                  onChange={(e) => setCargos(e.target.value)}
                  type="text"
                  placeholder="Agregar cargos"
                  class="border rounded-lg p-2 text-sm shadow-inner
                  outline-none bg-gray-50 focus:bg-white w-2/4"
                  
                  />  
          </div >
          <div className="flex justify-center items-center">
          <button
              className="
              button-agregar
              justify-center items-center
              text-lg
              py-1 mt-2 px-3
              text-white rounded-lg"
              onClick={() => agregarCargos(cargos)}
              >
              AGREGAR
            </button>
              
        </div>
      </div>
      </div>
        <div className="flex flex-row justify-center">
          <div className="card-cargos card-eliminar h-screen w-96 mt-5 rounded-xl">
          <div className="px-6 flex justify-center items-center">
              <h1 className="px-6 py-4  text-white font-medium flex items-center justify-center">
                Eliminar cargos
              </h1>
            </div>
            <div className="flex justify-center items-center ">

            <div className=" ml-5 mt-5 flex justify-center items-center   overflow-y-scroll h-96">
              <ul className="text-white h-96">
                {todosCargos.map((item) => (
                  <div className="p-3 grid grid-cols-2" key={item.id}>
                    <li>{item.id}</li>
                    <button className="button-agregar px-2 py-1 ml-3 rounded-lg" onClick={() => eliminarCargos(item.referencia)}>
                      Eliminar
                    </button>
                  </div>
                ))}
              </ul>
            </div>
            </div>
          </div>


          <div className="card-cargos card-actualizar h-screen w-96 mt-5 rounded-xl ml-5">
          <div className="px-6 py-4 flex justify-center items-center">
              <h1 className="text-white font-medium flex items-center justify-center">
                Actualizar cargos
              </h1>
            </div>
            <div className="flex justify-center items-center ">
            <div className="ml-5 mt-5 flex justify-center items-center overflow-y-scroll h-96">
            <ul className="text-white h-96">
                {todosCargos.map((item) => (
                  <div className="p-3 grid grid-cols-2" key={item.id}>
                    <div className="text-black w-36 flex flex-row">
                      <input className="border rounded-lg p-2 text-sm shadow-inner"
                        defaultValue={item.id}
                        onChange={(e) => setNuevoValor(e.target.value)}
                      />
                      <button className="button-agregar rounded-lg ml-2 py-1 text-sm px-2
                      text-white"
                        onClick={() =>
                          actualizarCargo(item.referencia, nuevoValor)
                        }>
                        ACTUALIZAR
                      </button>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
            </div>
          </div>

        </div>


      <div className="flex justify-center items-center mt-10">
        <button
          onClick={handleRetunr}
          className="button p-3 rounded-md text-sm space-x-4
      shadow-lg shadow-cyan-500/50"
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};
