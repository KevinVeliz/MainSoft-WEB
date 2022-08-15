import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDay } from "../components/Calendar";
import { CalendarComp } from "../components/Admin/CalendarCom";
import { UserContext } from "../context/UserProvider";
import { db } from "../firebase/FirebaseConfiguration";
import "../styles/Calendar.css";

export const PagePrincipaly = () => {
  const navigate = useNavigate();
  const [rol, setRol] = React.useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    actualizarRol(user.email);
  }, []);

  async function actualizarRol(email) {
    const docRef2 = doc(db, "Roles/" + email);
    const docSnap2 = await getDoc(docRef2);
    rol.push(docSnap2.data().rol);
  }

  const handleClickInicio = () => {
    if (rol[0] === "admin") {
      navigate("/admin");
    } else if (rol[0] === "Empleado") {
      navigate("/empleado");
    } else if (rol[0] === "Gerente") {
      navigate("/manager");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <CalendarComp />
      <div> Page_Principaly </div>
      <div className="mt-8 flex flex-col gap-y-4">
        <button
          onClick={handleClickInicio}
          className="py-2 bg-black text-white text-lg rounded"
        >
          {" "}
          INICIAR SESIÓN{" "}
        </button>
      </div>
    </div>
  );
};
