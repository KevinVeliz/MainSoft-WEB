import { getAuth, sendEmailVerification } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { auth, db } from "../firebase/FirebaseConfiguration";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import swal from "sweetalert";

import "./Preloader.css";

const Login = () => {
  //con esta linea obtenemos la información del usuario que esta dentro del UserProvider

  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [rol, setRol] = React.useState([]);
  const { loginUser, signOutUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // handle toggle
  const toggle = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  async function actualizarRol(email) {
    const docRef2 = doc(db, "Roles/" + email);
    const docSnap2 = await getDoc(docRef2);
    rol.push(docSnap2.data().rol);
  }

  const handleSubmit = async (e) => {
    setRol([]);
    e.preventDefault();
    setIsLoading(true);

    try {
      await actualizarRol(email);
      await loginUser(email, password);
      setIsLoading(false);
      //console.log("Usuario activo", window.emailVerified);

      if (window.emailVerified === true) {
        if (rol[0] === "admin") {
          navigate("/admin");
        } else if (rol[0] === "Empleado") {
          navigate("/empleado");
        } else if (rol[0] === "Gerente") {
          navigate("/manager");
        }
      } else {
        swal({
          text: "Correo no verificado.",
          icon: "warning",
          button: "Aceptar",
        });

        signOutUser(email, password);
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.code == "auth/wrong-password") {
        swal({
          text: "Contraseña inválida.",
          icon: "warning",
          button: "Aceptar",
        });
      } else if (error == "auth/internal-error") {
        swal({
          text: "Por favor, revise los campos.",
          icon: "warning",
          button: "Aceptar",
        });
      } else {
        swal({
          text: "Ocurrió un error inesperado.",
          icon: "warning",
          button: "Aceptar",
        });
      }

      //console.log("Error de inicio de sesión", error);
    }
  };

  const login = (
    <>
      <div className="flex w-full h-screen">
        <div className="w-full flex items-center justify-center lg:w-1/2">
          <div className="px-10 py-20 rounded-3xl border-2 border-gray-100">
            <h1 className="text-5xl font-semibold items-center text-center">
              INICIO SESIÓN
            </h1>
            <p className="font-medium text-lg text-gray-500 mt-4">
              Bienvenido de vuelta, Por favor ingresa tus datos
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mt-8">
                <div>
                  <label className="text-lg font-medium">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="emailField"
                    className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className=" relative ">
                  <div>
                    <label className="text-lg font-medium">Contraseña</label>
                    <input
                      className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                      placeholder="****************"
                      type={open === false ? "password" : "text"}
                      id="passwordField"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="text-2xl absolute  top-12 right-5">
                    {open === false ? (
                      <AiFillEye onClick={toggle} />
                    ) : (
                      <AiFillEyeInvisible onClick={toggle} />
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-end text-gray-600 mt-1">
                  <a href="/recuperar"> Olvidé mi contraseña</a>
                </div>

                <div className="mt-8 flex flex-col gap-y-4">
                  <button
                    type="submit"
                    className="py-2 bg-black text-white text-lg rounded"
                  >
                    INICIAR SESIÓN
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
          <div className="w-full h-full flex bg-#38A49D">
            <img
              src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/160/7252404160_f7e73f6f-de4e-4158-b8d0-f253ac96bfc4.png?cb=1652138302%22"
              alt="logo"
              className="object-scale-down h-50 w-90 items-center"
            />
          </div>
        </div>
      </div>
    </>
  );

  return <>{isLoading ? <LoadingSpinner /> : login}</>;
};

export default Login;
