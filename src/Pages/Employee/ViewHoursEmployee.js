import { async } from "@firebase/util";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../Controller/firebase/FirebaseConfiguration";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import '../styles/HoursEmpleado.css';
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

const ViewHoursEmployee = () => {
  const [date, setDate] = React.useState();
  const [dateMonth, setDateMonth] = React.useState();

  const [startWork, setstartWork] = React.useState();
  const [startBreak, setStartBreak] = React.useState();
  const [startBack, setStartBack] = React.useState();
  const [finishTime, setFinishTime] = React.useState();
  const [cedula, setCedula] = React.useState();
  const [totalHoursDay, setTotalHoursDay] = React.useState();
  const [historialMes, setHistorialMes] = useState([]);
  const [horasMensuales, setHorasMensuales] = useState();

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/empleado");
  };

  //const [monthName,setMonthName]= React.useState();
  let monthName;
  let dayName;
  let month_year;
  let day_day;
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

  const dayNames = [
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
    "DOMINGO",
  ];

  React.useEffect(() => {
    getCedula();
  }, []);

  const getCedula = async () => {
    const docRef2 = doc(db, "Roles/" + window.email);
    const docSnap2 = await getDoc(docRef2);

    if (docSnap2.exists()) {
      setCedula(docSnap2.data().id);
    } else {
      //console.log("No se pudo leer el documento de cedula");
    }
  };

  const informationFunction = async (cedula, month_year, day_day) => {
    //console.log("month_year", month_year, day_day);
    const docRef = doc(
      db,
      "Usuarios/" + cedula + "/" + month_year + "/" + day_day
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Entra y setea");

      setstartWork(docSnap.data().startWork);
      setStartBreak(docSnap.data().startBreak);
      setStartBack(docSnap.data().startBack);
      setFinishTime(docSnap.data().finishTime);
      setTotalHoursDay(docSnap.data().totalDay);
    } else {
      //console.log("No existe el documento")
      setstartWork("");
      setStartBreak("");
      setStartBack("");
      setFinishTime("");
      setTotalHoursDay("");
      swal({
        text: "No existen registros en este día.",
        icon: "info",
        button: "Aceptar",
      });
    }
  };

  const consulta = async () => {
    if (date === undefined) {
      swal({
        text: "Por favor, seleccione una fecha para la consulta.",
        icon: "warning",
        button: "Aceptar",
      });
    }
    const horasTrabajoTmp = date.split("-");

    //console.log("dateSelected1", horasTrabajoTmp)

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

    //console.log("numero dia", day);

    month_year = monthName + "_" + horasTrabajoTmp[0];

    //console.log("date", month_year);

    day_day = dayName + "_" + horasTrabajoTmp[2];
    //console.log("day", day_day);
    informationFunction(cedula, month_year, day_day);
  };

  const consultaMes = async () => {
    if (dateMonth === undefined) {
      swal({
        text: "Por favor, seleccione un mes para la consulta.",
        icon: "warning",
        button: "Aceptar",
      });
    }
    historialMes.splice(0, historialMes.length);
    setHistorialMes([]);
    const horasTrabajoTmp = dateMonth.split("-");

    if (horasTrabajoTmp[1] < 10) {
      const dateMonth = horasTrabajoTmp[1].split("0");
      monthName = monthNames[dateMonth[1] - 1];
    } else {
      const dateMonth = horasTrabajoTmp[1];
      monthName = monthNames[dateMonth - 1];
    }

    month_year = monthName + "_" + horasTrabajoTmp[0];

    //console.log("Mes_año", month_year);
    const docRef = query(
      collection(db, "Usuarios/" + cedula + "/" + month_year)
    );
    const docSnap = await getDocs(docRef);

    docSnap.forEach((doc) => {
      historialMes.push(doc.data());
    });
    setHistorialMes(historialMes);
    //console.log("----", historialMes);

    //console.log("tamanio de resultado", historialMes.length)
    if (historialMes.length == 0) {
      swal({
        text: "No existen registros de este mes.",
        icon: "info",
        button: "Aceptar",
      });
    }

    const sumaHoras = [];
    for (let i = 0; i < historialMes.length; i++) {
      let hora = historialMes[i].totalDay.split(":");
      //console.log("horas:-----", hora);
      let hour1 = Number(hora[0]) * 3600;
      let min1 = Number(hora[1]) * 60;
      let sec1 = Number(hora[2]);

      let horaEnSegundos = Number(hour1 + min1 + sec1);
      sumaHoras.push(horaEnSegundos);
    }
    //console.log("horas en segundo", sumaHoras);

    let suma = 0;
    for (let i = 0; i < sumaHoras.length; i++) {
      suma = suma + sumaHoras[i];
    }
    //console.log("suma*******", suma);

    //los segundos totales calculados se vuelven a convertir en hh:mm:ss
    let horaFinal = Math.trunc(suma / 3600);
    let horaFinalView;
    if (horaFinal < 10) {
      horaFinalView = "0" + horaFinal;
    } else {
      horaFinalView = horaFinal;
    }


    let restoHoraFinal = suma % 3600;
    let minFinal = Math.trunc(restoHoraFinal / 60);
    let minFinalView;
    if (minFinal < 10) {
      minFinalView = "0" + minFinal;
    } else {
      minFinalView = minFinal;
    }
    //console.log("resto final---", minFinal);
    //console.log("hora final+++++++++", minFinalView);
    let secFinal = restoHoraFinal % 60;
    let secFinalView;
    if (secFinal < 10) {
      secFinalView = "0" + secFinal;
    } else {
      secFinalView = secFinal;
    }

    let horaFinalRegistro =
      horaFinalView + ":" + minFinalView + ":" + secFinalView;

    //console.log("Horas de ", month_year + "->" + horaFinalRegistro);
    setHorasMensuales(horaFinalRegistro);

    //console.log("historialMes", historialMes)
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-teal-50 md:overflow-y-auto">
      
    <div className=" sm:flex sm:flex-col md:flex md:flex-col lg:grid lg:grid-cols-2">
      <div className="flex justify-center mt-5 ">
        <div className="relative block w-10/12 p-6 bg-white rounded-lg shadow-xl ring-1 ring-gray-900/5 ">
          <div className="flex items-center justify-center w-10/12">
            <div className="mb-5 font-bold">
              <h1>HORAS DIARIAS</h1>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="">
              <input
                name="start"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm 
                rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                w-full pl-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 
                dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                dark:focus:border-blue-500"
              />
            </div>
           
            <button
                className="px-4 py-2 ml-5 text-black bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={async () => await consulta()}>
                <div className="flex items-center justify-center flex-nowrap">
                  <div>
                    <AiOutlineSearch className="mr-2" />
                  </div>
                  <div>Buscar</div>
                </div>
              </button>
          </div>
        <div >

        <div className="flex items-center justify-center">

        <div className="flex items-center justify-center w-9/12 mt-5 border-2 divide-y divide-gray-200/50 ">

          <table >
            <thead>
              <tr>
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
                  Horas totales
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white ">
                <td className="p-3 text-sm text-gray-700">{startWork}</td>
                <td className="p-3 text-sm text-gray-700">{startBreak}</td>
                <td className="p-3 text-sm text-gray-700">{finishTime}</td>
                <td className="p-3 text-sm text-gray-700">{totalHoursDay}</td>
              </tr>
            </tbody>
            
          </table>
        </div>
          </div>
        </div>
        </div>
      </div>

      <div className="flex justify-center mt-5 ">
        <div className="block w-10/12 p-6 bg-white rounded-lg shadow-xl card-mes h-5/6 ring-1 ring-gray-900/5 md:h-auto">
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center ">
              <div className="mb-5 font-bold">
                <h1>HORAS MENSUALES</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <input
                type="month"
                value={dateMonth}
                onChange={(e) => setDateMonth(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

       
            <button
                className="px-4 py-2 ml-5 text-black bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={async () => {
              await consultaMes();
            }}>
                <div className="flex items-center justify-center flex-nowrap">
                  <div>
                    <AiOutlineSearch className="mr-2" />
                  </div>
                  <div>Buscar</div>
                </div>
              </button>
          </div>

          <div className="grid items-center justify-center grid-rows-1 p-5 ">
            <div className="border-2 divide-y divide-gray-200" >
              <div className="grid grid-cols-2 p-3 ">
                <div> Día </div>
                <div className="flex items-center justify-center "> Horas de trabajo </div>
              </div>
              <div className="items-center justify-center divide-y divide-gray-200">

                  {historialMes.sort(function (a, b) {
                    return a.id - b.id;
                  }).map((item) => (
                    <div className="grid grid-cols-2 p-3 " key={item.id}>
                      <div>{Number(item.id)}</div>

                      <div className="flex items-center justify-center "> {item.totalDay}</div>
                    </div>
                  ))}
            <div className="divide-y divide-blue-500 ">
              {historialMes.length !== 0 && (
                <div className="flex flex-col items-center justify-center p-3">
                  <div>Horas Mensuales</div>
                  <div className="flex items-center justify-center pl-3">{horasMensuales}</div>
                </div>
              )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
          

        <div className="mt-5">
          <div className="flex items-center justify-center">
            <button className="" onClick={goBack}>
              <div className="flex flex-row space-x-2 font-bold text-black">
                <div className="mt-1">
                  <IoMdArrowBack />
                </div>
                <div> Regresar</div>
              </div>
            </button>
          </div>
        </div>
  

  </div>
  );
};

export default ViewHoursEmployee;
