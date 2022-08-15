import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import '../styles/Password.css';

export const RecuperarClave = () => {
  const [email, setEmail] = useState();

  const navigate = useNavigate();
  const sendEmail = (email) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        swal({
          text: "Se ha enviado un enlace a su correo electrónico para reestablecer su contraseña.",
          icon: "success",
          button: "Aceptar",
        });
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleReturn = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="flex flex-col">
        <div className="flex justify-center ">
          <svg
            viewBox="0 0 72 72"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 rounded-full"
          >
            <path
              fill="#F4AA41"
              d="M33.54 32c-1.4-4.3-.23-9.42 3.42-13.07 5.02-5.02 12.81-5.37 17.4-.77s4.25 12.38-.77 17.4c-4.06 4.05-10.43 5.5-14.27 2.58"
            />
            <path
              fill="#F4AA41"
              stroke="#F4AA41"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="2"
              d="m33.65 31.74-2.43 2.45-16.58 16.32v7.15h7.4v-4.58h5.01V47.3h4.99l2.35-2.37v-4.3h1.97l3.09-3.09"
            />
            <path fill="#E27022" d="m15.98 53.35.01-1.91L31.9 35.87l.95.98z" />
            <circle cx="48.52" cy="24" r="3.95" fill="#E27022" />
            <g
              fill="none"
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="2"
            >
              <path d="M30.74 34.66 14.3 50.68v7.24h7.57v-4.64h5.12v-5.85h5.1l2.41-2.41v-4.36h2.01" />
              <circle cx="48.52" cy="24" r="3.95" />
              <path d="M34.23 31.18a12.36 12.36 0 0 1 3.18-12.7c4.84-4.77 12.46-4.89 17.02-.26s4.32 12.24-.52 17.02a12.27 12.27 0 0 1-14.11 2.4" />
            </g>
          </svg>
        </div>

        <div className="flex justify-center items-center mt-5">
          <h1 className="font-semibold text-xl"> ¿OLVIDASTE TU CONTRASEÑA? </h1>
        </div>
        <p className="text-gray-500 mt-5">
          No te preocupes, te enviaremos un correo para que la recuperes
        </p>

        <div className="mt-8">
          <label>Correo electrónico</label>
        </div>

        <input
          className="shadow appearance-none border rounded-lg 
          w-full py-4 px-3 text-gray-700 leading-tight 
          focus:outline-none focus:shadow-outline mt-2"
          type="text"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-violet-500 border rounded-lg py-3 px-8 mt-5 text-white"
          id="button-password"
          onClick={() => sendEmail(email)}
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
                <div> Regresar al log in</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
