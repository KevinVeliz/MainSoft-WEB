import { doc, getDoc, updateDoc } from "firebase/firestore";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../Controller/firebase/FirebaseConfiguration";
import swal from "sweetalert";
import expresionesR from "../../Controller/validaciones/expresionesRegulares";

import '../styles/ModalAdmin.css';

const Modal = ({ setModalOn, setChoice }) => {
  const [date, setDate] = useState();
  const [firstName, setFirsName] = useState();
  const [lastName, setLastName] = useState();
  const [secondName, setSecondName] = useState();
  const [secondLastName, setSecondLastName] = useState();
  const [address, setAddress] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [phoneHouse, setPhoneHouse] = useState();
  const [civilstatus, setCivilStatus] = useState();
  const [gender, setGender] = useState();

  //validaciones
  const [isValidSecondName, setIsValidSecondName] = useState(null);
  const [isValidSecondLastName, setIsValidSecondLastName] = useState(null);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(null);
  const [isValidNumber, setIsValidNumber] = useState(null);


  const handleCancelClick = () => {
    setChoice(false);
    setModalOn(false);
  };

  function cambioCivilStatus(e) {
    setCivilStatus(e.target.value);
  }

  function cambioGender(e) {
    setGender(e.target.value);
  }
  React.useEffect(() => {
    informationFunction(window.id);   
  }, []);



  const handleSubmit = async () => {
    //servicio que necesita traer campos especificos se define dentro de la vista
    await updateDoc(doc(db, "Usuarios/" + window.id), {
      secondName: secondName,
      secondLastName: secondLastName,
      birthday: date,
      address: address,
      civilStatus: civilstatus,
      gender: gender,
      phoneHouse: phoneHouse,
      phoneNumber: phoneNumber,
    });
    setChoice(false);
    setModalOn(false);
    swal({
      text: "Información actualizada.",
      icon: "success",
      button: "Aceptar",
    });
  };

  //servicio que necesita traer campos especificos se define dentro de la vista

  const informationFunction = async (cedula) => {
    const docRef = doc(db, "Usuarios/" + cedula);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFirsName(docSnap.data().firstName);
      setSecondName(docSnap.data().secondName);
      setLastName(docSnap.data().lastName);
      setSecondLastName(docSnap.data().secondLastName);
      setAddress(docSnap.data().address);
      setPhoneHouse(docSnap.data().phoneHouse);
      setPhoneNumber(docSnap.data().phoneNumber);
      setDate(docSnap.data().birthday);
      setGender(docSnap.data().gender);
      setCivilStatus(docSnap.data().civilStatus);
    } else {
      //console.log("No se pudo leer el documento");
    }
  };

  const validationSecondName = () => {
    if (expresionesR.nombre.test(secondName) || secondName === "") {
      setIsValidSecondName(true);
    } else {
      setIsValidSecondName(false);
    }
  };

  const validationSecondLastName = () => {
    if (expresionesR.nombre.test(secondLastName) || secondLastName === "") {
      setIsValidSecondLastName(true);
    } else {
      setIsValidSecondLastName(false);
    }
  };

  const validationPhoneNumer = () => {
    if (expresionesR.numero.test(phoneHouse) || phoneHouse === ""  || phoneHouse === null) {
      setIsValidPhoneNumber(true);
    } else {
      setIsValidPhoneNumber(false);
    }
  };

  const validationNumber = () => {
    if (expresionesR.numero.test(phoneNumber) || phoneNumber === ""  || phoneHouse === null) {
      setIsValidNumber(true);
    } else {
      setIsValidNumber(false);
    }
  };

  const validateButton = () => {
    if (
      isValidSecondName === false ||
      isValidSecondLastName === false ||
      isValidPhoneNumber === false ||
      isValidNumber === false
    ) {
      return true;
    } else {
      return false;
    }
  };

 

  return (
    <div className="fixed inset-0 z-50 items-center justify-center overflow-auto bg-neutral-700 bg-opacity-60">
      <div className="top-0 left-0 items-center justify-center w-full ">
        <div className="flex items-center justify-center scale-95 h-5/6 ">
          <div className="flex flex-col items-center justify-center text-current bg-white border-none rounded-md shadow-lg outline-none pointer-events-auto xl:w-5/12 lg:w-7/12 sm:w-11/12 md:w-10/12 modal-content bg-clip-padding">
            <div className="flex items-center justify-between flex-shrink-0 p-4 modal-header rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalScrollableLabel"
              >
                Datos Personales
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
            <form className="w-full max-w-lg ml-5">
              <div className="flex flex-wrap mb-6 -mx-3 ">
                <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Primer Nombre
                  </label>
                  <input
                    disabled
                    className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    value={firstName}
                    type="text"
                    placeholder="Primer Nombre"
                  />
                </div>
                <div className="w-full px-3 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Segundo Nombre
                  </label>
                  <input
                    className={
                      isValidSecondName === false
                        ? "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    }
                    id="grid-last-name"
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                    type="text"
                    placeholder="Segundo Nombre"
                    onKeyUp={validationSecondName}
                    onBlur={validationSecondName}
                  />
                </div>

                <div className="w-full px-3 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Apellido
                  </label>
                  <input
                    disabled
                    className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    defaultValue={lastName}
                    type="text"
                    placeholder="Apellido"
                  />
                </div>

                <div className="w-full px-3 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Segundo Apellido
                  </label>
                  <input
                    className={
                      isValidSecondLastName === false
                        ? "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    }
                    id="grid-last-name"
                    value={secondLastName}
                    onChange={(e) => setSecondLastName(e.target.value)}
                    type="text"
                    placeholder="Segundo Apellido"
                    onKeyUp={validationSecondLastName}
                    onBlur={validationSecondLastName}
                  />
                </div>

                <div className="w-full px-3 pt-2 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Teléfono
                  </label>
                  <input
                    className={
                      isValidPhoneNumber === false
                        ? "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    }
                    id="grid-last-name"
                    value={phoneHouse}
                    onChange={(e) => setPhoneHouse(e.target.value)}
                    type="text"
                    placeholder="022954412"
                    onKeyUp={validationPhoneNumer}
                    onBlur={validationPhoneNumer}
                    maxLength="10"
                  />
                </div>

                <div className="w-full px-3 pt-2 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Celular
                  </label>
                  <input
                    className={
                      isValidNumber === false
                        ? "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    }
                    id="grid-last-name"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="text"
                    placeholder="0968144875"
                    onKeyUp={validationNumber}
                    onBlur={validationNumber}
                    maxLength="10"
                  />
                </div>

                <div className="w-full px-3 pt-2 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    ID
                  </label>
                  <input
                    className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    defaultValue={window.id}
                    type="text"
                    placeholder="1753204205"
                  />
                </div>

                <div className="w-full px-3 mt-2 mb-6 md:w-6/12 md:mb-0">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase ">
                    Estado Civil
                  </label>
                  <div className="relative md:w-auto">
                    <select
                      className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      value={civilstatus}
                      onChange={cambioCivilStatus}
                    >
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widower</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                      <svg
                        className="w-4 h-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full px-3 mt-2 mb-6 md:w-6/12 md:mb-0">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase ">
                    Sexo
                  </label>
                  <div className="relative md:w-auto">
                    <select
                      className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      value={gender}
                      onChange={cambioGender}
                    >
                      <option>Masculino</option>
                      <option>Femenino</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                      <svg
                        className="w-4 h-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full px-3 mt-2 mb-6 md:w-6/12 md:mb-0">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    placeholder=""
                  />
                </div>

                <div className="w-full px-3 pt-2 md:w-full">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Dirección de residencia
                  </label>
                  <input
                    className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="example"
                  />
                </div>

                <div className="w-full px-3 pt-2 md:w-full">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Correo electrónico
                  </label>
                  <input
                    className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    disabled
                    defaultValue={window.email}
                    type="text"
                    placeholder="example@example.com"
                  />
                </div>
              </div>
            </form>
            <div className="flex flex-wrap items-center justify-end flex-shrink-0 p-4 border-t border-gray-200 modal-footer rounded-b-md">
              <button
                onClick={handleSubmit}
                disabled={validateButton()}
                className={

                    " buton-modal inline-block px-6 py-2.5  text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                }
               
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

export default Modal;
