import { AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Controller/context/UserProvider";
import { db } from "../../Controller/firebase/FirebaseConfiguration";
import getPersonalInformation from "../../Controller/services/getPersonalInformation";
import Modal from "./Modal";
import "../styles/AdminView.css";
import { CalendarComp } from "./CalendarCom";
import swal from "sweetalert";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import ModalMonthInformation from "./ModalMonthInformation";
import "../styles/HorasPDF.css";

function HorasView(setUsuario) {
  const navigate = useNavigate();

  const handleRetunr = () => {
    navigate("/admin");
  };

  const { user, signOutUser } = useContext(UserContext);

  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [secondName, setSecondName] = React.useState();
  const [secondLastName, setSecondLastName] = React.useState();
  const [usuarios, setUsuarios] = React.useState([]);
  const [empleados, setEmpleados] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //const [datos, setDatos] = React.useState([]);
  const [userImage, setUserImage] = React.useState();

  const [date, setDate] = React.useState();
  const [cedula, setCedula] = React.useState();
  const [name, setName] = React.useState();

  const [modalOnUsers, setModalOnUsers] = useState(false);
  const [choiseUsers, setChoiceUsers] = useState(false);

  //variable para paginación
  const ITEMS_PER_PAGE = 2;
  const DATOS_USUARIOS = usuarios;
  //console.log('-------',...DATOS_USUARIOS)
  const [currentPage, setCurrentPage] = useState(0);

  const [items, setItems] = useState(
    [...DATOS_USUARIOS].splice(0, ITEMS_PER_PAGE)
  );

  React.useEffect(() => {
    //console.log("AdminView correo: ", window.email);
    //console.log("AdminView cédula: ", window.id);
    getCedula();
    informationFunction(window.id);
    getPersonalInformation().then((usuarios) => {
      setUsuarios(usuarios);
      setItems([...usuarios].splice(0, ITEMS_PER_PAGE));
    });
  }, []);

  const clickedUsers = () => {
    setModalOnUsers(true);
  };

  const getCedula = async () => {
    const docRef2 = doc(db, "Roles/" + window.email);
    const docSnap2 = await getDoc(docRef2);

    if (docSnap2.exists()) {
      window.id = docSnap2.data().id;
      informationFunction(window.id);
    } else {
      //console.log("No se pudo leer el documento de cedula");
    }
  };

  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFirsName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
      setSecondLastName(docSnap.data().secondLastName);
      setSecondName(docSnap.data().secondName);
      setUserImage(docSnap.data().imageUser);
    } else {
      // doc.data() will be undefined in this case
     // console.log("No se pudo leer el documento");
    }
  };

  // CLICK ON MODAL
  const [modalOn, setModalOn] = useState(false);
  const [choise, setChoice] = useState(false);
  const clicked = () => {
    setModalOn(true);
  };

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

  let monthName;
  let month_year;

  const consulta = async () => {
    empleados.splice(0, empleados.length);
    setEmpleados([]);
    setIsLoading(true);
    if (date == null) {
      setIsLoading(false);
      swal({
        text: "Por favor, ingrese un mes para realizar la consulta.",
        icon: "info",
        button: "Aceptar",
      });
    }
    const horasTrabajoTmp = date.split("-");
    //console.log("date", horasTrabajoTmp);
    if (horasTrabajoTmp[1] < 10) {
      const dateMonth = horasTrabajoTmp[1].split("0");
      monthName = monthNames[dateMonth[1] - 1];
    } else {
      const dateMonth = horasTrabajoTmp[1];
      monthName = monthNames[dateMonth - 1];
    }

    month_year = monthName + "_" + horasTrabajoTmp[0];

    //console.log("date", month_year);
    let i;
    for (i = 0; i < usuarios.length; i++) {
      const docRef = doc(
        db,
        "Usuarios/" + usuarios[i].id + "/MONTHLY_REGISTER/" + month_year
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        empleados.push(docSnap.data());
      }

      //console.log("consulta mensul")
    }

    //console.log("Mi lista", empleados)
    setEmpleados(empleados);
    //console.log("arreglo de empleados", empleados);
    setIsLoading(false);

    if (empleados.length === 0) {
      swal({
        text: "No existen registros en este mes.",
        icon: "info",
        button: "Aceptar",
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

  const horas = (
    <div >
      <div className="flex flex-row w-full min-h-screen ">
        <section className="flex-1 bg-white">
          <img
            className="items-baseline mt-5 ml-5 w-28 h-30"
            src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/160/7252404160_f7e73f6f-de4e-4158-b8d0-f253ac96bfc4.png?cb=1652138302%22"
            alt="logo"
          />


          <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-3/4 mt-10 mb-10 text-card employee rounded-xl">
            <h1 className="py-2 text-lg text-center text-white ">
              HORAS MENSUALES
            </h1>
          </div>
          </div>

          <div className="flex items-center justify-center w-auto pt-5">
            <div className="flex flex-row">
              <input
                type="month"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className=" 
              p-2.5
             text-sm 
             text-black
             bg-gray-50 
             rounded-lg 
             border-l-2 border
             w-90
             focus:outline-none"
              />

              <button
                className="px-4 py-2 ml-5 text-black bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
                onClick={() => {
                  consulta();
                }}>
                <div className="flex items-center justify-center flex-nowrap">
                  <div>
                    <AiOutlineSearch className="mr-2" />
                  </div>
                  <div>Buscar</div>
                </div>
              </button>
            </div>
          </div>

          {/* TABLA DE LAS HORAS DEL EMPLEADO */}
          <div className="flex items-center justify-center p-5">
            <div className="flex items-center justify-center" >
              <table id="content-table">
                <thead className="">
                  <tr>
                    <th>{date}</th>
                  </tr>
                  <tr>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Cédula
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Nombre del empleado
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Horas de trabajo mensual
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {empleados.map((item) => (
                    <tr className="border-2" key={item.id}>
                      <td className="p-3 text-sm text-gray-700">{item.id}</td>
                      <td className="p-3 text-sm text-center text-gray-700">
                        {item.completeName}
                      </td>
                      <td className="p-3 text-sm text-center text-gray-700">
                        {item.totalHours}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <button
                          className="font-bold text-blue-500 hover:underline"
                          onClick={() => {
                            clickedUsers();
                            setCedula(item.id);
                            setName(item.completeName);
                          }}>
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------- */}
        {/* TARJETA CON LOS DATOS DEL ADMIN */}
        {/* MODAL CONTROLER */}
        {modalOn && <Modal setModalOn={setModalOn} setChoice={setChoice} />}
        {modalOnUsers && (
          <ModalMonthInformation
            setModalOnUsers={setModalOnUsers}
            setChoiceUsers={setChoiceUsers}
            cedula={cedula}
            mes={date}
            name={name}
          />
        )}
        <section className="w-2/6 h-full pt-2 pb-2 bg-white">
            <div
              className="ml-20 card-admin bg-gray-700/50 rounded-3xl xl:w-9/12 sm:w-80 sm:h-screen"
            >
              <div className="flex justify-center pt-10 space-x-4 ">
                <p className="text-lg font-semibold text-white">
                  ADMINISTRADOR
                </p>
                <button onClick={clicked}>
                  <AiOutlineUser className="w-5 h-5 mt-0 text-white" />
                </button>
              </div>

              <div className="flex justify-center pt-10">
              <img
                src={defaultImage()}
                alt=""
                className="w-32 h-32 border-4 border-white rounded-full"
              />
              </div>
              
        
              <br/>
              <div className="flex items-center justify-center text-lg text-white ">
                {firstName} {secondName}
              </div>
              <p className="flex items-center justify-center text-base text-white ">
                {lastName} {secondLastName}
              </p>
              <div className="flex justify-center">
                <h1 className="pt-5 text-3xl font-bold text-white">MAINSOFT</h1>
              </div>

              <div className="flex flex-col items-center justify-center mt-5">
                <button
                  onClick={handleRetunr}
                  className="py-2 text-white border-solid rounded-lg button-admin hover:bg-white hover:text-black xl:w-60 sm:w-52"
                >
                  REGRESAR
                </button>


              </div>
            </div>
        </section>
        {/* -------------------------------------------------------------------- */}
        {/* FIN DE LA TARJETA */}
      </div>
    </div>
  );

  return <>{isLoading ? <LoadingSpinner /> : horas}</>;
}

export default HorasView;
