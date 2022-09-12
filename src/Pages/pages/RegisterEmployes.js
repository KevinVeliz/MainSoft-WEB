import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth2 } from "../../Controller/firebase/FirebaseConfiguration";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import swal from "sweetalert";

export const RegisterEmployes = () => {
  const [name, setName] = useState();
  const [lastname, setLastName] = useState();
  const [id, setId] = useState();
  const [emailEmp, setEmailEmp] = useState();
  const [rol, setRol] = useState("Empleado");
  const [password, setPassword] = useState();
  const [cargo, setCargo] = useState();
  const [isValidName, setIsValidName] = useState(null);
  const [isValidLastName, setIsValidLastName] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(null);
  const [isValidPassword, setIsValidPassword] = useState(null);
  const [isValidJob, setIsValidJob] = useState(null);
  const [isValidCedula, setIsValidCedula] = useState(null);

  const [open, setOpen] = useState(false);


  const [todosCargos, setTodosCargos] = useState([]);
  const [nuevoCargo, setNuevoCargo] = useState();

  const navigate = useNavigate();
  useEffect(() => {

    getCargos();
    //console.log("Mis cargos",cargosTmp)
  }, [])



  // handle toggle
  const toggle = () => {
    setOpen(!open);
  };

  const [messageError, setMessageError] = useState(null);
  const [messageErrorName, setMessageErrorName] = useState(null);
  const [messageErrorLastName, setMessageErrorLastName] = useState(null);
  const [messageErrorEmail, setMessageErrorEmail] = useState(null);
  const [messageErrorCedula, setMessageErrorCedula] = useState(null);
  const [messageErrorPassword, setMessageErrorPassword] = useState(null);





  const getCargos = async () => {
    let cargosTmp = [];
    const docRefCargos = query(collection(db, "Cargos/"));
    const docSnap = await getDocs(docRefCargos);

    docSnap.forEach((doc) => {
      cargosTmp.push(doc.data());
    });

    setTodosCargos(cargosTmp);


  }


  const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ]{1,25}$/, // Letras pueden llevar acentos.
    text: /^[a-zA-ZÀ-ÿ\s]{1,30}$/,
    password: /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040-\u002E])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/, 
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    numero: /^\d{10}$/, // 10 numeros.
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Procesado form de registro", emailEmp, password);
    //console.log("Usuario creado en Firebase");
    //navigate("/")
    createUserWithEmailAndPassword(auth2, emailEmp, password)
      .then(() => {
        sendEmailVerification(auth2.currentUser)
          .then(() => {

          }).catch((err) =>
            swal({
              text: err.message,
              icon: "success",
              button: "Aceptar",
            })

          )
      })

    try {
      const docuRef = doc(db, "Usuarios/" + id);
      setDoc(docuRef, {
        mail: emailEmp,
        rol: rol,
        firstName: name,
        secondName: null,
        lastName: lastname,
        secondLastName: null,
        id: id,
        phoneNumber: null,
        civilStatus: null,
        gender: null,
        birthday: null,
        address: null,
        phoneHouse: null,
        imageUser: null,
        workstation: nuevoCargo,
        workingState: "NOTWORKING",
        timetowork: "08:00:00",
        stateBreak:false
      });

      const docuRef2 = doc(db, "Roles/" + emailEmp);
      setDoc(docuRef2, {
        email: emailEmp,
        rol: rol,
        firstName: name,
        lastName: lastname,
        id: id,
      });

      swal({
        text: "Usuario creado exitosamente",
        icon: "success",
        button: "Aceptar",
      })
      navigate("/admin");

    } catch (error) {
      swal({
        text: error.code,
        icon: "success",
        button: "Aceptar",
      })
    }
  };

  const handleClickRegisterEmploye = () => {
    navigate("/admin");
  };
  function cambioRol(e) {
    setRol(e.target.value);
  }

  function cambioCargo(e) {
    setNuevoCargo(e.target.value);
  }

  const validationName = () => {
    if (expresiones.nombre.test(name) && name !== "" && name.length > 0) {
      setIsValidName(true);
    } else {
      if (name.length === 0 && name === "") {
        setMessageErrorName("Este campo no puede estar vacío.")
      } else {
        setMessageErrorName("Este campo solo acepta letras.")
      }
      //console.log("Incorrecto ")
      setIsValidName(false);
    }
  };

  const validationLastName = () => {
    if (expresiones.nombre.test(lastname) && lastname !== "" && lastname.length > 0) {
      setIsValidLastName(true);
    } else {
      if (lastname.length === 0 && lastname === "") {
        setMessageErrorLastName("Este campo no puede estar vacío.")
      }
      else {
        setMessageErrorLastName("Este campo solo acepta letras.")
      }
      setIsValidLastName(false);
    }
  };


  const validationEmail = () => {
    if (expresiones.correo.test(emailEmp)) {
      setIsValidEmail(true);
      existEmail(emailEmp);
    } else {
      setMessageErrorEmail("Correo no válido.")
      setIsValidEmail(false);
    }
  };

  const [emailPerson, setEmailPerson] = useState([])
  const existEmail = async (email) => {
    let personsTmpEmail = [];

    const queryPersonEmail = query(collection(db, "Roles/"));
    const result = await getDocs(queryPersonEmail);

    result.forEach((doc) => {
      personsTmpEmail.push(doc.data().email);
    });
    setEmailPerson(personsTmpEmail);
    for (let i = 0; i < personsTmpEmail.length; i++) {
      if (email === personsTmpEmail[i]) {
        swal({
          text: "El correo ya se encuentra registrado.",
          icon: "info",
          button: "Aceptar",
        })
        setIsValidEmail(false);
        setEmailEmp("")

      }

    }
  }

  const [cedulaPerson, setCedulaPerson] = useState([])

  const existCedula = async (cedula) => {
    let personsTmpCedula = [];

    const queryPersonCedula = query(collection(db, "Roles/"));
    const result = await getDocs(queryPersonCedula);

    result.forEach((doc) => {
      personsTmpCedula.push(doc.data().id);
    });
    setCedulaPerson(personsTmpCedula);
    for (let i = 0; i < personsTmpCedula.length; i++) {
      if (cedula === personsTmpCedula[i]) {
        swal({
          text: "La cédula ya se encuentra registrada.",
          icon: "info",
          button: "Aceptar",
        })
        setIsValidCedula(false);
        setId("")

      }

    }
  }

  const validationPassword = () => {
    if (expresiones.password.test(password) && password.length > 5) {
      //console.log("correcto ")
      setIsValidPassword(true);
    } else {
      if (password.length === 0 && password === "") {
        setMessageErrorPassword("Este campo no puede estar vacío.")
      }
      else {
        setMessageErrorPassword("La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula,al menos una mayúscula y al menos un caracter no alfanumérico.")
      }
      setIsValidPassword(false);
      //setMessageError("La contraseña debe tener entre 6 y 12 dígitos.")
    }
  };


  const validationCedula = () => {

    if (id.length === 10) {
      setIsValidCedula(true);
    } else {
      if (id.length === 0 && id === "") {

        setMessageErrorCedula("Este campo no puede estar vacío.")
      }
      else {
        setMessageErrorCedula("La cédula no es válida.")
      }
      setIsValidCedula(false);
    }

    verificarCedula();
    existCedula(id);
  };

  function validButton() {
    if (
      isValidName === true &&
      isValidLastName === true &&
      isValidPassword === true &&
      isValidEmail === true
    ) {
      return false;
    } else {
      return true;
    }

  }

  function verificarCedula() {

    if (typeof id == "string" && id.length == 10 && /^\d+$/.test(id)) {

      var digitos = id.split("").map(Number);
      var codigo_provincia = digitos[0] * 10 + digitos[1];
      //console.log("si", codigo_provincia);

      if (
        codigo_provincia >= 1 &&
        (codigo_provincia <= 24 || codigo_provincia == 30)
      ) {
        var digito_verificador = digitos.pop();
        //console.log("si---", digito_verificador);

        var digito_calculado =
          digitos.reduce(function (valorPrevio, valorActual, indice) {
            return (
              valorPrevio -
              ((valorActual * (2 - (indice % 2))) % 9) -
              (valorActual == 9) * 9
            );
          }, 1000) % 10;

        if (digito_calculado === digito_verificador) {
          setIsValidCedula(true);
          setMessageError("Cédula correcta");
        } else {
          setIsValidCedula(false);
          setMessageError("Cédula incorrecta");
        }
      } else {
        setIsValidCedula(false);
        setMessageError("Cédula incorrecta");
      }
    } else {
      setIsValidCedula(false);
      setMessageError("");
    }
    return false;
  }




  let mensaje;
  return (

    <div className="flex">
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div className="px-10 py-20 border-2 border-gray-100 rounded-3xl">

          <h1 className="items-center text-3xl font-semibold text-center">
            REGISTRO DE EMPLEADOS
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mt-8">
              <div>
                <label className='text-lg font-medium'>Nombre</label>
                <input
                  type='nombre'
                  id='nombre'
                  className={isValidName === true ? 'w-full border-2 border-green-500 rounded-xl p-4 mt-1 bg-transparent' : 'w-full border-2 border-gray-300 rounded-xl p-4 mt-1 bg-transparent'}
                  placeholder='Juan'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyUp={validationName}
                  onBlur={validationName}
                />
                <p className="text-red-500">{mensaje = (isValidName === false ? messageErrorName : "")}</p>
              </div>
              <div>
                <label className="text-lg font-medium">Apellido</label>
                <input
                  type="apellido"
                  id="apellidoField"
                  className={
                    isValidLastName === true
                      ? "w-full border-2 border-green-500 rounded-xl p-4 mt-1 bg-transparent"
                      : "w-full border-2 border-gray-300 rounded-xl p-4 mt-1 bg-transparent"
                  }
                  placeholder="Alvarado"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyUp={validationLastName}
                  onBlur={validationLastName}
                />
                <p className="text-red-500">
                  {mensaje = (isValidLastName === false ? messageErrorLastName : "")}
                </p>
              </div>

              <div>
                <label className="text-lg font-medium">Cédula</label>
                <input
                  type="cedula"
                  id="cedulaField"
                  className={
                    isValidCedula === true
                      ? "w-full border-2 border-green-500 rounded-xl p-4 mt-1 bg-transparent"
                      : "w-full border-2 border-gray-300 rounded-xl p-4 mt-1 bg-transparent"
                  }
                  placeholder="1753204205"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyUp={validationCedula}
                  onBlur={validationCedula}
                  maxLength={10}
                />
                <p className="text-red-500">
                  {mensaje = (isValidCedula === false ? messageErrorCedula : "")}
                </p>
              </div>

              <div>
                <label className="text-lg font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="emailField"
                  className={
                    isValidEmail === true
                      ? "w-full border-2 border-green-500 rounded-xl p-4 mt-1 bg-transparent"
                      : "w-full border-2 border-gray-300 rounded-xl p-4 mt-1 bg-transparent"
                  }
                  placeholder="example@hotmail.com"
                  value={emailEmp}
                  onChange={(e) => setEmailEmp(e.target.value)}
                  onKeyUp={validationEmail}
                  onBlur={validationEmail}
                />
                <p className="text-red-500">{(mensaje = isValidEmail === false ? messageErrorEmail : "")}</p>

              </div>


              <div className="relative ">
                <div>
                  <label className="text-lg font-medium">Contraseña</label>
                  <input
                    className={
                      isValidPassword === true
                        ? "w-full border-2 border-green-500 rounded-xl p-4 mt-1 bg-transparent"
                        : "w-full border-2 border-gray-300 rounded-xl p-4 mt-1 bg-transparent"
                    }
                    placeholder="****************"
                    type={open === false ? "password" : "text"}
                    id="passwordField"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={validationPassword}
                    onBlur={validationPassword}
                  />

                </div>
                <div className="absolute text-2xl top-12 right-5">
                  {open === false ? (
                    <AiFillEye onClick={toggle} />
                  ) : (
                    <AiFillEyeInvisible onClick={toggle} />
                  )}
                </div>

                <p className="text-red-500 w-80">
                  {mensaje = (isValidPassword === false ? messageErrorPassword : "")}
                </p>

              </div>

              <div className="mt-2">
                <label className="text-lg font-medium">ROL</label>
                <select
                  value={rol}
                  onChange={cambioRol}
                  className="w-9/12 px-2 py-2 ml-10 border-gray-100 rounded-lg border-1"
                >
                  <option selected="true" disabled="disabled">Seleccione un rol</option>
                  <option >Empleado</option>
                  <option >Gerente</option>
                  <option >Admin</option>
                </select>

              
              </div>

              <div className="mt-2">
                <label className="text-lg font-medium">Cargo</label>
                <select
                  value={nuevoCargo}
                  onChange={cambioCargo}
                   className="w-9/12 px-2 py-2 ml-6 border-gray-100 rounded-lg border-1"
                >
                  <option selected="true" disabled="disabled">Seleccione un cargo</option>
                  {todosCargos.map((item) => (
                    <option>{item.id}</option>
                  ))}
                </select>
             
              </div>

              <div className="flex flex-col mt-8 gap-y-4">
                <button
                  disabled={validButton()}
                  type="submit"
                  className={validButton()
                    ? "py-2 bg-gray-700/50 text-white font-bold text-lg rounded"
                    : " py-2 bg-black text-white text-lg rounded"}
                >

                  CREAR USUARIO
                </button>
              </div>


            </div>
          </form>
          <div className="flex flex-col mt-8 gap-y-4">
            <button
              className="py-2 text-lg text-white bg-black rounded"
              onClick={handleClickRegisterEmploye}
            >

              REGRESAR
            </button>
          </div>
        </div>

      </div>

      <div className="items-center justify-center hidden w-1/2 h-auto bg-gray-200 lg:flex">
        <div className="w-full h-full flex bg-#38A49D">
          <img
            src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/160/7252404160_f7e73f6f-de4e-4158-b8d0-f253ac96bfc4.png?cb=1652138302%22"
            alt="logo"
            className="items-center object-scale-down h-50 w-90"
          />
        </div>
      </div>
    </div>
  );
};