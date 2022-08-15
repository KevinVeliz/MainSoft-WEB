import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

function Home() {
  const navigate = useNavigate();
  const { signOutUser } = useContext(UserContext);

  return (
    <div>
      <h1>Welcome to MainSoft {window.email}</h1>

      {/* {usuario.rol === "admin" ? navigate("/admin") : navigate("/empleado") } */}

      {/* { useEffect(() => {
                            if (usuario.rol === "admin") 
                                navigate("/admin");
                            else if (usuario.rol === "user")
                                navigate("/empleado");
                        })}
                    */}

      <div className="mt-8 flex flex-col gap-y-4">
        <button
          className="py-2 bg-black text-white text-lg rounded"
          onClick={signOutUser}
        >
          {" "}
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Home;
