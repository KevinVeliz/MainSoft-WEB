import { AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Controller/context/UserProvider";
import { db } from "../../Controller/firebase/FirebaseConfiguration";
import getPersonalInformation from "../../Controller/services/getPersonalInformation";
import ModalManager from "../Manager/ModalManager";
import "../../styles/Manager.css";
import { CalendarComp } from "../Admin/CalendarCom";
import jsPDF from "jspdf";
import swal from "sweetalert";
import ModalMonthInformation from "../Admin/ModalMonthInformation";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";

function ViewHoursEmployeeManager() {
  const navigate = useNavigate();

  const handleRetunr = () => {
    navigate("/manager");
  };

  const { user, signOutUser } = useContext(UserContext);

  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [secondName, setSecondName] = React.useState();
  const [secondLastName, setSecondLastName] = React.useState();
  const [usuarios, setUsuarios] = React.useState([]);
  const [empleados, setEmpleados] = React.useState([]);
  const [verdadero, setVerdadero] = React.useState(false);
  const [name, setName] = React.useState();


  //const [datos, setDatos] = React.useState([]);
  const [userImage, setUserImage] = React.useState();

  const [date, setDate] = React.useState();
  const [modalOnUsers, setModalOnUsers] = useState(false);
  const [cedula, setCedula] = React.useState();
  const [isLoading, setIsLoading] = useState(false);
  const [choiseUsers, setChoiceUsers] = useState(false);
  React.useEffect(() => {
    //console.log("ManagerView correo: ", window.email);
    getCedula();
    informationFunction(window.id);
    getPersonalInformation().then((usuarios) => {
      setUsuarios(usuarios);
    });
  }, []);

  const getCedula = async () => {
    const docRef2 = doc(db, "Roles/" + window.email);
    const docSnap2 = await getDoc(docRef2);

    if (docSnap2.exists()) {
      window.id = docSnap2.data().id;
      //console.log("___", docSnap.data().id)
      informationFunction(window.id);
    } else {
      // doc.data() will be undefined in this case
      //console.log("No se pudo leer el documento de cedula");
    }
    //console.log("AdminView  cédula: ", window.id);
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
      //console.log("No se pudo leer el documento");
    }
  };

  // CLICK ON MODAL DATA
  const [modalData, setModalData] = useState(false);
  const [choiseData, setChoiceData] = useState(false);
  const handleModal = () => {
    setModalData(true);
  };

  //TRAER TODOS LOS USUARIOS Y SUS HORAS TOTALES POR DIA Y SEMANA
  const dayInformation = async (cedula, month_year, day_day) => {
    const docRef = doc(
      db,
      "Usuarios/" + cedula + "/" + month_year + "/" + day_day
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      empleados.push(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
     // console.log("No se pudo leer el documento");
    }

    //console.log("arreglo de empleados", empleados);
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

  const dayNames = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];

  let monthName;
  let dayName;
  let month_year;
  let day_day;

  let datos = [];

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
    //console.log("email", window.cedulaEmpleado)
    //console.log("date", horasTrabajoTmp);
    if (horasTrabajoTmp[1] < 10) {
      const dateMonth = horasTrabajoTmp[1].split("0");
      monthName = monthNames[dateMonth[1] - 1];
    } else {
      const dateMonth = horasTrabajoTmp[1];
      monthName = monthNames[dateMonth - 1];
    }

    let fecha = new Date(date);
    let day = fecha.getDay();
    dayName = dayNames[day];

    month_year = monthName + "_" + horasTrabajoTmp[0];

    //console.log("date", month_year);

    day_day = dayName + "_" + horasTrabajoTmp[2];
    //console.log("day", day_day);

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
    setEmpleados(empleados);
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

  const clickedUsers = () => {
    setModalOnUsers(true);
  };

  const generatePDF = () => {
    let doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector("#contentPDF"), {
      callback: function (pdf) {
        pdf.save(date + ".pdf");
      },
    });
  };

  const validatePDF = () => {
    if (empleados.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const horas = (
    <div size="A4" style={{ padding: 0 }}>
      <div className="flex flex-row w-full min-h-screen bg-gray-200">
        <section className="flex-1 bg-white">
          <img
            className="items-baseline mt-5 ml-5 w-28 h-30"
            src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/160/7252404160_f7e73f6f-de4e-4158-b8d0-f253ac96bfc4.png?cb=1652138302%22"
            alt="logo"
          />
          <div className="flex items-center justify-center w-4/6 mt-20  text-card ml-52 employee rounded-xl">
            <h1 className="py-2 text-lg text-center text-white ">
              HORAS MENSUALES
            </h1>
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

          <div className="flex items-center justify-center p-5">
            <div className="flex items-center justify-center" id="contentPDF">
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
        {/* TARJETA CON LOS DATOS DEL MANAGER */}
        {/* MODAL CONTROLER */}
        {modalData && (
          <ModalManager
            setModalData={setModalData}
            setChoiceData={setChoiceData}
          />
        )}
         {modalOnUsers && (
          <ModalMonthInformation
            setModalOnUsers={setModalOnUsers}
            setChoiceUsers={setChoiceUsers}
            cedula={cedula}
            mes={date}
            name={name}
          />
        )}
        <section className="w-2/6 pt-2 pb-2 bg-white">
          <div
            className="h-screen ml-20 card-admin bg-gray-700/50 rounded-3xl xl:w-9/12 sm:w-80 sm:h-screen "
          >
            <div className="flex justify-center pt-20 space-x-4 ">
              <p className="text-lg font-semibold text-white">
                
                MANAGER
              </p>
              <button onClick={handleModal}>
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
            <div className="flex items-center justify-center text-lg font-bold text-white ">
              {firstName} {secondName}
            </div>
            <p className="flex items-center justify-center text-base text-white ">
              {lastName} {secondLastName}
            </p>
            <div className="flex justify-center">
              <h1 className="pt-10 text-3xl font-bold text-white">
                
                MAINSOFT
              </h1>
            </div>

            <div className="flex flex-col items-center justify-center mt-16">
             
              <button
                onClick={handleRetunr}
                className="py-3 mt-5 text-white border-solid rounded-lg button-admin hover:bg-white hover:text-black xl:w-80 sm:w-52"
              >
                VOLVER
              </button>
              <button
                onClick={signOutUser}
                className="py-2 mt-5 text-black bg-white border-2 border-white border-solid rounded-lg hover:bg-gray-500/50 hover:border-gray-500/50 hover:text-white xl:w-80 sm:w-52"
              >
                SALIR
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

export default ViewHoursEmployeeManager;
