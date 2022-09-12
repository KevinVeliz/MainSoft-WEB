import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../Controller/firebase/FirebaseConfiguration";
import ModalEvidence from "./Evidence/ModalEvidence";
import ModalEvidenceFinish from "./Evidence/ModalEvidenceFinish";
import { HourEmployee } from "./HourEmployee";
import ModalAction from "./ModalAction";

const ViewHours = () => {
  const [rol, setRol] = React.useState();
  const [modalEvidence, setModalEvidence] = React.useState(null);
  const [choiceEvidence, setChoiceEvidence] = React.useState(false);
  const [modalEvidenceFinish, setModalEvidenceFinish] = React.useState(null);
  const [choiceEvidenceFinish, setChoiceEvidenceFinish] = React.useState(false);
  const [workingState, setWorkingState] = React.useState();
  const [workingStateValidate, setWorkingStateValidate] = React.useState();
  const [finishDay, setFinishDay] = React.useState();
  const [firstName, setFirstName] = React.useState();
  const [lastName, setLastName] = React.useState();

  const [timetoWork, setTimeToWork] = React.useState(null);

  //variables para realizar suma de horas trabajadas por el empleado
  const [horasTrabajo, setHorasTrabajo] = React.useState([]);

  //---------CONSTANTES DE LA FECHA-------------------\\
  //----------------------------------------------------
  const dateobj = new Date();
  const datebreak = new Date();
  const dateInit = new Date();

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

  //--------------------------------------------------
  const [time, setTime] = useState();
  const [diaAnterior, setDiaAnterior] = useState();

  let state;
  useEffect(() => {
    //console.log("mi dia",dateDays ,nombreDias)
    informationFunction(window.cedulaEmpleado);
    existsDocuments(window.cedulaEmpleado);
    //.log("documenntos",existsDocuments(window.cedulaEmpleado))
    setInterval(() => {
      const date = new Date();
      setTime(date.toLocaleTimeString("it-IT"));
    }, 1000);
    changeWorkingState();
    //console.log("dia anterior: " + dateDays.setDate());
    setDiaAnterior(sumarDias(dateobj, -1).getDate());
    validateState(window.cedulaEmpleado);

    //console.log("dia anterior: " + diaAnterior);
  });

  function sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }
  const [activePerson, setActivePerson] = useState("NOTWORKING");

  // CLICK ON MODAL INFORMATION
  const [modalOnEmployee, setModalOnEmployee] = React.useState(false);
  const [choiseEmployee, setChoiceEmployee] = React.useState(false);
  const [text, setText] = React.useState("");

  const [existDocument, setExistDocument] = React.useState(false);

  const clicked = () => {
    setModalOnEmployee(true);
    setText("¿Estás seguro que deseas iniciar su jornada?");
  };

  const clickedBack = () => {
    setModalOnEmployee(true);
    setText("¿Estás seguro que desea volver a su jornada?");
  };

  const action1 = () => {
    setModalOnEmployee(false);
    setChoiceEmployee(false);
    handleInicio();
  };

  const action2 = () => {
    setModalOnEmployee(false);
    setChoiceEmployee(false);
  };

  const actionback = () => {
    setModalOnEmployee(false);
    setChoiceEmployee(false);
    handlebreakback();
  };

  const actionback2 = () => {
    setModalOnEmployee(false);
    setChoiceEmployee(false);
  };

  //------- ACCIONES DE LOS BOTONES--------------------\\

  const handleInicio = async () => {
    //console.log("Hora de entrada", GetHoraInicio());
    const hora = GetHoraInicio();
    //console.log("horas, mont", month_year, day_day, hora);
    window.horaInicio = hora;
    //horasTrabajo.push(hora);
    const completeName = firstName + " " + lastName;
    if (timetoWork === "08:00:00") {
      await setDoc(
        doc(
          db,
          "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
        ),
        {
          startWork: hora,
          id: dayNumberFinal,
          completeName: completeName,
        }
      );

      setActivePerson("WORKING");
      state = timetoWork === "08:00:00" ? "WORKING" : "WORKINGPERMISSIONS";
      //console.log('state', state)
      // console.log('time to work', timetoWork)

      await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
        workingState: state,
        startWork: hora,
        InitDay: dateInit.getDate(),
      });
    } else {
      await setDoc(
        doc(
          db,
          "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
        ),
        {
          startWork: hora,
          id: dayNumberFinal,
          completeName: completeName,
          startBack: "00:00:00",
          startBreak: "00:00:00",
        }
      );

      setActivePerson("WORKING");
      state = timetoWork === "08:00:00" ? "WORKING" : "WORKINGPERMISSIONS";
      //console.log('state', state)
      // console.log('time to work', timetoWork)

      await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
        workingState: state,
        startWork: hora,
        InitDay: dateInit.getDate(),
        startBack: "00:00:00",
        startBreak: "00:00:00",
      });
    }
  };

  const changeWorkingState = async () => {
    if (time === "23:59:59") {
      await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
        workingState: "NOTWORKING",
      });
    }
  };

  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setRol(docSnap.data().rol);
      setWorkingState(docSnap.data().workingState);
      setFirstName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
      setTimeToWork(docSnap.data().timetowork);
    } else {
      // doc.data() will be undefined in this case
      //console.log("No se pudo leer el documento");
    }
  };

  const saveEvidence = () => {
    setModalEvidence(true);
    //console.log("Hora de entrada", GetHoraBreak());
    const hora = GetHoraBreak();
    //console.log("horas, mont", month_year, day_day, hora);
    //horasTrabajo.push(hora);
    let horaRegistroBreak = timetoWork === "08:00:00" ? hora : "00:00:00";
    window.horaBreak = hora;
    //console.log("activeperson", window.activePerson);
  };

  const saveEvidenceFinish = () => {
    setModalEvidenceFinish(true);
    //console.log("finalizo la jornada: ", GetHoraOut());
    const hora = GetHoraOut();
    //horasTrabajo.push(hora);
    //console.log("horas, mont", month_year, day_day, hora);
    window.horaFinish = hora;
    //console.log("activeperson", window.activePerson)
  };

  const handlebreakback = async () => {
    //console.log("Hora de entrada", GetHoraBreak());
    const hora = GetHoraBreak();
    //console.log("horas, mont", month_year, day_day, hora);
    //horasTrabajo.push(hora);
    window.horaBack = hora;
    let horaRegistro = timetoWork === "08:00:00" ? hora : "00:00:00";
    await updateDoc(
      doc(
        db,
        "Usuarios/" + window.cedulaEmpleado + "/" + month_year + "/" + day_day
      ),
      {
        startBack: hora,
      }
    );

    setActivePerson("BACKWORKING");

    await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
      workingState: "BACKWORKING",
      startBack: hora,
    });
  };

  //-----------------------------------------------------

  //----- FUNCIONES OBTENER HORA-----------------\\

  let newh, newm, news;
  function GetHoraInicio() {
    const h = dateobj.getHours();
    const m = dateobj.getMinutes();
    const s = dateobj.getSeconds();
    if (h < 10) {
      newh = "0" + h;
    } else {
      newh = h;
    }

    if (m < 10) {
      newm = "0" + m;
    } else {
      newm = m;
    }

    if (s < 10) {
      news = "0" + s;
    } else {
      news = s;
    }
    const horaactual = newh + ":" + newm + ":" + news;
    return horaactual;
  }

  let newhb, newmb, newsb;
  function GetHoraBreak() {
    const hb = datebreak.getHours();
    const mb = datebreak.getMinutes();
    const sb = datebreak.getSeconds();
    if (hb < 10) {
      newhb = "0" + hb;
    } else {
      newhb = hb;
    }

    if (mb < 10) {
      newmb = "0" + mb;
    } else {
      newmb = mb;
    }

    if (sb < 10) {
      newsb = "0" + sb;
    } else {
      newsb = sb;
    }
    const horabreak = newhb + ":" + newmb + ":" + newsb;
    return horabreak;
  }

  let newhf, newmf, newsf;
  function GetHoraOut() {
    const hf = dateobj.getHours();
    const mf = dateobj.getMinutes();
    const sf = dateobj.getSeconds();
    if (hf < 10) {
      newhf = "0" + hf;
    } else {
      newhf = hf;
    }

    if (mf < 10) {
      newmf = "0" + mf;
    } else {
      newmf = mf;
    }

    if (sf < 10) {
      newsf = "0" + sf;
    } else {
      newsf = sf;
    }
    const horafinal = newhf + ":" + newmf + ":" + newsf;
    return horafinal;
  }
  //--------------------------------------------------

  const validateState = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setWorkingStateValidate(docSnap.data().workingState);
      setFinishDay(docSnap.data().finishDay);
    } else {
      // doc.data() will be undefined in this case
      //console.log("No se pudo leer el documento");
    }

    if (workingStateValidate === "FINISHED" && finishDay === diaAnterior) {
      await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
        workingState: "NOTWORKING",
      });
    }
  };

  const validateButtonOut = () => {
    if (timetoWork === "08:00:00" && time > "15:50:00") {
      return false;
    } else if (timetoWork === "06:00:00" && time > "12:50:00") {
      return false;
    } else if (timetoWork === "04:00:00" && time > "10:50:00") {
      return false;
    } else {
      return true;
    }
  };

  const existsDocuments = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula + "/DOCUMENTS/DATA");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setExistDocument(true);
    }
  };

  //console.log('time', time)

  if (workingState === "NOTWORKING") {
    return (
      <div>
        {modalOnEmployee && (
          <ModalAction
            setModalOnEmployee={setModalOnEmployee}
            setChoiceEmployee={setChoiceEmployee}
            text={text}
            action1={action1}
            action2={action2}
          />
        )}
        <button
          className="px-16 py-2 text-lg text-black shadow-lg bg-cyan-500 rounded-xl shadow-cyan-500/50"
          onClick={clicked}
          disabled={existDocument === true ? false : true}
        >
          EMPEZAR
        </button>
      </div>
    );
  } else if (workingState === "WORKING" && timetoWork === "08:00:00") {
    return (
      <div className="flex space-x-4">
        {/* MODAL CONTROLER */}
        {modalEvidence && (
          <ModalEvidence
            setModalEvidence={setModalEvidence}
            setChoiceEvidence={setChoiceEvidence}
          />
        )}
        <button
          className="px-16 py-2 text-lg text-black bg-red-500 shadow-lg rounded-xl shadow-red-500/50"
          onClick={saveEvidence}
        >
          IR AL RECESO
        </button>
      </div>
    );
  } else if (workingState === "BREAK" && timetoWork === "08:00:00") {
    return (
      <div>
        {modalOnEmployee && (
          <ModalAction
            setModalOnEmployee={setModalOnEmployee}
            setChoiceEmployee={setChoiceEmployee}
            text={text}
            action1={actionback}
            action2={actionback2}
          />
        )}
        <button
          className="px-16 py-2 text-lg text-black shadow-lg bg-lime-500 rounded-xl shadow-lime-500/50"
          onClick={clickedBack}
        >
          VOLVER
        </button>
      </div>
    );
  } else if (workingState === "BACKWORKING") {
    return (
      <>
        {modalEvidenceFinish && (
          <ModalEvidenceFinish
            setModalEvidenceFinish={setModalEvidenceFinish}
            setChoiceEvidenceFinish={setChoiceEvidenceFinish}
          />
        )}
        <button
          disabled={validateButtonOut()}
          className="px-16 py-2 text-lg text-black bg-blue-500 shadow-lg rounded-xl shadow-yellow-500/50"
          onClick={saveEvidenceFinish}
        >
          FINALIZAR
        </button>
      </>
    );
  } else if (workingState === "WORKINGPERMISSIONS") {
    return (
      <div>
        {modalEvidenceFinish && (
          <ModalEvidenceFinish
            setModalEvidenceFinish={setModalEvidenceFinish}
            setChoiceEvidenceFinish={setChoiceEvidenceFinish}
          />
        )}
        <button
          disabled={validateButtonOut()}
          className="px-16 py-2 text-lg text-black bg-blue-500 shadow-lg rounded-xl shadow-yellow-500/50"
          onClick={saveEvidenceFinish}
        >
          FINALIZAR
        </button>
      </div>
    );
  }

};

export default ViewHours;
