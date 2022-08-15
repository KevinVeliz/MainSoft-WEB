import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db, } from "../../firebase/FirebaseConfiguration";

import swal from "sweetalert";
import expresionesR from "../../validaciones/expresionesRegulares";


const ModalData = ({ setModalData, setChoiceData }) => {
  const [date, setDate] = React.useState();
  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [secondName, setSecondName] = React.useState();
  const [secondLastName, setSecondLastName] = React.useState();
  const [address, setAddress] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [phoneHouse, setPhoneHouse] = React.useState();
  const [civilstatus, setCivilStatus] = React.useState();
  const [gender, setGender] = React.useState();
  const [email, setEmail] = React.useState();

  //validaciones
  const [isValidSecondName, setIsValidSecondName] = useState(null);
  const [isValidSecondLastName, setIsValidSecondLastName] = useState(null);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(null);
  const [isValidNumber, setIsValidNumber] = useState(null);

  const handleCancelClick = () => {
    setChoiceData(false);
    setModalData(false);
  };

  function cambioCivilStatus(e) {
    setCivilStatus(e.target.value);
  }

  function cambioGender(e) {
    setGender(e.target.value);
  }

  React.useEffect(() => {
    informationFunction(window.cedulaEmpleado);
  }, []);


  const handleSubmit = async () => {
    await updateDoc(doc(db, "Usuarios/" + window.cedulaEmpleado), {
      secondName: secondName,
      secondLastName: secondLastName,
      birthday: date,
      address: address,
      civilStatus: civilstatus,
      gender: gender,
      phoneHouse: phoneHouse,
      phoneNumber: phoneNumber,
    });
    swal({
      text: "Información actualizada correctamente.",
      icon: "success",
      button: "Aceptar",
    });
    setChoiceData(false);
    setModalData(false);

  };

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
      setEmail(docSnap.data().mail);
    } else {
      console.log("No se pudo leer el documento");
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
    if (expresionesR.numero.test(phoneHouse) || phoneHouse === null) {
      setIsValidPhoneNumber(true);
    } else {
      setIsValidPhoneNumber(false);
    }
  };

  const validationNumber = () => {
    if (expresionesR.numero.test(phoneNumber) || phoneNumber === null) {
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
    <div className="overflow-auto bg-neutral-700 bg-opacity-60 fixed inset-0 z-50 justify-center items-center">
      <div className=" justify-center items-center h-screen w-full left-0 top-0  ">
        <div className="justify-center modal-space-container flex items-center  min-h-screen ">
          <div className="justify-center items-center w-8/12 modal-content border-none shadow-lg  flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md">
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
              <div className="flex flex-wrap -mx-3 mb-6 ">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Primer Nombre
                  </label>
                  <input
                    readOnly
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    value={firstName}
                    type="text"
                    placeholder="Primer Nombre"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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

                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Apellido
                  </label>
                  <input
                    readOnly
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    defaultValue={lastName}
                    type="text"
                    placeholder="Apellido"
                  />
                </div>

                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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

                <div className="w-full md:w-1/2 px-3 pt-2">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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

                <div className="w-full md:w-1/2 px-3 pt-2">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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

                <div className="w-full md:w-1/2 px-3 pt-2">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    ID
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    defaultValue={window.cedulaEmpleado}
                    type="text"
                    placeholder="1753204205"
                    readOnly
                  />
                </div>

                <div className="w-full md:w-6/12 mb-6 md:mb-0 px-3 mt-2">
                  <label className=" block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Estado Civil
                  </label>
                  <div className=" md:w-auto relative">
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      value={civilstatus}
                      onChange={cambioCivilStatus}
                    >
                      <option>Soltero/a</option>
                      <option>Casado/a</option>
                      <option>Divorciado/a</option>
                      <option>Viudo/a</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-6/12 mb-6 md:mb-0 px-3 mt-2">
                  <label className=" block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Sexo
                  </label>
                  <div className=" md:w-auto relative">
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      value={gender}
                      onChange={cambioGender}
                    >
                      <option>Masculino</option>
                      <option>Femenino</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-6/12 px-3 mb-6 md:mb-0 mt-2">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className=" appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    placeholder=""
                  />
                </div>

                <div className="w-full md:w-full px-3 pt-2">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Dirección de residencia
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="example"
                  />
                </div>

                <div className="w-full md:w-full px-3 pt-2">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    disabled
                    defaultValue={email}
                    type="text"
                    placeholder="example@example.com"
                  />
                </div>
              </div>
            </form>
            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              <button
                onClick={handleSubmit}
                disabled={validateButton()}
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
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

export default ModalData;
