import "../../styles/Employee.css";

import React, { useContext, useEffect, useRef, useState } from "react";
import { HourEmployee } from "../Employee/HourEmployee";
import { UserContext } from "../../context/UserProvider";
import ModalEmployee from "../Employee/ModalEmployee";
import { useNavigate } from "react-router-dom";
import ModalData from "../Employee/ModalData";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/FirebaseConfiguration";
import { AiOutlineUser, AiFillEdit } from "react-icons/ai";
import { CalendarEmployee } from "../Employee/CalendarEmployee";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import swal from "sweetalert";


const EmployeeView = () => {
  const navigate = useNavigate();
  // CLICK ON MODAL DATA
  const [modalData, setModalData] = useState(false);
  const [choiseData, setChoiceData] = useState(false);

  const handleModal = () => {
    setModalData(true);
  };

  const handleDocuments = () => {
    navigate("/uploadDocument");
  };

  const handleHours = () => {
    navigate("/hours_employee");
  };

  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [userImage, setUserImage] = React.useState();
  const [rol, setRol] = React.useState();
  const [timetowork, setTimeToWork] = React.useState();
  const [finishDay, setFinishDay] = React.useState([]);
  const [workingState, setWorkingState] = React.useState()

  const { signOutUser } = useContext(UserContext);
  React.useEffect(() => {
    console.log("EmployeeView correo: ", window.email);
    getCedula();
    //informationFunction(window.cedulaEmpleado);
  }, []);

  const getCedula = async () => {
    const docRef2 = doc(db, "Roles/" + window.email);
    const docSnap2 = await getDoc(docRef2);

    if (docSnap2.exists()) {
      window.cedulaEmpleado = docSnap2.data().id;
      informationFunction(window.cedulaEmpleado);
      window.nombreCompleto =
        docSnap2.data().firstName + "-" + docSnap2.data().lastName;
    } else {
      // doc.data() will be undefined in this case
      console.log("No se pudo leer el documento de cedula");
    }
    //console.log("EmployeeView  cédula: ", window.cedulaEmpleado);
  };

  const diaActual = new Date();

  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (docSnap.data().rol === "Empleado") {
        setUserImage(docSnap.data().imageUser);
        setFirsName(docSnap.data().firstName);
        setLastName(docSnap.data().lastName);
        setRol(docSnap.data().rol);
        setTimeToWork(docSnap.data().timetowork);
        setWorkingState(docSnap.data().workingState);
        finishDay.push(docSnap.data().finishDay);
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No se pudo leer el documento");
    }

    // console.log("finishDay",finishDay[0]  +"   ",diaActual.getDay())
    if (diaActual.getDay() !== finishDay[0] && workingState==="FINISHED") {
      await updateDoc(doc(db, "Usuarios/" + cedula), {
        workingState: "NOTWORKING",
      });
    }
  };

  function defaultImage() {
    if (userImage === null) {
      return `https://ui-avatars.com/api/?background=06B6D4&color=fff&size=600&font-size=0.4&name=${firstName}+${lastName}`;
    } else {
      return userImage;
    }
  }

  const [imageUser,setImageUser]= useState(null)
  const [file,setFile]= useState(null)
  const [data, setData] = React.useState();
  const [progress, setProgress] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);




  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const showImageUser = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load', (e) =>{
      setImageUser(e.target.result)
    })
    setFile(file)
  }

  const handleFileChange = e => {
    const fileObj = e.target.files && e.target.files[0];
    if (!fileObj) {
      return;
    }

    showImageUser(fileObj);
    uploadFile(fileObj);
    swal({
      text: "Recuerda que debes dar en 'Guardar' para conservar los cambios.",
      icon: "info",
      button: "Aceptar",
    });

  };

  const uploadFile =async (file) => {
    const name = file.name;
    const storageRef = ref(storage, "Profile/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log("Progress: " + progress);

        switch (snapshot.state) {
          case "paused":
            console.log("La carga está pausada");
            break;
          case "running":
            console.log("La carga esta en proceso");

            break;
          default:
            break;
        }
        console.log("carga compleatada");
      },
      (error) => {
        console.log("error: " + error);
      },
       () =>  {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("URL: " + downloadURL);
          setData(downloadURL);
          setIsLoading(true);
        });
      }
    );
    
  };

  const savePhoto=async ()=> {
    //console.log("mi foto", data)
    await updateDoc(doc(db, "Usuarios/" +  window.cedulaEmpleado), {
      imageUser: data,
    });

    swal({
      text: "Imagen de perfil modificada correctamente.",
      icon: "success",
      button: "Aceptar",
    });
  }
  const validButtonSave=() => {
    if(isLoading===true){
      return false;
    }else{
      return true;
    }
  }


  const handlePassword = () => {
    navigate("/cambiarclaveemployee");
  };

  let horario;
  return (
    <div>
      {rol === "Empleado" ? (
        <div className="w-full min-h-screen bg-gray-200 flex flex-row">
          <section className="w-2/5 bg-white pb-2 pt-2 flex ">
            <div
              className="card-admin bg-gray-700/50 h-screen rounded-3xl xl:w-8/12 ml-5 
        sm:w-80 sm:h-screen "
            >
              <div className="flex justify-center pt-20 space-x-4 ">
                <p className="font-semibold text-lg text-white"> EMPLEADO</p>
                {/* MODAL CONTROLER */}
                {modalData && (
                  <ModalData
                    setModalData={setModalData}
                    setChoiceData={setChoiceData}
                  />
                )}
                <button
                  className="text-black"
                  onClick={handleModal}
                  disabled={rol === "Empleado" ? false : true}
                >
                  <AiOutlineUser className="text-white w-5 h-5 mt-0" />
                </button>
              </div>
              <div className="pt-10 flex justify-center">
                <img
                  src={ imageUser === null ? defaultImage(): imageUser}
                  alt=""
                  className="w-32 h-32 rounded-full border-white border-4"
                />
              </div>
              

              <input
                style={{ display: 'none' }}
                ref={inputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
    
              <button onClick={handleClick} className="w-full flex items-center justify-center"> <AiFillEdit className="text-white w-5 h-5 mt-0 " /></button>
              {imageUser !== null &&<div className="flex justify-center items-center">
              <button className=" flex items-center justify-center w-32 text-black text-lg bg-white
              "  onClick={savePhoto}  disabled={validButtonSave()}> Guardar</button>
              </div>}
         
              <div className=" flex justify-center items-center font-bold text-lg  text-white">
                {firstName}
              </div>
              <p className=" flex justify-center items-center text-white text-base">
                {lastName}
              </p>
              <div className="flex justify-center">
                <h1 className="text-3xl font-bold pt-10 text-white">
                  
                  MAINSOFT
                </h1>
              </div>

              <div className="flex justify-center">
                <h1 className="text-3xl font-bold pt-10 text-white">
                  {
                    (horario =
                      timetowork === "08:00:00"
                        ? "Horario Normal"
                        : timetowork === "06:00:00"
                        ? "Permiso Materno"
                        : "Permiso")
                  }
                </h1>
              </div>

              <div className="flex flex-col justify-center items-center mt-5">
                <button
                  onClick={handleDocuments}
                  className="buton-modal
        font-medium py-2 px-16 text-base bg-black text-white rounded-xl 
        sm:w-5/6 sm:text-base sm:ml-2 sm:mb-4
        md:w-5/6 md:text-base md:ml-0 md:mb-4
        lg:ml-2 lg:mb-2 lg:w-5/6
        xl:w-5/6 xl:ml-2"
                >
                  
                  SUBIR ARCHIVOS
                </button>
                <button
                  onClick={handleHours}
                  className="buton-modal
        font-medium py-2 px-16 text-base bg-black text-white 
        rounded-xl xl:w-5/6 xl:ml-2
        lg:ml-2 lg:mb-2 lg:w-5/6 sm:w-5/6 sm:text-base sm:ml-2 sm:mb-4
        md:ml-0"
                >
                  
                  VER HORAS
                </button>
                <button
                  onClick={handlePassword}
                  className="
                  font-medium py-2 px-16 text-base bg-black text-white 
                  rounded-xl xl:w-5/6 xl:ml-2
                  lg:ml-2 lg:mb-2 lg:w-5/6 sm:w-5/6 sm:text-base sm:ml-2 sm:mb-4
                  md:ml-0 buton-modal"
                >

                  CAMBIAR CLAVE
                </button>
                <button
                  onClick={signOutUser}
                  className="text-black border-solid border-2 py-2 border-white
          hover:bg-gray-500/50 hover:border-gray-500/50 hover:text-white xl:w-80  mt-5 bg-white rounded-lg
          sm:w-52"
                >
                  SALIR
                </button>
              </div>
            </div>
          </section>

          <section className="flex-1 bg-white">
            <div>
              <CalendarEmployee />
              <HourEmployee />
            </div>
          </section>
        </div>
      ) : (
        <div>No disponible</div>
      )}
    </div>
  );
};

export default EmployeeView;
