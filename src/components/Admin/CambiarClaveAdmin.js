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
import { UserContext } from "../../Controller/context/UserProvider";
import swal from "sweetalert";

import '../styles/Password.css';
import expresionesR from "../../Controller/validaciones/expresionesRegulares";

export const CambiarClaveAdmin = () => {
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPassword2, setNewPassword2] = useState();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isValidPassword2, setIsValidPassword2] = useState(null);
  const [messageErrorPassword2, setMessageErrorPassword2] = useState(null);
  

  const { user } = useContext(UserContext);

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
        navigate("/admin");
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
    navigate("/admin");
  };

  // handle toggle
  const toggle = () => {
    setOpen(!open);
  };

  // handle toggle
  const toggle1 = () => {
    setOpen1(!open1);
  };

   // handle toggle
   const toggle2 = () => {
    setOpen2(!open2);
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
  const validateButton = () => {
    if(isValidPassword2===false){
      return true;
    }
    else{
      return false;
    }
  }


  return (
    <div className="flex justify-center items-center mt-20">
      <div className="flex flex-col">
        <div className="flex justify-center items-center mt-5">
          <h1 className="font-semibold text-xl"> Cambiar contraseña </h1>
        </div>
        <div className="text-gray-500 flex justify-center items-center mt-2 w-96 text-justify ">
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
            className="shadow appearance-none border rounded-lg 
          w-full py-4 px-3 text-gray-700 leading-tight 
          focus:outline-none focus:shadow-outline mt-2"
            type={open === false ? "password" : "text"}
            placeholder="***********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-2xl absolute bottom-4 right-5">
            {open === false ? (
              <AiFillEye onClick={toggle} />
            ) : (
              <AiFillEyeInvisible onClick={toggle} />
            )}
          </div>
        </div>

        <div className="relative">
          <div className="mt-5">
            <label>Nueva Contraseña</label>
          </div>
          <input
            className="shadow appearance-none border rounded-lg 
          w-full py-4 px-3 text-gray-700 leading-tight 
          focus:outline-none focus:shadow-outline mt-2"
            type={open1 === false ? "password" : "text"}
            placeholder="***********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyUp={validationPassword2}
            onBlur={validationPassword2}
          />

          <div className="text-2xl absolute bottom-4 right-5">
            {open1 === false ? (
              <AiFillEye onClick={toggle1} />
            ) : (
              <AiFillEyeInvisible onClick={toggle1} />
            )}
          </div>
        </div>

        <div className="relative">
          <div className="mt-5">
            <label>Confirmar nueva Contraseña</label>
          </div>
          <input
            className="shadow appearance-none border rounded-lg 
          w-full py-4 px-3 text-gray-700 leading-tight 
          focus:outline-none focus:shadow-outline mt-2"
            type={open2 === false ? "password" : "text"}
            placeholder="***********"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />

          <div className="text-2xl absolute bottom-4 right-5">
            {open2 === false ? (
              <AiFillEye onClick={toggle2} />
            ) : (
              <AiFillEyeInvisible onClick={toggle2} />
            )}
          </div>
        </div>
        <button
          className={validateButton()
           ? "bg-gray-500 hover:bg-gray-700border rounded-lg py-3 px-8 mt-5 text-white font-bold " 
          : "bg-black text-white text-lg rounded border  py-3 px-8 mt-5 "}
          
          onClick={() => resetUserPassword(password, newPassword)}
          disabled={validateButton()}
        >
          Enviar
        </button>

        <div className="mt-5">
          <div className="flex justify-center items-center">
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
