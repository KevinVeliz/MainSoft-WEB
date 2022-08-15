import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { db, storage } from "../../../firebase/FirebaseConfiguration";
import swal from "sweetalert";

const ModalEvidenceFinish = ({
  setModalEvidenceFinish,
  setChoiceEvidenceFinish,
}) => {
  const [file, setFile] = React.useState(null);
  const [data, setData] = React.useState();
  const [progress, setProgress] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [activePerson, setActivePerson] = React.useState("FINISHED");
  const [timetowork, setTimeToWork] = React.useState("");

  const [startWork, setstartWork] = React.useState();
  const [startBreak, setStartBreak] = React.useState();
  const [startBack, setStartBack] = React.useState();
  const [finishTime, setFinishTime] = React.useState();
  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();

  const dateobj = new Date();

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
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];
  const dateDays = new Date().getDay();
  const nombreDias = dayNames[dateDays];
  const dayNumber = dateobj.getDate();
  let dayNumberFinal;
  if (dayNumber < 10) {
    dayNumberFinal = "0" + dayNumber;
  } else {
    dayNumberFinal = dayNumber;
  }

  const day_day = nombreDias + "_" + dayNumberFinal;

  const handleCancelClick = () => {
    setChoiceEvidenceFinish(false);
    setModalEvidenceFinish(false);
  };

  const mes = dateobj.getMonth() + 1;

  React.useEffect(() => {
    informationFunction(window.cedulaEmpleado);
    //console.log("Info de modal evidencia", window.cedulaEmpleado);
    //console.log("Info de modal nombre", window.nombreCompleto);
    const uploadFile = () => {
      const storageRef = ref(
        storage,
        "Register/" +
          mes +
          "/" +
          window.nombreCompleto +
          "/" +
          dateobj.getDate() +
          "/" +
          "Finish_Evidence"
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
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
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("URL: " + downloadURL);
            setData(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const saveEvidence = async () => {
    //console.log ("horas de view", window.horaInicio, window.horaBreak, window.horaBack, window.horaFinish)
    await updateDoc(
      doc(
        db,
        "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
      ),
      {
        DescriptionFinishDay: description,
        ImageFinish: data,
      }
    );
    await updateDoc(
      doc(
        db,
        "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
      ),
      {
        finishTime: window.horaFinish,
      }
    );
    setActivePerson("FINISHED");
    await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
      workingState: "FINISHED",
      finishTime: window.horaFinish,
      finishDay: dateobj.getDate(),
    });

    calculateTotalHours();
    setModalEvidenceFinish(false);
    setChoiceEvidenceFinish(false);

    swal({
      text: "Evidencia enviada correctamente.",
      icon: "success",
      button: "Aceptar",
    });
    
  };

  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTimeToWork(docSnap.data().timetowork);
      setFirsName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
    } else {
      // doc.data() will be undefined in this case
      console.log("No se pudo leer el documento");
    }

    const docRef2 = doc(
      db,
      "Usuarios/" + cedula + "/" + month_year + "/" + day_day
    );
    const docSnap2 = await getDoc(docRef2);
    if (docSnap2.exists()) {
      setstartWork(docSnap2.data().startWork);
      setStartBreak(docSnap2.data().startBreak);
      setStartBack(docSnap2.data().startBack);
      setFinishTime(docSnap2.data().finishTime);
    
    }
    console.log(
      "Total hours: " +
        startWork +
        " " +
        startBreak +
        " " +
        startBack +
        " " +
        finishTime
    );
  };

  const calculateTotalHours = async () => {
    let horaFinalRegistro;
    if (timetowork === "08:00:00") {
      let horaInicioArray = startWork.split(":");
      let horaBreakArray = startBreak.split(":");
      let horaBackArray = startBack.split(":");
      let horaFinishArray = window.horaFinish.split(":");

      let hour1 = Number(horaInicioArray[0]) * 3600;
      let min1 = Number(horaInicioArray[1]) * 60;
      let sec1 = Number(horaInicioArray[2]);

      let horaIncioaSegundos = Number(hour1 + min1 + sec1);
      //console.log("HoraInicioSegundos: " + horaIncioaSegundos);

      let hour2 = Number(horaBreakArray[0]) * 3600;
      let min2 = Number(horaBreakArray[1]) * 60;
      let sec2 = Number(horaBreakArray[2]);

      let horaBreakaSegundos = Number(hour2 + min2 + sec2);
      //console.log("horaBreakaSegundos", horaBreakaSegundos);

      let hour3 = Number(horaBackArray[0]) * 3600;
      let min3 = Number(horaBackArray[1]) * 60;
      let sec3 = Number(horaBackArray[2]);

      let horaBackaSegundos = Number(hour3 + min3 + sec3);
      //console.log("horaBackaSegundos", horaBackaSegundos);

      let hour4 = Number(horaFinishArray[0]) * 3600;
      let min4 = Number(horaFinishArray[1]) * 60;
      let sec4 = Number(horaFinishArray[2]);

      let horaFinishaSegundos = Number(hour4 + min4 + sec4);

      //console.log("horaFinishaSegundos", horaFinishaSegundos);

      let restaHoraBreakInicio = horaBreakaSegundos - horaIncioaSegundos;
      let restaHorsFinishBack = horaFinishaSegundos - horaBackaSegundos;

      let hoursTotalDay = restaHoraBreakInicio + restaHorsFinishBack;

      let horaFinal = Math.trunc(hoursTotalDay / 3600);
      let horaFinalView;
      if (horaFinal < 10) {
        horaFinalView = "0" + horaFinal;
      } else {
        horaFinalView = horaFinal;
      }

      let restoHoraFinal = hoursTotalDay % 3600;
      let minFinal = Math.trunc(restoHoraFinal / 60);
      let minFinalView;
      if (minFinal < 10) {
        minFinalView = "0" + minFinal;
      } else {
        minFinalView = minFinal;
      }
      let secFinal = restoHoraFinal % 60;
      let secFinalView;
      if (secFinal < 10) {
        secFinalView = "0" + secFinal;
      } else {
        secFinalView = secFinal;
      }

      horaFinalRegistro =
        horaFinalView + ":" + minFinalView + ":" + secFinalView;

      //console.log("Tiempo trabajado", horaFinalRegistro);
    } else {
      let horaInicioArray = startWork.split(":");
      let horaFinishArray = window.horaFinish.split(":");

      let hour1 = Number(horaInicioArray[0]) * 3600;
      let min1 = Number(horaInicioArray[1]) * 60;
      let sec1 = Number(horaInicioArray[2]);

      let horaIncioaSegundos = Number(hour1 + min1 + sec1);
      //console.log("HoraInicioSegundos: " + horaIncioaSegundos);

      let hour4 = Number(horaFinishArray[0]) * 3600;
      let min4 = Number(horaFinishArray[1]) * 60;
      let sec4 = Number(horaFinishArray[2]);

      let horaFinishaSegundos = Number(hour4 + min4 + sec4);

      let RestoHoraInicioFin = horaFinishaSegundos - horaIncioaSegundos;

      let horaFinal = Math.trunc(RestoHoraInicioFin / 3600);
      let horaFinalView;
      if (horaFinal < 10) {
        horaFinalView = "0" + horaFinal;
      } else {
        horaFinalView = horaFinal;
      }

      let restoHoraFinal = RestoHoraInicioFin % 3600;
      let minFinal = Math.trunc(restoHoraFinal / 60);
      let minFinalView;
      if (minFinal < 10) {
        minFinalView = "0" + minFinal;
      } else {
        minFinalView = minFinal;
      }
      let secFinal = restoHoraFinal % 60;
      let secFinalView;
      if (secFinal < 10) {
        secFinalView = "0" + secFinal;
      } else {
        secFinalView = secFinal;
      }

      horaFinalRegistro =
        horaFinalView + ":" + minFinalView + ":" + secFinalView;
    }
    let permission;
    if(timetowork==="08:00:00"){
      permission=false;
    } else{
      permission=true;
    }
    
    await updateDoc(
      doc(
        db,
        "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
      ),
      {
        totalDay: horaFinalRegistro,
        permissionType:permission
      }
    );

    try {
      let valorAnterior;
      const docRef2 = doc(
        db,
        "Usuarios/" + window.cedulaEmpleado + "/MONTHLY_REGISTER/" + month_year
      );
      const docSnap2 = await getDoc(docRef2);
      if (docSnap2.exists()) {
        valorAnterior = docSnap2.data().totalHours;
      }

      let horaFinishRegister = valorAnterior.split(":");

      let hour1 = Number(horaFinishRegister[0]) * 3600;
      let min1 = Number(horaFinishRegister[1]) * 60;
      let sec1 = Number(horaFinishRegister[2]);

      let horaEnSegundos = Number(hour1 + min1 + sec1);
      //console.log("HoraInicioSegundos: " + horaEnSegundos);

      let newHoraFinishRegister = horaFinalRegistro.split(":");

      let hour2 = Number(newHoraFinishRegister[0]) * 3600;
      let min2 = Number(newHoraFinishRegister[1]) * 60;
      let sec2 = Number(newHoraFinishRegister[2]);

      let horaEnSegundos2 = Number(hour2 + min2 + sec2);
      //console.log("HoraInicioSegundos: " + horaEnSegundos2);

      let sumaHoras = horaEnSegundos + horaEnSegundos2;

      let horaFinal = Math.trunc(sumaHoras / 3600);
      let horaFinalView;
      if (horaFinal < 10) {
        horaFinalView = "0" + horaFinal;
      } else {
        horaFinalView = horaFinal;
      }

      let restoHoraFinal = sumaHoras % 3600;
      let minFinal = Math.trunc(restoHoraFinal / 60);
      let minFinalView;
      if (minFinal < 10) {
        minFinalView = "0" + minFinal;
      } else {
        minFinalView = minFinal;
      }
      let secFinal = restoHoraFinal % 60;
      let secFinalView;
      if (secFinal < 10) {
        secFinalView = "0" + secFinal;
      } else {
        secFinalView = secFinal;
      }

      const horaMes = horaFinalView + ":" + minFinalView + ":" + secFinalView;

      await updateDoc(
        doc(
          db,
          "Usuarios/" +
            window.cedulaEmpleado +
            "/MONTHLY_REGISTER/" +
            month_year
        ),
        {
          totalHours: horaMes,
        }
      );
    } catch (error) {
      console.log(firstName  + "    "+lastName)
      const completeName = firstName + " " + lastName;
      await setDoc(
        doc(
          db,
          "Usuarios/" +
            window.cedulaEmpleado +
            "/MONTHLY_REGISTER/" +
            month_year
        ),
        {
          totalHours: horaFinalRegistro,
          id: window.cedulaEmpleado,
          completeName: completeName,
        }
      );
    }
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: `${progress === null ? "white" : "green"} `,
    borderRadius: 40,
    textAlign: "right",
  };
  function validateButton() {
    if (progress === null && progress < 100) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="overflow-auto bg-neutral-700 bg-opacity-60 fixed inset-0 z-50 justify-center items-center">
      <div className=" justify-center items-center h-screen w-full left-0 top-0  ">
        <div className="justify-center modal-space-container flex items-center  min-h-screen ">
          <div className="justify-center items-center w-8/12 modal-content border-none shadow-lg  flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalScrollableLabel"
              >
                Subir evidencia de trabajo
              </h5>
              <button onClick={handleCancelClick} className="relative left-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  fill="currentColor"
                  className="bi bi-x-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
            <form>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                />
              </div>
              <div>
                <div style={Childdiv}>
                  <p className="p-1 text-black font-size-sm">{}</p>
                </div>
              </div>
            </form>
            <form className="w-full max-w-lg ml-5">
              <div className="flex flex-wrap -mx-3 mb-6 ">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Description
                  </label>

                  <textarea
                    className="w-96 bg-gray-200 h-44"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </form>
            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              <button
                onClick={saveEvidence}
                className={
                  validateButton() == true
                    ? "inline-block px-6 py-2.5 bg-blue-600/70 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                    : "inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                }
                disabled={description === ""}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEvidenceFinish;
