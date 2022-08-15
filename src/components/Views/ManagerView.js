import { AiOutlineUser, AiFillEdit} from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { db, storage } from "../../firebase/FirebaseConfiguration";
import getPersonalInformation from "../../services/getPersonalInformation";
import { CalendarComp } from "../Admin/CalendarCom";
import "../../styles/Manager.css";
import ModalEmployee from "../Employee/ModalEmployee";
import ModalManager from "../Manager/ModalManager";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import swal from "sweetalert";

function ManagerView() {
  const [usuarios, setUsuarios] = React.useState([]);
  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [secondName, setSecondName] = React.useState();
  const [secondLastName, setSecondLastName] = React.useState();
  const [cedula, setCedula] = React.useState();
  const [id, setId] = React.useState();
  const [userImage, setUserImage] = React.useState();
  const [rol, setRol] = React.useState();

  const { signOutUser } = useContext(UserContext);

  const navigate = useNavigate();
  //variable para la busqueda
  const [nameSearch, setNameSearch] = React.useState(null);
  const [arrayNameSearch, setArrayNameSearch] = useState([]);

  // CLICK ON MODAL DATA
  const [modalData, setModalData] = useState(false);
  const [choiseData, setChoiceData] = useState(false);
  const handleModal = () => {
    setModalData(true);
  };

  // CLICK ON MODAL DATA USERS
  const [modalOnUsers, setModalOnUsers] = useState(false);
  const [choiseUsers, setChoiceUsers] = useState(false);
  const clickedUsers = () => {
    setModalOnUsers(true);
  };

  //variable para paginación
  const ITEMS_PER_PAGE = 5;
  const DATOS_USUARIOS = usuarios;
  //console.log('-------',...DATOS_USUARIOS)
  const [currentPage, setCurrentPage] = useState(0);

  const [datos, setDatos] = useState(usuarios);
  const [items, setItems] = useState(
    [...DATOS_USUARIOS].splice(0, ITEMS_PER_PAGE)
  );

  const search = () => {
    //console.log("nombre de la búsqueda:", nameSearch);
    let filterName = usuarios.filter(
      (usuario) => usuario.firstName === nameSearch
    );

    if(filterName.length===0){
      swal({
        text: "No se encontraron coincidencias",
        icon: "error",
        button: "Aceptar",
      });
      setNameSearch(null)
    }

    if (nameSearch === "") {
      setNameSearch(null);
      setArrayNameSearch(items);
    } else {
      setArrayNameSearch(filterName);
      for (let i = 0; i < filterName.length; i++) {
        //console.log("filtrado", arrayNameSearch[i].firstName);
      }
    }
  };

  const items2 = items.map((item, index) => {
    return (
      <>
        <tr className=" border-2" key={item.id}>
          {/* MODAL CONTROLER USERS */}
          {modalOnUsers && (
            <ModalEmployee
              setModalOnUsers={setModalOnUsers}
              setChoiceUsers={setChoiceUsers}
              cedula={cedula}
            />
          )}
          <td className="p-3 text-sm text-gray-700">
            {item.firstName} {item.lastName}
          </td>
          <td className="p-3 text-sm text-gray-700">
            {item.startWork} 
          </td>
          <td className="p-3 text-sm text-sky-700 ">
            {item.startBreak}
          </td>
          <td className="p-3 text-sm text-gray-700">
            {item.finishTime} 
          </td>
          <td
            className={
              item.workingState === "WORKING"
                ? "p-3 text-sm text-green-700/80 font-bold"
                : "p-3 text-sm text-red-700/80 font-bold"
            }
          >
            {item.workingState} 
          </td>
          <td className="p-3 text-sm text-gray-700">{item.workstation}</td>
          <td>
            <button
              className="font-bold text-blue-500 hover:underline"
              onClick={() => {
                clickedUsers();
                setCedula(item.id);
              }}
            >
              {" "}
              Ver Información{" "}
            </button>
          </td>
        </tr>
      </>
    );
  });

  React.useEffect(() => {
    console.log("ManagerView correo: ", window.email);
    getCedula();
    getPersonalInformation().then((usuarios) => {
      setUsuarios(usuarios);
      setItems([...usuarios].splice(0, ITEMS_PER_PAGE));
    });
  }, []);

  const getCedula = async () => {
    const docRef2 = doc(db, "Roles/" + window.email);
    const docSnap2 = await getDoc(docRef2);

    if (docSnap2.exists()) {
      window.cedula = docSnap2.data().id;
      //console.log("___", docSnap.data().id)
      informationFunction(window.cedula);
      informationHours();
    } else {
      // doc.data() will be undefined in this case
      console.log("No se pudo leer el documento de cedula");
    }
    console.log("ManagerView  cédula: ", window.cedula);
  };

  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (docSnap.data().rol === "Gerente") {
        setFirsName(docSnap.data().firstName);
        setLastName(docSnap.data().lastName);
        setSecondLastName(docSnap.data().secondLastName);
        setSecondName(docSnap.data().secondName);
        setUserImage(docSnap.data().imageUser);
        setRol(docSnap.data().rol);
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No se pudo leer el documento");
    }
  };

  const informationHours = async (cedula) => {
    //--------------------------------------------------
    //---------CONSTANTES DE LA FECHA-------------------\\
    //----------------------------------------------------
    const dateobj = new Date();
    const datebreak = new Date();
    //----------------------------------------------------

    const monthNames = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];
    const dateMonth = new Date().getMonth();
    const nombreMes = monthNames[dateMonth];
    const month_year = nombreMes + "_" + dateobj.getFullYear();

    const dayNames = [
      "LUNES",
      "MARTES",
      "MIERCOLES",
      "JUEVES",
      "VIERNES",
      "SABADO",
      "DOMINGO",
    ];
    const dateDays = new Date().getDay();
    const nombreDias = dayNames[dateDays - 1];
    const day_day = nombreDias + "_" + dateobj.getDate();
  };

  const handleHours = () => {
    navigate("/hours_employee_manager");
  };

  const handlePassword = () => {
    navigate("/cambiarclavemanager");
  };

  const handleRegister = () => {
    navigate("/register_employee_manager");
  };

  //FUNCIONES PARA PAGINACION DE LA TABLA
  const nextHandler = () => {
    const totalelementos = usuarios.length;
    //console.log("Total element: ", totalelementos)
    const nextPage = currentPage + 1;
    const firtsIndex = nextPage * ITEMS_PER_PAGE;
    if (firtsIndex === totalelementos) return;

    setItems([...usuarios].splice(firtsIndex, ITEMS_PER_PAGE));
    setCurrentPage(nextPage);
    //console.log('*************',currentPage)
  };
  const prevHandler = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 0) return;
    const firtsIndex = prevPage * ITEMS_PER_PAGE;
    setItems([...usuarios].splice(firtsIndex, ITEMS_PER_PAGE));
    setCurrentPage(prevPage);
    //console.log("prev");
  };

  const nextButton = () => {
    if (usuarios.length / ITEMS_PER_PAGE < currentPage + 1) {
      return true;
    } else {
      return false;
    }
  };

  const [imageUser,setImageUser]= useState(null)
  const [file,setFile]= useState(null)
  const [data, setData] = React.useState();
  const [progress, setProgress] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);



  

  function defaultImage() {
    if (userImage === null) {
      return `https://ui-avatars.com/api/?background=06B6D4&color=fff&size=600&font-size=0.4&name=${firstName}+${lastName}`;
    } else {
      return userImage;
    }
  }

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
    uploadFile(fileObj)
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

    //console.log("DownloadUrl",data)

      
      
    
  };

  const savePhoto=async ()=> {
    //console.log("mi foto", data)
    await updateDoc(doc(db, "Usuarios/" + window.cedula), {
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

  return (
    <div>
      {rol === "Gerente" ? (
        <div className="w-full min-h-screen bg-gray-200 flex flex-row">
          <section className="flex-1 bg-white">
            <img
              className="items-baseline w-28 h-30 mt-5 ml-5"
              src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/160/7252404160_f7e73f6f-de4e-4158-b8d0-f253ac96bfc4.png?cb=1652138302%22"
              alt="logo"
            />

            <CalendarComp />

            <div className="flex justify-center items-center mt-20">
              <div className=" text-card flex items-center justify-center employee rounded-xl w-3/4  ">
                <h1 className="text-white text-center py-2 text-lg ">
                  EMPLEADOS
                </h1>
              </div>
            </div>

            <div className="relative flex justify-center items-center mt-9">
              <input
                className="
             
              p-2.5
             text-sm 
             text-black
             bg-gray-50 
             rounded-lg 
             border-l-2 border
             w-90
             focus:outline-none"
                type="search"
                placeholder="Nombre del empleado"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
              />
              <button
                onClick={search}
                class="
             p-2.5 text-sm font-medium 
             text-black bg-white rounded-lg "
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex justify-center items-center">
              {nameSearch === null && (
                <table className="ml-5 mt-5 text-sm text-left text-gray-500 dark:text-gray-400" id="content-table">
                  <thead className=" bg-gray-50 border-2  border-gray-200  ">
                    <tr>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left ">
                        Nombre
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Hora Entrada
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Descanso
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Hora Salida
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Estado
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Área
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">{items2}</tbody>
                </table>
              )}
            </div>

            <div className="flex justify-center items-center">
              {nameSearch !== null && (
                <table className="w-10/12 mt-5 text-sm text-left text-gray-500 dark:text-gray-400" id="content-table">
                  <thead className=" bg-gray-50 border-2  border-gray-200  ">
                    <tr>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left ">
                        Nombre
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Hora Entrada
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Descanso
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Hora Salida
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Estado
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Área
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrayNameSearch.map((item) => (
                      <tr className=" border-2 " key={item.id}>
                        {/* MODAL CONTROLER USERS */}
                        {modalOnUsers && (
                          <ModalEmployee
                            setModalOnUsers={setModalOnUsers}
                            setChoiceUsers={setChoiceUsers}
                            cedula={cedula}
                          />
                        )}
                        <td className="p-3 text-sm text-gray-700">
                          {item.firstName} {item.lastName}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {item.startWork}
                        </td>
                        <td className="p-3 text-sm text-sky-700 ">
                          {item.startBreak}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {item.finishTime}
                        </td>
                        <td
                          className={
                            item.workingState === "WORKING"
                              ? "p-3 text-sm text-green-700/80 font-bold"
                              : "p-3 text-sm text-red-700/80 font-bold"
                          }
                        >
                          {item.workingState}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {item.workstation}
                        </td>

                        <td>
                          <button
                            className="font-bold text-blue-500 hover:underline"
                            onClick={() => {
                              clickedUsers();
                              setCedula(item.id);
                            }}
                          >
                            
                            Ver Información
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex flex-row mt-5 justify-end" id="prev-next">
              <button onClick={prevHandler}>
                <div className="flex flex-nowrap justify-center items-center">
                  <div>
                    <IoIosArrowBack className="" />
                  </div>
                  <div>Prev</div>
                </div>
              </button>
              <h1 className="mx-5 bg-gray-200/50 rounded-md w-5 flex justify-center items-center">
                
                {currentPage + 1}
              </h1>
              <button
                className=""
                onClick={nextHandler}
                disabled={nextButton()}
              >
                <div className="flex justify-center items-center">
                  <div>Next</div>
                  <div>
                    <IoIosArrowForward />
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* --------------------------------------------------------------------- */}
          {/* TARJETA CON LOS DATOS DEL ADMINISTRADOR  */}
          {/* MODAL CONTROLER */}
          {modalData && (
            <ModalManager
              setModalData={setModalData}
              setChoiceData={setChoiceData}
            />
          )}
          <section className="w-2/6 bg-white pb-2 pt-2">
            <div
              className="card-admin bg-gray-700/50 h-screen rounded-3xl xl:w-9/12 ml-20 
        sm:w-80 sm:h-screen "
            >
              <div className="flex justify-center pt-20 space-x-4 ">
                <p className="font-semibold text-lg text-white"> MANAGER </p>
                <button onClick={handleModal}>
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
              {imageUser !== null && <button onClick={savePhoto} disabled={validButtonSave()}> Guardar</button>}
              <div className=" flex justify-center items-center font-bold text-lg  text-white">
                {firstName} {secondName}
              </div>
              <p className=" flex justify-center items-center text-white text-base">
                {lastName} {secondLastName}
              </p>
              <div className="flex justify-center">
                <h1 className="text-3xl font-bold pt-10 text-white">
                  {" "}
                  MAINSOFT{" "}
                </h1>
              </div>

              <div className="flex flex-col justify-center items-center mt-16">
                <button
                  onClick={handleRegister}
                  className=" button-admin text-white border-solid rounded-lg 
          hover:bg-white hover:text-black xl:w-80 py-3
          sm:w-52"
                >
                  REGISTRAR EMPLEADOS
                </button>

                <button
                  onClick={handleHours}
                  className="button-admin text-white border-solid rounded-lg 
          hover:bg-white hover:text-black xl:w-80 mt-5 py-3 sm:w-52"
                >
                  REPORTE HORAS
                </button>

                <button
                  onClick={handlePassword}
                  className="button-admin text-white border-solid rounded-lg 
          hover:bg-white hover:text-black xl:w-80 mt-5 py-3 sm:w-52"
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

          {/* -------------------------------------------------------------------- */}
          {/* FIN DE LA TARJETA */}
        </div>
      ) : (
        <div>
          Loading..
          <button onClick={() => navigate(-1)}> VOLVER </button>
        </div>
      )}
    </div>
  );
}

export default ManagerView;
