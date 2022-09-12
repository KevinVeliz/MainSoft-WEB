import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../Controller/firebase/FirebaseConfiguration";

import "../../styles/Employee.css";
import "../../styles/ModalEmploye.css";

import ModalInformation from "../ModalInformation";
import swal from "sweetalert";
import expresionesR from "../../Controller/validaciones/expresionesRegulares";

const ModalEmployee = ({ setModalOnUsers, setChoiceUsers, cedula }) => {
  const [date, setDate] = React.useState();
  const [firstName, setFirsName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [secondName, setSecondName] = React.useState("");
  const [secondLastName, setSecondLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [phoneHouse, setPhoneHouse] = React.useState("");
  const [civilstatus, setCivilStatus] = React.useState();
  const [gender, setGender] = React.useState();
  const [birthday, setBirthday] = React.useState();
  const [email, setEmail] = React.useState();
  const [timetowork, setTimeToWork] = React.useState("08:00:00");

   //validaciones
   const [isValidName, setIsValidName] = useState(null);
   const [isValidSecondName, setIsValidSecondName] = useState(null);
   const [isValidLastName, setIsValidLastName] = useState(null);
   const [isValidSecondLastName, setIsValidSecondLastName] = useState(null);
   const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(null);
   const [isValidNumber, setIsValidNumber] = useState(null);

  React.useEffect(() => {
    informationFunction(cedula);
  }, []);

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
      setBirthday(docSnap.data().birthday);
      setTimeToWork(docSnap.data().timetowork);
    } else {
      // doc.data() will be undefined in this case
      //console.log("No se pudo leer el documento");
    }
  };

  // CLICK ON MODAL INFORMATION
  const [modalOnInformation, setModalOnInformation] = React.useState(false);
  const [choiseInformation, setChoiceInformation] = React.useState(false);
  const [text, setText] = React.useState("");

  const action = () => {
    setModalOnInformation(false);
    setChoiceInformation(false);
    setChoiceUsers(false);
    setModalOnUsers(false);
  };

  const handleCancelClick = () => {
    setChoiceUsers(false);
    setModalOnUsers(false);
  };

  function cambioCivilStatus(e) {
    setCivilStatus(e.target.value);
  }

  function cambioGender(e) {
    setGender(e.target.value);
  }

  function cambioHorario(e) {
    setTimeToWork(e.target.value);
  }

  const updateUser = async () => {
    await updateDoc(doc(db, "Usuarios/" + cedula), {
      secondName: secondName,
      secondLastName: secondLastName,
      birthday: date,
      address: address,
      civilStatus: civilstatus,
      gender: gender,
      phoneHouse: phoneHouse,
      phoneNumber: phoneNumber,
      lastName: lastName,
      email: email,
      firstName: firstName,
      id: cedula,
      timetowork: timetowork,
    });
    setModalOnInformation(false);
    setChoiceInformation(false);
    setChoiceUsers(false);
    setModalOnUsers(false);
    swal({
      text: "Usuario actualizado correctamente.",
      icon: "success",
      button: "Aceptar",
    });
  };

  const deleteUser = async () => {
    await deleteDoc(doc(db, "Usuarios/" + cedula));
    await deleteDoc(doc(db, "Roles/" + email));
    setModalOnInformation(false);
    setChoiceInformation(false);
    setChoiceUsers(false);
    setModalOnUsers(false);
    swal({
      text: "Usuario eliminado correctamente.",
      icon: "success",
      button: "Aceptar",
    });

  };

  const validationName = () => {
    if (expresionesR.nombre.test(firstName) || firstName === "") {
      setIsValidName(true);
    } else {
      setIsValidName(false);
    }
  };
  
  const validationSecondName = () => {
    if (expresionesR.nombre.test(secondName) || secondName === "") {
      setIsValidSecondName(true);
    } else {
      setIsValidSecondName(false);
    }
  };

  const validationLastName = () => {
    if (expresionesR.nombre.test(lastName) || lastName === "") {
      setIsValidLastName(true);
    } else {
      setIsValidLastName(false);
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
    if (expresionesR.numero.test(phoneHouse) || phoneHouse === "" || phoneHouse === null) {
      setIsValidPhoneNumber(true);
    } else {
      setIsValidPhoneNumber(false);
    }
  };

  const validationNumber = () => {
    if (expresionesR.numero.test(phoneNumber) || phoneNumber === "" || phoneNumber === null) {
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
    <div className="fixed inset-0 z-50 items-center justify-center bg-neutral-700 bg-opacity-60">
      <div className="top-0 left-0 items-center justify-center w-full h-screen scale-95">
        <div className="flex items-center justify-center min-h-screen modal-space-container">
          <div className="flex flex-col items-center justify-center w-8/12 pt-10 overflow-y-scroll text-current bg-white border-none rounded-md shadow-lg outline-none pointer-events-auto card-content bg-clip-padding">
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

            {modalOnInformation && (
              <ModalInformation
                setModalOnInformation={setModalOnInformation}
                setChoiceInformation={setChoiceInformation}
                text={text}
                action={action}
              />
            )}
            <form className="w-full max-w-lg ml-5">
              <div className="flex flex-wrap mb-6 -mx-3 ">
              <div className="w-full px-3 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Primer nombre
                  </label>
                  <input
                    className={
                      isValidName === false
                        ? "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    }
                    id="grid-name"
                    value={firstName}
                    onChange={(e) => setFirsName(e.target.value)}
                    type="text"
                    placeholder="Segundo Nombre"
                    onKeyUp={validationName}
                    onBlur={validationName}
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
                    apellido
                  </label>
                  <input
                    className={
                      isValidLastName === false
                        ? "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "appearance-none block w-full bg-gray-200 text-gray-700 border border-grey-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    }
                    id="grid-last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="Segundo Apellido"
                    onKeyUp={validationLastName}
                    onBlur={validationLastName}
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
                    defaultValue={cedula}
                    type="text"
                    placeholder="1753204205"
                    readOnly
                  />
                </div>

                <div className="w-full px-3 mt-2 mb-6 md:w-6/12 md:mb-0">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase ">
                    Estado Civil
                  </label>
                  <div className="relative md:w-auto">
                    <select
                      onChange={cambioCivilStatus}
                      value={civilstatus}
                      className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                    >
                      <option>Soltero/a</option>
                      <option>Casado/a</option>
                      <option>Divorciado/a</option>
                      <option>Viudo/a</option>
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
                      onChange={cambioGender}
                      value={gender}
                      className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
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
                    onChange={(e) => setDate(e.target.value)}
                    value={birthday}
                    className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    placeholder=""
                  />
                </div>
                <div className="w-full px-3 pt-2 md:w-full">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                    Dirección Domiciliaria
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
                    defaultValue={email}
                    type="text"
                    placeholder="example@example.com"
                  />
                </div>

                <div className="w-full px-3 mt-2 mb-6 md:w-6/12 md:mb-0">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase ">
                    HORARIO DE TRABAJO
                  </label>
                  <div className="relative md:w-auto">
                    <select
                      onChange={cambioHorario}
                      value={timetowork}
                      className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                    >
                      <option value="08:00:00">Normal</option>
                      <option value="06:00:00">Materno</option>
                      <option value="04:00:00">Permiso</option>
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
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-end flex-shrink-0 p-4 border-t border-gray-200 modal-footer rounded-b-md">
              <button
                type="button"
                onClick={deleteUser}
                className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
              >
                Eliminar Usuario
              </button>

              <button
              disabled={validateButton()}
                type="button"
                onClick={updateUser}
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
              >
                Actualizar Usuario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEmployee;
