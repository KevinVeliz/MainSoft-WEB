import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    updatePassword,
  } from "firebase/auth";
  import { useContext, useState } from "react";
  import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
  import { IoMdArrowBack } from "react-icons/io";
  import { useNavigate } from "react-router-dom";
  import swal from "sweetalert";
  
  import '../../styles/Password.css';
import expresionesR from "../../Controller/validaciones/expresionesRegulares";
  
  export const CambiarClaveManager = () => {
    const [password, setPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPassword2, setNewPassword2] = useState();
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(null);
    const [isValidPassword2, setIsValidPassword2] = useState(null);
    const [messageErrorPassword, setMessageErrorPassword] = useState(null);
    const [messageErrorPassword2, setMessageErrorPassword2] = useState(null);
  
    const navigate = useNavigate();
  
    const auth = getAuth();
  
    const resetUserPassword = async (password, newPassword) => {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, cred);
        if (newPassword === newPassword2) {
          await updatePassword(auth.currentUser, newPassword);
          swal({
            text: "Contraseña actualizada correctamente.",
            icon: "success",
            button: "Aceptar",
          });
          navigate("/manager");

        } else {

          swal({
            text: "La clave no se actualizó correctamente porque las nuevas contraseñas no coinciden.",
            icon: "error",
            button: "Aceptar",
          });

        }
        
      } catch (e) {
        if (e.code == "auth/wrong-password") {
          swal({
            text: "Contraseña actual inválida.",
            icon: "error",
            button: "Aceptar",
          });
        }
        
      }
      

    };
  
    const handleReturn = () => {
      navigate("/manager");
    };
  
    // handle toggle
    const toggle = () => {
      setOpen(!open);
    };

    const toggle1 = () => {
      setOpen1(!open1);
    };

    const toggle2 = () => {
      setOpen2(!open2);
    };
    
    const validationPassword = () => {
      
        if (password.length === 0 || password === "" || password === null) {
          setIsValidPassword(false)
          setMessageErrorPassword("Este campo no puede estar vacío.");
        }  else{
          setIsValidPassword(true)
        }
              
    };

    const validationPassword2 = () => {
      if (expresionesR.password.test(newPassword) && newPassword.length > 5) {
        //console.log("correcto ")
        setIsValidPassword2(true);
      } else {
        if (newPassword.length === 0 && newPassword === "") {
          setMessageErrorPassword2("Este campo no puede estar vacío.");
        } else {
          setMessageErrorPassword2(
            "La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula,al menos una mayúscula y al menos un caracter no alfanumérico."
          );
          
        }
        setIsValidPassword2(false);
        //setMessageError("La contraseña debe tener entre 6 y 12 dígitos.")
      }
    };



    let mensaje, mensaje2;
  
    return (
      <div className="flex items-center justify-center mt-10">
        <div className="flex flex-col">
        <div className="flex items-center justify-center mt-5">
          <h1 className="text-xl font-semibold"> Cambiar contraseña </h1>
        </div>
        <div className="flex items-center justify-center mt-2 text-justify text-gray-500 w-96 ">
          <p>
            La contraseña debe tener al entre 8 y 16 caracteres, al menos un
            dígito, al menos una minúscula, al menos una mayúscula y al menos un
            caracter no alfanumérico.
          </p>
        </div>
          
  
          <div className="relative">
            <div className="mt-5">
              <label>Contraseña actual</label>
            </div>

            <input
              className="w-full px-3 py-4 mt-2 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
              type={open === false ? "password" : "text"}
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={validationPassword}
              onBlur={validationPassword}
            />
            <div className="absolute text-2xl top-16 right-5">
              {open === false ? (
                <AiFillEye onClick={toggle} />
              ) : (
                <AiFillEyeInvisible onClick={toggle} />
              )}
            </div>

            <div className="w-96">
              <p className="text-red-500">
                    {
                      (mensaje =
                        isValidPassword === false ? messageErrorPassword : "")
                    }
                  </p>
            </div>

           
          </div>
        
          <div className="relative">
            <div className="mt-5">
              <label>Nueva Contraseña</label>
            </div>
            <input
              className="w-full px-3 py-4 mt-2 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
              type={open1 === false ? "password" : "text"}
              placeholder="***********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyUp={validationPassword2}
              onBlur={validationPassword2}
            />
  
            <div className="absolute text-2xl top-16 right-5">
              {open1 === false ? (
                <AiFillEye onClick={toggle1} />
              ) : (
                <AiFillEyeInvisible onClick={toggle1} />
              )}
            </div>
          
            <div className="w-96">
              <p className="text-red-500">
                    {
                      (mensaje =
                        isValidPassword2 === false ? messageErrorPassword2 : "")
                    }
                  </p>
            </div>
          </div>
  
          <div className="relative">
            <div className="mt-5">
              <label>Confirmar nueva Contraseña</label>
            </div>
            <input
              className="w-full px-3 py-4 mt-2 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
              type={open2 === false ? "password" : "text"}
              placeholder="***********"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
            />
  
            <div className="absolute text-2xl top-16 right-5">
              {open2 === false ? (
                <AiFillEye onClick={toggle2} />
              ) : (
                <AiFillEyeInvisible onClick={toggle2} />
              )}
            </div>
          </div>
          <button
            className="px-8 py-3 mt-5 text-white border rounded-lg"
            id="button-password"
            onClick={() => resetUserPassword(password, newPassword)}
          >
            Enviar
          </button>
  
          <div className="mt-5">
            <div className="flex items-center justify-center">
              <button className="" onClick={handleReturn}>
                <div className="flex flex-row space-x-2 text-gray-500">
                  <div className="mt-1">
                    <IoMdArrowBack />
                  </div>
                  <div> Regresar</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  