import React, { useContext, useEffect, useRef, useState } from "react";
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
import { db } from "../../Controller/firebase/FirebaseConfiguration";
import swal from "sweetalert";
import { AiOutlineUser } from "react-icons/ai";
import Modal from "./Modal";
import { UserContext } from "../../Controller/context/UserProvider";

export const Cargos = () => {
  const [cargos, setCargos] = useState();
  const [todosCargos, setTodosCargos] = useState([]);
  const [tamanioCargo, setTamaniocargo] = useState();
  const [nuevoValor, setNuevoValor] = useState();
  const { user, signOutUser } = useContext(UserContext);
  const [userImage, setUserImage] = React.useState();
  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [imageUser,setImageUser]= useState(null);
  const [secondLastName, setSecondLastName] = React.useState();

  useEffect(() => {
    informationFunction(window.id);
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

  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (docSnap.data().rol === "admin") {
        setFirsName(docSnap.data().firstName);
        setLastName(docSnap.data().lastName);
        setUserImage(docSnap.data().imageUser);
        setSecondLastName(docSnap.data().secondLastName);
      }
    } else {
     // console.log("No se pudo leer el documento");
    }
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


  const handleHours = () => {
    navigate("/horas");
  };

  const handleCargos = () => {
    navigate("/cargos");
  };

  //----------------------------------------
  // CLICK ON MODAL DATA ADMIN
  const [modalOn, setModalOn] = useState(false);
  const [choise, setChoice] = useState(false);
  const clicked = () => {
    setModalOn(true);
  };
  //---
  const [file,setFile]= useState(null)

  const showImageUser = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load', (e) =>{
      setImageUser(e.target.result)
    })
    setFile(file)
  }


  function defaultImage() {
    if (userImage === null) {
      return `https://ui-avatars.com/api/?background=06B6D4&color=fff&size=600&font-size=0.4&name=${firstName}+${lastName}`;
    } else {
      return userImage;
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white ">
      <section className="flex items-center justify-center h-full overflow-hidden border-r border-gray-100">
   
        <div className="flex flex-row mt-5">
       
        <div className="flex flex-row items-center justify-center pb-2 space-x-4 ">
                <button
                  onClick={handleRetunr}
                  className="py-2 text-white border-solid rounded-lg button-admin xl:w-60 sm:w-52"
                >
                  REGRESAR
                </button>

        </div>
       

        </div>
      </section>

      <section className="flex-1 ">
      <section className="">
        <div className="flex items-center justify-center">

          <div className="w-8/12 h-40 mt-5 first-input card-cargos rounded-xl">
            <div className="flex items-center justify-center px-6 py-4">
              <h1 className="flex items-center justify-center font-medium text-white">
                Agregar Cargos
              </h1>
            </div>
            <div className="flex items-center justify-center ">
              <input
                value={cargos}
                onChange={(e) => setCargos(e.target.value)}
                type="text"
                placeholder="Agregar cargos"
                class="border rounded-lg p-2 text-sm shadow-inner
                  outline-none bg-gray-50 focus:bg-white w-2/4"

              />
            </div >
            <div className="flex items-center justify-center">
              <button
                className="items-center justify-center px-3 py-1 mt-2 text-lg text-white rounded-lg button-agregar"
                onClick={() => agregarCargos(cargos)}
              >
                AGREGAR
              </button>

            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-2/6 h-screen mt-5 card-cargos card-eliminar rounded-xl">
            <div className="flex items-center justify-center px-6">
              <h1 className="flex items-center justify-center px-6 py-4 font-medium text-white">
                Eliminar cargos
              </h1>
            </div>
            <div className="flex items-center justify-center ">

              <div className="flex items-center justify-center mt-5 ml-5 overflow-y-scroll h-96">
                <ul className="text-white h-96">
                  {todosCargos.map((item) => (
                    <div className="grid grid-cols-2 p-3" key={item.id}>
                      <li>{item.id}</li>
                      <button className="px-2 py-1 ml-3 rounded-lg button-agregar" onClick={() => eliminarCargos(item.referencia)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>


          <div className="w-2/6 h-screen mt-5 ml-5 card-cargos card-actualizar rounded-xl">
            <div className="flex items-center justify-center px-6 py-4">
              <h1 className="flex items-center justify-center font-medium text-white">
                Actualizar cargos
              </h1>
            </div>
            <div className="flex items-center justify-center ">
              <div className="flex items-center justify-center mt-5 ml-5 overflow-y-scroll h-96">
                <ul className="text-white h-96">
                  {todosCargos.map((item) => (
                    <div className="grid grid-cols-2 p-3" key={item.id}>
                      <div className="flex flex-row text-black w-36">
                        <input className="p-2 text-sm border rounded-lg shadow-inner"
                          defaultValue={item.id}
                          onChange={(e) => setNuevoValor(e.target.value)}
                        />
                        <button className="px-2 py-1 ml-2 text-sm text-white rounded-lg button-agregar"
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
      </section>


      {modalOn && <Modal setModalOn={setModalOn} setChoice={setChoice} />}
      <section className="w-2/6 pt-2 pb-2 ">
       
      </section>
      </section>
     
    </div>
  );
};
